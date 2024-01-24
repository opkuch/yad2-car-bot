import fetch from 'node-fetch'
import { Car } from '../models/car.model'

async function getCarsFromYad2Api(carPreferencesParams: string | null): Promise<Car[]> {
    try {
        const BASE_API_URL = process?.env?.YAD2_CARS_API ?? ""
        const res = await fetch(`${BASE_API_URL}?${carPreferencesParams || ''}`)
        const data = await res.json() as { data: { feed: { feed_items: Car[] } } }
        return data.data.feed.feed_items.slice(3)
    } catch (err) {
        throw err
    }
}

export {
    getCarsFromYad2Api 
}