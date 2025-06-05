import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    // Handle profile pic upload
    let profilePicUrl = '';

    // Validate name, email and password
    if (!name) {
      setError('Name is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    // signup API call
    if (profilePic) {
      const imageUploadResponse = await uploadImage(profilePic);
      profilePicUrl = imageUploadResponse.imageUrl || ''; // Assuming the response contains the URL
    }
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name,
        email,
        password, 
        profileImageUrl: profilePicUrl
      });

      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError('Invalid email or password');
      } else {
        console.error('Login failed:', error);
        setError('An error occurred while logging in. Please try again later.');
      }
    }
  };
  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Create an Account</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'> Join us today, by enter your details</p>

      <form onSubmit={handleSignUp}>

        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          label='Enter UserName'
          placeholder='john mathew'
          type='text'
        />

        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label='Email Address'
          placeholder='john@example.com'
          type='text'
        />

        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label='Password'
          placeholder='•••••••••'
          type='password'
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
        <button type='submit' className='btn-primary'>
          SIGN UP
        </button>

        <p className='text-[13px] text-slate-800 mt-3'>Already have an have an Account
          <button
            type="button"
            className='font-medium text-primary underline cursor-pointer ml-1'
            onClick={() => {
              setCurrentPage('login')
            }}
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  )
}

export default SignUp
