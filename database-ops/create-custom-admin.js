const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createCustomAdmin() {
  try {
    // You can change these credentials
    const email = "your-email@example.com"; // Change this to your email
    const password = "your-password"; // Change this to your password
    const name = "Your Name"; // Change this to your name

    console.log("Creating admin account...");
    console.log("Email:", email);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("❌ User already exists with email:", email);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: new Date(),
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);
    console.log("👤 Role:", admin.role);
    console.log("");
    console.log("⚠️  Please change the password after first login!");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createCustomAdmin();
