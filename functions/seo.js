var functions = require('firebase-functions')
// const admin = require('./admin').admin
const express = require('express')

const config = require('./config.js').config
const convertToFbia = require('article-json-to-fbia')

var fs = require('fs')
var path = require('path')
var appHTML = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf8')

const app = express()
const cors = require('cors')({origin: true})
app.use(cors)

var composeMetaTags = ({ req, res }) => {
  return new Promise((resolve, reject) => {
    //
    resolve(
      fbiaMetaTags(config.pageID)
    )
    //
  })
}

var composeAppDiv = ({ req, res }) => {
  return new Promise((resolve, reject) => {
    var articleJSON = [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            content: 'This is the text and '
          },
          {
            type: 'text',
            bold: true,
            content: 'some bold text '
          },
          {
            type: 'text',
            href: 'http://example.com',
            content: 'some link'
          }
        ]
      },
      {
        type: 'embed',
        embedType: 'image',
        src: 'http://example/image.jpg',
        width: 300,
        height: 150
      }
    ]

    resolve(
      fbiaContent(
        convertToFbia(articleJSON)
      )
    )
    //
  })
}

var fbiaMetaTags = (pageID) => {
  return `<meta property="fb:pages" content="${pageID}" />`
}
var fbiaContent = (content) => {
  return content
}

var metaReplacer = (str, newStr) => {
  return str.replace(`<meta name=loklokfbia content=12345>`, newStr)
}
var appDivReplacer = (str, newStr) => {
  return str.replace(`<div id=app></div>`, newStr)
}

app.get('*', (req, res) => {
  // res.set('Cache-Control', 'public, max-age=60, s-maxage=180')
  Promise.all([
    composeMetaTags({ req, res }),
    composeAppDiv({ req, res })
  ])
    .then((promises) => {
      var result = appHTML
      result = metaReplacer(result, promises[0])
      result = appDivReplacer(result, promises[1])
      return result
    })
    .then((processedString) => {
      res.send(processedString)
    })
})

exports.app = functions.https.onRequest(app)
