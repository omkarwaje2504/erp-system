const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const indianNames = {
  male: [
    'Arjun', 'Rahul', 'Amit', 'Rajesh', 'Suresh', 'Vikram', 'Priyank', 'Aditya',
    'Ravi', 'Krishna', 'Aravind', 'Sachin', 'Narendra', 'Deepak', 'Manoj'
  ],
  female: [
    'Priya', 'Anjali', 'Meera', 'Sneha', 'Pooja', 'Ritu', 'Neha', 'Anita',
    'Sunita', 'Rekha', 'Lakshmi', 'Suman', 'Kavita', 'Rani', 'Maya'
  ],
  surnames: [
    'Patel', 'Sharma', 'Kumar', 'Singh', 'Verma', 'Gupta', 'Reddy', 'Iyer',
    'Menon', 'Nair', 'Pillai', 'Chauhan', 'Yadav', 'Mishra', 'Joshi'
  ]
};

const departments = [
  'Sales', 'Marketing', 'Finance', 'HR', 'IT', 'Operations', 'Production',
  'Quality Control', 'Research & Development', 'Customer Support'
];

const positions = [
  'Manager', 'Senior Executive', 'Executive', 'Team Lead', 'Associate',
  'Trainee', 'Director', 'Head of Department', 'Coordinator', 'Supervisor'
];

const products = [
  {
    name: 'Premium Basmati Rice',
    category: 'Food Grains',
    description: 'Aromatic long-grain rice from the foothills of Himalayas',
    b2bPrice: 1200,
    b2cPrice: 1500,
    stock: 1000
  },
  {
    name: 'Organic Turmeric Powder',
    category: 'Spices',
    description: 'Pure organic turmeric powder from Kerala',
    b2bPrice: 800,
    b2cPrice: 1200,
    stock: 500
  },
  {
    name: 'Handwoven Silk Saree',
    category: 'Textiles',
    description: 'Traditional Banarasi silk saree with intricate designs',
    b2bPrice: 5000,
    b2cPrice: 8000,
    stock: 100
  },
  {
    name: 'Ayurvedic Face Cream',
    category: 'Personal Care',
    description: 'Natural face cream with Indian herbs',
    b2bPrice: 300,
    b2cPrice: 500,
    stock: 200
  },
  {
    name: 'Brass Diya Set',
    category: 'Home Decor',
    description: 'Traditional brass oil lamps set of 5',
    b2bPrice: 600,
    b2cPrice: 1000,
    stock: 300
  }
];

const warehouses = [
  'Mumbai Central', 'Delhi North', 'Bangalore South', 'Chennai Port',
  'Kolkata East', 'Hyderabad Hub', 'Pune Warehouse', 'Ahmedabad Center'
];

const platforms = ['Amazon', 'Flipkart', 'Myntra', 'Snapdeal', 'Nykaa'];

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.salesOrder.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productionOrder.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.marketplaceOrder.deleteMany();

  // Create Users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const firstName = i % 2 === 0 ? 
      indianNames.male[Math.floor(Math.random() * indianNames.male.length)] :
      indianNames.female[Math.floor(Math.random() * indianNames.female.length)];
    const lastName = indianNames.surnames[Math.floor(Math.random() * indianNames.surnames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}${i}@company.com`;
    const hashedPassword = await bcrypt.hash('password123', 10);
    const department = departments[Math.floor(Math.random() * departments.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const salary = Math.floor(Math.random() * 50000) + 50000;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        employeeId: `EMP${String(i + 1).padStart(3, '0')}`,
        position,
        salary,
        department,
        role: i === 0 ? 'admin' : 'user'
      }
    });
    users.push(user);
  }

  // Create Products
  const createdProducts = [];
  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: {
        ...product,
        productId: `PROD${String(createdProducts.length + 1).padStart(3, '0')}`
      }
    });
    createdProducts.push(createdProduct);
  }

  // Create Customers
  const customers = [];
  for (let i = 0; i < 15; i++) {
    const firstName = i % 2 === 0 ? 
      indianNames.male[Math.floor(Math.random() * indianNames.male.length)] :
      indianNames.female[Math.floor(Math.random() * indianNames.female.length)];
    const lastName = indianNames.surnames[Math.floor(Math.random() * indianNames.surnames.length)];
    const name = `${firstName} ${lastName}`;
    
    const customer = await prisma.customer.create({
      data: {
        name,
        contact: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        status: Math.random() > 0.2 ? 'Active' : 'Inactive',
        description: `Customer from ${indianNames.surnames[Math.floor(Math.random() * indianNames.surnames.length)]} family`,
        location: `${indianNames.surnames[Math.floor(Math.random() * indianNames.surnames.length)]} Street, City ${i + 1}`
      }
    });
    customers.push(customer);
  }

  // Create Sales Orders
  for (let i = 0; i < 20; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
    const statuses = ['Pending', 'Confirmed', 'Dispatched'];
    
    await prisma.salesOrder.create({
      data: {
        customerName: customer.name,
        quantity: Math.floor(Math.random() * 10) + 1,
        product: product.name,
        price: product.b2cPrice,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      }
    });
  }

  // Create Production Orders
  for (let i = 0; i < 15; i++) {
    const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
    const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
    const statuses = ['Pending', 'In Progress', 'Completed'];
    
    await prisma.productionOrder.create({
      data: {
        productId: product.id,
        productName: product.name,
        warehouse,
        quantity: Math.floor(Math.random() * 100) + 50,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      }
    });
  }

  // Create Notifications
  const notificationTypes = ['Info', 'Warning', 'Success', 'Error'];
  for (let i = 0; i < 30; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    
    await prisma.notification.create({
      data: {
        title: `Notification ${i + 1}`,
        message: `This is a ${notificationTypes[Math.floor(Math.random() * notificationTypes.length)]} message for ${user.name}`,
        type: notificationTypes[Math.floor(Math.random() * notificationTypes.length)],
        isRead: Math.random() > 0.5,
        userId: user.id
      }
    });
  }

  // Create Marketplace Orders
  for (let i = 0; i < 25; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const firstName = indianNames.male[Math.floor(Math.random() * indianNames.male.length)];
    const lastName = indianNames.surnames[Math.floor(Math.random() * indianNames.surnames.length)];
    const customerName = `${firstName} ${lastName}`;
    const statuses = ['Pending', 'Dispatched', 'Confirmed'];
    
    await prisma.marketplaceOrder.create({
      data: {
        platform,
        customerName,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        description: `Order from ${platform} marketplace`
      }
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 