import ComplianceCard from './Patient/ComplianceCard.jsx'
import ActiveDrug from './Patient/ActiveDrug.jsx'
import AiAsk from './Patient/AiAsk.jsx'
import ScheduleTherapy from './Patient/ScheduleTherapy.jsx'
import FastAction from './Patient/FastAction.jsx'
import InfoCarousel from './Patient/InfoCarousel.jsx'

const DashboardPatient = () => {
  return (
    <div className="bg-base-100 min-h-screen ">
      <div className="mx-auto max-w-6xl ">
        <h2 className="text-xl font-semibold mb-4">Dashboard Pasien</h2>
        <div className="flex flex-row gap-12  ">
          <div className='flex flex-col gap-6'>
            <ComplianceCard />
            <ActiveDrug />
          </div>
          <div className="flex flex-col gap-6">
            <InfoCarousel />
            <ScheduleTherapy />

          </div>
          <div className='flex flex-col gap-6'>
            <FastAction />
            <AiAsk />
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPatient