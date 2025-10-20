import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Alert, CircularProgress, 
  IconButton, Paper, AppBar, Toolbar, Tabs, Tab, Card, CardContent,
  Chip, Avatar, Grid
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  DocumentScanner as DocumentIcon,
  Summarize as SummarizeIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import FileUpload from './FileUpload';
import { API_ENDPOINTS } from './config';

export default function Summary({ token, onNavigate, onLogout }) {
  const theme = useTheme();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setText("");
    setResult(null);
    setError("");
  };

  const handleFileRemove = () => {
    setFile(null);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setFile(null);
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    
    try {
      let docText = text;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch(API_ENDPOINTS.upload, {
          method: 'POST',
          body: formData,
          headers: { Authorization: `Bearer ${token}` },
        });
        const uploadData = await uploadRes.json();
        docText = uploadData.filename;
      }
      
      const simplifyForm = new FormData();
      simplifyForm.append('text', docText);
      const simplifyRes = await fetch(API_ENDPOINTS.simplify, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: simplifyForm,
      });
      
      if (simplifyRes.status === 401) {
        onLogout();
        return;
      }
      
      const simplifyData = await simplifyRes.json();
      setResult(simplifyData);
      
      // Save to localStorage for reports
      const reports = JSON.parse(localStorage.getItem('demystify_reports') || '[]');
      reports.unshift({ 
        summary: simplifyData.summary, 
        simplified: simplifyData.simplified || '', 
        ts: Date.now(),
        type: 'Summary'
      });
      localStorage.setItem('demystify_reports', JSON.stringify(reports.slice(0, 20)));
      
    } catch (err) {
      setError('Error processing document. Please check your connection and try again.');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', backgroundColor: theme.palette.background.default }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ borderRadius: 0 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              aria-label="Back to Home" 
              onClick={() => onNavigate('home')} 
              size="large" 
              sx={{ mr: 1, color: '#fff' }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DocumentIcon sx={{ color: theme.palette.info.main }} />
              <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: 1, color: '#fff' }}>
                Plain Summary
              </Typography>
            </Box>
          </Box>
          {token && (
            <Button color="inherit" onClick={onLogout} sx={{ fontWeight: 600 }}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar sx={{ 
              backgroundColor: `${theme.palette.info.main}20`, 
              color: theme.palette.info.main,
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 3
            }}>
              <SummarizeIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: theme.palette.primary.main }}>
              Plain English Summary
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Transform complex legal language into clear, understandable explanations that anyone can follow.
            </Typography>
          </Box>

          {/* Benefits */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <Chip 
              icon={<PsychologyIcon />} 
              label="Easy to Understand" 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              icon={<SummarizeIcon />} 
              label="Comprehensive" 
              color="info" 
              variant="outlined" 
            />
            <Chip 
              label="Plain Language" 
              color="success" 
              variant="outlined" 
            />
          </Box>

          {/* Input Section */}
          <Box sx={{ mb: 4 }}>
            <Tabs 
              value={tabValue} 
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Upload Document" />
              <Tab label="Paste Text" />
            </Tabs>

            {tabValue === 0 ? (
              <FileUpload
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                disabled={loading}
              />
            ) : (
              <TextField
                label="Paste your legal document text here"
                value={text}
                onChange={handleTextChange}
                multiline
                rows={8}
                fullWidth
                disabled={loading}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
                placeholder="Copy and paste your contract, agreement, or any legal document text here for a comprehensive summary..."
              />
            )}
          </Box>

          {/* Action Button */}
          <Button
            onClick={handleSubmit}
            variant="contained"
            size="large"
            fullWidth
            disabled={loading || (!text && !file)}
            sx={{ 
              mb: 3,
              py: 2,
              borderRadius: 3,
              fontWeight: 700,
              fontSize: '1.1rem',
              textTransform: 'none',
              backgroundColor: theme.palette.info.main,
              '&:hover': {
                backgroundColor: theme.palette.info.dark,
              }
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={24} color="inherit" />
                Creating Summary...
              </Box>
            ) : (
              'Generate Plain Summary'
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          {/* Results Section */}
          {result && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: theme.palette.primary.main, textAlign: 'center' }}>
                📄 Document Analysis Results
              </Typography>
              
              <Grid container spacing={3}>
                {/* Summary */}
                {result.summary && (
                  <Grid item xs={12} md={result.simplified ? 6 : 12}>
                    <Card sx={{ height: '100%', borderRadius: 3, border: `2px solid ${theme.palette.info.main}20` }}>
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                          <SummarizeIcon sx={{ color: theme.palette.info.main, fontSize: 28 }} />
                          <Typography variant="h6" fontWeight={700} sx={{ color: theme.palette.primary.main }}>
                            📋 Key Summary
                          </Typography>
                        </Box>
                        <Paper sx={{ 
                          p: 3, 
                          backgroundColor: theme.palette.grey[50], 
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.grey[200]}`
                        }}>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              lineHeight: 1.7,
                              color: theme.palette.text.primary
                            }}
                          >
                            {result.summary}
                          </Typography>
                        </Paper>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Simplified Text */}
                {result.simplified && (
                  <Grid item xs={12} md={result.summary ? 6 : 12}>
                    <Card sx={{ height: '100%', borderRadius: 3, border: `2px solid ${theme.palette.secondary.main}20` }}>
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                          <PsychologyIcon sx={{ color: theme.palette.secondary.main, fontSize: 28 }} />
                          <Typography variant="h6" fontWeight={700} sx={{ color: theme.palette.primary.main }}>
                            📝 Simplified Text
                          </Typography>
                        </Box>
                        <Paper sx={{ 
                          p: 3, 
                          backgroundColor: theme.palette.grey[50], 
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.grey[200]}`
                        }}>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              lineHeight: 1.7,
                              color: theme.palette.text.primary
                            }}
                          >
                            {result.simplified}
                          </Typography>
                        </Paper>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
              
              {/* Action Buttons */}
              <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => onNavigate('tldr')}
                  sx={{ borderRadius: 2 }}
                >
                  Get Quick TL;DR
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => onNavigate('analyzer')}
                  sx={{ borderRadius: 2 }}
                >
                  Detailed Clause Analysis
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => onNavigate('reports')}
                  sx={{ borderRadius: 2 }}
                >
                  View All Reports
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
