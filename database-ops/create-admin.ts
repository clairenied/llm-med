import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = "admin@example.com";
    const password = "admin123";
    const name = "System Administrator";

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("❌ Admin user already exists with email:", email);
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: new Date(), // Mark as verified
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

createAdmin();
