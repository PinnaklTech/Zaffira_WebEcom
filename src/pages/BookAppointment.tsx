import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { createAppointment } from '@/store/slices/appointmentSlice';
import { clearCart } from '@/store/slices/cartSlice';
import { useCart } from '@/contexts/CartContext';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { cartService } from '@/services/cartService';

const BookAppointment = () => {
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.appointments);
  const { clearCart: clearContextCart } = useCart();

  const [formData, setFormData] = useState({
    appointment_date: '',
    time: '',
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.appointment_date || !formData.time || !formData.customer_name || !formData.customer_email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const appointmentDateTime = `${formData.appointment_date}T${formData.time}:00.000Z`;
      
      await dispatch(createAppointment({
        appointment_date: appointmentDateTime,
        notes: formData.notes,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
      })).unwrap();

      toast({
        title: "Appointment booked!",
        description: "Your appointment has been successfully booked.",
      });

      // Redirect to dashboard after successful booking
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

      // Clear cart after successful booking
      try {
        await cartService.clearCart();
        dispatch(clearCart());
        clearContextCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
      
      // Reset form
      setFormData({
        appointment_date: '',
        time: '',
        customer_name: user?.name || '',
        customer_email: user?.email || '',
        customer_phone: '',
        notes: '',
      });
      
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error || "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute of [0, 30]) {
        if (hour === 17 && minute === 30) break;
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-white to-gold/10">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-playfair font-bold text-navy mb-4">Book Your Appointment</h1>
            <p className="text-navy/70 text-lg">Schedule a consultation for your selected items</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cart Summary */}
            <Card className="border-gold/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-navy">
                  <MessageSquare className="h-5 w-5" />
                  <span>Consultation Items</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {items.length > 0 ? (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.productId} className="flex items-center space-x-3 p-3 bg-gold/5 rounded-lg">
                        <img 
                          src={item.image || '/placeholder.svg'} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-navy">{item.name}</h3>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-gold font-semibold">₹{item.price.toLocaleString()}</span>
                            <Badge variant="secondary">Qty: {item.quantity}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-gold/20 pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold text-navy">
                        <span>Total Value:</span>
                        <span className="text-gold">₹{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gold/50 mx-auto mb-4" />
                    <p className="text-navy/60">No items selected for consultation</p>
                    <p className="text-sm text-navy/50 mt-2">Add items to your cart first</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Appointment Form */}
            <Card className="border-gold/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-navy">
                  <Calendar className="h-5 w-5" />
                  <span>Appointment Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="appointment_date" className="text-navy">Date *</Label>
                      <Input
                        id="appointment_date"
                        name="appointment_date"
                        type="date"
                        value={formData.appointment_date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="border-gold/30 focus:border-gold"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-navy">Time *</Label>
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({...prev, time: e.target.value}))}
                        required
                        className="w-full px-3 py-2 border border-gold/30 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customer_name" className="text-navy">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gold" />
                      <Input
                        id="customer_name"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                        className="pl-10 border-gold/30 focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customer_email" className="text-navy">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gold" />
                      <Input
                        id="customer_email"
                        name="customer_email"
                        type="email"
                        value={formData.customer_email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                        className="pl-10 border-gold/30 focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customer_phone" className="text-navy">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gold" />
                      <Input
                        id="customer_phone"
                        name="customer_phone"
                        type="tel"
                        value={formData.customer_phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="pl-10 border-gold/30 focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-navy">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any specific requirements or questions..."
                      rows={3}
                      className="border-gold/30 focus:border-gold resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading || items.length === 0}
                    className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold py-3 h-auto"
                  >
                    {loading ? (
                      <>
                        <Clock className="animate-spin h-4 w-4 mr-2" />
                        Booking Appointment...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Appointment
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;