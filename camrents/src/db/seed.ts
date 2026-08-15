import { db } from "./index";
import { productModels, inventoryItems, authUser, bookings, authAccount, authSession } from "./schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { auth } from "../lib/auth";

const products = [
  // ── SONY SYSTEM (E MOUNT) ──
  {
    brand: "Sony",
    model: "A7III",
    category: "camera_body" as const,
    slug: "sony-a7iii",
    dailyRateCents: 120000,
    weeklyRateCents: 600000,
    depositCents: 1500000,
    description: "Full-frame mirrorless. Extremely popular wedding camera in Kerala with excellent low-light performance. Best for: Wedding photography, events, portraits.",
    specs: { mount: "Sony E", megapixels: "24.2", sensor: "Full Frame CMOS", bestFor: "Weddings & Events", isoRange: "100-51200" },
    condition: "excellent",
    totalQuantity: 3,
  },
  {
    brand: "Sony",
    model: "A7IV",
    category: "camera_body" as const,
    slug: "sony-a7iv",
    dailyRateCents: 150000,
    weeklyRateCents: 750000,
    depositCents: 2000000,
    description: "The hybrid king. Great photos and serious video capability, popular among content creators. Best for: Hybrid photo/video, content creation, YouTube.",
    specs: { mount: "Sony E", megapixels: "33", sensor: "Full Frame CMOS", bestFor: "Content Creation", videoMax: "4K 60fps" },
    condition: "excellent",
    totalQuantity: 3,
  },
  {
    brand: "Sony",
    model: "FX3",
    category: "camera_body" as const,
    slug: "sony-fx3",
    dailyRateCents: 250000,
    weeklyRateCents: 1200000,
    depositCents: 3000000,
    description: "Cinema Line camera body with outstanding low-light sensitivity, compact cage-free design, and XLR handle. Best for: Cinema, wedding films, music videos.",
    specs: { mount: "Sony E", megapixels: "12.1", sensor: "Full Frame Exmor R", bestFor: "Cinematography", isoRange: "80-409600" },
    condition: "excellent",
    totalQuantity: 2,
  },
  {
    brand: "Sony",
    model: "A7R V",
    category: "camera_body" as const,
    slug: "sony-a7rv",
    dailyRateCents: 220000,
    weeklyRateCents: 1100000,
    depositCents: 2500000,
    description: "High-resolution full-frame mirrorless featuring a 61MP sensor and advanced AI-based autofocus. Best for: Studio, product, and landscape photography.",
    specs: { mount: "Sony E", megapixels: "61", sensor: "Full Frame BSI-CMOS", bestFor: "Studio & Landscape" },
    condition: "excellent",
    totalQuantity: 2,
  },
  {
    brand: "Sony",
    model: "FE 24-70mm f/2.8 GM II",
    category: "lens" as const,
    slug: "sony-24-70-f2p8-gm2",
    dailyRateCents: 80000,
    weeklyRateCents: 400000,
    depositCents: 1000000,
    description: "The ultimate standard zoom lens. Extremely sharp, lightweight G Master standard zoom. Best for: Weddings, events, everyday professional use.",
    specs: { mount: "Sony E", focalLength: "24-70mm", aperture: "f/2.8", bestFor: "Standard Zoom" },
    condition: "excellent",
    totalQuantity: 3,
  },
  {
    brand: "Sony",
    model: "FE 70-200mm f/2.8 GM OSS II",
    category: "lens" as const,
    slug: "sony-70-200-f2p8-gm2",
    dailyRateCents: 100000,
    weeklyRateCents: 500000,
    depositCents: 1200000,
    description: "Incredible telephoto zoom lens. Lightweight with lightning-fast AF and superior image stabilization. Best for: Sports, wildlife, portraits from distance.",
    specs: { mount: "Sony E", focalLength: "70-200mm", aperture: "f/2.8", bestFor: "Telephoto & Sports" },
    condition: "excellent",
    totalQuantity: 2,
  },
  {
    brand: "Sony",
    model: "FE 50mm f/1.2 GM",
    category: "lens" as const,
    slug: "sony-50-f1p2-gm",
    dailyRateCents: 70000,
    weeklyRateCents: 350000,
    depositCents: 800000,
    description: "Ultra-fast prime lens. Delivers stunning resolution, contrast, and gorgeous bokeh. Best for: Portraits, low-light, creative photography.",
    specs: { mount: "Sony E", focalLength: "50mm", aperture: "f/1.2", bestFor: "Portraits & Low-light" },
    condition: "excellent",
    totalQuantity: 2,
  },
  {
    brand: "Sony",
    model: "FE 85mm f/1.4 GM",
    category: "lens" as const,
    slug: "sony-85-f1p4-gm",
    dailyRateCents: 80000,
    weeklyRateCents: 400000,
    depositCents: 1000000,
    description: "The portrait master. Perfect combination of high resolution and smooth, beautiful bokeh. Best for: Professional portraits, fashion, headshots.",
    specs: { mount: "Sony E", focalLength: "85mm", aperture: "f/1.4", bestFor: "Portrait Photography" },
    condition: "excellent",
    totalQuantity: 2,
  },

  // ── CANON RF SYSTEM ──
  {
    brand: "Canon",
    model: "R5",
    category: "camera_body" as const,
    slug: "canon-r5",
    dailyRateCents: 200000,
    weeklyRateCents: 1000000,
    depositCents: 3000000,
    description: "Pro-level mirrorless with 8K video. For professional wedding and event photographers. Best for: High-end weddings, commercial shoots, 8K production.",
    specs: { mount: "RF", megapixels: "45", sensor: "Full Frame CMOS", bestFor: "Pro Hybrid Work" },
    condition: "excellent",
    totalQuantity: 2,
  },
  {
    brand: "Canon",
    model: "R6 Mark II",
    category: "camera_body" as const,
    slug: "canon-r6-m2",
    dailyRateCents: 160000,
    weeklyRateCents: 800000,
    depositCents: 2000000,
    description: "The ideal hybrid camera body. Blends high-speed continuous shooting and high-quality 4K video. Best for: Events, sports, general professional use.",
    specs: { mount: "RF", megapixels: "24.2", sensor: "Full Frame CMOS", bestFor: "Sports & Events" },
    condition: "excellent",
    totalQuantity: 3,
  },
  {
    brand: "Canon",
    model: "RF 24-70mm f/2.8L IS USM",
    category: "lens" as const,
    slug: "canon-rf-24-70-f2p8",
    dailyRateCents: 80000,
    weeklyRateCents: 400000,
    depositCents: 1000000,
    description: "The workhorse zoom. Sharp with a fast aperture, the most rented RF lens for weddings. Best for: Wedding coverage, events, documentary.",
    specs: { mount: "RF", focalLength: "24-70mm", aperture: "f/2.8", bestFor: "Standard Zoom" },
    condition: "excellent",
    totalQuantity: 3,
  },
  {
    brand: "Canon",
    model: "RF 70-200mm f/2.8L IS USM",
    category: "lens" as const,
    slug: "canon-rf-70-200-f2p8",
    dailyRateCents: 100000,
    weeklyRateCents: 500000,
    depositCents: 1200000,
    description: "Compact and lightweight telephoto zoom lens. Outstanding optical performance. Best for: Sports, wildlife, portrait ceremonies.",
    specs: { mount: "RF", focalLength: "70-200mm", aperture: "f/2.8", bestFor: "Telephoto Action" },
    condition: "excellent",
    totalQuantity: 2,
  },
  {
    brand: "Canon",
    model: "RF 50mm f/1.2L USM",
    category: "lens" as const,
    slug: "canon-rf-50-f1p2",
    dailyRateCents: 75000,
    weeklyRateCents: 375000,
    depositCents: 900000,
    description: "Ultimate standard prime lens. Astounding clarity and beautiful low-light separation. Best for: Portraits, low-light, artistic photography.",
    specs: { mount: "RF", focalLength: "50mm", aperture: "f/1.2", bestFor: "Creative Portraits" },
    condition: "excellent",
    totalQuantity: 2,
  },

  // ── CANON EF SYSTEM ──
  {
    brand: "Canon",
    model: "200D",
    category: "camera_body" as const,
    slug: "canon-200d",
    dailyRateCents: 40000,
    weeklyRateCents: 200000,
    depositCents: 500000,
    description: "Entry-level DSLR perfect for beginners. Great for weekend trips and hobby photography. Best for: Beginners, travel, family events.",
    specs: { mount: "EF/EF-S", megapixels: "24.2", sensor: "APS-C CMOS", bestFor: "Beginners & Travel" },
    condition: "good",
    totalQuantity: 4,
  },
  {
    brand: "Canon",
    model: "5D Mark IV",
    category: "camera_body" as const,
    slug: "canon-5d-m4",
    dailyRateCents: 100000,
    weeklyRateCents: 500000,
    depositCents: 1200000,
    description: "Legendary workhorse DSLR. Trusted by wedding photographers for rich colors and durability. Best for: Wedding photography, studio work.",
    specs: { mount: "EF/EF-S", megapixels: "30.4", sensor: "Full Frame CMOS", bestFor: "Professional Weddings" },
    condition: "good",
    totalQuantity: 3,
  },

  // ── NIKON Z SYSTEM ──
  {
    brand: "Nikon",
    model: "Z8",
    category: "camera_body" as const,
    slug: "nikon-z8",
    dailyRateCents: 180000,
    weeklyRateCents: 900000,
    depositCents: 2500000,
    description: "Nikon's flagship mirrorless. Powerful beast for wildlife and nature photography. Best for: Wildlife, sports, action, landscape.",
    specs: { mount: "Nikon Z", megapixels: "45.7", sensor: "Full Frame Stacked CMOS", bestFor: "Wildlife & Action" },
    condition: "excellent",
    totalQuantity: 2,
  },
  {
    brand: "Nikon",
    model: "Z6 II",
    category: "camera_body" as const,
    slug: "nikon-z6-m2",
    dailyRateCents: 120000,
    weeklyRateCents: 600000,
    depositCents: 1500000,
    description: "All-rounder mirrorless. Fast continuous shooting, great autofocus, and solid low-light. Best for: General professional photography, events.",
    specs: { mount: "Nikon Z", megapixels: "24.5", sensor: "Full Frame CMOS", bestFor: "Versatile Pro Use" },
    condition: "excellent",
    totalQuantity: 3,
  },
  {
    brand: "Nikon",
    model: "D850",
    category: "camera_body" as const,
    slug: "nikon-d850",
    dailyRateCents: 110000,
    weeklyRateCents: 550000,
    depositCents: 1500000,
    description: "The pinnacle of DSLR tech. 45.7MP high-resolution camera trusted by portrait and landscape pros. Best for: Landscape, studio, fine-art.",
    specs: { mount: "Nikon F", megapixels: "45.7", sensor: "Full Frame BSI-CMOS", bestFor: "Landscape & Studio" },
    condition: "good",
    totalQuantity: 2,
  },

  // ── FUJIFILM SYSTEM ──
  {
    brand: "Fujifilm",
    model: "X-T5",
    category: "camera_body" as const,
    slug: "fujifilm-x-t5",
    dailyRateCents: 100000,
    weeklyRateCents: 500000,
    depositCents: 1200000,
    description: "Photocentric APS-C mirrorless with classic dial controls and film simulations. Best for: Street photography, travel, portrait.",
    specs: { mount: "Fujifilm X", megapixels: "40.2", sensor: "APS-C X-Trans BSI CMOS", bestFor: "Street & Travel" },
    condition: "excellent",
    totalQuantity: 2,
  },

  // ── ACCESSORIES ──
  {
    brand: "DJI",
    model: "RS3",
    category: "accessory" as const,
    slug: "dji-rs3",
    dailyRateCents: 50000,
    weeklyRateCents: 250000,
    depositCents: 800000,
    description: "3-axis gimbal stabilizer. Essential for smooth video in weddings, events, and films. Best for: Smooth gimbal video, weddings, vlogs.",
    specs: { payload: "3kg", batteryLife: "12h", mount: "universal", bestFor: "Stabilized Video" },
    condition: "good",
    totalQuantity: 3,
  },
  {
    brand: "DJI",
    model: "RS3 Pro",
    category: "accessory" as const,
    slug: "dji-rs3-pro",
    dailyRateCents: 80000,
    weeklyRateCents: 400000,
    depositCents: 1200000,
    description: "Flagship gimbal stabilizer. Supports heavier pro camera setups with LiDAR autofocus helper. Best for: Heavy cinema rigs, pro filmmaking.",
    specs: { payload: "4.5kg", batteryLife: "12h", mount: "universal", bestFor: "Professional Filmmaking" },
    condition: "excellent",
    totalQuantity: 2,
  },
  {
    brand: "Godox",
    model: "V860III Speedlight",
    category: "accessory" as const,
    slug: "godox-v860iii",
    dailyRateCents: 20000,
    weeklyRateCents: 100000,
    depositCents: 300000,
    description: "Powerful Li-ion flash for hot shoe mount. Features modeling light and quick battery cycles. Best for: Event flash, wedding receptions.",
    specs: { guideNumber: "60", power: "76Ws", mount: "universal", bestFor: "On-camera Flash" },
    condition: "good",
    totalQuantity: 4,
  },
] satisfies (typeof productModels.$inferInsert)[];

async function main() {
  console.log("Cleaning existing database tables...");
  // Clear tables to avoid conflicts
  await db.delete(bookings);
  await db.delete(inventoryItems);
  await db.delete(productModels);
  await db.delete(authSession);
  await db.delete(authAccount);
  await db.delete(authUser);
  console.log("  ✓ Database cleared");

  console.log("Seeding users via better-auth...");
  
  // Rajesh Kumar
  const user1 = await auth.api.signUpEmail({
    body: {
      email: "rajesh@example.com",
      password: "password123",
      name: "Rajesh Kumar",
    }
  });
  await db.update(authUser).set({
    phone: "9999999999",
    role: "customer",
    rentalCount: 4,
    totalSpentCents: 850000,
  }).where(eq(authUser.id, user1.user.id));
  const [customer1] = await db.select().from(authUser).where(eq(authUser.id, user1.user.id)).limit(1);

  // Priya Nair
  const user2 = await auth.api.signUpEmail({
    body: {
      email: "priya@example.com",
      password: "password123",
      name: "Priya Nair",
    }
  });
  await db.update(authUser).set({
    phone: "9876543210",
    role: "customer",
    rentalCount: 2,
    totalSpentCents: 450000,
  }).where(eq(authUser.id, user2.user.id));
  const [customer2] = await db.select().from(authUser).where(eq(authUser.id, user2.user.id)).limit(1);

  // Arun S
  const user3 = await auth.api.signUpEmail({
    body: {
      email: "arun@example.com",
      password: "password123",
      name: "Arun S",
    }
  });
  await db.update(authUser).set({
    phone: "9447123456",
    role: "customer",
    rentalCount: 1,
    totalSpentCents: 300000,
  }).where(eq(authUser.id, user3.user.id));
  const [customer3] = await db.select().from(authUser).where(eq(authUser.id, user3.user.id)).limit(1);

  // Shop Owner (Admin)
  const userAdmin = await auth.api.signUpEmail({
    body: {
      email: "admin@camrents.in",
      password: "password123",
      name: "Shop Owner",
    }
  });
  await db.update(authUser).set({
    phone: "8888888888",
    role: "admin",
  }).where(eq(authUser.id, userAdmin.user.id));
  const [adminUser] = await db.select().from(authUser).where(eq(authUser.id, userAdmin.user.id)).limit(1);

  console.log("  ✓ 3 Customer and 1 Admin users registered and seeded");

  console.log("Seeding product models...");
  const insertedProducts = await db.insert(productModels).values(products).returning();
  console.log(`  ✓ ${insertedProducts.length} products inserted`);

  console.log("Seeding inventory items...");
  let totalItemsCount = 0;
  for (const product of insertedProducts) {
    const qty = product.totalQuantity ?? 1;
    const itemsToInsert = [];
    for (let i = 1; i <= qty; i++) {
      const modelClean = product.model.toUpperCase().replace(/[\s\-\/\.\(\)]+/g, "");
      const code = `${product.brand.toUpperCase()}-${modelClean}-${String(i).padStart(3, "0")}`;
      itemsToInsert.push({
        productModelId: product.id,
        serialNumber: code,
        status: "available" as const,
        conditionNote: `Unit ${i} in ${product.condition} condition. Serviced and ready.`,
      });
    }
    if (itemsToInsert.length > 0) {
      await db.insert(inventoryItems).values(itemsToInsert);
      totalItemsCount += itemsToInsert.length;
    }
  }
  console.log(`  ✓ ${totalItemsCount} physical inventory items seeded`);

  console.log("Seeding sample bookings...");
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  
  const sonyA7iv = insertedProducts.find((p: any) => p.slug === "sony-a7iv")!;
  const sonyFx3 = insertedProducts.find((p: any) => p.slug === "sony-fx3")!;
  const canonR5 = insertedProducts.find((p: any) => p.slug === "canon-r5")!;
  const sony2470 = insertedProducts.find((p: any) => p.slug === "sony-24-70-f2p8-gm2")!;
  const djiRs3 = insertedProducts.find((p: any) => p.slug === "dji-rs3")!;

  // Past booking - returned
  const pastPickup = new Date(today);
  pastPickup.setDate(pastPickup.getDate() - 10);
  const pastReturn = new Date(today);
  pastReturn.setDate(pastReturn.getDate() - 7);

  await db.insert(bookings).values({
    bookingNumber: "CAM-2026-A1B2",
    userId: customer1.id,
    productModelId: sonyA7iv.id,
    status: "returned",
    paymentMode: "online",
    paymentStatus: "paid",
    pickupDate: fmt(pastPickup),
    returnDate: fmt(pastReturn),
    dailyRateCents: sonyA7iv.dailyRateCents,
    totalRentalCents: sonyA7iv.dailyRateCents * 3,
    depositCents: sonyA7iv.depositCents,
    grandTotalCents: sonyA7iv.dailyRateCents * 3,
    paidAtStore: false,
    depositCollected: true,
    depositReturned: true,
    createdAt: new Date(pastPickup.getTime() - 86400000),
    updatedAt: pastReturn,
  });

  // Current active booking
  const activePickup = new Date(today);
  activePickup.setDate(activePickup.getDate() - 2);
  const activeReturn = new Date(today);
  activeReturn.setDate(activeReturn.getDate() + 3);

  await db.insert(bookings).values({
    bookingNumber: "CAM-2026-B2C3",
    userId: customer2.id,
    productModelId: sonyFx3.id,
    status: "active",
    paymentMode: "offline",
    paymentStatus: "paid",
    pickupDate: fmt(activePickup),
    returnDate: fmt(activeReturn),
    dailyRateCents: sonyFx3.dailyRateCents,
    totalRentalCents: sonyFx3.dailyRateCents * 5,
    depositCents: sonyFx3.depositCents,
    damageWaiverCents: Math.round(sonyFx3.dailyRateCents * 5 * 0.1),
    grandTotalCents: sonyFx3.dailyRateCents * 5 + Math.round(sonyFx3.dailyRateCents * 5 * 0.1),
    paidAtStore: true,
    depositCollected: true,
    createdAt: new Date(activePickup.getTime() - 86400000),
    updatedAt: activePickup,
  });

  // Upcoming confirmed booking (today's pickup)
  await db.insert(bookings).values({
    bookingNumber: "CAM-2026-C3D4",
    userId: customer3.id,
    productModelId: canonR5.id,
    status: "confirmed",
    paymentMode: "online",
    paymentStatus: "pending",
    pickupDate: fmt(today),
    returnDate: fmt(new Date(today.getTime() + 4 * 86400000)),
    dailyRateCents: canonR5.dailyRateCents,
    totalRentalCents: canonR5.dailyRateCents * 4,
    depositCents: canonR5.depositCents,
    grandTotalCents: canonR5.dailyRateCents * 4,
    paidAtStore: false,
    depositCollected: false,
    createdAt: new Date(today.getTime() - 2 * 86400000),
    updatedAt: new Date(today.getTime() - 86400000),
  });

  // Pending booking
  const pendingPickup = new Date(today);
  pendingPickup.setDate(pendingPickup.getDate() + 7);
  const pendingReturn = new Date(today);
  pendingReturn.setDate(pendingReturn.getDate() + 10);

  await db.insert(bookings).values({
    bookingNumber: "CAM-2026-D4E5",
    userId: customer1.id,
    productModelId: sony2470.id,
    status: "pending",
    paymentMode: "online",
    paymentStatus: "pending",
    pickupDate: fmt(pendingPickup),
    returnDate: fmt(pendingReturn),
    dailyRateCents: sony2470.dailyRateCents,
    totalRentalCents: sony2470.dailyRateCents * 3,
    depositCents: sony2470.depositCents,
    damageWaiverCents: Math.round(sony2470.dailyRateCents * 3 * 0.1),
    grandTotalCents: sony2470.dailyRateCents * 3 + Math.round(sony2470.dailyRateCents * 3 * 0.1),
    paidAtStore: false,
    depositCollected: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Another returned booking for richer history
  const oldPickup = new Date(today);
  oldPickup.setDate(oldPickup.getDate() - 30);
  const oldReturn = new Date(today);
  oldReturn.setDate(oldReturn.getDate() - 27);

  await db.insert(bookings).values({
    bookingNumber: "CAM-2026-E5F6",
    userId: customer1.id,
    productModelId: djiRs3.id,
    status: "returned",
    paymentMode: "offline",
    paymentStatus: "paid",
    pickupDate: fmt(oldPickup),
    returnDate: fmt(oldReturn),
    dailyRateCents: djiRs3.dailyRateCents,
    totalRentalCents: djiRs3.dailyRateCents * 3,
    depositCents: djiRs3.depositCents,
    grandTotalCents: djiRs3.dailyRateCents * 3,
    paidAtStore: true,
    depositCollected: true,
    depositReturned: true,
    createdAt: new Date(oldPickup.getTime() - 86400000),
    updatedAt: oldReturn,
  });

  console.log("  ✓ 5 sample bookings created");
  console.log("Seeding completed successfully!\n");
  console.log("── Demo Accounts ──");
  console.log("Admin: 8888888888 / admin123");
  console.log("Customer 1: 9999999999 / password123");
  console.log("Customer 2: 9876543210 / password123");
  console.log("Customer 3: 9447123456 / password123");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
