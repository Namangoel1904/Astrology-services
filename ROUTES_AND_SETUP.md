# Jyotish Consultancy – Operational Reference ✅

This file captures the URLs, credentials, and day‑to‑day instructions you’ll need while running the new consultation stack.

---

## 1. Frontend Routes
| Purpose | URL | Notes |
| --- | --- | --- |
| Public landing page (dark hero, astrologer list, booking CTA) | `/` | Pulls data from `src/lib/astrologers-data.ts` |
| Individual astrologer detail + booking modal | `/astrologer/[slug]` | Example: `/astrologer/priti-prashant-chandrashekhar` |
| Dashboard (admin or astrologer view) | `/dashboard` | Requires login cookie |
| Login screen | `/login` | Posts to `/api/auth/login` |

## 2. API Routes
| Route | Role |
| --- | --- |
| `POST /api/auth/login` | Validates admin/astrologer credentials, sets signed cookie |
| `POST /api/auth/logout` | Clears session cookie |
| `POST /api/bookings/availability` | Returns free slots for a given astrologer/date |
| `POST /api/bookings/create-order` | Creates Razorpay order, ensures slot is still free |
| `POST /api/bookings/confirm` | Verifies Razorpay signature, stores booking, sends emails |
| `POST /api/bookings/update-status` | Dashboard dropdown to move booking between `pending / confirmed / completed / cancelled` |
| Horoscope APIs | `/api/horoscope/*` as previously documented |

_All routes live under `src/app/api/...` if you need to inspect or customize logic._

---

## 3. Credentials (default)
> **Important**: Change these in `src/lib/astrologers-data.ts` before going live.

### Admin
- Username: `admin`
- Password: `Admin@2025`

### Astrologers
| Name | Username | Password |
| --- | --- | --- |
| Priti Prashant Chandrashekhar | `priti` | `Priti@2025` |
| Dr. Gauri Gopinath Pol | `gauri` | `Gauri@2025` |
| Sanjeevani Ramdurgkar | `sanjeevani` | `Sanjeevani@2025` |
| Nilima Deepak Bauskar | `nilima` | `Nilima@2025` |
| Swati Bajirao Kakulte | `swati` | `Swati@2025` |
| Shakuntala Rajesh Dangat | `shakuntala` | `Shaku@2025` |

---

## 4. FAQ: Extending Astrologer Cards

All astrologer metadata is centralized in `src/lib/astrologers-data.ts`.

### Add a new astrologer
1. Duplicate one of the existing objects in the `astrologers` array.
2. Update:
   - `id` and `slug` (use lowercase hyphenated slugs).
   - `name`, `headline`, bios, languages, `fee`, `sessionMinutes`.
   - `credentials` array and `availabilityTemplate` (weekday numbers use `0=Sunday ... 6=Saturday`).
   - `privateDetails` (DOB, phone, email) and `login` credentials.
3. If you need custom slots, edit the `availabilityTemplate`. The booking modal pulls from this when calling `/api/bookings/availability`.

### Replace profile images
Every card/hero uses `astrologer.avatar`. Update the `avatar` URL inside the same object. You can point to any https image (self-hosted or CDN). Example:
```ts
avatar: "https://drjyotijoshi.com/uploads/astrologers/priti.jpg",
```
Cards on the homepage, detail page, and booking flow will automatically show the new image.

---

## 5. Environment Variables (required)
Set these in `.env.local` (or hosting dashboard) before running `npm run dev` / deploy:
```
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
BOOKING_SESSION_SECRET=change-this-value
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=465
SMTP_USER=notifications@domain.com
SMTP_PASS=********
BOOKING_FROM_EMAIL=notifications@domain.com
BOOKING_REPLY_TO=assistant@domain.com
```
*If SMTP values are missing, the API will still store bookings but email bodies will only log to the console.*

---

## 6. Operational Tips
- Bookings are persisted to `data/bookings.json` (auto-created). Back it up if you change hosts.
- Dashboard status dropdowns hit `/api/bookings/update-status`. Only admins see every booking; astrologers see their own.
- To add WhatsApp or direct call CTAs, edit `src/components/Navigation.tsx` or `src/app/astrologer/[id]/page.tsx`.

Need more automation or content tweaks later? Ping this guide for file paths & entry points. 👍

