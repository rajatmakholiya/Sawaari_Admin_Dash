"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Receipt, 
  Search, 
  Filter,
  Calendar,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  Clock,
  Car,
  User,
  MapPin,
  CreditCard,
  Download
} from 'lucide-react';
import { getChallans, saveChallans, type Challan } from '@/lib/localStorage';
import { dummyChallans } from '@/lib/dummyData';
import { format } from 'date-fns';

export default function ChallansPage() {
  const [challans, setChallans] = useState<Challan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState<Challan | null>(null);

  useEffect(() => {
    // Initialize with dummy data if no challans exist
    const existingChallans = getChallans();
    if (existingChallans.length === 0) {
      saveChallans(dummyChallans);
      setChallans(dummyChallans);
    } else {
      setChallans(existingChallans);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      default: return <Receipt className="w-4 h-4" />;
    }
  };

  const filteredChallans = challans.filter(challan => {
    const matchesSearch = challan.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challan.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challan.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challan.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || challan.status === statusFilter;
    const matchesType = typeFilter === 'all' || challan.type.toLowerCase().includes(typeFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handlePayChallan = (challan: Challan) => {
    setSelectedChallan(challan);
    setIsPaymentDialogOpen(true);
  };

  const processPayment = () => {
    if (selectedChallan) {
      const updatedChallans = challans.map(c => 
        c.id === selectedChallan.id ? { ...c, status: 'paid' as const } : c
      );
      setChallans(updatedChallans);
      saveChallans(updatedChallans);
      setIsPaymentDialogOpen(false);
      setSelectedChallan(null);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Challan ID', 'Vehicle Number', 'Driver Name', 'Amount', 'Issue Date',
      'Due Date', 'Status', 'Type', 'Location'
    ];
    
    const csvData = filteredChallans.map(challan => [
      challan.id,
      challan.vehicleNumber,
      challan.driverName,
      challan.amount,
      challan.issueDate,
      challan.dueDate,
      challan.status,
      challan.type,
      challan.location
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `challans_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const totalAmount = filteredChallans.reduce((sum, challan) => sum + challan.amount, 0);
  const pendingAmount = filteredChallans
    .filter(c => c.status === 'pending' || c.status === 'overdue')
    .reduce((sum, challan) => sum + challan.amount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Challans & Compliance</h1>
          <p className="text-sm text-gray-600">Manage traffic challans and compliance requirements</p>
        </div>
        
        <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search challans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="speed">Speed Violation</SelectItem>
            <SelectItem value="parking">Parking Violation</SelectItem>
            <SelectItem value="signal">Signal Jump</SelectItem>
            <SelectItem value="lane">Lane Violation</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Date Range
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Challans</p>
                <p className="text-2xl font-bold text-gray-900">{filteredChallans.length}</p>
              </div>
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</p>
              </div>
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-red-600">₹{pendingAmount.toLocaleString()}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredChallans.filter(c => c.status === 'paid').length}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challans List */}
      <div className="space-y-4">
        {filteredChallans.map((challan) => (
          <Card key={challan.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Challan #{challan.id}</h3>
                        <p className="text-sm text-gray-600">{challan.type}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(challan.status)}>
                      {getStatusIcon(challan.status)}
                      <span className="ml-1 capitalize">{challan.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Car className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{challan.vehicleNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{challan.driverName}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{challan.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Issued: {format(new Date(challan.issueDate), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <IndianRupee className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-lg">₹{challan.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>Due: {format(new Date(challan.dueDate), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center space-y-2">
                  {challan.status !== 'paid' && (
                    <Button 
                      onClick={() => handlePayChallan(challan)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay Now
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredChallans.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No challans found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay Challan</DialogTitle>
          </DialogHeader>
          {selectedChallan && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Challan ID:</span>
                    <p className="font-medium">#{selectedChallan.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Vehicle:</span>
                    <p className="font-medium">{selectedChallan.vehicleNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="font-medium">{selectedChallan.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <p className="font-medium text-lg">₹{selectedChallan.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select defaultValue="upi">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={processPayment} className="bg-green-600 hover:bg-green-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ₹{selectedChallan.amount.toLocaleString()}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}