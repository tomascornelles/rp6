var home = require('./home')
var pj = require('./pj')
// var session = require('./session')

var page = require('page')

page('/', home.homeApp)
page('/:pj', pj.pjApp)
// page('/logout/:pj', session.logout)
page()

