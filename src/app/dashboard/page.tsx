import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getAllBookings, getBookingsForAstrologer } from "@/lib/bookings-store";
import { findAstrologer } from "@/lib/astrologers-data";
import BookingStatusCell from "@/components/dashboard/BookingStatusCell";
import LogoutButton from "@/components/dashboard/LogoutButton";

export default async function DashboardPage() {
  const session = getSession();
  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.role === "admin";
  const bookings = isAdmin
    ? await getAllBookings()
    : await getBookingsForAstrologer(session.astrologerId!);

  const astrologerProfile =
    !isAdmin && session.astrologerId ? findAstrologer(session.astrologerId) : null;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-purple-200 uppercase">
              {isAdmin ? "Admin Dashboard" : "Astrologer Dashboard"}
            </p>
            <h1 className="text-3xl font-bold mt-1">{session.name}</h1>
          </div>
          <LogoutButton />
        </div>

        {astrologerProfile && (
          <div className="border border-purple-500/30 rounded-2xl p-5 bg-black/40">
            <h2 className="text-xl font-semibold mb-2">{astrologerProfile.name}</h2>
            <p className="text-sm text-purple-200">{astrologerProfile.headline}</p>
            <p className="text-sm text-purple-200">
              उपलब्ध भाषाएं: {astrologerProfile.languages.join(", ")}
            </p>
          </div>
        )}

        <div className="border border-purple-500/30 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-purple-900/40 text-purple-100">
              <tr>
                <th className="py-3 px-4 text-left">ग्राहक</th>
                <th className="py-3 px-4 text-left">तिथि</th>
                <th className="py-3 px-4 text-left">स्लॉट</th>
                {isAdmin && <th className="py-3 px-4 text-left">Astrologer</th>}
                <th className="py-3 px-4 text-left">विषय</th>
                <th className="py-3 px-4 text-left">स्थिति</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td className="py-6 px-4 text-center text-purple-200" colSpan={isAdmin ? 6 : 5}>
                    अभी तक कोई बुकिंग नहीं
                  </td>
                </tr>
              ) : (
                bookings
                  .sort(
                    (a, b) =>
                      new Date(b.appointmentDate).getTime() -
                      new Date(a.appointmentDate).getTime()
                  )
                  .map((booking) => (
                    <tr key={booking.id} className="border-t border-purple-500/10">
                      <td className="py-3 px-4">
                        <div className="font-semibold">{booking.clientName}</div>
                        <div className="text-xs text-purple-300">{booking.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(booking.appointmentDate).toLocaleDateString("hi-IN")}
                      </td>
                      <td className="py-3 px-4">{booking.appointmentSlot}</td>
                      {isAdmin && (
                        <td className="py-3 px-4">{booking.astrologerName}</td>
                      )}
                      <td className="py-3 px-4 truncate max-w-[200px]">{booking.topic}</td>
                      <td className="py-3 px-4 align-top">
                        <BookingStatusCell
                          bookingId={booking.id}
                          initialStatus={booking.status}
                          editable={isAdmin || booking.astrologerId === session.astrologerId}
                        />
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

