import axios from 'axios'
import { transform, cleanKey } from './shared'
import { api } from './auth'
import { user } from '@/system/config'
import Guid from 'guid'

export function getYoutube ({ videoID }) {
  return {
    typeIsEmbedYoutube: true,
    videoID,
    youtube: `https://www.youtube.com/embed/${videoID}`
  }
}

export function getImage ({ image, caption }) {
  return {
    typeIsFigureImage: true,
    image: image,
    caption: caption
  }
}

export function getParagraph ({ words }) {
  return {
    typeIsParagraph: true,
    text: words
  }
}

export function getPoster ({ image, toptitle, subtitle, credit }) {
  return {
    typeIsPoster: true,
    image,
    toptitle,
    subtitle,
    credit
  }
}

export function getSlideShow ({ images, caption, credit }) {
  return {
    typeIsSlideShow: true,
    images: images || [],
    caption: {
      text: caption,
      attribution: credit
    }
  }
}

export const templates = {
  getYoutube,
  getParagraph,
  getImage,
  getPoster,
  getSlideShow
}

export function getBlog () {
  return axios.get('https://loklok-fbia.firebaseio.com/blog-data/articles.json?orderBy="$key"&limitToLast=15')
  .then((response) => {
    store.blogStore = {
      ...store.blogStore,
      ...response.data
    }
    return store.blogs
  })
}

export function getOneBlog ({ articleID }) {
  return axios.get('https://loklok-fbia.firebaseio.com/blog-data/articles/' + articleID + '.json')
  .then((response) => {
    store.blogStore = {
      ...store.blogStore,
      [articleID]: response.data
    }
    return store.blogs
  })
}

export function getRTBlog () {
  var blogRef = articleCollectionRef()
  blogRef.on('value', function (snapshot) {
    store.blogStore = {
      ...store.blogStore,
      ...snapshot.val()
    }
  })
}

export function getRTImage () {
  var ref = imageCollctionRef().orderByKey().limitToLast(store.imagePageSize)
  ref.on('value', function (snapshot) {
    store.imageStore = {
      ...store.imageStore,
      ...snapshot.val()
    }
  })
}

export function canGetOlderImage () {
  return store.images.length > 1
}
export function canGetNewerImage () {
  return store.imageLoaderCursor > 0
}

export function getOlderRTImage () {
  let target = store.images[store.images.length - 1]
  if (!target) {
    return false
  }
  let cursor = target['.key']
  if (!cursor) {
    return false
  }
  imageCollctionRef().off()
  var havent = true
  imageCollctionRef().orderByKey()
  .endAt(cursor)
  .limitToLast(store.imagePageSize)
  .on('value', (snapshot) => {
    if (havent) {
      store.imageLoaderCursor++
      havent = false
    }
    store.imageStore = snapshot.val() || {}
  })
}

export function getNewerRTImage () {
  store.imageLoaderCursor--
  let target = store.images[0]
  if (!target) {
    return false
  }
  let cursor = target['.key']
  if (!cursor) {
    return false
  }
  imageCollctionRef().off()
  imageCollctionRef().orderByKey()
  .startAt(cursor)
  .limitToFirst(store.imagePageSize)
  .on('value', (snapshot) => {
    store.imageStore = snapshot.val() || {}
  })
}

export function autoRefresher () {
  store.blogs.forEach((blog) => {
    listenItemChange(blog['.key'])
  })
}

export const store = {
  imagePageSize: 4,
  imageLoaderCursor: 0,
  imageStore: {},
  setImageByKey (key, val) {
    store.imageStore[key] = val
    return val
  },
  getImageByKey (key) {
    return store.imageStore[key]
  },
  get imageCon () {
    return store.imageStore
  },
  get images () {
    return transform(store.imageStore || {}).sort((a, b) => {
      if (Date.parse(a.createdAt) > Date.parse(b.createdAt)) return -1
      if (Date.parse(a.createdAt) < Date.parse(b.createdAt)) return 1
      return 0
    })
  },
  //
  // -0-0-0-0-0-0-
  //
  blogStore: {},
  getBlogByKey (key) {
    return store.blogStore[key]
  },
  get blogCon () {
    return store.blogStore
  },
  get blogs () {
    return transform(store.blogStore || {}).sort((a, b) => {
      if (Date.parse(a.header.publishDate) > Date.parse(b.header.publishDate)) return -1
      if (Date.parse(a.header.publishDate) < Date.parse(b.header.publishDate)) return 1
      return 0
    })
  }
}

export function imageStorageRef () {
  return api.storage.ref('/public')
}

export function imageCollctionRef () {
  return api.db.ref().child('blog-data/images')
}

export function articleCollectionRef () {
  return api.db.ref().child('blog-data/articles')
}

export function refreshRSS () {
  var blogMetaData = api.db.ref().child('blog-meta')
  blogMetaData.child('lastRefreshDate').set(new Date().toISOString())
}

export function removeBlog (itemID) {
  var blogRef = articleCollectionRef().child(itemID)
  blogRef.remove()
  delete store.blogStore[itemID]
  refreshRSS()
}

export function saveBlog (itemID, item) {
  var blogRef = articleCollectionRef().child(itemID)
  item.header.modifyDate = new Date().toISOString()
  blogRef.set(cleanKey(item))
  refreshRSS()
}

export function listenItemChange (itemID) {
  var blogRef = articleCollectionRef().child(itemID)
  blogRef.on('value', function (snapshot) {
    var data = snapshot.val()
    store.blogStore[itemID] = data
    console.log(data)
  })
}

export function makeBlog () {
  refreshRSS()

  var blogData = articleCollectionRef()
  var newItemKey = blogData.push().key
  var newItemObj = {
    readyToPublish: false,
    style: 'instapress',
    articleID: newItemKey,
    guid: Guid.raw(),
    description: 'lok\'s article description lok',
    header: {
      heroImage: 'http://via.placeholder.com/1024x1024',
      heroCaption: 'Hero Caption when clicked',
      kicker: 'Tagline for your brand',
      title: 'Blog title - ' + Math.ceil(Math.random() * 1000000),
      subtitle: 'Sub title',
      authorPage: user.authorPage,
      authorName: user.authorName,
      publishDate: new Date().toISOString(),
      modifyDate: new Date().toISOString()
    },
    body: [
      {
        typeIsParagraph: true,
        text: `This is the paragraph of the text`
      },
      {
        typeIsFigureImage: true,
        image: 'http://via.placeholder.com/1024x1024',
        caption: 'Caption of the image'
      }
    ]
  }
  blogData.child(newItemKey).set(newItemObj)

  // store.blogStore = {
  //   ...store.blogStore,
  //   [newItemKey]: newItemObj
  // }
  // listenItemChange(newItemKey)

  return Promise.resolve(newItemKey)
}

export function removeImage ({ imgObj }) {
  return new Promise((resolve, reject) => {
    var imageStorage = imageStorageRef()
    var imageData = imageCollctionRef()
    var targetRef = imageStorage.child(imgObj.fileKeyName)
    imageData.child(imgObj.fileKey).remove()
    delete store.imageCon[imgObj.fileKey]
    targetRef.delete().then(() => {
    }).catch((e) => {
      console.log(e)
    })
  })
}

export function makeImage ({ file }) {
  return new Promise((resolve, reject) => {
    var imageStorage = imageStorageRef()
    var imageData = imageCollctionRef()
    var newItemKey = imageData.push().key
    var extension = file.name.split('.').pop()
    var newFileName = newItemKey + '.' + extension

    var targetRef = imageStorage.child(newFileName)
    targetRef.put(file).then((snapshot) => {
      var newItemObj = {
        createdAt: new Date().toISOString(),
        url: snapshot.downloadURL,
        storageRef: '/public/' + newFileName,
        fileKey: newItemKey,
        fileKeyName: newFileName
      }
      imageData.child(newItemKey).set(newItemObj)

      store.setImageByKey(newItemKey, newItemObj)

      resolve(newItemObj)
    })
  })
}
