import { ObjectId } from "mongodb"
import { Car } from "./car.model"

export interface User {
    _id?: ObjectId | string
    phonenumber: string
    subscription_status: string
    car_preferences_params: string | null
    latest_cars_listing: string | Car[]
    last_notification_timestamp: Date | string | null
    createdAt: Date | string
}