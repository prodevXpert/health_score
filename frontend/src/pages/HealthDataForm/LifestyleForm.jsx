import {
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  Alert
} from '@mui/material';

export default function LifestyleForm({ formik }) {
  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
        Lifestyle & Preventive Care
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This section assesses your lifestyle habits and preventive care practices (20 points total)
      </Alert>

      {/* Smoking Status */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        🚭 Smoking Status (5 points)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Smoking Status</InputLabel>
            <Select
              name="smokingStatus"
              value={values.smokingStatus}
              onChange={handleChange}
              onBlur={handleBlur}
              label="Smoking Status"
            >
              <MenuItem value="Never smoker">Never Smoked</MenuItem>
              <MenuItem value="Former smoker >1 year">Former Smoker (Quit &gt;1 year ago)</MenuItem>
              <MenuItem value="Former smoker <1 year">Former Smoker (Quit &lt;1 year ago)</MenuItem>
              <MenuItem value="Current light smoker">Current Light Smoker</MenuItem>
              <MenuItem value="Current heavy smoker">Current Heavy Smoker</MenuItem>
            </Select>
            {touched.smokingStatus && errors.smokingStatus && (
              <FormHelperText error>{errors.smokingStatus}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Alcohol Consumption */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        🍷 Alcohol Consumption (3 points)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Alcohol Consumption</InputLabel>
            <Select
              name="alcoholConsumption"
              value={values.alcoholConsumption}
              onChange={handleChange}
              onBlur={handleBlur}
              label="Alcohol Consumption"
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Low">Low (Occasional)</MenuItem>
              <MenuItem value="Moderate">Moderate (1-2 drinks/day)</MenuItem>
              <MenuItem value="Heavy">Heavy (&gt;2 drinks/day)</MenuItem>
            </Select>
            {touched.alcoholConsumption && errors.alcoholConsumption && (
              <FormHelperText error>{errors.alcoholConsumption}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Physical Activity */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        🏃 Physical Activity (5 points)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Physical Activity Level</InputLabel>
            <Select
              name="physicalActivity"
              value={values.physicalActivity}
              onChange={handleChange}
              onBlur={handleBlur}
              label="Physical Activity Level"
            >
              <MenuItem value="Sedentary">Sedentary (Little to no exercise)</MenuItem>
              <MenuItem value="Light">Light (1-2 days/week)</MenuItem>
              <MenuItem value="Moderate">Moderate (3-5 days/week)</MenuItem>
              <MenuItem value="Vigorous">Vigorous (6-7 days/week)</MenuItem>
            </Select>
            {touched.physicalActivity && errors.physicalActivity && (
              <FormHelperText error>{errors.physicalActivity}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Diet Quality */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        🥗 Diet Quality (4 points)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Diet Quality</InputLabel>
            <Select
              name="dietQuality"
              value={values.dietQuality}
              onChange={handleChange}
              onBlur={handleBlur}
              label="Diet Quality"
            >
              <MenuItem value="Poor">Poor (High processed foods, low fruits/vegetables)</MenuItem>
              <MenuItem value="Fair">Fair (Some healthy choices)</MenuItem>
              <MenuItem value="Good">Good (Balanced diet, regular fruits/vegetables)</MenuItem>
              <MenuItem value="Excellent">Excellent (Optimal nutrition, whole foods)</MenuItem>
            </Select>
            {touched.dietQuality && errors.dietQuality && (
              <FormHelperText error>{errors.dietQuality}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Preventive Care */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        🏥 Preventive Care (3 points)
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Preventive Care Status</InputLabel>
            <Select
              name="preventiveCare"
              value={values.preventiveCare}
              onChange={handleChange}
              onBlur={handleBlur}
              label="Preventive Care Status"
            >
              <MenuItem value="Up-to-date">Up-to-date (Regular checkups, screenings current)</MenuItem>
              <MenuItem value="Partially">Partially (Some screenings overdue)</MenuItem>
              <MenuItem value="Not up-to-date">Not up-to-date (No recent checkups)</MenuItem>
            </Select>
            {touched.preventiveCare && errors.preventiveCare && (
              <FormHelperText error>{errors.preventiveCare}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}

