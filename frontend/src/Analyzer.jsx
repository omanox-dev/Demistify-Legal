import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Alert, CircularProgress, 
  IconButton, AppBar, Toolbar, Paper, Divider, Tabs, Tab,
  Chip, Card, CardContent, Collapse, Stack, Grid
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import FileUpload from './FileUpload';
import { API_ENDPOINTS } from './config';

export default function Analyzer({ token, onNavigate, onLogout }) {
  const theme = useTheme();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [clauses, setClauses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [expandedClauses, setExpandedClauses] = useState(new Set());

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setText("");
    setResult(null);
    setClauses([]);
    setError("");
  };

  const handleFileRemove = () => {
    setFile(null);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setFile(null);
    setResult(null);
    setClauses([]);
    setError("");
  };

  const toggleClauseExpansion = (index) => {
    const newExpanded = new Set(expandedClauses);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedClauses(newExpanded);
  };

  const getRiskColor = (risk) => {
    const riskLevel = risk?.toLowerCase() || '';
    if (riskLevel.includes('high') || riskLevel.includes('critical')) {
      return theme.palette.error.main;
    } else if (riskLevel.includes('medium') || riskLevel.includes('moderate')) {
      return theme.palette.warning.main;
    } else if (riskLevel.includes('low')) {
      return theme.palette.success.main;
    }
    return theme.palette.info.main;
  };

  const getRiskIcon = (risk) => {
    const riskLevel = risk?.toLowerCase() || '';
    if (riskLevel.includes('high') || riskLevel.includes('critical')) {
      return <ErrorIcon />;
    } else if (riskLevel.includes('medium') || riskLevel.includes('moderate')) {
      return <WarningIcon />;
    } else if (riskLevel.includes('low')) {
      return <CheckCircleIcon />;
    }
    return <InfoIcon />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setClauses([]);
    setExpandedClauses(new Set());
    
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
      
      // Call clause segmentation endpoint
      const segRes = await fetch(API_ENDPOINTS.segmentClauses, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: docText }),
      });
      const segData = await segRes.json();
      setClauses(segData.clauses || []);
      
      // Continue with simplification
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
        simplified: simplifyData.simplified, 
        ts: Date.now(),
        clauses: segData.clauses || []
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
            <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: 1, color: '#fff' }}>
              Clause-by-Clause Analysis
            </Typography>
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
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: theme.palette.primary.main }}>
              Comprehensive Document Analysis
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Get detailed insights into each clause, identify potential risks, and understand complex legal language.
            </Typography>
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
                placeholder="Copy and paste your contract, agreement, or any legal document text here for comprehensive analysis..."
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
              textTransform: 'none'
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={24} color="inherit" />
                Analyzing Document...
              </Box>
            ) : (
              'Start Comprehensive Analysis'
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
          {(clauses.length > 0 || result) && (
            <Box sx={{ mt: 4 }}>
              <Divider sx={{ mb: 4 }} />
              
              {/* Clause Analysis */}
              {clauses.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: theme.palette.primary.main }}>
                    📋 Clause-by-Clause Breakdown
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Each clause has been analyzed for potential risks and complexity. Click to expand for detailed explanations.
                  </Typography>
                  
                  <Stack spacing={2}>
                    {clauses.map((clause, idx) => (
                      <Card key={idx} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <CardContent 
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: theme.palette.grey[50] }
                          }}
                          onClick={() => toggleClauseExpansion(idx)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Typography variant="h6" fontWeight={600}>
                                  Clause {idx + 1}
                                </Typography>
                                <Chip
                                  icon={getRiskIcon(clause.risk)}
                                  label={clause.risk || 'Unknown Risk'}
                                  size="small"
                                  sx={{
                                    backgroundColor: `${getRiskColor(clause.risk)}20`,
                                    color: getRiskColor(clause.risk),
                                    fontWeight: 600
                                  }}
                                />
                              </Box>
                              
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  fontStyle: 'italic',
                                  color: theme.palette.text.secondary,
                                  mb: 1,
                                  display: '-webkit-box',
                                  WebkitLineClamp: expandedClauses.has(idx) ? 'none' : 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}
                              >
                                "{clause.clause}"
                              </Typography>
                            </Box>
                            
                            <IconButton>
                              {expandedClauses.has(idx) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          </Box>

                          <Collapse in={expandedClauses.has(idx)}>
                            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: theme.palette.primary.main }}>
                                🤖 AI Analysis:
                              </Typography>
                              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                {clause.ai_explanation || 'Analysis not available for this clause.'}
                              </Typography>
                            </Box>
                          </Collapse>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Summary Results */}
              {result && (
                <Box>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: theme.palette.primary.main }}>
                    📄 Document Summary
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%', borderRadius: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: theme.palette.info.main }}>
                            📝 Simplified Version
                          </Typography>
                          <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                            {result.simplified}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%', borderRadius: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: theme.palette.secondary.main }}>
                            📋 Key Summary
                          </Typography>
                          <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                            {result.summary}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
