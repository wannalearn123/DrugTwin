import React from 'react'

const ComplianceCard = () => {
  return (
    <div>
      <div className="hero bg-base-200 min-h-[70vh]">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h3 className="text-lg font-bold">Patient Dashboard</h3>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
              quasi. In deleniti eaque aut repudiandae et a id nisi.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-xl">
            <form className="card-body">
              <h3 className='text text-lg mb-6'>Tingkat Kepatuhan</h3>
              <div className='items-center text-center flex flex-col gap-4'>
                <h1 className='text text-primary text-4xl font-bold'>85%</h1>
                <p className='text text-base/50'>30 Hari Terakhir</p>
                <progress className="progress progress-primary w-56" value="85" max="100"></progress>
                <div className='flex justify-between w-full px-8'>
                  <p>Obat diminum tepat waktu</p>
                  <p>25/30 hari</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplianceCard