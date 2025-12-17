<script setup>
const services = [
  { 
    id: '01', 
    title: 'Web Design', 
    price: 'Starting at $2,000',
    desc: 'Visually stunning web designs that captivate your audience.',
    features: ['UI/UX Design', 'Interactive Prototypes', 'Mobile Responsive', 'Dark Mode Support']
  },
  { 
    id: '02', 
    title: 'Development', 
    price: 'Starting at $3,500',
    desc: 'Custom web development solutions tailored to your specifications.',
    features: ['Nuxt / Vue.js', 'Tailwind CSS', 'CMS Integration', 'API Connections']
  },
  { 
    id: '03', 
    title: 'SEO & Content', 
    price: 'Starting at $1,500',
    desc: 'Strategies that enhance your online performance.',
    features: ['Keyword Research', 'On-Page SEO', 'Performance Optimization', 'Copywriting']
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
              <p class="text-sm text-muted mb-6 max-w-md">{{ service.desc }}</p>
              
              <div class="grid grid-cols-2 gap-4">
                 <div v-for="feature in service.features" :key="feature" class="flex items-center gap-2 text-xs text-muted">
                    <Icon name="ph:check-circle" class="text-gold-accent" /> {{ feature }}
                 </div>
              </div>
           </div>

           <div class="flex flex-col items-start md:items-end justify-between min-w-[200px] border-l border-white/5 pl-0 md:pl-10 pt-10 md:pt-0 border-t md:border-t-0 mt-6 md:mt-0">
               <span class="text-xs text-muted uppercase tracking-widest mb-2">Investment</span>
               <span class="font-serif text-xl text-cream mb-6">{{ service.price }}</span>
               <button class="text-xs uppercase font-bold border border-white/20 px-6 py-3 rounded-full hover:bg-cream hover:text-black transition w-full">Get Started</button>
           </div>
        </div>
     </div>
  </div>
</template>