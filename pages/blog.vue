<template>
  <main class="page-wrap min-h-[70vh] pt-36 pb-24">
    <p class="eyebrow">Notes and ideas</p><h1 class="font-serif text-6xl md:text-8xl mt-4">Thinking <span class="italic text-gold-accent">out loud.</span></h1>
    <p class="text-muted max-w-2xl leading-7 mt-7">I’m collecting notes on building software, working across the product stack, and using AI tools with care. New writing will appear here.</p>
    <div class="mt-14 grid md:grid-cols-3 gap-4">
      <article v-for="note in ['Building for the person using it','Working across the whole stack','AI as a tool in the development process']" :key="note" class="border border-white/10 bg-off-black p-6 min-h-40"><p class="eyebrow">On my mind</p><h2 class="font-serif text-2xl mt-4">{{ note }}</h2></article>
    </div>
  </main>
</template>
