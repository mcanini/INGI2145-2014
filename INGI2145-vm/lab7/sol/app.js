var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var session         = require('express-session');
var assert          = require('assert');
var mongo           = require('mongodb').MongoClient;
var AM              = require('./account-manager.js')
var app             = module.exports = express();
var routes          = require('./routes.js'); // must be after app

////////////////////////////////////////////////////////////////////////////////
// MIDDLEWARE

app.use(cookieParser());
app.use(session({ secret: 'super-duper-secret-secret',
                  saveUninitialized: true,
                  resave: true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// serve static content from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// parse the parameters of POST requests (available through `req.body`)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use('/', routes);

////////////////////////////////////////////////////////////////////////////////
// ERROR HANDLERS

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// log the error
app.use(function(err, req, res, next) {
    console.log('[' + req.method + ' ' + req.path + ']: ' + err.stack);
    next(err);
});

// set the status + display the error in the browser
app.use(function(err, req, res, next) {
    err.status = err.status || 500;
    res.send('[' + err.status + '] ' + err.message);
});

////////////////////////////////////////////////////////////////////////////////
// START APP

// connect to the test db, retrieve the test collection
mongo.connect('mongodb://localhost:27017/lab7', function(err, db) {

    assert(!err);
    console.log("connected to DB");

    app.users  = db.collection('users');

    //Drop any previously-set indexes
    db.collection('users').dropAllIndexes(function() {})

    //Setting index as the groups field (i.e. multi-key indexing)
    db.ensureIndex("users", {
      country:1, first_name:1
    }, function(err, indexname) {
      assert.equal(null, err);
    });

    var server = app.listen(3000, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('listening at http://%s:%s', host, port);
    });
});

////////////////////////////////////////////////////////////////////////////////
