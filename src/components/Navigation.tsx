
import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, LogOut, Search, Heart, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemCount = useAppSelector((state) => state.cart.itemCount);
  
  // Use Redux auth state instead of AuthContext
  const { user, profile, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Check if user is admin using Redux state
  const isAdmin = user?.role === 'admin' || profile?.role === 'admin';

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Product categories for dropdown
  const productCategories = [
    { name: 'Rings', href: '/products?category=rings' },
    { name: 'Necklaces', href: '/products?category=necklaces' },
    { name: 'Earrings', href: '/products?category=earrings' },
    { name: 'Bracelets', href: '/products?category=bracelets' },
    { name: 'Bangles', href: '/products?category=bangles' },
    { name: 'Chains', href: '/products?category=chains' },
  ];

  const collections = [
    { name: 'Bridal Collection', href: '/products?collections=bridal' },
    { name: 'Heritage Collection', href: '/products?collections=heritage' },
    { name: 'Modern Collection', href: '/products?collections=modern' },
    { name: 'Classic Collection', href: '/products?collections=classic' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };
  // Different navigation items based on current page
  const getNavItems = () => {
    if (location.pathname === '/products') {
      return [
        { name: 'Home', href: '/', type: 'link' },
        { name: 'Refurbish', href: '/book-consultation', type: 'link' },
        { name: 'Contact', href: '#contact', type: 'scroll' }
      ];
    }
    
    // Default navigation for home page
    return [
      { name: 'Home', href: '/', type: 'link' },
      { name: 'About Us', href: '#about', type: 'scroll' },
      { name: 'Refurbish', href: '/book-consultation', type: 'link' },
      { name: 'Contact', href: '#contact', type: 'scroll' }
    ];
  };

  const navItems = getNavItems();

  // Handle anchor links for sections on home page
  const handleScrollToSection = (href: string) => {
    setIsMenuOpen(false);
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleSignOut = async () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };

  const getUserInitials = () => {
    if (profile?.name) {
      const nameParts = profile.name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return profile.name.slice(0, 2).toUpperCase();
    }
    if (user?.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return user.name.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const navbarClasses = isScrolled 
    ? 'glass-effect shadow-elegant-lg border-gold/10' 
    : 'bg-white/85 backdrop-blur-xl shadow-elegant border-white/40';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isMobile ? 'px-3 pt-3' : 'px-6 pt-4'}`}>
      <div className={`max-w-7xl mx-auto transition-all duration-500 ${navbarClasses} ${isMobile ? 'rounded-2xl' : 'rounded-3xl'}`}>
        <div className={`flex justify-between items-center ${isMobile ? 'h-16 px-5' : 'h-20 px-8'}`}>
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              onClick={handleLogoClick}
              className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-playfair font-bold text-navy hover:text-gold transition-all duration-300 tracking-wide`}
            >
              Zaffira
            </Link>
          </div>

          {!isMobile && (
            <div className="hidden lg:flex items-center space-x-1">
              <NavigationMenu>
                <NavigationMenuList className="space-x-2">
                  {/* Products Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-navy/80 hover:text-gold hover:bg-gold/10 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 group">
                      Products
                      <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="glass-effect border-gold/20 shadow-luxury-lg rounded-2xl p-6 w-96">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-playfair font-semibold text-navy mb-3">Categories</h3>
                          <div className="space-y-2">
                            {productCategories.map((category) => (
                              <NavigationMenuLink key={category.name} asChild>
                                <Link
                                  to={category.href}
                                  className="block text-navy/70 hover:text-gold hover:bg-gold/5 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                                >
                                  {category.name}
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-playfair font-semibold text-navy mb-3">Collections</h3>
                          <div className="space-y-2">
                            {collections.map((collection) => (
                              <NavigationMenuLink key={collection.name} asChild>
                                <Link
                                  to={collection.href}
                                  className="block text-navy/70 hover:text-gold hover:bg-gold/5 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                                >
                                  {collection.name}
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-gold/20">
                        <Link
                          to="/products"
                          className="inline-flex items-center text-gold hover:text-gold-dark font-medium text-sm transition-colors duration-200"
                        >
                          View All Products →
                        </Link>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Regular Navigation Items */}
                {navItems.map((item) => (
                  item.type === 'scroll' ? (
                    <button
                      key={item.name}
                      onClick={() => handleScrollToSection(item.href)}
                      className="text-navy/80 hover:text-gold hover:bg-gold/10 px-4 py-2 text-sm font-medium relative group cursor-pointer rounded-xl transition-all duration-300"
                    >
                      {item.name}
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gold group-hover:w-8 transition-all duration-300"></span>
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-navy/80 hover:text-gold hover:bg-gold/10 px-4 py-2 text-sm font-medium relative group rounded-xl transition-all duration-300"
                    >
                      {item.name}
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gold group-hover:w-8 transition-all duration-300"></span>
                    </Link>
                  )
                ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          )}

          <div className="flex items-center space-x-3">
            {/* Search */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`text-navy/80 hover:text-gold hover:bg-gold/10 ${isMobile ? 'h-10 w-10' : 'h-9 w-9'} rounded-xl transition-all duration-300`}
                >
                  <Search className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md glass-effect border-gold/20">
                <DialogHeader>
                  <DialogTitle className="font-playfair text-navy">Search Jewelry</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy/60 h-4 w-4" />
                    <Input
                      placeholder="Search for rings, necklaces, earrings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-gold/30 focus:border-gold rounded-xl"
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-navy font-semibold rounded-xl">
                    Search
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {user ? (
              <>
                {/* Wishlist - placeholder for future implementation */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`text-navy/80 hover:text-gold hover:bg-gold/10 ${isMobile ? 'h-10 w-10' : 'h-9 w-9'} rounded-xl transition-all duration-300`}
                >
                  <Heart className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
                </Button>

                {/* Cart */}
                <Link 
                  to="/cart"
                  className={`text-navy/80 hover:text-gold hover:bg-gold/10 relative ${isMobile ? 'h-10 w-10' : 'h-9 w-9'} rounded-xl group transition-all duration-300 flex items-center justify-center`}
                >
                  <ShoppingBag className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
                  {itemCount > 0 && (
                    <span className={`absolute -top-1 -right-1 bg-gold text-navy text-xs rounded-full ${isMobile ? 'h-5 w-5' : 'h-4 w-4'} flex items-center justify-center font-bold shadow-luxury animate-scale-in`}>
                      {itemCount}
                    </span>
                  )}
                </Link>

                {!isMobile && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-10 w-10 rounded-xl p-0 hover:bg-gold/10 transition-all duration-300">
                        <Avatar className="h-8 w-8 border-2 border-gold/20">
                          <AvatarFallback className="bg-gradient-to-br from-gold/20 to-gold/10 text-navy font-bold text-sm">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 glass-effect border-gold/20 shadow-luxury-lg rounded-2xl">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          {(profile?.name || user?.name) && (
                            <p className="font-playfair font-semibold text-navy">{profile?.name || user?.name}</p>
                          )}
                          <p className="text-xs text-navy/60">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="cursor-pointer hover:bg-gold/10 rounded-lg">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="cursor-pointer hover:bg-gold/10 rounded-lg">
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer hover:bg-red-50 text-red-600 rounded-lg">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </>
            ) : (
              <>
                <Link 
                  to="/auth"
                  className={`text-navy/80 hover:text-gold hover:bg-gold/10 ${isMobile ? 'h-10 w-10' : 'h-9 w-9'} rounded-xl group transition-all duration-300 flex items-center justify-center`}
                >
                  <User className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
                </Link>

                <Link 
                  to="/cart"
                  className={`text-navy/80 hover:text-gold hover:bg-gold/10 relative ${isMobile ? 'h-10 w-10' : 'h-9 w-9'} rounded-xl group transition-all duration-300 flex items-center justify-center`}
                >
                  <ShoppingBag className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
                  {itemCount > 0 && (
                    <span className={`absolute -top-1 -right-1 bg-gold text-navy text-xs rounded-full ${isMobile ? 'h-5 w-5' : 'h-4 w-4'} flex items-center justify-center font-bold shadow-luxury animate-scale-in`}>
                      {itemCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`text-navy/80 hover:text-gold hover:bg-gold/10 ${isMobile ? 'h-10 w-10' : 'h-9 w-9'} rounded-xl transition-all duration-300 flex items-center justify-center`}
              >
                {isMenuOpen ? <X className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} /> : <Menu className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-gold/20 animate-slide-down">
            <div className="px-6 py-6 space-y-3">
              {/* Mobile Search */}
              <div className="mb-4">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy/60 h-4 w-4" />
                  <Input
                    placeholder="Search jewelry..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gold/30 focus:border-gold rounded-xl"
                  />
                </form>
              </div>

              {/* Products Submenu */}
              <div className="space-y-2">
                <Link
                  to="/products"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-navy/80 hover:text-gold hover:bg-gold/10 block px-4 py-3 text-base font-medium rounded-xl transition-all duration-300"
                >
                  All Products
                </Link>
                <div className="pl-4 space-y-1">
                  {productCategories.slice(0, 4).map((category) => (
                    <Link
                      key={category.name}
                      to={category.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-navy/60 hover:text-gold hover:bg-gold/5 block px-3 py-2 text-sm rounded-lg transition-all duration-300"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {navItems.map((item) => (
                item.type === 'scroll' ? (
                  <button
                    key={item.name}
                    onClick={() => handleScrollToSection(item.href)}
                    className="text-navy/80 hover:text-gold hover:bg-gold/10 block px-4 py-3 text-base font-medium cursor-pointer rounded-xl w-full text-left transition-all duration-300"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-navy/80 hover:text-gold hover:bg-gold/10 block px-4 py-3 text-base font-medium rounded-xl transition-all duration-300"
                  >
                    {item.name}
                  </Link>
                )
              ))}
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-navy/80 hover:text-gold hover:bg-gold/10 block px-4 py-3 text-base font-medium rounded-xl transition-all duration-300"
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-navy/80 hover:text-gold hover:bg-gold/10 block px-4 py-3 text-base font-medium rounded-xl transition-all duration-300"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 block px-4 py-3 text-base font-medium rounded-xl w-full text-left transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-navy/80 hover:text-gold hover:bg-gold/10 block px-4 py-3 text-base font-medium rounded-xl transition-all duration-300"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
