var express = require('express');
var assert  = require('assert');
var app     = require('./app.js');
var ejs     = require('ejs');
var fs      = require('fs');
var AM      = require('./account-manager.js');
var router  = express.Router();

////////////////////////////////////////////////////////////////////////////////
// Rendering method

function render(res, dict) {
    fs.readFile('views/'+ dict.partial + '.ejs', 'utf-8', function(err, data) {
        assert(!err);
        dict.partial = ejs.render(data, dict);
        res.render('template', dict);
    });
}


////////////////////////////////////////////////////////////////////////////////
// Homepage

router.get('/', function(req, res, next) {

    // check if the user's credentials are saved in a cookie
    if (!req.session.user) {
        return res.render('login', {
            message: 'Hello - Please Login To Your Account' });
    }

    // attempt automatic login
    AM.autoLogin(
        req.session.user.username,
        req.session.user.pass,
        app.users,
    function(user) {
        if (!user)
            return res.render('login', {
                title: 'Hello - Please Login To Your Account' });

        req.session.user = user;
        res.redirect('/home');
    });
});

////////////////////////////////////////////////////////////////////////////////
// Login / Logout

router.post('/validate', function(req, res) {
    AM.manualLogin(req.param('user'), req.param('pass'), app.users, function(e, o){
        //TODO Exercise-III: Modify this to support AJAX
        if (!o){
            res.render('login', { message: 'Wrong username/password combo!' });
        }   else{
            //TODO Exercise-I: Persist user session by adding it to the req.session dictionary
            res.redirect('/home');
        }
    });
});

router.post('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

////////////////////////////////////////////////////////////////////////////////
// Search

router.get('/home', function(req, res) {

    //TODO Exercise-I if user is not logged in, redirect back to login page
    //Hint: you can use the 'redirect' function after checking user state

    render(res, {
        title: 'Search Results:',
        partial: 'home',
        results: []
    });
});

router.post('/search', function(req, res) {

    //TODO Exercise-I if user is not logged in, redirect back to login page
    //Hint: you can use the 'redirect' function after checking user state
    // construct query dict

    var queryParams = {}
    if(req.body.searchparam1 !== "")
    {
        if(req.body.searchparam1 == "group")
            queryParams[req.body.searchtype1] = {$in: req.body.searchparam1}
        else
            queryParams[req.body.searchtype1] = req.body.searchparam1
    }
    if(req.body.searchparam2 !== "")
    {
        if(req.body.searchparam2 == "group")
            queryParams[req.body.searchtype2] = {$in: req.body.searchparam2}
        else
            queryParams[req.body.searchtype2] = req.body.searchparam2
    }
    if(req.body.searchparam3 !== "")
    {
        if(req.body.searchparam3 == "group")
            queryParams[req.body.searchtype3] = {$in: req.body.searchparam3}
        else
            queryParams[req.body.searchtype3] = req.body.searchparam3
    }

    // query db
    app.users
    .find(queryParams)
    .toArray(function(err, array) {
        res.setHeader('content-type', 'application/json');

        var o = {message: "OK", arr: array}
        res.send(JSON.stringify(o));
    });
    app.users
    .find(queryParams)
    .explain(outputQueryStats);

});

function outputQueryStats(nullParam, explanation) {
    console.log("nscannedObjects" + explanation.nscannedObjects);
    console.log("nscanned: " + explanation.nscanned);
}
////////////////////////////////////////////////////////////////////////////////

module.exports = router;
