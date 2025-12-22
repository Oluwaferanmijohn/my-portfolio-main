<script setup>
import myHostelImg from "../assets/image/myhostel.png";
import agriGrainsImg from "../assets/image/agrigrains.png";
import poketIncomeImg from "../assets/image/poketincome.png";
import moovizImg from "../assets/image/moviz.png";
import phenryTechImg from "../assets/image/phenrytech.png";

const projects = [
  {
    title: "MyHostel.ng",
    cat: "WEB APP",
    Details: "A hostel rental website that helps you get accomodation with ease...",
    link: "https://myhostel.com.ng",
    img: myHostelImg,
  },
  {
    title: "AgriGrains",
    cat: "WEBSITE",
    link: "https://agrigrains.com.ng",
    Details: "An agricultural enterprise specializing in the cultivation, export, and sale of various crops...",
    img: agriGrainsImg,
  },
  {
    title: "Poketincome",
    cat: "WEBSITE",
    link: "https://poketincome.netlify.app",
    Details: "A Platform that helps Creating minimum income for non-traders via copy trading...",
    img: poketIncomeImg,
  },
  {
    title: "Mooviz",
    cat: "WEB APP",
    link: "https://mooviz.com.ng/",
    Details: "A movie streaming platform with a focus on Nigerian cinema and international content.",
    img: moovizImg,
  },
  {
    title: "Phenry Technologies",
    cat: "WEBSITE",
    link: "https://www.phenrytech.com.ng/",
    Details: "A tech company that offers web and app development, UI/UX, and graphic design services.",
    img: phenryTechImg,
  },
];
</script>

<template>
  <div class="pt-40 pb-20 px-6 md:px-16">
    <div class="text-center mb-20">
      <h1 class="font-serif text-6xl md:text-8xl mb-6">My WorkS</h1>
      <p class="text-muted max-w-xl mx-auto">
        My latest web design projects...
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        v-for="(item, index) in projects"
        :key="index"
        class="group relative overflow-hidden rounded-sm"
      >
        <div class="aspect-[4/3] bg-off-black overflow-hidden">
          <img
            :src="item.img"
            class="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition duration-700"
            alt="Work"
          />
        </div>

        <div
          class="absolute bottom-0 left-0 w-full p-8 flex justify-between items-end bg-gradient-to-t from-black/95 via-black/70 to-transparent"
        >
          <div class="max-w-[75%]"> <span class="font-serif text-3xl block mb-2 text-white">{{ item.title }}</span>
            
            <span class="text-[10px] uppercase tracking-widest text-muted border border-white/20 px-2 py-1 rounded inline-block mb-3">
              {{ item.cat }}
            </span>

            <p class="text-sm text-gray-300 font-light leading-relaxed line-clamp-3">
              {{ item.Details }}
            </p>
          </div>

          <a 
            :href="item.link" 
            target="_blank" 
            class="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm group-hover:bg-cream group-hover:text-black transition-colors duration-300 shrink-0"
          >
            <Icon name="ph:arrow-up-right" size="20" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>