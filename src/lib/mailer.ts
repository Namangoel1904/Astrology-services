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
  SEND_ASTRO_EMAILS,
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

आपकी ज्योतिष परामर्श बुकिंग सफल हुई है। विवरण इस प्रकार है:

ज्योतिषी: ${booking.astrologerName}
तारीख: ${booking.appointmentDate}
समय: ${booking.appointmentSlot}
अवधि: ${booking.durationMinutes} मिनट
विषय: ${booking.topic}

जन्म विवरण:
- जन्म तिथि: ${booking.dob}
- जन्म समय: ${booking.tob}
- जन्म स्थान: ${booking.birthplace}

कृपया आगे की प्रक्रिया के लिए यह मेल सुरक्षित रखें।
आपको Zoom कॉल / मीटिंग लिंक और अंतिम निर्देश अलग ईमेल से भेजे जाएंगे, कृपया अपना इनबॉक्स (और स्पैम/प्रमोशन टैब) अवश्य जांचें।

शुभेच्छा,
ज्योतिष परामर्श टीम
`;

  const astrologerBody = `
प्रिय ${astrologer?.name ?? booking.astrologerName},

आपके लिए नई ज्योतिष परामर्श बुकिंग आयी है। विवरण:

ग्राहक: ${booking.clientName}
ईमेल: ${booking.email}
फ़ोन: ${booking.phone}

जन्म विवरण:
- जन्म तिथि: ${booking.dob}
- जन्म समय: ${booking.tob}
- जन्म स्थान: ${booking.birthplace}

तारीख: ${booking.appointmentDate}
समय: ${booking.appointmentSlot}
अवधि: ${booking.durationMinutes} मिनट
विषय: ${booking.topic}

कृपया ग्राहकाशी संपर्क साधून / Zoom लिंक शेयर करून बुकिंग कन्फर्म करें.
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
  const shouldNotifyAstrologer = SEND_ASTRO_EMAILS !== "false";
  if (astrologerEmail && shouldNotifyAstrologer) {
    await transporter.sendMail({
      from,
      to: astrologerEmail,
      subject: `नई बुकिंग - ${booking.clientName}`,
      text: astrologerBody,
    });
  }
}

