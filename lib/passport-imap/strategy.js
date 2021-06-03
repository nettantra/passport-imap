/**
 * Module dependencies.
 */
var passport = require('passport')
  , util = require('util')
  , BadRequestError = require('./errors/badrequesterror')
  , Imap = require('imap');

/*
 *The imap authentication strategy authenticates users using imap login information. The strategy requires some options like
 *imaphost name, port and tls
 *
 *passport.use(new ImapStrategy({host: 'imap.gmail.com', port : 993, tls : true}));
 *Authenticate Requests
 *Use passport.authenticate(), specifying the 'imap' strategy, to authenticate requests.
 *For example, as route middleware in an Express application:
 *  app.post('/login', 
 *     passport.authenticate('imap', { failureRedirect: '/login' }),
 *     function(req, res) {
 *       res.redirect('/');
 *     });
 */

function Strategy(options, verify) {
  passport.Strategy.call(this);
  this._host = options.host || '';
  this._port = options.port || 993;
  this._tls = options.tls || false; // faced multiple stratigical error while using in private subnet
  this._success_callback = options.success_callback || null;
  this.name = 'imap';
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  this._username = req.body.username;
  this._password = req.body.password;
  if (!this._username || !this._password) {
    return this.fail(new BadRequestError(options.badRequestMessage || 'Missing credentials'));
  }
  var self = this;
  var imap = new Imap({
    user: self._username,
    password: self._password,
    host: self._host,
    port: self._port,
    tls: self._tls,
    tlsOptions: { rejectUnauthorized: false }
  });
  imap.once('ready', function(){
    if (typeof self._success_callback == "function") {
      var user = self._success_callback(this, imap);
      if (!user.id) {
        console.log("Success fallback must return an object with id parameter!");
        return self.fail("Success fallback must return an object with id parameter!");
      }
      self.success(user, "success");
    } else {
      console.log("Success fallback is required to generate the user!");
      return self.fail("Success fallback is required to generate the user!");
    }
  });
  imap.connect();
  imap.once('error', function(err) {
    return self.fail("Invalid credantials");
  });
}


/**
 * Expose `Strategy`.
 */ 
module.exports = Strategy;
