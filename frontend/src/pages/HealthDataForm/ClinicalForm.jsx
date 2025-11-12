import {
  Box,
  Grid,
  TextField,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip
} from '@mui/material';
import { useEffect } from 'react';
import { healthDataService } from '../../services';

export default function ClinicalForm({ formik }) {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

  // Auto-calculate BMI when height and weight change
  useEffect(() => {
    if (values.height && values.weight) {
      const bmi = healthDataService.calculateBMI(
        parseFloat(values.height),
        parseFloat(values.weight)
      );
      // Display BMI (not submitted, backend calculates it)
      if (bmi > 0) {
        console.log('Calculated BMI:', bmi);
      }
    }
  }, [values.height, values.weight]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
        Clinical & Vitals Data
      </Typography>

      {/* Anthropometry Section */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        📏 Anthropometry (10 points)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Height (cm)"
            name="height"
            type="number"
            value={values.height}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.height && Boolean(errors.height)}
            helperText={touched.height && errors.height}
            placeholder="170"
            inputProps={{ step: '0.1', min: '50', max: '250' }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Weight (kg)"
            name="weight"
            type="number"
            value={values.weight}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.weight && Boolean(errors.weight)}
            helperText={touched.weight && errors.weight}
            placeholder="70"
            inputProps={{ step: '0.1', min: '20', max: '300' }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Waist Circumference (cm)"
            name="waistCircumference"
            type="number"
            value={values.waistCircumference}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.waistCircumference && Boolean(errors.waistCircumference)}
            helperText={touched.waistCircumference && errors.waistCircumference}
            placeholder="85"
            inputProps={{ step: '0.1', min: '30', max: '200' }}
          />
        </Grid>
      </Grid>

      {values.height && values.weight && (
        <Box sx={{ mb: 3 }}>
          <Chip
            label={`BMI: ${healthDataService.calculateBMI(parseFloat(values.height), parseFloat(values.weight))} kg/m²`}
            color="primary"
            variant="outlined"
          />
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Blood Pressure Section */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        🩺 Blood Pressure (10 points)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Systolic BP (mmHg)"
            name="systolicBP"
            type="number"
            value={values.systolicBP}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.systolicBP && Boolean(errors.systolicBP)}
            helperText={touched.systolicBP && errors.systolicBP}
            placeholder="120"
            inputProps={{ min: '60', max: '250' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Diastolic BP (mmHg)"
            name="diastolicBP"
            type="number"
            value={values.diastolicBP}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.diastolicBP && Boolean(errors.diastolicBP)}
            helperText={touched.diastolicBP && errors.diastolicBP}
            placeholder="80"
            inputProps={{ min: '40', max: '150' }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Heart & Cardio Section */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        ❤️ Heart & Cardio (10 points)
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Resting Heart Rate (bpm)"
            name="restingHeartRate"
            type="number"
            value={values.restingHeartRate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.restingHeartRate && Boolean(errors.restingHeartRate)}
            helperText={touched.restingHeartRate && errors.restingHeartRate}
            placeholder="72"
            inputProps={{ min: '30', max: '200' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>ECG Result</InputLabel>
            <Select
              name="ecgResult"
              value={values.ecgResult}
              onChange={handleChange}
              onBlur={handleBlur}
              label="ECG Result"
            >
              <MenuItem value="Normal">Normal</MenuItem>
              <MenuItem value="Abnormal">Abnormal</MenuItem>
            </Select>
            {touched.ecgResult && errors.ecgResult && (
              <FormHelperText error>{errors.ecgResult}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}


