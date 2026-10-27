<script setup lang="ts">
definePageMeta({ layout: false });
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const email = ref("");
const password = ref("");
const error = ref("");
const busy = ref(false);
if (user.value) await navigateTo("/dashboard");
async function signIn() {
  busy.value = true; error.value = "";
  const { error: authError } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value });
  busy.value = false;
  if (authError) error.value = authError.message;
  else await navigateTo("/dashboard");
}
</script>
<template>
  <main class="min-h-screen grid place-items-center px-5 bg-rich-black">
    <form class="w-full max-w-md p-8 md:p-10 bg-off-black border border-white/10" @submit.prevent="signIn">
      <NuxtLink to="/" class="eyebrow">← Back to portfolio</NuxtLink>
      <p class="eyebrow mt-12">Private workspace</p>
      <h1 class="font-serif text-4xl mt-3">Welcome back.</h1>
      <p class="text-muted mt-3 mb-8">Sign in with the administrator account configured in Supabase.</p>
      <label class="block text-sm mb-2" for="email">Email</label>
      <input id="email" v-model="email" type="email" autocomplete="username" required class="w-full bg-black/30 border border-white/15 px-4 py-3 mb-5" />
      <label class="block text-sm mb-2" for="password">Password</label>
      <input id="password" v-model="password" type="password" autocomplete="current-password" required class="w-full bg-black/30 border border-white/15 px-4 py-3 mb-5" />
      <p v-if="error" class="text-red-300 text-sm mb-4">{{ error }}</p>
      <button class="w-full bg-cream text-black py-3 uppercase tracking-widest text-xs disabled:opacity-50" :disabled="busy">{{ busy ? 'Signing in…' : 'Sign in' }}</button>
    </form>
  </main>
</template>
