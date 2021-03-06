const compareImages = require('resemblejs/compareImages');

async function getDiff(imageBuffer, baselineBuffer){
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
        ignore: "antialiasing"
    };

    const data = await compareImages(
        Buffer.from(baselineBuffer),
        Buffer.from(imageBuffer),
        options
    );

    return {
        imageData: data.getBuffer(),
        misMatchPercentage: data['misMatchPercentage']
    };
}

module.exports = {
    getDiff
}