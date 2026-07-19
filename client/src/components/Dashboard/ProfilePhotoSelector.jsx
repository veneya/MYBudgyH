import React, { useState, useRef, useEffect } from 'react';
import { LuUpload, LuTrash, LuUser } from 'react-icons/lu';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const ProfilePhotoSelector = ({ onUpdate }) => {
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user?.profileImage) {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            setPreviewUrl(`${baseUrl}${user.profileImage}`);
        }
    }, []);

    const handleProfileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreviewUrl(URL.createObjectURL(file));
        setImage(file);
        setShowOptions(false);
        setUploading(true);
        const formData = new FormData();
        formData.append('profileImage', file);
        try {
            const res = await axiosInstance.put('/auth/upload-profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.profileImage = res.data.user.profileImage;
            localStorage.setItem('user', JSON.stringify(user));
            toast.success('Profile image updated!');
            if (onUpdate) onUpdate(res.data.user);
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const removeProfile = () => {
        setImage(null);
        setPreviewUrl(null);
        setShowOptions(false);
        toast.info('Profile image removed');
    };

    const onChooseFile = () => inputRef.current.click();

    return (
        <div className="relative flex flex-col items-center">
            <input type="file" accept="image/*" ref={inputRef} className="hidden" onChange={handleProfileChange} />
            <div
                className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer border-2 border-gray-300 hover:border-pink-400 transition-all overflow-hidden relative"
                onClick={() => setShowOptions(!showOptions)}
            >
                {previewUrl ? <img src={previewUrl} alt="Profile" className="w-full h-full object-cover rounded-full" /> : <LuUser size={36} className="text-gray-500" />}
                {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full"><div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div></div>}
            </div>
            <div className="absolute bottom-0 right-1 bg-pink-500 text-white rounded-full p-1 cursor-pointer shadow" onClick={() => setShowOptions(!showOptions)}>
                <LuUpload size={12} />
            </div>
            {showOptions && (
                <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md w-32 z-10 py-1 text-sm text-gray-700">
                    <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-pink-100" onClick={onChooseFile} disabled={uploading}>
                        <LuUpload /> {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                    {previewUrl && (
                        <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-100 text-red-500" onClick={removeProfile}>
                            <LuTrash /> Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;