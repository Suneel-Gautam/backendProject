import mongoose, { Schema } from "mongoose";

const vidoeSchema = new Schema({


},
    {
        timestamps: true
    }
)

const Video = mongoose.model('Video', vidoeSchema)

export default Video

