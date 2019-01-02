export const roomsApp = (response) => {
  var firebase = require('firebase/app')
  let _data, _rooms

  const _init = () => {
    require('firebase/database')
    // Initialize Firebase
    var config = {
      apiKey: 'AIzaSyA9QlXVmuDcG20RGtkkhlMVBOyuSFqcsJ4',
      authDomain: 'rp6app.firebaseapp.com',
      databaseURL: 'https://rp6app.firebaseio.com',
      projectId: 'rp6app'
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(config)
    }
    let database = firebase.database()

    database.ref('/').on('value', function (snapshot) {
      _data = snapshot.val()
      _rooms = _data.campaigns.rooms

      let pages = document.querySelectorAll('.page')
      pages.forEach(page => {
        page.style.display = 'none'
      })
      document.querySelector('.js-page-rooms').style.display = 'block'
      document.querySelector('.js-rooms-list').innerHTML = _printRooms()

      if (window.sessionStorage.getItem("user")) {
        document.querySelector('.js-rooms-new').innerHTML = _newRoom()

        document.querySelectorAll('.js-edit-room').forEach(room => {
          room.addEventListener('blur', function () {
            console.log('update')
            let room = this.dataset.room
            let prop = this.dataset.prop
            _rooms[room][prop] = this.innerHTML
            _updateRoom(_rooms[room], room)
          })
        })
        document.querySelectorAll('.js-room-delete').forEach(image => {
          image.addEventListener('click', function () {
            console.log('delete')
            let id = this.dataset.room
            let database = firebase.database()
            database.ref('rooms/' + id).remove()
            document.querySelector('.js-rooms-list').innerHTML = _printRooms()
          })
        })
        document.querySelector('.js-room-form').addEventListener('submit', function (e) {
          e.preventDefault()
          let elements = this.elements
          let room = {}
          for (let i = 0; i < elements.length; i++) {
            if (elements[i].type !== 'submit') {
              room[elements[i].dataset.prop] = elements[i].value
            }
          }
          let roomName = room.name.split(' ').join('')
          roomName = roomName.toLowerCase()
          if (roomName !== '') {
            let display = document.querySelector('.js-rooms-new')
            display.style.display = (display.style.display === 'block') ? 'none' : 'block'
            this.innerHTML = (this.innerHTML === 'Add Room') ? 'Close' : 'Add Room'
            _updateRoom(room, roomName)
          }
        })
        document.querySelector('.js-show-new-room').addEventListener('click', function () {
          console.log(this.innerHTML)
          let display = document.querySelector('.js-rooms-new')
          display.style.display = (display.style.display === 'block') ? 'none' : 'block'
          this.innerHTML = (this.innerHTML === 'Add Room') ? 'Close' : 'Add Room'
        })
      } else {
        let display = document.querySelector('.js-show-new-room')
        display.style.display = 'none'
        
        let borrar = document.querySelectorAll('.js-room-delete')
        borrar.forEach(boton => {
          boton.style.display = 'none'
        })
      }
    })
  }

  const _printRooms = () => {
    let roomsout = `<table>
                      </thead>
                        <th>ID</th><th>Campagin</th><th>Title</th><th>Description</th><th></th>`
    for (let _room in _rooms) {
      let room = _rooms[_room]
      let print = '<tr>'
      print += `<td>${_room}</td>`
      print += (room.campaign !== '') ? `<td data-room="${_room}" data-prop="campaign" contenteditable="true" class="js-edit-room">${room.campaign}</td>` : '<td></td>'
      print += (room.title !== '') ? `<td data-room="${_room}" data-prop="title" contenteditable="true" class="js-edit-room">${room.title}</td>` : '<td></td>'
      print += (room.description !== '') ? `<td data-room="${_room}" data-prop="description" contenteditable="true" class="js-edit-room">${room.description}</td>` : '<td></td>'
      print += `<td><button class="js-room-delete delete button button-outline" data-room="${_room}">Borrar</button></td>`
      print += `</tr>`
      roomsout += print
    }
    roomsout += `</table>`
    return roomsout
  }

  const _newRoom = () => {
    let form = `<form action="" class="js-room-form">
    <input type="text" placeholder="Title" data-prop="title" name="title">
    <input type="text" placeholder="Campaign" data-prop="campaign" name="campaign">
    <textarea placeholder="Description" data-prop="description" name="description"></textarea>
    <input type="submit" value="Save" class="js-room-save">
    </form>`

    return form
  }

  const _updateRoom = (room, roomID) => {
    let database = firebase.database()
    database.ref().child('/campaign/rooms/' + roomID).update(room)
  }

  _init()
}
