<script setup lang="ts">
import myHostelImg from "../assets/image/myhostel.png";
import agriGrainsImg from "../assets/image/agrigrains.png";
import poketIncomeImg from "../assets/image/poketincome.png";
import moovizImg from "../assets/image/moviz.png";
import phenryTechImg from "../assets/image/phenrytech.png";
// Using placeholder images that match the dark aesthetic
const portfolioItems = [
  {
    title: "MyHostel.ng",
    cat: "WEB APP",
    Details:
      "A hostel rental website that helps you get accomodation with ease...",
    link: "https://myhostel.com.ng",
    img: myHostelImg,
  },
  {
    title: "AgriGrains",
    cat: "WEBSITE",
    link: "https://agrigrains.com.ng",
    Details:
      "An agricultural enterprise specializing in the cultivation, export, and sale of various crops...",
    img: agriGrainsImg,
  },
  {
    title: "Poketincome",
    cat: "WEBSITE",
    link: "https://poketincome.netlify.app",
    Details:
      "A Platform that helps Creating minimum income for non-traders via copy trading...",
    img: poketIncomeImg,
  },
  {
    title: "Mooviz",
    cat: "WEB APP",
    link: "https://mooviz.com.ng/",
    Details:
      "A movie streaming platform with a focus on Nigerian cinema and international content.",
    img: moovizImg,
  },
  {
    title: "Phenry Technologies",
    cat: "WEBSITE",
    link: "https://www.phenrytech.com.ng/",
    Details:
      "A tech company that offers web and app development, UI/UX, and graphic design services.",
    img: phenryTechImg,
  },
];

const services = [
  {
    id: "01",
    title: "Full-Stack Website/WebApp Development",
    desc: "I build complete, production-ready applications from start to finish. Using Nuxt 3 as my backbone, I handle both the client-side interactivity and the server-side logic.",
    link: "Nuxt 3, Vue 3, Tailwind CSS, JavaScript/TypeScript, Vercel/Netlify Deployment.",
  },
  {
    id: "02",
    title: "Backend Architecture & Database Design",
    desc: "A pretty interface is useless without a solid foundation. I design efficient database schemas and write secure API endpoints to manage your data.",
    link: "Supabase, MySQL, Nuxt Server Routes, Node JS, firebase, API Integration.",
  },
  {
    id: "03",
    title: "Frontend Engineering & UI Implementation",
    desc: "I translate static designs into responsive, interactive web experiences. I focus heavily on performance, accessibility, and pixel-perfect implementation.",
    link: "Tailwind CSS, Headless UI, CSS Animations.",
  },
];

const processSteps = [
  {
    number: "01",
    subtitle: "The Foundation",
    title: "Discovery & Blueprint",
    desc: "We start by analyzing your requirements, target audience, and business goals to create a technical roadmap that ensures we are building the right solution.",
    details: [
      "Requirement Analysis",
      "Market Research",
      "Technical Architecture",
    ],
  },
  {
    number: "02",
    subtitle: "Visual Architecture",
    title: "UI/UX Design",
    desc: "Before a single line of code is written, I design the high-fidelity mockups and interactive prototypes so you can see exactly how your site will look.",
    details: ["Wireframing", "High-Fidelity UI", "Interactive Prototypes"],
  },
  {
    number: "03",
    subtitle: "Implementation",
    title: "Development",
    desc: "This is where the magic happens. I build your application using Nuxt 3 and Tailwind CSS, focusing on clean code and database integration.",
    details: [
      "Frontend (Nuxt 3)",
      "Backend API (Supabase)",
      "Responsive Coding",
    ],
  },
  {
    number: "04",
    subtitle: "Quality Assurance",
    title: "Testing & Polish",
    desc: "I rigorously test the site across different devices and browsers. We check for responsiveness, performance speed, and ensure every animation flows smoothly.",
    details: [
      "Mobile Testing",
      "Performance Optimization",
      "Cross-Browser Check",
    ],
  },
  {
    number: "05",
    subtitle: "Go Live",
    title: "Launch & Handoff",
    desc: "We go live. I deploy your site, set up your domain, and provide you with the documentation needed to manage your new platform.",
    details: ["Deployment (Vercel)", "SEO Setup", "Client Training"],
  },
];

const clients = [
  {
    text: "The hostel booking system he built for MyHostel.ng completely streamlined our operations. We went from manual spreadsheets to a fully automated dashboard. Highly recommended.",
    author: "Olabisi",
    role: "Co - Founder, MyHostel.ng",
    // This API automatically generates an avatar image with their initials
    img: "https://ui-avatars.com/api/?name=olabisi&background=random&color=fff"
  },
  {
    text: "I was worried about managing an inventory website for AgriGrains, but Oluwafernmi made the backend incredibly easy to use. The site is fast, secure, and looks world-class.",
    author: "kelvin Cross",
    role: "Operations Manager, AgriGrains",
    img: "https://ui-avatars.com/api/?name=kelvin+cross&background=random&color=fff"
  },
  {
    text: "We needed a streaming platform that could handle heavy traffic without crashing. The Mooviz app is stable, and the UI is comparable to major international streaming services.",
    author: "Oluwatobi Emmanuel",
    role: "CEO, Mooviz",
    img: "https://ui-avatars.com/api/?name=Emmanuel+oluwatobi&background=random&color=fff"
  },
  {
    text: "His ability to bridge the gap between complex backend logic and beautiful frontend design is rare. Phenry Technologies has seen a 40% increase in user retention since the redesign.",
    author: "John Olwatoyin",
    role: "CEO, Phenry Technologies",
    img: "https://ui-avatars.com/api/?name=john+oluwatoyin&background=random&color=fff"
  }
]
</script>

<template>
  <div
    class="bg-rich-black min-h-screen text-cream selection:bg-cream selection:text-rich-black overflow-x-hidden"
  >
    <!-- <NavBar /> -->
    <header
      class="relative pt-40 pb-20 px-4 md:px-10 flex flex-col items-center justify-center text-center"
    >
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[400px] opacity-20 pointer-events-none z-0"
      >
        <img
          src="../assets/image/7.png"
          class="w-full h-full object-cover rounded-b-[10rem] mask-image-fade"
          alt="Portrait"
        />
        <div
          class="absolute inset-0 bg-gradient-to-b from-transparent via-rich-black/50 to-rich-black"
        ></div>
      </div>

      <div class="relative z-10 mt-32">
        <h1
          class="font-serif text-5xl md:text-8xl italic font-light leading-tight mb-6"
        >
          Software <br />
          <span class="not-italic">Developer</span>
        </h1>
        <p class="text-muted max-w-md mx-auto text-sm md:text-base mb-12">
          I am a Full Stack Developer specialized in Vue and Nuxt. I build
          end-to-end applications, seamlessly connecting complex server-side
          architecture with intuitive, pixel-perfect frontends.
        </p>
      </div>

      <div
        class="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 mt-12"
      >
        <Icon
          class="grayscale hover:grayscale-0"
          name="logos:nuxt-icon"
          size="35"
          title="Nuxt 3"
        />
        <Icon
          class="grayscale hover:grayscale-0"
          name="logos:vue"
          size="25"
          title="Vue.js"
        />

        <Icon
          class="grayscale hover:grayscale-0"
          name="logos:typescript-icon"
          size="25"
          title="TypeScript"
        />
        <Icon
          class="grayscale hover:grayscale-0"
          name="logos:tailwindcss-icon"
          size="25"
          title="Tailwind CSS"
        />

        <Icon
          class="grayscale hover:grayscale-0"
          name="logos:supabase-icon"
          size="25"
          title="Supabase"
        />
        <Icon
          class="grayscale hover:grayscale-0"
          name="logos:mysql"
          size="35"
          title="MySQL"
        />
        <Icon
          class="grayscale hover:grayscale-0"
          name="logos:nodejs-icon"
          size="25"
          title="Node.js"
        />

        <Icon
          class="grayscale hover:grayscale-0"
          name="simple-icons:vercel"
          size="25"
          title="Vercel"
        />
        <Icon
          class="grayscale hover:grayscale-0"
          name="simple-icons:github"
          size="25"
          title="GitHub"
        />

        <!-- <Icon name="simple-icons:adobephotoshop" size="35" title="Adobe Photoshop" /> -->
      </div>
    </header>

    <section class="px-6 md:px-16 py-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="service in services"
          :key="service.id"
          class="bg-off-black p-10 rounded-sm border border-white/5 hover:border-white/10 transition group"
        >
          <span class="text-xs text-muted block mb-6">{{ service.id }}</span>
          <h3 class="font-serif text-xl mb-4 tracking-wide uppercase">
            {{ service.title }}
          </h3>
          <p class="text-sm text-muted leading-relaxed mb-8">
            {{ service.desc }}
          </p>
          <p
            class="text-xs uppercase tracking-widest flex items-center gap-2 group-hover:text-gold-accent transition"
          >
            <Icon name="ph:arrow-right" /> {{ service.link }}
          </p>
        </div>
      </div>
    </section>

    <section class="px-6 md:px-16 py-20">
      <div class="flex justify-between items-end mb-12">
        <h2 class="font-serif text-4xl italic">
          Featured <span class="not-italic text-gold-accent/80">Projects</span>
        </h2>
        <NuxtLink to="/services">
          <button
            class="text-xs uppercase border rounded-full px-4 py-2 hover:bg-cream hover:text-black transition"
          >
            See All
          </button></NuxtLink
        >
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="(item, index) in portfolioItems"
          :key="index"
          class="group relative cursor-pointer overflow-hidden rounded-sm"
        >
          <NuxtLink to="/work">
            <div class="aspect-[4/3] bg-off-black overflow-hidden">
              <img
                :src="item.img"
                class="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition duration-700"
                alt="Work"
              />
            </div>
            <div
              class="absolute bottom-0 left-0 w-full p-6 flex-col flex bg-gradient-to-t from-black/80 to-transparent"
            >
              <div class="flex justify-between items-end">
                <span class="font-serif text-2xl">{{ item.title }}</span>
                <span class="text-xs uppercase tracking-widest text-muted">{{
                  item.cat
                }}</span>
              </div>
              <span class="text-gold-accent/80 text-sm mt-6 max-w-md mx-auto">{{
                item.Details
              }}</span>
            </div></NuxtLink
          >
        </div>
      </div>
    </section>

    <section class="px-6 md:px-16 py-32 relative">
      <div class="text-center mb-24">
        <span class="text-xs uppercase tracking-widest text-muted"
          >The Process</span
        >
        <h2 class="font-serif text-5xl md:text-6xl mt-4">
          Your Website <br />
          <span class="italic text-gold-accent/80">in 5 steps</span>
        </h2>
        <p class="text-muted text-sm mt-6 max-w-md mx-auto">
          Our process ensures that we create a website tailored to your business
          needs.
        </p>

        <div
          class="mt-12 w-10 h-10 border rounded-full border-white/20 flex items-center justify-center mx-auto text-muted"
        >
          <Icon name="ph:arrow-down" />
        </div>
      </div>

      <div
        v-for="(step, index) in processSteps"
        :key="step.number"
        class="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 last:mb-0"
      >
        <div
          class="hidden md:flex absolute left-1/2 -translate-x-1/2 top-0 w-8 h-8 rounded-full bg-black border border-white/20 items-center justify-center text-xs text-gold-accent font-bold z-10"
        >
          {{ step.number }}
        </div>

        <div
          :class="[
            'p-8 bg-off-black border border-white/5 rounded-sm relative shadow-lg hover:border-white/10 transition duration-500',
            index % 2 === 0
              ? 'md:col-start-2 md:ml-12' // Even items (Right)
              : 'md:col-start-1 md:mr-12 md:text-right', // Odd items (Left)
          ]"
        >
          <span
            class="block text-[10px] text-gold-accent mb-3 uppercase tracking-widest"
            >{{ step.subtitle }}</span
          >

          <h3 class="font-serif text-2xl mb-4 text-cream">
            {{ step.title }}
          </h3>

          <p class="text-sm text-gray-400 leading-relaxed font-light">
            {{ step.desc }}
          </p>

          <ul
            :class="[
              'mt-6 space-y-2 text-xs text-muted',
              index % 2 === 0 ? '' : 'flex flex-col md:items-end', // Aligns list to right on desktop for odd items
            ]"
          >
            <li
              v-for="detail in step.details"
              :key="detail"
              class="flex items-center gap-2"
              :class="{ 'flex-row-reverse': index % 2 !== 0 }"
            >
              <template v-if="index % 2 === 0">
                <Icon name="ph:caret-right" class="text-gold-accent" />
                {{ detail }}
              </template>
              <template v-else>
                <span class="md:hidden"
                  ><Icon
                    name="ph:caret-right"
                    class="text-gold-accent inline mr-2"
                  />{{ detail }}</span
                >
                <span class="hidden md:inline"
                  >{{ detail }}
                  <Icon
                    name="ph:caret-left"
                    class="text-gold-accent inline ml-2"
                /></span>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="px-6 md:px-16 py-20 bg-off-black/30">
      <h2 class="font-serif text-4xl text-center mb-4">
        What my <br /><span class="italic">clients say</span>
      </h2>

     <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-16 px-6 md:px-0">
    <div
      v-for="(client, i) in clients"
      :key="i"
      class="bg-off-black p-8 rounded-sm border border-white/5 hover:border-white/20 hover:bg-white/5 transition duration-300 group"
    >
      <Icon name="ph:quotes-fill" class="text-3xl text-gold-accent/30 mb-6" />
      
      <h4 class="text-base md:text-lg font-light text-gray-200 mb-8 leading-relaxed">
        "{{ client.text }}"
      </h4>

      <div class="flex items-center gap-4 border-t border-white/5 pt-6">
        <img 
            :src="client.img" 
            :alt="client.author"
            class="w-12 h-12 rounded-full border border-white/10 group-hover:border-gold-accent transition"
        />
        
        <div>
          <p class="text-sm font-serif font-bold text-white">{{ client.author }}</p>
          <p class="text-[10px] uppercase tracking-widest text-gold-accent mt-0.5">{{ client.role }}</p>
        </div>
      </div>
    </div>
  </div>
    </section>
  </div>
</template>

<style scoped>
/* Custom utility for the portrait fade mask */
.mask-image-fade {
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
}
</style>
