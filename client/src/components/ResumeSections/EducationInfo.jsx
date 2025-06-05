import React from 'react'

const EducationInfo = ({
    degree,
    institution,
    duration
}) => {
    return (
        <div className='mb-5'>
            <h3 className='text-[14px] font-semibold text-gray-900'>{degree}</h3>
            <p className='text-sm text-gray-700 font-medium'>{institution}</p>
            <p className='text-[11px] text-gray-500 italic mt-0.5'>{duration}</p>
        </div>
    )
}

export default EducationInfo
