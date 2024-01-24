import { userService } from "../api/user/user.service";
import { Car } from "../models/car.model";
import { User } from "../models/user.model";
import { getCollection } from "./db.service";
import twilio from 'twilio'
import { getCarsFromYad2Api } from "./yad2-car-api.service";
import loggerService from "./logger.service";
import { reOrderCarDataList } from "./util.service";

const client = twilio(process?.env?.TWILIO_ACCOUNT_SID, process?.env?.TWILIO_AUTH_TOKEN);

async function fetchAndNotify() {
  try {
    // Fetch all activated and subscribed users
    const collection = await getCollection('user');
    const users = await collection.find().toArray();
    const subscribedUsers = users.filter(user => user?.subscription_status === 'active')

    if (!subscribedUsers.length) {
      throw new Error('No subscribed users');
    }
    else {
      for (const user of subscribedUsers) {
        // Fetch the latest car listings from the database
        const latestCarListingsFromApi = await getCarsFromYad2Api(user?.car_preferences_params)
        const latestCarListings = await reOrderCarDataList(latestCarListingsFromApi)
        // Compare preferences and check for new car listings
        const lastNotificationTimestamp = new Date(user?.last_notification_timestamp || user?.createdAt).getTime();
        const newCarListings = latestCarListings.filter((car: Car) => {
          const isNew = +new Date(car.date_added) > lastNotificationTimestamp
          
          if (isNew && car?.feed_source === 'private') {
            return car
          }
        });
        loggerService.info('NEW car listing date added: ', newCarListings);
        if (newCarListings.length) { 
          const msgBody = `${newCarListings.length} new cars matching your preferences waiting for you to see!`
          const imgs = newCarListings.map((car: Car) => car.img_url)
          console.log('msgBody: ', msgBody);
          console.log('imgs: ', imgs);

          // Compare preferences and send notifications for newly added cars
          _sendWhatsAppMessage(user?.phonenumber, msgBody, imgs)
          // Save the updated user document
          const now = Date.now() + (60 * 60 * 2 * 1000)
          await userService.update({ ...user, latest_cars_listing: newCarListings, last_notification_timestamp: new Date(now).toISOString() } as User)

        }
      }

    }
  } catch (error) {
    console.error('Error in fetchAndNotify:', error);
  }
}



async function _sendWhatsAppMessage(phoneNumber: string, message: string, imgs: string[]) {
  try {
    const result = await client.messages.create({
      mediaUrl: imgs,
      body: message,
      from: 'whatsapp:+14155238886', // Twilio sandbox number
      to: `whatsapp:${phoneNumber}`,
    });

    console.log('WhatsApp message sent:', result.sid);
  } catch (error) {
    throw error
  }
}

export {
  fetchAndNotify
}
