import React from 'react'
import Progress from '../Progress'


const LanguageInfo = ({ language, bgColor, accentColor, progress }) => {
    return (
        <div className='flex items-center justify-between'>
            <p className='text-[12px] font-medium text-gray-900'>{language}</p>
            {progress > 0 && (
                <Progress
                    progress={(progress / 100) * 5}
                    color={accentColor}
                    bgColor={bgColor}
                />
            )}
        </div>
    )
}

const LanguageSection = ({ languages, bgColor, accentColor }) => {
    return (
        <div className='flex flex-col gap-2'>
            {languages.map((language, index) => (
                <LanguageInfo
                    key={`sLanguage_${index}`}
                    language={language.name}
                    progress={language.progress}
                    accentColor={accentColor}
                    bgColor={bgColor}
                />
            ))}
        </div>
    )
}

export default LanguageSection