import { getTranslations, getLocale } from "next-intl/server";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Booking {
  id: string;
  date: Date;
  time: string;
  serviceName: string;
  specialistName: string | null;
  status: string;
  price: number | null;
  createdAt: Date;
}

export default async function AccountPage() {
  const locale = await getLocale();
  const t = await getTranslations("AccountPage");

  const session = await auth();
  if (!session?.user) notFound();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      bookings: {
        orderBy: { date: "desc" }
      }
    }
  });

  if (!user) notFound();

  const bookings: Booking[] = user.bookings.map((b: any) => ({
    id: b.id,
    date: b.date,
    time: b.time,
    serviceName: b.serviceName,
    specialistName: b.specialistName ?? null,
    status: b.status,
    price: b.price ?? null,
    createdAt: b.createdAt,
  }));

  const upcomingBookings = bookings.filter(
    (b: Booking) =>
      b.status !== "cancelled" && new Date(b.date) > new Date()
  );

  const pastBookings = bookings.filter(
    (b: Booking) =>
      b.status === "completed" || new Date(b.date) < new Date()
  );

  return (
    <div className="overflow-hidden">

      {/* HERO - Gradient with Pattern */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjcktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
        </div>

        <div className="container relative z-10 px-6 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              {t("subtitle")}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              {t("title")}
            </h1>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <div className="container pb-32 -mt-16 relative z-10 px-6">

        {/* Профиль */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-6">

            {/* Аватар */}
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                {user.name?.charAt(0).toUpperCase() ||
                  user.email.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {user.name || t("profile.guest")}
                </h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* Кнопка настроек */}
            <Link
              href={`/${locale}/account/settings`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {t("profile.editButton")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
          </div>

          {/* Админ-кнопка */}
          {user.role === "admin" && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <Link
                href={`/admin`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {t("admin.button")}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* Предстоящие записи */}
        {upcomingBookings.length > 0 && (
          <div className="mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              {t("bookings.upcoming")}
            </h2>

            <div className="space-y-6">
              {upcomingBookings.map((booking: Booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-rose-500"
                >
                  <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                        {booking.serviceName}
                      </h3>
                      {booking.specialistName && (
                        <p className="text-gray-600 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {booking.specialistName}
                        </p>
                      )}
                    </div>

                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">
                      {t(`bookings.statuses.${booking.status}`)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(booking.date).toLocaleDateString("ru-RU")}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {booking.time}
                    </div>
                    {booking.price && (
                      <div className="flex items-center gap-2 font-bold text-gray-800">
                        <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Intl.NumberFormat("ru-RU", {
                          style: "currency",
                          currency: "RUB",
                          maximumFractionDigits: 0
                        }).format(booking.price)}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 flex-wrap">
                    <Link
                      href={`/${locale}/booking/${booking.id}/reschedule`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      {t("bookings.actions.reschedule")}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </Link>

                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-full font-medium hover:bg-red-100 transition-all duration-300">
                      {t("bookings.actions.cancel")}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* История */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            {t("bookings.history")}
          </h2>

          {pastBookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-2xl">
              <div className="text-6xl mb-6">📅</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {t("bookings.empty")}
              </h3>
              <Link
                href={`/${locale}/booking`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {t("bookings.makeFirst")}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {pastBookings.map((booking: Booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {booking.serviceName}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>{new Date(booking.date).toLocaleDateString("ru-RU")}</span>
                        <span>•</span>
                        <span>{booking.time}</span>
                      </div>

                      {booking.price && (
                        <p className="font-bold text-gray-800">
                          {new Intl.NumberFormat("ru-RU", {
                            style: "currency",
                            currency: "RUB",
                            maximumFractionDigits: 0
                          }).format(booking.price)}
                        </p>
                      )}
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {t(`bookings.statuses.${booking.status}`)}
                    </span>
                  </div>

                  {booking.status === "completed" && (
                    <Link
                      href={`/${locale}/booking?service=${booking.serviceName}`}
                      className="inline-flex items-center gap-2 mt-4 text-rose-600 font-medium hover:gap-4 transition-all duration-300"
                    >
                      {t("bookings.actions.bookAgain")}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
