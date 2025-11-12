import { Card, CardContent, Typography, Box, Stack } from '@mui/material';

export default function SummaryCard({ title, value, icon: Icon, color = 'primary' }) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
              {title}
            </Typography>
            {Icon && (
              <Box
                sx={{
                  p: 1,
                  borderRadius: '8px',
                  backgroundColor: `${color}.lighter`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon sx={{ color: `${color}.main`, fontSize: '1.5rem' }} />
              </Box>
            )}
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

