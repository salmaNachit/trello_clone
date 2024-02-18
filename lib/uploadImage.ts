
import {ID, storage} from "@/appwrite";
const uploadImage = async  (file: File)=>{
    if (!file) return;
    const fileUploaded = await  storage.createFile(
        "65a16cecba34bb90e810",
        ID.unique(),
        file
    );
    return {
        bucketId: fileUploaded.bucketId,
        fileId: fileUploaded.$id,
    };
}

export default uploadImage;