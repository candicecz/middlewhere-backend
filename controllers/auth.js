const express = require('express');
//did this worrrrkkk?
const onlyLoggedIn = require('../lib/only-logged-in');
var md5 = require('md5'); // for hashin emails


module.exports = (dataLoader) => {
  const authController = express.Router();

  // Create a new user (signup)
  authController.post('/users', (req, res) => {
    const userData = {
      email: req.body.email,
      password: req.body.password
    };
    console.log('16 auth', req.body);
    dataLoader.createUser(userData)
    .then(ans => {
      const email = ans.email;
      const HASH = md5(email);
      const hashed = "https://www.gravatar.com/avatar/"+HASH;
      ans.avatarUrl = hashed;
      return ans;
    })
    .then(user => res.status(201).json(user))
    .catch(err => res.status(400).json(err));
  });


  // Create a new session (login)
  authController.post('/sessions', (req, res) => {
    dataLoader.createTokenFromCredentials(
      req.body.email,
      req.body.password
    )
    .then(token => res.status(201).json({ token: token }))
    .catch(err => res.status(401).json(err));
  });


  // Delete a session (logout)
  authController.delete('/sessions', onlyLoggedIn, (req, res) => {
      dataLoader.deleteToken(req.sessionToken)
      .then(() => res.status(204).end())
      .catch(err => res.status(400).json(err));
  });
  // authController.delete('/sessions', onlyLoggedIn, (req, res) => {
  //   console.log('ST: ', req.sessionToken, ' BT: ', req.body.token);
  //   console.log('req body :: ', req.body); //
  //   if (req.sessionToken === req.body.token) {
  //     dataLoader.deleteToken(req.body.token)
  //     .then(() => res.status(204).end())
  //     .catch(err => res.status(400).json(err));
  //   } else {
  //     res.status(401).json({ error: 'Invalid session token' });
  //   } //
  // });


  // Retrieve current user
  authController.get('/me', onlyLoggedIn, (req, res) => {
    // TODO: this is up to you to implement :)
    dataLoader.getUserFromSession(req.sessionToken)
    .then(ans => {
      const email = ans.users_email;
      const HASH = md5(email);
      const hashed = "https://www.gravatar.com/avatar/"+HASH;
      ans.avatarUrl = hashed;
      console.log(ans);
      return ans;
    })
    .then(ans => res.status(200).json(ans))
    .catch(err => res.status(500).json({ error: 'self not implemented' }));
  });

  return authController;
};
