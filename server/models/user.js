import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import APIError from "../helpers/APIError";
import httpStatus from "http-status";

var userSchema = new mongoose.Schema({
  email: {type: String, unique: true, required: true},
  hashed_password: {type: String, required: true},
  password_reset_token: {type: String, unique: true},
  reset_token_expires: Date,
  firstname: String,
  lastname: String
});

function hashPassword(password) {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

const UserModel = mongoose.model('User', userSchema);

userSchema.statics = {
  register(fields) {
    return new Promise((resolve, reject) => {
      var user;

      fields.hashed_password = hashPassword(fields.password);
      delete fields.password;

      user = new this(fields);
      user.save((err, user) => {
        if (err || !user) {
          reject(new APIError('Register error', httpStatus.NOT_ACCEPTABLE));
        } else {
          resolve(user);
        }
      });
      
    });
  },

  getUser(email, password) {
    return new Promise((resolve, reject) => {
      this.authenticate(email, password).then(user => {
        resolve(user.email);
      }).error(e => resolve(e));
    });
  },

  authenticate(email, password) {
    return new Promise((resolve, reject) => {
      this.findOne({email: email}, (err, user) => {
        console.log(err, user);
        if (err || !user){
          reject(new APIError('Authenticate error', httpStatus.FORBIDDEN));
        }
        else {
          resolve(bcrypt.compareSync(password, user.hashed_password) ? user : null);
        }
      });
    })
  }
};

export default UserModel;
