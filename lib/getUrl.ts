import {storage} from "@/appwrite";
import {Image} from "@/typings";

const getUrl=async (image: Image)=>{
    const url = storage.getFileView(image.bucketId, image.fileId);
    return url;
}

export default getUrl;