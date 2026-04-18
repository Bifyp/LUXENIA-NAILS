"use client";
import { useTranslations } from 'next-intl';
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const t = useTranslations('LoginPage');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signIn("credentials", { email, password, callbackUrl: "/" });
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
              Вхід
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              {t('hero.titleAccent')}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* ФОРМА ВХОДА */}
      <section className="py-32 -mt-16 relative z-10">
        <div className="container px-6">
          <div className="max-w-md mx-auto">
            <form
              onSubmit={handleSubmit}
              className="p-10 bg-white shadow-2xl rounded-3xl space-y-6"
            >
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  {t('form.email.label')}
                </label>
                <input
                  type="email"
                  placeholder={t('form.email.placeholder')}
                  required
                  className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all duration-300 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  {t('form.password.label')}
                </label>
                <input
                  type="password"
                  placeholder={t('form.password.placeholder')}
                  required
                  className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all duration-300 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-rose-500 rounded" />
                  <span className="text-gray-600 text-sm">{t('form.rememberMe')}</span>
                </label>
                <a href="/forgot-password" className="text-rose-600 text-sm hover:text-rose-700 font-medium">
                  {t('form.forgotPassword')}
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {t('form.submitButton')}
              </button>

              <p className="text-center text-gray-500 text-sm mt-6">
                {t('form.noAccount')}{" "}
                <a href="/register" className="text-rose-600 hover:text-rose-700 font-semibold">
                  {t('form.registerLink')}
                </a>
              </p>
            </form>

            <div className="mt-12 text-center">
              <p className="text-gray-600 text-sm">
                {t('form.loginNote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА РЕГИСТРАЦИИ */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              {t('benefits.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {t.raw('benefits.items').map((benefit: any, idx: number) => (
              <div
                key={idx}
                className="text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
