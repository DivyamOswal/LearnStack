import { useState } from 'react';
import { Typography, Button } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PlaygroundTabs from '@/features/playground/components/PlaygroundTabs';
import CodeEditor from '@/features/playground/components/CodeEditor';
import OutputFrame from '@/features/playground/components/OutputFrame';
import { PlaygroundTab, PlaygroundCode } from '@/features/playground/playground.types';

const defaultCode: PlaygroundCode = {
  html: `<h1>Hello, LearnStack</h1>\n<p>Edit any tab to see it update live.</p>`,
  css: `body {\n  font-family: sans-serif;\n  padding: 2rem;\n}\n\nh1 {\n  color: #2DD4BF;\n}`,
  js: `console.log('Playground is running.');`,
};

const PlaygroundPage = () => {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>('html');
  const [code, setCode] = useState<PlaygroundCode>(defaultCode);

  const handleReset = () => setCode(defaultCode);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 65px)' }}>
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'inherit' }}>
        <Typography variant="overline" color="primary.main">
          $ playground --live
        </Typography>
        <Button size="small" startIcon={<RestartAltIcon />} onClick={handleReset} className="font-mono-ui">
          reset
        </Button>
      </div>

      <div className="flex flex-col flex-1 min-h-0 md:flex-row">
        {/* Editor pane */}
        <div className="flex flex-col w-full md:w-1/2 min-h-0 border-b md:border-b-0 md:border-r" style={{ borderColor: 'inherit', height: '50%' }}>
          <PlaygroundTabs activeTab={activeTab} onChange={setActiveTab} />
          <div className="flex-1 min-h-0">
            <CodeEditor
              activeTab={activeTab}
              value={code[activeTab]}
              onChange={(value) => setCode((prev) => ({ ...prev, [activeTab]: value }))}
            />
          </div>
        </div>

        {/* Output pane */}
        <div className="w-full md:w-1/2" style={{ height: '50%' }}>
          <OutputFrame code={code} />
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;