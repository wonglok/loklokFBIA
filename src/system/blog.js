import axios from 'axios'
import { transform } from './shared'
// import { api, readyRT } from './auth'

export function getBlog () {
  return axios.get('https://loklok-fbia.firebaseio.com/blog-data/articles.json?orderBy="$key"&limitToLast=5')
  .then((response) => {
    return transform(response.data)
  })
}

// export function saveBlog () {
//   return readyRT().then(() => {
//   })
// }
