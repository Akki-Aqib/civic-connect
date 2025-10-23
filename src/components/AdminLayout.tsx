import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, BarChart3, FileText, Settings, LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 p-6 border-b border-sidebar-border">
            <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-sidebar-foreground">City Assist Admin</h2>
              <p className="text-xs text-sidebar-foreground/70">Administrative Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/admin')
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-md'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              to="/admin/reports"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/admin/reports')
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-md'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Reports</span>
            </Link>
            <Link
              to="/admin/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/admin/settings')
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-md'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                  SC
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Sarah Chen</p>
                <p className="text-xs text-sidebar-foreground/70">Administrator</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
