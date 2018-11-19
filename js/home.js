export const homeApp = () => {
  var firebase = require("firebase/app");
  require("firebase/database");
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

  const _init = () => {
    _loadSkills()
    _loadItems()
    _listPJs()
    let pages = document.querySelectorAll('.page')
    pages.forEach(page => {
      page.style.display = 'none'
    })
    document.querySelector('.js-page-home').style.display = 'block'
  }
  
  const _listPJs = () => {      
    database.ref('characters').on('value', function (snapshot) {
      let pjs = snapshot.val()
      let _container = document.querySelector('.js-grid')
      _container.innerHTML = ''

      for (let key in pjs) {
        if (pjs[key].token === '') {  
          _loadPJ(key)
        }
      }

      let more = document.querySelectorAll('.js-more-pj')
      more.forEach(item => {
        item.addEventListener('click', function() {
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
    })
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
      // _setToken(pj)
      let _template = document.createElement('div')
      _template.classList.add('js-template')
      let _img = document.createElement('div')
      _img.classList.add('img')
      _img.innerHTML = `<img src="img/${pj}.png" alt="_pj.name"></img>`
      _template.append(_img)
      let _more = document.createElement('div')
      _more.classList.add('more')
      _more.innerHTML = `<button class="js-more-pj more-pj button button-outline" data-pj="${pj}"></button>`
      _template.append(_more)
      let _name = document.createElement('div')
      _name.classList.add('name')
      _name.innerHTML = `<h4>${_pj.name}</h4>`
      _template.append(_name)
      let _class = document.createElement('div')
      _class.classList.add('class')
      _class.innerHTML = `<p>${_pj.class}</p>`
      _template.append(_class)
      let _race = document.createElement('div')
      _race.classList.add('race')
      _race.innerHTML = `<p>${_pj.race}</p>`
      _template.append(_race)
      let _link = document.createElement('div')
      _link.classList.add('link')
      _link.innerHTML = `<a href="${pj}" class="js-select-pj button" data-pj="${pj}">Escoger</a>`
      _template.append(_link)
      let _table = document.createElement('div')
      _table.classList.add('table')
      _table.innerHTML = `
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
      </table>`
      _template.append(_table)
      let _skills = document.createElement('div')
      _skills.classList.add('skills')
      _skills.innerHTML = `<h5>Habilidades</h5>${_printSkills()}`
      _template.append(_skills)
      let _items = document.createElement('div')
      _items.classList.add('items')
      _items.innerHTML = `<h5>Equipamiento</h5>${_printItems()}`
      _template.append(_items)

      let _container = document.querySelector('.js-grid')
      _container.append(_template)
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

  const _printSkills = () => {
    let skills = _pj.skills.split(',')
    let skillsout = ''
    if (skills[0] !== '') {
      for (let i = 0; i < skills.length; i++) {
        let skill = _skills[skills[i].trim()]
        let print = ''
        print += (skill.def !== '') ? '<strong>Activación:</strong> ' + skill.activation  + '<br>': ''
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

  _init()
}