import React from 'react'
import { Link } from 'react-router'

const CTA_Session = () => {
  return (
    <div>
        <div className="hero bg-base-100 min-h-screen">
          <div className='hero-content text-center'> 
            <div className='max-w-md'>
              <h1 className="text-5xl font-bold">Ready to get started?</h1>
              <p className="py-6">Join Drug Twin today and revolutionize your drug discovery process with cutting-edge AI technology.</p>
              <div className='flex gap-4 justify-center'>
                <Link to={"/role"}>
                  <button className="btn btn-primary px-8">Launch App</button>
                </Link>
                <Link>
                  <button className="btn btn-outline px-8">Learn More</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
    </div>
  )
}

export default CTA_Session