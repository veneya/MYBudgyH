import React, { useState, useRef } from 'react';
import { LuUpload, LuTrash, LuUser } from 'react-icons/lu';

const ProfilePhotoSelector = () => {
    const [setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const inputRef = useRef(null);

    const handleProfileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setShowOptions(false);
        }
    };

    const removeProfile = () => {
        setImage(null);
        setPreviewUrl(null);
        setShowOptions(false);
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    return (
        <div className="relative flex flex-col items-center">
            <input type="file" accept="image/*" ref={inputRef} className="hidden" onChange={handleProfileChange} />

            {/* fix: w-30 h-30 are not valid Tailwind classes, changed to w-28 h-28 */}
            <div
                className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer border-2 border-gray-300 hover:border-pink-400 transition-all"
                onClick={() => setShowOptions(!showOptions)}
            >
                {previewUrl ? (
                    <img src={previewUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                    <LuUser size={36} className="text-gray-500" />
                )}
            </div>

            {showOptions && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-md w-32 z-10 py-1 text-sm text-gray-700">
                    <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-pink-100" onClick={onChooseFile}>
                        <LuUpload /> Upload
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