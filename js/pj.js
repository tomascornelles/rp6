export const pjApp = (response) => {
  var firebase = require('firebase/app')
  require('firebase/database')
  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyA5OHxB6Q8bcoRu5RpzwpZ6wJctJafSzDQ',
    authDomain: 'rp6-003-test.firebaseapp.com',
    databaseURL: 'https://rp6-003-test.firebaseio.com',
    projectId: 'rp6-003-test'
  }
  if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }
  let database = firebase.database()

  let _pj = {}
  let _skills, _items

  const _init = (pj) => {
    _loadSkills()
    _loadItems()
    _loadPJ(pj)
    let pages = document.querySelectorAll('.page')
    pages.forEach(page => {
      page.style.display = 'none'
    })
    document.querySelector('.js-page-pj').style.display = 'flex'
  }

  const _loadSkills = () => {
    database.ref('skills').on('value', function (snapshot) {
      _skills = snapshot.val()
    })
  }

  const _loadItems = () => {
    database.ref('items').on('value', function (snapshot) {
      _items = snapshot.val()
    })
  }

  const _loadPJ = (pj) => {
    database.ref('characters/' + pj).on('value', function (snapshot) {
      _pj = snapshot.val()
      _setToken(pj, Date.parse(Date()))
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
              <th>Fuerza</th>
              <th>Mente</th>
              <th>Defensa</th>
              <th>Vida</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${_pj.force}</td>
              <td>${_pj.mind}</td>
              <td>${_printDefense()}</td>
              <td>${_pj.pv}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="skills">
        <h5>Habilidades</h5>${_printSkills()}
      </div>
      <div class="items">
        <h5>Equipamiento</h5>${_printItems()}
      </div>`

      let _container = document.querySelector('.js-sheet')
      _container.innerHTML = ''
      _container.append(_template)
    })
    window.addEventListener('beforeunload', function () {
      _setToken(pj, '')
    })
  }

  const _setToken = (pj, token) => {
    console.log(token)
    database.ref('characters/' + pj).update({
      'token': token
    })
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
        print += (skill.def !== '') ? '<strong>Activación:</strong> ' + skill.activation + '<br>' : ''
        print += (skill.dmg !== '') ? '<strong>Coste:</strong> ' + skill.cost + '<br>' : ''
        print += (skill.range !== '') ? '<strong>Descripción:</strong> \n' + skill.description + '<br>' : ''

        skillsout += '<div class="js-info"><input type="checkbox" name="skills" id="skill-' + skills[i] + '"><label class="js-info-link" for="skill-' + skills[i] + '">' + skill.name + '</label><div class="js-info-text">' + print + '</div></div>'
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
        print += (item.def !== '') ? '<strong>Defensa:</strong> +' + item.def + '<br>' : ''
        print += (item.dmg !== '') ? '<strong>Daño:</strong> ' + item.dmg + '<br>' : ''
        print += (item.range !== '') ? '<strong>Alcance:</strong> ' + item.range + '<br>' : ''
        print += (item.hands !== '')
          ? (item.hands === '1')
            ? '1 mano'
            : '2 manos'
          : ''
        itemsout += '<div class="js-info"><input type="checkbox" name="items" id="item-' + items[i] + '"><label class="js-info-link" for="item-' + items[i] + '">' + item.name + '</label><div class="js-info-text">' + print + '</div></div>'
      }
    }
    return itemsout
  }

  _init(response.params.pj)
}
