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
        text: 'Eylem Öncesi',
        items: [
          { link: '/hazirlik', text: 'Genel Hazırlık' },
          { link: '/dijital', text: 'Dijital Güvenlik (VPN/DNS)' }
        ]
      },
      {
        text: 'Eylem Sırasında',
        items: [
          { link: '/eylem', text: 'Eylem Taktikleri' },
          { link: '/kortej', text: 'Kortej Düzeni' },
          { link: '/polis-taktikleri', text: 'Polis Taktikleri' },
          { link: '/ilkyardim', text: 'İlk Yardım' },
          { link: '/antiasit', text: 'Anti-Asit Kullanımı' }
        ]
      },
      {
        text: 'Eylem Sonrası ve Haklar',
        items: [
          { link: '/hukuk', text: 'Yasal Bilgiler' },
          { link: '/hukuk-numaralari', text: 'Avukat/Baro Numaraları' }
        ]
      },
      {
        text: 'Diğer Direniş Yöntemleri',
        items: [
          { link: '/boykot', text: 'Boykot Bilgileri' }
        ]
      },
      {
        text: 'Kaynaklar ve Topluluk',
        items: [
          { link: '/sozluk', text: 'Sözlük / Terimler' },
          { link: '/topluluklar', text: 'Destekçi Topluluklar' },
          { link: '/galeri', text: 'Galeri' },
          { link: '/iletisim', text: 'İletişim' },
          { link: '/katki', text: 'Katkıda Bulunma' }
        ]
      }
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
          publishMode: 'editorial_workflow',
          mediaFolder: 'docs/public/images',
          publicFolder: '/images',
          collections: [
            {
              name: 'pages',
              label: 'Pages',
              folder: 'docs',
              create: true,
              slug: '{{slug}}',
              fields: [
                { label: 'Title', name: 'title', widget: 'string' },
                { label: 'Content', name: 'body', widget: 'markdown' }
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
