const config = require('./config.js').config
const admin = require('./admin').admin

var fs = require('fs')
var path = require('path')
var Handlebars = require('handlebars')

var articleHB = fs.readFileSync(path.resolve(__dirname, './templates/article.handlebars'), 'utf8')
var articleTemplate = Handlebars.compile(articleHB)

var rssHB = fs.readFileSync(path.resolve(__dirname, './templates/rss.handlebars'), 'utf8')
var rssTemplate = Handlebars.compile(rssHB)

Handlebars.registerPartial('FigureImage', fs.readFileSync(path.resolve(__dirname, './templates/image.handlebars'), 'utf8'))
Handlebars.registerPartial('EmbedYoutube', fs.readFileSync(path.resolve(__dirname, './templates/youtube.handlebars'), 'utf8'))
Handlebars.registerPartial('SlideShow', fs.readFileSync(path.resolve(__dirname, './templates/slideshow.handlebars'), 'utf8'))
Handlebars.registerPartial('Paragraph', fs.readFileSync(path.resolve(__dirname, './templates/paragraph.handlebars'), 'utf8'))
Handlebars.registerPartial('Poster', fs.readFileSync(path.resolve(__dirname, './templates/poster.handlebars'), 'utf8'))

// function getArticleObj () {
//   return {
//     // logo depends on styler
//     // https://picsum.photos/690/132/?image=18
//     style: 'instapress',
//     articleID: '-9x9c8d09asf809d8a09sd',
//     header: {
//       heroImage: 'https://picsum.photos/200/300/?random',
//       heroCaption: 'Lok Header image description becomes visible when image has been tapped and expanded.',
//       kicker: 'Having fun all the timez',
//       title: 'LOK Instant Articles',
//       subtitle: 'LOk Get familiar with your new storytelling tools. Make your media come alive, and keep readers coming back for more',
//       authorPage: 'http://facebook.com/okwealthy',
//       authorName: 'okWealthy',
//       publishDate: new Date().toISOString(),
//       modifyDate: new Date().toISOString()
//     },
//     body: [
//       {
//         typeIsEmbedYoutube: true,
//         youtube: 'https://www.youtube.com/embed/M7lc1UVf-VE'
//       },
//       // {
//       //   typeIsEmbedCodePen: true,
//       //   codepen: 'https://codepen.io/wonglok/embed/xXEewp/?height=315&theme-id=0&default-tab=result&embed-version=2'
//       // },
//       {
//         typeIsFigureImage: true,
//         image: 'https://picsum.photos/1024/1024/?random',
//         caption: 'image caption fun fun fun'
//       },
//       {
//         typeIsParagraph: true,
//         text: `1happy happy happy happy happy happy happy happy happy happy happy happy happy happy `
//       },
//       {
//         typeIsParagraph: true,
//         text: `2happy happy happy happy happy happy happy happy happy happy happy happy happy happy `
//       },
//       {
//         typeIsParagraph: true,
//         text: `3happy happy happy happy happy happy happy happy happy happy happy happy happy happy `
//       },
//       {
//         typeIsPoster: true,
//         image: 'https://picsum.photos/1024/1024/?random',
//         toptitle: 'happy happy',
//         subtitle: 'sub-title text is fun fun fun fun',
//         credit: 'credit text is funz'
//       },
//       {
//         typeIsSlideShow: true,
//         images: [
//           { image: 'https://picsum.photos/1080/1520/?random' },
//           { image: 'https://picsum.photos/1080/1520/?random' },
//           { image: 'https://picsum.photos/1080/1520/?random' },
//           { image: 'https://picsum.photos/1080/1520/?random' },
//           { image: 'https://picsum.photos/1080/1520/?random' }
//         ],
//         caption: {
//           text: 'This is the caption',
//           attribution: 'Attribution of credit'
//         }
//       }
//     ]
//   }
// }

function getArticleHTML (data) {
  // inject blog url for canonical
  data.blogURL = config.blog
  return articleTemplate(
    data
  )
}

function getArticleDataForRSS (article) {
  return {
    title: article.header.title,
    link: `${config.blog}` + '/articles/' + article.articleID,
    guid: article.guid,
    publishDate: article.header.publishDate,
    author: article.header.authorName,
    description: article.description,
    html: getArticleHTML(article)
  }
}

function getArticlesStructure (articles) {
  articles = articles || []
  return articles.map((item) => {
    return getArticleDataForRSS(item)
  })
}

function transform (obj) {
  var bucket = []
  var keys = Object.keys(obj)
  for (var i = 0; i < keys.length; i++) {
    let newItem = {
      '.key': keys[i]
    }
    newItem = Object.assign(newItem, obj[keys[i]])

    if (newItem.readyToPublish) {
      bucket.push(newItem)
    }
  }
  return bucket
}

var blogsData = admin.database().ref('/blog-data/articles')
var blogMetaData = admin.database().ref('/blog-meta')

function getBlogMetaData () {
  return new Promise((resolve, reject) => {
    blogMetaData.once('value').then((snapshot) => {
      resolve(snapshot.val())
    })
  })
}

function getBlogsData () {
  return new Promise((resolve, reject) => {
    blogsData.limitToLast(100).once('value').then((snapshot) => {
      var articles = transform(snapshot.val() || {})
      resolve(articles)
    })
  })
}

exports.getRSS = ({ req, res }) => {
  return new Promise((resolve, reject) => {
    var data = {
      lastRefreshDate: new Date().toISOString(),
      articles: [
        // getArticleObj()
      ]
    }

    Promise.all([
      getBlogsData(),
      getBlogMetaData()
    ]).then((result) => {
      data.articles = result[0]
      data.lastRefreshDate = result[1].lastRefreshDate

      var ans = rssTemplate({
        channel: config.pageName,
        blogURL: config.blog,
        description: config.desc,
        lang: config.lang,
        lastRefreshDate: data.lastRefreshDate,
        articles: getArticlesStructure(data.articles)
      })
      resolve(ans)
    })

    //
  })
}
