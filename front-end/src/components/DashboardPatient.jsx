import ComplianceCard from '../components/ComplianceCard.jsx'
import ActiveDrug from './ActiveDrug.jsx'
import AiAsk from './AiAsk.jsx'
import ScheduleTherapy from './ScheduleTherapy.jsx'
import FastAction from './FastAction.jsx'

const DashboardPatient = () => {
  return (
    <div className="bg-base-100 min-h-screen ">
      <div className="mx-auto max-w-6xl p-4">
        <h2 className="text-xl font-semibold mb-4">Dashboard Pasien</h2>
        <div className="flex flex-row-reverse gap-12 justify-center ">
          <div className='flex flex-col gap-6'>
            <FastAction />
            <AiAsk />
          </div>
          <div className="flex flex-col gap-6">
            <ScheduleTherapy />

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