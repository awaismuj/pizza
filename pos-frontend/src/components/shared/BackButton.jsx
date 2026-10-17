import React from 'react'
import { IoArrowBackOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="p-2 text-base font-bold rounded-xl transition flex items-center justify-center text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-xs active:scale-95"
      title="Go back"
    >
      <IoArrowBackOutline size={18} />
    </button>
  );
};

export default BackButton;