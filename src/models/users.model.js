import mongoose, { Schema } from "mongoose";
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true

    },
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    avatar: {
        type: String,
    },
    coverImage: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }
    ]
},
    {
        timestamps: true
    }
)
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10)
})
userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password)
}
userSchema.methods.createAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
        fullName: this.fullName,
    }, process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.createRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
        fullName: this.fullName,
    }, process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
const User = mongoose.model('User', userSchema)
export default User