export const logout = (response) => {
  var firebase = require('firebase/app')
  console.log('logout')

  const _init = (pj) => {
    require('firebase/database')
    // Initialize Firebase
    var config = {
      apiKey: 'AIzaSyA5OHxB6Q8bcoRu5RpzwpZ6wJctJafSzDQ',
      authDomain: 'rp6-003-test.firebaseapp.com',
      databaseURL: 'https://rp6-003-test.firebaseio.com',
      projectId: 'rp6-003-test'
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(config)
    }
    let database = firebase.database()
    console.log('1')
    database.ref().child('/characters/' + pj).update({ 'token': '' })
    console.log('2')
    sessionStorage.setItem(pj, '')

    window.location.replace('./')
  }

  _init(response.params.pj)
}