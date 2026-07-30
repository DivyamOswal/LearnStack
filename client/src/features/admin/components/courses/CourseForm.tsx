import { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CloseIcon from "@mui/icons-material/Close";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";

import {
  useCategories,
  useCreateCourse,
} from "../../courses/adminCourseApi";

interface CourseFormProps {
  onSuccess: (courseId: string) => void;
}

const CourseForm = ({ onSuccess }: CourseFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [thumbnailFile, setThumbnailFile] =
    useState<File | null>(null);

  const [thumbnailPreview, setThumbnailPreview] =
    useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories, isLoading: categoriesLoading } =
    useCategories();

  const createCourse = useCreateCourse();

  const handleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);

    if (fileInputRef.current)
      fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createCourse.mutate(
      {
        input: {
          title,
          description,
          price: parseFloat(price),
          discountPrice: discountPrice
            ? parseFloat(discountPrice)
            : undefined,
          categoryId,
          isPublished,
        },
        thumbnailFile: thumbnailFile ?? undefined,
      },
      {
        onSuccess: (course) => onSuccess(course.id),
      }
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 900,
        mx: "auto",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* Header */}

      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.default",
        }}
      >
        <Stack direction="row" spacing={2}>
          <SchoolOutlinedIcon
            color="primary"
            sx={{ fontSize: 34 }}
          />

          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
            >
              Create New Course
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Fill in the course information before adding
              chapters and lessons.
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Card elevation={0}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {createCourse.isError && (
                <Alert severity="error">
                  {(createCourse.error as any)?.response
                    ?.data?.message ??
                    "Failed to create course."}
                </Alert>
              )}

              {/* Basic Information */}

              <Typography
                fontWeight={700}
                color="primary"
              >
                Basic Information
              </Typography>

              <TextField
                label="Course Title"
                placeholder="React Masterclass"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                fullWidth
                required
                helperText={`${title.length} characters`}
              />

              <TextField
                label="Description"
                multiline
                rows={5}
                fullWidth
                required
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                helperText={`${description.length} characters`}
              />

              <Divider />

              {/* Pricing */}

              <Typography
                fontWeight={700}
                color="primary"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <SellOutlinedIcon fontSize="small" />
                Pricing
              </Typography>

              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
              >
                <TextField
                  label="Price (₹)"
                  type="number"
                  fullWidth
                  required
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  inputProps={{
                    min: 0,
                    step: "0.01",
                  }}
                />

                <TextField
                  label="Discount Price"
                  type="number"
                  fullWidth
                  value={discountPrice}
                  onChange={(e) =>
                    setDiscountPrice(e.target.value)
                  }
                  inputProps={{
                    min: 0,
                    step: "0.01",
                  }}
                />
              </Stack>

              <Divider />

              {/* Category */}

              <Typography
                fontWeight={700}
                color="primary"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <CategoryOutlinedIcon fontSize="small" />
                Category
              </Typography>

              {categoriesLoading ? (
                <CircularProgress size={28} />
              ) : (
                <TextField
                  select
                  fullWidth
                  label="Select Category"
                  value={categoryId}
                  onChange={(e) =>
                    setCategoryId(e.target.value)
                  }
                  required
                >
                  {categories?.map((cat) => (
                    <MenuItem
                      key={cat.id}
                      value={cat.id}
                    >
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              <Divider />

              {/* Thumbnail */}

              <Typography
                fontWeight={700}
                color="primary"
              >
                Course Thumbnail
              </Typography>

              {thumbnailPreview ? (
                <Box
                  sx={{
                    position: "relative",
                    width: 320,
                    maxWidth: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <img
                    src={thumbnailPreview}
                    alt="thumbnail"
                    style={{
                      width: "100%",
                      display: "block",
                    }}
                  />

                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<CloseIcon />}
                    onClick={handleRemoveThumbnail}
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderStyle: "dashed",
                    borderWidth: 2,
                    py: 4,
                    borderRadius: 3,
                  }}
                >
                  <Stack
                    spacing={1}
                    alignItems="center"
                  >
                    <CloudUploadOutlinedIcon
                      fontSize="large"
                    />

                    <Typography
                      fontWeight={600}
                    >
                      Upload Course Thumbnail
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      PNG • JPG • WEBP
                    </Typography>
                  </Stack>

                  <input
                    ref={fileInputRef}
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={
                      handleThumbnailChange
                    }
                  />
                </Button>
              )}

              <Divider />

              {/* Publish */}

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPublished}
                      onChange={(e) =>
                        setIsPublished(
                          e.target.checked
                        )
                      }
                    />
                  }
                  label={
                    <Box>
                      <Typography
                        fontWeight={600}
                      >
                        Publish immediately
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Disable this to save
                        the course as a draft.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              {/* Submit */}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disableElevation
                disabled={
                  createCourse.isPending
                }
                startIcon={
                  createCourse.isPending ? (
                    <CircularProgress
                      size={18}
                      color="inherit"
                    />
                  ) : (
                    <PublishOutlinedIcon />
                  )
                }
                sx={{
                  py: 1.6,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {createCourse.isPending
                  ? "Creating Course..."
                  : "Create Course"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default CourseForm;