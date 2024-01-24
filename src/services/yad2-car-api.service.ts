import fetch from 'node-fetch'

async function getCarsFromYad2Api(carPreferencesParams: string | null): Promise<unknown[]> {
    try {
        const BASE_API_URL = process?.env?.YAD2_CARS_API ?? ""
        const responses = [fetch(`${BASE_API_URL}?${carPreferencesParams || ''}&Order=1&page=1`), fetch(`${BASE_API_URL}?${carPreferencesParams || ''}&Order=1&page=2`), fetch(`${BASE_API_URL}?${carPreferencesParams || ''}&Order=1&page=3`)]
        const data = await Promise.all(responses)
        return await Promise.all(data.map(res => res.json()))
    } catch (err) {
        throw err
    }
}

export {
    getCarsFromYad2Api 
}