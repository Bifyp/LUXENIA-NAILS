"use client";

import { useEffect } from "react";

type Props = {
  children?: React.ReactNode;
  pathname?: string | null;
};

export default function LayoutClient({ children, pathname }: Props) {
  useEffect(() => {
    const selectors = ["section", ".card", ".block", ".item", ".reveal"];
    const elements = document.querySelectorAll(selectors.join(", "));

    elements.forEach((el) => {
      el.classList.remove("visible");
      el.classList.add("reveal", "reveal-up");
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
  }, [pathname]);

  return <>{children}</>;
}