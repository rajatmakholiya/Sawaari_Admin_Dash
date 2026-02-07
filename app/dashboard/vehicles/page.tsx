"use client";

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Car,
  Search,
  Filter,
  Fuel,
  Gauge,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  User,
  Clock,
  Calendar,
  FileText,
  RefreshCcw,
  CheckCircle2,
} from 'lucide-react';
import DocumentViewer from '@/components/DocumentViewer';
import DocumentAlerts from '@/components/DocumentAlerts';
import {
  getVehicles,
  saveVehicles,
  updateVehicle,
  type Vehicle,
} from '@/lib/localStorage';
import { dummyVehicles } from '@/lib/dummyData';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Vehicle['status']>(
    'all'
  );
  const [fuelFilter, setFuelFilter] = useState<'all' | 'petrol' | 'diesel'>(
    'all'
  );
  const [docViewerVehicle, setDocViewerVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const existingVehicles = getVehicles();
    if (existingVehicles.length === 0) {
      saveVehicles(dummyVehicles);
      setVehicles(dummyVehicles);
    } else {
      setVehicles(existingVehicles);
    }
  }, []);

  const stats = useMemo(() => {
    const active = vehicles.filter((v) => v.status === 'active').length;
    const maintenance = vehicles.filter((v) => v.status === 'maintenance')
      .length;
    const unassigned = vehicles.filter((v) =>
      v.driver.toLowerCase().includes('unassigned')
    ).length;

    return {
      total: vehicles.length,
      active,
      maintenance,
      unassigned,
    };
  }, [vehicles]);

  const filteredVehicles = useMemo(
    () =>
      vehicles.filter((vehicle) => {
        const matchesSearch =
          vehicle.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === 'all' || vehicle.status === statusFilter;

        const matchesFuel =
          fuelFilter === 'all' ||
          vehicle.fuelType.toLowerCase() === fuelFilter.toLowerCase();

        return matchesSearch && matchesStatus && matchesFuel;
      }),
    [vehicles, searchTerm, statusFilter, fuelFilter]
  );

  const maintenanceQueue = useMemo(
    () =>
      vehicles.filter(
        (vehicle) =>
          vehicle.status === 'maintenance' || vehicle.maintenance.serviceDue
      ),
    [vehicles]
  );

  const complianceIssues = useMemo(() => {
    const items: {
      vehicle: Vehicle;
      docType: string;
      status: string;
      expiry: string | null;
    }[] = [];

    vehicles.forEach((vehicle) => {
      Object.entries(vehicle.documents).forEach(([docType, docInfo]) => {
        if (docInfo.status !== 'verified') {
          items.push({
            vehicle,
            docType,
            status: docInfo.status,
            expiry: docInfo.expiry ?? null,
          });
        }
      });
    });

    return items;
  }, [vehicles]);

  const getStatusBadgeColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'inactive':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDocBadgeColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'expiring':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const handleStatusChange = (vehicle: Vehicle) => {
    const nextStatus = vehicle.status === 'maintenance' ? 'active' : 'maintenance';
    updateVehicle(vehicle.id, { status: nextStatus });
    setVehicles(getVehicles());
  };

  const handleServiceComplete = (vehicle: Vehicle) => {
    const today = new Date().toISOString().split('T')[0];
    updateVehicle(vehicle.id, {
      status: 'active',
      lastService: today,
      maintenance: {
        ...vehicle.maintenance,
        lastService: today,
        serviceDue: false,
      },
    });
    setVehicles(getVehicles());
  };

  const resetSampleData = () => {
    saveVehicles(dummyVehicles);
    setVehicles(dummyVehicles);
    setSearchTerm('');
    setStatusFilter('all');
    setFuelFilter('all');
  };

  return (
    <div className="p-6 space-y-6">
      <DocumentAlerts />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Car className="w-6 h-6 mr-2" />
            Vehicles & Fleet Health
          </h1>
          <p className="text-sm text-gray-600">
            Monitor availability, maintenance, and document compliance for every vehicle.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setVehicles(getVehicles())}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Sync from storage
          </Button>
          <Button variant="outline" onClick={resetSampleData}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Reload sample data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active on road</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.maintenance}
                </p>
              </div>
              <Wrench className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unassigned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.unassigned}
                </p>
              </div>
              <User className="w-6 h-6 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by number, driver, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as 'all' | Vehicle['status'])
          }
        >
          <SelectTrigger>
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={fuelFilter}
          onValueChange={(value) =>
            setFuelFilter(value as 'all' | 'petrol' | 'diesel')
          }
        >
          <SelectTrigger>
            <Fuel className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Fuel type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fuel Types</SelectItem>
            <SelectItem value="petrol">Petrol</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Fleet roster ({filteredVehicles.length})</span>
              <Badge variant="outline" className="text-xs">
                Updated just now
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="p-4 bg-gray-50 rounded-lg border hover:border-blue-200 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="w-full lg:w-48 h-32 rounded-md overflow-hidden bg-gray-200 relative">
                      {vehicle.image ? (
                        <img
                          src={vehicle.image}
                          alt={vehicle.model}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                          No image
                        </div>
                      )}
                      <Badge
                        className={`${getStatusBadgeColor(
                          vehicle.status
                        )} absolute top-2 left-2`}
                      >
                        {vehicle.status === 'active' ? 'Active' : 'Maintenance'}
                      </Badge>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <p className="text-xs text-gray-500">
                            {vehicle.model} · {vehicle.year} · {vehicle.color}
                          </p>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {vehicle.number}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {vehicle.driver}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Fuel className="w-3 h-3" />
                              {vehicle.fuelType}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDocViewerVehicle(vehicle)}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Documents
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(vehicle)}
                          >
                            <Wrench className="w-4 h-4 mr-2" />
                            {vehicle.status === 'maintenance'
                              ? 'Return to fleet'
                              : 'Send to maintenance'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!vehicle.maintenance.serviceDue}
                            onClick={() => handleServiceComplete(vehicle)}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Mark service done
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-gray-500" />
                          {vehicle.mileage.toLocaleString()} km
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          Last service: {vehicle.maintenance.lastService}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          Next: {vehicle.maintenance.nextService}
                        </div>
                        <div className="flex items-center gap-2">
                          {vehicle.maintenance.serviceDue ? (
                            <>
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                              <span className="text-orange-700 font-medium">
                                Service due
                              </span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-4 h-4 text-green-600" />
                              <span className="text-green-700">Healthy</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {Object.entries(vehicle.documents).map(
                          ([docType, docInfo]) => (
                            <Badge
                              key={docType}
                              className={`${getDocBadgeColor(
                                docInfo.status
                              )} text-xs capitalize`}
                            >
                              {docType}: {docInfo.status}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredVehicles.length === 0 && (
                <div className="text-center py-12 text-gray-500 border rounded-lg">
                  No vehicles match the current filters.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-yellow-600" />
                Maintenance queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {maintenanceQueue.length === 0 && (
                <p className="text-sm text-gray-600">All vehicles are healthy.</p>
              )}
              {maintenanceQueue.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="p-3 bg-gray-50 rounded-lg border flex items-start justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{vehicle.number}</p>
                    <p className="text-sm text-gray-600">{vehicle.model}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3" />
                      Next service: {vehicle.maintenance.nextService}
                    </div>
                  </div>
                  <Badge
                    className={
                      vehicle.maintenance.serviceDue
                        ? 'bg-orange-100 text-orange-800 border-orange-300'
                        : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                    }
                  >
                    {vehicle.maintenance.serviceDue ? 'Due now' : 'Scheduled'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Compliance alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {complianceIssues.length === 0 && (
                <p className="text-sm text-gray-600">
                  All vehicle documents are verified.
                </p>
              )}

              {complianceIssues.slice(0, 5).map((issue, idx) => (
                <div
                  key={`${issue.vehicle.id}-${issue.docType}-${idx}`}
                  className="p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {issue.vehicle.number}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {issue.docType} · {issue.status}
                      </p>
                    </div>
                    <Badge className={getDocBadgeColor(issue.status)}>
                      {issue.status}
                    </Badge>
                  </div>
                  {issue.expiry && (
                    <p className="text-xs text-gray-500 mt-2">
                      Expires: {new Date(issue.expiry).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {docViewerVehicle && (
        <DocumentViewer
          isOpen={!!docViewerVehicle}
          onClose={() => setDocViewerVehicle(null)}
          documents={docViewerVehicle.documents}
          title={docViewerVehicle.number}
        />
      )}
    </div>
  );
}
