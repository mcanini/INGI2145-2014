var express = require('express');
var assert = require('assert');
var app = require('./app.js');
var ejs = require('ejs');
var fs = require('fs');
var AM = require('./account-manager.js');
var router = express.Router();


////////////////////////////////////////////////////////////////////////////////

function setDisplayDate(tweetsToDisplay) {
    tweetsToDisplay.forEach(function(tweet) {
        tweet.display_time = new Date(tweet.created_at).toString();
    });
    return tweetsToDisplay;
}

// NOTE(norswap): This method is necessary because, annoyingly, EJS does not
//  support dynamic includes (including a file whose name is passed via the
//  dictionary -- it has to be hardcoded in the template instead).
function render(res, dict) {
    fs.readFile('views/'+ dict.partial + '.ejs', 'utf-8', function(err, data) {
        assert(!err);
        dict.partial = ejs.render(data, dict);
        res.render('template', dict);
    });
}

////////////////////////////////////////////////////////////////////////////////
// Login page

router.get('/', function(req, res) {
    // TODO: Render login page unless the user is already logged in.
    // In this case, redirect the user to /home
});

////////////////////////////////////////////////////////////////////////////////
// Login / Logout

router.post('/validate', function(req, res) {
    // TODO: Implement user login given req.param('username'), req.param('password')
});

router.post('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

////////////////////////////////////////////////////////////////////////////////
// User Profile

router.get('/usr/:username', function(req, res) {
    // TODO: render user req.params.username profile (profile.ejs)
});

router.get('/usr/:username/following', function(req, res) {
    // TODO: render users following user req.params.username
});

router.get('/usr/:username/followers', function(req, res) {
    // TODO: render users followed by user req.params.username
});

router.get('/usr/:username/follow', function(req, res) {
    // TODO
});

router.get('/usr/:username/unfollow', function(req, res) {
    // TODO
});

////////////////////////////////////////////////////////////////////////////////
// User Timeline

router.get('/home', function(req, res) {
    if (req.session.user == null) {
        // if user is not logged in redirect back to login page
        res.redirect('/');
        return;
    }
    // TODO: render user timeline
});

////////////////////////////////////////////////////////////////////////////////
// User Timeline
router.post('/newTweet', function(req, res) {
    // TODO: accept and save new Tweet
});

////////////////////////////////////////////////////////////////////////////////

module.exports = router;
