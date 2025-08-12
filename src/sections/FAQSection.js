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
    if (isInView) {
      setExpanded(0); // open the first FAQ when in view
    }
  }, [isInView]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  return (
    <Box
      id="faq"
      sx={{ py: { xs: 8, md: 12 }, backgroundColor: theme.palette.background.default }}
    >
      <Container maxWidth="md" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >

          <Typography
            variant="h4"
            fontWeight={600}
            align="center"
            sx={{
              mb: 4,
              color: "#000",
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
                  borderRadius: 2,
                  border: `none`,
                  backgroundColor: "transparent",
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  '&:before': { display: 'none' },
                  '& .MuiAccordionSummary-root': {
                    px: 3,  
                    py: 2,
                    transition: 'background 0.3s ease',
                    '&:hover': {
                      backgroundColor: "transparent",
                    },
                  },
                  '& .MuiAccordionDetails-root': {
                    px: 3,
                    pb: 2,
                    pt: 2,
                    borderRadius: 2,
                    backgroundColor: theme.palette.action.hover,  
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`faq-content-${index}`}
                  id={`faq-header-${index}`}
                >
                  <Typography fontWeight={600} fontSize="1rem">
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
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
