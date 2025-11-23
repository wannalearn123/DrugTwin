import { Link } from 'react-router'
import { QrCode, ChevronDown} from 'lucide-react'

export const NavbarPatient = () => {
  return (
    <header className="bg-base-100 border-base-content/10 shadow-sm border-b">
        <div className='mx-auto max-w-6xl p-4'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-bold text-primary font-sans tracking-tight'>DrugTwin</h1>
                <div className='flex items-center gap-4'>
                  <Link to="/QR" className='btn btn-black btn-outline px-4'>
                    <QrCode className='size-5'/>
                    <span>QR scan</span> 
                  </Link>
                  <div>
                    <div className="dropdown dropdown-end">
                      <div tabIndex={0} role="button" className="btn btn-ghost">
                        <div className="avatar mr-2">
                          <div className="w-12 rounded-full">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                          </div>
                        </div>
                        <div className='flex flex-col items-start gap-2'>
                        <span className='text text-base'><strong>Username</strong></span>
                        <span className='text text-base/50'>UserID</span>
                        </div>
                        <ChevronDown className='size-5 ml-2'/>
                      </div>
                      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li><a>Profile</a></li>
                        <li><a href='/'>Logout</a></li>
                      </ul>
                    </div>
                  </div>
                    
                </div>

            </div>
        </div>
    </header>
  )
}

export default NavbarPatient