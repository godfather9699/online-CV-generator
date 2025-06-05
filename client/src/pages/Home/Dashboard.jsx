import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { LuCirclePlus } from 'react-icons/lu';
import moment from 'moment';
import ResumeSummaryCard from '../../components/Cards/ResumeSummaryCard';
import CreateResumeForm from './CreateResumeForm';
import Modal from '../../components/Modal';

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModel, setOpenCreateModel] = useState(false);
  const [allresumes, setAllResumes] = useState([]);

  const fetchAllResumes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      setAllResumes(response.data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  }

  useEffect(() => {
    fetchAllResumes();
  }, []);

  return (
    <DashboardLayout>
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0'>
        <div className='h-[300px] flex flex-col gap-5 items-center justify-center bg-white rounded-lg border border-purple-200 hover:border-purple-300 hover:bg-purple-50/5 cursor-pointer' onClick={() => setOpenCreateModel(true)}>
          <div className='w-12 h-12 flex items-center justify-center rounded-2xl bg-purple-200/60'>
            <LuCirclePlus className='text-xl text-purple-500' />
          </div>
          <h3 className=''>Add new Resume</h3>
        </div>

        {allresumes.map((resume) => (
          <ResumeSummaryCard
            key={resume?._id}
            imgUrl={resume.thumbnailLink || null}
            title={resume.title}
            lastUpdated={
              resume?.updated_at
                ? moment(resume.updated_at).format('DD, MM, YYYY')
                : 'N/A'
            }
            onSelect={() => navigate(`/resume/${resume._id}`)}
          />
        ))}

      </div>
      <Modal
        isOpen={openCreateModel}
        onClose={() => setOpenCreateModel(false)}
        hideHeader
      >
        <div
          className='w-auto'>
          <CreateResumeForm />
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default Dashboard
