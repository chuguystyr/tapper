import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    login: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, require: true  },
    password: { type: String, required: true },
    avatar: { type: String, required: false },
    email: { type: String, required: false },
    facebook: { type: String, required: false },
    twitter: { type: String, required: false },
    instagram: { type: String, required: false },
    linkedin: { type: String, required: false },
    skype: { type: String, required: false }
});

const UserModel = mongoose.models.users || mongoose.model("users", UserSchema);

export default UserModel;