const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const indianNames = {
  male: [
    "Arjun",
    "Rahul",
    "Amit",
    "Rajesh",
    "Suresh",
    "Vikram",
    "Aditya",
    "Ravi",
    "Krishna",
    "Aravind",
    "Sachin",
    "Deepak",
    "Manoj",
    "Nikhil",
    "Dev",
  ],
  female: [
    "Priya",
    "Anjali",
    "Meera",
    "Sneha",
    "Pooja",
    "Ritu",
    "Neha",
    "Anita",
    "Sunita",
    "Rekha",
    "Lakshmi",
    "Suman",
    "Kavita",
    "Rani",
    "Maya",
  ],
  surnames: [
    "Patel",
    "Sharma",
    "Kumar",
    "Singh",
    "Verma",
    "Gupta",
    "Reddy",
    "Iyer",
    "Menon",
    "Nair",
    "Pillai",
    "Chauhan",
    "Yadav",
    "Mishra",
    "Joshi",
  ],
};

const departments = [
  "Sales",
  "Marketing",
  "Finance",
  "HR",
  "IT",
  "Operations",
  "Production",
  "Quality Control",
  "R&D",
  "Customer Support",
];

const positions = [
  "Manager",
  "Senior Executive",
  "Executive",
  "Team Lead",
  "Associate",
  "Trainee",
  "Director",
  "Coordinator",
  "Supervisor",
  "Operator",
];

const products = [
  {
    name: "Premium Basmati Rice",
    category: "Food Grains",
    description: "Aromatic long-grain rice from the Himalayas",
    b2bPrice: 1200,
    b2cPrice: 1500,
    stock: 1000,
  },
  {
    name: "Organic Turmeric Powder",
    category: "Spices",
    description: "Pure turmeric powder from Kerala farms",
    b2bPrice: 800,
    b2cPrice: 1200,
    stock: 800,
  },
  {
    name: "Handwoven Silk Saree",
    category: "Textiles",
    description: "Traditional Banarasi silk saree with gold zari",
    b2bPrice: 5000,
    b2cPrice: 8000,
    stock: 100,
  },
  {
    name: "Ayurvedic Face Cream",
    category: "Personal Care",
    description: "Face cream made with Indian Ayurvedic herbs",
    b2bPrice: 300,
    b2cPrice: 500,
    stock: 250,
  },
  {
    name: "Brass Diya Set",
    category: "Home Decor",
    description: "Handcrafted brass oil lamp set",
    b2bPrice: 600,
    b2cPrice: 1000,
    stock: 400,
  },
];

const warehouses = [
  "Mumbai Central",
  "Delhi North",
  "Bangalore South",
  "Chennai Port",
  "Kolkata East",
  "Hyderabad Hub",
  "Pune Warehouse",
  "Ahmedabad Center",
  "Jaipur Depot",
  "Indore Zone",
];

const platforms = [
  "Amazon",
  "Flipkart",
  "Myntra",
  "Snapdeal",
  "Nykaa",
  "JioMart",
  "Meesho",
];

async function main() {
  // Clear all except users
  await prisma.customer.deleteMany();
  await prisma.salesOrder.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productionOrder.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.marketplaceOrder.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.workstation.deleteMany();

  // Products (5 defined)
  const createdProducts = [];
  for (const product of products) {
    const created = await prisma.product.create({
      data: {
        ...product,
        productId: `PROD${String(createdProducts.length + 1).padStart(3, "0")}`,
      },
    });
    createdProducts.push(created);
  }

  // Customers (50)
  const customers = [];
  for (let i = 0; i < 50; i++) {
    const firstName =
      i % 2 === 0
        ? indianNames.male[Math.floor(Math.random() * indianNames.male.length)]
        : indianNames.female[
            Math.floor(Math.random() * indianNames.female.length)
          ];
    const lastName =
      indianNames.surnames[
        Math.floor(Math.random() * indianNames.surnames.length)
      ];
    const name = `${firstName} ${lastName}`;

    const customer = await prisma.customer.create({
      data: {
        name,
        contact: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        status: Math.random() > 0.2 ? "Active" : "Inactive",
        description: `Customer from ${lastName} family`,
        location: `${lastName} Nagar, City ${i + 1}`,
      },
    });

    customers.push(customer);
  }

  // Sales Orders (50)
  for (let i = 0; i < 50; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product =
      createdProducts[Math.floor(Math.random() * createdProducts.length)];
    const statuses = ["Pending", "Confirmed", "Dispatched"];

    await prisma.salesOrder.create({
      data: {
        customerName: customer.name,
        quantity: Math.floor(Math.random() * 10) + 1,
        product: product.name,
        price: product.b2cPrice,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      },
    });
  }

  // Production Orders (40)
  for (let i = 0; i < 40; i++) {
    const product =
      createdProducts[Math.floor(Math.random() * createdProducts.length)];
    const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
    const statuses = ["Pending", "In Progress", "Completed"];

    await prisma.productionOrder.create({
      data: {
        productId: product.id,
        productName: product.name,
        warehouse,
        quantity: Math.floor(Math.random() * 100) + 50,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      },
    });
  }

  // Notifications (60)
  const notificationTypes = ["Info", "Warning", "Success", "Error"];
  for (let i = 0; i < 60; i++) {
    const userId = null; // Or assign to an existing user if needed

    await prisma.notification.create({
      data: {
        title: `Notification ${i + 1}`,
        message: `This is a ${notificationTypes[i % 4]} message`,
        type: notificationTypes[i % 4],
        isRead: Math.random() > 0.5,
        userId,
      },
    });
  }

  // Marketplace Orders (50)
  for (let i = 0; i < 50; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const firstName =
      indianNames.male[Math.floor(Math.random() * indianNames.male.length)];
    const lastName =
      indianNames.surnames[
        Math.floor(Math.random() * indianNames.surnames.length)
      ];
    const customerName = `${firstName} ${lastName}`;
    const statuses = ["Pending", "Dispatched", "Confirmed"];

    await prisma.marketplaceOrder.create({
      data: {
        platform,
        customerName,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        description: `Order placed on ${platform}`,
      },
    });
  }

  // Work Orders (50)
  for (let i = 0; i < 50; i++) {
    await prisma.workOrder.create({
      data: {
        workOrderId: `WO-${1000 + i}`,
        workOrderName: `Work Order ${i + 1}`,
        assignedTo: `Operator ${i % 10}`,
        startDate: new Date().toISOString().split("T")[0],
        completionDate: new Date(Date.now() + 86400000 * (i % 5))
          .toISOString()
          .split("T")[0],
        efficiency: `${(Math.random() * 100).toFixed(2)}`,
        status: ["Completed", "Pending", "Ongoing"][i % 3],
        description: `Auto generated work order ${i + 1}`,
      },
    });
  }

  // Inspections (45)
  for (let i = 0; i < 45; i++) {
    await prisma.inspection.create({
      data: {
        batchId: `BATCH${i + 1}`,
        inspectionStatus: ["passed", "failed", "rework needed"][i % 3],
        defectType: ["minor", "major", "critical"][i % 3],
        assignedTo: `Inspector ${i % 8}`,
        reworkStatus: ["started", "in-progress", "completed"][i % 3],
        description: `Auto-generated inspection ${i + 1}`,
      },
    });
  }

  // Workstations (45)
  for (let i = 0; i < 45; i++) {
    await prisma.workstation.create({
      data: {
        workstationName: `Station-${i + 1}`,
        assignedTo: `Operator ${i % 10}`,
        currentOperation: ["Assembly", "Packaging", "Testing"][i % 3],
        productionTime: `${8 + (i % 4)} hrs`,
        utilization: `${(Math.random() * 100).toFixed(2)}`,
        description: `Auto-added workstation ${i + 1}`,
      },
    });
  }

  console.log("Seeder complete with ~50 entries per model (except user)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
