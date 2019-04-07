require('dotenv').config()

const app  = require('./app/app').app
const port = process.env.PIKSEL_PORT

app.listen(port, () => console.log('Example app listening on port ' + port))