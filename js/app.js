var home = require('./home')
var pj = require('./pj')
var dm = require('./dm')
// var session = require('./session')

var page = require('page')

page('/', home.homeApp)
page('/dm', dm.dmApp)
page('/:pj', pj.pjApp)
// page('/logout/:pj', session.logout)
page()

