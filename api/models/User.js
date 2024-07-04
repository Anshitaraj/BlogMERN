/*const mongoose = require('mongoose');
const{Schema,model}=mongoose;
const UserSchema= new Schema({
    username:{type:String, required: true, min:4, unique:true},
    password:{type:String, required: true},
});
const_UserModel=model('User','UserSchema');
module.exports = UserModel;*/
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  //...
}, { pluralization: 'disable' }); // Add this option to disable pluralization

module.exports = mongoose.model('User', userSchema);