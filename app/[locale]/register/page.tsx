"use client";
import { useTranslations } from 'next-intl';
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }

    await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    window.location.href = "/login";
  }

  return (
    <div className="overflow-hidden">

      {/* HERO */}
      <section className="relative w-full min-h-[40vh] flex items-center justify-center fade-in bg-milk">
        <div className="container text-center relative z-10 px-6">
          <h1 className="text-6xl md:text-7xl font-serif mb-8 text-graphite leading-tight">
            Создать<br/>
            <span className="text-gold italic">аккаунт</span>
          </h1>
          <div className="w-20 h-px bg-gold mx-auto mt-6"></div>
        </div>
      </section>

      {/* ФОРМА РЕГИСТРАЦИИ */}
      <section className="py-32 fade-up">
        <div className="container px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <p className="text-graphite/70 font-sans text-lg">
                Присоединяйтесь к LumaSkin и получите доступ к<br/>
                эксклюзивным предложениям
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-10 bg-white shadow-2xl rounded-lg border border-gold/20 space-y-6"
            >
              <div>
                <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                  Имя и фамилия *
                </label>
                <input
                  type="text"
                  placeholder="Анна Ковальска"
                  required
                  className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="example@mail.com"
                  required
                  className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                  Пароль *
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-graphite/50 text-xs mt-2">
                  Минимум 8 символов
                </p>
              </div>

              <div>
                <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                  Подтвердите пароль *
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  required
                  className="w-4 h-4 mt-1 accent-gold"
                />
                <label className="text-graphite/60 text-sm">
                  Я принимаю{" "}
                  <a href="/terms" className="text-gold hover:underline">
                    условия использования
                  </a>
                  {" "}и{" "}
                  <a href="/privacy" className="text-gold hover:underline">
                    политику конфиденциальности
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="group relative bg-gold text-white w-full py-4 rounded-md font-sans uppercase tracking-widest text-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <span className="relative z-10">Зарегистрироваться</span>
                <div className="absolute inset-0 bg-graphite transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gold/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-graphite/50 uppercase tracking-wider">или</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => signIn("google")}
                className="border-2 border-gold/30 text-graphite w-full py-4 rounded-md font-sans uppercase tracking-widest text-sm transition-all duration-300 hover:border-gold hover:bg-gold/5 hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                Регистрация через Google
              </button>

              <p className="text-center text-graphite/50 text-sm mt-6">
                Уже есть аккаунт?{" "}
                <a href="/login" className="text-gold hover:underline font-semibold">
                  Войти
                </a>
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ЧТО ВАС ЖДЁТ */}
      <section className="py-32 bg-milk fade-left">
        <div className="container px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-graphite mb-6">
              Что вас ждёт после регистрации
            </h2>
            <div className="w-20 h-px bg-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "🎉",
                title: "Приветственный бонус",
                desc: "Скидка 10% на первую процедуру"
              },
              {
                icon: "📱",
                title: "Личный кабинет",
                desc: "Управляйте записями онлайн"
              },
              {
                icon: "💌",
                title: "Эксклюзивы",
                desc: "Спецпредложения только для вас"
              },
              {
                icon: "🌟",
                title: "Программа лояльности",
                desc: "Накапливайте баллы за визиты"
              }
            ].map((benefit, idx) => (
              <div 
                key={idx}
                className="text-center p-8 bg-white border border-gold/20 transition-all duration-500 hover:border-gold hover:shadow-xl hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-serif mb-3 text-graphite">
                  {benefit.title}
                </h3>
                <p className="text-graphite/70 text-sm leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* БЕЗОПАСНОСТЬ */}
      <section className="py-32 fade-right">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gold/10 rounded-full mb-8">
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="text-3xl font-serif text-graphite mb-6">
              Ваши данные под защитой
            </h2>
            <p className="text-graphite/70 leading-relaxed max-w-2xl mx-auto">
              Мы используем современные технологии шифрования для защиты 
              вашей личной информации. Ваши данные никогда не будут 
              переданы третьим лицам без вашего согласия.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
