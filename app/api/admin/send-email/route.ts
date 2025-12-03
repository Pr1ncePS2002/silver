import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import nodemailer from "nodemailer";
import { z } from "zod";

const schema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1).optional(),
  text: z.string().min(1).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { to, subject, html, text } = schema.parse(body);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "silver.line9250@gmail.com",
        pass: process.env.EMAIL_PASS || "",
      },
    });

    const from = process.env.EMAIL_USER || "silver.line9250@gmail.com";
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || undefined,
      html: html || undefined,
    });

    return NextResponse.json({ message: "Email sent", id: info.messageId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
