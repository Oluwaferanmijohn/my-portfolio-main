<script setup>
import { ref } from 'vue'

// State to track if the mobile menu is open
const isOpen = ref(false)

// Function to close menu when a link is clicked (optional UX improvement)
const closeMenu = () => {
  isOpen.value = false
}
</script>

<template>
  <nav class="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-max max-w-[90vw]">
    
    <div class="px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-between gap-4 md:gap-8 shadow-lg">
      
      <NuxtLink to="/" class="text-cream font-bold tracking-widest text-sm shrink-0" @click="closeMenu">
        OLUWAFERNMI.
      </NuxtLink>
      
      <div class="hidden md:flex items-center gap-6 text-xs tracking-wide text-gray-300">
        <NuxtLink to="/services" class="hover:text-cream transition" active-class="text-gold-accent">SERVICES</NuxtLink>
        <NuxtLink to="/work" class="hover:text-cream transition" active-class="text-gold-accent">WORK</NuxtLink>
        <NuxtLink to="/about" class="hover:text-cream transition" active-class="text-gold-accent">ABOUT</NuxtLink>
        <NuxtLink to="/blog" class="hover:text-cream transition" active-class="text-gold-accent">BLOG</NuxtLink>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink to="/contact" @click="closeMenu"> 
          <button class="bg-cream text-rich-black px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-white transition whitespace-nowrap">
            LET'S TALK
          </button>
        </NuxtLink>

        <button 
          @click="isOpen = !isOpen" 
          class="md:hidden text-cream p-1 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div 
        v-if="isOpen" 
        class="md:hidden w-full bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-4 shadow-xl"
      >
        <NuxtLink to="/services" @click="closeMenu" class="text-gray-300 hover:text-cream text-sm tracking-wide" active-class="text-gold-accent">SERVICES</NuxtLink>
        <NuxtLink to="/work" @click="closeMenu" class="text-gray-300 hover:text-cream text-sm tracking-wide" active-class="text-gold-accent">WORK</NuxtLink>
        <NuxtLink to="/about" @click="closeMenu" class="text-gray-300 hover:text-cream text-sm tracking-wide" active-class="text-gold-accent">ABOUT</NuxtLink>
        <NuxtLink to="/blog" @click="closeMenu" class="text-gray-300 hover:text-cream text-sm tracking-wide" active-class="text-gold-accent">BLOG</NuxtLink>
      </div>
    </transition>

  </nav>
</template>