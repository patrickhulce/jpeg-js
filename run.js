const fs = require('fs')
const jpeg = require ('./index')
const turbo = require('jpeg-turbo')
const asm = require('jpeg-asm')
// const decode = jpeg.decode
// const decode = require('./new-decode')
// const decode = buf => turbo.decompressSync(buf,{format: turbo.FORMAT_RGB})
const decode = buf => asm.decode(buf)
const inkjet = require('inkjet')
const buffer = fs.readFileSync('skater-2.jpg')
const imageData = decode(buffer)
imageData.data = new Uint8Array(imageData.buffer)

const otherImageData = jpeg.decode(buffer)

const CHANNELS = 3
// console.log(imageData.data.slice(0, 30).join(','))
// inkjet.decode(buffer, (err, imageData) => {
  // if (err) {
  //   console.error(err)
  //   return;
  // }
// for (let j = 87; j < 90; j++) {
//   const row = []
//   for (let i = 158; i < 170; i++) {
//     const position = j * imageData.width + i
//     row.push(`${imageData.data[position * CHANNELS]}/${imageData.data[position * CHANNELS + 1]}/${imageData.data[position * CHANNELS + 2]}`)
//   }
//   console.log(j, ' - ', row.join(','))
// }

let count = 0
const diffs = []
for (let j = 0; j < imageData.height; j++) {
  for (let i = 0; i < imageData.width; i++) {
    const positionA = (j * imageData.width + i) * CHANNELS
    const positionB = (j * imageData.width + i) * 4
    const valA = imageData.data[positionA]
    const valB = otherImageData.data[positionB]
    const diff = Math.abs(valA - valB)
    if (diff > 0) {
      console.log('it is diff!!', {i,j, valA, valB})
      diffs.push(diff)
      count++
    }
  }
}

console.log('total', 100 * count / (imageData.height * imageData.width))
console.log(diffs.reduce((x, y) => x + y, 0) / diffs.length, 'avg')
// })
