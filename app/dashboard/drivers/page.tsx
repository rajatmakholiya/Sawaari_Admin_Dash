"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DocumentViewer from '@/components/DocumentViewer';
import { Users, Plus, Search, Filter, Phone, Mail, MapPin, Calendar, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, FileText, CreditCard as Edit, Trash2, Car, Upload } from 'lucide-react';
import { getDrivers, addDriver, updateDriver, deleteDriver, saveDrivers, type Driver } from '@/lib/localStorage';
import { dummyDrivers } from '@/lib/dummyData';

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clusterFilter, setClusterFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  
  const [formData, setFormData] = useState<Omit<Driver, 'id' | 'status' | 'joinDate' | 'totalRides' | 'rating'>>({
  name: '',
  phone: '',
  email: '',
  license: '',
  cluster: '',
  vehicle: '',
  address: '',
  documents: {
    license: { status: 'pending', expiry: '', image: undefined },
    aadhaar: { status: 'pending', expiry: null, image: undefined },
    pan: { status: 'pending', expiry: null, image: undefined },
    medical: { status: 'pending', expiry: '', image: undefined }
  }
});

  useEffect(() => {
    const existingDrivers = getDrivers();
    if (existingDrivers.length === 0) {
      saveDrivers(dummyDrivers);
      setDrivers(dummyDrivers);
    } else {
      setDrivers(existingDrivers);
    }
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      license: '',
      cluster: '',
      vehicle: '',
      address: '',
      documents: {
        license: { status: 'pending', expiry: '', image: undefined },
        aadhaar: { status: 'pending', expiry: null, image: undefined },
        pan: { status: 'pending', expiry: null, image: undefined },
        medical: { status: 'pending', expiry: '', image: undefined }
      }
    });
  };

  const handleAddDriver = () => {
    addDriver({
      ...formData,
      status: 'active' as const,
      joinDate: new Date().toISOString().split('T')[0],
      totalRides: 0,
      rating: 0
    });
    setDrivers(getDrivers());
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditDriver = () => {
    if (selectedDriver) {
      updateDriver(selectedDriver.id, formData);
      setDrivers(getDrivers());
      setIsEditDialogOpen(false);
      setSelectedDriver(null);
      resetForm();
    }
  };

  const handleDeleteDriver = (id: string) => {
    if (confirm('Are you sure you want to delete this driver?')) {
      deleteDriver(id);
      setDrivers(getDrivers());
    }
  };

  const openEditDialog = (driver: Driver) => {
    setSelectedDriver(driver);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      email: driver.email,
      license: driver.license,
      cluster: driver.cluster,
      vehicle: driver.vehicle,
      address: driver.address,
      documents: driver.documents
    });
    setIsEditDialogOpen(true);
  };

  const openDocumentViewer = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDocumentViewerOpen(true);
  };

  const handleFileUpload = (docType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [docType]: {
              ...prev.documents[docType as keyof typeof prev.documents],
              image: e.target?.result as string,
              status: 'verified'
            }
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-300';
      case 'suspended': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'expiring': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'expired': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    const matchesCluster = clusterFilter === 'all' || driver.cluster.toLowerCase() === clusterFilter;
    return matchesSearch && matchesStatus && matchesCluster;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drivers Management</h1>
          <p className="text-sm text-gray-600">Manage driver profiles, documents, and assignments</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input id="license" value={formData.license} onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cluster">Assigned Cluster</Label>
                <Select value={formData.cluster} onValueChange={(value) => setFormData(prev => ({ ...prev, cluster: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select cluster" /></SelectTrigger>
                  <SelectContent>
                    {['north', 'central', 'south', 'east', 'west'].map(c => (
                      <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle">Assign Vehicle</Label>
                <Select value={formData.vehicle} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr-26-ab-1234">HR-26-AB-1234</SelectItem>
                    <SelectItem value="hr-26-cd-5678">HR-26-CD-5678</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" value={formData.address} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} />
              </div>
              
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold">Document Upload</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.documents).map(([docType, docInfo]) => (
                    <div key={docType} className="space-y-2">
                      <Label className="capitalize">{docType}</Label>
                      <div className="flex items-center space-x-2">
                        <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(docType, e)} className="hidden" id={`file-${docType}`} />
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById(`file-${docType}`)?.click()}>
                          <Upload className="w-4 h-4 mr-2" /> Upload
                        </Button>
                        {docInfo.image && <Badge className="bg-green-100 text-green-800">Uploaded</Badge>}
                      </div>
                      {docType !== 'aadhaar' && docType !== 'pan' && (
                        <Input type="date" value={docInfo.expiry || ''} onChange={(e) => setFormData(prev => ({
                          ...prev,
                          documents: {
                            ...prev.documents,
                            [docType]: { ...prev.documents[docType as keyof typeof prev.documents], expiry: e.target.value }
                          }
                        }))} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddDriver}>Add Driver</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Driver Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Driver</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input id="edit-name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input id="edit-phone" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-license">License Number</Label>
                <Input id="edit-license" value={formData.license} onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cluster">Assigned Cluster</Label>
                <Select value={formData.cluster} onValueChange={(value) => setFormData(prev => ({ ...prev, cluster: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['North', 'Central', 'South', 'East', 'West'].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-vehicle">Assign Vehicle</Label>
                <Select value={formData.vehicle} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR-26-AB-1234">HR-26-AB-1234</SelectItem>
                    <SelectItem value="HR-26-CD-5678">HR-26-CD-5678</SelectItem>
                    <SelectItem value="Unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea id="edit-address" value={formData.address} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditDriver}>Update Driver</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Search drivers by name or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full lg:w-40"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={clusterFilter} onValueChange={setClusterFilter}>
          <SelectTrigger className="w-full lg:w-40"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clusters</SelectItem>
            {['north', 'central', 'south', 'east', 'west'].map(c => (
              <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm"><CardContent className="p-4 flex items-center justify-between">
          <div><p className="text-sm text-gray-600">Total Drivers</p><p className="text-2xl font-bold">{drivers.length}</p></div>
          <Users className="w-6 h-6 text-blue-600" />
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4 flex items-center justify-between">
          <div><p className="text-sm text-gray-600">Active</p><p className="text-2xl font-bold text-green-600">{drivers.filter(d => d.status === 'active').length}</p></div>
          <CheckCircle className="w-6 h-6 text-green-600" />
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4 flex items-center justify-between">
          <div><p className="text-sm text-gray-600">Unassigned</p><p className="text-2xl font-bold text-orange-600">{drivers.filter(d => d.vehicle === 'Unassigned').length}</p></div>
          <AlertTriangle className="w-6 h-6 text-orange-600" />
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4 flex items-center justify-between">
          <div><p className="text-sm text-gray-600">Document Alerts</p><p className="text-2xl font-bold text-red-600">2</p></div>
          <FileText className="w-6 h-6 text-red-600" />
        </CardContent></Card>
      </div>

      <div className="space-y-4">
        {filteredDrivers.map((driver) => (
          <Card key={driver.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{driver.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
                      <Badge className={getStatusColor(driver.status)}>{driver.status}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2"><Phone className="w-4 h-4" /><span>{driver.phone}</span></div>
                      <div className="flex items-center space-x-2"><Mail className="w-4 h-4" /><span>{driver.email}</span></div>
                      <div className="flex items-center space-x-2"><MapPin className="w-4 h-4" /><span>{driver.cluster} Cluster</span></div>
                      <div className="flex items-center space-x-2"><Car className="w-4 h-4" /><span>{driver.vehicle}</span></div>
                      <div className="flex items-center space-x-2"><Calendar className="w-4 h-4" /><span>Joined {driver.joinDate}</span></div>
                      <div className="flex items-center space-x-2"><Clock className="w-4 h-4" /><span>{driver.totalRides} rides</span></div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Document Status</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(driver.documents).map(([doc, info]) => (
                          <Badge key={doc} className={getDocumentStatusColor(info.status)}>{doc}: {info.status}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(driver)}><Edit className="w-4 h-4 mr-2" />Edit</Button>
                  <Button variant="outline" size="sm" onClick={() => openDocumentViewer(driver)}><FileText className="w-4 h-4 mr-2" />Documents</Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteDriver(driver.id)}><Trash2 className="w-4 h-4 mr-2" />Remove</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedDriver && (
        <DocumentViewer
          isOpen={isDocumentViewerOpen}
          onClose={() => setIsDocumentViewerOpen(false)}
          documents={selectedDriver.documents}
          title={selectedDriver.name}
        />
      )}
    </div>
  );
}