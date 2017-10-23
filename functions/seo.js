var functions = require('firebase-functions')
// const admin = require('./admin').admin
const express = require('express')

var fs = require('fs')
var path = require('path')
var appHTML = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf8')

const app = express()
const cors = require('cors')({origin: true})
app.use(cors)

app.get('*', (req, res) => {
  // res.set('Cache-Control', 'public, max-age=60, s-maxage=180')

  var result = appHTML
  result.replace('<meta name=loklokfbia content=12345>', '<meta name=loklokfbia content=45678>')

  res.send(result)
})

exports.app = functions.https.onRequest(app)
