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
      `<meta property="fb:pages" content="${config.pageID}" />`
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
            content: 'This is the text and ',
            href: null,
            italic: false,
            bold: false
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
        embedType: 'youtube',
        youtubeId: 'eBYFOJxZx4Q',
        caption: [{
          type: 'text',
          content: 'Here\'s a video from ',
          href: null,
          italic: false,
          bold: false
        }, {
          type: 'text',
          content: 'mic.com',
          href: 'http://www.mic.com',
          italic: true,
          bold: false
        }]
      }
    ]

    resolve(
      convertToFbia(articleJSON)
    )
  })
}

var metaReplacer = (str, newStr) => {
  return str.replace(`<meta name=loklokfbia content=12345>`, newStr)
}
var appDivReplacer = (str, newStr) => {
  return str.replace(`<div id=app></div>`, `
    <div id="app">
      ${newStr}
    </div>
  `)
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
