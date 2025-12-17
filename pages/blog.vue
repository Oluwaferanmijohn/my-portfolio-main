<template>
  <div class="pt-40 pb-20 px-6 md:px-16">
      <h1 class="font-serif text-6xl mb-16 text-center">Journal</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
         <article v-for="i in 3" :key="i" class="group cursor-pointer">
            <div class="aspect-video bg-off-black mb-6 overflow-hidden rounded-sm">
               <img :src="`https://source.unsplash.com/random/800x600?tech,dark&sig=${i}`" class="w-full h-full object-cover opacity-70 group-hover:scale-105 transition duration-500" />
            </div>
            <div class="flex items-center gap-4 text-[10px] text-muted uppercase tracking-widest mb-3">
               <span>Oct 24, 2023</span>
               <span class="w-1 h-1 bg-gold-accent rounded-full"></span>
               <span>Design</span>
            </div>
            <h3 class="font-serif text-2xl mb-3 group-hover:text-gold-accent transition">The Importance of Dark Mode in Modern Web Design</h3>
            <p class="text-xs text-muted leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore...</p>
         </article>
      </div>
  </div>
</template>