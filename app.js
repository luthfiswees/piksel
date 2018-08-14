require('dotenv').config()

const express = require('express')
const multer  = require('multer')
const upload  = multer({dest: 'uploads'});
const app     = express()

const handler = require('./handler/handler')

app.get('/', (req, res) => res.send('Piksel is on. Welcome!'))

app.get('/image', async (req, res) => {
    res.send(handler.getImage(req.query.name));
})

app.get('/diff_image', async () => {
    res.send(handler.getDiff(req.query.name));
})

app.post('/send_image', upload.single('screenshot'), async (req, res) => {
    res.send(handler.sendImage(req.body.name, req.file));
})

app.post('/change_baseline_image', async (req, res) => {
    res.send(handler.changeBaselineImage(req.body.name, req.file));
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))