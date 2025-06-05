import React from 'react';
import Input from '../../../components/Inputs/Input';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css';
import "flag-icons/css/flag-icons.min.css";

const ContactInfoForm = ({ contactInfo, updateSection }) => {
    return (
        <div className='px-5 pt-5'>
            <h2 className='text-lg font-semiBold text-gray-900'>
                Contact Information
            </h2>

            <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='col-span-2'>
                    <Input
                        label='Address'
                        placeholder='Current Address'
                        value={contactInfo.location || ''}
                        onChange={(e) => { updateSection('location', e.target.value) }}
                        type='text'
                    />
                </div>

                <Input
                    label='Email'
                    placeholder='johnduo@example.com'
                    value={contactInfo.email || ''}
                    onChange={(e) => { updateSection('email', e.target.value) }}
                    type='email'
                />

                <div>
                    <label className='text-[13px] text-slate-800'>
                        Phone Number
                    </label>
                    <div className='input-box'>
                        <PhoneInput
                            country='us'
                            enableSearch
                            value={contactInfo.phone || ''}
                            onChange={phone => {
                                const e164 = phone.startsWith('+') ? phone : '+' + phone;
                                updateSection('phone', e164);
                            }}
                            containerClass='w-full'
                            containerStyle={{
                                height: '20px'
                            }}
                            inputClass='w-full bg-transparent outline-none font-normal tracking-normal'
                            inputStyle={{
                                height: '20px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                outline: 'none',
                                fontWeight: '300',
                                lineHeight: '0rem',
                                fontFamily: 'Urbanist'
                            }}
                        />
                    </div>
                </div>

                <Input
                    label='LinkedIn'
                    placeholder='http://linked.com/in/username'
                    value={contactInfo.linkedin || ''}
                    onChange={(e) => { updateSection('linkedin', e.target.value) }}
                    type='text'
                />

                <Input
                    label='Github'
                    placeholder='http://github.com/in/username'
                    value={contactInfo.github || ''}
                    onChange={(e) => { updateSection('github', e.target.value) }}
                    type='text'
                />
            </div>

            <div className='md:col-span-2'>
                <Input
                    label='Website'
                    placeholder='http://yourwebsite.com/in/username'
                    value={contactInfo.website || ''}
                    onChange={(e) => { updateSection('website', e.target.value) }}
                    type='text'
                />
            </div>
        </div>

    )
}

export default ContactInfoForm
