import { Link } from 'react-router'
import { Stethoscope, PillIcon, BriefcaseMedical } from 'lucide-react'

const Roles = () => {
  return (
    <div>
      <div className='hero bg-base-100 min-h-[80vh]'>
            <div className='hero-content text-center'>
                <div className='max-w-md'>
                    <h1 className="text-5xl font-bold">Select Your Role</h1>
                    <p className="py-6">Please choose your role to proceed to the appropriate dashboard and access tailored features.</p>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                      <Link to="/doctor" className='btn btn-outline btn-primary btn-lg h-24'>
                        <div className='flex flex-col items-center gap-2'>
                          <Stethoscope className='size-5'/>
                          <span>Dokter</span>
                        </div>
                      </Link>
                      <Link to="/pharmacist" className='btn btn-outline btn-primary btn-lg h-24'>
                        <div className='flex flex-col items-center gap-2'>
                          <PillIcon className='size-5' />
                          <span>Apoteker</span>
                        </div>
                      </Link>
                      
                      <Link to="/patient" className='btn btn-outline btn-primary btn-lg h-24'>
                        <div className='flex flex-col items-center gap-2'>
                          <BriefcaseMedical className='size-5' />
                          <span>Pasien</span>
                        </div>
                      </Link>
                    </div>
                </div>
            </div>
      </div>
    </div>
    
  )
}

export default Roles