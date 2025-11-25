import React from 'react'

const ClinicHistory = (props) => {
  const Table = ({ title, data }) => {
  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body">
        {title && <h2 className="card-title bg-primary/15">{title}</h2>}
        
        <div className="overflow-x-auto">
          <table className="table ">
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
  const PatientInformation = [
    { label: 'Nama', value: 'Yanto' },
    { label: 'Tanggal Lahir', value: '15-01-1980' },
    { label: 'Jenis Kelamin', value: 'Laki-laki' },
    { label: 'Nomor Rekam Medis', value: '123456789' },
    { label: 'Kontak', value: '08123456789' },
  ]

  const SickHistory = [
    { label: 'Riwayat Penyakit', value: 'Diabetes, Hipertensi' },
    { label: 'Diagnosa Terakhir', value: 'April 2024' },
    { label: 'Pengobatan', value: 'Metformin, Insulin' },
    { label: 'Komplikasi', value: 'Neuropati' },
    { label: 'Alergi Obat', value: 'Tidak ada' },
  ]

  const LabData = [
    { label: 'Gula Darah Puasa', value: '130 mg/dL' },
    { label: 'HbA1c', value: '7.5%' },
    { label: 'Tekanan Darah', value: '140/90 mmHg' },
    { label: 'Kolesterol Total', value: '220 mg/dL' },
    { label: 'Kreatinin', value: '1.2 mg/dL' },
  ]

  const BasicCheck = [
    { label: 'Tekanan Darah', value: '140/90 mmHg' },
    { label: 'Detak Jantung', value: '80 bpm' },
    { label: 'Suhu Tubuh', value: '36.5 °C' },
    { label: 'Tinggi Badan', value: '170 cm' },
    { label: 'Berat Badan', value: '70 kg' },
  ]

  const Diagnose = [
    { label: 'Diagnosa', value: 'Diabetes Mellitus Tipe 2' },
    { label: 'Tanggal Diagnosa', value: '15-03-2024' },
    { label: 'Dokter Penanggung Jawab', value: 'Dr. Siti Aminah' },
    { label: 'Catatan Tambahan', value: 'Pasien perlu kontrol rutin setiap 3 bulan.' },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4">
        <Table 
          title="Informasi Pasien"
          data={PatientInformation}
        />
        <Table 
          title="Riwayat Penyakit"
          data={SickHistory}
        />
        <Table 
          title="Data Laboratorium"
          data={LabData}
        />
      </div>
      <div className="p-4">
        <Table 
          title="Pemeriksaan Dasar"
          data={BasicCheck}
        />
        <Table 
          title="Diagnosa"
          data={Diagnose}
        />
      </div>
    </div>
  )
}

export default ClinicHistory

