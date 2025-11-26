import React from 'react'
import { Sparkles } from 'lucide-react';

const AiAsk = () => {
  return (
    <div>
        <div className="card bg-base-100 w-96 shadow-xl border border-primary">
            <div className="card-body">
                <h2 className="card-title">Tanya AI <Sparkles className='size-5'/></h2>
                <p>Ada pertanyaan tentang obat atau terapinya? Tanyakan kami</p>
                <div className="card-actions justify-end mt-2">
                    <button className="btn btn-primary btn-md w-full">Mulai Chat</button>
            </div>
        </div>
</div>
    </div>

  )
}

export default AiAsk