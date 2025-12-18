<script setup>
const formData = ref({
  name: '',
  email: '',
  message: ''
})
</script>

<template>
  <div class="pt-32 pb-20 px-6 md:px-16 min-h-screen">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      
      <div class="relative h-[700px] w-full hidden lg:block rounded-sm overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-t from-rich-black via-transparent to-transparent z-10"></div>
        <img src="../assets/image/5.png" class="w-full h-full object-cover grayscale opacity-80" alt="Contact Portrait">
      </div>

      <div>
        <span class="text-xs uppercase tracking-widest text-muted mb-4 block">Contact</span>
        <h1 class="font-serif text-5xl md:text-6xl mb-12">Let's get in <span class="italic text-gold-accent">touch.</span></h1>

        <form class="space-y-6 mb-16">
          <div>
            <label class="block text-xs uppercase tracking-widest text-muted mb-2">Name</label>
            <input type="text" v-model="formData.name" class="w-full bg-off-black border border-white/10 p-4 text-cream focus:border-gold-accent focus:outline-none transition rounded-sm" placeholder="Your Name">
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest text-muted mb-2">Email</label>
            <input type="email" v-model="formData.email" class="w-full bg-off-black border border-white/10 p-4 text-cream focus:border-gold-accent focus:outline-none transition rounded-sm" placeholder="email@example.com">
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest text-muted mb-2">Message</label>
            <textarea v-model="formData.message" rows="6" class="w-full bg-off-black border border-white/10 p-4 text-cream focus:border-gold-accent focus:outline-none transition rounded-sm" placeholder="How can I help you?"></textarea>
          </div>
          
          <button class="w-full bg-cream text-rich-black py-4 font-bold uppercase tracking-widest text-xs hover:bg-white transition">Send Message</button>
        </form>

        <div class="grid grid-cols-2 gap-4">
          <a href="mailto:oluwatoyinferanmijohn@gmail.com" class="p-4 border border-white/10 rounded-sm flex items-center gap-4 hover:bg-off-black transition group">
            <Icon name="ph:envelope-simple" class="text-xl text-muted group-hover:text-gold-accent"/>
            <span class="text-xs font-bold uppercase">oluwatoyinferanmijohn@gmail.com</span>
          </a>
          <a href="#" class="p-4 border border-white/10 rounded-sm flex items-center gap-4 hover:bg-off-black transition group">
            <Icon name="ph:twitter-logo" class="text-xl text-muted group-hover:text-gold-accent"/>
            <span class="text-xs font-bold uppercase">Follow Me</span>
          </a>
          <a href="#" class="p-4 border border-white/10 rounded-sm flex items-center gap-4 hover:bg-off-black transition group">
            <Icon name="ph:linkedin-logo" class="text-xl text-muted group-hover:text-gold-accent"/>
            <span class="text-xs font-bold uppercase">Connect</span>
          </a>
          <a href="#" class="p-4 border border-white/10 rounded-sm flex items-center gap-4 hover:bg-off-black transition group">
            <Icon name="ph:instagram-logo" class="text-xl text-muted group-hover:text-gold-accent"/>
            <span class="text-xs font-bold uppercase">Gallery</span>
          </a>
        </div>

      </div>
    </div>
  </div>
</template>