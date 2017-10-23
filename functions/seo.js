var functions = require('firebase-functions')
// const admin = require('./admin').admin
const express = require('express')

const config = require('./config.js')

var fs = require('fs')
var path = require('path')
var appHTML = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf8')

const app = express()
const cors = require('cors')({origin: true})
app.use(cors)

var adapter = ({ req, res }) => {
  return new Promise((resolve, reject) => {
    //

    resolve(
      fbia(config.pageID)
    )
    //
  })
}

var fbia = (pageID) => {
  return `<meta property="fb:pages" content="${pageID}" />`
}

var metaEntry = (str, newStr) => {
  return str.replace(`<meta name=loklokfbia content=12345>`, newStr)
}

app.get('*', (req, res) => {
  // res.set('Cache-Control', 'public, max-age=60, s-maxage=180')

  adapter({ req, res })
    .then((metatags) => {
      return metaEntry(appHTML, metatags)
    })
    .then((processedString) => {
      res.send(processedString)
    })
})

exports.app = functions.https.onRequest(app)
