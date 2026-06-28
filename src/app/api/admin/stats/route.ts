import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const totalMenuItems = await prisma.menuItem.count();
    const totalGalleryImages = await prisma.galleryImage.count();
    const totalReviews = await prisma.review.count();
    const pendingReservations = await prisma.reservation.count({
      where: { status: 'pending' },
    });

    const reviews = await prisma.review.findMany({ select: { rating: true } });
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

    return NextResponse.json({
      menuItems: totalMenuItems,
      galleryImages: totalGalleryImages,
      totalReviews,
      avgRating,
      pendingReservations,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
