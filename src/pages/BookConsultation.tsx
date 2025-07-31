import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarDays, Clock, Star, CheckCircle, Upload } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { consultationService } from '@/services/consultationService';

const consultationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  jewelryType: z.string().min(1, 'Please specify the type of jewelry'),
  description: z.string().min(10, 'Please provide more details about your jewelry'),
  preferredDate: z.string().min(1, 'Please select a preferred date'),
  preferredTime: z.string().min(1, 'Please select a preferred time'),
  images: z.any().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

const BookConsultation = () => {
  const { toast } = useToast();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  
  // Scroll to top and handle initial loading
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Simulate initial loading for form setup
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);
  
  const form = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jewelryType: '',
      description: '',
      preferredDate: '',
      preferredTime: '',
      images: null,
    },
  });

  const onSubmit = async (data: ConsultationFormData) => {
    try {
      // Send consultation to backend
      await consultationService.createConsultation({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        jewelryType: data.jewelryType,
        description: data.description,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        images: uploadedImages.map(file => ({ name: file.name, url: '' })), // You may want to handle image upload separately
      });
      toast({
        title: "Consultation Booked!",
        description: "We'll contact you within 24 hours to confirm your appointment.",
      });
      form.reset();
      setUploadedImages([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 5); // Limit to 5 images
      setUploadedImages(prev => [...prev, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const benefits = [
    "Free assessment of your jewelry's condition",
    "Expert advice on refurbishment options",
    "Transparent pricing with no hidden costs",
    "Professional restoration recommendations",
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  if (isPageLoading) {
    return <Loading message="Preparing consultation form..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-gold-50 animate-fade-in">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Book Your Free Consultation
            </h1>
            <p className="text-xl text-navy/70 max-w-3xl mx-auto leading-relaxed">
              Transform your treasured jewelry with our expert refurbishment services. 
              Schedule a complimentary consultation to discuss your restoration needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Consultation Form */}
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-playfair text-navy">
                  Schedule Your Consultation
                </CardTitle>
                <CardDescription className="text-navy/60">
                  Fill out the form below and we'll get in touch within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        {...form.register('firstName')}
                        className="border-gold/20 focus:border-gold"
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        {...form.register('lastName')}
                        className="border-gold/20 focus:border-gold"
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      className="border-gold/20 focus:border-gold"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...form.register('phone')}
                      className="border-gold/20 focus:border-gold"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jewelryType">Type of Jewelry *</Label>
                    <Input
                      id="jewelryType"
                      placeholder="e.g., Ring, Necklace, Bracelet, Earrings"
                      {...form.register('jewelryType')}
                      className="border-gold/20 focus:border-gold"
                    />
                    {form.formState.errors.jewelryType && (
                      <p className="text-sm text-red-500">{form.formState.errors.jewelryType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description & Condition *</Label>
                    <textarea
                      id="description"
                      {...form.register('description')}
                      rows={4}
                      placeholder="Please describe your jewelry and its current condition, any damage, or specific refurbishment needs..."
                      className="w-full px-3 py-2 border border-gold/20 rounded-md focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none resize-none"
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="images">Upload Images (Optional)</Label>
                    <div className="border-2 border-dashed border-gold/20 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="images"
                        className="cursor-pointer flex flex-col items-center gap-2 text-navy/60 hover:text-gold transition-colors"
                      >
                        <Upload className="h-8 w-8" />
                        <span>Click to upload images of your jewelry</span>
                        <span className="text-xs">Maximum 5 images, 10MB each</span>
                      </label>
                    </div>
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {uploadedImages.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferredDate">Preferred Date *</Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        {...form.register('preferredDate')}
                        className="border-gold/20 focus:border-gold"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {form.formState.errors.preferredDate && (
                        <p className="text-sm text-red-500">{form.formState.errors.preferredDate.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferredTime">Preferred Time *</Label>
                      <select
                        id="preferredTime"
                        {...form.register('preferredTime')}
                        className="w-full px-3 py-2 border border-gold/20 rounded-md focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none bg-white"
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      {form.formState.errors.preferredTime && (
                        <p className="text-sm text-red-500">{form.formState.errors.preferredTime.message}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gold hover:bg-gold/90 text-white font-semibold py-3 text-lg"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? 'Booking...' : 'Book Free Consultation'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Benefits & Info Section */}
            <div className="space-y-8">
              <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-playfair text-navy flex items-center gap-2">
                    <Star className="h-6 w-6 text-gold" />
                    What to Expect
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                        <span className="text-navy/80">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-playfair text-navy flex items-center gap-2">
                    <CalendarDays className="h-6 w-6 text-gold" />
                    Consultation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gold mt-0.5" />
                    <div>
                      <p className="font-medium text-navy">Duration: 30-45 minutes</p>
                      <p className="text-sm text-navy/60">Comprehensive assessment and discussion</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-gold mt-0.5" />
                    <div>
                      <p className="font-medium text-navy">Completely Free</p>
                      <p className="text-sm text-navy/60">No obligation or hidden charges</p>
                    </div>
                  </div>
                  <div className="p-4 bg-gold/10 rounded-lg">
                    <p className="text-sm text-navy/80">
                      <strong>Bring your jewelry:</strong> We recommend bringing the pieces you'd like to refurbish 
                      so our experts can provide the most accurate assessment and recommendations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookConsultation;