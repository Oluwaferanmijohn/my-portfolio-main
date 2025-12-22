<script setup>
import { ref } from "vue";
// Importing the image to prevent 404 errors
import contactImg from "../assets/image/5.png"; 

const form = ref({
  name: "",
  email: "",
  message: "",
  // This is a honeypot field to prevent spam bots
  botcheck: false,
});

const status = ref(""); // 'loading', 'success', 'error', or ''

const handleSubmit = async () => {
  status.value = "loading";

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // YOUR ACCESS KEY
        access_key: "d5ca003b-e9fc-4c54-a229-94a461d8edb9",
        name: form.value.name,
        email: form.value.email,
        message: form.value.message,
        botcheck: form.value.botcheck,
      }),
    });

    const result = await response.json();

    if (result.success) {
      status.value = "success";
      // Reset form
      form.value = { name: "", email: "", message: "", botcheck: false };
      // Remove success message after 5 seconds
      setTimeout(() => (status.value = ""), 5000);
    } else {
      status.value = "error";
    }
  } catch (error) {
    status.value = "error";
  }
};
</script>

<template>
  <div class="pt-32 pb-20 px-6 md:px-16 min-h-screen">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      
      <div class="relative h-[700px] w-full hidden lg:block rounded-sm overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-t from-rich-black via-transparent to-transparent z-10"></div>
        <img
          :src="contactImg"
          class="w-full h-full object-cover grayscale opacity-80"
          alt="Contact Portrait"
        />
      </div>

      <div>
        <span class="text-xs uppercase tracking-widest text-muted mb-4 block">Contact</span>
        <h1 class="font-serif text-5xl md:text-6xl mb-12">
          Let's get in <span class="italic text-gold-accent">touch.</span>
        </h1>

        <form @submit.prevent="handleSubmit" class="space-y-6 mb-16">
          
          <input type="checkbox" v-model="form.botcheck" class="hidden" style="display: none;">

          <div>
            <label class="block text-xs uppercase tracking-widest text-muted mb-2">Name</label>
            <input
              type="text"
              v-model="form.name"
              required
              class="w-full bg-off-black border border-white/10 p-4 text-cream focus:border-gold-accent focus:outline-none transition rounded-sm placeholder-white/20"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-widest text-muted mb-2">Email</label>
            <input
              type="email"
              v-model="form.email"
              required
              class="w-full bg-off-black border border-white/10 p-4 text-cream focus:border-gold-accent focus:outline-none transition rounded-sm placeholder-white/20"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-widest text-muted mb-2">Message</label>
            <textarea
              v-model="form.message"
              rows="6"
              required
              class="w-full bg-off-black border border-white/10 p-4 text-cream focus:border-gold-accent focus:outline-none transition rounded-sm placeholder-white/20"
              placeholder="How can I help you?"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="status === 'loading'"
            class="w-full bg-cream text-rich-black py-4 font-bold uppercase tracking-widest text-xs hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            <span v-if="status === 'loading'">Sending...</span>
            <span v-else>Send Message</span>
          </button>

          <div v-if="status === 'success'" class="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
            Message sent successfully! I'll get back to you soon.
          </div>
          <div v-if="status === 'error'" class="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            Something went wrong. Please try again later.
          </div>

        </form>

        <div class="grid grid-cols-2 gap-4">
          <a
            href="mailto:oluwatoyinferanmijohn@gmail.com"
            class="p-4 border border-white/10 rounded-sm flex items-center gap-4 hover:bg-off-black transition group"
          >
            <Icon
              name="ph:envelope-simple"
              class="text-xl text-muted group-hover:text-gold-accent"
            />
            <span class="text-xs font-bold uppercase truncate">oluwatoyinferanmijohn@gmail.com</span>
          </a>
          <a
            href="https://twitter.com/yourhandle"
            target="_blank"
            class="p-4 border border-white/10 rounded-sm flex items-center gap-4 hover:bg-off-black transition group"
          >
            <Icon
              name="ph:twitter-logo"
              class="text-xl text-muted group-hover:text-gold-accent"
            />
            <span class="text-xs font-bold uppercase">Follow Me</span>
          </a>
          <a
            href="https://linkedin.com/in/yourhandle"
            target="_blank"
            class="p-4 border border-white/10 rounded-sm flex items-center gap-4 hover:bg-off-black transition group"
          >
            <Icon
              name="ph:linkedin-logo"
              class="text-xl text-muted group-hover:text-gold-accent"
            />
            <span class="text-xs font-bold uppercase">Connect</span>
          </a>
          <a
            href="https://instagram.com/yourhandle"
            target="_blank"
            class="p-4 border border-white/10 rounded-sm flex items-center gap-4 hover:bg-off-black transition group"
          >
            <Icon
              name="ph:instagram-logo"
              class="text-xl text-muted group-hover:text-gold-accent"
            />
            <span class="text-xs font-bold uppercase">Gallery</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>