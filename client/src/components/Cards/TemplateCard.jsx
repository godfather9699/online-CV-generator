import React from 'react';

const TemplateCard = ({ thumbnailImg, isSelected, onSelect }) => {
  return (
    <div
      className={`h-auto md:h-[345px] w-[245px] flex flex-col items-center justify-between bg-white rounded-lg border border-gray-200 hover:border-purple-300  overflow-hidden cursor-pointer ${isSelected ? 'border-purple-500 border-2 rounded-xl' : ''}`}
      onClick={() => onSelect()}
    >
      {thumbnailImg ? (
        <img
          src={thumbnailImg}
          alt="template thumbnail"
          className="w-[100%] border-transparent rounded"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-contain text-gray-400">
          No Image
        </div>
      )}
    </div>
  );
};

export default TemplateCard;
