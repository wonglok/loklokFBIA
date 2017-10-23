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
  res.set('Cache-Control', 'public, max-age=60, s-maxage=180')
  res.send(appHTML)
})

exports.app = functions.https.onRequest(app)
