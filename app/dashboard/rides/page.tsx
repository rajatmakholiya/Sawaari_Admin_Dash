"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Route,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Download,
  MapPin,
  Clock,
  IndianRupee,
  Star,
  User,
  Car,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { getRides, saveRides, type Ride } from "@/lib/localStorage";
import { dummyRides } from "@/lib/dummyData";

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clusterFilter, setClusterFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    const existingRides = getRides();
    if (existingRides.length === 0) {
      saveRides(dummyRides);
      setRides(dummyRides);
    } else {
      setRides(existingRides);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "ongoing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case "cash":
        return "bg-green-100 text-green-800";
      case "card":
        return "bg-blue-100 text-blue-800";
      case "upi":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRides = rides.filter((ride) => {
    const matchesSearch =
      ride.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.dropoffLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || ride.status === statusFilter;
    const matchesCluster =
      clusterFilter === "all" || ride.cluster.toLowerCase() === clusterFilter;
    const matchesPayment =
      paymentFilter === "all" || ride.paymentMethod === paymentFilter;

    let matchesDate = true;
    if (dateRange?.from) {
      const rideDate = new Date(ride.pickupTime);
      matchesDate = rideDate >= dateRange.from;
      if (dateRange.to) {
        matchesDate = matchesDate && rideDate <= dateRange.to;
      }
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCluster &&
      matchesPayment &&
      matchesDate
    );
  });

  const exportToCSV = () => {
    const headers = [
      "Ride ID",
      "Driver",
      "Vehicle",
      "Passenger",
      "Phone",
      "Pickup",
      "Dropoff",
      "Pickup Time",
      "Dropoff Time",
      "Distance (km)",
      "Fare (₹)",
      "Status",
      "Payment Method",
      "Rating",
      "Cluster",
    ];

    const csvData = filteredRides.map((ride) => [
      ride.id,
      ride.driverName,
      ride.vehicleNumber,
      ride.passengerName,
      ride.passengerPhone,
      ride.pickupLocation,
      ride.dropoffLocation,
      new Date(ride.pickupTime).toLocaleString(),
      new Date(ride.dropoffTime).toLocaleString(),
      ride.distance,
      ride.fare,
      ride.status,
      ride.paymentMethod,
      ride.rating,
      ride.cluster,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rides_export_${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const totalRevenue = filteredRides.reduce((sum, ride) => sum + ride.fare, 0);
  const averageRating =
    filteredRides.length > 0
      ? filteredRides.reduce((sum, ride) => sum + ride.rating, 0) /
        filteredRides.length
      : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ride Management</h1>
          <p className="text-sm text-gray-600">
            View and manage all ride history and analytics
          </p>
        </div>

        <Button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search rides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
          </SelectContent>
        </Select>

        <Select value={clusterFilter} onValueChange={setClusterFilter}>
          <SelectTrigger>
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Cluster" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clusters</SelectItem>
            {["north", "central", "south", "east", "west"].map((c) => (
              <SelectItem key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger>
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
          </SelectContent>
        </Select>

        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd")} -{" "}
                    {format(dateRange.to, "LLL dd")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                "Pick a date"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rides</p>
              <p className="text-2xl font-bold">{filteredRides.length}</p>
            </div>
            <Route className="w-6 h-6 text-blue-600" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
            <IndianRupee className="w-6 h-6 text-green-600" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">
                {averageRating.toFixed(1)}
              </p>
            </div>
            <Star className="w-6 h-6 text-yellow-600" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredRides.filter((r) => r.status === "completed").length}
              </p>
            </div>
            <Clock className="w-6 h-6 text-blue-600" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredRides.map((ride) => (
          <Card
            key={ride.id}
            className="border-0 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Route className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Ride #{ride.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {format(
                            new Date(ride.pickupTime),
                            "MMM dd, yyyy HH:mm",
                          )}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(ride.status)}>
                      {ride.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {ride.passengerName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{ride.passengerPhone}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Car className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{ride.driverName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{ride.vehicleNumber}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <IndianRupee className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">₹{ride.fare}</span>
                      </div>
                      <Badge
                        className={getPaymentMethodColor(ride.paymentMethod)}
                      >
                        {ride.paymentMethod.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <span className="font-medium text-green-600">
                          Pickup:{" "}
                        </span>
                        <span>{ride.pickupLocation}</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                      <div>
                        <span className="font-medium text-red-600">
                          Dropoff:{" "}
                        </span>
                        <span>{ride.dropoffLocation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end space-y-2">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="font-semibold">{ride.distance} km</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{ride.rating}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {ride.cluster} Cluster
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredRides.length === 0 && (
          <div className="p-12 text-center border rounded-lg bg-gray-50">
            <Route className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No rides found
            </h3>
            <p className="text-gray-600">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
