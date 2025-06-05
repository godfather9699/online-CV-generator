import React from 'react';
import Input from '../../../components/Inputs/Input';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import { FaLanguage } from 'react-icons/fa6';
import RatingInput from '../../../components/ResumeSections/RatingInput';

const AdditionalInfoForm = ({
    languages,
    interests,
    updateArrayItem,
    addArrayItem,
    removeArrayItem
}) => {
    return (
        <>
            {/* Languages  Section */}

            <div className='px-5 pt-5'>
                <h2 className='text-lg font-semibold text-gray-900'>Additional Informations</h2>

                <div className='mt-6'>
                    <h3 className='text-sm font-semibold text-gray-700 mb-2'>Languages</h3>

                    <div className='flex flex-col gap-4'>

                        {languages.map((lang, index) => (
                            <div
                                key={index}
                                className='border border-gray-200 p-4 rounded-lg relative'
                            >
                                <div className='grid grid-cols-1 md:grid-cols-2 items-start gap-4'>
                                    <Input
                                        label='Language'
                                        placeholder='English / Hindi / etc.'
                                        value={lang.name || ''}
                                        onChange={(e) => updateArrayItem('languages', index, 'name', e.target.value)}
                                    />


                                    <div>
                                        <label className='text-xs font-medium text-slate-700 mb-7 block'>
                                            Proficiency
                                        </label>
                                        <RatingInput
                                            value={lang.progress || 0}
                                            onChange={(newValue) => updateArrayItem('languages', index, 'progress', newValue)}
                                            activeColor='#0EA5E9'
                                            inActiveColor='#E0F2FE'
                                        />
                                    </div>
                                </div>

                                {languages.length > 1 && (
                                    <button
                                        type='button'
                                        className='absolute right-3 top-3 text-sm text-red-600 hover:underline cursor-pointer'
                                        onClick={(index) => removeArrayItem('languages', index)}
                                    >
                                        <LuTrash2 />
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type='button'
                            className='self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 cursor-pointer'
                            onClick={() =>
                                addArrayItem('languages', { name: '', progress: 0 })
                            }
                        >
                            <LuPlus /> Add Language
                        </button>
                    </div>
                </div>
            </div>

            {/* {console.log(languages,interests)} */}

            {/* Interests Section */}

            <div className='mt-8 mb-4 px-5'>
                <h3 className='text-sm font-semibold text-gray-700 mb-2'>Interests</h3>
                <div className='flex flex-col gap-4'>

                    {interests.map((interest, index) => (
                        <div
                            key={index}
                            className='border border-gray-200 p-4 rounded-lg relative'
                        >
                            <Input
                                placeholder='e.g. Reading, Singing, etc.'
                                value={interest || ''}
                                onChange={(e) => updateArrayItem('interests', index, null, e.target.value)}
                            />

                            {interests.length > 1 && (
                                <button
                                    type='button'
                                    className='absolute right-3 top-3 text-sm text-red-600 hover:underline cursor-pointer'
                                    onClick={(index) => removeArrayItem('interests', index)}
                                >
                                    <LuTrash2 />
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type='button'
                        className='self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 cursor-pointer'
                        onClick={() =>
                            addArrayItem('interests', '')
                        }
                    >
                        <LuPlus /> Add Interest
                    </button>
                </div>
            </div>
        </>
    )
}

export default AdditionalInfoForm
