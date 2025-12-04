import Checkup from '../model/checkup.js'
import Patient from '../model/patient.js'

export const getAISuggestion = async (req, res) => {
  try {
    const { id } = req.params

    // Get checkup data with patient
    const checkup = await Checkup.findById(id).populate('patient')
    
    if (!checkup) {
      return res.status(404).json({
        success: false,
        message: 'Checkup not found'
      })
    }

    const patient = await Patient.findById(checkup.patient)

    // Generate suggestions based on diagnosis and vitals
    const suggestions = generateSuggestions(checkup, patient)

    return res.status(200).json({
      success: true,
      checkupId: id,
      patientName: patient.name,
      diagnosis: checkup.diagnosis,
      suggestions: {
        drugs: suggestions.drugs,
        lifestyle: suggestions.lifestyle
      },
      warnings: suggestions.warnings,
      generatedAt: new Date()
    })

  } catch (error) {
    console.error('AI Suggestion error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to generate AI suggestions',
      error: error.message
    })
  }
}

// Main suggestion generator
const generateSuggestions = (checkup, patient) => {
  const drugs = []
  const lifestyle = []
  const warnings = []
  
  const diagnosis = (checkup.diagnosis || '').toLowerCase()
  const age = patient.age || 0
  const allergies = patient.allergies || []

  // Parse blood pressure
  let systolic = 0
  let diastolic = 0
  if (checkup.bloodPressure) {
    const bp = checkup.bloodPressure.split('/')
    systolic = parseInt(bp[0]) || 0
    diastolic = parseInt(bp[1]) || 0
  }

  const bloodSugar = parseInt(checkup.bloodSugar) || 0

  // === HYPERTENSION RULES ===
  if (diagnosis.includes('hypertension') || diagnosis.includes('htn') || systolic >= 140) {
    
    // Stage 1 HTN (140-159 / 90-99)
    if (systolic >= 140 && systolic < 160) {
      if (!hasAllergy(allergies, 'amlodipine')) {
        drugs.push({
          name: 'Amlodipine',
          dosage: '5mg',
          frequency: 'Once daily',
          duration: '30 days',
          indication: 'Calcium channel blocker for stage 1 hypertension',
          alternatives: ['Nifedipine 30mg']
        })
      }

      if (!hasAllergy(allergies, 'lisinopril')) {
        drugs.push({
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '30 days',
          indication: 'ACE inhibitor for blood pressure control',
          alternatives: ['Enalapril 5mg', 'Ramipril 5mg']
        })
      }
    }

    // Stage 2 HTN (≥160 / ≥100)
    if (systolic >= 160) {
      if (!hasAllergy(allergies, 'amlodipine')) {
        drugs.push({
          name: 'Amlodipine',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '30 days',
          indication: 'Higher dose for stage 2 hypertension',
          alternatives: ['Nifedipine 60mg']
        })
      }

      if (!hasAllergy(allergies, 'hydrochlorothiazide')) {
        drugs.push({
          name: 'Hydrochlorothiazide',
          dosage: '25mg',
          frequency: 'Once daily in morning',
          duration: '30 days',
          indication: 'Diuretic for combination therapy',
          alternatives: ['Furosemide 40mg']
        })
      }

      warnings.push('Stage 2 Hypertension detected - close monitoring required')
    }

    // Lifestyle for HTN
    lifestyle.push({
      category: 'diet',
      recommendation: 'DASH diet: Reduce sodium to <2g/day, increase potassium-rich foods',
      priority: 'high',
      rationale: 'Sodium reduction can lower BP by 5-6 mmHg'
    })

    lifestyle.push({
      category: 'exercise',
      recommendation: 'Aerobic exercise 30 minutes, 5-7 days/week (walking, cycling, swimming)',
      priority: 'high',
      rationale: 'Regular exercise reduces BP by 5-8 mmHg'
    })

    lifestyle.push({
      category: 'monitoring',
      recommendation: 'Monitor blood pressure twice daily (morning & evening)',
      priority: 'high',
      rationale: 'Track treatment effectiveness and detect trends'
    })

    lifestyle.push({
      category: 'weight',
      recommendation: 'Achieve and maintain healthy BMI (18.5-24.9)',
      priority: 'medium',
      rationale: 'Weight loss of 5-10kg can reduce BP by 5-20 mmHg'
    })
  }

  // === DIABETES MELLITUS RULES ===
  if (diagnosis.includes('diabetes') || diagnosis.includes('dm') || bloodSugar >= 126) {
    
    // Fasting glucose 126-200
    if (bloodSugar >= 126 && bloodSugar < 200) {
      if (!hasAllergy(allergies, 'metformin')) {
        drugs.push({
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily with meals',
          duration: '30 days',
          indication: 'First-line oral antidiabetic for Type 2 DM',
          alternatives: ['Metformin XR 1000mg once daily']
        })
      }
    }

    // Higher glucose ≥200
    if (bloodSugar >= 200) {
      if (!hasAllergy(allergies, 'metformin')) {
        drugs.push({
          name: 'Metformin',
          dosage: '850mg',
          frequency: 'Twice daily with meals',
          duration: '30 days',
          indication: 'Higher dose for poor glycemic control',
          alternatives: ['Metformin XR 1500mg once daily']
        })
      }

      if (!hasAllergy(allergies, 'glimepiride')) {
        drugs.push({
          name: 'Glimepiride',
          dosage: '2mg',
          frequency: 'Once daily before breakfast',
          duration: '30 days',
          indication: 'Sulfonylurea for additional glucose control',
          alternatives: ['Gliclazide 80mg']
        })
      }

      warnings.push('High blood glucose detected - consider HbA1c test')
    }

    // Very high glucose ≥300
    if (bloodSugar >= 300) {
      warnings.push('CRITICAL: Blood glucose ≥300 mg/dL - consider hospitalization and insulin therapy')
    }

    // Lifestyle for DM
    lifestyle.push({
      category: 'diet',
      recommendation: 'Low glycemic index diet: Avoid sugar, refined carbs. Focus on vegetables, whole grains, lean protein',
      priority: 'high',
      rationale: 'Controls postprandial glucose spikes'
    })

    lifestyle.push({
      category: 'exercise',
      recommendation: 'Walk 20-30 minutes after each meal',
      priority: 'high',
      rationale: 'Post-meal activity improves insulin sensitivity by 30-40%'
    })

    lifestyle.push({
      category: 'monitoring',
      recommendation: 'Check fasting blood sugar 3 times/week, keep log book',
      priority: 'high',
      rationale: 'Monitor diabetes control and medication effectiveness'
    })

    lifestyle.push({
      category: 'footcare',
      recommendation: 'Daily foot inspection, moisturize, wear proper footwear',
      priority: 'medium',
      rationale: 'Prevent diabetic foot complications'
    })
  }

  // === COMBINED HTN + DM ===
  if ((diagnosis.includes('hypertension') || systolic >= 140) && 
      (diagnosis.includes('diabetes') || bloodSugar >= 126)) {
    
    lifestyle.push({
      category: 'lifestyle',
      recommendation: 'Strict adherence to both BP and glucose control measures',
      priority: 'high',
      rationale: 'Combined conditions increase cardiovascular risk 4-fold'
    })

    lifestyle.push({
      category: 'screening',
      recommendation: 'Annual eye exam, kidney function test, lipid profile',
      priority: 'high',
      rationale: 'Early detection of complications'
    })

    warnings.push('Patient has both HTN and DM - increased cardiovascular risk')
  }

  // === AGE-SPECIFIC WARNINGS ===
  if (age >= 65) {
    warnings.push('Elderly patient - start with lower doses and monitor for side effects')
  }

  // === ALLERGY WARNINGS ===
  if (allergies.length > 0) {
    warnings.push(`Patient allergies: ${allergies.join(', ')} - alternatives provided`)
  }

  return { drugs, lifestyle, warnings }
}

// Helper function to check allergies
const hasAllergy = (allergies, medication) => {
  return allergies.some(allergy => 
    allergy.toLowerCase().includes(medication.toLowerCase())
  )
}