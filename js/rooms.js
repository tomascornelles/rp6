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
        document.querySelector('.js-page-rooms').style.display = 'block'
        document.querySelector('.js-rooms-list').innerHTML = _printRooms()
        document.querySelector('.js-rooms-new').innerHTML = _newRoom()

        document.querySelectorAll('.js-edit-room').forEach(room => {
          room.addEventListener('blur', function () {
            console.log('update')
            let room = this.dataset.room
            let prop = this.dataset.prop
            _rooms[room][prop] = _replaceAll(this.innerHTML, '\n', '<br>')
            _updateRoom(_rooms[room], room)
          })
        })
        document.querySelectorAll('.js-edit-image').forEach(image => {
          image.addEventListener('click', function () {
            this.classList.add('hidden')
            this.nextSibling.classList.remove('hidden')
          })
        })
        document.querySelectorAll('.js-room-delete').forEach(room => {
          room.addEventListener('click', function () {
            console.log('delete')
            let id = this.dataset.room
            let database = firebase.database()
            database.ref('/campaigns/rooms/' + id).remove()
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
          let display = document.querySelector('.js-rooms-new')
          display.style.display = 'none'
          document.querySelector('.js-show-new-room').innerHTML = 'Add Room'
          if (room.description.trim() !== '') _updateRoom(room, Date.parse(Date()))
        })
      } else {
        window.location = '../dm'
      }
    })

    document.querySelector('.js-show-new-room').addEventListener('click', function () {
      console.log(this.innerHTML)
      let display = document.querySelector('.js-rooms-new')
      display.style.display = (display.style.display === 'block') ? 'none' : 'block'
      this.innerHTML = (this.innerHTML === 'Add Room') ? 'Close' : 'Add Room'
    })
  }

  const _printRooms = () => {
    let roomsout = `<table>
                      </thead>
                        <th>Campagin</th><th>Title</th><th>Description</th><th>DM Info</th><th>Image</th><th></th>`
    for (let _room in _rooms) {
      let room = _rooms[_room]
      let print = '<tr>'
      print += (room.campaign !== '') ? `<td data-room="${_room}" data-prop="campaign" contenteditable="true" class="js-edit-room">${room.campaign}</td>` : '<td></td>'
      print += (room.title !== '') ? `<td data-room="${_room}" data-prop="title" contenteditable="true" class="js-edit-room">${room.title}</td>` : '<td></td>'
      print += (room.description !== '') ? `<td data-room="${_room}" data-prop="description" contenteditable="true" class="js-edit-room">${room.description}</td>` : '<td></td>'
      print += (room.dm !== '') ? `<td data-room="${_room}" data-prop="dm" contenteditable="true" class="js-edit-room">${room.dm}</td>` : '<td></td>'
      print += `<td><img src="${room.img}" style="width:auto; max-width:300px" class="js-edit-image"><span data-room="${_room}" data-prop="img" contenteditable="true" class="js-edit-room hidden">${room.img}</span></td>`
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
    <input type="text" placeholder="Image URI" data-prop="img" name="img">
    <textarea placeholder="Description" data-prop="description" name="description"></textarea>
    <textarea placeholder="Description for DM" data-prop="dm" name="dm"></textarea>
    <input type="submit" value="Save" class="js-room-save">
    </form>`

    return form
  }

  const _updateRoom = (room, roomID) => {
    let database = firebase.database()
    database.ref().child('/campaigns/rooms/' + roomID).update(room)
  }

  const _replaceAll = (str, find, replace) => {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  _init()
}
