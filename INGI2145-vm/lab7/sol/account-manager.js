var crypto  = require('crypto');
var moment  = require('moment');

////////////////////////////////////////////////////////////////////////////////
// Login Validation

exports.autoLogin = function(user, pass, accounts, callback)
{
	accounts.findOne({ username: user }, function(err, user) {
        if (err || !user)
            return callback(null);

        // NOTE(norswap): pass (from session) is a hash
        user.pass == pass ? callback(user) : callback(null);
	});
}

exports.manualLogin = function(user, pass, accounts, callback)
{
	accounts.findOne({ username: user }, function(err, user) {

        if (err || !user)
            return callback(new Error('user not found'), null);

        var hash = user.pass;
        var salt = hash.substr(0, 10);

        if (hash !== salt + md5(pass + salt))
        {
        	console.log(hash)
        	console.log(salt + md5(pass + salt))
            return callback(new Error('invalid password'), null);
        }

        callback(null, user);
    });
}

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, accounts, callback)
{
	accounts.findOne({username:newData.username}, function(e, o) {
		if (o){
			callback('username-taken');
			console.log('user taken', newData.username, o);
		}
		else{
			console.log('adding user', newData.username);

			//For the purpose of this exercise equate pass to username
			newData.pass = newData.username;
			
			saltAndHash(newData.pass, function(hash){
			newData.pass = hash;
		    // append date stamp when record was created //
			newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
			accounts.insert(newData, {safe: true}, callback);
			});
		}
	});
}

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}
