import { Request, Response } from 'express'
import cnn from '../database/connection'

class ItemsController {
  async index(request: Request, response: Response) {
    const items = await cnn('items').select('*')

    const serializedItems = items.map(item => {
      // DUAS OPÇÕES...
      item.image_url = `http://localhost:3333/uploads/${item.image}`
      // delete item.id
      item.image = undefined
      return item
      // return {
      //   title: item.title,
      //   image_url: `http://localhost:3333/uploads/${item.image}`
      // }
    })

    return response.json(serializedItems)
  }
}
export default ItemsController