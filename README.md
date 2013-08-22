# Passport-Imap

[Passport](http://passportjs.org/) strategy for authenticating with imap

This module serves the purpose of authenticating a user using email login credentials in Node.js/Sails.js application.
This can be unobtrusively integrated with any Node.js application using passport for authentication

## Install

    $ npm install passport-imap

## Usage

#### Configure Strategy

The imap authentication strategy authenticates users using imap login information.  The strategy requires some options like imap host name, port and tls

    passport.use(new ImapStrategy({host: 'imap.gmail.com', port : 993, tls : true}));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'imap'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.post('/login', 
      passport.authenticate('imap', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/');
      });

## Credits

  - [GeekTantra](http://github.com/geektantra)

## License

  - [The MIT License](http://opensource.org/licenses/MIT)


Copyright (c) [NetTantra](http://nettantra.com/)
