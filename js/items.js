export const itemsApp = (response) => {
  var firebase = require('firebase/app')
  let _items, _data

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
      _items = _data.items

      let pages = document.querySelectorAll('.page')
      pages.forEach(page => {
        page.style.display = 'none'
      })
      document.querySelector('.js-page-items').style.display = 'block'
      document.querySelector('.js-items-list').innerHTML = _printItems()

      if (window.sessionStorage.getItem('user')) {
        document.querySelector('.js-items-new').innerHTML = _newItem()

        document.querySelectorAll('.js-edit-item').forEach(item => {
          item.addEventListener('blur', function () {
            console.log('update')
            let item = this.dataset.item
            let prop = this.dataset.prop
            _items[item][prop] = this.innerHTML
            _updateItem(_items[item], item)
          })
        })
        document.querySelectorAll('.js-edit-image').forEach(image => {
          image.addEventListener('click', function () {
            this.classList.add('hidden')
            this.nextSibling.classList.remove('hidden')
          })
        })
        document.querySelectorAll('.js-item-delete').forEach(image => {
          image.addEventListener('click', function () {
            console.log('delete')
            let id = this.dataset.item
            let database = firebase.database()
            database.ref('items/' + id).remove()
            document.querySelector('.js-items-list').innerHTML = _printItems()
          })
        })
        document.querySelector('.js-item-form').addEventListener('submit', function (e) {
          e.preventDefault()
          let elements = this.elements
          let item = {}
          for (let i = 0; i < elements.length; i++) {
            if (elements[i].type !== 'submit') {
              item[elements[i].dataset.prop] = elements[i].value
            }
          }
          let itemName = item.name.split(' ').join('')
          itemName = itemName.toLowerCase()
          if (itemName !== '') {
            let display = document.querySelector('.js-items-new')
            display.style.display = (display.style.display === 'block') ? 'none' : 'block'
            this.innerHTML = (this.innerHTML === 'Add Item') ? 'Close' : 'Add Item'
            _updateItem(item, itemName)
          }
        })
        document.querySelector('.js-show-new-item').addEventListener('click', function () {
          console.log(this.innerHTML)
          let display = document.querySelector('.js-items-new')
          display.style.display = (display.style.display === 'block') ? 'none' : 'block'
          this.innerHTML = (this.innerHTML === 'Add Item') ? 'Close' : 'Add Item'
        })
      } else {
        let display = document.querySelector('.js-show-new-item')
        display.style.display = 'none'

        let borrar = document.querySelectorAll('.js-item-delete')
        borrar.forEach(boton => {
          boton.style.display = 'none'
        })
      }
    })
  }

  const _printItems = () => {
    let itemsout = `<table>
                      </thead>
                        <th></th><th>ID</th><th>Name</th><th>Def</th><th>Dmg</th><th>Notes</th><th>Price</th><th>Type</th><th></th>`
    for (let _item in _items) {
      let item = _items[_item]
      let print = '<tr>'
      print += `<td><img src="${item.icon}" height="20" class="js-edit-image"><span data-item="${_item}" data-prop="icon" contenteditable="true" class="js-edit-item hidden">${item.icon}</span></td>`
      print += `<td>${_item}</td>`
      print += `<td data-item="${_item}" data-prop="name" contenteditable="true" class="js-edit-item">${item.name}</td>`
      print += (item.bd !== '') ? `<td data-item="${_item}" data-prop="bd" contenteditable="true" class="js-edit-item">${item.bd}</td>` : '<td></td>'
      print += (item.ba !== '') ? `<td data-item="${_item}" data-prop="ba" contenteditable="true" class="js-edit-item">${item.ba}</td>` : '<td></td>'
      print += (item.notes !== '') ? `<td data-item="${_item}" data-prop="notes" contenteditable="true" class="js-edit-item">${item.notes}</td>` : '<td></td>'
      print += (item.price !== '') ? `<td data-item="${_item}" data-prop="price" contenteditable="true" class="js-edit-item">${item.price}</td>` : '<td></td>'
      print += (item.type !== '') ? `<td data-item="${_item}" data-prop="type" contenteditable="true" class="js-edit-item">${item.type}</td>` : '<td></td>'
      print += `<td><button class="js-item-delete delete button button-outline" data-item="${_item}">Borrar</button></td>`
      print += `</tr>`
      itemsout += print
    }
    itemsout += `</table>`
    return itemsout
  }

  const _newItem = () => {
    let form = `<form action="" class="js-item-form">
    <input type="text" placeholder="Name" data-prop="name" name="name">
    <input type="text" placeholder="Image" data-prop="icon" name="icon">
    <input type="text" placeholder="Bonus defense" data-prop="bd" name="bd">
    <input type="text" placeholder="Bonus attack" data-prop="ba" name="ba">
    <input type="text" placeholder="Notes" data-prop="notes" name="notes">
    <input type="text" placeholder="Price" data-prop="price" name="price">
    <input type="text" placeholder="Type" data-prop="type" name="type">
    <input type="submit" value="Save" class="js-item-save">
    </form>`

    return form
  }

  const _updateItem = (item, itemName) => {
    let database = firebase.database()
    database.ref().child('/items/' + itemName).update(item)
  }

  _init()
}
