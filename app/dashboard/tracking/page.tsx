"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  Car, 
  Users, 
  Filter,
  Layers,
  Navigation,
  Clock,
  Phone,
  AlertCircle,
  CheckCircle,
  Pause,
  CreditCard,
  Receipt,
  DollarSign,
  Zap
} from 'lucide-react';
import DocumentAlerts from '@/components/DocumentAlerts';

const vehicles = [
  { id: 1, driver: 'Raj Kumar', vehicle: 'HR-26-AB-1234', status: 'with_passenger', location: 'Airport Road', cluster: 'North', phone: '+91 98765 43210' },
  { id: 2, driver: 'Amit Singh', vehicle: 'HR-26-CD-5678', status: 'idle', location: 'City Center', cluster: 'Central', phone: '+91 98765 43211' },
  { id: 3, driver: 'Suresh Yadav', vehicle: 'HR-26-EF-9012', status: 'en_route', location: 'Mall Road', cluster: 'South', phone: '+91 98765 43212' },
  { id: 4, driver: 'Rohit Sharma', vehicle: 'HR-26-GH-3456', status: 'idle', location: 'IT Park', cluster: 'East', phone: '+91 98765 43213' },
  { id: 5, driver: 'Manish Gupta', vehicle: 'HR-26-IJ-7890', status: 'with_passenger', location: 'Railway Station', cluster: 'West', phone: '+91 98765 43214' },
];

const clusters = [
  { name: 'North', vehicles: 12, active: 8, hotspots: 3 },
  { name: 'Central', vehicles: 15, active: 12, hotspots: 5 },
  { name: 'South', vehicles: 8, active: 6, hotspots: 2 },
  { name: 'East', vehicles: 10, active: 7, hotspots: 4 },
  { name: 'West', vehicles: 5, active: 4, hotspots: 1 },
];

export default function TrackingPage() {
  const [mapView, setMapView] = useState('default');
  const [selectedCluster, setSelectedCluster] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'road_tax' | 'fastag'>('road_tax');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize map when component mounts
    if (mapRef.current) {
      // This would be where you initialize MapLibre GL
      // For now, we'll simulate with a placeholder
    }
  }, []);

  const handlePayment = () => {
    if (paymentAmount && selectedVehicle) {
      alert(`${paymentType === 'road_tax' ? 'Road Tax' : 'FASTag'} payment of ₹${paymentAmount} processed for ${selectedVehicle}`);
      setIsPaymentDialogOpen(false);
      setPaymentAmount('');
      setSelectedVehicle('');
    }
  };

  const openPaymentDialog = (type: 'road_tax' | 'fastag') => {
    setPaymentType(type);
    setIsPaymentDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'en_route': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'with_passenger': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idle': return <Pause className="w-3 h-3" />;
      case 'en_route': return <Navigation className="w-3 h-3" />;
      case 'with_passenger': return <CheckCircle className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'idle': return 'Idle';
      case 'en_route': return 'En Route';
      case 'with_passenger': return 'With Passenger';
      default: return 'Unknown';
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const clusterMatch = selectedCluster === 'all' || vehicle.cluster.toLowerCase() === selectedCluster;
    const statusMatch = selectedStatus === 'all' || vehicle.status === selectedStatus;
    return clusterMatch && statusMatch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Document Alerts */}
      <DocumentAlerts />
      
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Vehicle Tracking</h1>
          <p className="text-sm text-gray-600">Real-time monitoring of all vehicles and drivers</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={mapView} onValueChange={setMapView}>
            <SelectTrigger className="w-40">
              <Layers className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="satellite">Satellite</SelectItem>
              <SelectItem value="dark">Dark Mode</SelectItem>
              <SelectItem value="terrain">Terrain</SelectItem>
              <SelectItem value="traffic">Traffic</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedCluster} onValueChange={setSelectedCluster}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clusters</SelectItem>
              <SelectItem value="north">North</SelectItem>
              <SelectItem value="central">Central</SelectItem>
              <SelectItem value="south">South</SelectItem>
              <SelectItem value="east">East</SelectItem>
              <SelectItem value="west">West</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="en_route">En Route</SelectItem>
              <SelectItem value="with_passenger">With Passenger</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => openPaymentDialog('road_tax')}>
            <Receipt className="w-4 h-4 mr-2" />
            Clear Road Tax
          </Button>
          <Button variant="outline" onClick={() => openPaymentDialog('fastag')}>
            <Zap className="w-4 h-4 mr-2" />
            Pay FASTag
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">50</p>
              </div>
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">37</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Idle</p>
                <p className="text-2xl font-bold text-gray-600">8</p>
              </div>
              <Pause className="w-6 h-6 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Route</p>
                <p className="text-2xl font-bold text-yellow-600">12</p>
              </div>
              <Navigation className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Passenger</p>
                <p className="text-2xl font-bold text-green-600">17</p>
              </div>
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Live Map ({mapView})</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Live Updates
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              ref={mapRef}
              className="h-96 bg-gray-100 rounded-lg relative overflow-hidden"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              {/* Map overlay with real-looking elements */}
              <div className="absolute inset-0">
                {/* Roads */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400 transform -translate-y-1/2"></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-400 transform -translate-x-1/2"></div>
                
                {/* Vehicle markers with realistic positioning */}
                <div className="absolute top-20 left-20 group cursor-pointer">
                  <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                    <Car className="w-3 h-3 text-white" />
                  </div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Raj Kumar
                  </div>
                </div>
                
                <div className="absolute top-32 right-32 group cursor-pointer">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                    <Car className="w-3 h-3 text-white" />
                  </div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Amit Singh
                  </div>
                </div>
                
                <div className="absolute bottom-24 left-32 group cursor-pointer">
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                    <Car className="w-3 h-3 text-white" />
                  </div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Suresh Yadav
                  </div>
                </div>
                
                <div className="absolute bottom-32 right-24 group cursor-pointer">
                  <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                    <Car className="w-3 h-3 text-white" />
                  </div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Rohit Sharma
                  </div>
                </div>
                
                {/* Cluster indicators */}
                <div className="absolute top-16 left-16 w-16 h-16 border-2 border-blue-300 border-dashed rounded-full bg-blue-100 bg-opacity-50 flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">North</span>
                </div>
                
                <div className="absolute top-28 right-28 w-16 h-16 border-2 border-green-300 border-dashed rounded-full bg-green-100 bg-opacity-50 flex items-center justify-center">
                  <span className="text-xs font-medium text-green-600">Central</span>
                </div>
                
                {/* Map controls */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <Button variant="outline" size="sm" className="bg-white">+</Button>
                  <Button variant="outline" size="sm" className="bg-white">-</Button>
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>With Passenger</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>En Route</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Idle</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cluster Management */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Cluster Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clusters.map((cluster, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{cluster.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {cluster.hotspots} hotspots
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total: {cluster.vehicles}</span>
                    <span className="text-green-600">Active: {cluster.active}</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(cluster.active / cluster.vehicles) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Active Vehicles ({filteredVehicles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{vehicle.driver}</h3>
                    <p className="text-sm text-gray-600">{vehicle.vehicle}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{vehicle.location}</p>
                    <p className="text-xs text-gray-500">{vehicle.cluster} Cluster</p>
                  </div>
                  
                  <Badge className={getStatusColor(vehicle.status)}>
                    {getStatusIcon(vehicle.status)}
                    <span className="ml-1">{getStatusText(vehicle.status)}</span>
                  </Badge>
                  
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {paymentType === 'road_tax' ? 'Clear Road Tax' : 'Pay FASTag'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle-select">Select Vehicle</Label>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HR-26-AB-1234">HR-26-AB-1234 (Raj Kumar)</SelectItem>
                  <SelectItem value="HR-26-CD-5678">HR-26-CD-5678 (Amit Singh)</SelectItem>
                  <SelectItem value="HR-26-EF-9012">HR-26-EF-9012 (Suresh Yadav)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePayment} disabled={!paymentAmount || !selectedVehicle}>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}