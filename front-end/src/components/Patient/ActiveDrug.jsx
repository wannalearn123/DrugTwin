import React from 'react'

const ActiveDrug = () => {
  const Drug = (props) => {
    const { drugName, frequency } = props;
    return (
        <div className='bg-primary/15 p-3 rounded-lg' >
                <p className='text text-md'>{drugName}</p>
                <p className='text text-md'>{frequency}</p>
        </div>
    )
}
  return (
    <div>
        <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body">
                <h3 className="card-title text-md mb-2">Obat Aktif</h3>
                <Drug drugName="Paracetamol - 10mg" frequency="3 times a day" />
                <Drug drugName="Amoxicillin - 500mg" frequency="2 times a day" />
                <Drug drugName="Ibuprofen - 200mg" frequency="as needed" />
            </div>
        </div>
    </div>
  )
}



export default ActiveDrug