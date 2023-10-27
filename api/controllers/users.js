const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length > 0)
        return res.status(409).json({ message: "Username already exists" });
      else {
        bcrypt.hash(req.body.password, 10, (error, hash) => {
          if (error) return res.status(500).json({ error: error });
          else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              email: req.body.email,
              password: hash,

              // ---------- ROLE ADJUSTMENT ----------

              // 'role' use only when creating fist user -> superadmin or admin
              // default when creating is 'user':
              role: req.body.role,
            });
            user
              .save()
              .then(() =>
                res.status(201).json({ message: "User saved successfully" })
              )
              .catch((error) => res.status(500).json({ error: error }));
          }
        });
      }
    });
};
