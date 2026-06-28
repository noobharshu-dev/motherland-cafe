import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type Params = Promise<{ id: string }>;

export async function PUT(req: Request, segmentData: { params: Params }) {
  try {
    const { id } = await segmentData.params;
    const data = await req.json();
    
    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        price: data.price !== undefined ? parseFloat(data.price) : undefined,
        imageUrl: data.imageUrl,
        isVegetarian: data.isVegetarian,
        isVegan: data.isVegan,
        isGlutenFree: data.isGlutenFree,
        isFeatured: data.isFeatured,
        isVisible: data.isVisible,
      }
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(req: Request, segmentData: { params: Params }) {
  try {
    const { id } = await segmentData.params;
    await prisma.menuItem.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
