import React from 'react';
import Input from '../../../components/Inputs/Input';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

const CertificationInfoForm = ({
  certificateInfo,
  updateArrayItem,
  addArrayItem,
  removeArrayItem
}) => {
  return (
    <div className='px-5 pt-5'>
      <h2 className='text-lg font-semibold text-gray-900'>Certifications</h2>

      <div className='mt-4 flex flex-col gap-4 mb-3'>
        {certificateInfo.map((certificate, index) => (
          <div
            key={index}
            className='border border-gray-200/80 p-4 rounded-lg relative'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                label='Certificate Title'
                placeholder='IBM FullStack Web Developer'
                type='text'
                value={certificate.title || ''}
                onChange={(e) =>
                  updateArrayItem(index, 'title', e.target.value)
                }
              />

              <Input
                label='Issuer'
                placeholder='Coursera / Google / etc.'
                type='text'
                value={certificate.issuer || ''}
                onChange={(e) =>
                  updateArrayItem(index, 'issuer', e.target.value)
                }
              />

              <Input
                label='Year'
                placeholder='2024'
                type='text'
                value={certificate.year || ''}
                onChange={(e) =>
                  updateArrayItem(index, 'year', e.target.value)
                }
              />
            </div>

            {certificateInfo.length > 1 && (
              <button
                type='button'
                className='absolute right-3 top-3 text-sm text-red-600 hover:underline cursor-pointer'
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
          onClick={() =>
            addArrayItem({
              title: '',
              issuer: '',
              year: '',
            })
          }
        >
          <LuPlus /> Add Certification
        </button>
      </div>
    </div>
  )
}

export default CertificationInfoForm
