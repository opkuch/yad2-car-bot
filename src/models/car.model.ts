import { ObjectId } from "mongodb"

export interface Car {
    id: string 
    manufacturer: string
    year: number
    model: string
    hand_text: string
    date_added: Date | string
    last_updated: Date | string
    price: string
    img_url: string
    city: string
    feed_source: string
}

export interface CarPreferences {
    manufacturer: string
    model?: string
    year?: string
    price?: string
    area?: string
}

export interface CarListing {
    items: Car[],
    subscriber_ids: ObjectId[]
}

// manufacturer=1,7,15,17&model=5,4,1687,1468,1593,1270,1,1792,6,3908,3571,1628,2526,93,94,95,96,1346,4027,4008,567,1680,3951,2673,105,104&year=2001-2010&price=500-90000&area=25,101,2,70&forceLdLoad=true