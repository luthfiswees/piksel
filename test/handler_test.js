// Library initialization
const fs     = require("mz/fs");
const sinon  = require('sinon');
const chai   = require('chai');
const expect = chai.expect;

const handler = require('../handler/handler');
const compare = require('../compare/compare');
const db      = require('../db/adapters/couch');

// Test Objects
let imageKey  = "success-image"
let imageDiff = {
    imageData: {
        type: "Buffer",
        data: [1, 3, 5, 7, 9, 11]
    },
    misMatchPercentage: 5.33
}
let imageObj  = { 
    name: "success-image_02_53_53.png",
    data: {
        type: "Buffer",
        data: [0, 1, 2, 3, 4, 5],
    },
    encoding: "binary",
    truncated: false,
    mimetype: "image/png",
    md5: "abc123"
}
let imageBaselineObj = { 
    name: "success-image_02_51_51.png",
    data: {
        type: "Buffer",
        data: [1, 2, 3, 4, 5, 6],
    },
    encoding: "binary",
    truncated: false,
    mimetype: "image/png",
    md5: "abc456"
}
let successBody = {
    object: { 
        _id: imageKey, 
        _rev: "2", 
        data: { 
            image: imageObj,
            baselineImage: imageBaselineObj
        }
    },
    status_code: 200
}
let successBaselineBody = {
    object: { 
        _id: imageKey, 
        _rev: "1", 
        data: { 
            image: imageBaselineObj,
            baselineImage: imageBaselineObj
        }
    },
    status_code: 200
}
let failBodyMissing = {
    object: {},
    status_code: "EDOCMISSING"
}
let failBodyUnknown = {
    object: {},
    status_code: "EUNKNOWN"
}

// Test Cases
describe('Handler', () => {
    describe('sendImage', () => {
        it('should be able to store image when image name is unknown', async () => {
            let stubGet   = sinon.stub(db, 'get').resolves(failBodyUnknown)
            let stubStore = sinon.stub(db, 'store').resolves(successBody)

            let result = await handler.sendImage(imageKey, imageObj)

            sinon.assert.calledOnce(stubGet)
            sinon.assert.calledOnce(stubStore)
            sinon.assert.calledWith(stubGet, imageKey)
            sinon.assert.calledWith(stubStore, imageKey, { image: imageObj, baselineImage: imageObj})
            expect(result).to.be.equal(successBody)

            stubGet.restore()
            stubStore.restore()
        })

        it('should not be able to store image when image name is missing', async () => {
            let stubGet   = sinon.stub(db, 'get').resolves(failBodyMissing)
            let stubStore = sinon.stub(db, 'store').resolves(successBody)

            let result = await handler.sendImage(imageKey, imageObj)

            sinon.assert.calledOnce(stubGet)
            sinon.assert.calledOnce(stubStore)
            sinon.assert.calledWith(stubGet, imageKey)
            sinon.assert.calledWith(stubStore, imageKey, { image: imageObj, baselineImage: imageObj})
            expect(result).to.be.equal(successBody)

            stubGet.restore()
            stubStore.restore()
        })

        it('should be able to replace image baseline with new image', async () => {
            let stubGet   = sinon.stub(db, 'get').resolves(successBaselineBody)
            let stubStore = sinon.stub(db, 'store').resolves(successBody)

            let result = await handler.sendImage(imageKey, imageObj)

            sinon.assert.calledOnce(stubGet)
            sinon.assert.calledOnce(stubStore)
            sinon.assert.calledWith(stubGet, imageKey)
            sinon.assert.calledWith(stubStore, imageKey, { image: imageObj, baselineImage: imageBaselineObj})
            expect(result).to.be.equal(successBody)

            stubGet.restore()
            stubStore.restore()
        })
    })

    describe('getImage', () => {
        it('should be able to fetch image if avalaible', async () => {
            let stub = sinon.stub(db, 'get').resolves(successBody)

            let result = await handler.getImage(imageKey)

            sinon.assert.calledOnce(stub)
            sinon.assert.calledWith(stub, imageKey)
            expect(result).to.be.equal(successBody)

            stub.restore()
        })

        it('should be able to display error if image is not avalaible', async () => {
            let stub = sinon.stub(db, 'get').resolves(failBodyUnknown)

            let result = await handler.getImage(imageKey)

            sinon.assert.calledOnce(stub)
            sinon.assert.calledWith(stub, imageKey)
            expect(result).to.be.equal(failBodyUnknown)

            stub.restore()
        })
    })

    describe('getDiff', () => {
        it('should be able to fetch image diff if image is available', async () => {
            let stubGet  = sinon.stub(db, 'get').resolves(successBody)
            let stubDiff = sinon.stub(compare, 'getDiff').returns(imageDiff)

            let result = await handler.getDiff(imageKey)

            sinon.assert.calledOnce(stubGet)
            sinon.assert.calledOnce(stubDiff)
            sinon.assert.calledWith(stubGet, imageKey)
            sinon.assert.calledWith(stubDiff, imageObj.data, imageBaselineObj.data)
            expect(result.format).to.be.equal("Base64")
            expect(result.imageData).to.be.equal(imageDiff.imageData.toString("base64"))
            expect(result.missPercentage).to.be.equal(imageDiff.misMatchPercentage)
            expect(result.message).to.be.equal("Successfully fetch image diff with tag => " + imageKey)
            expect(result.error).to.be.false

            stubGet.restore()
            stubDiff.restore()
        })

        it('should be able to return error if diff with certain name is not available', async () => {
            let stubGet  = sinon.stub(db, 'get').rejects(failBodyMissing)
            let stubDiff = sinon.stub(compare, 'getDiff').returns({ message: "Error"})

            let result = await handler.getDiff(imageKey)

            sinon.assert.calledOnce(stubGet)
            expect(result.message).to.be.equal("Failed to fetch image diff with tag => " + imageKey)
            expect(result.error).to.be.true

            stubGet.restore()
            stubDiff.restore()
        })

        it('should be able to return error if diff function is not able to process the image', async () => {
            let stubGet  = sinon.stub(db, 'get').resolves(successBody)
            let stubDiff = sinon.stub(compare, 'getDiff').returns({ message: "Error"})

            let result = await handler.getDiff(imageKey)

            sinon.assert.calledOnce(stubGet)
            sinon.assert.calledOnce(stubDiff)
            expect(result.message).to.be.equal("Failed to fetch image diff with tag => " + imageKey)
            expect(result.error).to.be.true

            stubGet.restore()
            stubDiff.restore()
        })
    })

    describe('changeBaselineImage', () => {
        it('should be able to change current baseline image', async () => {
            let stubGet   = sinon.stub(db, 'get').resolves(successBaselineBody)
            let stubStore = sinon.stub(db, 'store').resolves(successBody)

            let result = await handler.changeBaselineImage(imageKey, imageObj)

            sinon.assert.calledOnce(stubGet)
            sinon.assert.calledOnce(stubStore)
            sinon.assert.calledWith(stubGet, imageKey)
            sinon.assert.calledWith(stubStore, imageKey, { image: imageBaselineObj, baselineImage: imageObj})
            expect(result.message).to.be.equal("Successfully updated baseline image for image with name : " + imageKey)

            stubGet.restore()
            stubStore.restore()
        })

        it('should be able to return error message if image not found', async () => {
            let stubGet   = sinon.stub(db, 'get').resolves(failBodyMissing)
            let stubStore = sinon.stub(db, 'store')

            let result = await handler.changeBaselineImage(imageKey, imageObj)

            sinon.assert.calledOnce(stubGet)
            sinon.assert.notCalled(stubStore)
            sinon.assert.calledWith(stubGet, imageKey)
            expect(result.message).to.be.equal("Failed to update baseline image for image with name : " + imageKey + ". Image not found")

            stubGet.restore()
            stubStore.restore()
        })

        it('should be able to return error message if image is unknown', async () => {
            let stubGet   = sinon.stub(db, 'get').resolves(failBodyUnknown)
            let stubStore = sinon.stub(db, 'store')

            let result = await handler.changeBaselineImage(imageKey, imageObj)

            sinon.assert.calledOnce(stubGet)
            sinon.assert.notCalled(stubStore)
            sinon.assert.calledWith(stubGet, imageKey)
            expect(result.message).to.be.equal("Failed to update baseline image for image with name : " + imageKey + ". Image not found")

            stubGet.restore()
            stubStore.restore()
        })

        it('should be able to return error message if client request with arbitrary files that is not image', async () => {
            let stubGet   = sinon.stub(db, 'get').returns(new Error("Random Error"))
            let stubStore = sinon.stub(db, 'store')

            let result = await handler.changeBaselineImage(imageKey, imageObj)

            sinon.assert.calledOnce(stubGet)
            sinon.assert.notCalled(stubStore)
            sinon.assert.calledWith(stubGet, imageKey)
            expect(result.message).to.be.equal("Failed to update baseline image for image with name : " + imageKey + ". Unexpected Error.")

            stubGet.restore()
            stubStore.restore()
        })
    })
})