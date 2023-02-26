const fs = require('fs')

let screens = fs.readdirSync('./screenshots').map(f => './screenshots/' + f)

let code = JSON.stringify(screens, null, 4)

fs.writeFileSync('./screenshots.js', `let screenshots = ${code}`)
console.log(code);