"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Download, Eye } from 'lucide-react';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Record<string, { status: string; expiry: string | null; image?: string }>;
  title: string;
}

export default function DocumentViewer({ isOpen, onClose, documents, title }: DocumentViewerProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'expiring': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'expired': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleDownload = (imageUrl: string, docName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${docName}_document.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{title} - Documents</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(documents).map(([docType, docInfo]) => (
            <div key={docType} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold capitalize">{docType}</h3>
                <Badge className={getStatusColor(docInfo.status)}>
                  {docInfo.status}
                </Badge>
              </div>
              
              {docInfo.expiry && (
                <p className="text-sm text-gray-600">
                  Expires: {new Date(docInfo.expiry).toLocaleDateString()}
                </p>
              )}
              
              {docInfo.image ? (
                <div className="space-y-3">
                  <div className="relative group">
                    <img
                      src={docInfo.image}
                      alt={`${docType} document`}
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(docInfo.image, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Full
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(docInfo.image, '_blank')}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(docInfo.image!, docType)}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No document uploaded</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}