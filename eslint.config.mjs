import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Legacy UI debt is warning-only on these existing files; new code stays strict.
  { files: ["app/(admin)/admin/(dashboard)/gallery/page.tsx", "app/(admin)/admin/(dashboard)/packages/page.tsx", "app/(admin)/admin/(dashboard)/translations/AboutPageEditor.tsx", "app/(admin)/admin/(dashboard)/translations/BookingPageEditor.tsx", "app/(admin)/admin/(dashboard)/translations/ContactPageEditor.tsx", "app/(admin)/admin/(dashboard)/translations/ForgotPasswordPageEditor.tsx", "app/(admin)/admin/(dashboard)/translations/GalleryPageEditor.tsx", "app/(admin)/admin/(dashboard)/translations/LoginPageEditor.tsx", "app/(admin)/admin/(dashboard)/translations/PackagesPageEditor.tsx", "app/(admin)/admin/(dashboard)/translations/RegisterPageEditor.tsx", "app/(admin)/admin/(dashboard)/translations/ServicesPageEditor.tsx", "app/(admin)/admin/(dashboard)/translations/ShopPageEditor.tsx", "app/\\[locale\\]/about/page.tsx", "app/\\[locale\\]/account/page.tsx", "app/\\[locale\\]/booking/page.tsx", "app/\\[locale\\]/contact/page.tsx", "app/\\[locale\\]/login/page.tsx", "app/\\[locale\\]/register/page.tsx", "app/api/admin/gallery/upload/route.ts", "auth.ts", "components/LazyImage.tsx", "components/hooks/usePagePhoto.ts", "lib/api-response.ts", "lib/auth-middleware.ts", "src/i18n/request.ts"], rules: { "@typescript-eslint/no-explicit-any": "warn" } },
  { files: ["app/(admin)/admin/(dashboard)/bookings/page.tsx", "app/(admin)/admin/(dashboard)/gallery/page.tsx", "app/(admin)/admin/(dashboard)/packages/page.tsx", "app/(admin)/admin/(dashboard)/security/page.tsx", "app/(admin)/admin/(dashboard)/services/page.tsx", "app/(admin)/admin/(dashboard)/translations/HomePageEditor.tsx", "components/LanguageProvider.tsx", "components/admin/TranslationEditor.tsx", "components/admin/editor-shared.tsx", "components/layout/Header.tsx"], rules: { "react-hooks/set-state-in-effect": "warn" } },
  { files: ["app/(admin)/admin/(dashboard)/translations/ShopPageEditor.tsx"], rules: { "react-hooks/set-state-in-effect": "warn" } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
