import React from 'react';
import Input from '../../../components/Inputs/Input';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

const WorkExperienceForm = ({
    workExperience,
    updateArrayItem,
    addArrayItem,
    removeArrayItem
}) => {
    return (
        <div className='px-5 pt-5'>
            <h2 className='text-lg font-semiBold text-gray-900'>Work Experience</h2>

            <div className='mt-4 flex flex-col gap-4 mb-3'>
                {workExperience.map((experience, index) => (
                    <div
                        key={index}
                        className='border border-gray-200/80 p-4 rounded-lg relative'
                    >
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <Input
                                label='Company'
                                placeholder='ABC Corp ltd.'
                                type='text'
                                value={experience.company || ''}
                                onChange={(e) => {
                                    updateArrayItem(index, 'company', e.target.value)
                                }}
                            />

                            <Input
                                label='Role'
                                placeholder='Frontend Developer'
                                type='text'
                                value={experience.role || ''}
                                onChange={(e) => {
                                    updateArrayItem(index, 'role', e.target.value)
                                }}
                            />

                            <Input
                                label='Start Date'
                                type='month'
                                value={experience.startDate || ''}
                                onChange={(e) => {
                                    updateArrayItem(index, 'startDate', e.target.value)
                                }}
                            />

                            <Input
                                label='End Date'
                                type='month'
                                value={experience.endDate || ''}
                                onChange={(e) => {
                                    updateArrayItem(index, 'endDate', e.target.value)
                                }}
                            />
                        </div>
                        <div className='mt-4'>
                            <label className='text-xs font-medium text-slate-600'>
                                Description
                            </label>
                            <textarea
                                className='form-input w-full mt-1'
                                placeholder='what did you do in this role?'
                                rows={3}
                                value={experience.description || ''}
                                onChange={(e) => {
                                    updateArrayItem(index, 'description', e.target.value)
                                }}
                            />
                        </div>

                        {workExperience.length > 1 && (
                            <button
                                type='button'
                                className='absolute top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer'
                                onClick={() => { removeArrayItem(index) }}
                            >
                                <LuTrash2 />
                            </button>
                        )}
                    </div>

                ))}

                <button
                    type='button'
                    className='self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 cursor-pointer'
                    onClick={() => addArrayItem({
                        company: '',
                        role: '',
                        startDate: '',
                        endDate: '',
                        description: ''
                    })}
                >
                    <LuPlus /> Add work experience
                </button>
            </div>
        </div>
    )
}

export default WorkExperienceForm
