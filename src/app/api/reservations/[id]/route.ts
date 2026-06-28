import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type Params = Promise<{ id: string }>;

export async function PATCH(req: Request, segmentData: { params: Params }) {
  try {
    const { id } = await segmentData.params;
    const data = await req.json();
    
    const reservation = await prisma.reservation.update({
      where: { id },
      data: {
        status: data.status, // "confirmed", "cancelled"
      }
    });
    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update reservation status' }, { status: 500 });
  }
}
