import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  currentUser, 
  calculateBalances, 
  getUserById, 
  getUserGroups,
  getGroupById,
  formatCurrency,
  sampleSettlements
} from '@/lib/data';
import { ArrowUpRight, ArrowDownLeft, DollarSign, Users, History, Plus } from 'lucide-react';
import { toast } from 'sonner';

const Balances: React.FC = () => {
  const balance = calculateBalances(currentUser.id);
  const userGroups = getUserGroups(currentUser.id);
  const [showSettleDialog, setShowSettleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [settlementData, setSettlementData] = useState({
    amount: '',
    method: 'Cash',
    note: ''
  });

  // Calculate net balances for each person
  const getNetBalance = (userId: string) => {
    const owed = balance.owedBy[userId] || 0;
    const owes = balance.owes[userId] || 0;
    return owed - owes;
  };

  // Get all people with non-zero balances
  const allBalanceUsers = [
    ...Object.keys(balance.owedBy),
    ...Object.keys(balance.owes)
  ].filter((userId, index, arr) => arr.indexOf(userId) === index);

  const handleSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser || !settlementData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(settlementData.amount);
    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // In a real app, this would save to the database
    toast.success('Settlement recorded successfully!');
    setShowSettleDialog(false);
    setSelectedUser('');
    setSettlementData({ amount: '', method: 'Cash', note: '' });
  };

  const getRecentSettlements = () => {
    return sampleSettlements
      .filter(s => s.fromUser === currentUser.id || s.toUser === currentUser.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Balances</h1>
        <Dialog open={showSettleDialog} onOpenChange={setShowSettleDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#800000] hover:bg-[#600000] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle>Record Settlement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSettlement} className="space-y-4">
              <div>
                <Label htmlFor="settleUser">Settle with</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    {allBalanceUsers.map(userId => {
                      const user = getUserById(userId);
                      if (!user) return null;
                      return (
                        <SelectItem key={userId} value={userId}>
                          {user.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={settlementData.amount}
                  onChange={(e) => setSettlementData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="method">Payment Method</Label>
                <Select value={settlementData.method} onValueChange={(value) => setSettlementData(prev => ({ ...prev, method: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Venmo">Venmo</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="Zelle">Zelle</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-[#800000] hover:bg-[#600000] text-white">
                  Record Payment
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowSettleDialog(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <ArrowUpRight className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">You are owed</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(Object.values(balance.owedBy).reduce((sum, amount) => sum + amount, 0))}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <ArrowDownLeft className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-sm text-gray-600">You owe</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(Object.values(balance.owes).reduce((sum, amount) => sum + amount, 0))}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Individual Balances */}
          {allBalanceUsers.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#800000]">
                  <DollarSign className="h-5 w-5" />
                  Individual Balances
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {allBalanceUsers.map(userId => {
                  const user = getUserById(userId);
                  const netBalance = getNetBalance(userId);
                  if (!user || Math.abs(netBalance) < 0.01) return null;

                  return (
                    <div key={userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.photo} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${netBalance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {netBalance > 0 ? 'owes you' : 'you owe'}
                        </p>
                        <p className="text-sm font-medium">
                          {formatCurrency(Math.abs(netBalance))}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">All Settled Up!</h3>
                <p className="text-gray-600">You don't owe anyone, and no one owes you.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="individual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Person-to-Person Balances</CardTitle>
            </CardHeader>
            <CardContent>
              {allBalanceUsers.length > 0 ? (
                <div className="space-y-3">
                  {allBalanceUsers.map(userId => {
                    const user = getUserById(userId);
                    const owed = balance.owedBy[userId] || 0;
                    const owes = balance.owes[userId] || 0;
                    if (!user || (owed === 0 && owes === 0)) return null;

                    return (
                      <div key={userId} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photo} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {owed > 0 && (
                            <div>
                              <p className="text-gray-600">Owes you</p>
                              <p className="font-medium text-green-600">{formatCurrency(owed)}</p>
                            </div>
                          )}
                          {owes > 0 && (
                            <div>
                              <p className="text-gray-600">You owe</p>
                              <p className="font-medium text-red-600">{formatCurrency(owes)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-600 py-4">No individual balances</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          {userGroups.length > 0 ? (
            userGroups.map(group => (
              <Card key={group.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {group.name}
                    </span>
                    <Badge variant="outline">{group.baseCurrency}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{group.type} • {group.members.length} members</p>
                  
                  {/* Group balance summary would go here */}
                  <div className="text-center py-4 text-gray-600">
                    <p className="text-sm">Group balance details</p>
                    <p className="text-xs">Coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-600">No groups yet</p>
                <Button 
                  variant="outline" 
                  className="mt-3 border-[#800000] text-[#800000] hover:bg-red-50"
                  onClick={() => window.location.href = '/groups'}
                >
                  Create a Group
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Recent Settlements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#800000]">
            <History className="h-5 w-5" />
            Recent Settlements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getRecentSettlements().length > 0 ? (
            <div className="space-y-3">
              {getRecentSettlements().map(settlement => {
                const otherUser = getUserById(
                  settlement.fromUser === currentUser.id ? settlement.toUser : settlement.fromUser
                );
                const isPaid = settlement.fromUser === currentUser.id;
                
                if (!otherUser) return null;

                return (
                  <div key={settlement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={otherUser.photo} />
                        <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {isPaid ? `Paid ${otherUser.name}` : `${otherUser.name} paid you`}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(settlement.createdAt).toLocaleDateString()} • {settlement.method}
                        </p>
                      </div>
                    </div>
                    <p className={`font-medium ${isPaid ? 'text-red-600' : 'text-green-600'}`}>
                      {isPaid ? '-' : '+'}{formatCurrency(settlement.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-4">No recent settlements</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Balances;