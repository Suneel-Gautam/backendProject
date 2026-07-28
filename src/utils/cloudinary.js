import { v2 as cloudinary } from "cloudinary";
import { unlinkSync } from 'fs'


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

console.log("cloudinary config", process.env.CLOUDINARY_API_KEY);

const fileUpload = async (localFilePath) => {
    try {

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        unlinkSync(localFilePath)
        return response.url

    } catch (error) {
        console.log(error);
        if (localFilePath) {
            unlinkSync(localFilePath)
        }
        //file deleted Sucessfully`
        return null
    }
}

export { fileUpload }