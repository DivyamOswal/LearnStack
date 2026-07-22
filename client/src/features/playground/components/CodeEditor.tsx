import Editor from '@monaco-editor/react';
import { useAppSelector } from '@/app/hooks';
import { PlaygroundTab } from '../playground.types';

const languageMap: Record<PlaygroundTab, string> = {
  html: 'html',
  css: 'css',
  js: 'javascript',
};

interface CodeEditorProps {
  activeTab: PlaygroundTab;
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor = ({ activeTab, value, onChange }: CodeEditorProps) => {
  const themeMode = useAppSelector((state) => state.ui.themeMode);

  return (
    <Editor
      height="100%"
      language={languageMap[activeTab]}
      value={value}
      onChange={(val) => onChange(val ?? '')}
      theme={themeMode === 'dark' ? 'vs-dark' : 'light'}
      options={{
        fontSize: 13,
        fontFamily: '"JetBrains Mono", monospace',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        padding: { top: 12 },
      }}
    />
  );
};

export default CodeEditor;