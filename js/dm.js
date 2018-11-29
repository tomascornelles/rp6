export const dmApp = (response) => {
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
      
      _listPJs()
      _chatDraw('dm')

      let pages = document.querySelectorAll('.page')
      pages.forEach(page => {
        page.style.display = 'none'
      })
      document.querySelector('.js-page-dm').style.display = 'block'
    })

    // document.querySelector('.js-salir').setAttribute('href', './logout/' + pj)
  }

  const _loadPJ = (pj) => {
    _pj = _data.characters[pj]
    let _template = document.createElement('div')
    _template.classList.add('js-template')
    _template.innerHTML = `<div class="img"><img src="img/${pj}.png" alt="${_pj.name}"></img></div>
      <div class="name">
        <h4>${_pj.name}</h4>
      </div>
      <div class="class">
        <p>${_pj.class}</p>
      </div>
      <div class="race">
        <p>${_pj.race}</p>
        <div class="barra"><div class="vida" style="width:${_barPv()}%"></div></div>
      </div>
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>Fue</th>
              <th>Men</th>
              <th>Def</th>
              <th>PV</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${_pj.force}</td>
              <td>${_pj.mind}</td>
              <td>${_printDefense()}</td>
              <td>${_printPv()} / ${_pj.pv}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="skills">
        <h5>Habilidades</h5>${_printSkills()}
      </div>
      <div class="items">
        <h5>Equipamiento</h5>${_printItems()}
      </div>
      `

    let _container = document.querySelector('.js-sheet')
    _container.innerHTML = ''
    _container.append(_template)
  }

  const _listPJs = () => {
    let pjs = _data.characters
    let _container = document.querySelector('.js-list-dm')
    _container.innerHTML = ''

    for (let pj in pjs) {
      _pj = _data.characters[pj]
      let _template = document.createElement('div')
      _template.classList.add('js-template')
      _template.innerHTML = `<div class="img"><img src="img/${pj}.png" alt="${_pj.name}"></img></div>
      <div class="more"><button class="js-more-pj more-pj button button-outline" data-pj="${pj}"></button></div>
        <div class="name">
          <h4>${_pj.name}</h4>
        </div>
        <div class="class">
          <p>${_pj.class}</p>
        </div>
        <div class="race">
          <p>${_pj.race}</p>
          <div class="barra"><div class="vida" style="width:${_barPv()}%"></div></div>
        </div>
        <div class="table">
          <table>
            <thead>
              <tr>
                <th>Fue</th>
                <th>Men</th>
                <th>Def</th>
                <th>PV</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${_pj.force}</td>
                <td>${_pj.mind}</td>
                <td>${_printDefense()}</td>
                <td>${_printPv()} / ${_pj.pv}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="skills box">
          <h5>Habilidades</h5>
          ${_printSkills()}
        </div>
        <div class="items box">
          <h5>Equipamiento</h5>
          <p><span class="js-mo" contenteditable="true">${_pj.mo}</span> mo.</p>
          ${_printItems(pj)}
          <div class="js-item-list">${_itemList(pj)}</div>
        </div>`

      if (_pj.token !== '') _container.append(_template)
      
      let _mo = document.querySelectorAll('.js-mo')
      _mo.forEach(item => {
        item.addEventListener('blur', function () {
          _setMo(pj, this.innerHTML)
        })
      })
    }

    let more = document.querySelectorAll('.js-more-pj')
    more.forEach(item => {
      item.addEventListener('click', function () {
        let _template = document.querySelectorAll('.js-template')
        if (this.parentNode.parentNode.classList.contains('big')) {
          _template.forEach(item => {
            item.classList.remove('big', 'small')
          })
        } else {
          _template.forEach(item => {
            item.classList.remove('big')
            item.classList.add('small')
            this.parentNode.parentNode.classList.remove('small')
            this.parentNode.parentNode.classList.add('big')
          })
        }
      }, false)
    })

    let itemSelect = document.querySelectorAll('.js-item-select')
    itemSelect.forEach(item => {
      item.addEventListener('change', function () {
        _addItem(this.dataset.pj, this.value)
      })
    })

    let itemRemove = document.querySelectorAll('.js-item-remove')
    itemRemove.forEach(item => {
      item.addEventListener('click', function () {
        _removeItem(this.dataset.pj, this.dataset.item)
      })
    })
  }

  const _setMo = (pj, mo) => {
    let database = firebase.database()
    database.ref().child('/characters/' + pj).update({ 'mo': mo })
  }

  const _printDefense = () => {
    let items = _pj.items.split(',')
    let defOut = 1
    if (items[0] !== '') {
      for (let i = 0; i < items.length; i++) {
        let item = _items[items[i].trim()]
        if (item.type === 'armadura') defOut += parseFloat(item.def)
      }
    }
    return defOut
  }

  const _printPv = () => {
    return parseFloat(_pj.pv) - parseFloat(_pj.dmg)
  }

  const _barPv = () => {
    return (parseFloat(_pj.pv) - parseFloat(_pj.dmg)) / parseFloat(_pj.pv) * 100
  }

  const _printSkills = () => {
    let skills = _pj.skills.split(',')
    let skillsout = ''
    if (skills[0] !== '') {
      for (let i = 0; i < skills.length; i++) {
        let skill = _skills[skills[i].trim()]
        let print = ''
        print += (skill.activation !== '') ? `<strong>Activación:</strong>${skill.activation}<br>` : ''
        print += (skill.cost !== '') ? `<strong>Coste:</strong>${skill.cost}<br>` : ''
        print += (skill.description !== '') ? `<strong>Descripción:</strong><br>${skill.description}<br>` : ''

        skillsout += `<div class="js-info">
          <input type="checkbox" name="skills" id="${_pj.name}-skill-${skills[i]}">
          <label class="js-info-link" for="${_pj.name}-skill-${skills[i]}">${skill.name}</label>
          <div class="js-info-text">${print}</div>
        </div>`
      }
    }
    return skillsout
  }

  const _printItems = (pj) => {
    let items = _pj.items.split(',')
    let itemsout = ''
    if (items[0] !== '') {
      for (let i = 0; i < items.length; i++) {
        let item = _items[items[i].trim()]
        let print = ''
        print += (item.def !== '') ? `<strong>Defensa:</strong> +${item.def}<br>` : ''
        print += (item.dmg !== '') ? `<strong>Daño:</strong> ${item.dmg}<br>` : ''
        print += (item.range !== '') ? `<strong>Alcance:</strong> ${item.range}<br>` : ''
        print += (item.hands !== '')
          ? (item.hands === '1')
            ? '1 mano'
            : '2 manos'
          : ''
        itemsout += `<div class="js-info">
          <input type="checkbox" name="items" id="${_pj.name}-item-${items[i]}">
          <label class="js-info-link" for="${_pj.name}-item-${items[i]}"><img src="${item.icon}" height="20"> ${item.name} <a class="js-item-remove button-outline" data-pj="${pj}" data-item="${items[i]}">×</a></label>
          <div class="js-info-text">${print}</div>
        </div>`
      }
    }
    return itemsout
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

  const _monsterList = (pj) => {
    let select = `<select class="js-moster-select" data-pj="${pj}">`
    select += `<option>Añadir criatura</option>`
    for (const moster in _data.monsters) {
      if (_data.monsters.hasOwnProperty(moster)) {
        select += `<option value="${moster}">${_data.monsters[moster].name}</option>`
      }
    }
    select += '</select>'
    return select
  }

  const _chatDraw = (pj) => {
    let chat = _data.chat
    let container = document.querySelector('.js-chat-dm')
    let messages = document.createElement('div')
    messages.classList.add('messages')
    container.innerHTML = ''
    for (const id in chat) {
      let p = document.createElement('p')
      if (chat[id].player === 'dm') { p.classList.add('dm') }
      let response = chat[id].text
      let responsePrint = (response.match(/^(http).*(png|gif|jpg)$/gm))
        ? '<img src="' + response + '">'
        : '<strong>' + chat[id].player + ': </strong>' + response
      responsePrint += `<a class="js-chat-delete chat-delete" data-id="${id}">✖</a>`
      p.innerHTML = responsePrint
      messages.prepend(p)
    }
    let chatBox = document.createElement('div')
    chatBox.innerHTML = `<form class="js-form">
      <div class="flex">
        <select class="js-dices">
          <option>Lanzar dados</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
        ${_itemList()}
        ${_monsterList()}
      </div>
      <div class="flex">
        <input type="text" class="js-message">
        <input type="submit" value="Enviar" class="js-send">
      </div>
    </form>`
    container.append(chatBox)
    container.append(messages)
    document.querySelector('.js-form').addEventListener('submit', function () {
      let message = document.querySelector('.js-message')
      saveMessage(pj, message.value)
    })
    document.querySelector('.js-dices').addEventListener('change', function () {
      let dice = document.querySelector('.js-dices').value
      let throws = []
      for (let a = 0; a < dice; a++) {
        let t = Math.ceil(Math.random() * 6)
        throws.push(' [' + t + '] ')
      }
      let message = throws.sort().reverse()
      saveMessage(pj, message.join(''))
    })
    document.querySelector('.js-form .js-item-select').addEventListener('change', function () {
      let item = _items[this.value]
      let print = ''
        print += (item.def !== '') ? `<span>Defensa:</span> +${item.def}<br>` : ''
        print += (item.dmg !== '') ? `<span>Daño:</span> ${item.dmg}<br>` : ''
        print += (item.range !== '') ? `<span>Alcance:</span> ${item.range}<br>` : ''
        print += (item.hands !== '')
          ? (item.hands === '1')
            ? '1 mano'
            : '2 manos'
          : ''
      let message = `<img src="${item.icon}" width="36">
        <h3>${item.name}</h3>
        ${print}`
      saveMessage(pj, message)
    })
    document.querySelector('.js-form .js-moster-select').addEventListener('change', function () {
      let monster = _data.monsters[this.value]
      let weapon = _items[monster.weapon]
      let print = ''
        print += (monster.weapon !== '') ? `<img src="${weapon.icon}" width="16"> ${weapon.name}<br>` : ''
        print += (monster.atk !== '') ? `<span class="dm-only">Ataque: ${monster.atk}<br></span>` : ''
        print += (monster.def !== '') ? `<span class="dm-only">Defensa: ${monster.def}<br></span>` : ''
        print += (monster.hp !== '') ? `<span class="dm-only">PV: ${monster.hp}</span>` : ''
      let message = `<img src="${monster.icon}" width="36">
        <h3>${monster.name}</h3>
        ${print}`
      saveMessage(pj, message)
    })
    let deleteButton = document.querySelectorAll('.js-chat-delete')
      deleteButton.forEach(button => {
        button.addEventListener('click', function () {
          _deleteMessage(pj,this.dataset.id)
        })
      })
  }

  const _deleteMessage = (pj,id) => {
    let database = firebase.database()
    database.ref('chat/' + id).remove()
    _chatDraw(pj)
  }
  
  const saveMessage = (pj, m) => {
    let database = firebase.database()
    database.ref('chat/message' + Date.parse(Date())).set({
      "player": pj,
      "text": m
    });
    _chatDraw(pj)
  }

  _init()
}