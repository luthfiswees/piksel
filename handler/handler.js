const db      = require('../db/db');
const compare = require('../compare/compare'); 

async function sendImage(name, newImage) {
    let image         = await db.get(name);
    let imageNotFound = ((image.status_code == 'EDOCMISSING') || (image.status_code == 'EUNKNOWN'));
    let result        = {}
    
    if (imageNotFound) {
        result = await db.store(name, {image: newImage, baselineImage: newImage});
    } else {
        result = await db.store(name, {image: newImage, baselineImage: image.object.data.baselineImage});
    }

    return result;
}

async function getImage(name) {
    return await db.get(name);
}

async function getDiff(name) {
    let result = {}

    try {
        let image               = await db.get(name);
        let imageBuffer         = image.object.data.image.data;
        let baselineImageBuffer = image.object.data.baselineImage.data;

        let diffImage           = await compare.getDiff(imageBuffer, baselineImageBuffer);
        let diffImageBuffer     = diffImage['imageData'];
        let diffImagePercentage = diffImage['misMatchPercentage'];

        result = {
            format: "Base64",
            imageData: diffImageBuffer.toString('base64'),
            missPercentage: diffImagePercentage,
            message: "Successfully fetch image diff with tag => " + name,
            error: false
        };
    } catch (err) {
        result = {
            message: "Failed to fetch image diff with tag => " + name,
            error: true
        }
    }

    return result
}

async function changeBaselineImage(name, newBaselineImage) {
    let result     = {}

    try {
        let image      = await db.get(name);
        let imageFound = !((image.status_code == 'EDOCMISSING') || (image.status_code == 'EUNKNOWN'));

        if (imageFound){
            await db.store(name, {image: image.object.data.image, baselineImage: newBaselineImage});
            result = {message: "Successfully updated baseline image for image with name : " + name};
        } else {
            result = {message: "Failed to update baseline image for image with name : " + name + ". Image not found"};
        }
    } catch (err) {
        result = {message: "Failed to update baseline image for image with name : " + name + ". Unexpected Error."};
    }

    return result;
}

module.exports = {
    sendImage,
    getImage,
    getDiff,
    changeBaselineImage
}