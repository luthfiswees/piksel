const fs   = require("mz/fs");
let chai   = require('chai');
let expect = chai.expect;

let handler = require('../handler/handler');
let db      = require('../db/db');

describe('Handler', () => {
    before(() =>{
        db.createDatabase(db.dbName);
    })
    after(() => {
        db.dropDatabase(db.dbName);
    })

    it('should be able to receive Image through "sendImage"', async () => {
        await handler.sendImage('ImageA', {imagePath: 'ImageObj'});
        let resp = await db.get('ImageA'); 

        expect(resp.object.data.image.imagePath).to.be.equal('ImageObj');
        expect(resp.object.data.baselineImage.imagePath).to.be.equal('ImageObj');
    })

    it('should be able to send image without changing baseline through "sendImage"', async () => {
        await handler.sendImage('ImageB', {imagePath: 'ImageObj'});
        await handler.sendImage('ImageB', {imagePath: 'ImageObjNew'});
        let resp = await db.get('ImageB');

        expect(resp.object.data.image.imagePath).to.be.equal('ImageObjNew');
        expect(resp.object.data.baselineImage.imagePath).to.be.equal('ImageObj');
    })

    it('should be able to get right image through "getImage"', async () => {
        await handler.sendImage('ImageC', {imagePath: 'ImageObj'});
        let resp = await handler.getImage('ImageC');
        
        expect(resp.object.data.image.imagePath).to.be.equal('ImageObj');
        expect(resp.object.data.baselineImage.imagePath).to.be.equal('ImageObj');
    })

    it('should be able to update baseline for existing image with key "ImageD" using "changeBaselineImage"', async () => {
        await handler.sendImage('ImageD', {imagePath: 'ImageObj'});
        let message = await handler.changeBaselineImage('ImageD', {imagePath: 'ImageObjNew'});
        let resp = await db.get('ImageD');

        expect(resp.object.data.image.imagePath).to.be.equal('ImageObj');
        expect(resp.object.data.baselineImage.imagePath).to.be.equal('ImageObjNew');
        expect(message.message).to.be.equal('Successfully updated baseline image for image with name : ImageD');
    })

    it('should not be able to update non-existing image with key "ImageE" using "changeBaselineImage"', async () => {
        let message = await handler.changeBaselineImage('ImageE', {imagePath: 'ImageObjNew'});

        expect(message.message).to.be.equal('Failed to update baseline image for image with name : ImageE. Image not found');
    })

    it('should be able to generate diff image with "getDiff"', async () => {
        await handler.sendImage('ImageF', {path: 'test/test_image/People2'});
        await handler.sendImage('ImageF', {path: 'test/test_image/People'});
        let resp = await handler.getDiff('ImageF');

        expect(fs.existsSync(resp.diffImagePath)).to.be.equal(true);
    })
})