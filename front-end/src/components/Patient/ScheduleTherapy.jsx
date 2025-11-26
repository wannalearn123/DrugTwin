import { Clock } from 'lucide-react';

const ScheduleTherapy = () => {
  const Therapy = (props) => {
    const { time, name, total, badge, cond } = props;
    return (
      <div>
        <div className={`collapse bg-${badge}/15 border border-${badge} rounded-lg mb-2 w-90`}>
          <input type="checkbox" />
          <div className="collapse-title font-medium">
            <div className='flex justify-between items-center gap-4'>
              <div className='flex flex-row gap-8'>
                <div className='flex flex-col items-center gap-2'>
                  <Clock className={`size-5 text-${badge}`} />
                  <p className='text text-md'>{time}</p>
                </div>
                <div className=''>
                  <h3 className='text text-md font-bold'>{name}</h3>
                  <p className='text text-base/50'>{total}</p>
              </div>
              </div>
              <div>
                <div className={`badge badge-${badge} badge-xl`}><span>{cond} Diminum</span></div>
              </div>
            </div>
          </div>
          <div className="collapse-content">
            <span className='btn btn-primary btn-sm mx-2'>Sudah Diminum</span>
            <span className='btn btn-error btn-sm mx-2'>Terlewat</span>
          </div>
        </div>
      </div>
    )
  }

  return (
      <div className="card bg-base-100 w-max shadow-xl flex flex-row overflow-x-auto ">
        <div className="card-body w-max">
          <h2 className="card-title">Jadwal Terapi</h2>
          <Therapy time="08:00" name="Amoxylin" total="3 obat" badge="primary" cond="Sudah" /> 
          <Therapy time="12:00" name="Pharacetamol" total="2 obat" badge="primary" cond="Sudah" />
          <Therapy time="18:00" name="Ibuprofen" total="4 obat" badge="error" cond="Tidak" />
        </div>
      </div>
  )
}

export default ScheduleTherapy