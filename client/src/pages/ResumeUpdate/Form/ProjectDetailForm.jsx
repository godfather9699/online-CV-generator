import React from 'react';
import Input from '../../../components/Inputs/Input';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

const ProjectDetailForm = ({
    projectInfo,
    updateArrayItem,
    addArrayItem,
    removeArrayItem
}) => {
    return (
        <div className='px-5 pt-5'>
            <h2 className='text-lg font-semibold text-gray-900'>Projects</h2>

            <div className='mt-4 flex flex-col gap-4 mb-3'>
                {projectInfo.map((project, index) => (
                    <div
                        key={index}
                        className='border border-gray-200/80 p-4 rounded-lg relative'
                    >
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='col-span-2'>
                                <Input
                                    label='ProjectTitle'
                                    placeholder='Portfolio Website'
                                    type='text'
                                    value={project.title || ''}
                                    onChange={(e) => {
                                        updateArrayItem(index, 'title', e.target.value)
                                    }}
                                />
                            </div>

                            <div className='col-span-2'>
                                <label className='text-xs font-medium text-slate-600'>
                                    Description
                                </label>
                                <textarea
                                    placeholder='description about project'
                                    className='form-input w-full mt-1'
                                    value={project.description || ''}
                                    onChange={(e) => {
                                        updateArrayItem(index, 'description', e.target.value)
                                    }}
                                />
                            </div>

                            <Input
                                label='Github Link'
                                placeholder='http://github.com/username/project'
                                type='url'
                                value={project.github || ''}
                                onChange={(e) =>
                                    updateArrayItem(index, 'github', e.target.value)
                                }
                            />

                            <Input
                                label='Live Demo URL'
                                placeholder='http://yourproject.com/live'
                                type='url'
                                value={project.liveDemo || ''}
                                onChange={(e) =>
                                    updateArrayItem(index, 'liveDemo', e.target.value)
                                }
                            />
                        </div>

                        {projectInfo.length > 1 && (
                            <button
                                type='button'
                                className='absolute top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer'
                                onClick={(index) => removeArrayItem(index)}
                            >
                                <LuTrash2 />
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type='button'
                    className='self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 cursor-pointer'
                    onClick={() => addArrayItem(
                        {
                            titile: '',
                            description: '',
                            github: '',
                            liveDemo: ''
                        }
                    )}
                >
                    <LuPlus /> Add Project
                </button>
            </div>
        </div>
    )
}

export default ProjectDetailForm
