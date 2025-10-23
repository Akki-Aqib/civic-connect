import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Map, FileText, BarChart3, User, LogOut } from 'lucide-react';

interface HeaderProps {
  isAdmin?: boolean;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Header = ({ isAdmin = false, isLoggedIn = false, onLogout }: HeaderProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
          <Shield className="w-6 h-6 text-primary" />
          <span className="gradient-text">City Assist</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {!isAdmin && (
            <>
              <Link 
                to="/" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Map className="w-4 h-4" />
                Map
              </Link>
              {isLoggedIn && (
                <Link 
                  to="/my-reports" 
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/my-reports') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  My Reports
                </Link>
              )}
            </>
          )}
          {isAdmin && (
            <>
              <Link 
                to="/admin" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/admin') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
              <Link 
                to="/admin/reports" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/admin/reports') ? 'text-primary' : 'text-muted-foreground'
                  }`}
              >
                <FileText className="w-4 h-4" />
                Reports
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/profile">
                  <User className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="btn-primary">
                <Link to="/admin/login">Admin</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
