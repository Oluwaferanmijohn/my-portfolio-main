<script setup>
const services = [
  { 
    id: '01', 
    title: 'Full-Stack Development', 
    // Price removed
    desc: 'I build complete, production-ready applications from start to finish. Using Nuxt 3 as my backbone, I handle both the client-side interactivity and the server-side logic.',
    features: ['Nuxt 3 / Vue 3', 'Tailwind CSS', 'TypeScript', 'Vercel/Netlify Deployment']
  },
  { 
    id: '02', 
    title: 'Backend & Database', 
    // Price removed
    desc: 'A pretty interface is useless without a solid foundation. I design efficient database schemas and write secure API endpoints to manage your data.',
    features: ['Supabase / MySQL', 'Nuxt Server Routes', 'Node.js / Firebase', 'API Integration']
  },
  { 
    id: '03', 
    title: 'Frontend Engineering', 
    // Price removed
    desc: 'I translate static designs into responsive, interactive web experiences. I focus heavily on performance, accessibility, and pixel-perfect implementation.',
    features: ['Tailwind CSS', 'Headless UI', 'CSS Animations', 'Mobile Responsive']
  },
]
</script>

<template>
  <div class="pt-40 pb-20 px-6 md:px-16">
     <div class="text-center mb-24">
        <h1 class="font-serif text-6xl md:text-7xl mb-6">Services</h1>
        <p class="text-muted">Comprehensive design and development solutions.</p>
     </div>

     <div class="space-y-8">
        <div v-for="service in services" :key="service.id" class="group bg-off-black border border-white/5 p-8 md:p-12 rounded-sm hover:border-white/20 transition flex flex-col md:flex-row gap-10">
           <div class="text-gold-accent font-serif text-4xl opacity-50">{{ service.id }}</div>
           
           <div class="flex-1">
              <h3 class="font-serif text-3xl mb-2">{{ service.title }}</h3>
              <p class="text-sm text-gray-400 mb-6 max-w-md leading-relaxed">{{ service.desc }}</p>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <div v-for="feature in service.features" :key="feature" class="flex items-center gap-2 text-xs text-muted">
                    <Icon name="ph:check-circle" class="text-gold-accent flex-shrink-0" /> 
                    <span>{{ feature }}</span>
                 </div>
              </div>
           </div>

           <div class="flex flex-col justify-end min-w-[200px] border-l border-white/5 pl-0 md:pl-10 pt-10 md:pt-0 border-t md:border-t-0 mt-6 md:mt-0">
               <NuxtLink to="/contact" class="w-full">
                   <button class="text-xs uppercase font-bold border border-white/20 px-6 py-3 rounded-full hover:bg-cream hover:text-black transition w-full whitespace-nowrap">
                       Get Started
                   </button>
               </NuxtLink>
           </div>
        </div>
     </div>
  </div>
</template>