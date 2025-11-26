
const ComplianceCard = () => {
  return (
    <div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-xl">
            <form className="card-body">
              <h3 className='text text-lg mb-6 font-bold'>Tingkat Kepatuhan</h3>
              <div className='items-center text-center flex flex-col gap-4'>
                <h1 className='text text-primary text-4xl font-bold'>85%</h1>
                <p className='text text-base/50'>30 Hari Terakhir</p>
                <progress className="progress progress-primary w-56" value="85" max="100"></progress>
                <div className='flex justify-between w-full px-8'>
                  <p className="text text-left">Obat diminum tepat waktu</p>
                  <p className="text text-right text-primary">25/30 hari</p>
                </div>
              </div>
            </form>
        </div>
    </div>
  )
}

export default ComplianceCard