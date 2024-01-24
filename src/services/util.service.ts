import { Car } from "../models/car.model";

async function reOrderCarDataList(data: any[]) {
    const carList = data.map(dataObj => {
      const items = dataObj?.data?.feed?.feed_items as Car[]
      return items
    })
    console.log(carList);
    
    return [...carList[0], ...carList[1], ...carList[2]] as Car[]
}

export {
  reOrderCarDataList
}
