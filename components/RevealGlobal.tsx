"use client";

import { useEffect } from "react";

export default function RevealGlobal() {
  useEffect(() => {
    // Какие элементы анимировать автоматически
    const selectors = [
      "section",
      ".card",
      ".block",
      ".item",
      ".reveal" // если хочешь вручную
    ];

    const elements = document.querySelectorAll(selectors.join(", "));

    elements.forEach((el) => {
      el.classList.add("reveal", "reveal-up"); // дефолтная анимация
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
