import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
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
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { AnimatePresence, motion } from "framer-motion";

type Role = "student" | "admin";

const MotionPaper = motion(Paper);

const glassPanel = {
  bgcolor: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(12px)",
};

const iconBadgeSx = {
  background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.08))",
  border: "1px solid rgba(99,102,241,0.4)",
  color: "primary.main",
};

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
      { title: "Certificates", desc: "Download & verify achievements with a QR code.", icon: WorkspacePremiumOutlinedIcon },
      { title: "Bookmarks", desc: "Save courses to come back to later.", icon: BookmarkBorderOutlinedIcon },
      { title: "Quiz History", desc: "Track scores and leaderboard rankings.", icon: QuizOutlinedIcon },
      { title: "Lesson Discussions", desc: "Ask questions directly on any lesson.", icon: ForumOutlinedIcon },
    ],
  },
  admin: {
    title: "Admin Dashboard",
    subtitle: "Manage your platform with confidence.",
    stats: [
      { label: "Courses", value: "42", icon: MenuBookOutlinedIcon },
      { label: "Students", value: "8.2K", icon: PeopleAltOutlinedIcon },
      { label: "Revenue", value: "₹2.1L", icon: AutoGraphOutlinedIcon },
      { label: "Coupons", value: "16", icon: LocalOfferOutlinedIcon },
    ],
    features: [
      { title: "Course Builder", desc: "Create courses, chapters, and lessons.", icon: MenuBookOutlinedIcon },
      { title: "Quiz Builder", desc: "Build MCQs with scoring and validation.", icon: QuizOutlinedIcon },
      { title: "User Management", desc: "Control roles and permissions per user.", icon: PeopleAltOutlinedIcon },
      { title: "Coupons", desc: "Create and manage discount codes.", icon: LocalOfferOutlinedIcon },
      { title: "Moderation", desc: "Review reported comments and content.", icon: FlagOutlinedIcon },
    ],
  },
};

export default function DashboardPreviewToggle() {
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
        position: "relative",
        overflow: "hidden",
        ...glassPanel,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 260,
          height: 260,
          borderRadius: "50%",
          pointerEvents: "none",
          background: "radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)",
        }}
      />

      <Stack spacing={3} sx={{ position: "relative" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
            <Avatar sx={{ width: 44, height: 44, borderRadius: 2, flexShrink: 0, ...iconBadgeSx }}>
              <RoleIcon />
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700} noWrap>
                {current.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {current.subtitle}
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={role.toUpperCase()}
            className="font-mono-ui"
            sx={{
              flexShrink: 0,
              bgcolor: role === "student" ? "rgba(99,102,241,0.12)" : "rgba(251,191,36,0.12)",
              color: role === "student" ? "primary.main" : "#fbbf24",
              border: `1px solid ${role === "student" ? "rgba(99,102,241,0.3)" : "rgba(251,191,36,0.3)"}`,
              fontWeight: 700,
            }}
          />
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: 0.75,
            borderRadius: 3,
            display: "flex",
            gap: 1,
            position: "relative",
            overflow: "hidden",
            bgcolor: "rgba(255,255,255,0.02)",
            borderColor: "rgba(255,255,255,0.08)",
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
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.35)",
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
            {/* Stat cards equal height, consistent internal layout regardless of value length */}
            <Grid container spacing={2} alignItems="stretch">
              {current.stats.map((s) => {
                const Icon = s.icon;
                return (
                  <Grid size={{ xs: 6, md: 3 }} key={s.label} sx={{ display: "flex" }}>
                    <MotionPaper
                      whileHover={{ y: -4 }}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: 100,
                        ...glassPanel,
                      }}
                    >
                      <Icon sx={{ color: "primary.main", fontSize: 22 }} />
                      <Box sx={{ mt: 1.5 }}>
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          noWrap
                          sx={{ fontSize: { xs: "1.1rem", sm: "1.5rem" } }}
                        >
                          {s.value}
                        </Typography>
                        <Typography color="text.secondary" variant="body2" noWrap>
                          {s.label}
                        </Typography>
                      </Box>
                    </MotionPaper>
                  </Grid>
                );
              })}
            </Grid>

            {/* Feature cards top-aligned so wrapped descriptions don't misalign icon/chevron */}
            <Grid container spacing={2} mt={1} alignItems="stretch">
              {current.features.map((f) => {
                const Icon = f.icon;
                return (
                  <Grid size={{ xs: 12, md: 6 }} key={f.title} sx={{ display: "flex" }}>
                    <MotionPaper
                      whileHover={{ y: -5, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      sx={{ p: 2.5, borderRadius: 3, width: "100%", ...glassPanel }}
                    >
                      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ minWidth: 0 }}>
                        <Avatar
                          sx={{ width: 40, height: 40, borderRadius: 2, flexShrink: 0, ...iconBadgeSx }}
                        >
                          <Icon fontSize="small" />
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography fontWeight={700} noWrap>
                            {f.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mt={0.5}>
                            {f.desc}
                          </Typography>
                        </Box>

                        <ChevronRightRoundedIcon sx={{ color: "text.secondary", flexShrink: 0, mt: 0.5 }} />
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