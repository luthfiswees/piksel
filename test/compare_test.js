const fs      = require("mz/fs");
const compare = require('../compare/compare');
const chai    = require('chai');
const expect  = chai.expect;

describe('Image Comparison', () => {
  it('should be able to compare two images', async () => {
    let imageBufferFirst  = await fs.readFile('test/test_image/People2');
    let imageBufferSecond = await fs.readFile('test/test_image/People');

    let result = await compare.getDiff(imageBufferFirst, imageBufferSecond)

    expect(result.misMatchPercentage).to.be.equal('5.83')
    expect(result.imageData).instanceOf(Buffer)
  })
})