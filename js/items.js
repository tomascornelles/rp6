export const itemsApp = (response) => {
  var firebase = require('firebase/app')
  let _pj = {}
  let _skills, _items, _data

  const _init = () => {
    require('firebase/database')
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyA9QlXVmuDcG20RGtkkhlMVBOyuSFqcsJ4",
      authDomain: "rp6app.firebaseapp.com",
      databaseURL: "https://rp6app.firebaseio.com",
      projectId: "rp6app"
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(config)
    }
    let database = firebase.database()

    database.ref('/').on('value', function (snapshot) {
      _data = snapshot.val()
      _items = _data.items
      _skills = _data.skills

      let pages = document.querySelectorAll('.page')
      pages.forEach(page => {
        page.style.display = 'none'
      })
      document.querySelector('.js-page-items').style.display = 'block'
      document.querySelector('.js-items-list').innerHTML = _printItems()
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
    })
  }

  const _printItems = () => {
    let itemsout = `<table>
                      </thead>
                        <th></th><th>ID</th><th>Name</th><th>Def</th><th>Dmg</th><th>Range</th><th>Hands</th><th>Price</th><th>Type</th><th></th>`
    for (let _item in _items) {
      let item = _items[_item]
      let print = '<tr>'
      print += `<td><img src="${item.icon}" height="20" class="js-edit-image"><span data-item="${_item}" data-prop="icon" contenteditable="true" class="js-edit-item hidden">${item.icon}</span></td>`
      print += `<td>${_item}</td>`
      print += `<td data-item="${_item}" data-prop="name" contenteditable="true" class="js-edit-item">${item.name}</td>`
      print += (item.def !== '') ? `<td data-item="${_item}" data-prop="def" contenteditable="true" class="js-edit-item">${item.def}</td>` : '<td></td>'
      print += (item.dmg !== '') ? `<td data-item="${_item}" data-prop="dmg" contenteditable="true" class="js-edit-item">${item.dmg}</td>` : '<td></td>'
      print += (item.range !== '') ? `<td data-item="${_item}" data-prop="range" contenteditable="true" class="js-edit-item">${item.range}</td>` : '<td></td>'
      print += (item.hands !== '') ? `<td data-item="${_item}" data-prop="hands" contenteditable="true" class="js-edit-item">${item.hands}</td>` : '<td></td>'
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
    <input type="text" placeholder="Def" data-prop="def" name="def">
    <input type="text" placeholder="Dmg" data-prop="dmg" name="dmg">
    <input type="text" placeholder="Range" data-prop="range" name="range">
    <input type="text" placeholder="Hands" data-prop="hands" name="hands">
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

  const _itemList = (pj) => {
    let select = `<select class="js-item-select" data-pj="${pj}">`
    select += `<option>Añadir item</option>`
    for (const item in _items) {
      if (_items.hasOwnProperty(item)) {
        const element = _items[item];
        select += `<option value="${item}">${_items[item].name}</option>`
      }
    }
    select += '</select>'
    return select
  }

  const _addItem = (pj, i) => {
    let items = _data.characters[pj].items
    if (items === '') {
      items = i
    } else {
      items = items.split(',')
      items.push(i)
      items = items.join(',')
    }
    let database = firebase.database()
    database.ref().child('/characters/' + pj).update({ 'items': items })
  }

  const _removeItem = (pj, i) => {
    let items = []
    let items_init = _data.characters[pj].items.split(',')
    for (let a=0; a < items_init.length; a++) {
      if (items_init[a] !== i) items.push(items_init[a])
    }
    items = items.join(',')
    let database = firebase.database()
    database.ref().child('/characters/' + pj).update({ 'items': items })
  }

  _init()
}
