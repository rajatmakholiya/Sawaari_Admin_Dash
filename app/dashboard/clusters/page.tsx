"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  MapPin, 
  Plus, 
  Settings,
  Layers,
  Target,
  Users,
  Car,
  TrendingUp,
  Edit,
  Trash2,
  Save,
  RotateCcw
} from 'lucide-react';

interface Cluster {
  id: string;
  name: string;
  center: [number, number];
  radius: number;
  color: string;
  drivers: number;
  vehicles: number;
  avgRides: number;
  isActive: boolean;
}

export default function ClustersPage() {
  const [clusters, setClusters] = useState<Cluster[]>([
    {
      id: '1',
      name: 'Airport Zone',
      center: [77.1025, 28.5562],
      radius: 2.5,
      color: '#3B82F6',
      drivers: 12,
      vehicles: 10,
      avgRides: 45,
      isActive: true
    },
    {
      id: '2',
      name: 'City Center',
      center: [77.2090, 28.6139],
      radius: 3.0,
      color: '#10B981',
      drivers: 18,
      vehicles: 15,
      avgRides: 62,
      isActive: true
    },
    {
      id: '3',
      name: 'IT Park',
      center: [77.0688, 28.4595],
      radius: 2.0,
      color: '#F59E0B',
      drivers: 8,
      vehicles: 7,
      avgRides: 38,
      isActive: true
    }
  ]);
  
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [mapView, setMapView] = useState('default');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [clusterSensitivity, setClusterSensitivity] = useState([50]);
  const mapRef = useRef<HTMLDivElement>(null);
  
  const [newCluster, setNewCluster] = useState({
    name: '',
    radius: 2.0,
    color: '#3B82F6'
  });

  const handleCreateCluster = () => {
    const cluster: Cluster = {
      id: Date.now().toString(),
      name: newCluster.name,
      center: [77.1025 + Math.random() * 0.2, 28.5562 + Math.random() * 0.2],
      radius: newCluster.radius,
      color: newCluster.color,
      drivers: 0,
      vehicles: 0,
      avgRides: 0,
      isActive: true
    };
    
    setClusters([...clusters, cluster]);
    setIsCreateDialogOpen(false);
    setNewCluster({ name: '', radius: 2.0, color: '#3B82F6' });
  };

  const handleDeleteCluster = (id: string) => {
    if (confirm('Are you sure you want to delete this cluster?')) {
      setClusters(clusters.filter(c => c.id !== id));
    }
  };

  const toggleClusterStatus = (id: string) => {
    setClusters(clusters.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const generateAutoClusters = () => {
    // Simulate auto-generation based on heatmap data
    const autoClusters: Cluster[] = [
      {
        id: 'auto-1',
        name: 'Auto: Mall District',
        center: [77.1500, 28.5800],
        radius: 1.8,
        color: '#8B5CF6',
        drivers: 6,
        vehicles: 5,
        avgRides: 28,
        isActive: true
      },
      {
        id: 'auto-2',
        name: 'Auto: Hospital Zone',
        center: [77.1800, 28.6200],
        radius: 1.5,
        color: '#EF4444',
        drivers: 4,
        vehicles: 4,
        avgRides: 22,
        isActive: true
      }
    ];
    
    setClusters([...clusters, ...autoClusters]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cluster Management</h1>
          <p className="text-sm text-gray-600">Define and manage pickup/dropoff zones with intelligent clustering</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generateAutoClusters}>
            <Target className="w-4 h-4 mr-2" />
            Auto Generate
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Cluster
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Cluster</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cluster-name">Cluster Name</Label>
                  <Input
                    id="cluster-name"
                    placeholder="Enter cluster name"
                    value={newCluster.name}
                    onChange={(e) => setNewCluster(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cluster-radius">Radius (km)</Label>
                  <div className="px-3">
                    <Slider
                      value={[newCluster.radius]}
                      onValueChange={(value) => setNewCluster(prev => ({ ...prev, radius: value[0] }))}
                      max={5}
                      min={0.5}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>0.5km</span>
                      <span>{newCluster.radius}km</span>
                      <span>5km</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cluster-color">Color</Label>
                  <div className="flex space-x-2">
                    {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'].map(color => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${newCluster.color === color ? 'border-gray-800' : 'border-gray-300'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewCluster(prev => ({ ...prev, color }))}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCluster} disabled={!newCluster.name}>
                    Create Cluster
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
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
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
            <Label>Show Heatmap</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch checked={isEditMode} onCheckedChange={setIsEditMode} />
            <Label>Edit Mode</Label>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Label className="text-sm">Sensitivity:</Label>
          <div className="w-32">
            <Slider
              value={clusterSensitivity}
              onValueChange={setClusterSensitivity}
              max={100}
              min={10}
              step={10}
            />
          </div>
          <span className="text-sm text-gray-600">{clusterSensitivity[0]}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Interactive Cluster Map</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              ref={mapRef}
              className="h-96 bg-gray-100 rounded-lg relative overflow-hidden cursor-crosshair"
              style={{
                backgroundImage: showHeatmap 
                  ? `radial-gradient(circle at 30% 40%, rgba(239, 68, 68, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 50% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)`
                  : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              {/* Render clusters */}
              {clusters.map((cluster, index) => (
                <div
                  key={cluster.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed ${cluster.isActive ? 'opacity-100' : 'opacity-50'} ${isEditMode ? 'cursor-move' : 'cursor-pointer'}`}
                  style={{
                    left: `${30 + index * 15}%`,
                    top: `${40 + index * 10}%`,
                    width: `${cluster.radius * 40}px`,
                    height: `${cluster.radius * 40}px`,
                    borderColor: cluster.color,
                    backgroundColor: `${cluster.color}20`
                  }}
                  onClick={() => setSelectedCluster(cluster)}
                >
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: cluster.color }}
                  >
                    <MapPin className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                  </div>
                  
                  {/* Cluster label */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-medium whitespace-nowrap">
                    {cluster.name}
                  </div>
                </div>
              ))}
              
              {/* Vehicle markers */}
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-500 rounded-full border border-white shadow-lg"></div>
              <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-500 rounded-full border border-white shadow-lg"></div>
              <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-blue-500 rounded-full border border-white shadow-lg"></div>
              
              {/* Map controls */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <Button variant="outline" size="sm" className="bg-white w-8 h-8 p-0">+</Button>
                <Button variant="outline" size="sm" className="bg-white w-8 h-8 p-0">-</Button>
              </div>
              
              {isEditMode && (
                <div className="absolute bottom-4 left-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg text-sm">
                  <Settings className="w-4 h-4 inline mr-2" />
                  Edit Mode: Click and drag to modify clusters
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cluster List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Active Clusters ({clusters.filter(c => c.isActive).length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clusters.map((cluster) => (
                <div 
                  key={cluster.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedCluster?.id === cluster.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setSelectedCluster(cluster)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: cluster.color }}
                      ></div>
                      <h3 className="font-medium text-gray-900">{cluster.name}</h3>
                    </div>
                    <Badge variant={cluster.isActive ? "default" : "secondary"}>
                      {cluster.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{cluster.drivers}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Car className="w-3 h-3" />
                      <span>{cluster.vehicles}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{cluster.avgRides}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Radius: {cluster.radius}km
                    </span>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleClusterStatus(cluster.id);
                        }}
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCluster(cluster.id);
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cluster Details */}
      {selectedCluster && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedCluster.name} - Details</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleClusterStatus(selectedCluster.id)}
                >
                  {selectedCluster.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{selectedCluster.drivers}</div>
                <div className="text-sm text-gray-600">Assigned Drivers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{selectedCluster.vehicles}</div>
                <div className="text-sm text-gray-600">Active Vehicles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{selectedCluster.avgRides}</div>
                <div className="text-sm text-gray-600">Avg Daily Rides</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{selectedCluster.radius}km</div>
                <div className="text-sm text-gray-600">Coverage Radius</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}