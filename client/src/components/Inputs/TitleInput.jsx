import React, { useState } from 'react';
import { LuCheck, LuPencil } from 'react-icons/lu';


const TitleInput = ({ title, setTitle }) => {

    const [showInput, setShowInput] = useState(false);

    return (
        <div className='flex item-center gap-3'>
            {showInput ? (
                <>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Resume title'
                        className='text-sm md:text-[17px] bg-transparent outline-none text-black font-semibold border-b border-gray-300
                        pb-1'
                    />
                    <button className='cursor-pointer'>
                        <LuCheck
                            className='text-[16px] text-purple-600'
                            onClick={() => setShowInput((prev) => !prev)}
                        />
                    </button>
                </>
            ) : (
                <>
                    <h2 className='text-sm md:text-[17px] font-semibold'>{title}</h2>
                    <button>
                        <LuPencil
                            className='text-[16px] text-purple-600'
                            onClick={() => setShowInput((prev) => !prev)}
                        />
                    </button>
                </>
            )}
        </div>
    )
}

export default TitleInput
