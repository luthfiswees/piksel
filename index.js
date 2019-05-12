require('dotenv').config()

const express    = require('express')
const fileUpload = require('express-fileupload');
const app        = express()

const db      = require('./db/adapters/couch')
const handler = require('./handler/handler')
const port    = process.env.PIKSEL_PORT

db.createDatabase(db.dbName);
app.use(fileUpload());

app.get('/', (req, res) => res.send('Piksel is on. Welcome!'))

app.get('/image', async (req, res) => {
    res.send(await handler.getImage(req.query.name));
})

app.get('/diff_image', async (req, res) => {
    res.send(await handler.getDiff(req.query.name));
})

app.post('/send_image', async (req, res) => {
    res.send(await handler.sendImage(req.body.name, req.files.screenshot));
})

app.post('/change_baseline_image', async (req, res) => {
    res.send(await handler.changeBaselineImage(req.body.name, req.files.screenshot));
})

app.listen(port, () => console.log('Example app listening on port ' + port))