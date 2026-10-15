import React from 'react'

const MiniCard = ({title, icon, number, footerNum}) => {
  return (
    <div className='w-full rounded-lg bg-[#1a1a1a] px-4 py-4 sm:px-5 md:w-1/2'>
      <div className='flex items-start justify-between gap-3'>
        <h1 className='text-base font-semibold tracking-wide text-[#f5f5f5] sm:text-lg'>{title}</h1>
        <button className={`${title === "Total Earnings" ? "bg-[#02ca3a]" : "bg-[#f6b100]"} rounded-lg p-2.5 text-xl text-[#f5f5f5] sm:p-3 sm:text-2xl`}>
          {icon}
        </button>
      </div>
      <div>
        <h1 className='mt-4 text-2xl font-bold text-[#f5f5f5] sm:text-3xl md:text-4xl'>
          {title === "Total Earnings" ? `Rs ${number}` : number}
        </h1>
        <h1 className='mt-2 text-sm text-[#f5f5f5] sm:text-base'>
          <span className={footerNum < 0 ? 'text-red-500' : 'text-[#02ca3a]'}>
            {footerNum > 0 ? '+' : ''}{footerNum}%
          </span>{' '}
          than yesterday
        </h1>
      </div>
    </div>
  )
}

export default MiniCard