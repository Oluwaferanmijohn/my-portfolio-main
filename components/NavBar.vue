<template>
  <nav class="fixed top-6 left-1/2 -translate-x-1/2 z-50">
    <div class="px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-8 shadow-lg">
      
      <NuxtLink to="/" class="text-cream font-bold tracking-widest text-sm">OLUWAFERNMI.</NuxtLink>
      
      <div class="hidden md:flex items-center gap-6 text-xs tracking-wide text-gray-300">
        <NuxtLink to="/services" class="hover:text-cream transition" active-class="text-gold-accent">SERVICES</NuxtLink>
        <NuxtLink to="/work" class="hover:text-cream transition" active-class="text-gold-accent">WORK</NuxtLink>
        <NuxtLink to="/about" class="hover:text-cream transition" active-class="text-gold-accent">ABOUT</NuxtLink>
        <NuxtLink to="/blog" class="hover:text-cream transition" active-class="text-gold-accent">BLOG</NuxtLink>
      </div>

      <button class="bg-cream text-rich-black px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-white transition">
        LET'S TALK
      </button>
    </div>
  </nav>
</template>