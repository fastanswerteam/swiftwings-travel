import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getAdminFromRequest } from '@/lib/jwt';

export async function POST(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ message: 'Both current and new password are required' }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ message: 'New password must be at least 8 characters' }, { status: 400 });
  }

  const dbAdmin = await prisma.admin.findUnique({ where: { id: admin.adminId } });
  if (!dbAdmin) {
    return NextResponse.json({ message: 'Admin account not found' }, { status: 404 });
  }

  const valid = await bcrypt.compare(currentPassword, dbAdmin.password);
  if (!valid) {
    return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  await prisma.admin.update({
    where: { id: admin.adminId },
    data: { password: newHash },
  });

  return NextResponse.json({ success: true });
}