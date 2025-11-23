import { Link } from 'react-router'

export const NavbarHome = () => {
  return (
    <header className="bg-base-100 border-base-content/10">
        <div className='mx-auto max-w-6xl p-4'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-bold text-primary font-sans tracking-tight'>DrugTwin</h1>
                <div className='flex items-center gap-4'>
                  <Link to="" className='btn btn-ghost px-4'>
                    <span>About</span>
                  </Link>
                  <Link to="/role" className='btn btn-primary px-4'>
                    <span>Launch App</span> 
                  </Link>
                    
                </div>

            </div>
        </div>
    </header>
  )
}

export default NavbarHome