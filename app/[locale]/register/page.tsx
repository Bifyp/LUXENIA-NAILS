"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export default function RegisterPage() {
  const t = useTranslations("RegisterPage");

  const [step, setStep] = useState<"register" | "verify">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert(t("form.passwordsDontMatch"));
      return;
    }
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (data.ok) setStep("verify");
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, code }),
    });
    const data = await res.json();
    if (data.success) window.location.href = "/login";
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
              Реєстрація
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              {t("hero.titleAccent")}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* FORM */}
      <section className="py-32 -mt-16 relative z-10">
        <div className="container px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <p className="text-gray-600 text-lg">{t("intro.description")}</p>
            </div>

            {/* STEP 1 — REGISTER */}
            {step === "register" && (
              <form onSubmit={handleRegister} className="p-10 bg-white shadow-2xl rounded-3xl space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">{t("form.name.label")} *</label>
                  <input type="text" placeholder={t("form.name.placeholder")} required className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all outline-none" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">{t("form.email.label")} *</label>
                  <input type="email" placeholder={t("form.email.placeholder")} required className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">{t("form.password.label")} *</label>
                  <input type="password" placeholder={t("form.password.placeholder")} required className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <p className="text-gray-500 text-xs mt-2">{t("form.password.hint")}</p>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">{t("form.confirmPassword.label")} *</label>
                  <input type="password" placeholder={t("form.confirmPassword.placeholder")} required className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all outline-none" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" required className="w-4 h-4 mt-1 accent-rose-500 rounded" />
                  <label className="text-gray-600 text-sm">
                    {t("form.terms")}{" "}
                    <a href="/terms" className="text-rose-600 hover:text-rose-700 font-medium">{t("form.termsLink")}</a>{" "}
                    {t("form.and")}{" "}
                    <a href="/privacy" className="text-rose-600 hover:text-rose-700 font-medium">{t("form.privacyLink")}</a>
                  </label>
                </div>
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  {t("form.registerButton")}
                </button>
                <p className="text-center text-gray-500 text-sm mt-6">
                  {t("form.haveAccount")}{" "}
                  <a href="/login" className="text-rose-600 hover:text-rose-700 font-semibold">{t("form.loginLink")}</a>
                </p>
              </form>
            )}

            {/* STEP 2 — VERIFY CODE */}
            {step === "verify" && (
              <form onSubmit={handleVerify} className="p-10 bg-white shadow-2xl rounded-3xl space-y-6">
                <p className="text-center text-gray-700 text-lg mb-6">
                  {t("form.verifyMessage")} <br />
                  <span className="font-semibold text-gray-800">{email}</span>
                </p>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">{t("form.code.label")} *</label>
                  <input type="text" placeholder={t("form.code.placeholder")} required className="border-2 border-gray-200 focus:border-rose-500 p-4 w-full rounded-xl transition-all outline-none text-center text-2xl tracking-widest" value={code} onChange={(e) => setCode(e.target.value)} />
                </div>
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  {t("form.verifyButton")}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">{t("benefits.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {t.raw("benefits.items").map((benefit: any, idx: number) => (
              <div key={idx} className="text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 duration-300">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold mb-3 text-gray-800">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="py-32">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full mb-8">
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">{t("security.title")}</h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto text-lg">{t("security.description")}</p>
          </div>
        </div>
      </section>

    </div>
  );
}
