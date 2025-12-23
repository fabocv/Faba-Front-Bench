import { useEffect, useState } from 'react';
import { Container, Card, CardContent, Avatar, Typography, Box, Grid } from '@mui/material';
import usuariosData from './assets/users.json'; 

function App() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    setUsuarios(usuariosData['results']);

    // Harness de Auditoría
    let lastLongTaskEnd = performance.now();
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const taskEnd = entry.startTime + entry.duration;
        if (taskEnd > lastLongTaskEnd) lastLongTaskEnd = taskEnd;
      }
    });
    observer.observe({ type: 'longtask', buffered: true });

    const intervalId = setInterval(() => {
      const now = performance.now();
      if (now - lastLongTaskEnd >= 300) {
        clearInterval(intervalId);
        observer.disconnect();
        finalizeBenchmark(now);
      }
    }, 100);

    return () => { clearInterval(intervalId); observer.disconnect(); };
  }, []);

  const finalizeBenchmark = (endTime) => {
    const resources = performance.getEntriesByType('resource');
    const jsResources = resources.filter(r => r.initiatorType === 'script' || r.name.endsWith('.js'));
    
    window.fabaRawMetrics = {
      network: {
        totalTransferredKB: resources.reduce((acc, r) => acc + (r.transferSize || 0), 0) / 1024,
        jsBundleKB: jsResources.reduce((acc, r) => acc + (r.transferSize || 0), 0) / 1024,
        requests: resources.length
      },
      performance: {
        FCPms: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        FTTSms: endTime 
      },
      memory: {
        jsHeapUsedMB: (performance.memory?.usedJSHeapSize || 0) / (1024 * 1024)
      }
    };
    console.log("📊 React Heavy (MUI) Complete", window.fabaRawMetrics);
  };

  return (
    <>
    <div className="bg"></div>
    <Container className="content">
      <Typography variant="h4" gutterBottom>Usuarios MUI ({usuarios.length})</Typography>
      <Grid container className="container">
        {usuarios.map((user, index) => (
          <Grid item  key={user.id || index}>
            <Card className="card">
              <Avatar className="avatar">
                {user.name.first[0]}{user.name.last[0]}
              </Avatar>
              <CardContent className="info">
                <Typography variant="subtitle1" noWrap>
                  {user.name.title} {user.name.first} {user.name.last}
                </Typography>
                <Typography variant="body2" color="text.secondary">{user.email}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    </>
  );
}

export default App;