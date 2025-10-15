import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' }
];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    defaultCurrency: 'USD'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login flow - any input works
      if (formData.email && formData.password) {
        toast.success(`Welcome back to Hisaab!`);
        localStorage.setItem('hisaab-auth', 'true');
        localStorage.setItem('hisaab-user-currency', 'USD'); // Default for existing users
        navigate('/');
      } else {
        toast.error('Please fill in both fields');
      }
    } else {
      // Sign-up flow - validate all fields
      if (formData.email && formData.password && formData.name && formData.defaultCurrency) {
        toast.success(`Account created successfully! Welcome ${formData.name}!`);
        localStorage.setItem('hisaab-auth', 'true');
        localStorage.setItem('hisaab-user-currency', formData.defaultCurrency);
        localStorage.setItem('hisaab-user-name', formData.name);
        navigate('/');
      } else {
        toast.error('Please fill in all required fields');
      }
    }
  };

  const handleSkipLogin = () => {
    toast.success('Skipped login - using demo mode');
    localStorage.setItem('hisaab-auth', 'true');
    localStorage.setItem('hisaab-user-currency', 'USD');
    navigate('/');
  };

  const fillDummyCredentials = () => {
    if (isLogin) {
      setFormData({
        ...formData,
        email: 'test@hisaab.com',
        password: '123456'
      });
    } else {
      setFormData({
        email: 'john.doe@example.com',
        password: '123456',
        name: 'John Doe',
        defaultCurrency: 'USD'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#0A122A] dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white dark:text-[#0A122A]">H</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0A122A] dark:text-white">Hisaab</h1>
          <p className="text-muted-foreground">Track and split your expenses effortlessly</p>
        </div>

        {/* Login/Signup Form */}
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-[#0A122A] dark:text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              {isLogin ? 'Sign in to your account' : 'Sign up to get started'}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field for signup */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="border-input focus:border-[#0A122A] focus:ring-[#0A122A]"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="border-input focus:border-[#0A122A] focus:ring-[#0A122A]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    className="border-input focus:border-[#0A122A] focus:ring-[#0A122A] pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Currency selection for signup */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="currency" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Default Currency *
                  </Label>
                  <Select value={formData.defaultCurrency} onValueChange={(value) => setFormData(prev => ({ ...prev, defaultCurrency: value }))}>
                    <SelectTrigger className="border-input focus:border-[#0A122A] focus:ring-[#0A122A]">
                      <SelectValue placeholder="Select your currency" />
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
                  <p className="text-xs text-muted-foreground">
                    This will be your default currency for expenses and balances
                  </p>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-[#0A122A] dark:text-white hover:underline"
                    onClick={fillDummyCredentials}
                  >
                    Use demo credentials
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-muted-foreground hover:underline"
                    onClick={() => toast.info('Password reset coming soon!')}
                  >
                    Forgot password?
                  </Button>
                </div>
              )}

              {!isLogin && (
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-[#0A122A] dark:text-white hover:underline text-sm"
                    onClick={fillDummyCredentials}
                  >
                    Fill demo data
                  </Button>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#0A122A] hover:bg-[#0A122A]/90 text-white dark:bg-white dark:text-[#0A122A] dark:hover:bg-gray-100"
              >
                {isLogin ? (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button 
              onClick={handleSkipLogin}
              variant="outline" 
              className="w-full border-[#0A122A] text-[#0A122A] hover:bg-[#0A122A]/5 dark:border-white dark:text-white dark:hover:bg-white/5"
            >
              Skip Login (Demo Mode)
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-[#0A122A] dark:text-white hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card className="border-dashed border-[#0A122A]/20 dark:border-white/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-sm text-[#0A122A] dark:text-white">Demo Credentials</h3>
              <div className="text-xs text-muted-foreground space-y-1">
                {isLogin ? (
                  <>
                    <p>Email: test@hisaab.com</p>
                    <p>Password: 123456</p>
                  </>
                ) : (
                  <>
                    <p>Name: John Doe</p>
                    <p>Email: john.doe@example.com</p>
                    <p>Password: 123456</p>
                    <p>Currency: USD</p>
                  </>
                )}
                <p className="italic">Any email/password combination works for testing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;