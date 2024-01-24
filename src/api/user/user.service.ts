import { ObjectId } from "mongodb";
import { CarPreferences } from "../../models/car.model";
import { User } from "../../models/user.model";
import { getCollection } from "../../services/db.service";
import { getCarsFromYad2Api } from "../../services/yad2-car-api.service";
import { reOrderCarDataList } from "../../services/util.service";

export const userService = {
    query,
    getById,
    register,
    update
};

async function query() {
    try {
        const cars = await getCarsFromYad2Api('manufacturer=1,7,15,17')
        console.log(cars);

        const collection = await getCollection('user');
        const users = await collection.find().toArray();
        return users as User[]
    } catch (err) {
        throw err;
    }
}

async function getById(userId: ObjectId | string) {
    try {
        const collection = await getCollection('user');
        const user = await collection.findOne({ _id: new ObjectId(userId) });
        return user;
    } catch (err) {
        throw err;
    }
}

async function register(phonenumber: string, carPreferencesParams: string | null) {

    if (!phonenumber)
    // front handles field requirements
    {
        throw new Error('phone are required!');
    }
    try {
        const promisedCars = await getCarsFromYad2Api(carPreferencesParams)
        const cars = await reOrderCarDataList(promisedCars)
        return _add(
            {
                phonenumber,
                car_preferences_params: carPreferencesParams,
                latest_cars_listing: JSON.stringify(cars),
                subscription_status: 'active',
                createdAt: new Date().toUTCString(),
                last_notification_timestamp: null
            }
        );

    } catch (error) {
        throw error
    }

}

async function update(user: User) {
	try {
		// peek only updatable fields!
		const userToSave:  User = {
			phonenumber: user.phonenumber,
            subscription_status: user.subscription_status,
            car_preferences_params: user.car_preferences_params,
            latest_cars_listing: user.latest_cars_listing,
            last_notification_timestamp: user.last_notification_timestamp,
            createdAt: user.createdAt
		};
		const collection = await getCollection('user');
		await collection.updateOne(
			{ _id: new ObjectId(user._id) },
			{ $set: userToSave }
		);
		userToSave._id = new ObjectId(user._id);
		return userToSave;
	} catch (err) {
		throw err;
	}
}

async function _add(user: User) {
    try {
        // peek only updatable fields!
        const { phonenumber, car_preferences_params, subscription_status, createdAt, last_notification_timestamp, latest_cars_listing } = user
        const userToAdd = {
            phonenumber,
            car_preferences_params,
            subscription_status,
            createdAt,
            last_notification_timestamp,
            latest_cars_listing
        };
        const collection = await getCollection('user');
        await collection.insertOne(userToAdd);
        return userToAdd;
    } catch (err) {
        throw err;
    }
}
