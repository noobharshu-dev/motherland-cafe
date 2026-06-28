import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const image = await prisma.galleryImage.create({
      data: {
        imageUrl: data.imageUrl,
        title: data.title || '',
        category: data.category || 'general',
        isPublished: data.isPublished !== false,
        displayOrder: data.displayOrder || 0,
      }
    });
    
    revalidatePath('/gallery');
    
    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create gallery image' }, { status: 500 });
  }
}
