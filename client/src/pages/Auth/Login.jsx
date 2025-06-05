import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email and password
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    // login API call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      const { token } = response.data;
      if(token){
        localStorage.setItem('token', token);
        updateUser(response.data);
        navigate('/dashboard');
      }
    } catch (error) {
      if(error.response && error.response.data.message) {
        setError('Invalid email or password');
      }else{
        console.error('Login failed:', error);
        setError('An error occurred while logging in. Please try again later.');
      }
    }
  };
  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Welcome Back</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'> Pleaase enter your details</p>

      <form onSubmit={handleLogin}>

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
          placeholder='*******'
          type='password'
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
        <button type='submit' className='btn-primary'>
          LOGIN
        </button>

        <p className='text-[13px] text-slate-800 mt-3'>Don't have an Account
          <button
            type="button"
            className='font-medium text-primary underline cursor-pointer ml-1'
            onClick={() => {
              setCurrentPage('signup')
            }}
          >
            Create here
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login
