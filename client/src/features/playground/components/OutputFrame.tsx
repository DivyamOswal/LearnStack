import { useEffect, useRef } from 'react';
import { PlaygroundCode } from '../playground.types';

const buildSrcDoc = (code: PlaygroundCode) => `
<!DOCTYPE html>
<html>
  <head>
    <style>${code.css}</style>
  </head>
  <body>
    ${code.html}
    <script>${code.js}<\/script>
  </body>
</html>
`;

const OutputFrame = ({ code }: { code: PlaygroundCode }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = buildSrcDoc(code);
      }
    }, 400); // debounced avoids re-rendering the iframe on every keystroke

    return () => clearTimeout(timeout);
  }, [code]);

  return (
    <iframe
      ref={iframeRef}
      title="Playground output"
      sandbox="allow-scripts"
      className="w-full h-full bg-white"
      style={{ border: 'none' }}
    />
  );
};

export default OutputFrame;