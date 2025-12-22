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
    id: "01",
    title: "DISCOVERY CALL",
    desc: "Before we start, we determine if and how I can help you. What are your requirements for your new website?",
    time: "2 HOURS",
  },
  {
    id: "02",
    title: "CONCEPT & STRATEGY",
    desc: "Together, we develop a strategy that successfully combines your goals with the needs of your target audience.",
    time: "1 WEEK",
  },
  {
    id: "03",
    title: "WEB DESIGN",
    desc: "Now comes the magic. Based on the previously developed concept, I create a high-end screen design perfectly tailored to your brand.",
    time: "1 WEEK",
  },
  {
    id: "04",
    title: "DEVELOPMENT",
    desc: "In this step, we breathe life into your new high-end design. You will receive a custom-built website using a modular web design system.",
    time: "2 WEEKS",
  },
  {
    id: "05",
    title: "WEBSITE ONBOARDING",
    desc: "In a personal Framer workshop, I will show you how to make changes to your new website quickly and easily.",
    time: "2 HOURS",
  },
];

const clients = [
  {
    text: "Amazing results with Oluwaferanmi's Premium Web Design Services.",
    author: "Olivia Rhye",
    role: "Product Manager",
  },
  {
    text: "Expert Webflow and SEO Services. Excellent Work, Great Results.",
    author: "Phoenix Baker",
    role: "Engineering Manager",
  },
  {
    text: "Professional, Collaborative Web Design Experience with Oluwaferanmi.",
    author: "Lana Steiner",
    role: "VP Sales",
  },
  {
    text: "Expertise in Web Design: Second to none with Oluwaferanmi.",
    author: "Candice Wu",
    role: "Product Manager",
  },
];
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
          </div>
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

      <div class="relative max-w-5xl mx-auto">
        <div
          class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block"
        ></div>

        <div
          v-for="(step, index) in processSteps"
          :key="step.id"
          class="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 last:mb-0"
        >
          <div
            class="hidden md:flex absolute left-1/2 -translate-x-1/2 top-0 w-8 h-8 rounded-full bg-rich-black border border-white/20 items-center justify-center text-xs text-muted z-10"
          >
            {{ step.id }}
          </div>

          <div
            :class="[
              'p-8 bg-off-black border border-white/5 rounded-sm relative',
              index % 2 === 0
                ? 'md:col-start-2 md:ml-12'
                : 'md:col-start-1 md:mr-12 md:text-right',
            ]"
          >
            <span
              class="absolute top-4 right-4 text-[10px] border border-white/10 px-2 py-1 rounded text-muted"
              >{{ step.time }}</span
            >
            <span
              class="block text-xs text-muted mb-4 uppercase tracking-widest"
              >{{ step.title }}</span
            >
            <h3 class="font-serif text-2xl mb-4 text-cream">
              {{ step.title }}
            </h3>
            <p class="text-sm text-muted leading-relaxed">
              {{ step.desc }}
            </p>

            <ul
              :class="[
                'mt-6 space-y-2 text-xs text-muted',
                index % 2 === 0 ? '' : 'flex flex-col items-end',
              ]"
            >
              <li class="flex items-center gap-2">
                <Icon name="ph:caret-right" class="text-gold-accent" />
                Discovery Phase
              </li>
              <li class="flex items-center gap-2">
                <Icon name="ph:caret-right" class="text-gold-accent" /> Strategy
                Setup
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="px-6 md:px-16 py-20 bg-off-black/30">
      <h2 class="font-serif text-4xl text-center mb-4">
        What my <br /><span class="italic">clients say</span>
      </h2>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mt-16"
      >
        <div
          v-for="(client, i) in clients"
          :key="i"
          class="bg-off-black p-8 rounded border border-white/5 hover:border-white/20 transition"
        >
          <Icon name="ph:quotes-fill" class="text-2xl text-white/20 mb-4" />
          <h4 class="text-lg font-serif mb-6 leading-relaxed">
            "{{ client.text }}"
          </h4>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-white/20"></div>
            <div>
              <p class="text-sm font-semibold">{{ client.author }}</p>
              <p class="text-xs text-muted">{{ client.role }}</p>
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
