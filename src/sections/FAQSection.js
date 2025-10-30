import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion, useInView } from 'framer-motion';

const faqs = [
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
  {
    question: 'Can I use BunkMate for solo trips?',
    answer:
      'Definitely. BunkMate is perfect for both group and solo travelers who want to plan, track budgets, and document experiences.',
  },
  {
    question: 'How secure is my data?',
    answer:
      'Your data is stored securely using Firebase infrastructure. We prioritize your privacy and never share your information without consent.',
  },
];

const FAQSection = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) setExpanded(0);
  }, [isInView]);

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

        <Box>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
                    background: 'rgba(255,255,255,0.07)',
                  },
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#ffffffff' }} />}
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
                    backgroundColor: '#1b1b1bff',
                    borderRadius: "12px"
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(200,200,200,0.8)', lineHeight: 1.7 }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FAQSection;
