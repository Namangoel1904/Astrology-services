import nodemailer from "nodemailer";
import type { BookingRecord } from "./bookings-store";
import { findAstrologer } from "./astrologers-data";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  BOOKING_FROM_EMAIL,
  BOOKING_REPLY_TO,
} = process.env;

function getTransporter() {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn("[Mailer] SMTP env variables missing – emails will be logged only.");
    return null;
  }

  const port = Number(SMTP_PORT);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendBookingEmails(booking: BookingRecord) {
  const transporter = getTransporter();
  const astrologer = findAstrologer(booking.astrologerId);
  const from = BOOKING_FROM_EMAIL || "no-reply@jyotish-consultancy.com";

  const replyTo =
    BOOKING_REPLY_TO || astrologer?.privateDetails.email || booking.email;

  const userSubject = `आपकी ज्योतिष बुकिंग पुष्टि - ${booking.astrologerName}`;
  const userBody = `
नमस्कार ${booking.clientName},

आपकी बुकिंग सफल हुई!

ज्योतिषी: ${booking.astrologerName}
तारीख: ${booking.appointmentDate}
समय: ${booking.appointmentSlot}
अवधि: ${booking.durationMinutes} मिनट
विषय: ${booking.topic}

आपको अगले ईमेल में Zoom कॉल की लिंक भेजी जाएगी। कृपया निर्धारित समय से 5 मिनट पहले तैयार रहें।

शुभेच्छा,
ज्योतिष परामर्श टीम
`;

  const astrologerBody = `
प्रिय ${astrologer?.name ?? booking.astrologerName},

आपके लिए नई बुकिंग आयी है।

ग्राहक: ${booking.clientName}
ईमेल: ${booking.email}
फ़ोन: ${booking.phone}
जन्म तिथि: ${booking.dob}
जन्म समय: ${booking.tob}
विषय: ${booking.topic}
तारीख: ${booking.appointmentDate}
समय: ${booking.appointmentSlot}

कृपया Zoom लिंक साझा करके बुकिंग कन्फर्म करें.
`;

  if (!transporter) {
    console.log("[Mailer] User email\n", userBody);
    console.log("[Mailer] Astrologer email\n", astrologerBody);
    return;
  }

  await transporter.sendMail({
    from,
    to: booking.email,
    subject: userSubject,
    text: userBody,
    replyTo,
  });

  const astrologerEmail = astrologer?.privateDetails.email;
  if (astrologerEmail) {
    await transporter.sendMail({
      from,
      to: astrologerEmail,
      subject: `नई बुकिंग - ${booking.clientName}`,
      text: astrologerBody,
    });
  }
}

