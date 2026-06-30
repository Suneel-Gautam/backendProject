import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username : {
        type : String,
        unqiue : true,
        lowercase: true,
        index : true
    },
    

},
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema)


export default User