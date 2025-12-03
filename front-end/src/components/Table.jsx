import React from 'react'

const Table = ({ title, data }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {title && <h2 className="card-title mb-4">{title}</h2>}
        
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <tbody>
              {data?.map((item, index) => (
                <tr key={index}>
                  <td className="font-semibold">{item.label}</td>
                  <td>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Table