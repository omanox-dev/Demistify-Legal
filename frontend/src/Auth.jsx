import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, Alert, Stack, Fade, Slide } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { API_ENDPOINTS } from './config';

export default function Auth({ onAuth, mode = 'login', onSwitchMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = mode === 'login' ? API_ENDPOINTS.login : API_ENDPOINTS.register;
      const body = mode === 'login'
        ? new URLSearchParams({ username: email, password })
        : JSON.stringify({ email, password });
      const headers = mode === 'login'
        ? { 'Content-Type': 'application/x-www-form-urlencoded' }
        : { 'Content-Type': 'application/json' };
      const res = await fetch(url, { method: 'POST', body, headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Authentication failed');
      onAuth(data.access_token);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f1f5f9 100%)',
        m: 0,
        p: 0,
        overflowX: 'hidden',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pt: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth={false} sx={{ p: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Fade in timeout={700}>
            <Slide in direction="up" timeout={700}>
              <Paper elevation={3} sx={{ p: 5, borderRadius: 3, minWidth: 370, maxWidth: 420, width: '100%', transition: 'box-shadow 0.3s, transform 0.3s', '&:hover': { boxShadow: 8, transform: 'scale(1.025)' } }}>
                <Typography variant="h5" fontWeight={700} align="center" gutterBottom>
                  {mode === 'login' ? 'Sign In' : 'Sign Up'}
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                  />
                  {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3, mb: 2, fontWeight: 700, fontSize: '1.1rem', py: 1.2 }}
                    disabled={loading}
                  >
                    {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Sign Up')}
                  </Button>
                  <Stack spacing={2} sx={{ mt: 2, mb: 1 }}>
                    <Button
                      variant="outlined"
                      color="inherit"
                      fullWidth
                      startIcon={<GoogleIcon sx={{ color: '#ea4335' }} />}
                      sx={{ fontWeight: 600, borderColor: '#ea4335', color: '#222', '&:hover': { borderColor: '#ea4335', background: '#fbe9e7' } }}
                      disabled
                    >
                      Sign in with Google
                    </Button>
                  </Stack>
                </form>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button color="secondary" onClick={onSwitchMode}>
                    {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                  </Button>
                </Box>
              </Paper>
            </Slide>
          </Fade>
        </div>
      </Container>
    </Box>
  );
}
