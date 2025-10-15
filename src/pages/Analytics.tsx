import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  currentUser, 
  sampleExpenses, 
  getCategoryTotals,
  formatCurrency,
  getUserById
} from '@/lib/data';
import { BarChart3, PieChart, Download, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [exportFormat, setExportFormat] = useState('csv');

  // Calculate analytics data
  const categoryTotals = getCategoryTotals(currentUser.id);
  const totalSpent = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  
  // Get expenses for the selected time range
  const getFilteredExpenses = () => {
    const days = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return sampleExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= cutoffDate && 
        (expense.createdBy === currentUser.id || 
         expense.shares.some(share => share.userId === currentUser.id));
    });
  };

  const filteredExpenses = getFilteredExpenses();
  const avgDailySpend = totalSpent / parseInt(timeRange);

  // Calculate monthly trends (dummy data for demo)
  const monthlyData = [
    { month: 'Jan', amount: 1250 },
    { month: 'Feb', amount: 1100 },
    { month: 'Mar', amount: 1350 },
    { month: 'Apr', amount: 980 },
    { month: 'May', amount: 1200 },
    { month: 'Jun', amount: 1450 }
  ];

  const handleExport = () => {
    // In a real app, this would generate and download the actual file
    toast.success(`Exporting data as ${exportFormat.toUpperCase()}...`);
    
    // Simulate file download
    setTimeout(() => {
      toast.success('Export completed successfully!');
    }, 2000);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Food': 'bg-orange-500',
      'Travel': 'bg-blue-500',
      'Rent': 'bg-purple-500',
      'Utilities': 'bg-green-500',
      'Shopping': 'bg-pink-500',
      'Miscellaneous': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-5 w-5 text-[#800000]" />
            </div>
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-xl font-bold text-[#800000]">
              {formatCurrency(totalSpent)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5 text-[#800000]" />
            </div>
            <p className="text-sm text-gray-600">Daily Average</p>
            <p className="text-xl font-bold text-[#800000]">
              {formatCurrency(avgDailySpend)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#800000]">
                <PieChart className="h-5 w-5" />
                Spending by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(categoryTotals).length > 0 ? (
                <div className="space-y-4">
                  {/* Visual Chart Representation */}
                  <div className="space-y-3">
                    {Object.entries(categoryTotals)
                      .sort(([,a], [,b]) => b - a)
                      .map(([category, amount]) => {
                        const percentage = (amount / totalSpent) * 100;
                        return (
                          <div key={category} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`} />
                                <span className="font-medium">{category}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-medium">{formatCurrency(amount)}</span>
                                <span className="text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getCategoryColor(category)}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Category Details */}
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-gray-900">Category Details</h4>
                    {Object.entries(categoryTotals)
                      .sort(([,a], [,b]) => b - a)
                      .map(([category, amount]) => {
                        const categoryExpenses = filteredExpenses.filter(exp => exp.category === category);
                        return (
                          <div key={category} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{category}</span>
                              <Badge variant="outline">{categoryExpenses.length} transactions</Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>Total: {formatCurrency(amount)}</p>
                              <p>Average: {formatCurrency(amount / categoryExpenses.length)}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No expenses in the selected time range</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#800000]">
                <TrendingUp className="h-5 w-5" />
                Spending Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Simple Bar Chart */}
                <div className="space-y-3">
                  {monthlyData.map(({ month, amount }) => {
                    const maxAmount = Math.max(...monthlyData.map(d => d.amount));
                    const percentage = (amount / maxAmount) * 100;
                    
                    return (
                      <div key={month} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{month}</span>
                          <span className="font-medium">{formatCurrency(amount)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="h-3 rounded-full bg-[#800000]"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Trend Insights */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Insights</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your highest spending month was June ({formatCurrency(1450)})</li>
                    <li>• You've saved 32% compared to your peak month</li>
                    <li>• Food expenses account for the largest portion of your spending</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredExpenses.slice(0, 5).map(expense => {
                  const payer = getUserById(expense.payers[0].userId);
                  return (
                    <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{expense.title}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(expense.date).toLocaleDateString()} • {expense.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{formatCurrency(expense.amount)}</p>
                        <p className="text-xs text-gray-600">
                          by {payer?.name === currentUser.name ? 'You' : payer?.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#800000]">
                <Download className="h-5 w-5" />
                Export Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Export Format
                </label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Time Range
                </label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 3 months</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Export will include:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• All expenses from the selected time range</li>
                  <li>• Balance information</li>
                  <li>• Settlement history</li>
                  <li>• Category breakdowns</li>
                  <li>• Group information (if applicable)</li>
                </ul>
              </div>

              <Button 
                onClick={handleExport}
                className="w-full bg-[#800000] hover:bg-[#600000] text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export {exportFormat.toUpperCase()}
              </Button>
            </CardContent>
          </Card>

          {/* Export History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Exports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">September 2024 Report</p>
                    <p className="text-xs text-gray-600">PDF • Exported 3 days ago</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#800000]">
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Q3 Expenses</p>
                    <p className="text-xs text-gray-600">CSV • Exported 1 week ago</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#800000]">
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;