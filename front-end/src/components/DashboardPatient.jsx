import ComplianceCard from '../components/ComplianceCard.jsx'
import ActiveDrug from './ActiveDrug.jsx'

const DashboardPatient = () => {
  return (
    <div>
      <div className="hero bg-base-200 min-h-[70vh]">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h3 className="text-lg font-bold">Patient Dashboard</h3>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
              quasi. In deleniti eaque aut repudiandae et a id nisi.
            </p>
          </div>
          <div className='flex flex-col gap-6'>
              <ComplianceCard />
              <ActiveDrug />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPatient