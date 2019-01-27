/* global sessionStorage */
export const pjApp = (response) => {
  var firebase = require('firebase/app')
  let _pj = {}
  let _skills, _items, _data

  const _init = (pj) => {
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

      if (_data.characters[pj].token === '') {
        _setToken(pj, Date.parse(Date()))
        _loadPJ(pj)
        _listPJs()
        _chatDraw(_data.characters[pj].name)
      } else {
        _loadPJ(pj)
        _listPJs()
        _chatDraw(_data.characters[pj].name)
      }

      let pages = document.querySelectorAll('.page')
      pages.forEach(page => {
        page.style.display = 'none'
      })
      document.querySelector('.js-page-pj').style.display = 'block'
    })

    document.querySelector('.js-dices').addEventListener('click', function () {
      let t = Math.ceil(Math.random() * 6)
      let message = '<img src="img/' + t + '.gif" width="32"> '
      saveMessage(pj, message)
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
              <th>Des</th>
              <th>Men</th>
              <th>Def</th>
              <th>PV</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${_pj.force}</td>
              <td>${_pj.dex}</td>
              <td>${_pj.mind}</td>
              <td>${_printDefense()}</td>
              <td>${_printPv()} / ${_getPV(_pj.force)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="talent box">
        <h5>Talento</h5>
        ${_printTalent()}
      </div>
      <div class="items box">
        <h5>Equipamiento</h5>
        <p><img src="img/mo.gif"><span class="js-mo editable" contenteditable="true">${_pj.mo}</span></p>
        ${_printItems('pj')}
      </div>
      <div class="skills box">
        <h5>Hechizos</h5>
        ${_printSkills()}
      </div>
      `

    let _container = document.querySelector('.js-sheet')
    _container.innerHTML = ''
    _container.append(_template)
    document.querySelector('.js-mo').addEventListener('blur', function () {
      _setMo(pj, this.innerHTML)
    })
    document.querySelector('.js-extraItems').addEventListener('blur', function () {
      _setExtra(pj, this.innerHTML)
    })
    document.querySelector('.js-talentLvl').addEventListener('blur', function () {
      _setTalentLvl(pj, this.innerHTML)
    })
    // document.querySelector('.js-use').addEventListener('click', function () {
    //   let t = Math.ceil(Math.random() * 6)
    //   let message = '<img src="img/' + t + '.gif" width="32"> '
    //   _pj = _data.characters[pj]
    //   message += `<br>Bonus Fuerza: +${_pj.force}`
    //   message += `<br>Bonus Arma: +${this.dataset.ba}`
    //   message += '<br><small>¿Algún bonus más?</small>'
    //   message += `<h3>Total: ${t*1 + _pj.force*1 + this.dataset.ba*1}</h3>`
    //   saveMessage(pj, message)
    // })
  }

  const _listPJs = () => {
    let pjs = _data.characters
    let _container = document.querySelector('.js-list')
    _container.innerHTML = ''

    for (let pj in pjs) {
      _pj = _data.characters[pj]
      if (_pj.visible) {
        let _template = document.createElement('div')
        _template.classList.add('js-template')
        _template.innerHTML = `<div class="img"><img src="img/${pj}.png" alt="${_pj.name}"></img></div>
        <div class="barra"><div class="vida" style="width:${_barPv()}%"></div></div>
        <div class="more"><button class="js-more-pj more-pj button button-outline" data-pj="${pj}"></button></div>
          <div class="name">
            <h4>${_pj.name}</h4>
          </div>
          <div class="class">
            <p>${_pj.class}</p>
          </div>
          <div class="race">
            <p>${_pj.race}</p>
          </div>
          <div class="table">
            <table>
              <thead>
                <tr>
                  <th>Fue</th>
                  <th>Des</th>
                  <th>Men</th>
                  <th>Def</th>
                  <th>PV</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${_pj.force}</td>
                  <td>${_pj.dex}</td>
                  <td>${_pj.mind}</td>
                  <td>${_printDefense()}</td>
                  <td>${_printPv()} / ${_getPV(_pj.force)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="talent box">
            <h5>Talento</h5>
            ${_printTalent()}
          </div>
          <div class="items box">
            <h5>Equipamiento</h5>
            <p><img src="img/mo.gif"> ${_pj.mo}</p>
            ${_printItems()}
          </div>
          <div class="skills box">
            <h5>Hechizos</h5>
            ${_printSkills()}
          </div>`
        _container.append(_template)
      }
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
  }

  const _setToken = (pj, token) => {
    let database = firebase.database()
    database.ref().child('/characters/' + pj).update({ 'token': token })
    sessionStorage.setItem(pj, token)
  }

  const _setMo = (pj, mo) => {
    let database = firebase.database()
    database.ref().child('/characters/' + pj).update({ 'mo': mo })
    let message = `Ahora tengo ${mo}.`
    saveMessage(pj, message)
  }

  const _setExtra = (pj, extra) => {
    let database = firebase.database()
    database.ref().child('/characters/' + pj).update({ 'extra': extra })
  }

  const _setTalentLvl = (pj, lvl) => {
    let database = firebase.database()
    database.ref().child('/characters/' + pj).update({ 'talentLvl': lvl })
  }

  const _printDefense = () => {
    let items = _pj.items.split(',')
    let defOut = _pj.dex * 1
    if (items[0] !== '') {
      for (let i = 0; i < items.length; i++) {
        let item = _items[items[i].trim()]
        if (item.bd) defOut += parseFloat(item.bd)
      }
    }
    return defOut
  }

  const _printPv = () => {
    return parseFloat(_getPV(_pj.force)) - parseFloat(_pj.dmg)
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
        <label class="js-info-link-" for="${_pj.name}-talent-${talent}">${talent.name}, rango: <span class="js-talentLvl editable" contenteditable="true">${_pj.talentLvl}</span></label>
        <div>${talent.desc}</div>
      </div>`
      : ''
    return print
  }
  const _printSkills = () => {
    let skills = _pj.skills.split(',')
    let skillsout = ''
    if (skills[0] !== '') {
      for (let i = 0; i < skills.length; i++) {
        let skill = _skills[skills[i].trim()]
        if (typeof skill !== 'undefined') {
          let print = ''
          print += (skill.bm !== '+0') ? `<strong>Bonus: </strong>+${skill.bm}<br>` : ''
          print += (skill.vs !== '') ? `<strong>Objetivo: </strong>${skill.vs}<br>` : ''
          print += (skill.range !== '') ? `<strong>Rango: </strong>${skill.range}<br>` : ''
          print += (skill.pause !== '') ? `<strong>Pausa: </strong>${skill.pause}<br>` : ''
          print += (skill.desc !== '') ? `<strong>Descripción:</strong><br>${skill.desc}<br>` : ''

          skillsout += `<div class="js-info">
            <input type="checkbox" name="skills" id="${_pj.name}-skill-${skills[i]}">
            <label class="js-info-link-" for="${_pj.name}-skill-${skills[i]}">${skill.name}</label>
            <div>${print}</div>
          </div>`
        }
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
        if (typeof item !== 'undefined') {
          let print = ''
          print += (item.bd !== '') ? `( ${item.bd} )` : ''
          print += (item.ba !== '') ? `( ${item.ba} )` : ''
          // print += (pj === 'pj' && item.ba !== '') ? `<button class="js-use" data-ba="${item.ba.replace('+', '')}">Usar</button>` : ''
          // print += (item.notes !== '') ? `<strong>Notes:</strong><br> ${item.notes}<br>` : ''
          itemsout += `<div class="js-info">
            <label><img src="${item.icon}" height="20"> ${item.name} ${print}</label>
          </div>`
        }
      }
    }

    itemsout += (pj)
      ? `<div class="js-extraItems editable" contenteditable="true">${(typeof _pj.extra !== 'undefined') ? _pj.extra : ''}</div>`
      : `<div>${(typeof _pj.extra !== 'undefined') ? _pj.extra : ''}</div>`
    return itemsout
  }

  const _chatDraw = (pj) => {
    let chat = _data.chat
    let container = document.querySelector('.js-messages')
    container.innerHTML = ''
    for (const id in chat) {
      let p = document.createElement('p')
      if (chat[id].player === 'dm') { p.classList.add('dm') } else if (chat[id].player === pj.toLowerCase()) { p.classList.add('own') }
      // if (chat[id].player === pj) p.classList.add('own')
      let response = chat[id].text
      let responsePrint = (response.match(/^(http).*(png|gif|jpg|jpeg)$/gm))
        ? '<a href="' + response + '" target="_blank"><img src="' + response + '"></a>'
        : '<strong>' + chat[id].player + ': </strong>' + response
      p.innerHTML = responsePrint
      container.prepend(p)
    }
    document.querySelector('.js-form').addEventListener('submit', function (e) {
      e.preventDefault()
      let message = document.querySelector('.js-message')
      saveMessage(pj, message.value)
    })
  }

  const saveMessage = (pj, m) => {
    console.log(pj, m)
    let database = firebase.database()
    database.ref('chat/message' + Date.parse(Date())).set({
      'player': pj,
      'text': m
    })
    _chatDraw(pj)
  }

  _init(response.params.pj)
}
