import React from 'react'

const FastAction = () => {
  return (
    <div>
        <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-md mb-2">Fast Action</h2>
                <div className="flex flex-col gap-4">
                    <button className="btn btn-base btn-outline w-full">Jadwalkan Konsultasi</button>
                    <button className="btn btn-base btn-outline w-full">Laporkan efek samping</button>
                    <button className="btn btn-base btn-outline w-full">Lihat Riwayat Kesehatan</button>

                </div>
            </div>
        </div>
    </div>
  )
}

export default FastAction