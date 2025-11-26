import React from 'react'
import { Link } from 'react-router';

const InfoCarousel = () => {
  return (
    <div>
        <div className="w-max mx-auto">
            <div className="card bg-base-100 shadow-xl flex flex-row overflow-x-auto gap-5">
                <div className="card-body">
                    <h3 className="card-title">Status</h3>
                    <p className='text text-primary font-semibold'>Rawat Jalan</p>
                </div>
                <div className="card-body">
                    <h3 className="card-title">Kontrol Berikutnya</h3>
                    <p className='text text-primary font-semibold'>15 November 2025</p>
                    <div className="card-actions justify-end mt-2">
                        <Link to="/patient/info" className="btn btn-primary btn-md w-full">
                        <span>Lihat Info</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default InfoCarousel