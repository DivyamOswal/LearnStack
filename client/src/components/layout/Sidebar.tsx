import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

export interface SidebarNavItem {
  label: string;
  path: string;
  icon: SvgIconComponent;
}

const Sidebar = ({ items }: { items: SidebarNavItem[] }) => {
  const location = useLocation();

  return (
    <nav
      className="hidden md:flex md:flex-col md:w-60 md:shrink-0 border-r md:sticky md:top-0 md:h-screen"
      style={{ borderColor: 'inherit' }}
    >
      <div className="flex flex-col gap-1 p-4">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <RouterLink
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded-md no-underline transition-colors"
              style={{
                color: isActive ? 'var(--mui-palette-primary-main, #2DD4BF)' : 'inherit',
                backgroundColor: isActive ? 'var(--mui-palette-action-hover, #1c2128)' : 'transparent',
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: isActive ? 600 : 400 }}>
                {item.label}
              </Typography>
            </RouterLink>
          );
        })}
      </div>
    </nav>
  );
};

export default Sidebar;