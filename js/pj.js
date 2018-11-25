export const pjApp = (response) => {
  var firebase = require('firebase/app')
  let _pj = {}
  let _skills, _items, _data

  const _init = (pj) => {
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
      
      console.log(_data)
      if (_data.characters[pj].token === '') {
        _setToken(pj, Date.parse(Date()))
        _loadPJ(pj)
        _listPJs()
        _chatDraw(_data.characters[pj].name)
      } else if (_data.characters[pj].token == sessionStorage.getItem(pj)) {
        _loadPJ(pj)
        _listPJs()
        _chatDraw(_data.characters[pj].name)
      } else {
        window.location.href = "./";
      }

      let pages = document.querySelectorAll('.page')
      pages.forEach(page => {
        page.style.display = 'none'
      })
      document.querySelector('.js-page-pj').style.display = 'block'
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
      <div class="skills box">
        <h5>Habilidades</h5>
        ${_printSkills()}
      </div>
      <div class="items box">
        <h5>Equipamiento</h5>
        <p>${_pj.mo} mo.</p>
        ${_printItems()}
      </div>
      `

    let _container = document.querySelector('.js-sheet')
    _container.innerHTML = ''
    _container.append(_template)
  }

  const _listPJs = () => {
    let pjs = _data.characters
    let _container = document.querySelector('.js-list')
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
          <p>💰 ${_pj.mo} mo.</p>
          ${_printItems()}
        </div>`

      if (_pj.token !== '') _container.append(_template)
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

  const _printItems = () => {
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
          <label class="js-info-link" for="${_pj.name}-item-${items[i]}"><img src="${item.icon}" height="20"> ${item.name}</label>
          <div class="js-info-text">${print}</div>
        </div>`
      }
    }
    return itemsout
  }

  const _chatDraw = (pj) => {
    console.log(pj)
    let chat = _data.chat
    let container = document.querySelector('.js-chat')
    let messages = document.createElement('div')
    messages.classList.add('messages')
    container.innerHTML = ''
    for (const id in chat) {
      let p = document.createElement('p')
      if (chat[id].player === 'dm') { p.classList.add('dm') }
      else if (chat[id].player === pj) {p.classList.add('own')}
      if (chat[id].player === pj) p.classList.add('own')
      let response = chat[id].text
      let responsePrint = (response.match(/^(http).*(png|gif|jpg)$/gm))
        ? '<a href="' + response + '" target="_blank"><img src="' + response + '"></a>'
        : '<strong>' + chat[id].player + ': </strong>' + response
      p.innerHTML = responsePrint
      messages.prepend(p)
    }
    let chatBox = document.createElement('div')
    chatBox.innerHTML = `<form class="js-form">
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
      <div class="flex">
        <input type="text" class="js-message" placeholder="Escribe un mensaje">
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
      console.log(throws)
      let message = throws.sort().reverse()
      saveMessage(pj, message.join(''))
    })
  }
  
  const saveMessage = (pj, m) => {
    let database = firebase.database()
    database.ref('chat/message' + Date.parse(Date())).set({
      "player": pj,
      "text": m
    });
    _chatDraw(pj)
  }

  _init(response.params.pj)
}