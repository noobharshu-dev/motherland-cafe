"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ── AUTH ──────────────────────────────────────────────────────────

export async function loginAdmin(password: string): Promise<{ error?: string }> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return { error: "ADMIN_PASSWORD not set in .env.local" };
  if (password !== adminPassword) return { error: "Incorrect password" };
  (await cookies()).set("admin_auth", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60,
    path: "/",
    sameSite: "lax",
  });
  return {};
}

export async function logoutAdmin() {
  (await cookies()).delete("admin_auth");
}

// ── MENU CATEGORIES ───────────────────────────────────────────────

export async function createCategory(name: string, displayOrder: number) {
  await prisma.menuCategory.create({ data: { name, displayOrder } });
  revalidatePath("/admin"); revalidatePath("/menu");
}

export async function deleteCategory(id: string) {
  await prisma.menuCategory.delete({ where: { id } });
  revalidatePath("/admin"); revalidatePath("/menu");
}

// ── MENU ITEMS ────────────────────────────────────────────────────

export interface MenuItemInput {
  categoryId: string; name: string; description: string;
  price: number; imageUrl: string;
  isVegetarian: boolean; isVegan: boolean; isGlutenFree: boolean; isFeatured: boolean;
}

export async function createMenuItem(data: MenuItemInput) {
  await prisma.menuItem.create({ data });
  revalidatePath("/admin"); revalidatePath("/menu"); revalidatePath("/");
}

export async function updateMenuItem(id: string, data: MenuItemInput) {
  await prisma.menuItem.update({ where: { id }, data });
  revalidatePath("/admin"); revalidatePath("/menu"); revalidatePath("/");
}

export async function deleteMenuItem(id: string) {
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath("/admin"); revalidatePath("/menu"); revalidatePath("/");
}

// ── GALLERY ───────────────────────────────────────────────────────

export interface GalleryInput {
  imageUrl: string; title: string; category: string;
  displayOrder: number; isPublished: boolean;
}

export async function createGalleryImage(data: GalleryInput) {
  await prisma.galleryImage.create({ data });
  revalidatePath("/admin"); revalidatePath("/gallery");
}

export async function deleteGalleryImage(id: string) {
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/admin"); revalidatePath("/gallery");
}

// ── REVIEWS ───────────────────────────────────────────────────────

export interface ReviewInput {
  name: string; rating: number; reviewText: string;
  source: string; isPublished: boolean;
}

export async function createReview(data: ReviewInput) {
  await prisma.review.create({ data });
  revalidatePath("/admin"); revalidatePath("/");
}

export async function toggleReviewPublished(id: string, value: boolean) {
  await prisma.review.update({ where: { id }, data: { isPublished: value } });
  revalidatePath("/admin"); revalidatePath("/");
}

export async function deleteReview(id: string) {
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin"); revalidatePath("/");
}

// ── RESERVATIONS ──────────────────────────────────────────────────

export async function updateReservationStatus(id: string, status: string) {
  await prisma.reservation.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}
