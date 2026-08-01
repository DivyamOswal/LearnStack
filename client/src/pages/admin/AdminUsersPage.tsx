import { useState } from 'react';
import {
  Typography,
  TextField,
  MenuItem,
  Select,
  Chip,
  Avatar,
  IconButton,
  CircularProgress,
  Pagination,
  InputAdornment,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useAdminUserList, useUpdateUserRole, useDeleteUser } from '@/features/admin/components/users/adminUserApi'
import { Role } from '@/features/admin/components/users/adminUser.types';
import { useAppSelector } from '@/app/hooks';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import { useDebounce } from '@/hooks/useDebounce';

const glassPanel = {
  bgcolor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 3,
  backdropFilter: 'blur(12px)',
};

const selectSx = {
  bgcolor: 'rgba(255,255,255,0.03)',
  borderRadius: 2,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
};

const AdminUsersPage = () => {
  const currentUser = useAppSelector((state) => state.auth.user);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | ''>('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useAdminUserList({
    page,
    limit: 15,
    search: debouncedSearch || undefined,
    role: roleFilter || undefined,
  });

  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteUser.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <Typography variant="overline" color="primary.main" className="font-mono-ui">
        $ admin --users
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 1, fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700 }}>
        Manage users
      </Typography>
      {!isLoading && data && (
        <Typography variant="body2" color="text.secondary" className="font-mono-ui" sx={{ mb: 5 }}>
          {data.total} total {data.total === 1 ? 'user' : 'users'}
        </Typography>
      )}

      <div className="flex flex-col gap-3 mb-6 sm:flex-row">
        <TextField
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { sm: 360 } }}
        />
        <Select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value as Role | '');
            setPage(1);
          }}
          size="small"
          displayEmpty
          sx={{ minWidth: 160, ...selectSx }}
        >
          <MenuItem value="">All roles</MenuItem>
          <MenuItem value="STUDENT">Student</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </Select>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <CircularProgress />
        </div>
      )}

      {!isLoading && data && data.users.length === 0 && (
        <EmptyState title="No users found" description="Try a different search term or filter." />
      )}

      {!isLoading && data && data.users.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden" style={glassPanel}>
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th className="text-left p-4 text-xs font-mono-ui uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>User</th>
                  <th className="text-left p-4 text-xs font-mono-ui uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>Email</th>
                  <th className="text-left p-4 text-xs font-mono-ui uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>Verified</th>
                  <th className="text-left p-4 text-xs font-mono-ui uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>Role</th>
                  <th className="text-right p-4 text-xs font-mono-ui uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {data.users.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.02 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <motion.div whileHover={{ scale: 1.08 }}>
                            <Avatar
                              src={user.avatarUrl ?? undefined}
                              sx={{
                                width: 30,
                                height: 30,
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                bgcolor: user.role === 'ADMIN' ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.08)',
                                color: user.role === 'ADMIN' ? 'primary.main' : 'text.secondary',
                                border: `1px solid ${user.role === 'ADMIN' ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.1)'}`,
                              }}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                          </motion.div>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</Typography>
                        </div>
                      </td>
                      <td className="p-4">
                        <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                      </td>
                      <td className="p-4">
                        <Chip
                          label={user.isVerified ? 'verified' : 'unverified'}
                          size="small"
                          className="font-mono-ui"
                          sx={
                            user.isVerified
                              ? {
                                  bgcolor: 'rgba(34,197,94,0.12)',
                                  color: '#4ade80',
                                  border: '1px solid rgba(34,197,94,0.3)',
                                  fontWeight: 600,
                                }
                              : {
                                  bgcolor: 'transparent',
                                  color: 'text.secondary',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                }
                          }
                        />
                      </td>
                      <td className="p-4">
                        <Select
                          value={user.role}
                          onChange={(e) => updateRole.mutate({ id: user.id, role: e.target.value as Role })}
                          size="small"
                          disabled={user.id === currentUser?.id}
                          sx={selectSx}
                        >
                          <MenuItem value="STUDENT">Student</MenuItem>
                          <MenuItem value="ADMIN">Admin</MenuItem>
                        </Select>
                      </td>
                      <td className="p-4 text-right">
                        <IconButton
                          size="small"
                          disabled={user.id === currentUser?.id}
                          onClick={() => setDeleteTarget({ id: user.id, name: user.name })}
                          sx={{ color: 'text.secondary', '&:hover': { color: '#f87171', bgcolor: 'rgba(239,68,68,0.1)' } }}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="flex flex-col gap-3 md:hidden">
            {data.users.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                style={glassPanel}
                className="p-4 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar
                    src={user.avatarUrl ?? undefined}
                    sx={{
                      width: 34,
                      height: 34,
                      fontWeight: 700,
                      bgcolor: user.role === 'ADMIN' ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.08)',
                      color: user.role === 'ADMIN' ? 'primary.main' : 'text.secondary',
                      border: `1px solid ${user.role === 'ADMIN' ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary" className="truncate block">
                      {user.email}
                    </Typography>
                  </div>
                  <Chip
                    label={user.isVerified ? 'verified' : 'unverified'}
                    size="small"
                    className="font-mono-ui"
                    sx={
                      user.isVerified
                        ? { bgcolor: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)', fontWeight: 600 }
                        : { bgcolor: 'transparent', color: 'text.secondary', border: '1px solid rgba(255,255,255,0.15)' }
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Select
                    value={user.role}
                    onChange={(e) => updateRole.mutate({ id: user.id, role: e.target.value as Role })}
                    size="small"
                    disabled={user.id === currentUser?.id}
                    sx={selectSx}
                  >
                    <MenuItem value="STUDENT">Student</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </Select>
                  <IconButton
                    size="small"
                    disabled={user.id === currentUser?.id}
                    onClick={() => setDeleteTarget({ id: user.id, name: user.name })}
                    sx={{ color: 'text.secondary', '&:hover': { color: '#f87171', bgcolor: 'rgba(239,68,68,0.1)' } }}
                  >
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                </div>
              </motion.div>
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination count={data.totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" shape="rounded" />
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete user?"
        description={`This will permanently delete ${deleteTarget?.name}'s account, including their orders, certificates, and progress. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteUser.isPending}
      />
    </div>
  );
};

export default AdminUsersPage;