const products = [
  {
    name: "Elegant Diamond Ring",
    description: "A handcrafted diamond ring featuring a brilliant solitaire set in 18K white gold.",
    price: 4999,
    discountPrice: 4499,
    countInStock: 5,
    sku: "SKU‑001",
    category: "rings",
    collections: "bridal",
    images: [
      { url: "https://images.pexels.com/photos/19703087/pexels-photo-19703087.jpeg?auto=compress&cs=tinysrgb&w=800", altText: "Elegant diamond ring close‑up" },
      { url: "https://images.unsplash.com/photo-1533158653423-0b51e308638f?auto=format&fit=crop&w=800&q=80", altText: "Diamond ring on velvet" }
    ],
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: "Royal Emerald Necklace",
    description: "A 22K gold necklace featuring deep green emeralds and traditional Kundan work.",
    price: 11999,
    discountPrice: 10499,
    countInStock: 3,
    sku: "SKU‑002",
    category: "necklaces",
    collections: "royal",
    images: [
      { url: "https://images.unsplash.com/photo-1579338559534-709307b1ce5f?auto=format&fit=crop&w=800&q=80", altText: "Emerald necklace on model" },
      { url: "https://images.pexels.com/photos/168900/necklace-necklace-emerald-jewelry-168900.jpeg?auto=compress&cs=tinysrgb&w=800", altText: "Green gemstone necklace" }
    ],
    rating: 4.8,
    numReviews: 9,
  },
  {
    name: "Classic Gold Bangles Set",
    description: "A pair of traditional 22K gold bangles with floral carvings and smooth finish.",
    price: 6999,
    discountPrice: 6499,
    countInStock: 10,
    sku: "SKU‑003",
    category: "bangles",
    collections: "classic",
    images: [
      { url: "https://images.unsplash.com/photo-1614289940282-c7901e942773?auto=format&fit=crop&w=800&q=80", altText: "Traditional gold bangles" },
      { url: "https://images.pexels.com/photos/3769810/pexels-photo-3769810.jpeg?auto=compress&cs=tinysrgb&w=800", altText: "Floral carved gold bangle" }
    ],
    rating: 4.2,
    numReviews: 7,
  },
  {
    name: "Minimal Diamond Studs",
    description: "Elegant minimal diamond stud earrings for daily wear.",
    price: 2999,
    discountPrice: 2499,
    countInStock: 12,
    sku: "SKU‑004",
    category: "earrings",
    collections: "daily",
    images: [
      { url: "https://images.pexels.com/photos/1552591/pexels-photo-1552591.jpeg?auto=compress&cs=tinysrgb&w=800", altText: "Diamond stud earrings" }
    ],
    rating: 4.4,
    numReviews: 10,
  },
  {
    name: "Ruby Bridal Necklace",
    description: "Rich bridal necklace studded with rubies and pearls, perfect for wedding wear.",
    price: 12999,
    discountPrice: 11799,
    countInStock: 2,
    sku: "SKU‑005",
    category: "necklaces",
    collections: "bridal",
    images: [
      { url: "https://images.unsplash.com/photo-1586816005767-09369fbb33a2?auto=format&fit=crop&w=800&q=80", altText: "Ruby bridal necklace" }
    ],
    rating: 4.7,
    numReviews: 14,
  },
  {
    name: "Men's Gold Chain",
    description: "Bold 24K gold chain for men with heavy links and premium polish.",
    price: 9999,
    discountPrice: 9499,
    countInStock: 6,
    sku: "SKU‑006",
    category: "chains",
    collections: "mens",
    images: [
      { url: "https://images.pexels.com/photos/353261/pexels-photo-353261.jpeg?auto=compress&cs=tinysrgb&w=800", altText: "Bold gold chain" }
    ],
    rating: 4.3,
    numReviews: 8,
  },
  {
    name: "Kundan Pearl Maang Tikka",
    description: "Traditional Indian maang tikka with pearl drops and Kundan embellishments.",
    price: 1999,
    discountPrice: 1799,
    countInStock: 10,
    sku: "SKU‑007",
    category: "tikka",
    collections: "traditional",
    images: [
      { url: "https://images.unsplash.com/photo-1624321912928-7c5cca11dbf6?auto=format&fit=crop&w=800&q=80", altText: "Pearl maang tikka" }
    ],
    rating: 4.1,
    numReviews: 5,
  },
  {
    name: "Silver Oxidized Jhumkas",
    description: "Boho style oxidized silver jhumka earrings with intricate design.",
    price: 1299,
    discountPrice: 1099,
    countInStock: 15,
    sku: "SKU‑008",
    category: "earrings",
    collections: "boho",
    images: [
      { url: "https://images.unsplash.com/photo-1580544857538-e91b699287a7?auto=format&fit=crop&w=800&q=80", altText: "Oxidized silver jhumkas" }
    ],
    rating: 4.0,
    numReviews: 6,
  },
  {
    name: "Designer Anklet Set",
    description: "Double-layer anklet set with ghungroos and mirror work.",
    price: 999,
    discountPrice: 849,
    countInStock: 14,
    sku: "SKU‑009",
    category: "anklets",
    collections: "boho",
    images: [
      { url: "https://images.pexels.com/photos/3769091/pexels-photo-3769091.jpeg?auto=compress&cs=tinysrgb&w=800", altText: "Ghungroo anklet set" }
    ],
    rating: 4.2,
    numReviews: 7,
  },
  {
    name: "Choker with Meenakari",
    description: "Colorful meenakari choker with tiny hanging pearls and intricate art.",
    price: 4799,
    discountPrice: 4299,
    countInStock: 3,
    sku: "SKU‑010",
    category: "necklaces",
    collections: "festive",
    images: [
      { url: "https://images.unsplash.com/photo-1592503252208-6c9d3f0eecf0?auto=format&fit=crop&w=800&q=80", altText: "Meenakari choker with pearls" }
    ],
    rating: 4.6,
    numReviews: 11,
  },
  {
    name: "Diamond Engagement Ring",
    description: "A beautiful engagement ring with a solitaire diamond and white gold band.",
    price: 7999,
    discountPrice: 7499,
    countInStock: 4,
    sku: "SKU‑011",
    category: "rings",
    collections: "engagement",
    images: [
      { url: "https://images.pexels.com/photos/325152/pexels-photo-325152.jpeg?auto=compress&cs=tinysrgb&w=800", altText: "Diamond solitaire engagement ring" }
    ],
    rating: 4.9,
    numReviews: 15,
  },
  {
    name: "Temple Jewelry Necklace",
    description: "Traditional temple jewelry with Lakshmi motifs and red stones.",
    price: 8999,
    discountPrice: 8599,
    countInStock: 5,
    sku: "SKU‑012",
    category: "necklaces",
    collections: "heritage",
    images: [
      { url: "https://images.unsplash.com/photo-1605633516700-30462b976d5b?auto=format&fit=crop&w=800&q=80", altText: "Temple style necklace" }
    ],
    rating: 4.5,
    numReviews: 9,
  },
  {
    name: "American Diamond Bracelet",
    description: "A dainty partywear bracelet with American diamond studs and silver finish.",
    price: 2599,
    discountPrice: 2299,
    countInStock: 6,
    sku: "SKU‑013",
    category: "bracelets",
    collections: "partywear",
    images: [
      { url: "https://images.unsplash.com/photo-1585325702735-3d1f250454ba?auto=format&fit=crop&w=800&q=80", altText: "American diamond bracelet" }
    ],
    rating: 4.4,
    numReviews: 8,
  },
  {
    name: "Rose Gold Mangalsutra",
    description: "Modern short mangalsutra in rose gold plating with minimal pendant.",
    price: 3499,
    discountPrice: 3199,
    countInStock: 7,
    sku: "SKU‑014",
    category: "mangalsutras",
    collections: "modern",
    images: [
      { url: "https://images.unsplash.com/photo-1585238342025-5486d83e7ad0?auto=format&fit=crop&w=800&q=80", altText: "Rose gold mangalsutra" }
    ],
    rating: 4.6,
    numReviews: 13,
  },
  {
    name: "Delicate Toe Ring Set",
    description: "Adjustable silver plated toe rings with engraved lines.",
    price: 599,
    discountPrice: 499,
    countInStock: 18,
    sku: "SKU‑015",
    category: "toe-rings",
    collections: "daily",
    images: [
      { url: "https://images.unsplash.com/photo-1587899890842-2d5b3b785d8b?auto=format&fit=crop&w=800&q=80", altText: "Silver toe ring set" }
    ],
    rating: 4.0,
    numReviews: 4,
  },
  {
    name: "Pearl Bridal Set",
    description: "Pearl and CZ stone bridal jewelry set with necklace, earrings, and maang tikka.",
    price: 8999,
    discountPrice: 8299,
    countInStock: 2,
    sku: "SKU‑016",
    category: "sets",
    collections: "bridal",
    images: [
      { url: "https://images.pexels.com/photos/19163591/pexels-photo-19163591.jpeg?auto=compress&cs=tinysrgb&w=800", altText: "Pearl bridal jewelry set" }
    ],
    rating: 4.7,
    numReviews: 12,
  },
  {
    name: "Layered Beaded Necklace",
    description: "Boho-inspired layered necklace with colorful beads and antique finish.",
    price: 1999,
    discountPrice: 1799,
    countInStock: 8,
    sku: "SKU‑017",
    category: "necklaces",
    collections: "boho",
    images: [
      { url: "https://images.unsplash.com/photo-1565075494819-02f8cb2b0795?auto=format&fit=crop&w=800&q=80", altText: "Layered beaded necklace" }
    ],
    rating: 4.1,
    numReviews: 6,
  },
  {
    name: "Antique Kundan Choker",
    description: "Heavy Kundan choker necklace with pearls and red enamel.",
    price: 6499,
    discountPrice: 5999,
    countInStock: 3,
    sku: "SKU‑018",
    category: "necklaces",
    collections: "heritage",
    images: [
      { url: "https://images.unsplash.com/photo-1578569109106-1e46f9023c21?auto=format&fit=crop&w=800&q=80", altText: "Antique Kundan choker" }
    ],
    rating: 4.5,
    numReviews: 9,
  },
  {
    name: "Cubic Zirconia Nosepin",
    description: "Tiny CZ nosepin in silver, perfect for subtle sparkle.",
    price: 499,
    discountPrice: 449,
    countInStock: 20,
    sku: "SKU‑019",
    category: "nosepins",
    collections: "daily",
    images: [
      { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", altText: "Cubic zirconia nosepin" }
    ],
    rating: 4.0,
    numReviews: 3,
  },
  {
    name: "Gold Plated Hoop Earrings",
    description: "Classic medium-sized hoops with gold plating and smooth edges.",
    price: 1299,
    discountPrice: 1099,
    countInStock: 9,
    sku: "SKU‑020",
    category: "earrings",
    collections: "classic",
    images: [
      { url: "https://images.unsplash.com/photo-1546026213-17be790f4a15?auto=format&fit=crop&w=800&q=80", altText: "Gold plated hoop earrings" }
    ],
    rating: 4.3,
    numReviews: 5,
  },
];

module.exports = products;
