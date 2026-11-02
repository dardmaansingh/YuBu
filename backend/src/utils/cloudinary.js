import { v2 as cloudinary } from "cloudinary"; 
import fs from "fs";

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        //uploading on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })
        //file has been uploaded succesfull
        //console.log("file uploaded succesfully on cloudinary", response.url)
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        return response

    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath) // remove the localy saved temporary file when the upload op failed
        }
        return null
    }
}

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        if (!publicId) return null;
        //deleting from cloudinary
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        })
        return response
    } catch (error) {
        return null
    }
}

export { uploadCloudinary, deleteFromCloudinary }
