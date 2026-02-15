'use client';
import { useTranslations } from 'next-intl';
export default function PackagesPage() {
  return (
    <div className="overflow-hidden">

      {/* HERO */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center fade-in bg-milk">
        <div className="container text-center relative z-10 px-6">
          <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">
            Выгодные предложения
          </span>
          <h1 className="text-6xl md:text-7xl font-serif mb-8 text-graphite leading-tight">
            Пакеты<br/>
            <span className="text-gold italic">процедур</span>
          </h1>
          <div className="w-20 h-px bg-gold mx-auto mt-6"></div>
          <p className="text-lg text-graphite/70 font-sans mt-8 max-w-2xl mx-auto">
            Экономьте до 20% при покупке курса процедур
          </p>
        </div>
      </section>

      {/* ПАКЕТЫ */}
      <section className="py-32 fade-up">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">

            {/* Старт */}
            <div className="group relative p-10 border-2 border-gold/30 hover:border-gold rounded-lg text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white px-6 py-2 border-2 border-gold/30 group-hover:border-gold rounded-full transition-all duration-300">
                  <span className="text-graphite/60 uppercase tracking-wider text-xs font-sans">Начало пути</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-4xl font-serif mb-4 text-graphite">Старт</h3>
                <p className="text-graphite/70 mb-8 text-lg font-sans">
                  3 процедуры на выбор
                </p>
                
                <div className="mb-8">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-5xl font-serif text-gold">350</span>
                    <span className="text-2xl text-graphite/50">PLN</span>
                  </div>
                  <p className="text-graphite/50 text-sm line-through">400 PLN</p>
                  <p className="text-gold text-sm mt-1">Экономия 50 PLN</p>
                </div>

                <ul className="text-left space-y-3 mb-8">
                  {[
                    "3 любые процедуры",
                    "Консультация в подарок",
                    "Скидка 10% на средства",
                    "Действует 3 месяца"
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-gold text-lg mt-1">✓</span>
                      <span className="text-graphite/70 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <a 
                  href="/booking" 
                  className="inline-block w-full px-8 py-4 bg-gold text-white font-sans uppercase tracking-widest text-sm rounded-md transition-all duration-300 hover:bg-graphite hover:shadow-xl group-hover:-translate-y-1"
                >
                  Выбрать пакет
                </a>
              </div>
            </div>

            {/* Премиум - ПОПУЛЯРНЫЙ */}
            <div className="group relative p-10 border-2 border-gold rounded-lg text-center transition-all duration-500 shadow-2xl hover:shadow-3xl hover:-translate-y-2 bg-white scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gold text-white text-xs uppercase tracking-widest rounded-full shadow-lg">
                Популярный выбор
              </div>

              <div className="mt-8">
                <h3 className="text-4xl font-serif mb-4 text-graphite">Премиум</h3>
                <p className="text-graphite/70 mb-8 text-lg font-sans">
                  5 процедур на выбор
                </p>
                
                <div className="mb-8">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-6xl font-serif text-gold">550</span>
                    <span className="text-2xl text-graphite/50">PLN</span>
                  </div>
                  <p className="text-graphite/50 text-sm line-through">700 PLN</p>
                  <p className="text-gold text-sm mt-1">Экономия 150 PLN</p>
                </div>

                <ul className="text-left space-y-3 mb-8">
                  {[
                    "5 любых процедур",
                    "Бесплатная консультация",
                    "Скидка 15% на средства",
                    "Персональный план ухода",
                    "Действует 6 месяцев"
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-gold text-lg mt-1">✓</span>
                      <span className="text-graphite/70 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <a 
                  href="/booking" 
                  className="inline-block w-full px-8 py-4 bg-gold text-white font-sans uppercase tracking-widest text-sm rounded-md transition-all duration-300 hover:bg-graphite hover:shadow-xl group-hover:-translate-y-1"
                >
                  Выбрать пакет
                </a>
              </div>
            </div>

            {/* VIP */}
            <div className="group relative p-10 border-2 border-gold/30 hover:border-gold rounded-lg text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white px-6 py-2 border-2 border-gold/30 group-hover:border-gold rounded-full transition-all duration-300">
                  <span className="text-graphite/60 uppercase tracking-wider text-xs font-sans">Максимум заботы</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-4xl font-serif mb-4 text-graphite">VIP</h3>
                <p className="text-graphite/70 mb-8 text-lg font-sans">
                  8 процедур на выбор
                </p>
                
                <div className="mb-8">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-5xl font-serif text-gold">850</span>
                    <span className="text-2xl text-graphite/50">PLN</span>
                  </div>
                  <p className="text-graphite/50 text-sm line-through">1100 PLN</p>
                  <p className="text-gold text-sm mt-1">Экономия 250 PLN</p>
                </div>

                <ul className="text-left space-y-3 mb-8">
                  {[
                    "8 любых процедур",
                    "Консультации без ограничений",
                    "Скидка 20% на средства",
                    "VIP-сопровождение",
                    "Приоритетная запись",
                    "Действует 9 месяцев"
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-gold text-lg mt-1">✓</span>
                      <span className="text-graphite/70 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <a 
                  href="/booking" 
                  className="inline-block w-full px-8 py-4 bg-gold text-white font-sans uppercase tracking-widest text-sm rounded-md transition-all duration-300 hover:bg-graphite hover:shadow-xl group-hover:-translate-y-1"
                >
                  Выбрать пакет
                </a>
              </div>
            </div>

          </div>

          <div className="mt-16 text-center">
            <p className="text-graphite/60 font-sans text-sm">
              * Пакеты действительны в течение указанного срока с момента покупки<br/>
              ** Процедуры можно комбинировать по вашему желанию
            </p>
          </div>
        </div>
      </section>

      {/* СПЕЦИАЛЬНЫЕ ПРОГРАММЫ */}
      <section className="py-32 bg-milk fade-left">
        <div className="container px-6">
          <div className="text-center mb-20">
            <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">
              Тематические курсы
            </span>
            <h2 className="text-5xl font-serif text-graphite">Специальные программы</h2>
            <div className="w-20 h-px bg-gold mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {[
              {
                title: "Anti-Age Программа",
                sessions: "6 процедур",
                price: "1200 PLN",
                oldPrice: "1450 PLN",
                desc: "Комплексный уход против возрастных изменений",
                includes: [
                  "2 сеанса мезотерапии",
                  "2 сеанса массажа лица",
                  "2 химических пилинга",
                  "Домашний уход в подарок"
                ]
              },
              {
                title: "Проблемная кожа",
                sessions: "5 процедур",
                price: "950 PLN",
                oldPrice: "1150 PLN",
                desc: "Интенсивная программа для борьбы с акне",
                includes: [
                  "3 глубокие чистки",
                  "2 миндальных пилинга",
                  "Консультация дерматолога",
                  "План домашнего ухода"
                ]
              }
            ].map((program, idx) => (
              <div 
                key={idx}
                className="group relative bg-graphite text-white p-10 overflow-hidden transition-all duration-500 hover:shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative z-10">
                  <span className="text-gold/80 uppercase tracking-wider text-xs font-sans mb-2 block">
                    {program.sessions}
                  </span>
                  
                  <h3 className="text-3xl font-serif mb-4 text-white">
                    {program.title}
                  </h3>

                  <p className="text-white/70 mb-8 leading-relaxed">
                    {program.desc}
                  </p>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="text-4xl font-serif text-gold">{program.price}</span>
                      <span className="text-white/40 line-through text-xl">{program.oldPrice}</span>
                    </div>
                    <p className="text-gold/80 text-sm">
                      Экономия {parseInt(program.oldPrice) - parseInt(program.price)} PLN
                    </p>
                  </div>

                  <div className="border-t border-white/20 pt-6 mb-8">
                    <h4 className="text-white/90 font-sans font-semibold mb-4 text-sm uppercase tracking-wider">
                      Что входит:
                    </h4>
                    <ul className="space-y-2">
                      {program.includes.map((item, iidx) => (
                        <li key={iidx} className="flex items-start gap-3">
                          <span className="text-gold text-lg mt-1">✓</span>
                          <span className="text-white/80 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a 
                    href="/booking" 
                    className="inline-block w-full text-center px-8 py-4 bg-gold text-white font-sans uppercase tracking-wider text-sm transition-all duration-300 hover:bg-white hover:text-graphite"
                  >
                    Записаться на курс
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА ПАКЕТОВ */}
      <section className="py-32 fade-right">
        <div className="container px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-serif text-graphite mb-6">
              Почему выгодно покупать пакеты
            </h2>
            <div className="w-20 h-px bg-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "💰",
                title: "Экономия",
                desc: "Сохраните до 20% по сравнению с разовыми визитами"
              },
              {
                icon: "📈",
                title: "Результат",
                desc: "Регулярный уход даёт стабильный и долгосрочный эффект"
              },
              {
                icon: "🎁",
                title: "Бонусы",
                desc: "Консультации и скидки на профессиональную косметику"
              },
              {
                icon: "⏰",
                title: "Гибкость",
                desc: "Используйте процедуры в удобное для вас время"
              }
            ].map((benefit, idx) => (
              <div 
                key={idx}
                className="text-center group"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-serif mb-3 text-graphite">
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

      {/* CTA */}
      <section className="py-32 bg-graphite text-white fade-up">
        <div className="container px-6 text-center">
          <h2 className="text-5xl font-serif mb-8">
            Не уверены, какой пакет<br/>
            <span className="text-gold italic">выбрать</span>?
          </h2>
          
          <p className="text-white/80 font-sans mb-12 text-lg max-w-2xl mx-auto">
            Запишитесь на бесплатную консультацию, и мы поможем 
            подобрать оптимальную программу для вашей кожи
          </p>

          <div className="flex gap-6 justify-center items-center flex-wrap">
            <a 
              href="/booking" 
              className="group relative px-10 py-4 bg-gold text-white font-sans uppercase tracking-widest text-sm rounded-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-gold/30 hover:-translate-y-1"
            >
              <span className="relative z-10">Бесплатная консультация</span>
              <div className="absolute inset-0 bg-white text-graphite transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </a>

            <a 
              href="tel:+48123456789" 
              className="px-10 py-4 border-2 border-gold text-gold font-sans uppercase tracking-widest text-sm rounded-sm transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-1"
            >
              Позвонить
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
