<script setup lang="ts">
import type { PortfolioProject } from "~/types/project";
definePageMeta({ middleware: "dashboard" });
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { data: projects, refresh: refreshProjects } = await useFetch<PortfolioProject[]>("/api/projects", { default: () => [] });
const { data: overview, refresh: refreshOverview } = await useFetch<any>("/api/dashboard/overview", { default: () => ({ projectCount: 0, visits: 0, visitsToday: 0, cvClicks: 0, contacts: 0, messages: [] }) });
const { data: cvSettings, refresh: refreshCv } = await useFetch<{ cvUrl: string }>("/api/settings/cv", { default: () => ({ cvUrl: "" }) });
const selected = ref<PortfolioProject | null>(null);
const technologies = ref("");
const saving = ref(false);
const notice = ref("");
const blank = (): Partial<PortfolioProject> => ({ title: "", slug: "", category: "Software", summary: "", concept: "", ai_experience: "", status: "Complete", image_url: "", project_url: "", technologies: [], featured: false, sort_order: (projects.value?.length || 0) * 10 });
const form = reactive<Partial<PortfolioProject>>(blank());
function edit(project?: PortfolioProject) { selected.value = project || null; Object.assign(form, blank(), project || {}); technologies.value = project?.technologies.join(", ") || ""; }
async function save() {
  saving.value = true; notice.value = "";
  try {
    const path = selected.value ? `/api/dashboard/projects/${selected.value.id}` : "/api/dashboard/projects";
    await $fetch(path, { method: selected.value ? "PUT" : "POST", body: { ...form, technologies: technologies.value.split(",").map((x) => x.trim()).filter(Boolean) } });
    await refreshProjects(); edit(); notice.value = "Project saved.";
  } catch (error: any) { notice.value = error?.data?.statusMessage || "Could not save project."; }
  saving.value = false;
}
async function remove(project: PortfolioProject) {
  if (!confirm(`Delete ${project.title}?`)) return;
  await $fetch(`/api/dashboard/projects/${project.id}`, { method: "DELETE" }); await refreshProjects(); await refreshOverview();
}
async function uploadImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return;
  const data = new FormData(); data.append("file", file);
  try { const result = await $fetch<{ url: string }>("/api/dashboard/upload", { method: "POST", body: data }); form.image_url = result.url; notice.value = "Image uploaded. Save the project to publish it."; }
  catch (error: any) { notice.value = error?.data?.statusMessage || "Image upload failed."; }
}
async function uploadCv(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return;
  const data = new FormData(); data.append("file", file); data.append("kind", "cv");
  try {
    const result = await $fetch<{ url: string }>("/api/dashboard/upload", { method: "POST", body: data });
    await $fetch("/api/dashboard/settings/cv", { method: "PUT", body: { cvUrl: result.url } });
    await refreshCv(); notice.value = "CV uploaded and published.";
  } catch (error: any) { notice.value = error?.data?.statusMessage || "CV upload failed."; }
}
async function clearCv() { await $fetch("/api/dashboard/settings/cv", { method: "PUT", body: { cvUrl: "" } }); await refreshCv(); }
async function signOut() { await supabase.auth.signOut(); await navigateTo("/dashboard/login"); }
watch(user, async (value) => { if (!value) await navigateTo("/dashboard/login"); });
onMounted(() => { void refreshOverview(); });
</script>
<template>
  <main class="min-h-screen bg-rich-black px-4 py-8 md:px-10">
    <header class="flex items-center justify-between max-w-7xl mx-auto mb-10">
      <div><NuxtLink to="/" class="eyebrow">Portfolio</NuxtLink><h1 class="font-serif text-4xl mt-2">Your dashboard</h1></div>
      <button class="border border-white/20 px-4 py-2 text-xs uppercase tracking-widest" @click="signOut">Sign out</button>
    </header>
    <section class="max-w-7xl mx-auto bg-off-black border border-white/10 p-5 md:p-7 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <div><p class="eyebrow">Public CV</p><p class="text-sm text-muted mt-2">{{ cvSettings?.cvUrl ? 'Your CV link is live on the portfolio.' : 'Upload a PDF to add a tracked CV link to the portfolio.' }}</p><a v-if="cvSettings?.cvUrl" :href="cvSettings.cvUrl" target="_blank" rel="noreferrer" class="text-xs text-gold-accent break-all mt-2 inline-block">{{ cvSettings.cvUrl }}</a></div>
      <div class="flex items-center gap-3"><label class="border border-white/20 px-4 py-3 text-xs uppercase tracking-widest cursor-pointer hover:border-gold-accent">Upload PDF<input type="file" accept="application/pdf,.pdf" class="hidden" @change="uploadCv" /></label><button v-if="cvSettings?.cvUrl" class="text-xs text-red-300 px-3 py-2" @click="clearCv">Remove CV</button></div>
    </section>
    <section class="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
      <article v-for="metric in [{label:'Projects',value:overview?.projectCount},{label:'Visits',value:overview?.visits},{label:'Visits today',value:overview?.visitsToday},{label:'CV clicks',value:overview?.cvClicks},{label:'Enquiries',value:overview?.contacts}]" :key="metric.label" class="bg-off-black border border-white/10 p-5"><p class="text-muted text-xs uppercase tracking-widest">{{ metric.label }}</p><p class="font-serif text-3xl mt-3">{{ metric.value || 0 }}</p></article>
    </section>
    <div class="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
      <section class="bg-off-black border border-white/10 p-5 md:p-7">
        <div class="flex justify-between items-center mb-6"><h2 class="font-serif text-2xl">Projects</h2><button class="text-xs border border-white/20 px-3 py-2" @click="edit()">+ Add project</button></div>
        <p v-if="!projects?.length" class="text-muted text-sm">Projects appear after you apply the migration in supabase/migrations.</p>
        <article v-for="project in projects" :key="project.id" class="flex items-center gap-4 py-4 border-t border-white/10">
          <img v-if="project.image_url" :src="project.image_url" class="w-14 h-14 object-cover bg-black" alt="" />
          <div class="flex-1 min-w-0"><p class="truncate">{{ project.title }}</p><p class="text-muted text-xs">{{ project.category }} · {{ project.status }}</p></div>
          <button class="text-xs text-gold-accent" @click="edit(project)">Edit</button><button class="text-xs text-red-300" @click="remove(project)">Delete</button>
        </article>
        <h2 class="font-serif text-2xl mt-10 mb-4">Recent messages</h2>
        <p v-if="!overview?.messages?.length" class="text-muted text-sm">New contact messages will appear here.</p>
        <article v-for="message in overview?.messages" :key="message.id" class="border-t border-white/10 py-4"><div class="flex justify-between gap-3"><p class="font-medium">{{ message.name }} <span class="text-muted font-normal">· {{ message.email }}</span></p><time class="text-xs text-muted">{{ new Date(message.created_at).toLocaleDateString() }}</time></div><p class="text-sm text-gold-accent mt-2">{{ message.subject }}</p><p class="text-sm text-muted mt-2 whitespace-pre-wrap">{{ message.message }}</p></article>
      </section>
      <form class="bg-off-black border border-white/10 p-5 md:p-7" @submit.prevent="save">
        <p class="eyebrow">Project editor</p><h2 class="font-serif text-3xl mt-2 mb-6">{{ selected ? 'Edit project' : 'Add a project' }}</h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <label class="text-xs text-muted">Title<input v-model="form.title" required class="field" /></label>
          <label class="text-xs text-muted">Slug<input v-model="form.slug" class="field" placeholder="auto from title" /></label>
          <label class="text-xs text-muted">Category<input v-model="form.category" class="field" /></label>
          <label class="text-xs text-muted">Status<select v-model="form.status" class="field"><option>Complete</option><option>In progress</option><option>Archived</option></select></label>
          <label class="text-xs text-muted sm:col-span-2">Short description<textarea v-model="form.summary" rows="2" class="field" /></label>
          <label class="text-xs text-muted sm:col-span-2">Project concept<textarea v-model="form.concept" rows="3" class="field" /></label>
          <label class="text-xs text-muted sm:col-span-2">How AI was used<textarea v-model="form.ai_experience" rows="2" class="field" /></label>
          <label class="text-xs text-muted sm:col-span-2">Technologies (comma separated)<input v-model="technologies" class="field" placeholder="Vue, Nuxt, PostgreSQL" /></label>
          <label class="text-xs text-muted sm:col-span-2">Project URL<input v-model="form.project_url" type="url" class="field" /></label>
          <label class="text-xs text-muted sm:col-span-2">Image URL<input v-model="form.image_url" class="field" /></label>
          <label class="text-xs text-muted sm:col-span-2">Upload image (max 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="field" @change="uploadImage" /></label>
          <label class="text-xs text-muted flex items-center gap-3"><input v-model="form.featured" type="checkbox" />Feature on home page</label>
          <label class="text-xs text-muted">Order<input v-model.number="form.sort_order" type="number" class="field" /></label>
        </div>
        <p v-if="notice" class="text-sm text-gold-accent mt-4">{{ notice }}</p>
        <div class="flex gap-3 mt-6"><button class="bg-cream text-black px-5 py-3 text-xs uppercase tracking-widest disabled:opacity-50" :disabled="saving">{{ saving ? 'Saving…' : 'Save project' }}</button><button v-if="selected" type="button" class="border border-white/20 px-5 py-3 text-xs uppercase tracking-widest" @click="edit()">New project</button></div>
      </form>
    </div>
  </main>
</template>
<style scoped>.field { display:block; width:100%; margin-top:.5rem; padding:.7rem .8rem; color:#f5f5f0; background:#141414; border:1px solid #ffffff24; font:inherit; font-size:.875rem; } option { background:#1c1c1c; }</style>
