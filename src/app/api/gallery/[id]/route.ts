import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type Params = Promise<{ id: string }>;

export async function DELETE(req: Request, segmentData: { params: Params }) {
  try {
    const { id } = await segmentData.params;
    await prisma.galleryImage.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}
