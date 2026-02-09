const IMGBB_API_KEY = '153cd0efa69f265d29c89961e1b962e8';

export async function uploadImageToImgBB(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await response.json();

        if (data.success) {
            return data.data.url;
        } else {
            throw new Error('Failed to upload image to ImgBB');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}
