import sharp from 'sharp'
import { mkdirSync } from 'fs'

mkdirSync('./public/icons', { recursive: true })

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="100" fill="#0A1628"/>
  <path d="M100 130 L256 382 L412 130" stroke="#1D9E75" stroke-width="52" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M160 130 L256 310 L352 130" stroke="rgba(93,202,165,0.6)" stroke-width="36" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`

const buf = Buffer.from(svg)

await sharp(buf).resize(192, 192).png().toFile('./public/icons/icon-192.png')
console.log('icon-192.png created')

await sharp(buf).resize(512, 512).png().toFile('./public/icons/icon-512.png')
console.log('icon-512.png created')

console.log('Icons generated!')
