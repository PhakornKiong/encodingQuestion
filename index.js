const fs = require('fs');
// Partial Result, Less parsing of multiple Header & Encoded Text
// Which is easy with just another loop
// Highly unoptimized version

// Convert decimal to string represented binary with the correct padding
function toBinaryString(dec, digit) {
  return (dec >>> 0).toString(2).padStart(digit, 0);
}

// Binary Sequence is always 2^N - 1
function buildDict(headerText) {
  const res = {};
  let n = 0
  digit = 0
  for (i = 0; i < headerText.length; i++) {
    if (2 ** digit - 1 === n) {
      digit++
      n = 0
    }
    const key = toBinaryString(n, digit)
    res[`${key}`] = headerText[i]
    n++

  }
  return res
}

const text = fs.readFileSync('./input.txt', 'utf8');

// Diff OS have diff return
const CARRIAGE_RETURN = '\r\n'

const textArr = text.split(CARRIAGE_RETURN)
let n = 0
const output = [];
const header = textArr[n++];
const textDict = buildDict(header)
console.log(textDict)

// Extract Encoded Text
let encodeBool = true;
let encodeText = ""
while (encodeBool && textArr[n]) {
  encodeText = encodeText.concat(textArr[n]);
  encodeBool = textArr[n].endsWith('000') ? false : true
  n++
}


let parseEncodeText = true;
let step = 3
let parsedStep = 0
let pointer = 0

// Outer loop for getting starter
// Inner loop for parsing char and check endpoint
while (parseEncodeText && pointer < encodeText.length) {
  let parseStage = true
  parsedStep = parseInt(encodeText.substring(pointer, pointer + step), 2)
  pointer += step;
  while (parseStage && parsedStep) {
    const char = encodeText.substring(pointer, pointer + parsedStep)
    // Check endpoint based on numbers of "1" in parsedStep
    let numOfOnes = (char.match(/1/g) || []).length
    if (numOfOnes == parsedStep) {
      parseStage = false;
      pointer += parsedStep
      break;
    }
    output.push(char)
    pointer += parsedStep
  }

}
console.log(output)
let resultString = ""
output.forEach((key) => {
  resultString = resultString.concat(textDict[key])
})
console.log(resultString)