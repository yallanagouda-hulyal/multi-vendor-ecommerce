require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");

const products = [
  // =========================
  // ELECTRONICS - 10
  // =========================
  {
    name: "Smartphone",
    description: "Modern smartphone with powerful performance and a high-quality display.",
    price: 18999,
    sku: "ELEC-PHONE-001",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 25,
  },
  {
    name: "Laptop",
    description: "Powerful laptop suitable for work, study and entertainment.",
    price: 54999,
    sku: "ELEC-LAPTOP-001",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 12,
  },
  {
    name: "Smart TV",
    description: "Large smart television with vibrant picture quality.",
    price: 32999,
    sku: "ELEC-TV-001",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 8,
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable wireless speaker with clear and powerful sound.",
    price: 2499,
    sku: "ELEC-SPK-001",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 20,
  },
  {
    name: "Wireless Keyboard",
    description: "Comfortable wireless keyboard for office and home use.",
    price: 1299,
    sku: "ELEC-KEY-001",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 30,
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with smooth tracking.",
    price: 799,
    sku: "ELEC-MOUSE-001",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 35,
  },
  {
    name: "Power Bank",
    description: "Portable power bank with high-capacity battery.",
    price: 1499,
    sku: "ELEC-POWER-001",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1609592424845-8b0c9e9f4e93?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 25,
  },
  {
    name: "Tablet",
    description: "Lightweight tablet for entertainment, study and everyday tasks.",
    price: 21999,
    sku: "ELEC-TAB-001",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 15,
  },
  {
    name: "Digital Camera",
    description: "Digital camera for capturing high-quality photos and videos.",
    price: 28999,
    sku: "ELEC-CAM-001",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 7,
  },

  // =========================
  // CLOTHING - 10
  // =========================
  {
    name: "Men's Casual T-Shirt",
    description: "Comfortable cotton casual t-shirt for everyday wear.",
    price: 799,
    sku: "CLOTH-TSHIRT-001",
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 40,
  },
  {
    name: "Women's T-Shirt",
    description: "Soft and comfortable women's casual t-shirt.",
    price: 699,
    sku: "CLOTH-TSHIRT-002",
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 35,
  },
  {
    name: "Men's Hoodie",
    description: "Warm and stylish hoodie for casual occasions.",
    price: 1299,
    sku: "CLOTH-HOODIE-001",
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 25,
  },
  {
    name: "Women's Hoodie",
    description: "Comfortable everyday hoodie with a modern fit.",
    price: 1399,
    sku: "CLOTH-HOODIE-002",
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 25,
  },
  {
    name: "Denim Jacket",
    description: "Classic denim jacket suitable for casual outfits.",
    price: 2199,
    sku: "CLOTH-JACKET-001",
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 18,
  },
  {
    name: "Casual Shirt",
    description: "Stylish casual shirt made for comfortable everyday wear.",
    price: 1199,
    sku: "CLOTH-SHIRT-001",
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 30,
  },
  {
    name: "Classic Blue Jeans",
    description: "Comfortable regular-fit blue jeans.",
    price: 1699,
    sku: "CLOTH-JEANS-001",
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 28,
  },
  {
    name: "Cotton Kurta",
    description: "Traditional cotton kurta with a comfortable fit.",
    price: 999,
    sku: "CLOTH-KURTA-001",
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 20,
  },
  {
    name: "Summer Dress",
    description: "Lightweight summer dress with a stylish design.",
    price: 1499,
    sku: "CLOTH-DRESS-001",
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 22,
  },
  {
    name: "Sports T-Shirt",
    description: "Breathable sports t-shirt for workouts and outdoor activities.",
    price: 899,
    sku: "CLOTH-SPORT-001",
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 30,
  },

  // =========================
  // SHOES - 9 MORE
  // =========================
  {
    name: "Casual Sneakers",
    description: "Comfortable sneakers for everyday casual use.",
    price: 1799,
    sku: "SHOE-SNEAKER-001",
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 25,
  },
  {
    name: "Sports Shoes",
    description: "Lightweight sports shoes designed for active lifestyles.",
    price: 2299,
    sku: "SHOE-SPORT-001",
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 20,
  },
  {
    name: "Men's Running Shoes",
    description: "Lightweight running shoes with comfortable cushioning.",
    price: 2499,
    sku: "SHOE-RUN-001",
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 22,
  },
  {
    name: "Women's Running Shoes",
    description: "Comfortable running shoes designed for women.",
    price: 2399,
    sku: "SHOE-RUN-002",
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 18,
  },
  {
    name: "Walking Shoes",
    description: "Comfortable walking shoes for everyday activities.",
    price: 1599,
    sku: "SHOE-WALK-001",
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 20,
  },
  {
    name: "Formal Shoes",
    description: "Classic formal shoes for office and special occasions.",
    price: 2199,
    sku: "SHOE-FORMAL-001",
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 15,
  },
  {
    name: "Loafers",
    description: "Stylish and comfortable loafers for casual and formal wear.",
    price: 1899,
    sku: "SHOE-LOAFER-001",
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 18,
  },
  {
    name: "Basketball Shoes",
    description: "High-performance basketball shoes with strong grip.",
    price: 3299,
    sku: "SHOE-BASKET-001",
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 12,
  },
  {
    name: "Hiking Shoes",
    description: "Durable hiking shoes designed for outdoor adventures.",
    price: 2799,
    sku: "SHOE-HIKE-001",
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 14,
  },

  // =========================
  // BAGS - 10
  // =========================
  {
    name: "Leather Backpack",
    description: "Premium leather backpack for work and travel.",
    price: 2499,
    sku: "BAG-LEATHER-001",
    category: "Bags",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 18,
  },
  {
    name: "Laptop Backpack",
    description: "Spacious backpack with a dedicated laptop compartment.",
    price: 1699,
    sku: "BAG-LAPTOP-001",
    category: "Bags",
    images: [
      "https://images.unsplash.com/photo-1556306535-38febf6782e7?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 25,
  },
  {
    name: "Travel Bag",
    description: "Large travel bag with multiple storage compartments.",
    price: 1999,
    sku: "BAG-TRAVEL-001",
    category: "Bags",
    images: [
      "https://images.unsplash.com/photo-1553531384-397c80973a0b?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 15,
  },
  {
    name: "College Backpack",
    description: "Durable backpack suitable for college and everyday use.",
    price: 1199,
    sku: "BAG-COLLEGE-001",
    category: "Bags",
    images: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 30,
  },
  {
    name: "Women's Handbag",
    description: "Elegant handbag suitable for everyday use.",
    price: 1899,
    sku: "BAG-HAND-001",
    category: "Bags",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 20,
  },
  {
    name: "Crossbody Bag",
    description: "Compact crossbody bag for everyday essentials.",
    price: 1299,
    sku: "BAG-CROSS-001",
    category: "Bags",
    images: [
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 22,
  },
  {
    name: "Duffel Bag",
    description: "Spacious duffel bag for gym and short trips.",
    price: 1499,
    sku: "BAG-DUFFEL-001",
    category: "Bags",
    images: [
      "https://images.unsplash.com/photo-1554342872-034a06541bad?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 20,
  },
  {
    name: "Sling Bag",
    description: "Compact sling bag for everyday travel.",
    price: 899,
    sku: "BAG-SLING-001",
    category: "Bags",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 25,
  },
  {
    name: "Camera Bag",
    description: "Protective camera bag with organized compartments.",
    price: 2199,
    sku: "BAG-CAMERA-001",
    category: "Bags",
    images: [
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 12,
  },
  {
    name: "Messenger Bag",
    description: "Classic messenger bag for work and daily use.",
    price: 1599,
    sku: "BAG-MESSENGER-001",
    category: "Bags",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 18,
  },

  // =========================
  // WATCHES - 10
  // =========================
  {
    name: "Classic Analog Watch",
    description: "Elegant analog watch with a classic design.",
    price: 2499,
    sku: "WATCH-ANALOG-001",
    category: "Watches",
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 15,
  },
  {
    name: "Smart Watch",
    description: "Smart watch with fitness and activity tracking features.",
    price: 2999,
    sku: "WATCH-SMART-001",
    category: "Watches",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 20,
  },
  {
    name: "Sports Watch",
    description: "Sporty watch designed for active lifestyles.",
    price: 1799,
    sku: "WATCH-SPORT-001",
    category: "Watches",
    images: [
      "https://images.unsplash.com/photo-1526743171373-0f1e2e5b3c49?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 18,
  },
  {
    name: "Digital Watch",
    description: "Modern digital watch with a clear display.",
    price: 999,
    sku: "WATCH-DIGITAL-001",
    category: "Watches",
    images: [
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 25,
  },
  {
    name: "Luxury Watch",
    description: "Premium luxury watch with an elegant finish.",
    price: 8999,
    sku: "WATCH-LUXURY-001",
    category: "Watches",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 8,
  },
  {
    name: "Men's Analog Watch",
    description: "Classic men's watch suitable for everyday wear.",
    price: 1999,
    sku: "WATCH-MEN-001",
    category: "Watches",
    images: [
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 16,
  },
  {
    name: "Women's Watch",
    description: "Elegant women's watch with a stylish design.",
    price: 2199,
    sku: "WATCH-WOMEN-001",
    category: "Watches",
    images: [
      "https://images.unsplash.com/photo-1526045431048-f857369baa09?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 18,
  },
  {
    name: "Fitness Watch",
    description: "Fitness watch for tracking daily activities and workouts.",
    price: 3499,
    sku: "WATCH-FITNESS-001",
    category: "Watches",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 14,
  },
  {
    name: "Chronograph Watch",
    description: "Stylish chronograph watch with a detailed dial.",
    price: 3999,
    sku: "WATCH-CHRONO-001",
    category: "Watches",
    images: [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 12,
  },
  {
    name: "Minimalist Watch",
    description: "Minimalist watch with a clean modern design.",
    price: 1599,
    sku: "WATCH-MINIMAL-001",
    category: "Watches",
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 20,
  },

  // =========================
  // HOME & KITCHEN - 10
  // =========================
  {
    name: "Coffee Maker",
    description: "Easy-to-use coffee maker for delicious coffee at home.",
    price: 2499,
    sku: "HOME-COFFEE-001",
    category: "Home & Kitchen",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 15,
  },
  {
    name: "Electric Kettle",
    description: "Fast-boiling electric kettle for tea and coffee.",
    price: 999,
    sku: "HOME-KETTLE-001",
    category: "Home & Kitchen",
    images: [
      "https://images.unsplash.com/photo-1594213114663-d94db9b171b0?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 25,
  },
  {
    name: "Air Fryer",
    description: "Modern air fryer for healthier cooking with less oil.",
    price: 3999,
    sku: "HOME-AIRFRY-001",
    category: "Home & Kitchen",
    images: [
      "https://images.unsplash.com/photo-1648146299041-9a5c1e7d8a0c?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 12,
  },
  {
    name: "Mixer Grinder",
    description: "Powerful mixer grinder for everyday kitchen use.",
    price: 2799,
    sku: "HOME-MIXER-001",
    category: "Home & Kitchen",
    images: [
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 15,
  },
  {
    name: "Cookware Set",
    description: "Complete cookware set for everyday cooking.",
    price: 3499,
    sku: "HOME-COOK-001",
    category: "Home & Kitchen",
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 10,
  },
  {
    name: "Dinner Set",
    description: "Elegant dinner set for family meals and occasions.",
    price: 1899,
    sku: "HOME-DINNER-001",
    category: "Home & Kitchen",
    images: [
      "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 15,
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Durable stainless steel water bottle for everyday use.",
    price: 699,
    sku: "HOME-BOTTLE-001",
    category: "Home & Kitchen",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 35,
  },
  {
    name: "Storage Container Set",
    description: "Food storage containers for an organized kitchen.",
    price: 899,
    sku: "HOME-STORAGE-001",
    category: "Home & Kitchen",
    images: [
      "https://images.unsplash.com/photo-1584990347449-a3f66f3d0e4b?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 20,
  },
  {
    name: "Table Lamp",
    description: "Modern table lamp for bedroom, office and study.",
    price: 1299,
    sku: "HOME-LAMP-001",
    category: "Home & Kitchen",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 18,
  },
  {
    name: "Kitchen Organizer",
    description: "Practical organizer for keeping your kitchen items tidy.",
    price: 799,
    sku: "HOME-ORGANIZER-001",
    category: "Home & Kitchen",
    images: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
    ],
    stock: 25,
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const seller = await User.findOne({
      role: "seller",
      sellerApproved: true,
    });

    if (!seller) {
      throw new Error(
        "No approved seller found. Create/approve a seller first."
      );
    }

    let added = 0;
    let skipped = 0;

    for (const product of products) {
      const existing = await Product.findOne({
        sku: product.sku,
      });

      if (existing) {
        skipped++;
        continue;
      }

      await Product.create({
        ...product,
        seller: seller._id,
        rating: 0,
        reviewCount: 0,
        isPublished: true,
        isAvailable: true,
      });

      added++;
      console.log(`Added: ${product.name}`);
    }

    console.log("");
    console.log(`Products added: ${added}`);
    console.log(`Products skipped: ${skipped}`);
    console.log("Shopping product seeding completed.");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed error:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedProducts();