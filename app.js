require('coffee-script/register') // Needed to require modules written in coffee-script
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')


var fs = require('fs')
var path = require('path')
GLOBAL.anigramPath = path.resolve(__dirname, './static/anigrams')
GLOBAL.anigrams = fs.readdirSync(anigramPath)

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.locals.pretty=  true

// Form data access
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.use(cookieParser())
app.use(session({
    secret: 'such secretz'
}))
app.use(require('./lib/coffee-middleware')({
    src: __dirname + '/static/coffee',
    prefix: '/coffee'
}))
app.use(express.static(path.join(__dirname, 'static')))

/// Routes
app.use('/anigram', require('./routes/anigram'))
app.use('/', require('./routes/'))

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: err
        })
    })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
})


module.exports = app
