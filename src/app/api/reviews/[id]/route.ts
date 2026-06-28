import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = Promise<{ id: string }>;

export async function PATCH(req: Request, segmentData: { params: Params }) {
  try {
    const { id } = await segmentData.params;
    const data = await req.json();
    
    const review = await prisma.review.update({
      where: { id },
      data: {
        status: data.status, // e.g. "published", "rejected"
      }
    });
    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review status' }, { status: 500 });
  }
}
