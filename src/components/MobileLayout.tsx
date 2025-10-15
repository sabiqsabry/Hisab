import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Users, DollarSign, BarChart3, Plus, Settings } from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/groups', icon: Users, label: 'Groups' },
    { path: '/balances', icon: DollarSign, label: 'Balances' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background shadow-lg">
      {/* Header */}
      <header className="bg-[#0A122A] dark:bg-white text-white dark:text-[#0A122A] p-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold">Hisaab</h1>
        <Button
          onClick={() => navigate('/add-expense')}
          size="sm"
          className="bg-white text-[#0A122A] hover:bg-gray-100 dark:bg-[#0A122A] dark:text-white dark:hover:bg-[#0A122A]/90"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation - Fixed */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-background border-t border-border px-1 py-1 z-50">
        <div className="flex justify-around">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Button
              key={path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-2 text-xs ${
                isActive(path) 
                  ? 'text-[#0A122A] bg-[#0A122A]/10 dark:bg-white/10 dark:text-white' 
                  : 'text-muted-foreground hover:text-[#0A122A] hover:bg-[#0A122A]/5 dark:hover:bg-white/5 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;