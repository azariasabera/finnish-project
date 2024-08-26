const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UsersSchema = new Schema({
    name : String,
    email : String,
    password : { type: String, optional: true }, // because user can also sign in with google
    googleId : { type: String, optional: true }
});
module.exports = mongoose.model("Users", UsersSchema);