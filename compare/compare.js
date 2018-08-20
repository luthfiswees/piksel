const compareImages = require('resemblejs/compareImages');
const fs = require("mz/fs");

async function getDiff(imagePath, baselinePath){
    const options = {
        output: {
            errorColor: {
                red: 255,
                green: 0,
                blue: 255
            },
            errorType: 'movement',
            transparency: 0.3,
            largeImageThreshold: 1200,
            useCrossOrigin: false,
            outputDiff: true
        },
        scaleToSameSize: true,
        ignore: ['nothing', 'less', 'antialiasing', 'colors', 'alpha'],
    };

    const data = await compareImages(
        await fs.readFile(baselinePath),
        await fs.readFile(imagePath),
        options
    );

    await fs.writeFile(imagePath + '_diff', data.getBuffer());
}

async function deleteImage(imagePath){
    let rootDir = process.cwd();
    try {
        await fs.unlinkSync(rootDir + '/' + imagePath);
    } catch (error) {
        console.log("Failed to delete Image on " + imagePath);
    }
}

module.exports = {
    getDiff,
    deleteImage,
}