<script setup>
import { ref, onMounted, computed } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

const quotesList = [
  "Zulme karşı mukavemet!",
  "Hak, hukuk, adalet!",
  "Cehalet, ayrıcalıklı sınıfın ustaca kullandığı bir silahtır.",
  "Kahrolsun istibdat, yaşasın hürriyet!"
]

const imagesList = [
  "/images/1.jpg", "/images/2.jpg", "/images/3.png", "/images/4.jpg", "/images/5.jpg", 
  "/images/6.jpg", "/images/7.jpg", "/images/8.jpg", "/images/9.jpg", "/images/10.jpg", 
  "/images/11.jpg", "/images/12.jpg", "/images/13.jpg", "/images/14.jpg"
]

const currentQuote = ref(quotesList[0])
const currentImage = ref(imagesList[0])

const changeQuoteAndImage = () => {
  const randomQuoteIndex = Math.floor(Math.random() * quotesList.length)
  const randomImageIndex = Math.floor(Math.random() * imagesList.length)
  
  currentQuote.value = quotesList[randomQuoteIndex]
  currentImage.value = imagesList[randomImageIndex]
}

onMounted(() => {
  changeQuoteAndImage()
  setInterval(changeQuoteAndImage, 10000)
})

const background = computed(() => {
  return `url(${currentImage.value})`;
})

// const textColor = computed(() => {
//   return isDark.value ? 'white' : 'var(--vp-c-text-1)'
// })

// const textShadow = computed(() => {
//   return isDark.value 
//     ? '1px 1px 3px rgba(0, 0, 0, 0.3)' 
//     : '1px 1px 3px rgba(0, 0, 0, 0.1)'
// })
</script>

<template>
  <div class="quote-container">
    <div class="fading-background" :style="{ 'background-image': background }"></div>
    <h1 class="quote-text">{{ currentQuote }}</h1>
  </div>
</template>

<style scoped>
.quote-container {
  width: 100%;
  padding-bottom: 2rem;
}

.fading-background {
  transition-duration: 250ms;
  background-size: cover;
  background-position: center center;
  position: absolute;
  z-index: -1;
  height: 40rem;
  left: 0px;
  top: var(--vp-nav-height);
  width: 100%;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));
}

.quote-text {
  padding: 2rem;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: left;
  line-height: 1.2;
  mask-image: unset;
}
</style>
