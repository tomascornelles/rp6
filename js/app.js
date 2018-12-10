var home = require('./home.js')
var pj = require('./pj.js')
var dm = require('./dm.js')
var items = require('./items.js')
var monsters = require('./monsters.js')
// var session = require('./session')

var page = require('page')

page('/', home.homeApp)
page('/dm', dm.dmApp)
page('/items', items.itemsApp)
page('/monsters', monsters.monstersApp)
page('/:pj', pj.pjApp)
// page('/logout/:pj', session.logout)
page()

