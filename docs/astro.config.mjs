import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://zk33.github.io",
  base: "/fpm-css",
  integrations: [
    starlight({
      title: "FPM CSS Coding Conventions",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/zk33/fpm-css",
        },
      ],
      defaultLocale: "root",
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
        ja: {
          label: "日本語",
          lang: "ja",
        },
      },
      sidebar: [
        {
          label: "Guide",
          translations: { ja: "ガイド" },
          items: [
            { label: "Overview", slug: "index", translations: { ja: "概要" } },
            { label: "Getting Started", slug: "getting-started", translations: { ja: "はじめに" } },
            { label: "Roles", slug: "roles", translations: { ja: "役割分担" } },
          ],
        },
        {
          label: "Reference",
          translations: { ja: "リファレンス" },
          items: [
            { label: "Rule Reference", slug: "reference/rules", translations: { ja: "規約リファレンス" } },
            { label: "Class A Rules", slug: "reference/rules/class-a", translations: { ja: "Class A 規約" } },
            { label: "Class B Rules", slug: "reference/rules/class-b", translations: { ja: "Class B 規約" } },
            { label: "Class C Rules", slug: "reference/rules/class-c", translations: { ja: "Class C 規約" } },
          ],
        },
      ],
    }),
  ],
});
