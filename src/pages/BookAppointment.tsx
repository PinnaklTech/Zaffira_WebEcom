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
    <div className="min-h-screen luxury-gradient">
      <Navigation />
      
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center animate-fade-in">
            <h1 className="text-5xl font-playfair font-bold text-navy mb-6">Book Your Appointment</h1>
            <p className="text-navy/70 text-xl max-w-3xl mx-auto leading-relaxed">Schedule a consultation for your selected items</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Cart Summary */}
            <Card className="border-gold/20 shadow-luxury rounded-3xl bg-white/90 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-navy font-playfair text-2xl">
                  <MessageSquare className="h-6 w-6 text-gold" />
                  <span>Consultation Items</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {items.length > 0 ? (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.productId} className="flex items-center space-x-4 p-4 bg-gold/10 rounded-2xl border border-gold/20 hover:bg-gold/15 transition-colors duration-300">
                        <img 
                          src={item.image || '/placeholder.svg'} 
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl shadow-sm"
                        />
                        <div className="flex-1">
                          <h3 className="font-playfair font-bold text-navy text-lg">{item.name}</h3>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-gold font-bold text-lg">₹{item.price.toLocaleString()}</span>
                            <Badge className="bg-navy text-white font-bold px-3 py-1 rounded-full">Qty: {item.quantity}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-gold/30 pt-6">
                      <div className="flex justify-between items-center text-xl font-bold text-navy bg-gold/10 rounded-2xl p-4">
                        <span>Total Value:</span>
                        <span className="text-gold text-2xl">₹{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gold/10 rounded-full p-6 w-20 h-20 mx-auto mb-6">
                      <MessageSquare className="h-8 w-8 text-gold mx-auto" />
                    </div>
                    <p className="text-navy/60 text-lg font-medium">No items selected for consultation</p>
                    <p className="text-navy/50 mt-2">Add items to your cart first</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Appointment Form */}
            <Card className="border-gold/20 shadow-luxury rounded-3xl bg-white/90 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-navy font-playfair text-2xl">
                  <Calendar className="h-6 w-6 text-gold" />
                  <span>Appointment Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="appointment_date" className="text-navy font-bold text-base">Date *</Label>
                      <Input
                        id="appointment_date"
                        name="appointment_date"
                        type="date"
                        value={formData.appointment_date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="border-2 border-gold/30 focus:border-gold rounded-xl mt-2 h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-navy font-bold text-base">Time *</Label>
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({...prev, time: e.target.value}))}
                        required
                        className="w-full px-4 py-3 border-2 border-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold mt-2 h-12 font-medium"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customer_name" className="text-navy font-bold text-base">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-4 h-5 w-5 text-gold" />
                      <Input
                        id="customer_name"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                        className="pl-12 border-2 border-gold/30 focus:border-gold rounded-xl mt-2 h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customer_email" className="text-navy font-bold text-base">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-gold" />
                      <Input
                        id="customer_email"
                        name="customer_email"
                        type="email"
                        value={formData.customer_email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                        className="pl-12 border-2 border-gold/30 focus:border-gold rounded-xl mt-2 h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customer_phone" className="text-navy font-bold text-base">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-4 h-5 w-5 text-gold" />
                      <Input
                        id="customer_phone"
                        name="customer_phone"
                        type="tel"
                        value={formData.customer_phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="pl-12 border-2 border-gold/30 focus:border-gold rounded-xl mt-2 h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-navy font-bold text-base">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any specific requirements or questions..."
                      rows={4}
                      className="border-2 border-gold/30 focus:border-gold resize-none rounded-xl mt-2"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading || items.length === 0}
                    className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-4 h-auto rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-luxury-lg"
                  >
                    {loading ? (
                      <>
                        <Clock className="animate-spin h-5 w-5 mr-2" />
                        Booking Appointment...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-5 w-5 mr-2" />
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