var home = require('./home.js')
var pj = require('./pj.js')
var dm = require('./dm.js')
var items = require('./items.js')
// var session = require('./session')

var page = require('page')

page('/', home.homeApp)
page('/dm', dm.dmApp)
page('/items', items.itemsApp)
page('/:pj', pj.pjApp)
// page('/logout/:pj', session.logout)
page()

