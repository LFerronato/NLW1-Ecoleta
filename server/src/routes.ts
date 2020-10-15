import express from 'express'

import multer from 'multer'
import multerConfig from './config/multer'

import PointsController from './controllers/PointsController'
const pointsController = new PointsController()

import ItemsController from './controllers/ItemsController'
const itemsController = new ItemsController()

const routes = express.Router()
const upload = multer(multerConfig)


routes
  .get('/items', itemsController.index)

  // .post('/points', upload.array('fotos'), pointsController.create)
  .post('/points', upload.single('image'), pointsController.create)

  .get('/points', pointsController.index)
  .get('/points/:id', pointsController.show)

export default routes