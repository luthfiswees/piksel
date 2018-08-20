require('dotenv').config()

const express = require('express')
const multer  = require('multer')
const upload  = multer({dest: 'uploads'});
const app     = express()

const handler = require('./handler/handler')

app.get('/', (req, res) => res.send('Piksel is on. Welcome!'))

app.get('/image', async (req, res) => {
    res.send(await handler.getImage(req.query.name));
})

app.get('/diff_image', async (req, res) => {
    res.send(await handler.getDiff(req.query.name));
})

app.post('/send_image', upload.single('screenshot'), async (req, res) => {
    res.send(await handler.sendImage(req.body.name, req.file));
})

app.post('/change_baseline_image', upload.single('screenshot'), async (req, res) => {
    res.send(await handler.changeBaselineImage(req.body.name, req.file));
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))