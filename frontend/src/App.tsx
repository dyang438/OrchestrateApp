import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  timestamp: number;
  value: number;
  metric2: number;
  metric3: number;
}

interface DisplayDataPoint {
  relativeTime: number;
  value: number;
  metric2: number;
  metric3: number;
}

function App() {
  const [allData, setAllData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeWindow, setTimeWindow] = useState<number>(10); // in seconds

  const MAX_DATA_RETENTION = 300; // Keep 5 minutes of data (300 seconds)

  const fetchData = () => {
    fetch('http://localhost:8000/api/data')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((result) => {
        setAllData((prevData) => {
          // Add the new data point
          const newData = [...prevData, result.dataPoint];

          // Remove data points older than 5 minutes
          const now = result.dataPoint.timestamp;
          const cutoffTime = now - MAX_DATA_RETENTION * 1000;
          const filteredData = newData.filter(
            (point) => point.timestamp >= cutoffTime
          );

          return filteredData;
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Poll every second
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter data based on time window and convert to relative time
  const displayData: DisplayDataPoint[] = (() => {
    if (allData.length === 0) return [];

    const now = allData[allData.length - 1].timestamp;
    const windowStart = now - timeWindow * 1000;

    return allData
      .filter((point) => point.timestamp >= windowStart)
      .map((point) => ({
        relativeTime: (point.timestamp - now) / 1000, // Convert to seconds relative to now
        value: point.value,
        metric2: point.metric2,
        metric3: point.metric3,
      }));
  })();

  const handleTimeWindowChange = (
    _: React.MouseEvent<HTMLElement>,
    newWindow: number | null
  ) => {
    if (newWindow !== null) {
      setTimeWindow(newWindow);
    }
  };

  const formatXAxis = (value: number) => {
    return `${value}s`;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Real-Time Sensor Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Live data streaming - updates every second
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" sx={{ my: 2 }}>
            Error: {error}
          </Typography>
        )}

        {!loading && !error && allData.length > 0 && (
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h5">Metrics Over Time</Typography>
              <Box>
                <Typography variant="caption" sx={{ mr: 2 }}>
                  Time Window:
                </Typography>
                <ToggleButtonGroup
                  value={timeWindow}
                  exclusive
                  onChange={handleTimeWindowChange}
                  size="small"
                >
                  <ToggleButton value={10}>10s</ToggleButton>
                  <ToggleButton value={30}>30s</ToggleButton>
                  <ToggleButton value={60}>1m</ToggleButton>
                  <ToggleButton value={120}>2m</ToggleButton>
                  <ToggleButton value={300}>5m</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={displayData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="relativeTime"
                  tickFormatter={formatXAxis}
                  domain={[-timeWindow, 0]}
                  type="number"
                  label={{ value: 'Time (seconds ago)', position: 'bottom' }}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => `${value}s ago`}
                  formatter={(value: number) => value.toFixed(2)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Primary Metric"
                  activeDot={{ r: 8 }}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="metric2"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Secondary Metric"
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="metric3"
                  stroke="#ffc658"
                  strokeWidth={2}
                  name="Tertiary Metric"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default App;
