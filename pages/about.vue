<template>
  <div class="pt-40 pb-20 px-6 md:px-16">
    <div class="flex flex-col md:flex-row items-center gap-12 mb-32">
      <div class="w-full md:w-1/3">
        <div class="relative aspect-[3/4] overflow-hidden rounded-sm">
          <div
            class="absolute inset-0 bg-gradient-to-b from-transparent to-rich-black z-10"
          ></div>
          <img
            src="../assets/image/7.png"
            class="w-full h-full object-cover grayscale opacity-90"
            alt="Portrait"
          />
        </div>
      </div>
      <div class="w-full md:w-2/3 md:pl-10 text-center md:text-left">
        <h1 class="font-serif text-6xl md:text-8xl leading-tight mb-8">
          Oluwaferanmi <br />
          <span class="italic text-gold-accent">John</span>
        </h1>
        <p
          class="text-muted text-sm md:text-base max-w-md leading-relaxed mb-8"
        >
          Delivering Premium Web Design and Development Services to Boost Your
          Online Presence.
        </p>
        <div class="flex gap-4 justify-center md:justify-start">
          <div class="border border-white/10 px-6 py-4 rounded-sm text-center">
            <span class="block text-2xl font-serif text-cream">4+</span>
            <span class="text-[10px] uppercase tracking-widest text-muted"
              >Years Exp.</span
            >
          </div>
          <div class="border border-white/10 px-6 py-4 rounded-sm text-center">
            <span class="block text-2xl font-serif text-cream">20+</span>
            <span class="text-[10px] uppercase tracking-widest text-muted"
              >Projects</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
      <div>
        <span class="text-xs uppercase tracking-widest text-muted mb-4 block"
          >Who I Am</span
        >
        <h2 class="font-serif text-4xl mb-6">
          Bridging the Gap Between Complex Backends and Beautiful Interfaces.
        </h2>
        <p class="text-sm text-muted leading-loose mb-6">
          As a Full Stack Developer specialized in the Vue ecosystem, I offer
          more than just code. I combine the technical depth of Nuxt 3 and
          Node.js with the creative eye of a Graphic Designer. I build bespoke
          applications that are not only visually stunning but engineered to
          scale.
        </p>
        <p class="text-sm text-muted leading-loose">
          I believe in a complete development lifecycle. Whether it's designing
          a database schema in Supabase or crafting the brand identity in
          Photoshop, I work directly with you to transform abstract ideas into
          deployed, high-performance products.
        </p>
      </div>
      <div class="relative">
        <img
          src="../assets/image/5.png"
          class="w-full h-auto rounded-sm opacity-80 grayscale"
          alt="Working"
        />
      </div>
    </div>

    <div class="border-t border-white/10 pt-20">
      <h3 class="font-serif text-3xl mb-12">Experience</h3>

      <div class="space-y-6">
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-white/5 group hover:bg-white/5 px-4 transition"
        >
          <div class="mb-2 md:mb-0">
            <h4 class="text-lg font-serif"> Software Developer Intern </h4>
            <span class="text-xs text-muted"> KINPLUS TECHNOLOGIES </span>
          </div>
          <span class="text-xs text-muted">2022 - 2023</span>
        </div>
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-white/5 group hover:bg-white/5 px-4 transition"
        >
          <div class="mb-2 md:mb-0">
            <h4 class="text-lg font-serif">Frontend Developer Instructor </h4>
            <span class="text-xs text-muted">TechStart Solutions</span>
          </div>
          <span class="text-xs text-muted">Jan 2025 - July 2025</span>
        </div>
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-white/5 group hover:bg-white/5 px-4 transition"
        >
          <div class="mb-2 md:mb-0">
            <h4 class="text-lg font-serif">Freelance Designer</h4>
            <span class="text-xs text-muted">Remote</span>
          </div>
          <span class="text-xs text-muted">2023 - Present</span>
        </div>
      </div>
    </div>
  </div>
</template>
