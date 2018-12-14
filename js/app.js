var home = require('./home.js')
var pj = require('./pj.js')
var dm = require('./dm.js')
var items = require('./items.js')
var monsters = require('./monsters.js')
var skills = require('./skills.js')
// var session = require('./session')

var page = require('page')

page('/', home.homeApp)
page('/dm', dm.dmApp)
page('/library/items', items.itemsApp)
page('/library/monsters', monsters.monstersApp)
page('/library/skills', skills.skillsApp)
page('/:pj', pj.pjApp)
// page('/logout/:pj', session.logout)
page()
