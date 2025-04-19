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
      { link: "/gundem", text: "Gündem" },
      {
        text: "Eylem Bilgileri",
        items: [
          { link: "/hazirlik", text: "Hazırlık" },
          { link: "/eylem", text: "Eylem" },
          { link: "/kortej", text: "Kortej" },
          { link: "/antiasit", text: "Anti-Asit" },
          { link: "/ilkyardim", text: "İlk Yardım" },
          { link: "/polis-taktikleri", text: "Polis Taktikleri" },
        ],
      },
      {
        text: "Hukuki Kaynaklar",
        items: [
          { link: "/hukuk", text: "Yasal Bilgiler" },
          { link: "/hukuk-numaralari", text: "Avukat/Baro Numaraları" },
        ],
      },
      {
        text: "Diğer",
        items: [
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
          mediaFolder: 'docs/public/images',
          publicFolder: '/images',
          collections: [
            {
              name: 'eylem_bilgileri',
              label: 'Eylem Bilgileri',
              folder: 'docs',
              create: true,
              slug: '{{slug}}',
              fields: [
                { label: 'Başlık', name: 'title', widget: 'string' },
                { label: 'İçerik', name: 'body', widget: 'markdown' }
              ]
            },
            {
              name: 'hukuki_kaynaklar',
              label: 'Hukuki Kaynaklar',
              folder: 'docs',
              create: true,
              slug: '{{slug}}',
              fields: [
                { label: 'Başlık', name: 'title', widget: 'string' },
                { label: 'İçerik', name: 'body', widget: 'markdown' }
              ]
            },
            {
              name: 'diger',
              label: 'Diğer',
              folder: 'docs',
              create: true,
              slug: '{{slug}}',
              fields: [
                { label: 'Başlık', name: 'title', widget: 'string' },
                { label: 'İçerik', name: 'body', widget: 'markdown' }
              ]
            },
            {
              name: 'gundem',
              label: 'Gündem',
              folder: 'docs',
              create: true,
              slug: '{{slug}}',
              fields: [
                { label: 'Başlık', name: 'title', widget: 'string' },
                { label: 'İçerik', name: 'body', widget: 'markdown' }
              ]
            },
            {
              name: 'anasayfa',
              label: 'Ana Sayfa',
              folder: 'docs',
              create: false,
              slug: '{{slug}}',
              fields: [
                { label: 'Başlık', name: 'title', widget: 'string' },
                { label: 'İçerik', name: 'body', widget: 'markdown' }
              ]
            },
             {
              name: 'iletisim_bilgileri',
              label: 'İletişim Bilgileri',
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
