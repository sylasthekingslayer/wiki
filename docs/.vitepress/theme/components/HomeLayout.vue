<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import RandomContent from './RandomContent.vue'

const { frontmatter } = useData()
</script>

<template>
  <DefaultTheme.Layout>
    <template #home-hero-before>
      <div class="hero-top-content">
        <!-- <RandomContent /> -->
      </div>
    </template>
  </DefaultTheme.Layout>
</template>
