import {
  Tabs,
  Tab,
  Box,
} from "@mui/material";

import HtmlRoundedIcon from "@mui/icons-material/HtmlRounded";
import CssRoundedIcon from "@mui/icons-material/CssRounded";
import JavascriptRoundedIcon from "@mui/icons-material/JavascriptRounded";

import { PlaygroundTab } from "../playground.types";

const tabs: {
  value: PlaygroundTab;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: "html",
    label: "index.html",
    icon: <HtmlRoundedIcon fontSize="small" />,
    color: "#E34F26",
  },
  {
    value: "css",
    label: "style.css",
    icon: <CssRoundedIcon fontSize="small" />,
    color: "#1572B6",
  },
  {
    value: "js",
    label: "script.js",
    icon: <JavascriptRoundedIcon fontSize="small" />,
    color: "#F7DF1E",
  },
];

interface PlaygroundTabsProps {
  activeTab: PlaygroundTab;
  onChange: (tab: PlaygroundTab) => void;
}

const PlaygroundTabs = ({
  activeTab,
  onChange,
}: PlaygroundTabsProps) => {
  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Tabs
        value={activeTab}
        onChange={(_, value) => onChange(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 48,

          "& .MuiTabs-indicator": {
            height: 3,
            borderRadius: 3,
          },

          "& .MuiTab-root": {
            minHeight: 48,
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            transition: ".25s",

            color: "text.secondary",

            "&:hover": {
              bgcolor: "action.hover",
            },

            "&.Mui-selected": {
              color: "primary.main",
              bgcolor: "action.selected",
            },
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            icon={
              <Box
                sx={{
                  color: tab.color,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {tab.icon}
              </Box>
            }
            iconPosition="start"
            label={tab.label}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default PlaygroundTabs;