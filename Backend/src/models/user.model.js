import mongoose, {Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required:  [true , "Password is required"],
        lowercase: true 
    }
} , {timestamps: true})

userSchema.pre("save" , async function () {
    if (!this.isModified(this.password)) {
        return
    }
    this.password= await bcrypt.hash(this.password , 10)
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password)
}

export const User = mongoose.model("User" , userSchema) 