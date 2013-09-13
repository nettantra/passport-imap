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
  this._host = options.hostName || 'imap.gmail.com';
  this._port = options.port || 993;
  this._tls = options.tls || true;
  this._success_callback = options.success_callback || null;
  if (!this._username || !this._password) {
    return this.fail(new BadRequestError(options.badRequestMessage || 'Missing credentials'));
  }
  var self = this;
  var imap = new Imap({
    user: this._username,
    password: this._password,
    host: this._host,
    port: this._port,
    tls: this._tls,
    tlsOptions: { rejectUnauthorized: false }
  });
  imap.once('ready', function(){
    var microtime = process.hrtime();
    var user = {
      email: this._username,
      id: (microtime[0] * 1000 + microtime[1] / 1000)*1000
    };
    if (typeof this._success_callback == "function") {
      user = this._success_callback();
    }
    self.success(user, "success");
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
