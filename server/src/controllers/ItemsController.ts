import { Request, Response } from 'express'
import dotenv from 'dotenv'
import cnn from '../database/connection'

dotenv.config()

class ItemsController {
  async index(request: Request, response: Response) {
    const items = await cnn('items').select('*')

    const serializedItems = items.map(item => {
      // DUAS OPÇÕES...
      item.image_url = `${process.env.HOST}/uploads/${item.image}`
      delete item.image

      return item
      // return {
      //   id: item.id
      //   title: item.title,
      //   image_url: `http://localhost:3333/uploads/${item.image}`
      // }
    })

    return response.json(serializedItems)
  }
}
export default ItemsController