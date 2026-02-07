"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Calendar, FileText, X } from 'lucide-react';
import { getDrivers, getVehicles } from '@/lib/localStorage';

interface DocumentAlert {
  id: string;
  type: 'driver' | 'vehicle';
  name: string;
  document: string;
  status: string;
  expiry: string;
  daysUntilExpiry: number;
}

export default function DocumentAlerts() {
  const [alerts, setAlerts] = useState<DocumentAlert[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const generateAlerts = () => {
      const allAlerts: DocumentAlert[] = [];
      const today = new Date();

      // Check driver documents
      const drivers = getDrivers();
      drivers.forEach(driver => {
        Object.entries(driver.documents).forEach(([docType, docInfo]) => {
          if (docInfo.expiry) {
            const expiryDate = new Date(docInfo.expiry);
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysUntilExpiry <= 30 || docInfo.status === 'expiring' || docInfo.status === 'expired') {
              allAlerts.push({
                id: `driver-${driver.id}-${docType}`,
                type: 'driver',
                name: driver.name,
                document: docType,
                status: docInfo.status,
                expiry: docInfo.expiry,
                daysUntilExpiry
              });
            }
          }
        });
      });

      // Check vehicle documents
      const vehicles = getVehicles();
      vehicles.forEach(vehicle => {
        Object.entries(vehicle.documents).forEach(([docType, docInfo]) => {
          if (docInfo.expiry) {
            const expiryDate = new Date(docInfo.expiry);
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysUntilExpiry <= 30 || docInfo.status === 'expiring' || docInfo.status === 'expired') {
              allAlerts.push({
                id: `vehicle-${vehicle.id}-${docType}`,
                type: 'vehicle',
                name: vehicle.number,
                document: docType,
                status: docInfo.status,
                expiry: docInfo.expiry,
                daysUntilExpiry
              });
            }
          }
        });
      });

      setAlerts(allAlerts.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry));
    };

    generateAlerts();
  }, []);

  const getAlertColor = (daysUntilExpiry: number, status: string) => {
    if (status === 'expired' || daysUntilExpiry < 0) {
      return 'bg-red-100 text-red-800 border-red-300';
    } else if (daysUntilExpiry <= 7) {
      return 'bg-orange-100 text-orange-800 border-orange-300';
    } else {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getAlertMessage = (alert: DocumentAlert) => {
    if (alert.daysUntilExpiry < 0) {
      return `${alert.document} expired ${Math.abs(alert.daysUntilExpiry)} days ago`;
    } else if (alert.daysUntilExpiry === 0) {
      return `${alert.document} expires today`;
    } else {
      return `${alert.document} expires in ${alert.daysUntilExpiry} days`;
    }
  };

  if (!isVisible || alerts.length === 0) return null;

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-orange-800">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Document Alerts ({alerts.length})</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-orange-600 hover:bg-orange-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.slice(0, 5).map((alert) => (
          <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {alert.name} - {alert.document}
                </p>
                <p className="text-sm text-gray-600">
                  {getAlertMessage(alert)}
                </p>
              </div>
            </div>
            <Badge className={getAlertColor(alert.daysUntilExpiry, alert.status)}>
              {alert.status}
            </Badge>
          </div>
        ))}
        
        {alerts.length > 5 && (
          <div className="text-center pt-2">
            <Button variant="outline" size="sm">
              View All {alerts.length} Alerts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}