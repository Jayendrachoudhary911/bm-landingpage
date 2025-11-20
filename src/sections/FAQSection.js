// src/components/FAQSection.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion, useInView } from 'framer-motion';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // adjust path to your firebase.js

// Local fallback if DB is missing or not shaped as expected
const FALLBACK_FAQS = [
  {
    question: 'What is BunkMate and how does it work?',
    answer:
      'BunkMate is a smart travel planner that helps you organize trips, manage group expenses, chat with your friends, and coordinate everything in one place.',
  },
  {
    question: 'Is BunkMate free to use?',
    answer:
      'Yes. All core features are completely free to use. We may add optional premium upgrades for enhanced functionality in the future.',
  },
];

const FAQSection = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(null);
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) setExpanded(0);
  }, [isInView]);

  useEffect(() => {
    setLoading(true);
    const docRef = doc(db, 'landing_page', 'home');

    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (!snap.exists()) {
          setFaqs(FALLBACK_FAQS);
          setLoading(false);
          return;
        }

        const data = snap.data();

        // CASE A: document has "faqs" as array of objects: [{question, answer}, ...]
        if (Array.isArray(data?.faqs) && data.faqs.length > 0 && typeof data.faqs[0] === 'object') {
          setFaqs(data.faqs.map((f) => ({
            question: f.question ?? f.title ?? 'Untitled question',
            answer: f.answer ?? f.content ?? '',
          })));
          setLoading(false);
          return;
        }

        // CASE B: document uses separate arrays: faqs.questions[] and faqs.answers[]
        if (data?.faqs && (Array.isArray(data.faqs.questions) || Array.isArray(data.faqs.answers))) {
          const questions = Array.isArray(data.faqs.questions) ? data.faqs.questions : [];
          const answers = Array.isArray(data.faqs.answers) ? data.faqs.answers : [];
          const merged = Math.max(questions.length, answers.length);
          const built = Array.from({ length: merged }).map((_, i) => ({
            question: questions[i] ?? `Question ${i + 1}`,
            answer: answers[i] ?? '',
          }));
          if (built.length) {
            setFaqs(built);
            setLoading(false);
            return;
          }
        }

        // CASE C: a single html/text block like faqs: { content: "..." }
        if (typeof data?.faqs === 'string' || typeof data?.faqs?.content === 'string') {
          setFaqs([
            { question: 'FAQ', answer: data.faqs.content ?? data.faqs },
          ]);
          setLoading(false);
          return;
        }

        // fallback
        setFaqs(FALLBACK_FAQS);
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to landing_page/home:', err);
        setError('Failed to load FAQs.');
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const handleChange = (panel) => (event, isExpanded) =>
    setExpanded(isExpanded ? panel : null);

  return (
    <Box
      id="faq"
      sx={{
        py: { xs: 10, md: 14 },
        backgroundColor: '#000',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* decorative background using uploaded file path (local path provided) */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('/mnt/data/941df691-89b7-425d-8a2a-0e581342dc1e.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.06,
          zIndex: 0,
        }}
      />

      <Container maxWidth="md" ref={ref} sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            align="center"
            sx={{
              mb: 6,
              color: '#fff',
              textShadow: '0 0 15px rgba(86,204,242,0.3)',
              letterSpacing: 0.6,
            }}
          >
            Frequently Asked Questions
          </Typography>
        </motion.div>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <CircularProgress size={28} color="inherit" />
          </Box>
        ) : error ? (
          <Typography align="center" color="error" sx={{ mb: 4 }}>
            {error}
          </Typography>
        ) : (
          <Box>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <Accordion
                  expanded={expanded === index}
                  onChange={handleChange(index)}
                  disableGutters
                  elevation={0}
                  square
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    overflow: 'hidden',
                    background: 'transparent',
                    border: 'none',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 'none',
                      background: 'rgba(255,255,255,0.04)',
                    },
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
                    aria-controls={`faq-content-${index}`}
                    id={`faq-header-${index}`}
                    sx={{
                      px: 3,
                      py: 2,
                      '& .MuiTypography-root': {
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '1rem',
                      },
                    }}
                  >
                    <Typography>{faq.question}</Typography>
                  </AccordionSummary>

                  <AccordionDetails
                    sx={{
                      px: 3,
                      py: 2,
                      backgroundColor: '#111',
                      borderRadius: '12px',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(200,200,200,0.9)', lineHeight: 1.7 }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FAQSection;
