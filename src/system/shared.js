export function cleanKey (obj) {
  obj = {
    ...obj
  }
  delete obj['.key']
  return obj
}

export function transform (obj) {
  var bucket = []
  var keys = Object.keys(obj)
  for (var i = 0; i < keys.length; i++) {
    bucket.push({
      '.key': keys[i],
      ...obj[keys[i]]
    })
  }
  return bucket
}
