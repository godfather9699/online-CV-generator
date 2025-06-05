import React from 'react';
import { LuGithub, LuExternalLink } from 'react-icons/lu';
import ActionLink from './ActionLink';

const ProjectInfo = ({
    title,
    description,
    githubLink,
    liveDemo,
    bgColor,
    isPreview
}) => {
    return (
        <div className='mb-5'>
            <h3 className={`${isPreview ? 'text-xs' : 'text-base'} font-semibold text-grsy-900`}>
                {title}
            </h3>

            <p className='text-sm text-gray-700 font-medium mt-1'>
                {description}
            </p>

            <div className='flex items-start gap-5 mt-2'>
                {githubLink &&
                    <ActionLink
                        icon={<LuGithub />}
                        link={githubLink}
                        bgColor={bgColor}
                    />
                }
                {liveDemo &&
                    <ActionLink
                        icon={<LuExternalLink />}
                        link={liveDemo}
                        bgColor={bgColor}
                    />
                }
            </div>
        </div>
    )
}

export default ProjectInfo
