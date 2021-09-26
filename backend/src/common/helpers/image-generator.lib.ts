// мне за это стыдно, но я захотел это сделать

import sharp from 'sharp';
import { PNG } from 'pngjs';

const PRETTY_COLORS = [
  { bg: '#E84B54', font: 'white' },
  { bg: '#3CAA37', font: 'white' },
  { bg: '#21509E', font: 'white' },
  { bg: '#262A5A', font: 'white' },
  { bg: '#F9D71E', font: 'black' },
  { bg: '#21262C', font: 'white' },
  { bg: '#E30C4F', font: 'white' },
  { bg: '#E84B54', font: 'white' },
];

/* eslint-disable */
export function generateSvgGradient(
  width: number,
  height: number,
  bgColor: string,
  frontColor: string,
  text: string,
  fontColor = 'white',
) {
  const textSize = width / (text.length > 2 ? text.length : 2);
  let result = `<svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="Gradient" r="0.8">
          <stop offset="0%" stop-color="${frontColor}"/>
          <stop offset="100%" stop-color="${bgColor}"/>
        </radialGradient>
      </defs>
      <rect x="5" y="5" rx="${height / 2}" ry="${height / 2}" width="${
    width - 10
  }" height="${height - 10}"
      fill="url(#Gradient)" stroke="gray" stroke-width="1"/>
      <text x="${width / 2}" y="${
    height / 1.6
  }" text-anchor="middle" fill="${fontColor}" font-family="sans-serif" font-size="${textSize}px">${text}</text>
    </svg>`;
  return result;
}

export function generateImage(
  width: number,
  height: number,
  bgColor: string,
  frontColor: string,
  text: string,
  format: keyof sharp.FormatEnum,
  fontColor?: string,
) {
  const svg = generateSvgGradient(
    width,
    height,
    bgColor,
    frontColor,
    text,
    fontColor,
  );
  const image = sharp(Buffer.from(svg));

  return image.toFormat(format);
}

export function generateRandomBgImage(
  width: number,
  height: number,
  text: string,
  format: keyof sharp.FormatEnum,
) {
  const randomIndex = Math.round(Math.random() * (PRETTY_COLORS.length - 1));
  const randomColor = PRETTY_COLORS[randomIndex];

  const svg = generateSvgGradient(
    width,
    height,
    randomColor.bg,
    randomColor.bg,
    text,
    randomColor.font,
  );
  const image = sharp(Buffer.from(svg));

  return image.toFormat(format);
}

export function generateRandomBgImage2(
  width: number,
  height: number,
  format: keyof sharp.FormatEnum,
) {
  var png = new PNG({
    width: width,
    height: height,
    filterType: -1,
  });

  const randomIndex = Math.round(Math.random() * 255);
  const randomColor1 = Math.round(Math.random() * 255);
  const randomColor2 = Math.round(Math.random() * 255);

  for (var y = 0; y < png.height; y++) {
    for (var x = 0; x < png.width; x++) {
      var idx = (png.width * y + x) << 2;
      png.data[idx] = randomColor1; // red
      png.data[idx + 1] = randomIndex ^ (y + (x ^ randomIndex)); // green
      png.data[idx + 2] = randomColor2; // blue
      png.data[idx + 3] = 255; // alpha (0 is transparent)
    }
  }
  var options = { colorType: 6 };
  const image = sharp(Buffer.from(PNG.sync.write(png, options)));

  return image.toFormat(format);
}
