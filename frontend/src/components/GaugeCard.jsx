import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function GaugeCard({ title, value, maxValue = 100 }) {
  const percentage = (value / maxValue) * 100;

  // Determine color based on percentage
  let color = '#4CAF50'; // Green for good
  if (percentage < 50) {
    color = '#F44336'; // Red for poor
  } else if (percentage < 70) {
    color = '#FF9800'; // Orange for fair
  }

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
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Stack spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
          <Typography color="textSecondary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {title}
          </Typography>
          <Box sx={{ width: 120, height: 120 }}>
            <CircularProgressbar
              value={percentage}
              text={`${Math.round(value)}`}
              styles={buildStyles({
                rotation: 0.25,
                strokeLinecap: 'round',
                textSize: '24px',
                pathTransitionDuration: 0.5,
                pathColor: color,
                textColor: '#333',
                trailColor: '#e0e0e0',
                backgroundColor: '#f5f5f5'
              })}
            />
          </Box>
          <Typography variant="caption" color="textSecondary">
            out of {maxValue}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

