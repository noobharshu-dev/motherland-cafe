"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Resend } from "resend";
import { headers } from "next/headers";
import { submissionLimiter, checkRateLimit } from "@/lib/ratelimit";
import { sanitizeText } from "@/lib/sanitize";
import { cafeConfig } from "@/config/cafe.config";

const reservationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
  guests: z.coerce.number().min(1).max(20),
  reservationDate: z.string().min(1, "Please select a date"),
  reservationTime: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
});

export type ReservationState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createReservation(
  _prevState: ReservationState,
  formData: FormData
): Promise<ReservationState> {
  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    guests: formData.get("guests"),
    reservationDate: formData.get("reservationDate"),
    reservationTime: formData.get("reservationTime"),
    notes: formData.get("notes"),
  };

  const parsed = reservationSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") ?? "anonymous";
    const rateLimitResponse = await checkRateLimit(submissionLimiter, `reservation:${ip}`);
    if (rateLimitResponse) {
      return {
        success: false,
        message: "Too many requests. Please try again later.",
      };
    }

    await prisma.reservation.create({
      data: {
        name: sanitizeText(data.name),
        phone: sanitizeText(data.phone),
        email: sanitizeText(data.email),
        guests: data.guests,
        reservationDate: data.reservationDate,
        reservationTime: data.reservationTime,
        notes: sanitizeText(data.notes ?? ""),
        status: "pending",
      },
    });

    // Send confirmation email if Resend key is set
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_your_key_here") {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || cafeConfig.email.reservations,
          to: [data.email],
          bcc: process.env.RESEND_TO_EMAIL,
          subject: `Reservation Confirmed — ${cafeConfig.name}`,
          html: `
            <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#451A03;">
              <div style="background:#78350F;padding:2rem;border-radius:8px 8px 0 0;text-align:center;">
                <h1 style="font-family:Georgia,serif;color:#FBBF24;font-size:1.75rem;margin:0;">${cafeConfig.name}</h1>
                <p style="color:rgba(254,243,199,0.8);margin:0.5rem 0 0;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase;">Reservation Confirmation</p>
              </div>
              <div style="background:#FEF3C7;padding:2rem;border-radius:0 0 8px 8px;border:1px solid #D97706;">
                <p style="font-size:1rem;margin-bottom:1.5rem;">Dear <strong>${data.name}</strong>,</p>
                <p style="margin-bottom:1.5rem;">Your table at ${cafeConfig.name} has been reserved. We look forward to welcoming you!</p>
                <table style="width:100%;border-collapse:collapse;margin-bottom:1.5rem;">
                  <tr style="border-bottom:1px solid rgba(120,53,15,0.15);">
                    <td style="padding:0.6rem 0;font-size:0.85rem;color:#92400E;font-weight:600;">Date</td>
                    <td style="padding:0.6rem 0;font-size:0.9rem;text-align:right;">${data.reservationDate}</td>
                  </tr>
                  <tr style="border-bottom:1px solid rgba(120,53,15,0.15);">
                    <td style="padding:0.6rem 0;font-size:0.85rem;color:#92400E;font-weight:600;">Time</td>
                    <td style="padding:0.6rem 0;font-size:0.9rem;text-align:right;">${data.reservationTime}</td>
                  </tr>
                  <tr>
                    <td style="padding:0.6rem 0;font-size:0.85rem;color:#92400E;font-weight:600;">Guests</td>
                    <td style="padding:0.6rem 0;font-size:0.9rem;text-align:right;">${data.guests}</td>
                  </tr>
                </table>
                <p style="font-size:0.85rem;color:#92400E;margin-bottom:0.5rem;"><strong>Address:</strong></p>
                <p style="font-size:0.85rem;color:#92400E;">${cafeConfig.address}, ${cafeConfig.city} ${cafeConfig.postalCode}</p>
                <p style="font-size:0.85rem;color:#92400E;margin-top:0.5rem;"><strong>Phone:</strong> ${cafeConfig.phone}</p>
                <hr style="margin:1.5rem 0;border:none;border-top:1px solid rgba(120,53,15,0.15);">
                <p style="font-size:0.8rem;color:rgba(120,53,15,0.6);text-align:center;">${cafeConfig.tagline}</p>
              </div>
            </div>
          `,
        });
      } catch (_emailErr) {
        // Email failed silently — reservation is still saved
      }
    }

    return {
      success: true,
      message: `Thank you, ${data.name}! Your table for ${data.guests} is reserved on ${data.reservationDate} at ${data.reservationTime}. Check your email for confirmation.`,
    };
  } catch (_err) {
    return {
      success: false,
      message: "Something went wrong. Please try again or call us directly.",
    };
  }
}
