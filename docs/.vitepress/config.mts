import { defineConfig } from "vitepress";
import decap, {
  createFolderCollection,
  createField,
} from 'vite-plugin-decap-cms';

export default defineConfig({
  title: "Direniş Wiki",
  titleTemplate: "Direniş Wiki",
  description: "Protestocular için kapsamlı bilgi ve güvenlik kaynağı",
  cleanUrls: true,
  themeConfig: {
    sidebar: [
      {
        text: "Tüm Sayfalar",
        items: [
          { link: "/gundem", text: "Gündem" },
          { link: "/hazirlik", text: "Hazırlık" },
          { link: "/eylem", text: "Eylem" },
          { link: "/kortej", text: "Kortej" },
          { link: "/antiasit", text: "Anti-Asit" },
          { link: "/ilkyardim", text: "İlk Yardım" },
          { link: "/polis-taktikleri", text: "Polis Taktikleri" },
          { link: "/hukuk", text: "Yasal Bilgiler" },
          { link: "/hukuk-numaralari", text: "Avukat/Baro Numaraları" },
          { link: "/sozluk", text: "Sözlük / Terimler" },
          { link: "/boykot", text: "Boykot" },
          { link: "/topluluklar", text: "Topluluklar" },
          { link: "/dijital", text: "VPN/DNS" },
          { link: "/galeri", text: "Galeri" },
        ],
      },
    ],
    footer: {
      message: "Hak, hukuk, adalet!",
    },
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonAriaLabel: "Ara",
            buttonText: "Ara",
          },
          modal: {
            backButtonTitle: "Geri",
            noResultsText: "Sonuç bulunamadı",
            resetButtonTitle: "Sil",
          },
        },
      },
    },
  },

  vite: {
    optimizeDeps: {
      exclude: ["leaflet"],
    },
    plugins: [
      decap({
        config: {
          backend: {
            name: 'github',
            repo: 'sylasthekingslayer/wiki',
            branch: 'main',
            baseUrl: 'https://direnis.net',
            authEndpoint: 'api/auth',
            openAuthoring: true,
            useGraphql: true
          },
          publish_mode: 'editorial_workflow',
          mediaFolder: 'docs/public/images',
          publicFolder: '/images',
          collections: [
            {
              name: 'pages',
              label: 'Tüm Sayfalar',
              folder: 'docs',
              create: true,
              slug: '{{slug}}',
              fields: [
                { label: 'Başlık', name: 'title', widget: 'string' },
                { label: 'İçerik', name: 'body', widget: 'markdown' }
              ]
            }
          ]
        }
      })
    ],
  },

  head: [
    ["link", { rel: "icon", href: "favicon.ico" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
      },
    ],
  ],
});
