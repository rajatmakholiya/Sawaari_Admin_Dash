"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit,
  Save,
  Upload,
  Activity,
  Clock,
  Users,
  Car
} from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@cabflow.com',
    phone: '+91 98765 43210',
    address: '123 Business District, Gurgaon, Haryana 122001',
    organization: 'CabFlow Transport',
    role: 'Super Admin',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-20T10:30:00Z',
    bio: 'Experienced transport management professional with over 10 years in the industry. Specialized in fleet optimization and driver management.',
    avatar: ''
  });

  const handleSave = () => {
    // Save profile logic here
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleAvatarUpload = () => {
    document.getElementById('avatar-upload')?.click();
  };

  const stats = [
    { label: 'Total Drivers', value: '42', icon: Users, color: 'text-blue-600' },
    { label: 'Active Vehicles', value: '38', icon: Car, color: 'text-green-600' },
    { label: 'Total Rides', value: '3,847', icon: Activity, color: 'text-purple-600' },
    { label: 'Days Active', value: '370', icon: Clock, color: 'text-orange-600' }
  ];

  const recentActivity = [
    { action: 'Added new driver', details: 'Raj Kumar', time: '2 hours ago' },
    { action: 'Updated vehicle documents', details: 'HR-26-AB-1234', time: '4 hours ago' },
    { action: 'Processed challan payment', details: '₹2,000', time: '6 hours ago' },
    { action: 'Created new cluster', details: 'Airport Zone', time: '1 day ago' },
    { action: 'Exported ride data', details: 'January 2024', time: '2 days ago' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <User className="w-6 h-6 mr-2" />
            Profile
          </h1>
          <p className="text-sm text-gray-600">Manage your personal information and account settings</p>
        </div>
        
        <Button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={isEditing ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                    ) : (
                      <span className="text-white text-2xl font-bold">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      onClick={handleAvatarUpload}
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  )}
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setProfile(prev => ({ ...prev, avatar: e.target?.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                  <p className="text-gray-600">{profile.role}</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified Admin
                  </Badge>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={profile.organization}
                    onChange={(e) => setProfile(prev => ({ ...prev, organization: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center`}>
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <span className="text-sm text-gray-600">{stat.label}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-600">Joined:</span>
                  <p className="font-medium">{new Date(profile.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-600">Last Login:</span>
                  <p className="font-medium">{new Date(profile.lastLogin).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-600">Role:</span>
                  <p className="font-medium">{profile.role}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-600">Email Status:</span>
                  <Badge className="ml-2 bg-green-100 text-green-800">Verified</Badge>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-600">Phone Status:</span>
                  <Badge className="ml-2 bg-green-100 text-green-800">Verified</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Two-Factor Auth</span>
                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Password Strength</span>
                <Badge className="bg-green-100 text-green-800">Strong</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Login Alerts</span>
                <Badge className="bg-blue-100 text-blue-800">Active</Badge>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                <Shield className="w-4 h-4 mr-2" />
                Security Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}