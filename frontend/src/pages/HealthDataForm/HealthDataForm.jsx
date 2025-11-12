import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { healthDataService } from '../../services';
import ClinicalForm from './ClinicalForm';
import LaboratoryForm from './LaboratoryForm';
import LifestyleForm from './LifestyleForm';

const steps = ['Clinical & Vitals', 'Laboratory Tests', 'Lifestyle & Preventive'];

// Validation schema for each step
const validationSchemas = [
  // Step 1: Clinical & Vitals
  Yup.object({
    height: Yup.number().min(50, 'Height must be at least 50 cm').max(250, 'Height must be less than 250 cm'),
    weight: Yup.number().min(20, 'Weight must be at least 20 kg').max(300, 'Weight must be less than 300 kg'),
    waistCircumference: Yup.number().min(30, 'Waist must be at least 30 cm').max(200, 'Waist must be less than 200 cm'),
    systolicBP: Yup.number().min(60, 'Systolic BP must be at least 60').max(250, 'Systolic BP must be less than 250'),
    diastolicBP: Yup.number().min(40, 'Diastolic BP must be at least 40').max(150, 'Diastolic BP must be less than 150'),
    restingHeartRate: Yup.number().min(30, 'Heart rate must be at least 30').max(200, 'Heart rate must be less than 200'),
    ecgResult: Yup.string()
  }),
  // Step 2: Laboratory Tests
  Yup.object({
    fastingPlasmaGlucose: Yup.number().min(40).max(500),
    hba1c: Yup.number().min(3).max(20),
    totalCholesterol: Yup.number().min(50).max(500),
    ldlCholesterol: Yup.number().min(20).max(400),
    hdlCholesterol: Yup.number().min(10).max(150),
    triglycerides: Yup.number().min(20).max(1000),
    serumCreatinine: Yup.number().min(0.1).max(20),
    bun: Yup.number().min(1).max(200),
    alt: Yup.number().min(1).max(1000),
    ast: Yup.number().min(1).max(1000),
    totalBilirubin: Yup.number().min(0.1).max(50),
    hemoglobin: Yup.number().min(3).max(25),
    wbcCount: Yup.number().min(1000).max(50000),
    plateletCount: Yup.number().min(10000).max(1000000),
    tsh: Yup.number().min(0.1).max(50),
    crp: Yup.number().min(0).max(500),
    vitaminD: Yup.number().min(1).max(200),
    vitaminB12: Yup.number().min(50).max(5000)
  }),
  // Step 3: Lifestyle & Preventive
  Yup.object({
    smokingStatus: Yup.string(),
    alcoholConsumption: Yup.string(),
    physicalActivity: Yup.string(),
    dietQuality: Yup.string(),
    preventiveCare: Yup.string()
  })
];

const initialValues = {
  // Test Date (required)
  testDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  // Clinical/Vitals - Anthropometry
  height: '',
  weight: '',
  waistCircumference: '',
  // Clinical/Vitals - Blood Pressure
  systolicBP: '',
  diastolicBP: '',
  // Clinical/Vitals - Heart & Cardio
  restingHeartRate: '',
  ecgResult: 'Normal',
  // Laboratory - Glycemic Control
  fastingPlasmaGlucose: '',
  hba1c: '',
  // Laboratory - Lipid Profile
  totalCholesterol: '',
  ldlCholesterol: '',
  hdlCholesterol: '',
  triglycerides: '',
  // Laboratory - Renal Function
  serumCreatinine: '',
  bun: '',
  // Laboratory - Liver Function
  alt: '',
  ast: '',
  totalBilirubin: '',
  // Laboratory - Hematology
  hemoglobin: '',
  wbcCount: '',
  plateletCount: '',
  // Laboratory - Thyroid
  tsh: '',
  // Laboratory - Inflammation
  crp: '',
  // Laboratory - Vitamins
  vitaminD: '',
  vitaminB12: '',
  // Lifestyle & Preventive
  smokingStatus: 'Never smoker',
  alcoholConsumption: 'None',
  physicalActivity: 'Moderate',
  dietQuality: 'Good',
  preventiveCare: 'Up-to-date'
};

export default function HealthDataForm() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const currentValidationSchema = validationSchemas[activeStep];
  const isLastStep = activeStep === steps.length - 1;

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (values) => {
    if (!isLastStep) {
      handleNext();
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Map frontend field names to backend field names
      const fieldMapping = {
        fastingPlasmaGlucose: 'fastingGlucose',
        ecgResult: 'ecgFindings',
        crp: 'hsCRP'
      };

      // Map lifestyle fields to backend structure
      const physicalActivityMapping = {
        'Sedentary': 0,
        'Light': 60,
        'Moderate': 150,
        'Vigorous': 300
      };

      const dietQualityMapping = {
        'Poor': { fruitsVegetablesServings: 1, processedFoodFrequency: 'High' },
        'Fair': { fruitsVegetablesServings: 3, processedFoodFrequency: 'Medium' },
        'Good': { fruitsVegetablesServings: 5, processedFoodFrequency: 'Low' },
        'Excellent': { fruitsVegetablesServings: 8, processedFoodFrequency: 'Low' }
      };

      const preventiveCareMapping = {
        'Up-to-date': true,
        'Partially': false,
        'Not up-to-date': false
      };

      // Convert and clean values
      const cleanedValues = Object.entries(values).reduce((acc, [key, value]) => {
        if (value === '' || value === null) {
          return acc;
        }

        // Map field names
        const backendKey = fieldMapping[key] || key;

        // Handle special lifestyle fields
        if (key === 'alcoholConsumption') {
          acc.alcoholUse = value;
        } else if (key === 'physicalActivity' && physicalActivityMapping[value] !== undefined) {
          acc.physicalActivityMinutes = physicalActivityMapping[value];
        } else if (key === 'dietQuality' && dietQualityMapping[value]) {
          const dietData = dietQualityMapping[value];
          acc.fruitsVegetablesServings = dietData.fruitsVegetablesServings;
          acc.processedFoodFrequency = dietData.processedFoodFrequency;
        } else if (key === 'preventiveCare' && preventiveCareMapping[value] !== undefined) {
          acc.screeningsUpToDate = preventiveCareMapping[value];
        } else if (key === 'wbcCount' || key === 'plateletCount') {
          // Convert cells/μL to ×10³/µL (divide by 1000)
          // User enters 7000, backend expects 7.0
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            acc[backendKey] = numValue / 1000;
          }
        } else if (typeof value === 'string' && !isNaN(value) && value.trim() !== '') {
          // Convert numeric strings to numbers
          acc[backendKey] = parseFloat(value);
        } else {
          acc[backendKey] = value;
        }

        return acc;
      }, {});

      await healthDataService.createHealthData(cleanedValues);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error submitting health data:', err);
      const errorMessage = err.response?.data?.message || 'Failed to submit health data. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step, formikProps) => {
    switch (step) {
      case 0:
        return <ClinicalForm formik={formikProps} />;
      case 1:
        return <LaboratoryForm formik={formikProps} />;
      case 2:
        return <LifestyleForm formik={formikProps} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Health Data Assessment
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
            Complete all sections to get your comprehensive health score
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={currentValidationSchema}
            onSubmit={handleSubmit}
            validateOnChange={false}
            validateOnBlur={true}
          >
            {(formikProps) => (
              <Form>
                {renderStepContent(activeStep, formikProps)}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                    size="large"
                  >
                    Back
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(135deg, #0070C0 0%, #4CAF50 100%)',
                      minWidth: 120
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : isLastStep ? (
                      'Submit'
                    ) : (
                      'Next'
                    )}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Container>
  );
}


