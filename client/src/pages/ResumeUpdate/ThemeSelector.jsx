import React, { useEffect, useRef, useState } from 'react';
import { DUMMY_RESUME_DATA, resumeTemplates, themeColorPalette } from '../../utils/data';
import Tabs from '../../components/Tab';
import { LuCircleCheckBig } from 'react-icons/lu';
import TemplateCard from '../../components/Cards/TemplateCard';
import RenderResume from '../../components/ResumeTemplates/RenderResume';

const TAB_DATA = [
    { label: 'Templates' },
    { label: 'Color Palettes' }
];

const ThemeSelector = ({ selectedTheme, setSelectedTheme, resumeData, onClose }) => {
    const resumeRef = useRef(null);
    const [baseWidth, setBaseWidth] = useState(800);
    const [tabValue, setTabValue] = useState('Templates');
    const [selectedTemplate, setSelectedTemplate] = useState({
        theme: selectedTheme?.theme || '',
        index: -1
    });
    const [selectedColorPalette, setSelectedColorPalette] = useState({
        colors: selectedTheme?.colorPalette || [],
        index: -1
    });

    const handleThemeSelection = () => {
        setSelectedTheme({
            theme: selectedTemplate?.theme,
            colorPalette: selectedColorPalette?.colors
        });
        onClose();
    };

    const updateBaseWidth = () => {
        if (resumeRef.current) {
            // if you need to track width for a live preview…
            // setBaseWidth(resumeRef.current.offsetWidth);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', updateBaseWidth);
        return () => window.removeEventListener('resize', updateBaseWidth);
    }, []);

    return (
        <div className="container relative mx-auto px-2 md:px-0">
            <div className="flex sticky top-0 bg-white items-center justify-between mb-2 mt-2">
                <Tabs tabs={TAB_DATA} activeTab={tabValue} setActiveTab={setTabValue} />
                <button
                    className="btn-small-light"
                    onClick={() => handleThemeSelection()}
                >
                    <LuCircleCheckBig className="text-[16px]" /> Done
                </button>
            </div>

            <div className="grid grid-cols-12 gap-5">
                {/* Left pane: Templates */}
                <div className="col-span-12 md:col-span-5 bg-white">

                    <div className="grid grid-cols-2 gap-5 max-h-[80vh] overflow-scroll custom-scrollbar md:pr-5">
                        {tabValue === 'Templates' &&
                            resumeTemplates.map((template, index) => (
                                <TemplateCard
                                    key={`templates_${index}`}
                                    thumbnailImg={template.thumbnailImg}
                                    isSelected={selectedTemplate.index === index}
                                    onSelect={() =>
                                        setSelectedTemplate({ theme: template.id, index })
                                    }
                                />
                            ))}

                        {/* …Color Palettes tab goes here… */}
                        {tabValue === 'Color Palettes' &&
                            themeColorPalette.themeOne.map((colors, index) => (
                                <ColorPalette
                                    key={`palette_${index}`}
                                    colors={colors}
                                    isSelected={selectedColorPalette?.index === index}
                                    onSelect={() => setSelectedColorPalette({ colors, index })}
                                />
                            ))
                        }
                    </div>
                </div>

                {/* Right pane (preview area, if any) */}
                <div className="col-span-12 md:col-span-7 bg-white -mt-3" ref={resumeRef}>
                    {/* live‐preview code… */}
                    <RenderResume
                        templateId={selectedTemplate?.theme || ''}
                        resumeData={resumeData || DUMMY_RESUME_DATA}
                        containerWidth={baseWidth}
                        colorPalette={selectedColorPalette?.colors || []}
                    />
                </div>
            </div>
        </div>
    );
};

export default ThemeSelector;


const ColorPalette = ({ colors, isSelected, onSelect }) => {
    return (
        <div
            className={`h-28 w-auto flex rounded-lg overflow-hidden border-2 cursor-pointer ${isSelected ? 'border-purple-400' : 'border-transparent'}`}
        >
            {colors.map((color, index) => (
                <div
                    key={`color_${index}`}
                    className='flex-1'
                    style={{ backgroundColor: color }}
                    onClick={() => onSelect()}
                />
            ))}
        </div >
    )
}