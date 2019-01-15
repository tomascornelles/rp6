export const dmApp = (response) => {
  var firebase = require('firebase/app')
  let _pj = {}
  let _skills, _items, _data

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
      _skills = _data.skills

      document.querySelector('.bg').classList.remove('light', 'dark', 'dawn', 'forest', 'day', 'night', 'dungeon', 'treasure')
      document.querySelector('.bg').classList.add(_data.campaigns[_data.campaigns.active].bg)

      if (window.sessionStorage.getItem('user')) {
        _listPJs()
        _chatDraw('dm')
        let pages = document.querySelectorAll('.page')
        pages.forEach(page => {
          page.style.display = 'none'
        })
        document.querySelector('.js-page-dm').style.display = 'block'
      } else {
        let pages = document.querySelectorAll('.page')
        pages.forEach(page => {
          page.style.display = 'none'
        })
        document.querySelector('.js-page-login').style.display = 'block'
        _printLogin()
      }
    })

    document.querySelector('.js-ambient').addEventListener('change', function () {
      let database = firebase.database()
      database.ref().child('/campaigns/' + [_data.campaigns.active]).update({ 'bg': this.value })
    })

    // document.querySelector('.js-salir').setAttribute('href', './logout/' + pj)
  }

  const _printLogin = () => {
    let user = document.querySelector('.js-login-user')
    let pass = document.querySelector('.js-login-pass')
    let submit = document.querySelector('.js-login-submit')

    submit.addEventListener('click', function () {
      if (_data.users[user.value].pass === pass.value) {
        window.sessionStorage.setItem('user', user.value)
        window.location = '/dm'
      }
    })
  }

  const _listPJs = () => {
    let pjs = _data.characters
    let _container = document.querySelector('.js-list-dm')
    _container.innerHTML = ''

    for (let pj in pjs) {
      _pj = _data.characters[pj]
      let _template = document.createElement('div')
      _template.classList.add('js-template')
      if (!_pj.visible) _template.classList.add('disabled')
      _template.innerHTML = `<div class="img"><img src="img/${pj}.png" alt="${_pj.name}"></img></div>
      <div class="barra"><div class="vida" style="width:${_barPv()}%"></div></div>
      <div class="more"><button class="js-more-pj more-pj button button-outline" data-pj="${pj}"></button></div>
        <div class="name">
          <h4><strong>${_pj.name}</strong> <em>(${_pj.class} / ${_pj.race})</em><br>
            <code>[ <span class="js-edit-attr" data-pj="${pj}" data-attr="force" contenteditable="true">${_pj.force}</span> | 
            <span class="js-edit-attr" data-pj="${pj}" data-attr="dex" contenteditable="true">${_pj.dex}</span> | 
            <span class="js-edit-attr" data-pj="${pj}" data-attr="mind" contenteditable="true">${_pj.mind}</span> ]
            Def: ${_printDefense()} | 
            Pv: <span class="js-edit-attr" data-pj="${pj}" data-attr="dmg" contenteditable="true">${_pj.dmg}</span> / ${_getPV(_pj.force)}</code>
          </h4>
        </div>
        <div class="talent box">
          <h5>Talento</h5>
          ${_printTalent()}
          <div class="js-talent-list">${_talentList(pj)}</div>
        </div>
        <div class="skills box">
          <h5>Habilidades</h5>
          ${_printSkills(pj)}
          <div class="js-skill-list">${_skillList(pj)}</div>
        </div>
        <div class="items box">
          <h5>Equipamiento</h5>
          <p><span class="js-edit-attr" data-pj="${pj}" data-attr="mo" contenteditable="true">${_pj.mo}</span></p>
          ${_printItems(pj)}
          <div class="js-item-list">${_itemList(pj)}</div>
        </div>
        <div class="actions">
          <button class="js-remove-token" data-pj="${pj}">Quitar Token</button>
          <button class="js-toggle-visible" data-pj="${pj}">Mostrar/Ocultar</button>
        </div>`

      _container.append(_template)

      let _mo = document.querySelectorAll('.js-edit-attr')
      _mo.forEach(item => {
        item.addEventListener('blur', function () {
          _setAttr(this.dataset.pj, this.dataset.attr, this.innerHTML)
        })
      })
    }
    let _token = document.querySelectorAll('.js-remove-token')
    _token.forEach(item => {
      item.addEventListener('click', function () {
        _removeToken(this.dataset.pj)
      })
    })
    let _visible = document.querySelectorAll('.js-toggle-visible')
    _visible.forEach(item => {
      item.addEventListener('click', function () {
        _toggleVisible(this.dataset.pj)
      })
    })

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

    let talentSelect = document.querySelectorAll('.js-talent-select')
    talentSelect.forEach(talent => {
      talent.addEventListener('change', function () {
        _addTalent(this.dataset.pj, this.value)
      })
    })
    let skillSelect = document.querySelectorAll('.js-skill-select')
    skillSelect.forEach(skill => {
      skill.addEventListener('change', function () {
        _addSkill(this.dataset.pj, this.value)
      })
    })
    let itemSelect = document.querySelectorAll('.js-item-select')
    itemSelect.forEach(item => {
      item.addEventListener('change', function () {
        _addItem(this.dataset.pj, this.value)
      })
    })

    let skillRemove = document.querySelectorAll('.js-skill-remove')
    skillRemove.forEach(skill => {
      skill.addEventListener('click', function () {
        _removeSkill(this.dataset.pj, this.dataset.skill)
      })
    })

    let itemRemove = document.querySelectorAll('.js-item-remove')
    itemRemove.forEach(item => {
      item.addEventListener('click', function () {
        _removeItem(this.dataset.pj, this.dataset.item)
      })
    })
  }

  const _setAttr = (pj, attr, val) => {
    let database = firebase.database()
    let message = ''
    if (attr === 'mo') {
      database.ref().child('/characters/' + pj).update({ 'mo': val })
      message = `${_data.characters[pj].name} ahora tiene ${val}.`
    } else if (attr === 'force') {
      database.ref().child('/characters/' + pj).update({ 'force': val })
      message = `${_data.characters[pj].name} ahora tiene ${val} puntos de fuerza.`
    } else if (attr === 'dex') {
      database.ref().child('/characters/' + pj).update({ 'dex': val })
      message = `${_data.characters[pj].name} ahora tiene ${val} puntos de destreza.`
    } else if (attr === 'mind') {
      database.ref().child('/characters/' + pj).update({ 'mind': val })
      message = `${_data.characters[pj].name} ahora tiene ${val} puntos de mente.`
    } else if (attr === 'dmg') {
      message = `A ${_data.characters[pj].name} le quedan ${_getPV(_data.characters[pj].force)*1 - val*1} puntos de vida.`
      database.ref().child('/characters/' + pj).update({ 'dmg': val })
    } else if (attr === 'pv') {
      database.ref().child('/characters/' + pj).update({ 'pv': val })
      message = `${_data.characters[pj].name} ahora tiene ${val} puntos de vida máximos.`
    } else if (attr === 'extra') {
      database.ref().child('/characters/' + pj).update({ 'extra': val })
    }
    saveMessage('dm', message)
  }

  const _removeToken = (pj) => {
    let database = firebase.database()
    database.ref().child('/characters/' + pj).update({ 'token': '' })
  }

  const _toggleVisible = (pj) => {
    let database = firebase.database()
    let character = _data.characters[pj]
    let message = `<h4>Se incorpora al grupo:</h4>
    <img src="img/${pj}.png" width="96">
      <h3>${character.name}</h3>`
    if (!character.visible) saveMessage('dm', message)
    database.ref().child('/characters/' + pj).update({ 'visible': !character.visible })
  }

  const _printDefense = () => {
    let items = _pj.items.split(',')
    let defOut = 1
    if (items[0] !== '') {
      for (let i = 0; i < items.length; i++) {
        let item = _items[items[i].trim()]
        if (item.bd !== '') defOut += parseFloat(item.bd)
      }
    }
    return defOut
  }

  const _barPv = () => {
    return (parseFloat(_getPV(_pj.force) - parseFloat(_pj.dmg)) / parseFloat(_getPV(_pj.force))) * 100
  }

  const _getPV = (f) => {
    return (10 + 10 * f)
  }

  const _printTalent = () => {
    let talent = _data.talents[_pj.talent]
    let print = (talent)
      ? `<div class="js-info">
        <input type="checkbox" name="skills" id="${_pj.name}-talent-${talent}">
        <label class="js-info-link" for="${_pj.name}-talent-${talent}">${talent.name}</label>
        <div class="js-info-text">${talent.desc}</div>
      </div>`
      : ''
    return print
  }

  const _talentList = (pj) => {
    let select = `<select class="js-talent-select" data-pj="${pj}">`
    select += `<option>Añadir talento</option>`
    for (const talent in _data.talents) {
      if (_data.talents.hasOwnProperty(talent)) {
        select += `<option value="${talent}">${_data.talents[talent].name}</option>`
      }
    }
    select += '</select>'
    return select
  }

  const _addTalent = (pj, i) => {
    let database = firebase.database()
    database.ref().child('/characters/' + pj).update({ 'talent': i })
  }

  const _printSkills = (pj) => {
    let skills = _pj.skills.split(',')
    let skillsout = ''
    if (skills[0] !== '') {
      for (let i = 0; i < skills.length; i++) {
        let skill = _skills[skills[i].trim()]
        if (typeof skill !== 'undefined') {
          let print = ''
          print += (skill.bm !== '+0') ? `<strong>Bonus:</strong>${skill.bm}<br>` : ''
          print += (skill.range !== '') ? `<strong>Rango:</strong>${skill.range}<br>` : ''
          print += (skill.pause !== '') ? `<strong>Pausa:</strong>${skill.pause}<br>` : ''
          print += (skill.desc !== '') ? `<strong>Descripción:</strong><br>${skill.desc}<br>` : ''

          skillsout += `<div class="js-info">
            <input type="checkbox" name="skills" id="${_pj.name}-skill-${skills[i]}">
            <label class="js-info-link" for="${_pj.name}-skill-${skills[i]}">${skill.name}<a class="js-skill-remove delete button-outline" data-pj="${pj}" data-skill="${skills[i]}">×</a></label>
            <div class="js-info-text">${print}</div>
          </div>`
        }
      }
    }
    return skillsout
  }

  const _skillList = (pj) => {
    let select = `<select class="js-skill-select" data-pj="${pj}">`
    select += `<option>Añadir skill</option>`
    for (const skill in _skills) {
      if (_skills.hasOwnProperty(skill)) {
        select += `<option value="${skill}">${_skills[skill].name}</option>`
      }
    }
    select += '</select>'
    return select
  }

  const _addSkill = (pj, i) => {
    let skills = _data.characters[pj].skills
    if (skills === '') {
      skills = i
    } else {
      skills = skills.split(',')
      skills.push(i)
      skills = skills.join(',')
    }
    let database = firebase.database()
    database.ref().child('/characters/' + pj).update({ 'skills': skills })
  }

  const _removeSkill = (pj, i) => {
    let skills = []
    let skillsInit = _data.characters[pj].skills.split(',')
    for (let a = 0; a < skillsInit.length; a++) {
      if (skillsInit[a] !== i) skills.push(skillsInit[a])
    }
    skills = skills.join(',')
    let database = firebase.database()
    database.ref().child('/characters/' + pj).update({ 'skills': skills })
  }

  const _printItems = (pj) => {
    let items = _pj.items.split(',')
    let itemsout = ''
    if (items[0] !== '') {
      for (let i = 0; i < items.length; i++) {
        let item = _items[items[i].trim()]
        if (typeof item !== 'undefined') {
          let print = ''
          print += (item.bd !== '') ? `<strong>Bonus defensa:</strong> ${item.bd}<br>` : ''
          print += (item.ba !== '') ? `<strong>Bonus ataque:</strong> ${item.ba}<br>` : ''
          print += (item.notes !== '') ? `<strong>Notas:</strong> ${item.notes}<br>` : ''
          itemsout += `<div class="js-info">
            <input type="checkbox" name="items" id="${_pj.name}-item-${items[i]}">
            <label class="js-info-link" for="${_pj.name}-item-${items[i]}"><img src="${item.icon}" height="20"> ${item.name} <a class="js-item-remove delete button-outline" data-pj="${pj}" data-item="${items[i]}">×</a></label>
            <div class="js-info-text">${print}</div>
          </div>`
        }
      }
    }
    itemsout += `<div class="js-edit-attr editable" contenteditable="true" data-pj="${pj}" data-attr="extra">${(typeof _pj.extra !== 'undefined') ? _pj.extra : ''}</div>`
    return itemsout
  }

  const _itemList = (pj) => {
    let select = `<select class="js-item-select" data-pj="${pj}">`
    select += `<option>Añadir item</option>`
    for (const item in _items) {
      if (_items.hasOwnProperty(item)) {
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
    let itemsInit = _data.characters[pj].items.split(',')
    for (let a = 0; a < itemsInit.length; a++) {
      if (itemsInit[a] !== i) items.push(itemsInit[a])
    }
    items = items.join(',')
    let database = firebase.database()
    database.ref().child('/characters/' + pj).update({ 'items': items })
  }

  const _monsterList = (pj) => {
    let select = `<select class="js-monster-select" data-pj="${pj}">`
    select += `<option>Añadir criatura</option>`
    for (const monster in _data.monsters) {
      if (_data.monsters.hasOwnProperty(monster)) {
        select += `<option value="${monster}">${_data.monsters[monster].name} (${_data.monsters[monster].mele}/${_data.monsters[monster].dist}) / (${_data.monsters[monster].def}/${_data.monsters[monster].pv})</option>`
      }
    }
    select += '</select>'
    return select
  }

  const _roomList = (pj) => {
    let select = `<select class="js-room-select" data-pj="${pj}">`
    select += `<option>Añadir Sala</option>`
    for (const room in _data.campaigns[_data.campaigns.active].rooms) {
      select += `<option value="${room}">${_data.campaigns[_data.campaigns.active].rooms[room].title} </option>`
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
        <button class="js-dices button-wide">d6</button>
        ${_itemList()}
        ${_monsterList()}
        ${_roomList()}
      </div>
      <div class="flex">
        <textarea class="js-message"></textarea>
        <input type="submit" value="Enviar" class="js-send">
      </div>
    </form>`
    container.append(chatBox)
    container.append(messages)
    document.querySelector('.js-chat-dm .js-form').addEventListener('submit', function (e) {
      e.preventDefault()
      let message = document.querySelector('.js-chat-dm .js-message').value
      message = message.split('\n').join('<br>')
      saveMessage(pj, message)
      return false
    })
    document.querySelector('.js-chat-dm .js-dices').addEventListener('click', function () {
      let dice = '1'
      let throws = []
      for (let a = 0; a < dice; a++) {
        let t = Math.ceil(Math.random() * 6)
        throws.push(' <img src="img/' + t + '.gif" width="32"> ')
      }
      let message = throws.sort().reverse()
      saveMessage(pj, message.join(''))
    })
    document.querySelector('.js-chat-dm .js-item-select').addEventListener('change', function () {
      let item = _items[this.value]
      let print = ''
      print += (item.bd !== '+0' && item.bd !== '') ? `<span>Bonus defensa:</span> ${item.bd}<br>` : ''
      print += (item.ba !== '+0' && item.ba !== '') ? `<span>Bonus ataque:</span> ${item.ba}<br>` : ''
      print += (item.notes !== '') ? `<span>Notas:</span> ${item.notes}<br>` : ''
      let message = `<img src="${item.icon}" width="36">
        <h3>${item.name}</h3>
        ${print}`
      saveMessage(pj, message)
    })
    document.querySelector('.js-form .js-monster-select').addEventListener('change', function () {
      let monster = _data.monsters[this.value]
      let weapon = _items[monster.weapon]
      let print = ''
      print += (monster.mele !== '0') ? `<span class="dm-only">Melé: ${monster.mele}<br></span>` : ''
      print += (monster.dist !== '0') ? `<span class="dm-only">Distancia: ${monster.dist}<br></span>` : ''
      print += (monster.def !== '') ? `<span class="dm-only">Defensa: ${monster.def}<br></span>` : ''
      print += (monster.pv !== '') ? `<span class="dm-only">PV: ${monster.pv}</span>` : ''
      let message = `Aparece:<h3>${monster.name}</h3>
        ${print}`
      saveMessage(pj, message)
    })
    document.querySelector('.js-form .js-room-select').addEventListener('change', function () {
      let message = `<img src="${_data.campaigns[_data.campaigns.active].rooms[this.value].img}">`
      message += `<div>${_data.campaigns[_data.campaigns.active].rooms[this.value].description}</div>`
      message += `<div class="dm-only">${_data.campaigns[_data.campaigns.active].rooms[this.value].dm}</div>`
      saveMessage(pj, message)
    })
    let deleteButton = document.querySelectorAll('.js-chat-delete')
    deleteButton.forEach(button => {
      button.addEventListener('click', function () {
        _deleteMessage(pj, this.dataset.id)
      })
    })
  }

  const _deleteMessage = (pj, id) => {
    let database = firebase.database()
    database.ref('chat/' + id).remove()
    _chatDraw(pj)
  }

  const saveMessage = (pj, m) => {
    let database = firebase.database()
    database.ref('chat/message' + Date.parse(Date())).set({
      'player': pj,
      'text': m
    })
    _chatDraw(pj)
  }

  _init()
}
