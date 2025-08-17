import { useState } from "react";
import { orgAPI } from "../features/organization/orgAPI";



export function useFileUpload() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [files, setFiles] = useState<any[]>([]);

    
    const uploadFile = async (inputFiles :File[]) => {
        const formData = new FormData();
    inputFiles.forEach((file) => formData.append("files", file));
setLoading(true)
    try {
        const response = await orgAPI.fileUpload(formData);

        setFiles((pre)=> [...pre, ...response.data])
    } catch (error:any) {
         const message = error?.response?.data?.message || 'Failed to upload file';
        setError(message);
        console.error("File upload error:", error);
    } finally {
        setLoading(false);
    }
    }
    return {
        loading,
        error,
        files,
        uploadFile,
    }
}