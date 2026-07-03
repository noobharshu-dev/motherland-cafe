import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { sanitizeText } from '@/lib/sanitize';

const menuItemSchema = z.object({
  categoryId: z.string().min(1, 'categoryId is required'),
  name: z.string().min(1, 'name is required').max(200),
  description: z.string().max(1000).optional().default(''),
  price: z.number().min(0, 'price must be non-negative'),
  imageUrl: z.string().url('imageUrl must be a valid URL').optional().default(''),
  isVegetarian: z.boolean().optional().default(false),
  isVegan: z.boolean().optional().default(false),
  isGlutenFree: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  isVisible: z.boolean().optional().default(true),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get('categoryId');

  try {
    const items = await prisma.menuItem.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { category: true },
    });
    return NextResponse.json(items);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Parse body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Validate with Zod
    const parsed = menuItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const item = await prisma.menuItem.create({
      data: {
        categoryId: data.categoryId,
        name: sanitizeText(data.name),
        description: sanitizeText(data.description ?? ''),
        price: data.price,
        imageUrl: data.imageUrl ?? '',
        isVegetarian: data.isVegetarian ?? false,
        isVegan: data.isVegan ?? false,
        isGlutenFree: data.isGlutenFree ?? false,
        isFeatured: data.isFeatured ?? false,
        isVisible: data.isVisible ?? true,
      },
    });

    // Invalidate public caches so the new item shows up immediately
    revalidatePath('/menu');
    revalidatePath('/');

    return NextResponse.json(item, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}
