import React from 'react'

const CertificationInfo = ({ title, issuer, year, bgColor }) => {
    return (
        <div>
            <h3 className={`text-[12px] font-bold text-gray-900`}>{title}</h3>
            <div className='flex items-center gap-2'>
                {year && (
                    <div
                        className='text-[10px] font-bold text-gray-800 px-3 py-0.5 inline-block rounded-lg'
                        style={{ backgroundColor: bgColor }}
                    >
                        {year}
                    </div>
                )}

                <p className='text-[12px] text-gray-700 font-medium '>
                    {issuer}
                </p>
            </div>
        </div>
    )
}
export default CertificationInfo