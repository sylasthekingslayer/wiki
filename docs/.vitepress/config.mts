import { defineConfig, type PageData } from "vitepress";

// Ana sayfadaki kartların sırasına göre navigasyon listesi
// Gündem kaldırıldığı için Hazırlık ile başlıyor
const navigationOrder = [
  { link: '/hazirlik', text: 'Hazırlık' },
  { link: '/eylem', text: 'Eylem' },
  { link: '/kortej', text: 'Kortej' },
  { link: '/ilkyardim', text: 'İlk Yardım' },
  { link: '/polis-taktikleri', text: 'Polis Taktikleri' },
  { link: '/antiasit', text: 'Anti-Asit Formülleri' }, // Başlık index.md'den alındı
  { link: '/hukuk', text: 'Yasal Kaynaklar' }, // Başlık index.md'den alındı
  { link: '/hukuk-numaralari', text: 'Avukat/Baro Numaraları' }, // Başlık index.md'den alındı
  { link: '/boykot', text: 'Boykot' },
  { link: '/topluluklar', text: 'Topluluklar' },
  { link: '/dijital', text: 'Güvenli İletişim' }, // Başlık index.md'den alındı
  { link: '/galeri', text: 'Galeri' }
];

//yorum
export default defineConfig({
  title: "Direniş Wiki",
  titleTemplate: "Direniş Wiki",
  description: "Protestocular için kapsamlı bilgi ve güvenlik kaynağı",
  cleanUrls: true,
  themeConfig: {
    sidebar: [
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
      {
        text: "Diğer Web Siteleri",
        items: [
          { text: "301 Genç", link: "https://www.301genc.com/", target: "_blank" },
          { text: "boykot.web.tr", link: "https://boykot.web.tr/", target: "_blank" },
          { text: "boykotla.app", link: "https://boykotla.app/", target: "_blank" },
          { text: "boykotyap.com", link: "https://boykotyap.com/", target: "_blank" },
          { text: "Direniş Arşivi", link: "https://direnisarsivi.com.tr", target: "_blank" },
          { text: "diren-turkiye Sansürle Mücadele Rehberi Repository", link: "https://github.com/diren-turkiye/diren-turkiye", target: "_blank" },
          { text: "itaatet.me", link: "https://itaatet.me/", target: "_blank" },
          { text: "Özgürlük Haritası", link: "https://www.ozgurlukharitasi.com/", target: "_blank" },
          { text: "protesto.cc", link: "https://protesto.cc/", target: "_blank" },
          //{ text: "Sokaklar Bizim", link: "https://sokaklarbizim.com/", target: "_blank" }, // Bu satır yorumlu kalmalı
          { text: "Velvele", link: "https://velvele.net/", target: "_blank" },
          { text: "Yandaşlar Boykot", link: "https://yandaslarboykot.com/", target: "_blank" },
          { text: "Zulme Tanık Ol", link: "https://zulmetanikol.me/", target: "_blank" },
        ].sort((a, b) => a.text.localeCompare(b.text, 'tr')), // Alfabetik sıralama eklendi
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
    // Decap CMS'i public/admin klasöründen çalıştırdığımız için plugin'e gerek yok.
    // plugins: [ ... ],
    // Decap CMS'in proje kök dizinindeki dosyalara erişebilmesi için izin veriyoruz.
    server: {
      fs: {
        allow: ['..']
      }
    }
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
  // Sayfa verilerini dönüştürerek otomatik prev/next ekleme
  transformPageData(pageData: PageData) {
    const currentPageIndex = navigationOrder.findIndex(
      // pageData.relativePath sonunda '.md' içerir, link ise içermez.
      (item) => item.link === '/' + pageData.relativePath.replace('.md', '')
    );

    if (currentPageIndex !== -1) {
      const prevPage = navigationOrder[currentPageIndex - 1];
      const nextPage = navigationOrder[currentPageIndex + 1];

      if (prevPage) {
        pageData.frontmatter.prev = {
          text: prevPage.text,
          link: prevPage.link
        };
      }
      if (nextPage) {
        pageData.frontmatter.next = {
          text: nextPage.text,
          link: nextPage.link
        };
      }
    }
  }
});
