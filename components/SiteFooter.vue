<template>
  <footer class="relative pt-32 pb-10 overflow-hidden bg-rich-black text-cream">
    <div class="flex justify-center items-center px-4 md:px-10 opacity-30 text-gold-accent font-serif italic text-4xl md:text-8xl whitespace-nowrap overflow-hidden mb-10 select-none">
      <!-- <span>Oluwaferanmi</span> -->
      <div class="w-32 h-32 md:w-40 md:h-40 rounded-full mx-10 overflow-hidden grayscale opacity-50 border border-white/10">
         <img src="../assets/image/7.png "  class="w-full h-full object-cover" />
      </div>
      <!-- <span>John</span> -->
    </div>

    <div class="text-center mt-20 mb-32">
      <h2 class="font-serif text-5xl md:text-7xl mb-4">Let's make your <br/><span class="italic text-cream">Website shine</span></h2>
      <p class="text-muted text-sm mb-10">Premium web design, webflow, and SEO services.</p>
      <NuxtLink to="/contact" class="bg-cream text-rich-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition hover:scale-105 inline-block">
        Let's Talk
      </NuxtLink>
    </div>

    <div class="border-t border-white/10 pt-10 px-10 flex flex-col md:flex-row justify-between items-center text-xs text-muted gap-6">
      <div class="flex gap-4">
        <a href="https://www.instagram.com/drealphenry/" target="_blank" class="hover:text-white transition">INSTAGRAM</a>
        <a href="#" class="hover:text-white transition">TWITTER</a>
        <a href="https://www.tiktok.com/@drealphenry" target="_blank" class="hover:text-white transition">TIKTOK</a>
        <a href="#" class="hover:text-white transition">FACEBOOK</a>
        <a href="#" class="hover:text-white transition">LINKEDIN</a>
      </div>
      <div class="flex gap-8">
         <NuxtLink to="/" class="hover:text-white transition">HOME</NuxtLink>
         <NuxtLink to="/services" class="hover:text-white transition">SERVICES</NuxtLink>
         <NuxtLink to="/about" class="hover:text-white transition">ABOUT</NuxtLink>
      </div>
      <button @click="scrollToTop" class="bg-cream text-rich-black px-4 py-2 rounded font-bold hover:bg-white transition">TOP</button>
    </div>
  </footer>
</template>

<script setup>
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>