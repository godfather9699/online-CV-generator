import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LuArrowLeft,
  LuArrowRight,
  LuCircleAlert,
  LuDownload,
  LuPalette,
  LuSave,
  LuTrash2
} from 'react-icons/lu';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import TitleInput from '../../components/Inputs/TitleInput';
import { useReactToPrint } from 'react-to-print';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import StepProgress from '../../components/StepProgress';
import ProfileInfoForm from './Form/ProfileInfoForm';
import ContactInfoForm from './Form/ContactInfoForm';
import WorkExperienceForm from './Form/WorkExperienceForm';
import EducationInfoForm from './Form/EducationInfoForm';
import SkillsInfoForm from './Form/SkillsInfoForm';
import ProjectDetailForm from './Form/ProjectDetailForm';
import CertificationInfoForm from './Form/CertificationInfoForm';
import AdditionalInfoForm from './Form/AdditionalInfoForm';
import RenderResume from '../../components/ResumeTemplates/RenderResume';
import { captureElementAsImage, dataURLtoFile, fixTailwindColors } from '../../utils/helper';
import ThemeSelector from './ThemeSelector';
import Modal from '../../components/Modal';

const EditResume = () => {

  const { resumeId } = useParams();
  const navigate = useNavigate();

  const resumeRef = useRef(null);
  const resumeDownloadRef = useRef(null);



  const [baseWidth, setBaseWidth] = useState(0);
  const [openthemeSeletor, setOpenthemeSeletor] = useState(0);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('profile-info');
  const [progress, setProgress] = useState(0);
  const [resumeData, setResumeData] = useState({
    title: '',
    thumbnailLink: '',
    profileInfo: {
      profileImg: null,
      profilePreviewUrl: '',
      fullName: '',
      designation: '',
      summary: '',
    },
    template: {
      theme: '',
      colorPalette: [],
    },
    contactInfo: {
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: ''
    },
    workExperience: [
      {
        company: '',
        role: '',
        startDate: '', //e.g. '2022-01'
        endDate: '',   //e.g. '2023-01'
        description: ''
      }
    ],
    education: [
      {
        degree: '',
        institution: '',
        startDate: '',
        endDate: ''
      }
    ],
    skills: [
      {
        name: '',
        progress: 0    // percentage value (0-100)
      }
    ],
    projects: [
      {
        title: '',
        description: '',
        github: '',
        liveDemo: ''
      }
    ],
    certifications: [
      {
        title: '',
        issuer: '',
        year: ''
      }
    ],
    languages: [
      {
        name: '',
        progress: 0
      }
    ],
    interests: ['']
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate Inputs
  const validateAndNext = () => {
    const errors = [];

    switch (currentPage) {
      case 'profile-info':
        const {
          fullName = '', designation = '', summary = '' } = resumeData.profileInfo || {};
        if (!fullName.trim()) errors.push('Full Name required');
        if (!designation.trim()) errors.push('Designation is required');
        if (!summary.trim()) errors.push('Description is required');
        break;

      case 'contact-info':
        const { email = '', phone = '' } = resumeData.contactInfo || {};
        // use .test, not .text
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
          errors.push('Valid Email required');
        }
        if (!phone.trim() || phone.trim().length < 10) {
          errors.push('Valid 10-digit number required');
        }
        break;

      case 'work-experience':
        resumeData.workExperience.forEach(({ company, role, startDate, endDate }, idx) => {
          if (!company.trim()) errors.push(`Company required in item ${idx + 1}`);
          if (!role.trim()) errors.push(`Role required in item ${idx + 1}`);
          if (!startDate || !endDate) {
            errors.push(`Dates required in item ${idx + 1}`);
          }
        });
        break;

      case 'education-info':
        resumeData.education.forEach(() => {
          ({ degree, institution, startDate, endDate }, index) => {
            if (!degree.trim()) {
              errors.push(`Degree Name required in Education detail ${index + 1}`);
            }
            if (!institution.trim()) {
              errors.push(`Institution Name required in Education detail ${index + 1}`);
            }
            if (!startDate || !endDate) {
              errors.push(`Start & End Date required in Experience ${index + 1}`);
            }
          }
        })
        break;

      case 'skills':
        resumeData.skills.forEach(() => {
          ({ name, progress }, index) => {
            if (!name.trim()) {
              errors.push(`Skill Name required in skill ${index + 1}`);
            }
            if (progress < 1 && progress > 100) {
              errors.push(`Skill Progress required in skill ${index + 1}`);
            }
          }
        })
        break;

      case 'projects':
        resumeData.projects.forEach(() => {
          ({ title, description }, index) => {
            if (!title.trim()) {
              errors.push(`Project title is required ${index + 1}`);
            }
            if (!description.trim()) {
              errors.push(`Project description is required ${index + 1}`);
            }
          }
        })
        break;

      case 'certifications':
        resumeData.certifications.forEach(() => {
          ({ title, issuer }, index) => {
            if (!title.trim()) {
              errors.push(`Certificate title is required ${index + 1}`);
            }
            if (!issuer.trim()) {
              errors.push(`Certificate issuer is required ${index + 1}`);
            }
          }
        })
        break;

      case 'additional-info':
        if (!resumeData.languages.length || !resumeData.languages[0].name.trim()) {
          errors.push('At least one language is required');
        }
        if (!resumeData.interests.length || !resumeData.interests[0].trim()) {
          errors.push('At least one interest is required');
        }
        break;
    }

    // fix length typo
    if (errors.length > 0) {
      setErrorMsg(errors.join(', '));
      return;
    }

    setErrorMsg('');
    gotToNextStep();
  };

  // funnction to navigate to next page
  const gotToNextStep = () => {
    const pages = [
      'profile-info',
      'contact-info',
      'work-experience',
      'education-info',
      'skills',
      'projects',
      'certifications',
      'additional-info',
    ]

    if (currentPage === 'additional-info') setOpenPreviewModal(true);

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentPage(pages[nextIndex]);

      // Set Progress as Percentage
      const percent = Math.round((nextIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behaviour: 'smooth' })
    }
  }

  // function to navigate to previous page
  const goToPreviousStep = () => {
    const pages = [
      'profile-info',
      'contact-info',
      'work-experience',
      'education-info',
      'skills',
      'projects',
      'certifications',
      'additional-info',
    ]

    if (currentPage === 'profile-info') navigate('/dashboard');
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentPage(pages[prevIndex]);

      // Set Progress as Percentage
      const percent = Math.round((prevIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behaviour: 'smooth' })
    }

  }

  //in the renderForm() function we render form over display to fill the neech of resume:
  const renderForm = () => {
    switch (currentPage) {
      case 'profile-info':
        return (
          <ProfileInfoForm
            profileData={resumeData.profileInfo}
            previewUrl={resumeData.profileInfo.profilePreviewUrl}
            setPreviewUrl={(url) => {
              setResumeData(prev => ({
                ...prev,
                profileInfo: { ...prev.profileInfo, profilePreviewUrl: url }
              }));
            }}
            updateSection={updateSection}
          />
        );

      case 'contact-info':
        return (
          <ContactInfoForm
            contactInfo={resumeData.contactInfo}
            // updateSection already handles nested fields under `contactInfo`
            updateSection={(key, value) => updateSection('contactInfo', key, value)}
          />
        );

      case 'work-experience':
        return (
          <WorkExperienceForm
            workExperience={resumeData.workExperience}
            updateArrayItem={(index, key, value) => {
              // ↪ edit one item in resumeData.workExperience
              updateArrayItem('workExperience', index, key, value);
            }}
            addArrayItem={(newItem) => {
              // ↪ push a new object into resumeData.workExperience
              addArrayItem('workExperience', newItem);
            }}
            removeArrayItem={(index) => {
              // ↪ remove the item at that index
              removeArrayItem('workExperience', index);
            }}
          />
        );

      case 'education-info':
        return (
          <EducationInfoForm
            educationInfo={resumeData.education}
            updateArrayItem={(index, key, value) => {
              updateArrayItem('education', index, key, value);
            }}
            addArrayItem={(newItem) => {
              addArrayItem('education', newItem);
            }}
            removeArrayItem={(index) => {
              removeArrayItem('education', index);
            }}
          />
        );

      case 'skills':
        return (
          <SkillsInfoForm
            skillsInfo={resumeData.skills}
            updateArrayItem={(index, key, value) => {
              updateArrayItem('skills', index, key, value);
            }}
            addArrayItem={(newItem) => {
              addArrayItem('skills', newItem);
            }}
            removeArrayItem={(index) => {
              removeArrayItem('skills', index);
            }}
          />
        );

      case 'projects':
        return (
          <ProjectDetailForm
            projectInfo={resumeData.projects}
            updateArrayItem={(index, key, value) => {
              updateArrayItem('projects', index, key, value);
            }}
            addArrayItem={(newItem) => {
              addArrayItem('projects', newItem);
            }}
            removeArrayItem={(index) => {
              removeArrayItem('projects', index);
            }}
          />
        );

      case 'certifications':
        return (
          <CertificationInfoForm
            certificateInfo={resumeData.certifications}
            updateArrayItem={(index, key, value) => {
              updateArrayItem('certifications', index, key, value);
            }}
            addArrayItem={(newItem) => {
              addArrayItem('certifications', newItem);
            }}
            removeArrayItem={(index) => {
              removeArrayItem('certifications', index);
            }}
          />
        );

      case 'additional-info':
        // AdditionalInfoForm edits both languages and interests arrays:
        return (
          <AdditionalInfoForm
            languages={resumeData.languages}
            interests={resumeData.interests}
            updateArrayItem={(section, index, key, value) => {
              // ‘section’ will be either 'languages' or 'interests'
              updateArrayItem(section, index, key, value);
            }}
            addArrayItem={(section, newItem) => {
              addArrayItem(section, newItem);
            }}
            removeArrayItem={(section, index) => {
              removeArrayItem(section, index);
            }}
          />
        );

      default:
        return null;
    }
  };

  // Update simple nested object (like profileInfo, contactInfo, etc.)
  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // Update array item (like workExperince[0], skills[1], etc)
  const updateArrayItem = (section, index, key, value) => {
    setResumeData(prev => {
      const newArr = [...prev[section]];

      if (key === null) {
        // interests array: each item is just a string
        newArr[index] = value;
      } else {
        // other arrays: each item is an object
        newArr[index] = {
          ...newArr[index],
          [key]: value,
        };
      }
      return {
        ...prev,
        [section]: newArr,
      };
    });
  }

  // Add array item
  const addArrayItem = (section, newItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }))
  }

  // remove item from array
  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updateArray = [...prev[section]];
      updateArray.splice(index, 1);
      return {
        ...prev,
        [section]: updateArray
      }
    })
  }

  // Fetch resume details by ID
  const fetchResumeDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.RESUME.GET_BY_ID(resumeId)
      )

      if (response.data && response.data.profileInfo) {
        const resumeInfo = response.data;

        setResumeData((prev) => ({
          ...prev,
          title: resumeInfo?.title || 'untitled',
          template: resumeInfo?.template || prev?.template,
          profileInfo: resumeInfo?.profileInfo || prev?.profileInfo,
          contactInfo: resumeInfo?.contactInfo || prev?.contactInfo,
          workExperience: resumeInfo?.workExperience || prev?.workExperience,
          education: resumeInfo?.education || prev?.education,
          skills: resumeInfo?.skills || prev?.skills,
          projects: resumeInfo?.projects || prev?.projects,
          certifications: resumeInfo?.certifications || prev?.certifications,
          languages: resumeInfo?.languages || prev?.languages,
          interests: resumeInfo?.interests || prev?.interests
        }));
      }
    } catch (error) {
      console.error('error fetching resume:', error);

    }
  }

  // upload thumbnail and resume profile page
  const uploadResumeImage = async () => {
    try {
      setIsLoading(true);
      fixTailwindColors(resumeRef.current);
      const imageDataUrl = await captureElementAsImage(resumeRef.current);

      const thumbnailFile = dataURLtoFile(
        imageDataUrl,
        `resume-${resumeId}.png`
      );

      const profileImageFile = resumeData.profileInfo.profileImg || null;

      const formData = new FormData();
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      const uploadResponse = await axiosInstance.post(
        API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      const { thumbnailLink, profilePreviewUrl } = uploadResponse.data;
      await updateResumeDetails(thumbnailLink, profilePreviewUrl);

      toast.success('Resume updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('error uploading images:', err);
      toast.error('Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  const updateResumeDetails = async (thumbnailLink, profilePreviewUrl) => {
    try {
      setIsLoading(true);

      // Build a brand‐new payload object. We never include a File anywhere here.
      // Every field must be either a string, a number, a boolean, an array of plain objects, etc.
      const payload = {
        // Top‐level fields:
        title: resumeData.title,
        thumbnailLink: typeof thumbnailLink === 'string' ? thumbnailLink : resumeData.thumbnailLink,
        template: resumeData.template,
        contactInfo: resumeData.contactInfo,
        workExperience: resumeData.workExperience,
        education: resumeData.education,
        skills: resumeData.skills,
        projects: resumeData.projects,
        certifications: resumeData.certifications,
        languages: resumeData.languages,
        interests: resumeData.interests,

        // The only “twist” is profileInfo: we explicitly set profileImg and profilePreviewUrl to strings
        profileInfo: {
          fullName: resumeData.profileInfo.fullName,
          designation: resumeData.profileInfo.designation,
          summary: resumeData.profileInfo.summary,
          profileImg: typeof profilePreviewUrl === 'string' ? profilePreviewUrl : resumeData.profileInfo.profileImg ?? '',
          profilePreviewUrl: typeof profilePreviewUrl === 'string' ? profilePreviewUrl : resumeData.profileInfo.profilePreviewUrl ?? ''
        }
      };

      // Send that JSON payload to PUT /api/resume/:id
      await axiosInstance.put(
        API_PATHS.RESUME.UPDATE(resumeId),
        payload,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      // Locally update our React state so the UI immediately reflects the new URLs:
      setResumeData((prev) => ({
        ...prev,
        thumbnailLink: thumbnailLink || prev.thumbnailLink,
        profileInfo: {
          ...prev.profileInfo,
          profileImg: profilePreviewUrl || prev.profileInfo.profileImg,
          profilePreviewUrl: profilePreviewUrl || prev.profileInfo.profilePreviewUrl
        }
      }));
    } catch (err) {
      console.error('Error updating resume:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // delete resume
  const handleDeleteResume = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
      toast.success('Resume Deleted Successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error capturing image', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Download resume
  const reactToPrintFn = useReactToPrint({
    contentRef: resumeDownloadRef
  });


  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth)
    }
  }

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener('resize', updateBaseWidth);

    if (resumeId) {
      fetchResumeDetailsById();
    }

    return () => {
      window.addEventListener('resize', updateBaseWidth);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className='container mx-auto'>
        <div className='flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-200 py-3 px-4 mb-4'>
          <TitleInput
            title={resumeData.title}
            setTitle={(title) =>
              setResumeData((prevState) =>
              ({
                ...prevState,
                title: title
              }))
            }
          />

          <div className='flex items-center gap-4'>
            <button
              className='btn-small-light cursor-pointer'
              onClick={() => setOpenthemeSeletor(true)}
            >
              <LuPalette className='text-[16px]' />
              <span className='hidden md:block'>Change Theme</span>
            </button>

            <button
              className='btn-small-light cursor-pointer'
              onClick={handleDeleteResume}
            >
              <LuTrash2 className='text-[16px]' />
              <span className='hidden md:block'>Delete</span>
            </button>

            <button
              className='btn-small-light cursor-pointer'
              onClick={() => { setOpenPreviewModal(true) }}
            >
              <LuDownload className='text-[16px]' />
              <span className='hidden md:block'>Download</span>
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

          <div className='bg-white rounded-lg border border-purple-100 overflow-hidden'>

            <StepProgress progress={progress} />

            {renderForm()}

            <div className='mx-5'>
              {errorMsg && (
                <div className='flex items-center gap-2 tetx-[11px] font-medium text-amber-600 bg-amber-100 px-1 py-0.5 my-1 rounded'>
                  <LuCircleAlert className='text-md' /> {errorMsg}
                </div>
              )}

              <div className='flex items-end justify-end gap-3 mt-3 mb-5'>
                <button
                  className='btn-small-light'
                  onClick={() => goToPreviousStep()}
                  disabled={isLoading}
                >
                  <LuArrowLeft className='text-[16px]' />
                  Back
                </button>

                <button
                  className='btn-small-light'
                  onClick={() => { uploadResumeImage() }}
                  disabled={isLoading}
                >
                  <LuSave className='text-[16px]' />
                  {isLoading ? 'Updating...' : 'Save & Exit'}
                </button>

                <button
                  className='btn-small'
                  onClick={() => validateAndNext()}
                  disabled={isLoading}
                >
                  {currentPage === 'additional-info' && (
                    <LuDownload className='text-[16px]' />
                  )}

                  {currentPage === 'additional-info'
                    ? 'Preview & Download'
                    : 'Next'
                  }

                  {currentPage !== 'additional-info' && (
                    <LuArrowLeft className='text-[16px] rotate-180' />
                  )}
                </button>
              </div>
            </div>

          </div>

          <div ref={resumeRef} className='h-[100vh]'>
            {/* Resume Template */}
            <RenderResume
              templateId={resumeData?.template?.theme || ''}
              resumeData={resumeData}
              colorPalette={resumeData?.template?.colorPalette || ''}
              containerWidth={baseWidth}
            />
          </div>

        </div>
      </div>


      <Modal
        isOpen={openthemeSeletor}
        onClose={() => setOpenthemeSeletor(false)}
        title='Change Theme'
      >
        <div className='w-[80vw] h-[80vh] p-3 pt-2'>
          <ThemeSelector
            selectedTheme={resumeData?.template}
            setSelectedTheme={(value) => {
              setResumeData((prevState) => ({
                ...prevState,
                template: value || prevState.template,
              }));
            }}
            resumeData={null}
            onClose={() => setOpenthemeSeletor(false)}
          />
        </div>
      </Modal>


      <Modal
        isOpen={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
        title={resumeData.title}
        showActionBtn
        actionBtnText="Download"
        actionBtnIcon={<LuDownload className="text-xl" />}
        onActionClick={reactToPrintFn}
      >
        <div ref={resumeDownloadRef} className='w-[95vw] h-[90vh]'>
          <div className='w-[100%] mx-auto'>
            <RenderResume
              templateId={resumeData?.template?.theme || ''}
              resumeData={resumeData}
              colorPalette={resumeData?.template?.colorPalette}
            />
          </div>
        </div>
      </Modal>



    </DashboardLayout >
  )
}

export default EditResume
