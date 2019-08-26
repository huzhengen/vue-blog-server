let shajs = require('sha.js')

function hash(str){
  return shajs('sha256').update(str).digest('hex')
}

module.exports = hash