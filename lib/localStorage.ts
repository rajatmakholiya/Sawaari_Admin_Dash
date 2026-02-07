// Local storage utilities for data persistence
export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  license: string;
  vehicle: string;
  status: 'active' | 'inactive' | 'suspended';
  cluster: string;
  joinDate: string;
  totalRides: number;
  rating: number;
  address: string;
  documents: {
    license: { status: string; expiry: string; image?: string };
    aadhaar: { status: string; expiry: string | null; image?: string };
    pan: { status: string; expiry: string | null; image?: string };
    medical: { status: string; expiry: string; image?: string };
  };
}

export interface Vehicle {
  id: string;
  number: string;
  model: string;
  year: number;
  color: string;
  driver: string;
  status: 'active' | 'maintenance' | 'inactive';
  fuelType: string;
  lastService: string;
  mileage: number;
  image?: string;
  documents: {
    registration: { status: string; expiry: string; image?: string };
    insurance: { status: string; expiry: string; image?: string };
    pollution: { status: string; expiry: string; image?: string };
    fitness: { status: string; expiry: string; image?: string };
  };
  maintenance: {
    lastService: string;
    nextService: string;
    serviceDue: boolean;
  };
}

export interface Ride {
  id: string;
  driverId: string;
  driverName: string;
  vehicleNumber: string;
  passengerName: string;
  passengerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  dropoffTime: string;
  distance: number;
  fare: number;
  status: 'completed' | 'cancelled' | 'ongoing';
  paymentMethod: 'cash' | 'card' | 'upi';
  rating: number;
  cluster: string;
}

export interface Challan {
  id: string;
  vehicleNumber: string;
  driverName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  type: string;
  location: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
}

// Storage keys
const STORAGE_KEYS = {
  DRIVERS: 'cab_drivers',
  VEHICLES: 'cab_vehicles',
  RIDES: 'cab_rides',
  CHALLANS: 'cab_challans',
  NOTIFICATIONS: 'cab_notifications',
  CLUSTERS: 'cab_clusters',
};

// Generic storage functions
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Driver functions
export const getDrivers = (): Driver[] => getFromStorage(STORAGE_KEYS.DRIVERS, []);
export const saveDrivers = (drivers: Driver[]): void => saveToStorage(STORAGE_KEYS.DRIVERS, drivers);

export const addDriver = (driver: Omit<Driver, 'id'>): Driver => {
  const drivers = getDrivers();
  const newDriver: Driver = { ...driver, id: Date.now().toString() };
  drivers.push(newDriver);
  saveDrivers(drivers);
  return newDriver;
};

export const updateDriver = (id: string, updates: Partial<Driver>): Driver | null => {
  const drivers = getDrivers();
  const index = drivers.findIndex(d => d.id === id);
  if (index === -1) return null;
  
  drivers[index] = { ...drivers[index], ...updates };
  saveDrivers(drivers);
  return drivers[index];
};

export const deleteDriver = (id: string): boolean => {
  const drivers = getDrivers();
  const filtered = drivers.filter(d => d.id !== id);
  if (filtered.length === drivers.length) return false;
  
  saveDrivers(filtered);
  return true;
};

// Vehicle functions
export const getVehicles = (): Vehicle[] => getFromStorage(STORAGE_KEYS.VEHICLES, []);
export const saveVehicles = (vehicles: Vehicle[]): void => saveToStorage(STORAGE_KEYS.VEHICLES, vehicles);

export const addVehicle = (vehicle: Omit<Vehicle, 'id'>): Vehicle => {
  const vehicles = getVehicles();
  const newVehicle: Vehicle = { ...vehicle, id: Date.now().toString() };
  vehicles.push(newVehicle);
  saveVehicles(vehicles);
  return newVehicle;
};

export const updateVehicle = (id: string, updates: Partial<Vehicle>): Vehicle | null => {
  const vehicles = getVehicles();
  const index = vehicles.findIndex(v => v.id === id);
  if (index === -1) return null;
  
  vehicles[index] = { ...vehicles[index], ...updates };
  saveVehicles(vehicles);
  return vehicles[index];
};

export const deleteVehicle = (id: string): boolean => {
  const vehicles = getVehicles();
  const filtered = vehicles.filter(v => v.id !== id);
  if (filtered.length === vehicles.length) return false;
  
  saveVehicles(filtered);
  return true;
};

// Ride functions
export const getRides = (): Ride[] => getFromStorage(STORAGE_KEYS.RIDES, []);
export const saveRides = (rides: Ride[]): void => saveToStorage(STORAGE_KEYS.RIDES, rides);

// Challan functions
export const getChallans = (): Challan[] => getFromStorage(STORAGE_KEYS.CHALLANS, []);
export const saveChallans = (challans: Challan[]): void => saveToStorage(STORAGE_KEYS.CHALLANS, challans);

// Notification functions
export const getNotifications = (): Notification[] => getFromStorage(STORAGE_KEYS.NOTIFICATIONS, []);
export const saveNotifications = (notifications: Notification[]): void => saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);

export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void => {
  const notifications = getNotifications();
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    read: false,
  };
  notifications.unshift(newNotification);
  saveNotifications(notifications);
};

export const markNotificationAsRead = (id: string): void => {
  const notifications = getNotifications();
  const notification = notifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
    saveNotifications(notifications);
  }
};