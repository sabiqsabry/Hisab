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
  getUserGroups, 
  sampleGroups, 
  getUserById,
  formatCurrency 
} from '@/lib/data';
import { Plus, Users, Settings, UserPlus, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const Groups: React.FC = () => {
  const userGroups = getUserGroups(currentUser.id);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    type: 'friends',
    description: '',
    baseCurrency: 'USD'
  });
  const [joinCode, setJoinCode] = useState('');

  const groupTypes = [
    { value: 'friends', label: 'Friends' },
    { value: 'family', label: 'Family' },
    { value: 'roommates', label: 'Roommates' },
    { value: 'travel', label: 'Travel' },
    { value: 'work', label: 'Work' },
    { value: 'other', label: 'Other' }
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'];

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.type) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // In a real app, this would create the group in the database
    toast.success('Group created successfully!');
    setIsCreateDialogOpen(false);
    setNewGroup({ name: '', type: 'friends', description: '', baseCurrency: 'USD' });
  };

  const handleJoinGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode) {
      toast.error('Please enter a group code');
      return;
    }
    
    // In a real app, this would join the group
    toast.success('Joined group successfully!');
    setIsJoinDialogOpen(false);
    setJoinCode('');
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Groups</h1>
          <p className="text-muted-foreground">Manage your expense groups</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {userGroups.length} groups
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-20 bg-[#800000] hover:bg-[#600000] text-white flex flex-col items-center gap-2">
              <Plus className="h-6 w-6" />
              <span>Create Group</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <Label htmlFor="groupName">Group Name *</Label>
                <Input
                  id="groupName"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Weekend Trip"
                />
              </div>
              
              <div>
                <Label htmlFor="groupType">Group Type *</Label>
                <Select value={newGroup.type} onValueChange={(value) => setNewGroup(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {groupTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="currency">Base Currency</Label>
                <Select value={newGroup.baseCurrency} onValueChange={(value) => setNewGroup(prev => ({ ...prev, baseCurrency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the group"
                />
              </div>

              <Button type="submit" className="w-full bg-[#800000] hover:bg-[#600000]">
                Create Group
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="h-20 border-[#800000] text-[#800000] hover:bg-red-50 dark:hover:bg-red-950 flex flex-col items-center gap-2"
            >
              <UserPlus className="h-6 w-6" />
              <span>Join Group</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle>Join Existing Group</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleJoinGroup} className="space-y-4">
              <div>
                <Label htmlFor="joinCode">Group Code</Label>
                <Input
                  id="joinCode"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Enter group invitation code"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ask the group admin for the invitation code
                </p>
              </div>

              <Button type="submit" className="w-full bg-[#800000] hover:bg-[#600000]">
                Join Group
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Groups List */}
      {userGroups.length > 0 ? (
        <div className="space-y-4">
          {userGroups.map(group => {
            const memberCount = group.members.length;
            const recentActivity = new Date(group.createdAt).toLocaleDateString();
            
            return (
              <Card key={group.id} className="border-border hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {memberCount} members
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {group.baseCurrency}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {recentActivity}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {group.type}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {group.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {group.description}
                    </p>
                  )}
                  
                  {/* Members Preview */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Members:</span>
                      <div className="flex -space-x-2">
                        {group.members.slice(0, 4).map(memberId => {
                          const member = getUserById(memberId);
                          if (!member) return null;
                          
                          return (
                            <Avatar key={memberId} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={member.photo} />
                              <AvatarFallback className="text-xs">
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          );
                        })}
                        {memberCount > 4 && (
                          <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                            <span className="text-xs font-medium">+{memberCount - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#800000] text-[#800000] hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-border">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Groups Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first group to start sharing expenses with friends and family
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-[#800000] hover:bg-[#600000]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
              <Button 
                onClick={() => setIsJoinDialogOpen(true)}
                variant="outline"
                className="border-[#800000] text-[#800000] hover:bg-red-50 dark:hover:bg-red-950"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Join Group
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Group Suggestions */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Suggested Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-medium text-sm">Monthly Rent</h4>
                <p className="text-xs text-muted-foreground">For roommate expenses</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                Create
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-medium text-sm">Family Expenses</h4>
                <p className="text-xs text-muted-foreground">Household and family costs</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                Create
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Groups;