import firebase from 'firebase'
import * as config from './config'

function isset (o) {
  return typeof o !== 'undefined'
}

export const appState = {
  loading: false,
  user: null,
  isLoggedIn () {
    if (appState.user && isset(appState.user.uid)) {
      return true
    } else {
      return false
    }
  }
}

export function restoreStates () {
  return new Promise((resolve, reject) => {
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
      } else {
        appState.user = null
        // router.push({
        //   path: '/'
        // })
        reject(appState)
      }
      appState.ready = true
    })
  })
}

var googleLoginProvider
export function loginToGoogle () {
  appState.loading = true
  googleLoginProvider = googleLoginProvider || new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(googleLoginProvider).then(function (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    // var token = result.credential.accessToken
    // The signed-in user info.
    var user = result.user
    // ...
    appState.user = user
    appState.loading = false
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
  })
}

export function logout () {
  appState.loading = true
  firebase.auth().signOut().then(function () {
    appState.user = null
    appState.loading = false
  }).catch(function () {
    appState.user = null
    appState.loading = false
  })
}

export const api = {}
export function connectFirebase () {
  return new Promise((resolve, reject) => {
    if (!api.firebase) {
      api.firebase = firebase.initializeApp(config.firebase)
      api.db = api.firebase.database()
      api.storage = firebase.storage()

      reject(api)
      return
    }
    resolve(api)
  }).catch(() => {
    return restoreStates()
  })
}

export function readyRT () {
  return connectFirebase()
}
