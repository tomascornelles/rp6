/* global sessionStorage */
export const homeApp = () => {
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
      _skills = _data.skills
      _items = _data.items
      _listPJs()

      let pages = document.querySelectorAll('.page')
      pages.forEach(page => {
        page.style.display = 'none'
      })
      document.querySelector('.js-page-home').style.display = 'block'
    })
  }

  const _listPJs = () => {
    let pjs = _data.characters
    let _container = document.querySelector('.js-grid')
    _container.innerHTML = ''

    for (let key in pjs) {
      if (pjs[key].type === 'pj') _loadPJ(key)
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

  const _loadPJ = (pj) => {
    _pj = _data.characters[pj]
    let _template = document.createElement('div')
    _template.classList.add('js-template')
    if (_pj.token !== '' && _pj.token.toString() === sessionStorage.getItem(pj)) {
      _template.classList.add('own')
    } else if (_pj.token !== '') {
      _template.classList.add('used')
    }
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
      </div>
      <div class="link">
        <a href="${pj}" class="js-select-pj button" data-pj="${pj}">Escoger</a>
      </div>
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>Fuerza</th>
              <th>Destreza</th>
              <th>Mente</th>
              <th>Defensa</th>
              <th>Vida</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${_pj.force}</td>
              <td>${_pj.dex}</td>
              <td>${_pj.mind}</td>
              <td>${_printDefense()}</td>
              <td>${_pj.pv}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="talent box">
        <h5>Talento</h5>
        ${_printTalent()}
      </div>
      <div class="skills box">
        <h5>Habilidades</h5>
        ${_printSkills()}
      </div>
      <div class="items box">
        <h5>Equipamiento</h5>
        <p>${_pj.mo}</p>
        ${_printItems()}
      </div>`

    let _container = document.querySelector('.js-grid')
    _container.appendChild(_template)
  }

  const _printDefense = () => {
    let items = _pj.items.split(',')
    let defOut = 1
    if (items[0] !== '') {
      for (let i = 0; i < items.length; i++) {
        let item = _items[items[i].trim()]
        if (item.def) defOut += parseFloat(item.def)
      }
    }
    return defOut
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
  
  const _printSkills = () => {
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
          print += (skill.desc !== '') ? `<strong>Descripciรณn:</strong><br>${skill.desc}<br>` : ''

          skillsout += `<div class="js-info">
            <input type="checkbox" name="skills" id="${_pj.name}-skill-${skills[i]}">
            <label class="js-info-link" for="${_pj.name}-skill-${skills[i]}">${skill.name}</label>
            <div class="js-info-text">${print}</div>
          </div>`
        }
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
        if (typeof item !== 'undefined') {
          let print = ''
          print += (item.bd !== '') ? `<strong>Bonus defensa:</strong> ${item.bd}<br>` : ''
          print += (item.ba !== '') ? `<strong>Bonus ataque:</strong> ${item.ba}<br>` : ''
          print += (item.notes !== '') ? `<strong>Notas:</strong> ${item.notes}<br>` : ''
          itemsout += `<div class="js-info">
            <input type="checkbox" name="items" id="${_pj.name}-item-${items[i]}">
            <label class="js-info-link" for="${_pj.name}-item-${items[i]}"><img src="${item.icon}" height="20"> ${item.name}</label>
            <div class="js-info-text">${print}</div>
          </div>`
        }
      }
    }
    return itemsout
  }

  _init()
}
