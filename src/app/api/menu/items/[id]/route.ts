import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

type Params = Promise<{ id: string }>;

export async function PUT(req: Request, segmentData: { params: Params }) {
  try {
    const { id } = await segmentData.params;
    const data = await req.json();

    // Build only the fields that were actually sent
    const updateData: any = {};
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description || '';
    if (data.price !== undefined) updateData.price = parseFloat(data.price);
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.isVegetarian !== undefined) updateData.isVegetarian = data.isVegetarian;
    if (data.isVegan !== undefined) updateData.isVegan = data.isVegan;
    if (data.isGlutenFree !== undefined) updateData.isGlutenFree = data.isGlutenFree;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.isVisible !== undefined) updateData.isVisible = data.isVisible;

    const item = await prisma.menuItem.update({
      where: { id },
      data: updateData,
    });
    
    revalidatePath('/menu');
    revalidatePath('/');
    
    return NextResponse.json(item);
  } catch (error: any) {
    console.error('[PUT /api/menu/items/:id]', error?.message ?? error);
    return NextResponse.json(
      { error: 'Failed to update item', detail: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, segmentData: { params: Params }) {
  try {
    const { id } = await segmentData.params;
    await prisma.menuItem.delete({
      where: { id }
    });
    
    revalidatePath('/menu');
    revalidatePath('/');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
