// мне за это стыдно, но я захотел это сделать
/* eslint-disable */
export function generateSvgGradient(
  height: number,
  width: number,
  bgColor: string,
  frontColor: string,
  text: string
){
  const textSize = width / (text.length > 2 ? text.length : 2);
  let result = 
    `<svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="Gradient" r="0.8">
          <stop offset="0%" stop-color="${frontColor}"/>
          <stop offset="100%" stop-color="${bgColor}"/>
        </radialGradient>
      </defs>
      <rect x="10" y="10" rx="${ height / 5 }" ry="${ height / 5 }" width="${ width - 20 }" height="${ height - 20 }"
      fill="url(#Gradient)" stroke="gray" stroke-width="1"/>
      <text x="${ width / 2 }" y="${ height / (2 - 0.3 / textSize) }" text-anchor="middle" fill="white" font-family="sans-serif" font-size="${textSize}px">${text}</text>
    </svg>`;
    return result;
}