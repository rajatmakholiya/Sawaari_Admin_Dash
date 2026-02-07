"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Shield, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStep('otp');
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Redirect to dashboard
    window.location.href = '/dashboard';
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              CabFlow Admin
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Secure access to your cab management platform
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 'phone' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <Button
                onClick={handleSendOTP}
                disabled={!phoneNumber || loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {loading ? 'Sending...' : 'Send OTP'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                  Enter OTP
                </Label>
                <p className="text-xs text-gray-500">
                  Sent to {phoneNumber}
                </p>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-center text-lg tracking-wider h-12 border-gray-300 focus:border-blue-500"
                  maxLength={6}
                />
              </div>
              
              <Button
                onClick={handleVerifyOTP}
                disabled={!otp || loading}
                className="w-full h-12 bg-green-600 hover:bg-green-700 transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button
                onClick={() => setStep('phone')}
                variant="outline"
                className="w-full h-12 border-gray-300 hover:bg-gray-50"
              >
                Change Phone Number
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}