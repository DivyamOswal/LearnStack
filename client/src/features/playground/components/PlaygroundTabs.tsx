import { Tabs, Tab } from '@mui/material';
import { PlaygroundTab } from '../playground.types';

const tabs: { value: PlaygroundTab; label: string }[] = [
  { value: 'html', label: 'index.html' },
  { value: 'css', label: 'style.css' },
  { value: 'js', label: 'script.js' },
];

interface PlaygroundTabsProps {
  activeTab: PlaygroundTab;
  onChange: (tab: PlaygroundTab) => void;
}

const PlaygroundTabs = ({ activeTab, onChange }: PlaygroundTabsProps) => {
  return (
    <Tabs
      value={activeTab}
      onChange={(_, value) => onChange(value)}
      className="font-mono-ui"
      sx={{
        minHeight: 40,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '& .MuiTab-root': { minHeight: 40, fontSize: '0.8rem', textTransform: 'none' },
      }}
    >
      {tabs.map((tab) => (
        <Tab key={tab.value} value={tab.value} label={tab.label} />
      ))}
    </Tabs>
  );
};

export default PlaygroundTabs;