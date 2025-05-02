import { v2 as cloudinary } from 'cloudinary';

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET
});

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement de l\'image');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
    throw error;
  }
};

export const deleteImage = async (publicId) => {
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          signature: cloudinary.utils.api_sign_request(
            { public_id: publicId, timestamp: Math.floor(Date.now() / 1000) },
            process.env.REACT_APP_CLOUDINARY_API_SECRET
          ),
          api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
          timestamp: Math.floor(Date.now() / 1000)
        })
      }
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'image');
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error);
    throw error;
  }
}; 