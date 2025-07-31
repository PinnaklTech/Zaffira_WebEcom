import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/store/slices/productSlice';
import { fetchAllAppointments, updateAppointmentStatus as updateAppointmentStatusThunk } from '@/store/slices/appointmentSlice';
import { fetchUsers } from '@/store/slices/userSlice';
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from '@/store/slices/supplierSlice';
import Navigation from '@/components/Navigation';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Calendar, 
  Users, 
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Star,
  Globe,
  Phone,
  Mail,
  Clock,
  IndianRupee,
  TrendingUp,
  ShoppingCart,
  UserCheck,
  Building2,
  MapPin,
  Award
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  countInStock: number;
  sku: string;
  category: string;
  collections: string;
  images: { url: string; altText?: string }[];
  isFeatured?: boolean;
  isPublished?: boolean;
  supplier?: {
    _id: string;
    name: string;
    phoneNumber: string;
    emailId: string;
    certification?: string;
    location?: string;
    specialty?: string;
  };
}

interface Appointment {
  id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  appointment_date: string;
  status: string;
  notes: string;
  cart_items: any[];
  total_amount: number;
  created_at?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface Supplier {
  _id: string;
  name: string;
  phoneNumber: string;
  emailId: string;
  certification?: string;
  location?: string;
  specialty?: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    countInStock: 0,
    sku: '',
    category: '',
    collections: '',
    supplier: 'none',
    images: [
      { url: '', altText: '' },
      { url: '', altText: '' },
      { url: '', altText: '' },
      { url: '', altText: '' },
      { url: '', altText: '' }
    ],
    isFeatured: false,
    isPublished: false,
  });
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    phoneNumber: '',
    emailId: '',
    certification: '',
    location: '',
    specialty: '',
  });

  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';
  const products = useAppSelector((state) => state.products.products);
  const appointments = useAppSelector((state) => state.appointments.appointments);
  const users = useAppSelector((state) => state.users.users);
  const suppliers = useAppSelector((state) => state.suppliers.suppliers);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(fetchAllAppointments());
    dispatch(fetchUsers());
    dispatch(fetchSuppliers());
  }, [dispatch]);



  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: 0,
      discountPrice: 0,
      countInStock: 0,
      sku: '',
      category: '',
      collections: '',
      supplier: 'none',
      images: [
        { url: '', altText: '' },
        { url: '', altText: '' },
        { url: '', altText: '' },
        { url: '', altText: '' },
        { url: '', altText: '' }
      ],
      isFeatured: false,
      isPublished: false,
    });
  };

  const resetSupplierForm = () => {
    setSupplierForm({
      name: '',
      phoneNumber: '',
      emailId: '',
      certification: '',
      location: '',
      specialty: '',
    });
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean images: only include those with a non-empty url
    const cleanedImages = productForm.images.filter(img => img.url && img.url.trim() !== "");
    const cleanedProductForm = { 
      ...productForm, 
      images: cleanedImages,
      supplier: productForm.supplier === 'none' ? undefined : productForm.supplier
    };
    if (selectedProduct) {
      if (!selectedProduct._id) {
        toast({ title: 'Error', description: 'No product ID found for update.' });
        return;
      }
      dispatch(updateProduct({ id: selectedProduct._id, data: cleanedProductForm })).then((action: any) => {
        if (!action.error) {
          toast({ title: 'Product updated', description: 'Product has been updated successfully.' });
          dispatch(fetchProducts({})); // Refresh products
        } else {
          toast({ title: 'Update failed', description: action.error?.message || 'Failed to update product.' });
        }
      });
    } else {
      dispatch(createProduct(cleanedProductForm)).then((action: any) => {
        if (!action.error) {
          toast({ title: 'Product created', description: 'Product has been created successfully.' });
          dispatch(fetchProducts({})); // Refresh products
        }
      });
    }
    setIsProductDialogOpen(false);
    setSelectedProduct(null);
    resetProductForm();
  };

  const handleSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSupplier) {
      if (!selectedSupplier._id) {
        toast({ title: 'Error', description: 'No supplier ID found for update.' });
        return;
      }
      dispatch(updateSupplier({ id: selectedSupplier._id, data: supplierForm })).then((action: any) => {
        if (!action.error) {
          toast({ title: 'Supplier updated', description: 'Supplier has been updated successfully.' });
          dispatch(fetchSuppliers()); // Refresh suppliers
        } else {
          toast({ title: 'Update failed', description: action.error?.message || 'Failed to update supplier.' });
        }
      });
    } else {
      dispatch(createSupplier(supplierForm)).then((action: any) => {
        if (!action.error) {
          toast({ title: 'Supplier created', description: 'Supplier has been created successfully.' });
          dispatch(fetchSuppliers()); // Refresh suppliers
        }
      });
    }
    setIsSupplierDialogOpen(false);
    setSelectedSupplier(null);
    resetSupplierForm();
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    
    // Ensure we always have exactly 5 image slots
    const imageSlots = Array(5).fill(null).map((_, index) => {
      if (product.images && product.images[index]) {
        return {
          url: product.images[index].url,
          altText: product.images[index].altText || ''
        };
      }
      return { url: '', altText: '' };
    });
    
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      countInStock: product.countInStock,
      sku: product.sku,
      category: product.category,
      collections: product.collections,
      supplier: product.supplier?._id || 'none',
      images: imageSlots,
      isFeatured: product.isFeatured || false,
      isPublished: product.isPublished || false,
    });
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(productId)).then((action: any) => {
        if (!action.error) {
          toast({ title: 'Product deleted', description: 'Product has been deleted successfully.' });
          dispatch(fetchProducts({})); // Refresh products
        }
      });
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSupplierForm({
      name: supplier.name,
      phoneNumber: supplier.phoneNumber,
      emailId: supplier.emailId,
      certification: supplier.certification || '',
      location: supplier.location || '',
      specialty: supplier.specialty || '',
    });
    setIsSupplierDialogOpen(true);
  };

  const handleDeleteSupplier = (supplierId: string) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      dispatch(deleteSupplier(supplierId)).then((action: any) => {
        if (!action.error) {
          toast({ title: 'Supplier deleted', description: 'Supplier has been deleted successfully.' });
          dispatch(fetchSuppliers()); // Refresh suppliers
        }
      });
    }
  };

  const handleUpdateAppointmentStatus = (appointmentId: string, status: string) => {
    dispatch(updateAppointmentStatusThunk({ id: appointmentId, status })).then((action: any) => {
      if (!action.error) {
        toast({ title: 'Appointment updated', description: 'Appointment status has been updated successfully.' });
        dispatch(fetchAllAppointments()); // Refresh appointments
      }
    });
  };

  const handleAppointmentRowClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.emailId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalProducts = products.length;
  const totalAppointments = appointments.length;
  const totalUsers = users.length;
  const totalSuppliers = suppliers.length;
  const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="pt-20">
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
              <p className="text-gray-600 text-lg">You don't have permission to access this page.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 text-lg">Manage your products, appointments, and users</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Products</p>
                    <p className="text-3xl font-bold">{totalProducts}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Appointments</p>
                    <p className="text-3xl font-bold">{totalAppointments}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold">{totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Pending Appointments</p>
                    <p className="text-3xl font-bold">{pendingAppointments}</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-100 text-sm font-medium">Total Suppliers</p>
                    <p className="text-3xl font-bold">{totalSuppliers}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-teal-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white rounded-xl p-1 shadow-sm">
              <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Package className="w-4 h-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Calendar className="w-4 h-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="suppliers" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Building2 className="w-4 h-4" />
                Suppliers
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Package className="w-6 h-6" />
                      Product Management
                    </CardTitle>
                    <Button 
                      onClick={() => { setSelectedProduct(null); resetProductForm(); setIsProductDialogOpen(true); }} 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Product</TableHead>
                          <TableHead className="font-semibold">SKU</TableHead>
                          <TableHead className="font-semibold">Category</TableHead>
                          <TableHead className="font-semibold">Price</TableHead>
                          <TableHead className="font-semibold">Stock</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product: Product) => (
                          <TableRow key={product._id || product.sku || product.name} className="hover:bg-gray-50 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                  <Package className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{product.name}</div>
                                  <div className="text-sm text-gray-500">{product.collections}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono">{product.sku}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{product.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <IndianRupee className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">{product.price.toLocaleString()}</span>
                                {product.discountPrice && product.discountPrice > 0 && (
                                  <span className="text-sm text-green-600 ml-2">
                                    (₹{product.discountPrice.toLocaleString()})
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={product.countInStock > 0 ? "default" : "destructive"}>
                                {product.countInStock} units
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {product.isFeatured && (
                                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                    <Star className="w-3 h-3 mr-1" />
                                    Featured
                                  </Badge>
                                )}
                                {product.isPublished && (
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <Globe className="w-3 h-3 mr-1" />
                                    Published
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)} className="hover:bg-blue-50">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product._id)} className="hover:bg-red-50 text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments">
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    Appointment Management
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search appointments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Customer</TableHead>
                          <TableHead className="font-semibold">Date & Time</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Total</TableHead>
                          <TableHead className="font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map((appointment: Appointment, idx) => (
                          <TableRow
                            key={appointment.id || idx}
                            className="hover:bg-gold/10 cursor-pointer"
                            onClick={() => handleAppointmentRowClick(appointment)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div>
                                  <div className="font-semibold">
                                    {appointment.user?.name || appointment.customer_name || 'N/A'}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {appointment.user?.email || appointment.customer_email || 'N/A'}
                                  </div>
                                  {appointment.customer_phone && (
                                    <div className="text-xs text-gray-500">{appointment.customer_phone}</div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{appointment.appointment_date}</TableCell>
                            <TableCell>{appointment.status}</TableCell>
                            <TableCell>₹{appointment.total_amount?.toLocaleString() || '0'}</TableCell>
                            <TableCell>
                              <Select value={appointment.status} onValueChange={status => handleUpdateAppointmentStatus(appointment.id, status)}>
                                <SelectTrigger className="w-36">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Suppliers Tab */}
            <TabsContent value="suppliers">
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Building2 className="w-6 h-6" />
                      Supplier Management
                    </CardTitle>
                    <Button 
                      onClick={() => { setSelectedSupplier(null); resetSupplierForm(); setIsSupplierDialogOpen(true); }} 
                      className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 shadow-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Supplier
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search suppliers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Supplier</TableHead>
                          <TableHead className="font-semibold">Contact</TableHead>
                          <TableHead className="font-semibold">Location</TableHead>
                          <TableHead className="font-semibold">Specialty</TableHead>
                          <TableHead className="font-semibold">Certification</TableHead>
                          <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSuppliers.map((supplier: Supplier) => (
                          <TableRow key={supplier._id} className="hover:bg-gray-50 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center">
                                  <Building2 className="w-5 h-5 text-teal-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{supplier.name}</div>
                                  <div className="text-sm text-gray-500">Added by {supplier.user?.name}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm">{supplier.emailId}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm">{supplier.phoneNumber}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {supplier.location ? (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm">{supplier.location}</span>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">Not specified</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {supplier.specialty ? (
                                <Badge variant="secondary">{supplier.specialty}</Badge>
                              ) : (
                                <span className="text-gray-400 text-sm">Not specified</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {supplier.certification ? (
                                <div className="flex items-center gap-2">
                                  <Award className="w-4 h-4 text-yellow-500" />
                                  <span className="text-sm">{supplier.certification}</span>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">Not specified</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditSupplier(supplier)} className="hover:bg-teal-50">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteSupplier(supplier._id)} className="hover:bg-red-50 text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">User</TableHead>
                          <TableHead className="font-semibold">Email</TableHead>
                          <TableHead className="font-semibold">Role</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user, idx) => (
                          <TableRow key={user._id || user.email || idx} className="hover:bg-gray-50 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                                  <UserCheck className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{user.name}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span>{user.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Enhanced Product Dialog */}
          {isProductDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-6 h-6" />
                    {selectedProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                </div>
                
                <form onSubmit={handleProductSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Product Name</Label>
                      <Input 
                        id="name" 
                        value={productForm.name} 
                        onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))} 
                        required 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku" className="text-sm font-medium text-gray-700">SKU</Label>
                      <Input 
                        id="sku" 
                        value={productForm.sku} 
                        onChange={e => setProductForm(prev => ({ ...prev, sku: e.target.value }))} 
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea 
                      id="description" 
                      value={productForm.description} 
                      onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))} 
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="price" className="text-sm font-medium text-gray-700">Price (₹)</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        value={productForm.price} 
                        onChange={e => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))} 
                        required 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discountPrice" className="text-sm font-medium text-gray-700">Discount Price (₹)</Label>
                      <Input 
                        id="discountPrice" 
                        type="number" 
                        value={productForm.discountPrice} 
                        onChange={e => setProductForm(prev => ({ ...prev, discountPrice: Number(e.target.value) }))} 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock" className="text-sm font-medium text-gray-700">Stock</Label>
                      <Input 
                        id="stock" 
                        type="number" 
                        value={productForm.countInStock} 
                        onChange={e => setProductForm(prev => ({ ...prev, countInStock: Number(e.target.value) }))} 
                        required 
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
                      <Input 
                        id="category" 
                        value={productForm.category} 
                        onChange={e => setProductForm(prev => ({ ...prev, category: e.target.value }))} 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="collections" className="text-sm font-medium text-gray-700">Collections</Label>
                      <Input 
                        id="collections" 
                        value={productForm.collections} 
                        onChange={e => setProductForm(prev => ({ ...prev, collections: e.target.value }))} 
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="supplier" className="text-sm font-medium text-gray-700">Supplier</Label>
                    <Select 
                      value={productForm.supplier} 
                      onValueChange={value => setProductForm(prev => ({ ...prev, supplier: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Supplier</SelectItem>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier._id} value={supplier._id}>
                            {supplier.name} - {supplier.specialty || 'General'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Product Images (5 slots)</Label>
                    <div className="mt-2 space-y-3">
                      {productForm.images.map((image, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-lg bg-gray-50">
                          <div>
                            <Label className="text-xs text-gray-600">Image {index + 1} URL</Label>
                            <Input 
                              type="url" 
                              placeholder="https://example.com/image.jpg" 
                              value={image.url} 
                              onChange={e => setProductForm(prev => ({ 
                                ...prev, 
                                images: prev.images.map((img, i) => (i === index ? { ...img, url: e.target.value } : img)) 
                              }))} 
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600">Alt Text {index + 1}</Label>
                            <Input 
                              placeholder="Description of the image" 
                              value={image.altText} 
                              onChange={e => setProductForm(prev => ({ 
                                ...prev, 
                                images: prev.images.map((img, i) => (i === index ? { ...img, altText: e.target.value } : img)) 
                              }))} 
                              className="mt-1"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-8 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="isFeatured" 
                        checked={productForm.isFeatured} 
                        onChange={e => setProductForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <Label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Featured Product
                      </Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="isPublished" 
                        checked={productForm.isPublished} 
                        onChange={e => setProductForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <Label htmlFor="isPublished" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Globe className="w-4 h-4 text-green-500" />
                        Published
                      </Label>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg"
                    >
                      {selectedProduct ? 'Update Product' : 'Create Product'}
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => setIsProductDialogOpen(false)} 
                      variant="outline" 
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Supplier Dialog */}
      {isSupplierDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b bg-gradient-to-r from-teal-50 to-cyan-50">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-6 h-6" />
                {selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </h2>
            </div>
            
            <form onSubmit={handleSupplierSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="supplierName" className="text-sm font-medium text-gray-700">Supplier Name</Label>
                  <Input 
                    id="supplierName" 
                    value={supplierForm.name} 
                    onChange={e => setSupplierForm(prev => ({ ...prev, name: e.target.value }))} 
                    required 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
                  <Input 
                    id="phoneNumber" 
                    value={supplierForm.phoneNumber} 
                    onChange={e => setSupplierForm(prev => ({ ...prev, phoneNumber: e.target.value }))} 
                    required 
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="emailId" className="text-sm font-medium text-gray-700">Email Address</Label>
                <Input 
                  id="emailId" 
                  type="email"
                  value={supplierForm.emailId} 
                  onChange={e => setSupplierForm(prev => ({ ...prev, emailId: e.target.value }))} 
                  required 
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                  <Input 
                    id="location" 
                    value={supplierForm.location} 
                    onChange={e => setSupplierForm(prev => ({ ...prev, location: e.target.value }))} 
                    className="mt-1"
                    placeholder="City, State, Country"
                  />
                </div>
                <div>
                  <Label htmlFor="specialty" className="text-sm font-medium text-gray-700">Specialty</Label>
                  <Input 
                    id="specialty" 
                    value={supplierForm.specialty} 
                    onChange={e => setSupplierForm(prev => ({ ...prev, specialty: e.target.value }))} 
                    className="mt-1"
                    placeholder="e.g., Electronics, Textiles"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="certification" className="text-sm font-medium text-gray-700">Certification</Label>
                <Input 
                  id="certification" 
                  value={supplierForm.certification} 
                  onChange={e => setSupplierForm(prev => ({ ...prev, certification: e.target.value }))} 
                  className="mt-1"
                  placeholder="e.g., ISO 9001, CE Mark"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 shadow-lg"
                >
                  {selectedSupplier ? 'Update Supplier' : 'Create Supplier'}
                </Button>
                <Button 
                  type="button"
                  onClick={() => setIsSupplierDialogOpen(false)} 
                  variant="outline" 
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <strong>Date:</strong> {selectedAppointment.appointment_date}<br />
                <strong>Status:</strong> {selectedAppointment.status}
              </div>
              <div>
                <strong>Products:</strong>
                {(selectedAppointment.cart_items && selectedAppointment.cart_items.length > 0) ? (
                  <ul className="mt-2 space-y-2">
                    {selectedAppointment.cart_items.map((item) => (
                      <li key={item.productId || item.id} className="flex items-center gap-3">
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
                  <div className="text-gray-600 mt-2">No products in this appointment.</div>
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

export default AdminPanel;