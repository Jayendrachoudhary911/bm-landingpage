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
  alpha,
} from '@mui/material';

import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useCustomTheme } from '../context/ThemeContext';

const BUNKMATES_URLS = {
  landing: 'https://bunkmates.xyz',
  app: 'https://app.bunkmates.xyz',
  install: 'https://bunkmates.xyz/bm-install',
};

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
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1300,
              background: isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(12px)',
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: '100%',
                maxWidth: 880,
                height: '100dvh',
                pointerEvents: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  my: { xs: 0, sm: 2 },
                  borderRadius: { xs: 0, sm: '30px' },
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  backgroundColor: colors.background,
                  border: { xs: 'none', sm: `1px solid ${colors.border}` },
                  boxShadow: isDark ? '0 0 100px rgba(0,0,0,0.85)' : '0 0 80px rgba(0,0,0,0.15)',
                }}
              >
                {/* Modal Top Bar */}
                <Box
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: colors.surface,
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '12px',
                        display: 'grid',
                        placeItems: 'center',
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                        color: colors.text,
                      }}
                    >
                      <AutoAwesomeRoundedIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ color: colors.text, fontWeight: 800, fontSize: '1rem' }}>
                        BunkMates AI
                      </Typography>
                      <Typography sx={{ color: colors.secondaryText, fontSize: '0.75rem' }}>
                        Intelligent trip companion
                      </Typography>
                    </Box>
                  </Stack>

                  <IconButton
                    onClick={onClose}
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '12px',
                      color: colors.secondaryText,
                      border: `1px solid ${colors.border}`,
                      '&:hover': {
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                        color: colors.text,
                      },
                    }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 19 }} />
                  </IconButton>
                </Box>

                {/* Messages Feed */}
                <Box
                  sx={{
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    px: { xs: 2, sm: 4 },
                    py: 3,
                  }}
                >
                  {messages.map((message, index) => {
                    const isUser = message.role === 'user';
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                          alignSelf: isUser ? 'flex-end' : 'flex-start',
                          maxWidth: '85%',
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
                            wordBreak: 'break-word',
                          }}
                        >
                          {message.content}
                        </Box>
                      </motion.div>
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

                {/* Input Controls */}
                <Box sx={{ p: { xs: 1.5, sm: 2.5 }, borderTop: `1px solid ${colors.border}`, backgroundColor: colors.surface }}>
                  <TextField
                    inputRef={inputRef}
                    fullWidth
                    value={input}
                    placeholder="Ask about planning, squads, or trails..."
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
                      },
                    }}
                  />
                </Box>
              </Box>
            </motion.div>
          </Box>
        </>
      )}
    </AnimatePresence>
  );
};

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
    background: isDark ? '#09090b' : '#ffffff',
    surface: isDark ? '#141417' : '#f7f7f8',
    surfaceStrong: isDark ? '#1a1a1f' : '#ffffff',
    text: isDark ? '#ffffff' : '#09090b',
    secondaryText: isDark ? '#a1a1aa' : '#71717a',
    border: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    subtleBorder: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
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
        py: { xs: 10, sm: 14, md: 18 },
        backgroundColor: colors.background,
        color: colors.text,
        transition: 'background-color 0.35s ease, color 0.35s ease',
      }}
    >
      <Container maxWidth="lg" ref={ref} sx={{ position: 'relative', zIndex: 1, px: { xs: 2.5, sm: 4, md: 5 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'flex-start' },
            justifyContent: 'space-between',
            gap: { xs: 6, md: 8, lg: 9 },
          }}
        >
          {/* Left Panel */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            sx={{
              flex: { xs: '1 1 100%', md: '0 0 42%' },
              position: { md: 'sticky' },
              top: { md: 120 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.8,
                px: 1.4,
                py: 0.65,
                mb: 2.5,
                borderRadius: '999px',
                border: `1px solid ${colors.border}`,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 15, color: colors.text }} />
              <Typography sx={{ fontSize: '0.76rem', fontWeight: 750, letterSpacing: '0.02em', color: colors.secondaryText }}>
                GOT QUESTIONS?
              </Typography>
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.4rem', sm: '3.1rem', md: '3.6rem' },
                lineHeight: 1.05,
                fontWeight: 850,
                letterSpacing: '-0.055em',
                color: '#9ff8c7',
                mb: 2,
              }}
            >
              Everything sorted.
              <br />
              <Box component="span" sx={{ color: '#2c4135' }}>
                Before takeoff.
              </Box>
            </Typography>

            <Typography sx={{ maxWidth: 440, fontSize: { xs: '0.96rem', md: '1.02rem' }, lineHeight: 1.7, color: colors.secondaryText, mb: 3.5 }}>
              Find quick answers to common questions about trip planning, squads, and offline vaults, or ask our companion.
            </Typography>

            {/* AI Callout Card */}
            <Box
              component={motion.div}
              whileHover={{ y: -1, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              sx={{
                width: '100%',
                p: { xs: 2.5, sm: 3 },
                borderRadius: '24px',
                backgroundColor: '#242b2633',
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
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
                    backgroundColor: isDark ? 'rgba(0, 160, 8, 0.08)' : 'rgba(0,0,0,0.05)',
                    color: '#9ff8c7',
                    flexShrink: 0,
                  }}
                >
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#9ff8c7' }}>
                    Ask BunkMates AI
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#76a78c' }}>
                    Instant planning & answers
                  </Typography>
                </Box>
              </Stack>

              <Button
                fullWidth
                onClick={() => setAiOpen(true)}
                endIcon={<AutoAwesomeRoundedIcon sx={{ fontSize: '1rem !important' }} />}
                sx={{
                  minHeight: 46,
                  px: 2.5,
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 750,
                  backgroundColor: '#d5ffe7',
                  color: '#21542e',
                  '&:hover': {
                    backgroundColor: isDark ? '#b9ffd7' : '#18181b',
                  },
                }}
              >
                Launch AI Assistant
              </Button>
            </Box>
          </Box>

          {/* Right Accordion Panel */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 54%' }, display: 'flex', flexDirection: 'column', gap: 2 }}>

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
                            backgroundColor: isPanelOpen ? '#d8ffe9' : '#20232133',
                            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                            transition: 'all 0.25s ease',
                            '&:before': { display: 'none' },
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
                                  color: isPanelOpen ? '#21542e' : '#d8ffe9',
                                }}
                              >
                                <ExpandMoreRoundedIcon sx={{ fontSize: 20 }} />
                              </Box>
                            }
                            sx={{
                              minHeight: 60,
                              px: { xs: 2, sm: 2.6 },
                              '& .MuiAccordionSummary-content': { my: 1.4 },
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: { xs: '0.92rem', sm: '0.98rem' },
                                fontWeight: 750,
                                letterSpacing: '-0.02em',
                                color: isPanelOpen ? '#21542e' : '#d8ffe9',
                              }}
                            >
                              {faq.question}
                            </Typography>
                          </AccordionSummary>

                          <AccordionDetails sx={{ px: { xs: 2, sm: 2.6 }, pb: 2.4, pt: 0 }}>
                            <Typography
                              sx={{
                                color: '#3a5e44',
                                fontSize: { xs: '0.86rem', sm: '0.92rem' },
                                lineHeight: 1.7,
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

            {/* Bottom Support Callout */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              sx={{
                mt: 2,
                p: { xs: 2.5, sm: 3 },
                borderRadius: '24px',
                backgroundColor: '#d8ffe9',
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                gap: 2.5,
              }}
            >
              <Stack direction="row" spacing={1.6} alignItems="center">
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: '13px',
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: isDark ? 'rgba(8, 51, 11, 0.08)' : 'rgba(0,0,0,0.05)',
                    color: '#21542e',
                    flexShrink: 0,
                  }}
                >
                  <SupportAgentRoundedIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.95rem', fontWeight: 800, color: '#21542e', mb: 0.2 }}>
                    Still have questions?
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#397047' }}>
                    Reach out directly and our crew will assist you.
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
                  color: '#d8ffe9',
                  backgroundColor: isDark ? '#21542e' : 'rgba(0, 0, 0, 0.04)',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.07)',
                  },
                }}
              >
                Contact Crew
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