import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, company, email, sector } = req.body ?? {};

  if (!name || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.home.pl",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const text = [
    `Imię i nazwisko: ${name}`,
    `Firma: ${company || "—"}`,
    `Email: ${email}`,
    `Sektor: ${sector || "—"}`,
  ].join("\n");

  try {
    await transporter.sendMail({
      from: `"DataWise POS" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO ?? "info@datawise.pl",
      replyTo: email,
      subject: `Zapytanie o próbkę danych — ${name}`,
      text,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("SMTP error:", err.message);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
