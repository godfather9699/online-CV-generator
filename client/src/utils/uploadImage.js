import { API_PATHS } from './apiPath';
import axiosInstance from './axiosInstance';

export const uploadImage = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data; // Assuming the response contains the uploaded image URL
    } catch (error) {
        console.error('Image upload failed:', error);
        throw error; // Re-throw the error for further handling
    }
}

export default uploadImage;