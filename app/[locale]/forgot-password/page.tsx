"use client";
import Link from "next/link";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const t = useTranslations("ForgotPasswordPage");

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [done, setDone] = useState(false);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const locale = useLocale();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (res.ok) setSent(true); else setError(t('requestError'));
    } catch { setError(t('requestError')); }
    finally { setBusy(false); }
  }
  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code, password }) });
      if (res.ok) { setDone(true); setPassword(''); setCode(''); } else setError(t('verificationError'));
    } catch { setError(t('requestError')); }
    finally { setBusy(false); }
  }

  return (
    <div className="overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        <div className="container relative z-10 px-6 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              Відновлення
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              {t("title")}
            </h1>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <section className="py-32 -mt-16 relative z-10">
        <div className="container px-6">
          <div className="max-w-md mx-auto bg-white p-10 shadow-2xl rounded-3xl">

            {error && <p role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
            {!sent ? (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full mb-6">
                    <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-lg">
                    {t("description")}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-2">
                      {t("emailLabel")}
                    </label>
                    <input
                      type="email"
                      required
                      className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all outline-none"
                      placeholder={t("emailPlaceholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    {t("submit")}
                  </button>

                  <div className="text-center">
                    <Link href={`/${locale}/login`} className="text-rose-600 hover:text-rose-700 text-sm font-medium">
                      ← Назад до входу
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("sentTitle")}</h2>
                <p role="status" className="text-gray-600 mb-8">{done ? t('resetDone') : t('codeDescription')}</p>
                {!done && <form onSubmit={handleReset} className="space-y-4 text-left mb-8">
                  <label className="block">{t('codeLabel')}
                    <input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} className="border-2 p-4 w-full rounded-xl" />
                  </label>
                  <label className="block">{t('newPasswordLabel')}
                    <input required type="password" minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-2 p-4 w-full rounded-xl" />
                  </label>
                  <button disabled={busy} className="w-full py-4 bg-rose-500 text-white rounded-full">{t('resetButton')}</button>
                </form>}
                <Link href={`/${locale}/login`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Повернутися до входу
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            )}

          </div>
        </div>
      </section>

    </div>
  );
}
