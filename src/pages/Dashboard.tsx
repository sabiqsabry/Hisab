import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  currentUser, 
  getRecentExpenses, 
  calculateBalances, 
  getUserById, 
  getUserGroups,
  formatCurrency 
} from '@/lib/data';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Receipt, TrendingUp, Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const recentExpenses = getRecentExpenses(5);
  const balance = calculateBalances(currentUser.id);
  const userGroups = getUserGroups(currentUser.id);

  // Calculate total owed to user and total user owes
  const totalOwedToUser = Object.values(balance.owedBy).reduce((sum, amount) => sum + amount, 0);
  const totalUserOwes = Object.values(balance.owes).reduce((sum, amount) => sum + amount, 0);
  const netBalance = totalOwedToUser - totalUserOwes;

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {currentUser.name}!</h2>
          <p className="text-muted-foreground mt-1">Track and split your expenses effortlessly</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/settings')}
          className="text-muted-foreground hover:text-[#0A122A] hover:bg-[#0A122A]/5 dark:hover:text-white dark:hover:bg-white/5"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => navigate('/add-expense')}
          className="h-20 bg-[#0A122A] hover:bg-[#0A122A]/90 text-white dark:bg-white dark:text-[#0A122A] dark:hover:bg-gray-100 flex flex-col items-center gap-2"
        >
          <Plus className="h-6 w-6" />
          <span>Add Expense</span>
        </Button>
        <Button 
          onClick={() => navigate('/groups')}
          variant="outline"
          className="h-20 border-[#0A122A] text-[#0A122A] hover:bg-[#0A122A]/5 dark:border-white dark:text-white dark:hover:bg-white/5 flex flex-col items-center gap-2"
        >
          <Users className="h-6 w-6" />
          <span>Manage Groups</span>
        </Button>
      </div>

      {/* Balance Overview */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0A122A] dark:text-white">
            <TrendingUp className="h-5 w-5" />
            Balance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Net Balance</span>
              <span className={`font-bold ${netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(Math.abs(netBalance))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">You are owed</span>
              <span className="text-green-600 dark:text-green-400 font-medium">{formatCurrency(totalOwedToUser)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">You owe</span>
              <span className="text-red-600 dark:text-red-400 font-medium">{formatCurrency(totalUserOwes)}</span>
            </div>
          </div>
          {(totalOwedToUser > 0 || totalUserOwes > 0) && (
            <Button 
              onClick={() => navigate('/balances')}
              variant="outline" 
              className="w-full mt-4 border-[#0A122A] text-[#0A122A] hover:bg-[#0A122A]/5 dark:border-white dark:text-white dark:hover:bg-white/5"
            >
              View Details
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Active Groups */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[#0A122A] dark:text-white">
              <Users className="h-5 w-5" />
              Your Groups
            </span>
            <Badge variant="secondary">{userGroups.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userGroups.length > 0 ? (
            <div className="space-y-3">
              {userGroups.slice(0, 3).map(group => (
                <div key={group.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{group.name}</h4>
                    <p className="text-sm text-muted-foreground">{group.type} • {group.members.length} members</p>
                  </div>
                  <Badge variant="outline">{group.baseCurrency}</Badge>
                </div>
              ))}
              {userGroups.length > 3 && (
                <Button 
                  onClick={() => navigate('/groups')}
                  variant="ghost" 
                  className="w-full text-[#0A122A] hover:bg-[#0A122A]/5 dark:text-white dark:hover:bg-white/5"
                >
                  View All Groups ({userGroups.length})
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-3">No groups yet</p>
              <Button 
                onClick={() => navigate('/groups')}
                variant="outline"
                className="border-[#0A122A] text-[#0A122A] hover:bg-[#0A122A]/5 dark:border-white dark:text-white dark:hover:bg-white/5"
              >
                Create Your First Group
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0A122A] dark:text-white">
            <Receipt className="h-5 w-5" />
            Recent Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentExpenses.length > 0 ? (
            <div className="space-y-3">
              {recentExpenses.map(expense => {
                const payer = getUserById(expense.payers[0].userId);
                return (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={payer?.photo} />
                        <AvatarFallback className="bg-[#0A122A] text-white dark:bg-white dark:text-[#0A122A]">
                          {payer?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-sm">{expense.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()} • {expense.note || 'No notes'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatCurrency(expense.amount, expense.currency)}</p>
                      <p className="text-xs text-muted-foreground">
                        {expense.groupId ? 'Group' : 'Individual'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-3">No expenses yet</p>
              <Button 
                onClick={() => navigate('/add-expense')}
                className="bg-[#0A122A] hover:bg-[#0A122A]/90 text-white dark:bg-white dark:text-[#0A122A] dark:hover:bg-gray-100"
              >
                Add Your First Expense
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;