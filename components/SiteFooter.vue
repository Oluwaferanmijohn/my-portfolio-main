<template>
  <footer class="bg-off-black/60 border-t border-white/10">
    <div class="page-wrap py-16 md:py-20 flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
      <div><p class="eyebrow">Available for good work</p><h2 class="font-serif text-4xl md:text-5xl mt-3">Let’s build something<br /><span class="italic text-gold-accent">worth using.</span></h2><NuxtLink to="/contact" class="inline-flex items-center gap-2 mt-7 border-b border-gold-accent pb-2 text-xs uppercase tracking-widest">Get in touch ↗</NuxtLink></div>
      <div class="flex flex-col md:items-end gap-4 text-xs text-muted"><a href="mailto:oluwatoyinferanmijohn@gmail.com" class="hover:text-gold-accent">oluwatoyinferanmijohn@gmail.com</a><div class="flex gap-5 uppercase tracking-widest"><NuxtLink to="/work" class="hover:text-cream">Work</NuxtLink><NuxtLink to="/about" class="hover:text-cream">About</NuxtLink><NuxtLink to="/contact" class="hover:text-cream">Contact</NuxtLink></div><p>© {{ new Date().getFullYear() }} Oluwafernmi. Built with care.</p></div>
    </div>
  </footer>
</template>
