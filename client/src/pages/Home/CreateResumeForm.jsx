import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

const CreateResumeForm = ( ) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Handle Create Resume
const handleCreateResume = async (e) => {
  e.preventDefault();
  if (!title.trim()) {
    setError('Title is required');
    return;
  }
  setError('');

  try {
    const { data } = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
      title: title.trim(),
    });

    const newId = data.resume?._id;
    if (newId) {
      setTitle('');
      //console.log('new resume id:', newId);
      navigate(`/resume/${newId}`);
    } else {
      console.error('No resume ID returned', data);
      setError('Unexpected server response');
    }
  } catch (err) {
    if (err.response?.data) {
      setError(err.response.data.message || 'Failed to create resume');
    } else {
      setError('An unexpected error occurred');
    }
  }
};

  return (
    <div className='w-[90vw] md:w-[70vh] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Create New Resume</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-3'>
        Give your resume title to get started.
        You can change it later.
      </p>

      <form onSubmit={handleCreateResume}>
        <Input
          type='text'
          placeholder='Eg: Mike`s Resume'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error}
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
        <button
          type='submit'
          className='btn-primary'
        >
          Create Resume
        </button>
      </form>
    </div>
  )
}

export default CreateResumeForm
