import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get('categoryId');
  
  try {
    const items = await prisma.menuItem.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { category: true },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate required fields
    if (!data.categoryId || typeof data.categoryId !== 'string' || data.categoryId.trim() === '') {
      return NextResponse.json({ error: 'categoryId is required' }, { status: 400 });
    }
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }
    const price = parseFloat(data.price);
    if (isNaN(price)) {
      return NextResponse.json({ error: 'price must be a valid number' }, { status: 400 });
    }

    const item = await prisma.menuItem.create({
      data: {
        categoryId: data.categoryId.trim(),
        name: data.name.trim(),
        description: (data.description || '').trim(),
        price,
        imageUrl: data.imageUrl || '',
        isVegetarian: data.isVegetarian || false,
        isVegan: data.isVegan || false,
        isGlutenFree: data.isGlutenFree || false,
        isFeatured: data.isFeatured || false,
        isVisible: data.isVisible !== false,
      }
    });
    
    // Invalidate public caches so the new item shows up immediately
    revalidatePath('/menu');
    revalidatePath('/');
    
    return NextResponse.json(item);
  } catch (error: any) {
    console.error('[POST /api/menu/items]', error?.message ?? error);
    return NextResponse.json(
      { error: 'Failed to create item', detail: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}
