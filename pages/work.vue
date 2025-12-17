<script setup>
const projects = [
  {
    title: "Space",
    cat: "WEB DESIGN",
    img: "https://images.unsplash.com/photo-1614726365723-49cfae92782f?q=80&w=2669&auto=format&fit=crop",
  },
  {
    title: "Nova",
    cat: "WEB DESIGN",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  },
  {
    title: "Sonic",
    cat: "WEB DESIGN",
    img: "https://images.unsplash.com/photo-1629814596144-8d960098df24?q=80&w=2670&auto=format&fit=crop",
  },
  {
    title: "Solar",
    cat: "WEB DESIGN",
    img: "https://images.unsplash.com/photo-1549419164-96869a23c34a?q=80&w=2670&auto=format&fit=crop",
  },
  {
    title: "Aura",
    cat: "DEVELOPMENT",
    img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Mesh",
    cat: "SEO",
    img: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=2000&auto=format&fit=crop",
  },
];
</script>

<template>
  <div class="pt-40 pb-20 px-6 md:px-16">
    <div class="text-center mb-20">
      <h1 class="font-serif text-6xl md:text-8xl mb-6">Work</h1>
      <p class="text-muted max-w-xl mx-auto">
        My latest web design projects and how I can help bring your ideas to
        life.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        v-for="(item, index) in projects"
        :key="index"
        class="group relative cursor-pointer overflow-hidden rounded-sm"
      >
        <div class="aspect-[4/3] bg-off-black overflow-hidden">
          <img
            :src="item.img"
            class="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition duration-700"
            alt="Work"
          />
        </div>
        <div
          class="absolute bottom-0 left-0 w-full p-8 flex justify-between items-end bg-gradient-to-t from-black/90 via-black/50 to-transparent"
        >
          <div>
            <span class="font-serif text-3xl block mb-2">{{ item.title }}</span>
            <span
              class="text-[10px] uppercase tracking-widest text-muted border border-white/20 px-2 py-1 rounded"
              >{{ item.cat }}</span
            >
          </div>
          <div
            class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-cream group-hover:text-black transition"
          >
            <Icon name="ph:arrow-up-right" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
