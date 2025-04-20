---
title: Eylem Galerisi
description: Türkiye'deki eylemlerden fotoğraflar
---

# Eylem Fotoğraf Galerisi

<div class="gallery-page">
  <div class="masonry-gallery">
    <div v-for="i in 14" :key="i" class="gallery-item">
      <img :src="`/images/gallery/${i}.${i === 3 ? 'png' : 'jpg'}`" :alt="`Protesto fotoğrafı ${i}`" loading="lazy" />
    </div>
  </div>
</div>

<style>
.gallery-page {
  padding: 2rem 0;
  max-width: 1152px;
  margin: 0 auto;
}

.masonry-gallery {
  column-count: 4;
  column-gap: 16px;
  margin: 0 24px;
}

.gallery-item {
  break-inside: avoid;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: inline-block;
  width: 100%;
}

.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  z-index: 1;
}

.gallery-item img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain; 
}

@media (max-width: 1200px) {
  .masonry-gallery {
    column-count: 3;
  }
}

@media (max-width: 900px) {
  .masonry-gallery {
    column-count: 2;
  }
}

@media (max-width: 600px) {
  .masonry-gallery {
    column-count: 1;
  }
}
</style>
