import { PrismaClient } from '../prisma/generated/client.js';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

// Prioridade: .env.production > .env.local > .env
const envFiles = ['.env.production', '.env.local', '.env'];
const loaded = envFiles.find((file) => {
  const p = resolve(process.cwd(), '../../apps/web', file);
  if (existsSync(p)) {
    dotenv.config({ path: p });
    console.log(`📝 Loading env from ${file}`);
    return true;
  }
  return false;
});

if (!loaded) {
  console.warn('⚠️  No .env file found');
}

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || '',
});

const prisma = new PrismaClient({ adapter });

// Initialize better-auth for user creation
const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});

async function main() {
  console.log('🌱 Starting database seed...');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn(
      '⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env.local - skipping admin creation'
    );
    return;
  }

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`✅ Admin user already exists: ${adminEmail}`);

    // Update isAdmin flag if not set
    if (!existingAdmin.isAdmin) {
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: { isAdmin: true },
      });
      console.log(`✅ Updated ${adminEmail} to admin`);
    }
    return;
  }

  // Create admin user using better-auth API
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: 'Admin',
      },
    });

    if (result && result.user) {
      // Update user to set isAdmin and emailVerified flags
      await prisma.user.update({
        where: { id: result.user.id },
        data: {
          isAdmin: true,
          emailVerified: true,
        },
      });

      console.log(`✅ Admin user created successfully: ${adminEmail}`);
      console.log(`🔐 Password: ${adminPassword}`);
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
