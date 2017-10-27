var functions = require('firebase-functions')
const express = require('express')

const admin = require('./admin').admin

const config = require('./config.js').config
// const convertToFbia = require('article-json-to-fbia')
var Handlebars = require('handlebars')
var articleMetaTag = Handlebars.compile(`
      <meta property="og:type" content="article"/>
      <meta property="og:url" content="${config.blog}/articles/{{ articleID }}" />
`)

var fs = require('fs')
var path = require('path')
var appHTML = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf8')

var getRSS = require('./article.js').getRSS

const app = express()
const cors = require('cors')({origin: true})
app.use(cors)

var getArticle = ({ articleID }) => {
  return new Promise((resolve, reject) => {
    admin.database().ref('/blog-data/articles').child(articleID).once('value').then((snapshot) => {
      resolve(snapshot.val())
    }, () => {
      reject(null)
    })
  })
}

var composeMetaTags = ({ req, res, articleID }) => {
  return new Promise((resolve, reject) => {
    var addon = `
    <meta property="og:type" content="blog"/>
    <meta property="og:url" content="${config.blog}"/>
    `

    function sendTags () {
      resolve(
        `
        <meta property="og:site_name" content="${config.desc}"/>
        <meta property="fb:pages" content="${config.pageID}" />
        ${addon}
        `
      )
    }

    if (articleID) {
      getArticle({ articleID }).then((value) => {
        addon = articleMetaTag({ articleID })
        if (value) {
          addon += `
          <meta property="og:image" content="${value.header.heroImage}"/>
          <meta property="og:title" content="${value.header.title}"/>
          <meta property="og:description" content="${value.description}"/>
          `
        }
        sendTags()
      }, () => {
        sendTags()
      })
    } else {
      sendTags()
    }
  })
}

var composeAppDiv = ({ req, res }) => {
  return new Promise((resolve, reject) => {
    var result = ``
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
  return str
  // return str.replace(
  //   `<html lang=en>`,
  //   `<html lang=en prefix="op: http://media.facebook.com/op#">`
  // )
}

app.get('/rss/prod', (req, res) => {
  res.type('rss')
  getRSS({ req, res }).then((rss) => {
    res.send(rss)
  })
})

app.get('/rss/dev', (req, res) => {
  res.type('rss')
  getRSS({ req, res }).then((rss) => {
    res.send(rss)
  })
})

// firebase hosting
app.get('/.well-known/acme-challenge/oB0iXwyzRXSMJgpcVD5zseEINNhOu4J9bnK-nRRFWBk', (req, res) => {
  var confirmCode = fs.readFileSync(path.resolve(__dirname, './code/oB0iXwyzRXSMJgpcVD5zseEINNhOu4J9bnK-nRRFWBk'), 'utf8')
  res.send(confirmCode)
})

app.get('/articles/:articleID', (req, res) => {
  Promise.all([
    composeMetaTags({ req, res, articleID: req.params.articleID }),
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
