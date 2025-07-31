
import { Product } from '@/types/product';

export const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Eternal Elegance Diamond Ring",
    price: 45000,
    images: [
      { url: "/placeholder.svg", alt: "Diamond Ring", isPrimary: true },
      { url: "/placeholder.svg", alt: "Diamond Ring Side View", isPrimary: false }
    ],
    category: "rings",
    description: "A stunning diamond ring featuring a brilliant cut diamond set in 18k white gold. Perfect for engagements or special occasions.",
    popularity: 95,
    isNew: true,
    stockQuantity: 12,
    inStock: true
  },
  {
    id: "2",
    name: "Royal Sapphire Necklace",
    price: 85000,
    images: [
      { url: "/placeholder.svg", alt: "Sapphire Necklace", isPrimary: true },
      { url: "/placeholder.svg", alt: "Sapphire Necklace Detail", isPrimary: false }
    ],
    category: "necklaces",
    description: "An exquisite sapphire necklace with matching diamonds in a vintage-inspired setting.",
    popularity: 88,
    isNew: false,
    stockQuantity: 5,
    inStock: true
  },
  {
    id: "3",
    name: "Golden Pearl Earrings",
    price: 25000,
    images: [
      { url: "/placeholder.svg", alt: "Pearl Earrings", isPrimary: true }
    ],
    category: "earrings",
    description: "Classic pearl earrings with gold accents, perfect for everyday elegance.",
    popularity: 76,
    isNew: false,
    stockQuantity: 20,
    inStock: true
  },
  {
    id: "4",
    name: "Vintage Rose Gold Bracelet",
    price: 35000,
    images: [
      { url: "/placeholder.svg", alt: "Rose Gold Bracelet", isPrimary: true }
    ],
    category: "bracelets",
    description: "A beautiful vintage-style bracelet crafted in rose gold with intricate detailing.",
    popularity: 82,
    isNew: true,
    stockQuantity: 8,
    inStock: true
  },
  {
    id: "5",
    name: "Classic Diamond Studs",
    price: 32000,
    images: [
      { url: "/placeholder.svg", alt: "Diamond Studs", isPrimary: true }
    ],
    category: "earrings",
    description: "Timeless diamond stud earrings, perfect for any occasion.",
    popularity: 90,
    isNew: false,
    stockQuantity: 15,
    inStock: true
  },
  {
    id: "6",
    name: "Emerald Statement Ring",
    price: 65000,
    images: [
      { url: "/placeholder.svg", alt: "Emerald Ring", isPrimary: true }
    ],
    category: "rings",
    description: "A bold emerald ring surrounded by diamonds in a modern setting.",
    popularity: 78,
    isNew: true,
    stockQuantity: 3,
    inStock: true
  },
  {
    id: "7",
    name: "Tennis Diamond Bracelet",
    price: 95000,
    images: [
      { url: "/placeholder.svg", alt: "Tennis Bracelet", isPrimary: true }
    ],
    category: "bracelets",
    description: "A classic tennis bracelet featuring brilliant cut diamonds.",
    popularity: 92,
    isNew: false,
    stockQuantity: 6,
    inStock: true
  },
  {
    id: "8",
    name: "Art Deco Pendant Necklace",
    price: 55000,
    images: [
      { url: "/placeholder.svg", alt: "Art Deco Necklace", isPrimary: true }
    ],
    category: "necklaces",
    description: "An Art Deco inspired pendant necklace with geometric patterns and diamonds.",
    popularity: 85,
    isNew: false,
    stockQuantity: 4,
    inStock: true
  }
];

export const featuredProducts = dummyProducts.slice(0, 3);

export const dummyUser = {
  id: "user-1",
  email: "demo@example.com"
};

export const dummyProfile = {
  id: "user-1",
  first_name: "Demo",
  last_name: "User",
  username: "demouser",
  email: "demo@example.com",
  phone: "+91 98765 43210",
  is_admin: false
};

export const dummyAdminProfile = {
  id: "admin-1",
  first_name: "Admin",
  last_name: "User",
  username: "admin",
  email: "admin@example.com",
  phone: "+91 98765 43211",
  is_admin: true
};

export const dummyAppointments = [
  {
    id: "apt-1",
    appointment_date: "2024-01-15T10:00:00Z",
    customer_name: "Demo User",
    customer_email: "demo@example.com",
    customer_phone: "+91 98765 43210",
    notes: "Looking for engagement ring options",
    cart_items: [
      {
        id: "1",
        name: "Eternal Elegance Diamond Ring",
        image: "/placeholder.svg",
        price: 45000,
        quantity: 1
      }
    ],
    total_amount: 45000,
    status: "pending",
    created_at: "2024-01-10T08:00:00Z"
  },
  {
    id: "apt-2",
    appointment_date: "2024-01-20T14:30:00Z",
    customer_name: "Demo User",
    customer_email: "demo@example.com",
    customer_phone: "+91 98765 43210",
    notes: "Custom necklace design consultation",
    cart_items: [
      {
        id: "2",
        name: "Royal Sapphire Necklace",
        image: "/placeholder.svg",
        price: 85000,
        quantity: 1
      }
    ],
    total_amount: 85000,
    status: "confirmed",
    created_at: "2024-01-12T10:30:00Z"
  }
];
