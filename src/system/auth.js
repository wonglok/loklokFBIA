import firebase from 'firebase'
import * as config from './config'

function isset (o) {
  return typeof o !== 'undefined'
}

export const appState = {
  loading: false,
  user: null,
  get isLoggedIn () {
    if (appState.user && isset(appState.user.uid)) {
      return true
    } else {
      return false
    }
  }
}

export function restoreStates () {
  return new Promise((resolve, reject) => {
    if (appState.isLoggedIn) {
      resolve(appState)
      return
    }

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        // var displayName = user.displayName;
        // var email = user.email;
        // var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        // var providerData = user.providerData;
        // ...
        appState.user = user
        resolve(appState)
        console.log('logged in')
      } else {
        appState.user = null
        // router.push({
        //   path: '/'
        // })
        reject(appState)
        console.log('not logged in')
      }
      appState.ready = true
    })
  })
}

var googleLoginProvider
export function loginToGoogle () {
  appState.loading = true
  googleLoginProvider = googleLoginProvider || new firebase.auth.GoogleAuthProvider()
  return new Promise((resolve, reject) => {
    firebase.auth().signInWithPopup(googleLoginProvider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = result.credential.accessToken
      // The signed-in user info.
      var user = result.user
      // ...
      appState.user = user
      appState.loading = false
      resolve(appState)
    }).catch(function (error) {
      // Handle Errors here.
      // var errorCode = error.code

      var errorMessage = error.message
      // The email of the user's account used.
      // var email = error.email
      // The firebase.auth.AuthCredential type that was used.
      // var credential = error.credential
      // ...

      appState.user = null
      appState.loading = false
      console.log(errorMessage)
      reject(appState)
    })
  })
}

export function loginDefault () {
  return readyRT()
  .then(() => {
    return loginToGoogle()
  })
  .catch(() => {
    return loginToGoogle()
  })
}

export function logout () {
  return readyRT().then(() => {
    appState.loading = true
    return firebase.auth().signOut().then(function () {
      appState.user = null
      appState.loading = false
    }).catch(function () {
      appState.user = null
      appState.loading = false
    })
  })
}

export const api = {}
export function prepFirebase () {
  return new Promise((resolve, reject) => {
    if (!api.firebase) {
      api.firebase = firebase.initializeApp(config.firebase)
      api.db = api.firebase.database()
      api.storage = firebase.storage()
    }
    resolve(api)
  })
}

export function readyRT () {
  return prepFirebase().then(() => {
    return restoreStates()
  })
}

export function waitLoginInfo () {
  return readyRT()
}
