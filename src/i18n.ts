import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

export const resources = {
  en: {
    translation: {
      common: {
        language: "Language",
        languageShort: "EN",
        english: "English",
        vietnamese: "Vietnamese",
        toggleTheme: "Toggle theme",
        light: "Light",
        dark: "Dark",
        system: "System",
      },
      nav: {
        dashboard: "Dashboard",
        audience: "Audience",
        strategy: "Strategy",
        finance: "Finance",
        automation: "Automation",
      },
      app: {
        reports: "Reports",
        settings: "Settings",
      },
      actions: {
        signIn: "Sign in",
        signOut: "Sign out",
        startCreating: "Start creating",
        export: "Export",
        filter: "Filter",
        approve: "Approve",
        reject: "Reject",
      },
    },
  },
  vi: {
    translation: {
      common: {
        language: "Ngôn ngữ",
        languageShort: "VI",
        english: "Tiếng Anh",
        vietnamese: "Tiếng Việt",
        toggleTheme: "Đổi giao diện",
        light: "Sáng",
        dark: "Tối",
        system: "Hệ thống",
      },
      nav: {
        dashboard: "Tổng quan",
        audience: "Khách hàng mục tiêu",
        strategy: "Chiến lược",
        finance: "Tài chính",
        automation: "Tự động hóa",
      },
      app: {
        reports: "Báo cáo",
        settings: "Cài đặt",
      },
      actions: {
        signIn: "Đăng nhập",
        signOut: "Đăng xuất",
        startCreating: "Bắt đầu tạo",
        export: "Xuất dữ liệu",
        filter: "Lọc",
        approve: "Phê duyệt",
        reject: "Từ chối",
      },
    },
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "vi"],
    load: "languageOnly",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lang",
      lookupLocalStorage: "insightforce_lang",
      caches: ["localStorage"],
    },
  });

export default i18n;
