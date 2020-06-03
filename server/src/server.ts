import express from 'express'

const app = express()

app.get('/', (request, response) => {
  response.json(
    ['Lucas', 'Ferronato']
  )
})
app.get('/users/:id')

app.listen(3333)