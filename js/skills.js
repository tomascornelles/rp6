export const skillsApp = (response) => {
  var firebase = require('firebase/app')
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

      let pages = document.querySelectorAll('.page')
      pages.forEach(page => {
        page.style.display = 'none'
      })
      document.querySelector('.js-page-skills').style.display = 'block'
      document.querySelector('.js-skills-list').innerHTML = _printSkills()
      document.querySelector('.js-skills-new').innerHTML = _newSkill()

      document.querySelectorAll('.js-edit-skill').forEach(skill => {
        skill.addEventListener('blur', function () {
          console.log('update')
          let skill = this.dataset.skill
          let prop = this.dataset.prop
          _skills[skill][prop] = this.innerHTML
          _updateSkill(_skills[skill], skill)
        })
      })
      document.querySelectorAll('.js-edit-image').forEach(image => {
        image.addEventListener('click', function () {
          this.classList.add('hidden')
          this.nextSibling.classList.remove('hidden')
        })
      })
      document.querySelectorAll('.js-skill-delete').forEach(image => {
        image.addEventListener('click', function () {
          console.log('delete')
          let id = this.dataset.skill
          let database = firebase.database()
          database.ref('skills/' + id).remove()
          document.querySelector('.js-skills-list').innerHTML = _printSkills()
        })
      })
      document.querySelector('.js-skill-form').addEventListener('submit', function (e) {
        e.preventDefault()
        let elements = this.elements
        let skill = {}
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].type !== 'submit') {
            skill[elements[i].dataset.prop] = elements[i].value
          }
        }
        let skillName = skill.name.split(' ').join('')
        skillName = skillName.toLowerCase()
        if (skillName !== '') {
          let display = document.querySelector('.js-skills-new')
          display.style.display = (display.style.display === 'block') ? 'none' : 'block'
          this.innerHTML = (this.innerHTML === 'Add Skill') ? 'Close' : 'Add Skill'
          _updateSkill(skill, skillName)
        }
      })
      document.querySelector('.js-show-new-skill').addEventListener('click', function () {
        console.log(this.innerHTML)
        let display = document.querySelector('.js-skills-new')
        display.style.display = (display.style.display === 'block') ? 'none' : 'block'
        this.innerHTML = (this.innerHTML === 'Add Skill') ? 'Close' : 'Add Skill'
      })
    })
  }

  const _printSkills = () => {
    let skillsout = `<table>
                      </thead>
                        <th>ID</th><th>Name</th><th>Activation</th><th>Cost</th><th>Type</th><th>Description</th><th></th>`
    for (let _skill in _skills) {
      let skill = _skills[_skill]
      let print = '<tr>'
      print += `<td>${_skill}</td>`
      print += `<td data-skill="${_skill}" data-prop="name" contenteditable="true" class="js-edit-skill">${skill.name}</td>`
      print += (skill.activation !== '') ? `<td data-skill="${_skill}" data-prop="activation" contenteditable="true" class="js-edit-skill">${skill.activation}</td>` : '<td></td>'
      print += (skill.cost !== '') ? `<td data-skill="${_skill}" data-prop="cost" contenteditable="true" class="js-edit-skill">${skill.cost}</td>` : '<td></td>'
      print += (skill.type !== '') ? `<td data-skill="${_skill}" data-prop="type" contenteditable="true" class="js-edit-skill">${skill.type}</td>` : '<td></td>'
      print += (skill.description !== '') ? `<td data-skill="${_skill}" data-prop="description" contenteditable="true" class="js-edit-skill">${skill.description}</td>` : '<td></td>'
      print += `<td><button class="js-skill-delete delete button button-outline" data-skill="${_skill}">Borrar</button></td>`
      print += `</tr>`
      skillsout += print
    }
    skillsout += `</table>`
    return skillsout
  }

  const _newSkill = () => {
    let form = `<form action="" class="js-skill-form">
    <input type="text" placeholder="Name" data-prop="name" name="name">
    <input type="text" placeholder="Activation" data-prop="activation" name="activation">
    <input type="text" placeholder="Cost" data-prop="cost" name="cost">
    <input type="text" placeholder="Type" data-prop="type" name="type">
    <input type="text" placeholder="Description" data-prop="description" name="description">
    <input type="submit" value="Save" class="js-skill-save">
    </form>`

    return form
  }

  const _updateSkill = (skill, skillName) => {
    let database = firebase.database()
    database.ref().child('/skills/' + skillName).update(skill)
  }

  _init()
}
