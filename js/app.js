var home = require('./home')
var pj = require('./pj')

var page = require("page")

page('/', home.homeApp)
page('/:pj', pj.pjApp)
page()
