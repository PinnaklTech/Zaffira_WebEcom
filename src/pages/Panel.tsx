import React, { useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';
import { Product } from '@/types/product';
import { useEffect } from 'react';
import { productService } from '@/services/productService';
import { appointmentService } from '@/services/appointmentService';

interface Appointment {
  id: string;
  appointment_date: string;
  cart_items: any[];
  status: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  notes: string | null;
  created_at: string;
  total_amount: number;
}

const AdminPanel = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';
  const [products, setProducts] = useState<Product[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    countInStock: 0,
    sku: '',
    category: '',
    collections: '',
    images: [{ url: '', altText: '' }],
    isFeatured: false,
    isPublished: false,
  });

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
      images: [{ url: '', altText: '' }],
      isFeatured: false,
      isPublished: false,
    });
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProduct) {
      // Update existing product in backend
      productService.updateProduct(selectedProduct._id, {
        name: productForm.name,
        description: productForm.description,
        price: productForm.price,
        discountPrice: productForm.discountPrice,
        countInStock: productForm.countInStock,
        sku: productForm.sku,
        category: productForm.category,
        collections: productForm.collections,
        images: productForm.images,
        isFeatured: productForm.isFeatured,
        isPublished: productForm.isPublished,
      }).then((updatedProduct) => {
        setProducts(products.map(product => product._id === updatedProduct._id ? updatedProduct : product));
        toast({
          title: "Product updated",
          description: "Product has been updated successfully.",
        });
      });
    } else {
      // Create new product in backend
      productService.createProduct({
        name: productForm.name,
        description: productForm.description,
        price: productForm.price,
        discountPrice: productForm.discountPrice,
        countInStock: productForm.countInStock,
        sku: productForm.sku,
        category: productForm.category,
        collections: productForm.collections,
        images: productForm.images,
        isFeatured: productForm.isFeatured,
        isPublished: productForm.isPublished,
      }).then((newProduct) => {
        setProducts([...products, newProduct]);
        toast({
          title: "Product created",
          description: "Product has been created successfully.",
        });
      });
    }
    
    setIsProductDialogOpen(false);
    setSelectedProduct(null);
    resetProductForm();
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      countInStock: product.countInStock,
      sku: product.sku,
      category: product.category,
      collections: product.collections,
      images: product.images && product.images.length > 0
        ? product.images.map(img => ({ url: img.url, altText: img.altText || '' }))
        : [{ url: '', altText: '' }],
      isFeatured: product.isFeatured || false,
      isPublished: product.isPublished || false,
    });
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      productService.deleteProduct(productId).then(() => {
        const updatedProducts = products.filter(product => product._id !== productId);
        setProducts(updatedProducts);
        toast({
          title: "Product deleted",
          description: "Product has been deleted successfully.",
        });
      });
    }
  };

  const handleUpdateAppointmentStatus = (appointmentId: string, status: string) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status }
        : appointment
    );
    setAppointments(updatedAppointments);
    toast({
      title: "Appointment updated",
      description: "Appointment status has been updated successfully.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // Fetch products and appointments from backend on mount
  useEffect(() => {
    productService.getProducts()
      .then((data) => setProducts(data))
      .catch(() => {
        // Optionally show a toast or error
      });
    appointmentService.getAllAppointments()
      .then((data) => setAppointments(data.appointments || data))
      .catch(() => {
        // Optionally show a toast or error
      });
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-ivory">
        <Navigation />
        <div className="pt-20">
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-playfair font-bold text-navy mb-8">Admin Panel</h1>
          
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Product Management</CardTitle>
                    <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => {
                            setSelectedProduct(null);
                            resetProductForm();
                          }}
                          className="bg-gold hover:bg-gold-dark text-navy"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            {selectedProduct ? 'Edit Product' : 'Add New Product'}
                          </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleProductSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                              id="name"
                              value={productForm.name}
                              onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={productForm.description}
                              onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="price">Price (₹)</Label>
                              <Input
                                id="price"
                                type="number"
                                value={productForm.price}
                                onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                                required
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="stock">Stock</Label>
                              <Input
                                id="stock"
                                type="number"
                                value={productForm.countInStock}
                                onChange={(e) => setProductForm(prev => ({ ...prev, countInStock: Number(e.target.value) }))}
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Select 
                              value={productForm.category} 
                              onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rings">Rings</SelectItem>
                                <SelectItem value="necklaces">Necklaces</SelectItem>
                                <SelectItem value="earrings">Earrings</SelectItem>
                                <SelectItem value="bracelets">Bracelets</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="collections">Collections</Label>
                            <Input
                              id="collections"
                              value={productForm.collections}
                              onChange={(e) => setProductForm(prev => ({ ...prev, collections: e.target.value }))}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="sku">SKU</Label>
                            <Input
                              id="sku"
                              value={productForm.sku}
                              onChange={(e) => setProductForm(prev => ({ ...prev, sku: e.target.value }))}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                            <Input
                              id="discountPrice"
                              type="number"
                              value={productForm.discountPrice}
                              onChange={(e) => setProductForm(prev => ({ ...prev, discountPrice: Number(e.target.value) }))}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="isFeatured">Is Featured</Label>
                            <input
                              type="checkbox"
                              id="isFeatured"
                              checked={productForm.isFeatured}
                              onChange={(e) => setProductForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="isPublished">Is Published</Label>
                            <input
                              type="checkbox"
                              id="isPublished"
                              checked={productForm.isPublished}
                              onChange={(e) => setProductForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="images">Images (URL and Alt Text)</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {productForm.images.map((image, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <Input
                                    type="url"
                                    placeholder="Image URL"
                                    value={image.url}
                                    onChange={(e) => setProductForm(prev => ({
                                      ...prev,
                                      images: prev.images.map((img, i) => (i === index ? { ...img, url: e.target.value } : img))
                                    }))}
                                  />
                                  <Input
                                    placeholder="Alt Text"
                                    value={image.altText}
                                    onChange={(e) => setProductForm(prev => ({
                                      ...prev,
                                      images: prev.images.map((img, i) => (i === index ? { ...img, altText: e.target.value } : img))
                                    }))}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full bg-gold hover:bg-gold-dark text-navy"
                          >
                            {selectedProduct ? 'Update Product' : 'Create Product'}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Collections</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Discount Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product: Product) => (
                        <TableRow key={product._id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.collections}</TableCell>
                          <TableCell>₹{product.price.toLocaleString()}</TableCell>
                          <TableCell>₹{product.discountPrice?.toLocaleString() || '0'}</TableCell>
                          <TableCell>{product.countInStock}</TableCell>
                          <TableCell>{product.isFeatured ? 'Yes' : 'No'}</TableCell>
                          <TableCell>{product.isPublished ? 'Yes' : 'No'}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(product._id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appointment: Appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{appointment.customer_name}</div>
                              <div className="text-sm text-gray-600">{appointment.customer_email}</div>
                              <div className="text-sm text-gray-600">{appointment.customer_phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(appointment.appointment_date)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>₹{appointment.total_amount?.toLocaleString() || '0'}</TableCell>
                          <TableCell>
                            <Select
                              value={appointment.status}
                              onValueChange={(status) => 
                                handleUpdateAppointmentStatus(appointment.id, status)
                              }
                            >
                              <SelectTrigger className="w-32">
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
