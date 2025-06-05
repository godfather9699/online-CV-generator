import React from 'react'; 
import ProfilePhotoSelector from '../../../components/Inputs/ProfilePhotoSelector';
import Input from '../../../components/Inputs/Input';


const ProfileInfoForm = ({
    profileData,
    updateSection,
    previewUrl,
    setPreviewUrl
}) => {
    return (
        <div className='px-5 pt-5'>
            <h2 className='text-lg font-semibold text-gray-900'>
                Personal Informmation
            </h2>

            <div className='mt-4'>
                <ProfilePhotoSelector
                    image={profileData?.profileImg || profileData?.profilePreviewUrl}
                    preview={previewUrl}
                    setImage={(file) => {
                        updateSection('profileInfo','profileImg', file); 
                    }}
                    setPreview={setPreviewUrl}
                />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Input
                        value={profileData?.fullName || ''}
                        onChange={(e) => { updateSection('profileInfo', 'fullName', e.target.value) }}
                        label='Full Name'
                        placeholder='John'
                        type='text'
                    />

                    <Input
                        value={profileData?.designation || ''}
                        onChange={(e) => updateSection('profileInfo', 'designation', e.target.value)}
                        label='Designation'
                        placeholder='Sr. Manager'
                        type='text'
                    />

                    <div className='col-span-2 mt-3'>
                        <label className='text-xs font-medium text-slate-600'>
                            Description
                        </label>
                        <textarea
                            className='form-input'
                            placeholder='Description'
                            rows={4}
                            value={profileData?.summary || ''}
                            onChange={(e) => { updateSection('profileInfo', 'summary', e.target.value) }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileInfoForm