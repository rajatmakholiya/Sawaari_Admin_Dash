import { Driver, Vehicle, Ride, Challan, Notification } from './localStorage';

export const dummyDrivers: Driver[] = [
  {
    id: '1',
    name: 'Raj Kumar',
    phone: '+91 98765 43210',
    email: 'raj.kumar@example.com',
    license: 'HR-0123456789',
    vehicle: 'HR-26-AB-1234',
    status: 'active',
    cluster: 'North',
    joinDate: '2023-01-15',
    totalRides: 1247,
    rating: 4.8,
    address: '123 Main Street, Sector 14, Gurgaon, Haryana 122001',
    documents: {
      license: { status: 'verified', expiry: '2025-03-15', image: 'https://images.pexels.com/photos/159832/justice-law-case-hearing-159832.jpeg?auto=compress&cs=tinysrgb&w=400' },
      aadhaar: { status: 'verified', expiry: null, image: 'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=400' },
      pan: { status: 'verified', expiry: null, image: 'https://images.pexels.com/photos/6077368/pexels-photo-6077368.jpeg?auto=compress&cs=tinysrgb&w=400' },
      medical: { status: 'pending', expiry: '2024-06-20', image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=400' }
    }
  },
  {
    id: '2',
    name: 'Amit Singh',
    phone: '+91 98765 43211',
    email: 'amit.singh@example.com',
    license: 'HR-0987654321',
    vehicle: 'HR-26-CD-5678',
    status: 'active',
    cluster: 'Central',
    joinDate: '2023-02-20',
    totalRides: 987,
    rating: 4.6,
    address: '456 Park Avenue, Sector 22, Gurgaon, Haryana 122015',
    documents: {
      license: { status: 'expiring', expiry: '2024-02-28', image: 'https://images.pexels.com/photos/159832/justice-law-case-hearing-159832.jpeg?auto=compress&cs=tinysrgb&w=400' },
      aadhaar: { status: 'verified', expiry: null, image: 'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=400' },
      pan: { status: 'verified', expiry: null, image: 'https://images.pexels.com/photos/6077368/pexels-photo-6077368.jpeg?auto=compress&cs=tinysrgb&w=400' },
      medical: { status: 'verified', expiry: '2024-08-15', image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=400' }
    }
  },
  {
    id: '3',
    name: 'Suresh Yadav',
    phone: '+91 98765 43212',
    email: 'suresh.yadav@example.com',
    license: 'HR-0456789123',
    vehicle: 'Unassigned',
    status: 'inactive',
    cluster: 'South',
    joinDate: '2023-03-10',
    totalRides: 654,
    rating: 4.9,
    address: '789 Green Valley, Sector 45, Gurgaon, Haryana 122003',
    documents: {
      license: { status: 'verified', expiry: '2025-09-30', image: 'https://images.pexels.com/photos/159832/justice-law-case-hearing-159832.jpeg?auto=compress&cs=tinysrgb&w=400' },
      aadhaar: { status: 'verified', expiry: null, image: 'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=400' },
      pan: { status: 'pending', expiry: null, image: 'https://images.pexels.com/photos/6077368/pexels-photo-6077368.jpeg?auto=compress&cs=tinysrgb&w=400' },
      medical: { status: 'verified', expiry: '2024-12-01', image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=400' }
    }
  }
];

export const dummyVehicles: Vehicle[] = [
  {
    id: '1',
    number: 'HR-26-AB-1234',
    model: 'Maruti Suzuki Dzire',
    year: 2022,
    color: 'White',
    driver: 'Raj Kumar',
    status: 'active',
    fuelType: 'Petrol',
    lastService: '2024-01-15',
    mileage: 45000,
    image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400',
    documents: {
      registration: { status: 'verified', expiry: '2025-03-15', image: 'https://images.pexels.com/photos/97080/pexels-photo-97080.jpeg?auto=compress&cs=tinysrgb&w=400' },
      insurance: { status: 'verified', expiry: '2024-12-31', image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400' },
      pollution: { status: 'expiring', expiry: '2024-02-28', image: 'https://images.pexels.com/photos/2449452/pexels-photo-2449452.jpeg?auto=compress&cs=tinysrgb&w=400' },
      fitness: { status: 'verified', expiry: '2025-06-30', image: 'https://images.pexels.com/photos/159832/justice-law-case-hearing-159832.jpeg?auto=compress&cs=tinysrgb&w=400' }
    },
    maintenance: {
      lastService: '2024-01-15',
      nextService: '2024-04-15',
      serviceDue: false
    }
  },
  {
    id: '2',
    number: 'HR-26-CD-5678',
    model: 'Hyundai Xcent',
    year: 2021,
    color: 'Silver',
    driver: 'Amit Singh',
    status: 'active',
    fuelType: 'Diesel',
    lastService: '2024-01-10',
    mileage: 52000,
    image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400',
    documents: {
      registration: { status: 'verified', expiry: '2025-08-20', image: 'https://images.pexels.com/photos/97080/pexels-photo-97080.jpeg?auto=compress&cs=tinysrgb&w=400' },
      insurance: { status: 'expiring', expiry: '2024-03-15', image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400' },
      pollution: { status: 'verified', expiry: '2024-09-30', image: 'https://images.pexels.com/photos/2449452/pexels-photo-2449452.jpeg?auto=compress&cs=tinysrgb&w=400' },
      fitness: { status: 'verified', expiry: '2025-12-15', image: 'https://images.pexels.com/photos/159832/justice-law-case-hearing-159832.jpeg?auto=compress&cs=tinysrgb&w=400' }
    },
    maintenance: {
      lastService: '2024-01-10',
      nextService: '2024-04-10',
      serviceDue: false
    }
  },
  {
    id: '3',
    number: 'HR-26-EF-9012',
    model: 'Honda Amaze',
    year: 2020,
    color: 'Blue',
    driver: 'Unassigned',
    status: 'maintenance',
    fuelType: 'Petrol',
    lastService: '2023-12-20',
    mileage: 68000,
    image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400',
    documents: {
      registration: { status: 'verified', expiry: '2025-01-10', image: 'https://images.pexels.com/photos/97080/pexels-photo-97080.jpeg?auto=compress&cs=tinysrgb&w=400' },
      insurance: { status: 'verified', expiry: '2024-11-25', image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400' },
      pollution: { status: 'expired', expiry: '2024-01-15', image: 'https://images.pexels.com/photos/2449452/pexels-photo-2449452.jpeg?auto=compress&cs=tinysrgb&w=400' },
      fitness: { status: 'verified', expiry: '2025-03-20', image: 'https://images.pexels.com/photos/159832/justice-law-case-hearing-159832.jpeg?auto=compress&cs=tinysrgb&w=400' }
    },
    maintenance: {
      lastService: '2023-12-20',
      nextService: '2024-03-20',
      serviceDue: true
    }
  }
];

export const dummyRides: Ride[] = [
  {
    id: '1',
    driverId: '1',
    driverName: 'Raj Kumar',
    vehicleNumber: 'HR-26-AB-1234',
    passengerName: 'Priya Sharma',
    passengerPhone: '+91 98765 11111',
    pickupLocation: 'Cyber City, Gurgaon',
    dropoffLocation: 'IGI Airport, Delhi',
    pickupTime: '2024-01-20T09:30:00Z',
    dropoffTime: '2024-01-20T10:45:00Z',
    distance: 25.5,
    fare: 850,
    status: 'completed',
    paymentMethod: 'upi',
    rating: 5,
    cluster: 'North'
  },
  {
    id: '2',
    driverId: '2',
    driverName: 'Amit Singh',
    vehicleNumber: 'HR-26-CD-5678',
    passengerName: 'Rohit Gupta',
    passengerPhone: '+91 98765 22222',
    pickupLocation: 'DLF Mall, Gurgaon',
    dropoffLocation: 'Connaught Place, Delhi',
    pickupTime: '2024-01-20T14:15:00Z',
    dropoffTime: '2024-01-20T15:30:00Z',
    distance: 18.2,
    fare: 620,
    status: 'completed',
    paymentMethod: 'cash',
    rating: 4,
    cluster: 'Central'
  },
  {
    id: '3',
    driverId: '1',
    driverName: 'Raj Kumar',
    vehicleNumber: 'HR-26-AB-1234',
    passengerName: 'Anita Verma',
    passengerPhone: '+91 98765 33333',
    pickupLocation: 'Golf Course Road',
    dropoffLocation: 'Karol Bagh, Delhi',
    pickupTime: '2024-01-20T18:00:00Z',
    dropoffTime: '2024-01-20T19:20:00Z',
    distance: 22.8,
    fare: 780,
    status: 'completed',
    paymentMethod: 'card',
    rating: 5,
    cluster: 'North'
  }
];

export const dummyChallans: Challan[] = [
  {
    id: '1',
    vehicleNumber: 'HR-26-AB-1234',
    driverName: 'Raj Kumar',
    amount: 2000,
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    status: 'pending',
    type: 'Speed Violation',
    location: 'NH-8, Gurgaon'
  },
  {
    id: '2',
    vehicleNumber: 'HR-26-CD-5678',
    driverName: 'Amit Singh',
    amount: 500,
    issueDate: '2024-01-10',
    dueDate: '2024-02-10',
    status: 'paid',
    type: 'Parking Violation',
    location: 'Cyber City, Gurgaon'
  },
  {
    id: '3',
    vehicleNumber: 'HR-26-EF-9012',
    driverName: 'Suresh Yadav',
    amount: 1500,
    issueDate: '2024-01-05',
    dueDate: '2024-02-05',
    status: 'overdue',
    type: 'Signal Jump',
    location: 'MG Road, Gurgaon'
  }
];

export const dummyNotifications: Notification[] = [
  {
    id: '1',
    title: 'Document Expiry Alert',
    message: 'Driver Amit Singh\'s license expires in 5 days',
    type: 'warning',
    timestamp: '2024-01-20T10:30:00Z',
    read: false
  },
  {
    id: '2',
    title: 'New Challan Received',
    message: 'Speed violation challan for HR-26-AB-1234',
    type: 'error',
    timestamp: '2024-01-20T09:15:00Z',
    read: false
  },
  {
    id: '3',
    title: 'Driver Added Successfully',
    message: 'New driver Suresh Yadav has been added to the system',
    type: 'success',
    timestamp: '2024-01-20T08:45:00Z',
    read: true
  }
];