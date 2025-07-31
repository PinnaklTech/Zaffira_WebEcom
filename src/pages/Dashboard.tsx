
import React, { useEffect } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserAppointments, fetchAllAppointments } from '@/store/slices/appointmentSlice';
import { fetchUserConsultations } from '@/store/slices/consultationSlice';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Mail, User as UserIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Appointment {
  id: string;
  appointment_date: string;
  cart_items: CartItem[];
  status: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  notes: string | null;
  created_at: string;
  total_amount: number;
  user_id: string; // Added for filtering
}

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user, profile } = useAppSelector((state) => state.auth);
  const appointments = useAppSelector((state) => state.appointments.appointments);
  const consultations = useAppSelector((state) => state.consultations.consultations);
  const isAdmin = user?.role === 'admin';
  const userAppointments = isAdmin
    ? appointments
    : appointments.filter((apt) => apt.user_id === user?._id || apt.user === user?._id);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        dispatch(fetchAllAppointments());
      } else {
        dispatch(fetchUserAppointments());
      }
      dispatch(fetchUserConsultations());
    }
  }, [dispatch, user, isAdmin]);



  const getUserInitials = () => {
    if (profile?.name) {
      const nameParts = profile.name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return profile.name.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getServiceType = (cartItems: CartItem[]) => {
    if (!cartItems || cartItems.length === 0) return 'Consultation';
    if (cartItems.length === 1) return cartItems[0].name;
    return `${cartItems.length} items consultation`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-white to-gold/10">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-playfair font-bold text-navy mb-2">Dashboard</h1>
            <p className="text-navy/60">Welcome back! Here's your account overview.</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* User Profile Card */}
              <div className="lg:col-span-1">
                <Card className="border-gold/20 shadow-lg rounded-2xl bg-white/90">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-20 w-20 shadow-lg border-4 border-gold/20 bg-gold/10">
                        <AvatarFallback className="text-navy font-bold text-2xl">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="text-2xl font-playfair text-navy font-bold mb-1">
                      {profile?.name || user?.name || 'User'}
                    </CardTitle>
                    {isAdmin && (
                      <span className="inline-block bg-gold text-navy font-semibold text-xs px-4 py-1 rounded-full mb-2 shadow-sm">
                        Admin
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 justify-center text-navy/80">
                      <Mail className="h-4 w-4 text-gold" />
                      <span className="text-sm">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center text-navy/80">
                      <UserIcon className="h-4 w-4 text-gold" />
                      <span className="text-sm">{user?.role || 'user'}</span>
                    </div>
                    <hr className="my-2 border-gold/20" />
                    <div className="flex flex-col gap-1 text-sm text-navy/60">
                      <div className="flex justify-between">
                        <span>Total Appointments</span>
                        <span className="font-semibold text-navy">{userAppointments?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Consultations</span>
                        <span className="font-semibold text-navy">{consultations?.length || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Tabs defaultValue="appointments" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white rounded-xl p-1 shadow-sm mb-8">
                <TabsTrigger value="appointments" className="flex items-center gap-2 data-[state=active]:bg-gold data-[state=active]:text-navy">
                  <CalendarDays className="w-4 h-4" />
                  Appointments
                </TabsTrigger>
                <TabsTrigger value="consultations" className="flex items-center gap-2 data-[state=active]:bg-gold data-[state=active]:text-navy">
                  <CalendarDays className="w-4 h-4" />
                  Consultations
                </TabsTrigger>
              </TabsList>
              <TabsContent value="appointments">
                {/* Appointments History */}
                <Card className="border-gold/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 font-playfair text-navy">
                      <CalendarDays className="h-5 w-5" />
                      <span>Appointment History</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userAppointments && userAppointments.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date & Time</TableHead>
                              <TableHead>Product(s)</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {userAppointments.map((appointment) => (
                              <TableRow
                                key={appointment._id || appointment.id}
                                className="cursor-pointer hover:bg-gold/10"
                                onClick={() => handleRowClick(appointment)}
                              >
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="flex items-center space-x-1 text-sm font-medium">
                                      <CalendarDays className="h-3 w-3 text-gold" />
                                      <span>{formatDate(appointment.appointment_date)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-xs text-navy/60">
                                      <Clock className="h-3 w-3 text-gold" />
                                      <span>{formatTime(appointment.appointment_date)}</span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="font-medium text-navy">
                                    {appointment.cart_items && appointment.cart_items.length > 0
                                      ? appointment.cart_items.length === 1
                                        ? appointment.cart_items[0].name
                                        : `${appointment.cart_items.length} items`
                                      : 'Appointment'}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(appointment.status)}>
                                    {appointment.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <span className="font-semibold text-navy">
                                    ₹{appointment.total_amount?.toLocaleString() || '0'}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm text-navy/70">
                                    {appointment.notes || 'No notes'}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CalendarDays className="h-12 w-12 text-gold/50 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-navy mb-2">No appointments yet</h3>
                        <p className="text-navy/60 mb-4">You haven't booked any appointments yet.</p>
                        <a 
                          href="/book-appointment" 
                          className="inline-flex items-center px-4 py-2 bg-gold text-navy font-medium rounded-lg hover:bg-gold/90 transition-colors"
                        >
                          Book Your First Appointment
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="consultations">
                {/* Consultations History */}
                <Card className="border-gold/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 font-playfair text-navy">
                      <CalendarDays className="h-5 w-5" />
                      <span>Consultation History</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {consultations && consultations.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead>Jewelry Type</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {consultations.map((consultation) => (
                              <TableRow key={consultation._id || consultation.id}>
                                <TableCell>{consultation.preferredDate}</TableCell>
                                <TableCell>{consultation.preferredTime}</TableCell>
                                <TableCell>{consultation.jewelryType}</TableCell>
                                <TableCell>{consultation.description}</TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(consultation.status)}>
                                    {consultation.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CalendarDays className="h-12 w-12 text-gold/50 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-navy mb-2">No consultations yet</h3>
                        <p className="text-navy/60 mb-4">You haven't booked any consultations yet.</p>
                        <a 
                          href="/book-consultation" 
                          className="inline-flex items-center px-4 py-2 bg-gold text-navy font-medium rounded-lg hover:bg-gold/90 transition-colors"
                        >
                          Book Your First Consultation
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      {/* Appointment Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <strong>Date:</strong> {formatDate(selectedAppointment.appointment_date)}<br />
                <strong>Time:</strong> {formatTime(selectedAppointment.appointment_date)}<br />
                <strong>Status:</strong> {selectedAppointment.status}
              </div>
              <div>
                <strong>Products:</strong>
                {(selectedAppointment.cart_items && selectedAppointment.cart_items.length > 0) ? (
                  <ul className="mt-2 space-y-2">
                    {selectedAppointment.cart_items.map((item) => (
                      <li key={item.id} className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded border" />
                        )}
                        <div>
                          <div className="font-semibold">{item.name}</div>
                          <div>Qty: {item.quantity}</div>
                          <div>Price: ₹{item.price}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-navy/60 mt-2">No products in this appointment.</div>
                )}
              </div>
              <div>
                <strong>Total:</strong> ₹{selectedAppointment.total_amount?.toLocaleString() || '0'}
              </div>
              <div>
                <strong>Notes:</strong> {selectedAppointment.notes || 'No notes'}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
