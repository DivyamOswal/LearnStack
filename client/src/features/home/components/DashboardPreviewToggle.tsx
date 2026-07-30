import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import { AnimatePresence, motion } from "framer-motion";

type Role = "student" | "admin";

const MotionPaper = motion(Paper);

const dashboard = {
  student: {
    title: "Student Dashboard",
    subtitle: "Everything learners need in one place.",
    stats: [
      { label: "Courses", value: "12", icon: SchoolOutlinedIcon },
      { label: "Certificates", value: "8", icon: WorkspacePremiumOutlinedIcon },
      { label: "Quizzes", value: "42", icon: QuizOutlinedIcon },
      { label: "Progress", value: "95%", icon: AutoGraphOutlinedIcon },
    ],
    features: [
      { title: "Continue Learning", desc: "Resume your last lesson instantly.", icon: SchoolOutlinedIcon },
      { title: "Certificates", desc: "Download & verify achievements.", icon: WorkspacePremiumOutlinedIcon },
      { title: "Bookmarks", desc: "Save courses for later.", icon: BookmarkBorderOutlinedIcon },
      { title: "Quiz History", desc: "Track scores and rankings.", icon: QuizOutlinedIcon },
      { title: "Profile", desc: "Manage avatar and social links.", icon: CheckCircleOutlineIcon },
    ],
  },
  admin: {
    title: "Admin Dashboard",
    subtitle: "Manage your  with confidence.",
    stats: [
      { label: "Courses", value: "42", icon: MenuBookOutlinedIcon },
      { label: "Students", value: "8.2K", icon: PeopleAltOutlinedIcon },
      { label: "Revenue", value: "₹2.1L", icon: AutoGraphOutlinedIcon },
      { label: "Reviews", value: "4.9★", icon: CampaignOutlinedIcon },
    ],
    features: [
      { title: "Course Builder", desc: "Create courses, chapters and lessons.", icon: MenuBookOutlinedIcon },
      { title: "Quiz Builder", desc: "Build MCQs with validation.", icon: QuizOutlinedIcon },
      { title: "Analytics", desc: "Monitor revenue and engagement.", icon: AutoGraphOutlinedIcon },
      { title: "User Management", desc: "Control users and permissions.", icon: PeopleAltOutlinedIcon },
      { title: "Moderation", desc: "Review reports and comments.", icon: CheckCircleOutlineIcon },
    ],
  },
};

export default function DashboardPreviewToggle() {
  const theme = useTheme();
  const [role, setRole] = useState<Role>("student");
  const current = useMemo(() => dashboard[role], [role]);

  const RoleIcon = role === "student"
    ? DashboardOutlinedIcon
    : AdminPanelSettingsOutlinedIcon;

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <RoleIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {current.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {current.subtitle}
              </Typography>
            </Box>
          </Stack>

          <Chip
            color={role === "student" ? "primary" : "secondary"}
            label={role.toUpperCase()}
          />
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: .75,
            borderRadius: 3,
            display: "flex",
            gap: 1,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {(["student", "admin"] as Role[]).map((r) => (
            <Box key={r} sx={{ flex: 1, position: "relative" }}>
              {role === r && (
                <motion.div
                  layoutId="toggle"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 12,
                    background: theme.palette.action.hover,
                  }}
                />
              )}
              <Box
                component="button"
                onClick={() => setRole(r)}
                sx={{
                  width: "100%",
                  position: "relative",
                  zIndex: 2,
                  py: 1.2,
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                  color: role === r ? "primary.main" : "text.secondary",
                  fontWeight: 700,
                }}
              >
                {r.toUpperCase()}
              </Box>
            </Box>
          ))}
        </Paper>

        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Grid container spacing={2}>
              {current.stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <Grid size={{xs:6, md:3}} key={s.label}>
                    <MotionPaper
                      whileHover={{ y: -4 }}
                      sx={{ p: 2, borderRadius: 3 }}
                    >
                      <Stack direction="row" justifyContent="space-between">
                        <Icon color="primary" />
                        <Typography variant="h5" fontWeight={700}>
                          {s.value}
                        </Typography>
                      </Stack>
                      <Typography color="text.secondary" variant="body2" mt={2}>
                        {s.label}
                      </Typography>
                    </MotionPaper>
                  </Grid>
                );
              })}
            </Grid>

            <Grid container spacing={2} mt={1}>
              {current.features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <Grid size={{xs:12, md:6}} key={f.title}>
                    <MotionPaper
                      whileHover={{ y: -5, scale: 1.01 }}
                      transition={{ duration: .2 }}
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Stack direction="row" spacing={2}>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          <Icon fontSize="small" />
                        </Avatar>

                        <Box flex={1}>
                          <Typography fontWeight={700}>
                            {f.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mt={.5}>
                            {f.desc}
                          </Typography>
                        </Box>

                        <ChevronRightRoundedIcon color="action" />
                      </Stack>
                    </MotionPaper>
                  </Grid>
                );
              })}
            </Grid>
          </motion.div>
        </AnimatePresence>
      </Stack>
    </MotionPaper>
  );
}