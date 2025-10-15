import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/components/ThemeProvider';
import { getCurrentUser, currencies, getUserCurrency } from '@/lib/data';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Monitor, User, Bell, Download, HelpCircle, LogOut, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const currentUser = getCurrentUser();
  const userCurrency = getUserCurrency();

  const themeOptions = [
    { value: 'light', label: 'Light Mode', icon: Sun },
    { value: 'dark', label: 'Dark Mode', icon: Moon },
    { value: 'system', label: 'System Default', icon: Monitor }
  ];

  const handleCurrencyChange = (newCurrency: string) => {
    localStorage.setItem('hisaab-user-currency', newCurrency);
    toast.success(`Default currency updated to ${newCurrency}`);
    // Force a page refresh to update the current user data
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('hisaab-auth');
    localStorage.removeItem('hisaab-user-currency');
    localStorage.removeItem('hisaab-user-name');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const selectedCurrency = currencies.find(c => c.code === userCurrency);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="text-[#0A122A] hover:bg-[#0A122A]/5 dark:text-white dark:hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0A122A] dark:text-white">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentUser.photo} />
              <AvatarFallback className="text-lg bg-[#0A122A] text-white dark:bg-white dark:text-[#0A122A]">
                {currentUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{currentUser.name}</h3>
              <p className="text-muted-foreground">{currentUser.email}</p>
              <p className="text-sm text-muted-foreground">
                Default Currency: {selectedCurrency?.symbol} {userCurrency}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full border-[#0A122A] text-[#0A122A] hover:bg-[#0A122A]/5 dark:border-white dark:text-white dark:hover:bg-white/5"
          >
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Currency Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0A122A] dark:text-white">
            <DollarSign className="h-5 w-5" />
            Currency Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currency" className="text-sm font-medium">
              Default Currency
            </Label>
            <Select value={userCurrency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="mt-2 border-input focus:border-[#0A122A] focus:ring-[#0A122A]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{currency.symbol}</span>
                      <span>{currency.code}</span>
                      <span className="text-muted-foreground">- {currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              This currency will be used by default for new expenses and balance calculations
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0A122A] dark:text-white">
            <Monitor className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="theme" className="text-sm font-medium">
              Theme Preference
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="mt-2 border-input focus:border-[#0A122A] focus:ring-[#0A122A]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map(option => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Choose your preferred color scheme or follow your system settings
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0A122A] dark:text-white">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified about new expenses and settlements</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive weekly summaries and important updates</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0A122A] dark:text-white">
            <Download className="h-5 w-5" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Download className="h-4 w-4 mr-2" />
            Export All Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Backup to Cloud
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0A122A] dark:text-white">
            <HelpCircle className="h-5 w-5" />
            Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Help Center
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Contact Support
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Privacy Policy
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Terms of Service
          </Button>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* App Info */}
      <div className="text-center text-sm text-muted-foreground py-4">
        <p>Hisaab v1.0.0</p>
        <p>Made with ❤️ for expense sharing</p>
      </div>
    </div>
  );
};

export default Settings;