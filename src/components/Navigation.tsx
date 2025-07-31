
import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, LogOut } from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      { name: 'Products', href: '/products', type: 'link' },
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
    ? 'bg-white/95 backdrop-blur-lg shadow-lg border border-white/20' 
    : 'bg-white/90 backdrop-blur-md shadow-md border border-white/30';

  return (
    <nav className={`fixed top-0 w-full z-50 ${isMobile ? 'px-2 pt-2' : 'px-4 pt-4'}`}>
      <div className={`max-w-6xl mx-auto transition-all duration-300 ${navbarClasses} ${isMobile ? 'rounded-xl' : 'rounded-2xl'}`}>
        <div className={`flex justify-between items-center ${isMobile ? 'h-14 px-4' : 'h-16 px-6'}`}>
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              onClick={handleLogoClick}
              className={`${isMobile ? 'text-xl' : 'text-2xl'} font-playfair font-bold text-navy hover:text-gold transition-colors duration-300`}
            >
              Zaffira
            </Link>
          </div>

          {!isMobile && (
            <div className="hidden md:block">
              <div className="flex items-center space-1">
                {navItems.map((item) => (
                  item.type === 'scroll' ? (
                    <button
                      key={item.name}
                      onClick={() => handleScrollToSection(item.href)}
                      className="text-navy/80 hover:text-gold hover:bg-gold/10 px-4 py-2 text-sm font-medium relative group cursor-pointer rounded-lg transition-all duration-300"
                    >
                      {item.name}
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gold group-hover:w-6 transition-all duration-300"></span>
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-navy/80 hover:text-gold hover:bg-gold/10 px-4 py-2 text-sm font-medium relative group rounded-lg transition-all duration-300"
                    >
                      {item.name}
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gold group-hover:w-6 transition-all duration-300"></span>
                    </Link>
                  )
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <Link 
                  to="/cart"
                  className={`text-navy/80 hover:text-gold hover:bg-gold/10 relative ${isMobile ? 'p-2.5' : 'p-2'} rounded-lg group transition-all duration-300`}
                >
                  <ShoppingBag className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
                  {itemCount > 0 && (
                    <span className={`absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full ${isMobile ? 'h-6 w-6' : 'h-5 w-5'} flex items-center justify-center font-semibold shadow-sm`}>
                      {itemCount}
                    </span>
                  )}
                </Link>

                {!isMobile && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gold/10 text-navy font-semibold text-sm">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          {(profile?.name || user?.name) && (
                            <p className="font-medium text-sm">{profile?.name || user?.name}</p>
                          )}
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="cursor-pointer">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="cursor-pointer">
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
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
                  className={`text-navy/80 hover:text-gold hover:bg-gold/10 relative ${isMobile ? 'p-2.5' : 'p-2'} rounded-lg group transition-all duration-300`}
                >
                  <User className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
                </Link>

                <Link 
                  to="/cart"
                  className={`text-navy/80 hover:text-gold hover:bg-gold/10 relative ${isMobile ? 'p-2.5' : 'p-2'} rounded-lg group transition-all duration-300`}
                >
                  <ShoppingBag className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
                  {itemCount > 0 && (
                    <span className={`absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full ${isMobile ? 'h-6 w-6' : 'h-5 w-5'} flex items-center justify-center font-semibold shadow-sm`}>
                      {itemCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`text-navy/80 hover:text-gold hover:bg-gold/10 ${isMobile ? 'p-2.5' : 'p-2'} rounded-lg transition-all duration-300`}
              >
                {isMenuOpen ? <X className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} /> : <Menu className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                item.type === 'scroll' ? (
                  <button
                    key={item.name}
                    onClick={() => handleScrollToSection(item.href)}
                    className="text-navy/80 hover:text-gold hover:bg-gold/10 block px-4 py-3 text-base font-medium cursor-pointer rounded-lg w-full text-left transition-all duration-300"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-navy/80 hover:text-gold hover:bg-gold/10 block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300"
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
                    className="text-navy/80 hover:text-gold hover:bg-gold/10 block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300"
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-navy/80 hover:text-gold hover:bg-gold/10 block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="text-navy/80 hover:text-gold hover:bg-gold/10 block px-4 py-3 text-base font-medium rounded-lg w-full text-left transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-navy/80 hover:text-gold hover:bg-gold/10 block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300"
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
