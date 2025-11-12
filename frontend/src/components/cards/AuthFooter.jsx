// material-ui
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

export default function AuthFooter() {
  return (
    <Container maxWidth="xl">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 2, justifyContent: { xs: 'center', sm: 'space-between', textAlign: { xs: 'center', sm: 'inherit' } } }}
      >
        <Typography variant="subtitle2" color="secondary">
          © 2025 HealthScore Bureau. All rights reserved.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: { xs: 1, sm: 3 }, textAlign: { xs: 'center', sm: 'inherit' } }}>
          <Typography
            variant="subtitle2"
            color="secondary"
            component={Link}
            href="https://mui.com/store/terms/"
            target="_blank"
            underline="hover"
          >
            Terms and Conditions
          </Typography>
          <Typography
            variant="subtitle2"
            color="secondary"
            component={Link}
            href="https://mui.com/legal/privacy/"
            target="_blank"
            underline="hover"
          >
            Privacy Policy
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
}
