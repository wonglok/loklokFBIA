var functions = require('firebase-functions')
// const admin = require('./admin').admin
const express = require('express')

const config = require('./config.js').config
// const convertToFbia = require('article-json-to-fbia')
var Handlebars = require('handlebars')

var fs = require('fs')
var path = require('path')
var appHTML = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf8')

var articleHB = fs.readFileSync(path.resolve(__dirname, './templates/sample.handlebars'), 'utf8')
var articleTemplate = Handlebars.compile(articleHB)

var rssHB = fs.readFileSync(path.resolve(__dirname, './templates/rss.handlebars'), 'utf8')
var rssTemplate = Handlebars.compile(rssHB)

const app = express()
const cors = require('cors')({origin: true})
app.use(cors)

var composeMetaTags = ({ req, res }) => {
  return new Promise((resolve, reject) => {
    //
    resolve(
      `
      <meta property="fb:pages" content="${config.pageID}" />
      <link rel="canonical" href="http://loklok-fbia.firebaseapp.com">
      <meta property="op:markup_version" content="v1.0">
      `
    )
    //
  })
}

var composeAppDiv = ({ req, res }) => {
  return new Promise((resolve, reject) => {
    var result = ``

    // result = articleTemplate({
    //   title: 'title haha',
    //   subtitle: 'subittle haha'
    // })

    resolve(
      result
    )
  })
}

var headerReplacer = (str, newStr) => {
  return str.replace(`<meta name=loklokfbia content=12345>`, newStr)
}
var appDivReplacer = (str, newStr) => {
  return str.replace(`<div id=app></div>`, `
    <div id="app">
      ${newStr}
    </div>
  `)
}

var htmlTagReplacer = (str) => {
  return str.replace(
    `<html lang=en>`,
    `<html lang=en prefix="op: http://media.facebook.com/op#">`
  )
}

app.get('/rss/dev', (req, res) => {
  res.type('rss')
  res.send(rssTemplate({
  }))
})

app.get('*', (req, res) => {
  // res.set('Cache-Control', 'public, max-age=60, s-maxage=180')
  Promise.all([
    composeMetaTags({ req, res }),
    composeAppDiv({ req, res })
  ])
    .then((promises) => {
      var result = appHTML
      result = htmlTagReplacer(result)
      result = headerReplacer(result, promises[0])
      result = appDivReplacer(result, promises[1])
      return result
    })
    .then((processedString) => {
      res.send(processedString)
    })
    .catch(() => {
      res.send(appHTML)
    })
})

exports.app = functions.https.onRequest(app)
