import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const commands = [
  { prompt: '$ learnstack enroll --course=react-fundamentals', output: '✓ enrolled access granted' },
  { prompt: '$ learnstack quiz --submit', output: '✓ 92% passed' },
  { prompt: '$ learnstack certificate --generate', output: '✓ CERT-4F9A2B1C issued' },
];

const useTypewriter = (text: string, speed = 28) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
};

const TerminalHero = () => {
  const [index, setIndex] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  const typedPrompt = useTypewriter(commands[index].prompt);

  useEffect(() => {
    setShowOutput(false);
    if (typedPrompt === commands[index].prompt) {
      const outputTimer = setTimeout(() => setShowOutput(true), 200);
      const nextTimer = setTimeout(() => {
        setIndex((i) => (i + 1) % commands.length);
      }, 2200);
      return () => {
        clearTimeout(outputTimer);
        clearTimeout(nextTimer);
      };
    }
  }, [typedPrompt, index]);

  return (
    <div
      className="rounded-lg border overflow-hidden w-full max-w-md"
      style={{ borderColor: 'inherit', backgroundColor: 'var(--mui-palette-background-paper, #161B22)' }}
    >
      <div className="flex items-center gap-1.5 px-3 py-2 border-b" style={{ borderColor: 'inherit' }}>
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FF5F56' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FFBD2E' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#27C93F' }} />
        <Typography variant="caption" className="font-mono-ui" color="text.secondary" sx={{ ml: 1 }}>
          learnstack zsh
        </Typography>
      </div>

      <div className="p-4 font-mono-ui text-sm min-h-[110px]" style={{ color: 'inherit' }}>
        <div className="flex items-center">
          <Typography component="span" className="font-mono-ui" sx={{ fontSize: '0.85rem' }}>
            {typedPrompt}
          </Typography>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
            style={{ width: 7, height: 15, backgroundColor: 'var(--mui-palette-primary-main, #2DD4BF)', marginLeft: 2, display: 'inline-block' }}
          />
        </div>
        <AnimatePresence mode="wait">
          {showOutput && (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Typography className="font-mono-ui" color="primary.main" sx={{ fontSize: '0.85rem', mt: 1 }}>
                {commands[index].output}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TerminalHero;