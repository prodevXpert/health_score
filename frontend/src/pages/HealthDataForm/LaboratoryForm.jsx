import {
  Box,
  Grid,
  TextField,
  Typography,
  Divider
} from '@mui/material';

export default function LaboratoryForm({ formik }) {
  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
        Laboratory & Biomarkers Data
      </Typography>

      {/* Glycemic Control Section */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        🩸 Glycemic Control (8 points)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Fasting Plasma Glucose (mg/dL)"
            name="fastingPlasmaGlucose"
            type="number"
            value={values.fastingPlasmaGlucose}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.fastingPlasmaGlucose && Boolean(errors.fastingPlasmaGlucose)}
            helperText={touched.fastingPlasmaGlucose && errors.fastingPlasmaGlucose}
            placeholder="90"
            inputProps={{ step: '0.1', min: '40', max: '500' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="HbA1c (%)"
            name="hba1c"
            type="number"
            value={values.hba1c}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.hba1c && Boolean(errors.hba1c)}
            helperText={touched.hba1c && errors.hba1c}
            placeholder="5.5"
            inputProps={{ step: '0.1', min: '3', max: '20' }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Lipid Profile Section */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        💊 Lipid Profile (8 points)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Total Cholesterol (mg/dL)"
            name="totalCholesterol"
            type="number"
            value={values.totalCholesterol}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.totalCholesterol && Boolean(errors.totalCholesterol)}
            helperText={touched.totalCholesterol && errors.totalCholesterol}
            placeholder="180"
            inputProps={{ step: '0.1', min: '50', max: '500' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="LDL Cholesterol (mg/dL)"
            name="ldlCholesterol"
            type="number"
            value={values.ldlCholesterol}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.ldlCholesterol && Boolean(errors.ldlCholesterol)}
            helperText={touched.ldlCholesterol && errors.ldlCholesterol}
            placeholder="100"
            inputProps={{ step: '0.1', min: '20', max: '400' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="HDL Cholesterol (mg/dL)"
            name="hdlCholesterol"
            type="number"
            value={values.hdlCholesterol}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.hdlCholesterol && Boolean(errors.hdlCholesterol)}
            helperText={touched.hdlCholesterol && errors.hdlCholesterol}
            placeholder="50"
            inputProps={{ step: '0.1', min: '10', max: '150' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Triglycerides (mg/dL)"
            name="triglycerides"
            type="number"
            value={values.triglycerides}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.triglycerides && Boolean(errors.triglycerides)}
            helperText={touched.triglycerides && errors.triglycerides}
            placeholder="120"
            inputProps={{ step: '0.1', min: '20', max: '1000' }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Renal Function Section */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        🫘 Renal Function (6 points)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Serum Creatinine (mg/dL)"
            name="serumCreatinine"
            type="number"
            value={values.serumCreatinine}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.serumCreatinine && Boolean(errors.serumCreatinine)}
            helperText={touched.serumCreatinine && errors.serumCreatinine}
            placeholder="1.0"
            inputProps={{ step: '0.01', min: '0.1', max: '20' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="BUN (mg/dL)"
            name="bun"
            type="number"
            value={values.bun}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.bun && Boolean(errors.bun)}
            helperText={touched.bun && errors.bun}
            placeholder="15"
            inputProps={{ step: '0.1', min: '1', max: '200' }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Liver Function Section */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        🫀 Liver Function (6 points)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="ALT (U/L)"
            name="alt"
            type="number"
            value={values.alt}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.alt && Boolean(errors.alt)}
            helperText={touched.alt && errors.alt}
            placeholder="25"
            inputProps={{ step: '1', min: '1', max: '1000' }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="AST (U/L)"
            name="ast"
            type="number"
            value={values.ast}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.ast && Boolean(errors.ast)}
            helperText={touched.ast && errors.ast}
            placeholder="25"
            inputProps={{ step: '1', min: '1', max: '1000' }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Total Bilirubin (mg/dL)"
            name="totalBilirubin"
            type="number"
            value={values.totalBilirubin}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.totalBilirubin && Boolean(errors.totalBilirubin)}
            helperText={touched.totalBilirubin && errors.totalBilirubin}
            placeholder="0.8"
            inputProps={{ step: '0.1', min: '0.1', max: '50' }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Hematology Section */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        🔬 Hematology (6 points)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Hemoglobin (g/dL)"
            name="hemoglobin"
            type="number"
            value={values.hemoglobin}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.hemoglobin && Boolean(errors.hemoglobin)}
            helperText={touched.hemoglobin && errors.hemoglobin}
            placeholder="14"
            inputProps={{ step: '0.1', min: '3', max: '25' }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="WBC Count (cells/μL)"
            name="wbcCount"
            type="number"
            value={values.wbcCount}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.wbcCount && Boolean(errors.wbcCount)}
            helperText={touched.wbcCount && errors.wbcCount}
            placeholder="7000"
            inputProps={{ step: '100', min: '1000', max: '50000' }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Platelet Count (cells/μL)"
            name="plateletCount"
            type="number"
            value={values.plateletCount}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.plateletCount && Boolean(errors.plateletCount)}
            helperText={touched.plateletCount && errors.plateletCount}
            placeholder="250000"
            inputProps={{ step: '1000', min: '10000', max: '1000000' }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Thyroid Section */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        🦋 Thyroid Function (6 points)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="TSH (mIU/L)"
            name="tsh"
            type="number"
            value={values.tsh}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.tsh && Boolean(errors.tsh)}
            helperText={touched.tsh && errors.tsh}
            placeholder="2.5"
            inputProps={{ step: '0.01', min: '0.1', max: '50' }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Inflammation Section */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        🔥 Inflammation (5 points)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="CRP (mg/L)"
            name="crp"
            type="number"
            value={values.crp}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.crp && Boolean(errors.crp)}
            helperText={touched.crp && errors.crp}
            placeholder="1.5"
            inputProps={{ step: '0.1', min: '0', max: '500' }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Vitamins Section */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        💊 Vitamins (5 points)
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Vitamin D (ng/mL)"
            name="vitaminD"
            type="number"
            value={values.vitaminD}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.vitaminD && Boolean(errors.vitaminD)}
            helperText={touched.vitaminD && errors.vitaminD}
            placeholder="30"
            inputProps={{ step: '0.1', min: '1', max: '200' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Vitamin B12 (pg/mL)"
            name="vitaminB12"
            type="number"
            value={values.vitaminB12}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.vitaminB12 && Boolean(errors.vitaminB12)}
            helperText={touched.vitaminB12 && errors.vitaminB12}
            placeholder="400"
            inputProps={{ step: '1', min: '50', max: '5000' }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}


