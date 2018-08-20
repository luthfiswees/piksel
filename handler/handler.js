const db      = require('../db/db');
const compare = require('../compare/compare'); 

async function sendImage(name, newImage) {
    let image         = await db.get(name);
    let imageNotFound = ((image.status_code == 'EDOCMISSING') || (image.status_code == 'EUNKNOWN'));
    let result        = {}
    
    if (imageNotFound) {
        result = await db.store(name, {image: newImage, baselineImage: newImage});
    } else {
        let oldImagePath         = image.object.data.image.path;
        let oldBaselineImagePath = image.object.data.baselineImage.path;

        result = await db.store(name, {image: newImage, baselineImage: image.object.data.baselineImage});
        if (oldImagePath !== oldBaselineImagePath) {
            await compare.deleteImage(oldImagePath);
        }
    }

    return result;
}

async function getImage(name) {
    return await db.get(name);
}

async function getDiff(name) {
    let image             = await db.get(name);
    let imagePath         = image.object.data.image.path;
    let baselineImagePath = image.object.data.baselineImage.path;

    await compare.getDiff(imagePath, baselineImagePath);

    return {
        diffImagePath : imagePath + '_diff'
    };
}

async function changeBaselineImage(name, newBaselineImage) {
    let image      = await db.get(name);
    let imageFound = !((image.status_code == 'EDOCMISSING') || (image.status_code == 'EUNKNOWN'));
    let result     = {}

    if (imageFound){
        let oldImagePath         = image.object.data.image.path;
        let oldBaselineImagePath = image.object.data.baselineImage.path;

        await db.store(name, {image: image.object.data.image, baselineImage: newBaselineImage});
        if (oldImagePath !== oldBaselineImagePath) {
            await compare.deleteImage(oldBaselineImagePath);
        }
        
        result = {message: "Successfully updated baseline image for image with name : " + name};
    } else {
        result = {message: "Failed to update baseline image for image with name : " + name + ". Image not found"};
    }

    return result;
}

module.exports = {
    sendImage,
    getImage,
    getDiff,
    changeBaselineImage
}