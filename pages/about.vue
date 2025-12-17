<template>
  <div class="pt-40 pb-20 px-6 md:px-16">
    
    <div class="flex flex-col md:flex-row items-center gap-12 mb-32">
       <div class="w-full md:w-1/3">
          <div class="relative aspect-[3/4] overflow-hidden rounded-sm">
              <div class="absolute inset-0 bg-gradient-to-b from-transparent to-rich-black z-10"></div>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" class="w-full h-full object-cover grayscale opacity-90" alt="Portrait">
          </div>
       </div>
       <div class="w-full md:w-2/3 md:pl-10 text-center md:text-left">
          <h1 class="font-serif text-6xl md:text-8xl leading-tight mb-8">
            Arik <br />
            <span class="italic text-gold-accent">Andersson</span>
          </h1>
          <p class="text-muted text-sm md:text-base max-w-md leading-relaxed mb-8">
             Delivering Premium Web Design and Development Services to Boost Your Online Presence.
          </p>
          <div class="flex gap-4 justify-center md:justify-start">
             <div class="border border-white/10 px-6 py-4 rounded-sm text-center">
                <span class="block text-2xl font-serif text-cream">5+</span>
                <span class="text-[10px] uppercase tracking-widest text-muted">Years Exp.</span>
             </div>
             <div class="border border-white/10 px-6 py-4 rounded-sm text-center">
                <span class="block text-2xl font-serif text-cream">100+</span>
                <span class="text-[10px] uppercase tracking-widest text-muted">Projects</span>
             </div>
          </div>
       </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
       <div>
          <span class="text-xs uppercase tracking-widest text-muted mb-4 block">Who I Am</span>
          <h2 class="font-serif text-4xl mb-6">Your Partner in Bringing Your Web Design Vision to Life.</h2>
          <p class="text-sm text-muted leading-loose mb-6">
             As a dedicated web designer and developer, I bring a unique combination of creativity and technical expertise to every project. My passion lies in crafting bespoke websites that not only look stunning but also perform flawlessly.
          </p>
          <p class="text-sm text-muted leading-loose">
             I believe in a collaborative process, working closely with clients to understand their brand and goals. From concept to launch, I am dedicated to delivering excellence.
          </p>
       </div>
       <div class="relative">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop" class="w-full h-auto rounded-sm opacity-80 grayscale" alt="Working">
       </div>
    </div>

    <div class="border-t border-white/10 pt-20">
       <h3 class="font-serif text-3xl mb-12">Experience</h3>
       
       <div class="space-y-6">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-white/5 group hover:bg-white/5 px-4 transition">
             <div class="mb-2 md:mb-0">
                <h4 class="text-lg font-serif">Senior Web Designer</h4>
                <span class="text-xs text-muted">Creative Agency NYC</span>
             </div>
             <span class="text-xs text-muted">2021 - Present</span>
          </div>
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-white/5 group hover:bg-white/5 px-4 transition">
             <div class="mb-2 md:mb-0">
                <h4 class="text-lg font-serif">Frontend Developer</h4>
                <span class="text-xs text-muted">TechStart Solutions</span>
             </div>
             <span class="text-xs text-muted">2019 - 2021</span>
          </div>
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-white/5 group hover:bg-white/5 px-4 transition">
             <div class="mb-2 md:mb-0">
                <h4 class="text-lg font-serif">Freelance Designer</h4>
                <span class="text-xs text-muted">Remote</span>
             </div>
             <span class="text-xs text-muted">2018 - 2019</span>
          </div>
       </div>
    </div>

  </div>
</template>