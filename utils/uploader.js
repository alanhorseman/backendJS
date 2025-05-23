const multer = require('multer')
const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '../public/img')

if(!fs.existsSync(dir)) {
  fs.mkdirSync(dir, {recursive: true})
}

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './public/img')
  },
  filename: function(req, file, cb){
    cb(null, `${Date.now()} - ${file.originalname}`)
  }
})

const uploader = multer({storage})

module.exports = uploader;