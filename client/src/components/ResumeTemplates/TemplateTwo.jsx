import React, { useEffect, useRef, useState } from 'react';
import {
    LuMapPinHouse,
    LuMail,
    LuPhone,
    LuRss,
    LuGithub,
    LuUser,
} from 'react-icons/lu';
import { RiLinkedinLine } from 'react-icons/ri';
import ContactInfoForm from '../../pages/ResumeUpdate/Form/ContactInfoForm';
import { formatYearMoth } from '../../utils/helper';
import ContactInfo from '../ResumeSections/ContactInfo';
import EducationInfo from '../ResumeSections/EducationInfo';
import LanguageSection from '../ResumeSections/LanguageSection';
import WorkExperience from '../ResumeSections/workExperience';
import ProjectInfo from '../ResumeSections/ProjectInfo';
import SkillSection from '../ResumeSections/SkillSection';
import CertificationInfo from '../ResumeSections/CertificationInfo';
const DEFAULT_THEME = ['#EBFDFF', '#A1F4FD', '#CEFAFE', '#00B8DB', '#4A5565'];

const Title = ({ text, color }) => {
    return (
        <div className='relative w-fit mb-2.5'>
            <span
                className='absolute bottom-0 left-0 w-full h-1'
                style={{ backgroundColor: color }}
            ></span>
            <h2 className={`relative text-sm font-bold`}>{text}</h2>
        </div>
    )
}

const TemplateTwo = ({
    resumeData,
    colorPalette,
    containerWidth,
}) => {

    const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;

    const resumeRef = useRef(null);
    const [baseWidth, setBaseWidth] = useState(900) // Default Value
    const [scale, setScale] = useState(1);

    useEffect(() => {
        // Calculate the scale factor based on the container width
        const actualBaseWidth = resumeRef.current.offsetWidth;
        setBaseWidth(actualBaseWidth); // Get actual base width
        setScale(containerWidth / baseWidth);
    }, [containerWidth])

    return (
        <div
            ref={resumeRef}
            className='p-3 bg-white'
            style={{
                transform: containerWidth > 0 ? `scale(${scale})` : 'none',
                transformOrigin: 'top left',
                width: containerWidth > 0 ? `${baseWidth}px` : 'auto', // keep the orginal size so the scaling work correctly
                height: 'auto',
            }}
        >
            <div className='px-10 pt-10'>
                <div className='flex justify-between w-full mb-5'>
                    <div
                        className='h-[120px] w-[120px] max-w-[140px] max-h-[140px] rounded-2xl flex items-center justify-center'
                        style={{ backgroundColor: themeColors[2] }}
                    >
                        {resumeData.profileInfo.profilePreviewUrl ? (
                            <img
                                src={resumeData.profileInfo.profilePreviewUrl}
                                className='w-[95px] h-[110px] object-cover rounded-2xl'
                            />
                        ) : (
                            <div
                                className='w-[140px] h-[140px] flex items-center justify-center text-5xl roundede-full'
                                style={{ color: themeColors[3] }}
                            >
                                <LuUser />
                            </div>
                        )}
                    </div>

                    <div className='px-4 w-[100%] flex flex-col gap-3'>
                        <div className='flex flex-col w-[100%] items-center'>
                            <div className='flex w-full justify-between'>
                                <div className='flex flex-col gap-1'>

                                    <h2 className='text-2xl font-bold'>
                                        {resumeData.profileInfo.fullName}
                                    </h2>
                                    <p className='text-sm'>
                                        {resumeData.profileInfo.designation}
                                    </p>


                                    <ContactInfo
                                        icon={<LuMapPinHouse />}
                                        iconBG={themeColors[2]}
                                        value={resumeData.contactInfo.location}
                                    />

                                </div>

                                <div className='flex flex-col gap-5 mt-2'>
                                    <ContactInfo
                                        icon={<LuMail />}
                                        iconBG={themeColors[2]}
                                        value={resumeData.contactInfo.email}
                                    />

                                    <ContactInfo
                                        icon={<LuPhone />}
                                        iconBG={themeColors[2]}
                                        value={resumeData.contactInfo.phone}
                                    />
                                </div>


                            </div>
                        </div>
                        <div className='flex flex-wrap gap-x-5 gap-y-2'>
                            <div className='col-span-6'>
                                {resumeData.contactInfo.linkedin && (
                                    <ContactInfo
                                        icon={<RiLinkedinLine />}
                                        iconBG={themeColors[2]}
                                        value={resumeData.contactInfo.linkedin}
                                    />
                                )}
                            </div>
                            <div className='col-span-6'>
                                {resumeData.contactInfo.github && (
                                    <ContactInfo
                                        icon={<LuGithub />}
                                        iconBG={themeColors[2]}
                                        value={resumeData.contactInfo.github}
                                    />
                                )}
                            </div>
                            <div className='col-span-6'>
                                <ContactInfo
                                    icon={<LuRss />}
                                    iconBG={themeColors[2]}
                                    value={resumeData.contactInfo.website}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className='mx-10 pb-5'>
                <div className='mb-2'>
                    <Title text='Professional Summary' color={themeColors[1]} />
                    <p className='text-xs font-medium'>{resumeData.profileInfo.summary}</p>
                </div>

                <div className=''>
                    <Title text='Work Experience' color={themeColors[1]} />

                    {resumeData.workExperience.map((data, index) => (
                        <WorkExperience
                            key={`work_${index}`}
                            company={data.company}
                            role={data.role}
                            duration={`${formatYearMoth(data.startDate)} - ${formatYearMoth(data.endDate) || 'present'}`}
                            durationColor={themeColors[4]}
                            description={data.description}
                        />
                    ))}
                </div>

                <div className=''>
                    <Title text='Projects' color={themeColors[1]} />

                    {resumeData.projects.map((project, index) => (
                        <ProjectInfo
                            key={`project_${index}`}
                            title={project.title}
                            description={project.description}
                            githubLink={project.github}
                            liveDemo={project.liveDemo}
                            bgColor={themeColors[2]}
                        />
                    ))}
                </div>

                <div className=''>
                    <Title text='Education' color={themeColors[1]} />
                    <div className='grid grid-cols-2 gap-3'>
                        {resumeData.education.map((data, index) => (
                            <EducationInfo
                                key={`education_${index}`}
                                degree={data.degree}
                                institution={data.institution}
                                duration={`${formatYearMoth(data.startDate)} - ${formatYearMoth(data.endDate) || 'present'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className=''>
                    <Title text='Certifications' color={themeColors[1]} />
                    <div className='grid grid-cols-2 gap-5'>
                        {resumeData.certifications?.map((data, index) => (
                            <CertificationInfo
                                key={`cart_${index}`}
                                title={data.title}
                                issuer={data.issuer}
                                year={data.year}
                                bgColor={themeColors[2]}
                            />
                        ))}
                    </div>
                </div>

                <div className=''>
                    <Title text='Skills' color={themeColors[1]} />

                    <SkillSection
                        skills={resumeData.skills}
                        accentColor={themeColors[3]}
                        bgColor={themeColors[2]}
                    />
                </div>

                <div className='grid grid-cols-2 gap-10 '>
                    <div className=''>
                        <Title text='Languages' color={themeColors[1]} />
                        <LanguageSection
                            languages={resumeData.languages}
                            accentColor={themeColors[3]}
                            bgColor={themeColors[2]}
                        />
                    </div>

                    {resumeData.interests.length > 0 && resumeData.interests[0] !== '' && (
                        <div className=''>
                            <Title text='Intersets' color={themeColors[1]} />
                            <div className='flex items-center flex-wrap gap-2 mt-4'>
                                {resumeData.interests.map((interest, index) => {
                                    if (!interest) return null;
                                    return (
                                        <span
                                            key={`interest_${index}`}
                                            className='text-[11px] font-semibold px-2 py-0.5 rounded-lg'
                                            style={{
                                                backgroundColor: themeColors[2],
                                            }}
                                        >
                                            {interest}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TemplateTwo  