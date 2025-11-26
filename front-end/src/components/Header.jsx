import { Link } from 'react-router'

const Header = () => {
  return (
    <header className="bg-base-100 border-base-content/10">
        <div className='mx-auto max-w-6xl py-2'>
            <div className='flex items-center justify-between'>
              <Link to="/" className='btn btn-ghost px-4'>
                <span>Back</span>
              </Link>
              <p className='text text-primary'>Good Dosing • Safer Therapy • Integrated Clinical Decision Support</p>
              <h1 className='text-3xl font-bold text-primary font-sans tracking-tight'>DrugTwin</h1>

            </div>
        </div>
    </header>
  )
}

export default Header