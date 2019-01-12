export const monstersApp = (response) => {
  var firebase = require('firebase/app')
  let _monsters, _data

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

      let pages = document.querySelectorAll('.page')
      pages.forEach(page => {
        page.style.display = 'none'
      })
      document.querySelector('.js-page-monsters').style.display = 'block'
      document.querySelector('.js-monsters-list').innerHTML = _printMonsters()

      if (window.sessionStorage.getItem('user')) {
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
      } else {
        let display = document.querySelector('.js-show-new-monster')
        display.style.display = 'none'

        let borrar = document.querySelectorAll('.js-monster-delete')
        borrar.forEach(boton => {
          boton.style.display = 'none'
        })
      }
    })
  }

  const _printMonsters = () => {
    let monstersout = `<table>
                      </thead>
                        <th>ID</th><th>Name</th><th>F</th><th>D</th><th>M</th><th>Melé</th><th>Dist</th><th>Def</th><th>HP</th><th>Weapon</th><th>Type</th><th></th>`
    for (let _monster in _monsters) {
      let monster = _monsters[_monster]
      let print = '<tr>'
      print += `<td>${_monster}</td>`
      print += `<td data-monster="${_monster}" data-prop="name" contenteditable="true" class="js-edit-monster">${monster.name}</td>`
      print += (monster.f !== '') ? `<td data-monster="${_monster}" data-prop="f" contenteditable="true" class="js-edit-monster">${monster.f}</td>` : '<td></td>'
      print += (monster.d !== '') ? `<td data-monster="${_monster}" data-prop="d" contenteditable="true" class="js-edit-monster">${monster.d}</td>` : '<td></td>'
      print += (monster.m !== '') ? `<td data-monster="${_monster}" data-prop="m" contenteditable="true" class="js-edit-monster">${monster.m}</td>` : '<td></td>'
      print += (monster.mele !== '') ? `<td data-monster="${_monster}" data-prop="mele" contenteditable="true" class="js-edit-monster" style="background: #eee">${monster.mele}</td>` : '<td></td>'
      print += (monster.dist !== '') ? `<td data-monster="${_monster}" data-prop="dist" contenteditable="true" class="js-edit-monster" style="background: #eee">${monster.dist}</td>` : '<td></td>'
      print += (monster.def !== '') ? `<td data-monster="${_monster}" data-prop="def" contenteditable="true" class="js-edit-monster">${monster.def}</td>` : '<td></td>'
      print += (monster.pv !== '') ? `<td data-monster="${_monster}" data-prop="pv" contenteditable="true" class="js-edit-monster">${monster.pv}</td>` : '<td></td>'
      print += (monster.notes !== '') ? `<td data-monster="${_monster}" data-prop="notes" contenteditable="true" class="js-edit-monster">${monster.notes}</td>` : '<td></td>'
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
    <input type="text" placeholder="F" data-prop="f" name="f">
    <input type="text" placeholder="D" data-prop="d" name="d">
    <input type="text" placeholder="M" data-prop="m" name="m">
    <input type="text" placeholder="Melé" data-prop="mele" name="mele">
    <input type="text" placeholder="Dist" data-prop="dist" name="dist">
    <input type="text" placeholder="Def" data-prop="def" name="def">
    <input type="text" placeholder="PV" data-prop="pv" name="pv">
    <input type="submit" value="Save" class="js-monster-save">
    </form>`

    return form
  }

  const _updatemonster = (item, itemName) => {
    let database = firebase.database()
    database.ref().child('/monsters/' + itemName).update(item)
  }

  _init()
}
