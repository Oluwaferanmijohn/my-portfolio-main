<script setup lang="ts">
const { track } = usePortfolioAnalytics();
const form = reactive({ name: "", email: "", subject: "", message: "", website: "" });
const busy = ref(false); const sent = ref(false); const error = ref("");
async function submit() {
  busy.value = true; error.value = "";
  try { await $fetch("/api/contact", { method: "POST", body: form }); sent.value = true; track("contact_sent"); }
  catch (e: any) { error.value = e?.data?.statusMessage || "Your message could not be sent. Please email me directly."; }
  busy.value = false;
}
</script>
<template>
  <main class="page-wrap min-h-screen pt-36 pb-24">
    <div class="grid lg:grid-cols-[.8fr_1.2fr] gap-12 lg:gap-24">
      <section><p class="eyebrow">Contact</p><h1 class="font-serif text-6xl md:text-8xl mt-5">Let’s talk<br /><span class="italic text-gold-accent">about it.</span></h1><p class="text-muted leading-7 mt-8 max-w-md">Have a project, role, or idea you’d like to discuss? Send a note and I’ll get back to you.</p><a href="mailto:oluwatoyinferanmijohn@gmail.com" class="inline-flex items-center gap-3 border-b border-gold-accent pb-3 mt-8 hover:text-gold-accent"><span aria-hidden="true">✉</span> oluwatoyinferanmijohn@gmail.com</a></section>
      <form class="bg-off-black border border-white/10 p-6 md:p-10" @submit.prevent="submit">
        <div v-if="sent" class="py-12"><p class="eyebrow">Message received</p><h2 class="font-serif text-4xl mt-4">Thanks for reaching out.</h2><p class="text-muted mt-4">Your message is saved. I’ll be in touch soon.</p><button type="button" class="text-gold-accent mt-7" @click="sent=false">Send another</button></div>
        <template v-else>
          <p class="eyebrow mb-7">Write me a message</p>
          <label class="block text-sm mb-5">Your name<input v-model="form.name" required maxlength="120" autocomplete="name" class="field" /></label>
          <label class="block text-sm mb-5">Email address<input v-model="form.email" required type="email" maxlength="254" autocomplete="email" class="field" /></label>
          <label class="block text-sm mb-5">Subject<input v-model="form.subject" maxlength="200" class="field" /></label>
          <label class="block text-sm mb-5">What’s on your mind?<textarea v-model="form.message" required minlength="5" maxlength="10000" rows="6" class="field resize-y" /></label>
          <label class="hidden" aria-hidden="true">Leave this empty<input v-model="form.website" tabindex="-1" autocomplete="off" /></label>
          <p v-if="error" class="text-red-300 text-sm mb-4">{{ error }}</p>
          <button class="bg-cream text-black px-7 py-4 uppercase tracking-widest text-xs disabled:opacity-50" :disabled="busy">{{ busy ? 'Sending…' : 'Send message' }} ↗</button>
          <p class="text-xs text-muted mt-5">Prefer email? <a href="mailto:oluwatoyinferanmijohn@gmail.com" class="text-cream underline underline-offset-4">Write directly.</a></p>
        </template>
      </form>
    </div>
  </main>
</template>
<style scoped>.field { display:block; width:100%; margin-top:.6rem; padding:.9rem 1rem; color:#f5f5f0; background:#141414; border:1px solid #ffffff24; font:inherit; font-size:.9rem; } .field:focus { border-color:#d4af37; outline:none; }</style>
