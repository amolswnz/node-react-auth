const User = require('../user');

exports.signup = function(req, res, next) {
  // console.log(req.body, res);
  // res.send({ success: req.body });
  //
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    email: email
  }, function(err, isExist) {
    if (err) {
      return next(err);
    }

    if (!email || !password) {
      return res.status(422).send({error: 'Enter email and passowrd'});
    }

    if (isExist) {
      return res.status(422).send({error: 'Email is in use'});
    }

    const newUser = new User({email: email, password: password});
    newUser.save(function(err) {
      if (err) {
        return next(err);
      }

      return res.send({success: true});
    });
  });
}
