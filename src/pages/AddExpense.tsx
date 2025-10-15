import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  getCurrentUser, 
  sampleUsers, 
  getUserGroups, 
  getGroupById,
  currencies,
  getCurrencySymbol,
  User,
  Group
} from '@/lib/data';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Users, User as UserIcon, Calculator, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const userGroups = getUserGroups(currentUser.id);
  
  const [expenseType, setExpenseType] = useState<'individual' | 'group'>('individual');
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    currency: currentUser.defaultCurrency,
    note: '',
    groupId: '',
    payers: [currentUser.id],
    participants: [currentUser.id],
    splitMethod: 'equal'
  });
  
  const [customSplits, setCustomSplits] = useState<{ [userId: string]: string }>({});
  const [splitError, setSplitError] = useState<string>('');

  const availableUsers = expenseType === 'group' && formData.groupId
    ? getGroupById(formData.groupId)?.members.map(id => sampleUsers.find(u => u.id === id)).filter(Boolean) as User[]
    : sampleUsers.filter(u => u.id !== currentUser.id);

  // Reset participants when switching expense type or group
  useEffect(() => {
    if (expenseType === 'individual') {
      setFormData(prev => ({
        ...prev,
        participants: [currentUser.id],
        payers: [currentUser.id],
        groupId: ''
      }));
    } else if (formData.groupId) {
      const group = getGroupById(formData.groupId);
      if (group) {
        setFormData(prev => ({
          ...prev,
          participants: [currentUser.id],
          payers: [currentUser.id],
          currency: group.baseCurrency
        }));
      }
    }
  }, [expenseType, formData.groupId, currentUser.id]);

  // Initialize custom splits when participants change
  useEffect(() => {
    if (formData.splitMethod !== 'equal') {
      const newSplits: { [userId: string]: string } = {};
      formData.participants.forEach(userId => {
        newSplits[userId] = customSplits[userId] || '0';
      });
      setCustomSplits(newSplits);
    }
  }, [formData.participants, formData.splitMethod, customSplits]);

  const handleParticipantToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(userId)
        ? prev.participants.filter(id => id !== userId)
        : [...prev.participants, userId]
    }));
  };

  const handlePayerToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      payers: prev.payers.includes(userId)
        ? prev.payers.filter(id => id !== userId)
        : [...prev.payers, userId]
    }));
  };

  const handleCustomSplitChange = (userId: string, value: string) => {
    // Validate input to prevent invalid values
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCustomSplits(prev => ({
        ...prev,
        [userId]: value
      }));
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow valid decimal numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, amount: value }));
    }
  };

  const calculateSplits = () => {
    const amount = parseFloat(formData.amount);
    if (!amount || formData.participants.length === 0) return {};

    setSplitError('');

    switch (formData.splitMethod) {
      case 'equal': {
        const equalSplit = amount / formData.participants.length;
        return Object.fromEntries(
          formData.participants.map(id => [id, equalSplit.toFixed(2)])
        );
      }

      case 'exact': {
        const exactSplits: { [userId: string]: string } = {};
        let totalExact = 0;
        
        formData.participants.forEach(userId => {
          const splitAmount = parseFloat(customSplits[userId] || '0');
          exactSplits[userId] = splitAmount.toFixed(2);
          totalExact += splitAmount;
        });
        
        if (Math.abs(totalExact - amount) > 0.01) {
          setSplitError(`Total splits (${getCurrencySymbol(formData.currency)}${totalExact.toFixed(2)}) must equal expense amount (${getCurrencySymbol(formData.currency)}${amount.toFixed(2)})`);
        }
        
        return exactSplits;
      }

      case 'percentage': {
        const percentageSplits: { [userId: string]: string } = {};
        let totalPercentage = 0;
        
        formData.participants.forEach(userId => {
          const percentage = parseFloat(customSplits[userId] || '0');
          const splitAmount = (amount * percentage) / 100;
          percentageSplits[userId] = splitAmount.toFixed(2);
          totalPercentage += percentage;
        });
        
        if (Math.abs(totalPercentage - 100) > 0.01) {
          setSplitError(`Total percentages (${totalPercentage.toFixed(1)}%) must equal 100%`);
        }
        
        return percentageSplits;
      }

      case 'shares': {
        const sharesSplits: { [userId: string]: string } = {};
        let totalShares = 0;
        
        formData.participants.forEach(userId => {
          const shares = parseFloat(customSplits[userId] || '1');
          totalShares += shares;
        });
        
        if (totalShares === 0) {
          setSplitError('Total shares cannot be zero');
          return {};
        }
        
        formData.participants.forEach(userId => {
          const shares = parseFloat(customSplits[userId] || '1');
          const splitAmount = (amount * shares) / totalShares;
          sharesSplits[userId] = splitAmount.toFixed(2);
        });
        
        return sharesSplits;
      }

      default:
        return {};
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount) {
      toast.error('Please fill in title and amount');
      return;
    }

    if (formData.participants.length === 0) {
      toast.error('Please select at least one participant');
      return;
    }

    if (formData.payers.length === 0) {
      toast.error('Please select at least one payer');
      return;
    }

    const splits = calculateSplits();
    if (splitError) {
      toast.error('Please fix the split calculation errors');
      return;
    }

    // In a real app, this would save to the database
    toast.success('Expense added successfully!');
    navigate('/');
  };

  const splits = calculateSplits();
  const totalSplitAmount = Object.values(splits).reduce((sum, amount) => sum + parseFloat(amount || '0'), 0);

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
        <h1 className="text-xl font-bold">Add Expense</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Expense Type */}
        <Tabs value={expenseType} onValueChange={(value) => setExpenseType(value as 'individual' | 'group')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Individual
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Group
            </TabsTrigger>
          </TabsList>

          <TabsContent value="group" className="mt-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm">Select Group</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={formData.groupId} onValueChange={(value) => setFormData(prev => ({ ...prev, groupId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a group" />
                  </SelectTrigger>
                  <SelectContent>
                    {userGroups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name} ({group.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Basic Details */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm">Expense Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What was this expense for?"
                className="border-input focus:border-[#0A122A] focus:ring-[#0A122A]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    {getCurrencySymbol(formData.currency)}
                  </span>
                  <Input
                    id="amount"
                    type="text"
                    inputMode="decimal"
                    value={formData.amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    className="pl-8 border-input focus:border-[#0A122A] focus:ring-[#0A122A]"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger className="border-input focus:border-[#0A122A] focus:ring-[#0A122A]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{currency.symbol}</span>
                          <span>{currency.code}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="border-input focus:border-[#0A122A] focus:ring-[#0A122A]"
              />
            </div>

            <div>
              <Label htmlFor="note">Notes (optional)</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Add details like category, location, or other notes..."
                rows={2}
                className="border-input focus:border-[#0A122A] focus:ring-[#0A122A]"
              />
            </div>

            <div>
              <Label>Receipt Photo (optional)</Label>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-2 border-dashed border-[#0A122A] text-[#0A122A] hover:bg-[#0A122A]/5 dark:border-white dark:text-white dark:hover:bg-white/5"
              >
                <Camera className="h-4 w-4 mr-2" />
                Add Receipt Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Participants */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm">Who was involved?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current User */}
            <div className="flex items-center justify-between p-3 bg-[#0A122A]/10 dark:bg-white/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.photo} />
                  <AvatarFallback className="bg-[#0A122A] text-white dark:bg-white dark:text-[#0A122A]">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{currentUser.name} (You)</span>
              </div>
              <Badge className="bg-[#0A122A] text-white dark:bg-white dark:text-[#0A122A]">Included</Badge>
            </div>

            {/* Other Users */}
            <div className="space-y-2">
              {availableUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photo} />
                      <AvatarFallback className="bg-[#0A122A] text-white dark:bg-white dark:text-[#0A122A]">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <Checkbox
                    checked={formData.participants.includes(user.id)}
                    onCheckedChange={() => handleParticipantToggle(user.id)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payers */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm">Who paid?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {formData.participants.map(userId => {
              const user = sampleUsers.find(u => u.id === userId);
              if (!user) return null;
              
              return (
                <div key={userId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photo} />
                      <AvatarFallback className="bg-[#0A122A] text-white dark:bg-white dark:text-[#0A122A]">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {user.name}{user.id === currentUser.id ? ' (You)' : ''}
                    </span>
                  </div>
                  <Checkbox
                    checked={formData.payers.includes(userId)}
                    onCheckedChange={() => handlePayerToggle(userId)}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Split Method */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calculator className="h-4 w-4" />
              How to split?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={formData.splitMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, splitMethod: value }))}>
              <SelectTrigger className="border-input focus:border-[#0A122A] focus:ring-[#0A122A]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equal">Split Equally</SelectItem>
                <SelectItem value="exact">Exact Amounts</SelectItem>
                <SelectItem value="percentage">By Percentage</SelectItem>
                <SelectItem value="shares">By Shares</SelectItem>
              </SelectContent>
            </Select>

            {/* Custom Split Inputs */}
            {formData.splitMethod !== 'equal' && formData.participants.length > 0 && (
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground">
                  {formData.splitMethod === 'exact' && 'Enter exact amounts for each person:'}
                  {formData.splitMethod === 'percentage' && 'Enter percentages (must total 100%):'}
                  {formData.splitMethod === 'shares' && 'Enter share units for each person:'}
                </Label>
                
                {formData.participants.map(userId => {
                  const user = sampleUsers.find(u => u.id === userId);
                  if (!user) return null;
                  
                  return (
                    <div key={userId} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.photo} />
                          <AvatarFallback className="bg-[#0A122A] text-white dark:bg-white dark:text-[#0A122A] text-xs">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {user.name}{user.id === currentUser.id ? ' (You)' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          inputMode="decimal"
                          value={customSplits[userId] || ''}
                          onChange={(e) => handleCustomSplitChange(userId, e.target.value)}
                          placeholder={formData.splitMethod === 'shares' ? '1' : '0'}
                          className="w-20 text-sm border-input focus:border-[#0A122A] focus:ring-[#0A122A]"
                        />
                        <span className="text-xs text-muted-foreground min-w-[20px]">
                          {formData.splitMethod === 'exact' && getCurrencySymbol(formData.currency)}
                          {formData.splitMethod === 'percentage' && '%'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Split Error */}
            {splitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{splitError}</AlertDescription>
              </Alert>
            )}

            {/* Split Preview */}
            {formData.amount && formData.participants.length > 0 && !splitError && (
              <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                <Label className="text-xs text-muted-foreground">Split Preview:</Label>
                {formData.participants.map(userId => {
                  const user = sampleUsers.find(u => u.id === userId);
                  const amount = splits[userId];
                  if (!user || !amount) return null;
                  
                  return (
                    <div key={userId} className="flex items-center justify-between text-sm">
                      <span>{user.name}{user.id === currentUser.id ? ' (You)' : ''}</span>
                      <span className="font-medium">{getCurrencySymbol(formData.currency)}{amount}</span>
                    </div>
                  );
                })}
                <div className="border-t pt-2 mt-2">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>Total</span>
                    <span>{getCurrencySymbol(formData.currency)}{totalSplitAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={!!splitError}
          className="w-full bg-[#0A122A] hover:bg-[#0A122A]/90 text-white dark:bg-white dark:text-[#0A122A] dark:hover:bg-gray-100 h-12 disabled:opacity-50"
        >
          Add Expense
        </Button>
      </form>
    </div>
  );
};

export default AddExpense;