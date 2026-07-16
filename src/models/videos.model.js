import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const vidoeSchema = new Schema({
    videoFile: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    duration: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: true
    }
},
    {
        timestamps: true
    }
)

vidoeSchema.plugin(aggregatePaginate)

const Video = mongoose.model('Video', vidoeSchema)

export default Video

