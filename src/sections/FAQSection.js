import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
  Stack,
} from '@mui/material';

import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';

import {
  motion,
  useInView,
  AnimatePresence,
} from 'framer-motion';

import {
  doc,
  onSnapshot,
} from 'firebase/firestore';

import { db } from '../firebase';
import { useCustomTheme } from '../context/ThemeContext';

/* =========================================================
   BUNKMATES CONFIGURATION
========================================================= */

const BUNKMATES_URLS = {
  landing: 'https://bunkmates.xyz',
  app: 'https://app.bunkmates.xyz',
  install: 'https://bunkmates.xyz/bm-install',
};

/* =========================================================
   FALLBACK FAQS
========================================================= */

const FALLBACK_FAQS = [
  {
    question: 'What is BunkMates?',
    answer:
      'BunkMates is a collaborative trip planning platform designed to help friends organize trips, coordinate together, and manage their travel plans in one place.',
  },
  {
    question: 'Where can I plan a trip?',
    answer:
      'You can access the BunkMates Trip Planner at app.bunkmates.xyz and start organizing your trip with your friends.',
  },
  {
    question: 'How do I download BunkMates?',
    answer:
      'BunkMates is currently available on Android through Google Play. Visit bunkmates.xyz/bm-install for the official download options.',
  },
  {
    question: 'Is BunkMates available on iPhone or iOS?',
    answer:
      'BunkMates is currently not available on iOS or the Apple App Store.',
  },
  {
    question: 'Is BunkMates available on Android?',
    answer:
      'Yes. BunkMates is available on Android through Google Play. You can visit bunkmates.xyz/bm-install for official download options.',
  },
  {
    question: 'What is the official BunkMates website?',
    answer:
      'The official BunkMates website is bunkmates.xyz. The main Trip Planner is available at app.bunkmates.xyz.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Visit app.bunkmates.xyz to open BunkMates, create or join a trip, and start planning with your travel group.',
  },
];

/* =========================================================
   BUNKMATES AI MODAL COMPONENT
========================================================= */

const BunkMatesAI = ({ open, onClose, isDark, colors }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey! I'm BunkMates AI. Ask me anything about BunkMates, planning a trip, or your next adventure.",
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 350);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages, loading, open]);

  const handleSendMessage = async () => {
    const question = input.trim();
    if (!question || loading) return;

    const userMessage = { role: 'user', content: question };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const apiKey = `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`;
      if (!apiKey) throw new Error('BunkMates AI is currently unavailable.');

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [
            {
              role: 'system',
              content: `
You are BunkMates AI, the official assistant for BunkMates.
BunkMates is a collaborative trip planning platform.

OFFICIAL LINKS:
Official website: ${BUNKMATES_URLS.landing}
Trip Planner: ${BUNKMATES_URLS.app}
Official Android download page: ${BUNKMATES_URLS.install}

PLATFORM AVAILABILITY:
BunkMates is currently available on Android through Google Play.
BunkMates is NOT currently available on iOS or the Apple App Store.

RULES:
- Always call the product BunkMates.
- Never claim BunkMates is available on iOS.
- For Android downloads, use: ${BUNKMATES_URLS.install}
- For the Trip Planner, use: ${BUNKMATES_URLS.app}
- For general information, use: ${BUNKMATES_URLS.landing}
- Keep answers concise, useful, and friendly.
              `,
            },
            ...updatedMessages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || 'Unable to get an answer.');

      const answer = data?.choices?.[0]?.message?.content;
      if (!answer) throw new Error('No response received.');

      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (error) {
      console.error('BunkMates AI Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I could not answer that right now. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1300,
              background: isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          />

          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: 1301,
              pointerEvents: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'stretch',
              px: { xs: 0, sm: 2, md: 3 },
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 920,
                height: '100dvh',
                position: 'relative',
                pointerEvents: 'auto',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: colors.background,
                borderLeft: { xs: 'none', sm: `1px solid ${colors.border}` },
                borderRight: { xs: 'none', sm: `1px solid ${colors.border}` },
                boxShadow: isDark ? '0 0 100px rgba(0,0,0,0.8)' : '0 0 80px rgba(0,0,0,0.1)',
              }}
            >
              <Box
                sx={{
                  mx: { xs: 1.5, sm: 2 },
                  mt: { xs: 1.5, sm: 2 },
                  px: { xs: 2, sm: 2.5 },
                  py: 1.5,
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '14px',
                      display: 'grid',
                      placeItems: 'center',
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                      color: colors.text,
                    }}
                  >
                    <AutoAwesomeRoundedIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: colors.text, fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>
                      BunkMates AI
                    </Typography>
                    <Typography sx={{ color: colors.secondaryText, fontSize: '0.75rem' }}>
                      Intelligent trip companion
                    </Typography>
                  </Box>
                </Stack>

                <IconButton
                  onClick={onClose}
                  aria-label="Close AI"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '13px',
                    color: colors.secondaryText,
                    border: `1px solid ${colors.border}`,
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                      color: colors.text,
                    },
                  }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  px: { xs: 2, sm: 4, md: 5 },
                  py: 3,
                }}
              >
                {messages.map((message, index) => {
                  const isUser = message.role === 'user';
                  return (
                    <Box
                      key={index}
                      sx={{
                        alignSelf: isUser ? 'flex-end' : 'flex-start',
                        maxWidth: { xs: '90%', sm: '75%' },
                      }}
                    >
                      <Box
                        sx={{
                          px: 2.2,
                          py: 1.4,
                          borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                          backgroundColor: isUser ? colors.text : colors.surface,
                          color: isUser ? colors.background : colors.text,
                          border: `1px solid ${isUser ? 'transparent' : colors.border}`,
                          fontSize: '0.92rem',
                          lineHeight: 1.65,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {message.content}
                      </Box>
                    </Box>
                  );
                })}

                {loading && (
                  <Box
                    sx={{
                      alignSelf: 'flex-start',
                      px: 2,
                      py: 1.2,
                      borderRadius: '16px 16px 16px 6px',
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.2,
                    }}
                  >
                    <CircularProgress size={16} sx={{ color: colors.text }} />
                    <Typography sx={{ color: colors.secondaryText, fontSize: '0.8rem', fontWeight: 600 }}>
                      Thinking...
                    </Typography>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>

              <Box sx={{ p: { xs: 1.5, sm: 2.5 }, borderTop: `1px solid ${colors.border}`, backgroundColor: colors.surface }}>
                <TextField
                  inputRef={inputRef}
                  fullWidth
                  value={input}
                  placeholder="Ask anything about your next trip..."
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          disabled={!input.trim() || loading}
                          onClick={handleSendMessage}
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: '13px',
                            backgroundColor: colors.text,
                            color: colors.background,
                            '&:hover': {
                              backgroundColor: isDark ? '#e8e8e8' : '#242424',
                            },
                            '&.Mui-disabled': {
                              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                              color: colors.secondaryText,
                            },
                          }}
                        >
                          <SendRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '16px',
                      backgroundColor: colors.surfaceStrong,
                      color: colors.text,
                      '& fieldset': { border: `1px solid ${colors.border}` },
                      '&:hover fieldset': { borderColor: colors.secondaryText },
                      '&.Mui-focused fieldset': { borderColor: colors.text },
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </>
      )}
    </AnimatePresence>
  );
};

/* =========================================================
   FAQ SECTION COMPONENT
========================================================= */

const FAQSection = () => {
  const { isDark } = useCustomTheme();

  const [expanded, setExpanded] = useState(0);
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const colors = {
    background: isDark ? '#000000' : '#ffffff',
    surface: isDark ? '#0d0d0d' : '#f7f7f7',
    surfaceStrong: isDark ? '#141414' : '#ffffff',
    text: isDark ? '#ffffff' : '#111111',
    secondaryText: isDark ? '#a3a3a3' : '#737373',
    border: isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.08)',
    subtleBorder: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
  };

  useEffect(() => {
    if (isInView && expanded === null) {
      setExpanded(0);
    }
  }, [isInView, expanded]);

  useEffect(() => {
    setLoading(true);
    const docRef = doc(db, 'landing_page', 'home');

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setFaqs(FALLBACK_FAQS);
          setLoading(false);
          return;
        }

        const data = snapshot.data();
        if (Array.isArray(data?.faqs) && data.faqs.length > 0) {
          setFaqs(
            data.faqs.map((faq) => ({
              question: faq.question ?? faq.title ?? 'Question',
              answer: faq.answer ?? faq.content ?? '',
            }))
          );
        } else {
          setFaqs(FALLBACK_FAQS);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error loading FAQs:', error);
        setFaqs(FALLBACK_FAQS);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredFaqs = faqs.filter((faq) => {
    const query = searchQuery.toLowerCase();
    return (
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    );
  });

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  return (
    <Box
      id="faq"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 10, sm: 12, md: 16 },
        backgroundColor: colors.background,
        color: colors.text,
        transition: 'background-color 0.35s ease, color 0.35s ease',
      }}
    >
      {/* Background Glows */}
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 300, md: 550 },
          height: { xs: 300, md: 550 },
          borderRadius: '50%',
          top: -240,
          right: -200,
          backgroundColor: isDark ? 'rgba(255,255,255,0.018)' : 'rgba(0,0,0,0.018)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: -160,
          bottom: 40,
          width: { xs: 260, md: 450 },
          height: { xs: 260, md: 450 },
          borderRadius: '50%',
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      <Container
        maxWidth="lg"
        ref={ref}
        sx={{
          position: 'relative',
          zIndex: 1,
          px: { xs: 2.5, sm: 4, md: 5 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'flex-start' },
            justifyContent: 'space-between',
            gap: { xs: 6, md: 7, lg: 9 },
          }}
        >
          {/* =============================================
              LEFT SECTION: HEADER & AI BANNER
          ============================================= */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            sx={{
              flex: { xs: '1 1 100%', md: '0 0 42%' },
              position: { md: 'sticky' },
              top: { md: 100 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            {/* Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.8,
                px: 1.4,
                py: 0.75,
                mb: 3,
                borderRadius: '999px',
                border: `1px solid ${colors.border}`,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(0, 0, 0, 0.025)',
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 15, color: colors.text }} />
              <Typography
                sx={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.01em',
                  color: colors.secondaryText,
                }}
              >
                GOT QUESTIONS?
              </Typography>
            </Box>

            {/* Title */}
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.4rem', sm: '3.1rem', md: '3.6rem' },
                lineHeight: 1.05,
                fontWeight: 850,
                letterSpacing: '-0.055em',
                color: colors.text,
                mb: 2.5,
              }}
            >
              Everything sorted.
              <br />
              <Box component="span" sx={{ color: colors.secondaryText }}>
                Before the adventure starts.
              </Box>
            </Typography>

            {/* Subtitle */}
            <Typography
              sx={{
                maxWidth: 440,
                fontSize: { xs: '0.98rem', md: '1.05rem' },
                lineHeight: 1.75,
                color: colors.secondaryText,
                mb: 4,
              }}
            >
              Find answers to common questions about trip planning, squads, and offline vaults, or ask our intelligent companion.
            </Typography>

            {/* AI Action Card */}
            <Box
              component={motion.div}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              sx={{
                width: '100%',
                p: { xs: 2.5, sm: 3 },
                borderRadius: '24px',
                backgroundColor: colors.surfaceStrong,
                border: `1px solid ${colors.border}`,
                boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.2)' : '0 12px 30px rgba(0,0,0,0.035)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 2,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '14px',
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.045)',
                    color: colors.text,
                    flexShrink: 0,
                  }}
                >
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: colors.text, letterSpacing: '-0.02em' }}>
                    Ask BunkMates AI
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: colors.secondaryText }}>
                    Instant planning & feature assistance
                  </Typography>
                </Box>
              </Stack>

              <Button
                fullWidth
                onClick={() => setAiOpen(true)}
                endIcon={<AutoAwesomeRoundedIcon sx={{ fontSize: '1rem !important' }} />}
                sx={{
                  minHeight: 44,
                  px: 2.5,
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 750,
                  backgroundColor: colors.text,
                  color: colors.background,
                  boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 6px 18px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: isDark ? '#e8e8e8' : '#242424',
                  },
                }}
              >
                Ask AI
              </Button>
            </Box>
          </Box>

          {/* =============================================
              RIGHT SECTION: SEARCH, ACCORDION & SUPPORT
          ============================================= */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', md: '0 0 54%' },
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >

            {/* Accordion FAQ List */}
            {loading ? (
              <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center" sx={{ py: 8 }}>
                <CircularProgress size={22} sx={{ color: colors.text }} />
                <Typography sx={{ color: colors.secondaryText, fontSize: '0.9rem' }}>
                  Loading questions...
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={1.2}>
                <AnimatePresence mode="popLayout">
                  {filteredFaqs.length === 0 ? (
                    <Box
                      sx={{
                        py: 7,
                        textAlign: 'center',
                        borderRadius: '24px',
                        backgroundColor: colors.surface,
                        border: `1px dashed ${colors.border}`,
                      }}
                    >
                      <Typography sx={{ color: colors.secondaryText, fontWeight: 600 }}>
                        No matching questions found.
                      </Typography>
                    </Box>
                  ) : (
                    filteredFaqs.map((faq, index) => {
                      const isPanelOpen = expanded === index;

                      return (
                        <Accordion
                          key={index}
                          expanded={isPanelOpen}
                          onChange={handleChange(index)}
                          disableGutters
                          elevation={0}
                          sx={{
                            borderRadius: '20px !important',
                            backgroundColor: isPanelOpen ? colors.surfaceStrong : colors.surface,
                            border: `1px solid ${isPanelOpen ? colors.border : colors.subtleBorder}`,
                            boxShadow: isPanelOpen
                              ? isDark
                                ? '0 12px 30px rgba(0,0,0,0.25)'
                                : '0 8px 24px rgba(0,0,0,0.03)'
                              : 'none',
                            transition: 'all 0.25s ease',
                            '&:before': { display: 'none' },
                            '&:hover': {
                              borderColor: colors.border,
                              backgroundColor: colors.surfaceStrong,
                            },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '10px',
                                  display: 'grid',
                                  placeItems: 'center',
                                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                                  color: colors.text,
                                }}
                              >
                                <ExpandMoreRoundedIcon sx={{ fontSize: 20 }} />
                              </Box>
                            }
                            sx={{
                              minHeight: 62,
                              px: { xs: 2, sm: 2.6 },
                              '& .MuiAccordionSummary-content': { my: 1.4 },
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: { xs: '0.92rem', sm: '1rem' },
                                fontWeight: 750,
                                letterSpacing: '-0.02em',
                                color: colors.text,
                              }}
                            >
                              {faq.question}
                            </Typography>
                          </AccordionSummary>

                          <AccordionDetails sx={{ px: { xs: 2, sm: 2.6 }, pb: 2.4, pt: 0 }}>
                            <Typography
                              sx={{
                                color: colors.secondaryText,
                                fontSize: { xs: '0.86rem', sm: '0.92rem' },
                                lineHeight: 1.75,
                              }}
                            >
                              {faq.answer}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })
                  )}
                </AnimatePresence>
              </Stack>
            )}

            {/* Bottom Support Callout Panel */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              sx={{
                mt: 2,
                p: { xs: 2.5, sm: 3 },
                borderRadius: '24px',
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.18)' : '0 12px 30px rgba(0,0,0,0.035)',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                gap: 2.5,
              }}
            >
              <Stack direction="row" spacing={1.8} alignItems="center">
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: '13px',
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.045)',
                    color: colors.text,
                    flexShrink: 0,
                  }}
                >
                  <SupportAgentRoundedIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.96rem', fontWeight: 800, color: colors.text, mb: 0.2 }}>
                    Still need help?
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: colors.secondaryText, lineHeight: 1.5 }}>
                    Reach out and our team will get your squad sorted.
                  </Typography>
                </Box>
              </Stack>

              <Button
                href="#contact"
                endIcon={<TravelExploreRoundedIcon sx={{ fontSize: '1rem !important' }} />}
                sx={{
                  minHeight: 42,
                  px: 2.5,
                  borderRadius: '13px',
                  textTransform: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: colors.text,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.045)' : 'rgba(0, 0, 0, 0.035)',
                  border: `1px solid ${colors.border}`,
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                  },
                }}
              >
                Contact Support
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* AI Drawer Overlay */}
      <BunkMatesAI
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        isDark={isDark}
        colors={colors}
      />
    </Box>
  );
};

export default FAQSection;