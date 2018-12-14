export const monstersApp = (response) => {
  var firebase = require('firebase/app')
  let _monsters, _data, _items

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
      _monsters = _data.monsters
      _items = _data.items

      let pages = document.querySelectorAll('.page')
      pages.forEach(page => {
        page.style.display = 'none'
      })
      document.querySelector('.js-page-monsters').style.display = 'block'
      document.querySelector('.js-monsters-list').innerHTML = _printMonsters()
      document.querySelector('.js-monsters-new').innerHTML = _newMonster()

      document.querySelectorAll('.js-edit-monster').forEach(monster => {
        monster.addEventListener('blur', function () {
          console.log('update')
          let monster = this.dataset.monster
          let prop = this.dataset.prop
          _monsters[monster][prop] = this.innerHTML
          _updatemonster(_monsters[monster], monster)
        })
      })
      document.querySelectorAll('.js-edit-image').forEach(image => {
        image.addEventListener('click', function () {
          this.classList.add('hidden')
          this.nextSibling.classList.remove('hidden')
        })
      })
      document.querySelectorAll('.js-monster-delete').forEach(image => {
        image.addEventListener('click', function () {
          console.log('delete')
          let id = this.dataset.item
          let database = firebase.database()
          database.ref('items/' + id).remove()
          document.querySelector('.js-items-list').innerHTML = _printMonsters()
        })
      })
      document.querySelector('.js-monster-form').addEventListener('submit', function (e) {
        e.preventDefault()
        let elements = this.elements
        let monster = {}
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].type !== 'submit') {
            monster[elements[i].dataset.prop] = elements[i].value
          }
        }
        let monsterName = monster.name.split(' ').join('')
        monsterName = monsterName.toLowerCase()
        if (monsterName !== '') {
          let display = document.querySelector('.js-monsters-new')
          display.style.display = (display.style.display === 'block') ? 'none' : 'block'
          this.innerHTML = (this.innerHTML === 'Add Monster') ? 'Close' : 'Add Monster'
          _updatemonster(monster, monsterName)
        }
      })
      document.querySelector('.js-show-new-monster').addEventListener('click', function () {
        console.log(this.innerHTML)
        let display = document.querySelector('.js-monsters-new')
        display.style.display = (display.style.display === 'block') ? 'none' : 'block'
        this.innerHTML = (this.innerHTML === 'Add Monster') ? 'Close' : 'Add Monster'
      })
    })
  }

  const _printMonsters = () => {
    let monstersout = `<table>
                      </thead>
                        <th></th><th>ID</th><th>Name</th><th>Atk</th><th>Def</th><th>HP</th><th>Weapon</th><th>Type</th><th></th>`
    for (let _monster in _monsters) {
      let monster = _monsters[_monster]
      let print = '<tr>'
      print += `<td><img src="${monster.icon}" height="20" class="js-edit-image"><span data-monster="${_monster}" data-prop="icon" contenteditable="true" class="js-edit-monster hidden">${monster.icon}</span></td>`
      print += `<td>${_monster}</td>`
      print += `<td data-monster="${_monster}" data-prop="name" contenteditable="true" class="js-edit-monster">${monster.name}</td>`
      print += (monster.atk !== '') ? `<td data-monster="${_monster}" data-prop="atk" contenteditable="true" class="js-edit-monster">${monster.atk}</td>` : '<td></td>'
      print += (monster.def !== '') ? `<td data-monster="${_monster}" data-prop="def" contenteditable="true" class="js-edit-monster">${monster.def}</td>` : '<td></td>'
      print += (monster.hp !== '') ? `<td data-monster="${_monster}" data-prop="hp" contenteditable="true" class="js-edit-monster">${monster.hp}</td>` : '<td></td>'
      print += (monster.weapon !== '') ? `<td data-monster="${_monster}" data-prop="weapon" contenteditable="true" class="js-edit-monster">${monster.weapon}</td>` : '<td></td>'
      print += (monster.type !== '') ? `<td data-monster="${_monster}" data-prop="type" contenteditable="true" class="js-edit-monster">${monster.type}</td>` : '<td></td>'
      print += `<td><button class="js-monster-delete delete button button-outline" data-item="${_monster}">Borrar</button></td>`
      print += `</tr>`
      monstersout += print
    }
    monstersout += `</table>`
    return monstersout
  }

  const _newMonster = () => {
    let form = `<form action="" class="js-monster-form">
    <input type="text" placeholder="Name" data-prop="name" name="name">
    <input type="text" placeholder="Image" data-prop="icon" name="icon">
    <input type="text" placeholder="Atk" data-prop="atk" name="atk">
    <input type="text" placeholder="Def" data-prop="def" name="def">
    <input type="text" placeholder="HP" data-prop="hp" name="hp">
    <input type="text" placeholder="Weapon" data-prop="weapon" name="weapon">
    <input type="text" placeholder="Type" data-prop="type" name="type">
    <input type="submit" value="Guardar" class="js-monster-save">
    </form>`

    return form
  }

  const _updatemonster = (item, itemName) => {
    let database = firebase.database()
    database.ref().child('/monsters/' + itemName).update(item)
  }

  _init()
}
