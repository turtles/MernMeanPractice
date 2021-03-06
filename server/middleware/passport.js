const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sendActivationEmail = require('../email/sendActivationEmail');

const User = mongoose.model('user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false, 'Invalid Credentials'); }
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, 'Invalid credentials.');
    });
  });
}));

function changePassword(user, currentPassword, newPassword) {
  return new Promise((resolve, reject) => {
    user.comparePassword(currentPassword, (err,isMatch)=>{
      if (err) {
        console.log(err);
        reject('Unspecified error');
      }

      if (!isMatch) {
        reject('Current password is invalid.');
      }
      else {
        user.password = newPassword;
        user.save();
        resolve(user);
      }
    });
  });
}

function changeDisplayName(user, displayName) {
  return new Promise((resolve, reject) => {
    User.findOne({displayName})
      .then(existingUser => {
        if (existingUser) {
          reject('Username is already taken :(');
          return;
        }
        user.displayName = displayName;
        return user.save();
      }).then(user => {
        resolve(user);
      });
  });
}

function signup({ displayName, email, password, info }) {
  if (!displayName || !email || !password) { throw new Error('You must provide a username, email and password.'); }
  if (password.length < 6) { throw new Error('Password must be at least 6 characters long.')};

  const user = new User({ displayName, email, password });

  return User.findOne({ $or:[{email}, {displayName}] })
    .then(existingUser => {
      if (existingUser) {
        if (existingUser.displayName === displayName) {
          throw new Error('Username taken :(');
        }
        throw new Error('Email already registered');
      }
      return user.save();
    })
    .then(user => {
      return new Promise((resolve, reject) => {
        info.logIn(user, (err) => {
          if (err) { reject(err); }
          sendActivationEmail(user.email, user._id, user.activation_token);
          resolve(user);
        });
      });
    });
}

function login({ email, password, info }) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user) => {
      if (!user) { reject('Invalid credentials.') }

      info.login(user, () => resolve(user));
    })({ body: { email, password } });
  });
}

function activate(id, activation_token) {
  return new Promise((resolve, reject) => {
    User.findOne(
      { // query
        _id: mongoose.Types.ObjectId(id)
      },
      function(err, user) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        if (!user) return reject('User not found');
        if (user.activation_token &&
          user.activation_token !== activation_token) {
          return reject('Invalid activation code');
        }
        if (user.activated) {
          return resolve(user);
        }

        user.activated = true;
        user.activation_token = '';
        user.save();

        resolve(user);
      }
    )
  })
}

function resendActivationEmail(user) {
  return new Promise((resolve, reject) => {
    sendActivationEmail(user.email, user._id, user.activation_token);
    resolve(user);
  });
}

module.exports = {
  signup,
  login,
  activate,
  changePassword,
  changeDisplayName,
  resendActivationEmail
};
