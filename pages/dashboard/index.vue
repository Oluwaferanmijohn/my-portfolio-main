<script setup lang="ts">
import type { PortfolioProject } from "~/types/project";
import type { PortfolioArticle } from "~/types/article";
definePageMeta({ middleware: "dashboard" });
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { data: projects, refresh: refreshProjects } = await useFetch<PortfolioProject[]>("/api/projects", { default: () => [] });
const { data: overview, refresh: refreshOverview } = await useFetch<any>("/api/dashboard/overview", { default: () => ({ projectCount: 0, visits: 0, visitsToday: 0, cvClicks: 0, contacts: 0, unreadMessages: 0, messages: [] }) });
const { data: cvSettings, refresh: refreshCv } = await useFetch<{ cvUrl: string }>("/api/settings/cv", { default: () => ({ cvUrl: "" }) });
const { data: articles, refresh: refreshArticles } = await useFetch<PortfolioArticle[]>("/api/dashboard/articles", { default: () => [] });
const selected = ref<PortfolioProject | null>(null);
const technologies = ref("");
const saving = ref(false);
const uploadingImage = ref(false);
const uploadingCv = ref(false);
const uploadingArticleImage = ref(false);
const uploadingArticleGallery = ref(false);
const notice = ref("");
const inboxNotice = ref("");
const articleNotice = ref("");
const blank = (): Partial<PortfolioProject> => ({ title: "", slug: "", category: "Software", summary: "", concept: "", ai_experience: "", status: "Complete", image_url: "", project_url: "", technologies: [], featured: false, sort_order: (projects.value?.length || 0) * 10 });
const form = reactive<Partial<PortfolioProject>>(blank());
const selectedArticle = ref<PortfolioArticle | null>(null);
const blankArticle = (): Partial<PortfolioArticle> => ({ title: "", slug: "", excerpt: "", content: "", category: "Notes", image_url: "", image_urls: [], status: "Draft" });
const articleForm = reactive<Partial<PortfolioArticle>>(blankArticle());
const push = usePortfolioPush();
const installAvailable = ref(false);
let installPrompt: any = null;
let inboxRefreshTimer: ReturnType<typeof setInterval> | undefined;
function edit(project?: PortfolioProject) { selected.value = project || null; Object.assign(form, blank(), project || {}); technologies.value = project?.technologies.join(", ") || ""; }
function editArticle(article?: PortfolioArticle) { selectedArticle.value = article || null; Object.assign(articleForm, blankArticle(), article || {}); }
async function save() {
  saving.value = true; notice.value = "";
  try {
    const path = selected.value ? `/api/dashboard/projects/${selected.value.id}` : "/api/dashboard/projects";
    await $fetch(path, { method: selected.value ? "PUT" : "POST", body: { ...form, technologies: technologies.value.split(",").map((x) => x.trim()).filter(Boolean) } });
    await refreshProjects(); edit(); notice.value = "Project saved.";
  } catch (error: any) { notice.value = error?.data?.statusMessage || "Could not save project."; }
  finally { saving.value = false; }
}
async function remove(project: PortfolioProject) {
  if (!confirm(`Delete ${project.title}?`)) return;
  try { await $fetch(`/api/dashboard/projects/${project.id}`, { method: "DELETE" }); await refreshProjects(); await refreshOverview(); notice.value = "Project deleted."; }
  catch (error: any) { notice.value = error?.data?.statusMessage || "Could not delete project."; }
}
async function uploadImage(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0]; if (!file) return;
  const data = new FormData(); data.append("file", file);
  uploadingImage.value = true;
  try { const result = await $fetch<{ url: string }>("/api/dashboard/upload", { method: "POST", body: data }); form.image_url = result.url; notice.value = "Image uploaded. Save the project to publish it."; }
  catch (error: any) { notice.value = error?.data?.statusMessage || "Image upload failed."; }
  finally { uploadingImage.value = false; input.value = ""; }
}
async function uploadCv(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0]; if (!file) return;
  const data = new FormData(); data.append("file", file); data.append("kind", "cv");
  uploadingCv.value = true;
  try {
    const result = await $fetch<{ url: string }>("/api/dashboard/upload", { method: "POST", body: data });
    await $fetch("/api/dashboard/settings/cv", { method: "PUT", body: { cvUrl: result.url } });
    await refreshCv(); notice.value = "CV uploaded and published.";
  } catch (error: any) { notice.value = error?.data?.statusMessage || "CV upload failed."; }
  finally { uploadingCv.value = false; input.value = ""; }
}
async function saveArticle() {
  saving.value = true; articleNotice.value = "";
  try {
    const path = selectedArticle.value ? `/api/dashboard/articles/${selectedArticle.value.id}` : "/api/dashboard/articles";
    await $fetch(path, { method: selectedArticle.value ? "PUT" : "POST", body: articleForm });
    await refreshArticles(); editArticle(); articleNotice.value = "Article saved.";
  } catch (error: any) { articleNotice.value = error?.data?.statusMessage || "Could not save article."; }
  finally { saving.value = false; }
}
async function removeArticle(article: PortfolioArticle) {
  if (!confirm(`Delete “${article.title}”?`)) return;
  try { await $fetch(`/api/dashboard/articles/${article.id}`, { method: "DELETE" }); await refreshArticles(); editArticle(); articleNotice.value = "Article deleted."; }
  catch (error: any) { articleNotice.value = error?.data?.statusMessage || "Could not delete article."; }
}
async function uploadArticleImage(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0]; if (!file) return;
  const data = new FormData(); data.append("file", file);
  uploadingArticleImage.value = true;
  try { const result = await $fetch<{ url: string }>("/api/dashboard/upload", { method: "POST", body: data }); articleForm.image_url = result.url; articleNotice.value = "Cover image uploaded. Save the article to keep it."; }
  catch (error: any) { articleNotice.value = error?.data?.statusMessage || "Image upload failed."; }
  finally { uploadingArticleImage.value = false; input.value = ""; }
}
async function uploadArticleImages(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files || []).slice(0, 12);
  if (!files.length) return;
  uploadingArticleGallery.value = true;
  articleNotice.value = "Uploading article images…";
  try {
    const uploaded = await Promise.all(files.map(async (file) => {
      const data = new FormData(); data.append("file", file);
      return await $fetch<{ url: string }>("/api/dashboard/upload", { method: "POST", body: data });
    }));
    articleForm.image_urls = [...(articleForm.image_urls || []), ...uploaded.map((image) => image.url)].slice(0, 12);
    articleNotice.value = `${uploaded.length} article image${uploaded.length === 1 ? "" : "s"} uploaded. Save the article to keep them.`;
  } catch (error: any) { articleNotice.value = error?.data?.statusMessage || "One or more article images could not be uploaded."; }
  finally { uploadingArticleGallery.value = false; input.value = ""; }
}
async function setMessageRead(message: any, read: boolean) {
  try {
    const result = await $fetch<{ read_at: string | null }>(`/api/dashboard/messages/${message.id}`, { method: "PATCH", body: { read } });
    message.read_at = result.read_at; await refreshOverview();
  } catch (error: any) { inboxNotice.value = error?.data?.statusMessage || "Could not update message."; }
}
async function togglePush() {
  inboxNotice.value = "";
  try { if (push.enabled.value) await push.disable(); else await push.enable(); }
  catch (error: any) { inboxNotice.value = error?.data?.statusMessage || error?.message || "Could not update notification settings."; }
}
async function testPush() {
  try { await $fetch("/api/push/test", { method: "POST" }); inboxNotice.value = "Test notification sent."; }
  catch (error: any) { inboxNotice.value = error?.data?.statusMessage || "Could not send a test notification."; }
}
async function installApp() {
  if (!installPrompt) return;
  await installPrompt.prompt();
  installPrompt = null; installAvailable.value = false;
}
async function clearCv() {
  try { await $fetch("/api/dashboard/settings/cv", { method: "PUT", body: { cvUrl: "" } }); await refreshCv(); notice.value = "CV removed."; }
  catch (error: any) { notice.value = error?.data?.statusMessage || "Could not remove CV."; }
}
async function signOut() { await supabase.auth.signOut(); await navigateTo("/dashboard/login"); }
watch(user, async (value) => { if (!value) await navigateTo("/dashboard/login"); });
onMounted(() => {
  void refreshOverview(); void refreshArticles(); void push.refresh();
  window.addEventListener("beforeinstallprompt", (event: Event) => { event.preventDefault(); installPrompt = event; installAvailable.value = true; });
  inboxRefreshTimer = setInterval(() => { void refreshOverview(); }, 30_000);
});
onUnmounted(() => { if (inboxRefreshTimer) clearInterval(inboxRefreshTimer); });
</script>
<template>
  <main class="min-h-screen bg-rich-black px-4 py-8 md:px-10">
    <header class="flex items-center justify-between max-w-7xl mx-auto mb-10">
      <div><NuxtLink to="/" class="eyebrow">Portfolio</NuxtLink><h1 class="font-serif text-4xl mt-2">Your dashboard</h1></div>
      <div class="flex flex-wrap items-center justify-end gap-2"><NuxtLink to="/blog" class="border border-white/20 px-4 py-2 text-xs uppercase tracking-widest">View blog</NuxtLink><button v-if="installAvailable" class="bg-gold-accent text-rich-black px-4 py-2 text-xs uppercase tracking-widest" @click="installApp">Install app</button><button class="border border-white/20 px-4 py-2 text-xs uppercase tracking-widest" @click="signOut">Sign out</button></div>
    </header>
    <section class="max-w-7xl mx-auto bg-off-black border border-white/10 p-5 md:p-7 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <div><p class="eyebrow">Public CV</p><p class="text-sm text-muted mt-2">{{ cvSettings?.cvUrl ? 'Your CV link is live on the portfolio.' : 'Upload a PDF to add a tracked CV link to the portfolio.' }}</p><a v-if="cvSettings?.cvUrl" :href="cvSettings.cvUrl" target="_blank" rel="noreferrer" class="text-xs text-gold-accent break-all mt-2 inline-block">{{ cvSettings.cvUrl }}</a></div>
      <div class="flex items-center gap-3"><label class="border border-white/20 px-4 py-3 text-xs uppercase tracking-widest cursor-pointer hover:border-gold-accent" :class="uploadingCv ? 'opacity-50 pointer-events-none' : ''">{{ uploadingCv ? 'Uploading…' : 'Upload PDF' }}<input type="file" accept="application/pdf,.pdf" class="hidden" :disabled="uploadingCv" @change="uploadCv" /></label><button v-if="cvSettings?.cvUrl" class="text-xs text-red-300 px-3 py-2" @click="clearCv">Remove CV</button></div>
    </section>
    <section class="max-w-7xl mx-auto bg-off-black border border-white/10 p-5 md:p-7 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div><p class="eyebrow">Phone notifications</p><h2 class="font-serif text-2xl mt-2">Get a push alert for new messages</h2><p class="text-sm text-muted mt-2 max-w-2xl">Allow notifications on this device. When someone sends the contact form, their message is saved to your dashboard and an alert can be sent here.</p><p v-if="inboxNotice" class="text-sm text-gold-accent mt-3">{{ inboxNotice }}</p><p class="text-xs text-muted mt-3">Install this site on your phone first, then enable notifications here. On iPhone, open it in Safari, tap Share, then Add to Home Screen.</p><p v-if="!push.supported.value" class="text-xs text-muted mt-2">This browser does not support web push. Install the PWA on a supported phone browser and try again.</p></div>
      <div class="flex flex-wrap gap-2 shrink-0"><button v-if="push.enabled.value" class="border border-white/20 px-4 py-3 text-xs uppercase tracking-widest" @click="testPush">Send test alert</button><button v-if="push.supported.value" class="px-5 py-3 text-xs uppercase tracking-widest" :class="push.enabled.value ? 'border border-gold-accent text-gold-accent' : 'bg-cream text-rich-black'" @click="togglePush">{{ push.enabled.value ? 'Disable notifications' : 'Enable notifications' }}</button></div>
    </section>
    <section class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-10">
      <article v-for="metric in [{label:'Projects',value:overview?.projectCount},{label:'Articles',value:articles?.length},{label:'Visits',value:overview?.visits},{label:'Visits today',value:overview?.visitsToday},{label:'CV clicks',value:overview?.cvClicks},{label:'Unread messages',value:overview?.unreadMessages}]" :key="metric.label" class="bg-off-black border border-white/10 p-5"><p class="text-muted text-xs uppercase tracking-widest">{{ metric.label }}</p><p class="font-serif text-3xl mt-3">{{ metric.value || 0 }}</p></article>
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
          <label class="text-xs text-muted sm:col-span-2">{{ uploadingImage ? 'Uploading image…' : 'Upload image (max 5 MB)' }}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="field" :disabled="uploadingImage" @change="uploadImage" /></label>
          <label class="text-xs text-muted flex items-center gap-3"><input v-model="form.featured" type="checkbox" />Feature on home page</label>
          <label class="text-xs text-muted">Order<input v-model.number="form.sort_order" type="number" class="field" /></label>
        </div>
        <p v-if="notice" class="text-sm text-gold-accent mt-4">{{ notice }}</p>
        <div class="flex gap-3 mt-6"><button class="bg-cream text-black px-5 py-3 text-xs uppercase tracking-widest disabled:opacity-50" :disabled="saving || uploadingImage || uploadingCv">{{ uploadingImage ? 'Wait for image…' : saving ? 'Saving…' : 'Save project' }}</button><button v-if="selected" type="button" class="border border-white/20 px-5 py-3 text-xs uppercase tracking-widest" @click="edit()">New project</button></div>
      </form>
    </div>
    <section id="inbox" class="max-w-7xl mx-auto bg-off-black border border-white/10 p-5 md:p-7 mt-8 scroll-mt-8">
      <div class="flex flex-wrap items-end justify-between gap-3 mb-5"><div><p class="eyebrow">Contact inbox</p><h2 class="font-serif text-3xl mt-2">Messages <span class="text-gold-accent">({{ overview?.unreadMessages || 0 }} unread)</span></h2><p class="text-sm text-muted mt-2">Every contact form submission is saved here; email is sent as an extra notification.</p></div><button class="border border-white/20 px-3 py-2 text-xs uppercase tracking-widest" @click="refreshOverview">Refresh inbox</button></div>
      <p v-if="!overview?.messages?.length" class="text-muted text-sm border-t border-white/10 pt-5">No messages yet. New contact form submissions will appear here.</p>
      <article v-for="message in overview?.messages" :key="message.id" class="border-t border-white/10 py-5 grid md:grid-cols-[1fr_auto] gap-4">
        <div><div class="flex flex-wrap items-center gap-x-3 gap-y-1"><span class="text-xs uppercase tracking-widest" :class="message.read_at ? 'text-muted' : 'text-gold-accent'">{{ message.read_at ? 'Read' : 'New' }}</span><p class="font-medium">{{ message.name }} <span class="text-muted font-normal">· <a :href="`mailto:${message.email}`" class="hover:text-gold-accent">{{ message.email }}</a></span></p><time class="text-xs text-muted">{{ new Date(message.created_at).toLocaleString() }}</time></div><p class="text-sm text-gold-accent mt-3">{{ message.subject || 'Portfolio enquiry' }}</p><p class="text-sm text-muted mt-2 whitespace-pre-wrap leading-6">{{ message.message }}</p></div>
        <button class="self-start border border-white/20 px-3 py-2 text-xs uppercase tracking-widest hover:border-gold-accent" @click="setMessageRead(message, !message.read_at)">{{ message.read_at ? 'Mark unread' : 'Mark read' }}</button>
      </article>
    </section>
    <section id="articles" class="max-w-7xl mx-auto mt-8 grid lg:grid-cols-[.9fr_1.1fr] gap-8 items-start">
      <div class="bg-off-black border border-white/10 p-5 md:p-7">
        <div class="flex items-center justify-between gap-3 mb-5"><div><p class="eyebrow">Writing</p><h2 class="font-serif text-3xl mt-2">Blog articles</h2></div><button class="text-xs border border-white/20 px-3 py-2" @click="editArticle()">+ New article</button></div>
        <p v-if="!articles?.length" class="text-sm text-muted">Articles load after applying the articles migration.</p>
        <article v-for="article in articles" :key="article.id" class="border-t border-white/10 py-4 flex items-start gap-3">
          <img v-if="article.image_url" :src="article.image_url" class="w-14 h-14 object-cover bg-black" alt="" />
          <div class="flex-1 min-w-0"><p class="font-serif text-xl">{{ article.title }}</p><p class="text-xs text-muted mt-1">{{ article.category }} · {{ article.status }}</p><NuxtLink v-if="article.status === 'Published'" :to="`/blog/${article.slug}`" class="inline-block text-xs text-gold-accent mt-2">Read article ↗</NuxtLink></div>
          <button class="text-xs text-gold-accent" @click="editArticle(article)">Edit</button><button class="text-xs text-red-300" @click="removeArticle(article)">Delete</button>
        </article>
        <NuxtLink to="/blog" class="inline-block border-t border-white/10 pt-4 mt-2 text-xs uppercase tracking-widest text-gold-accent">Open public blog ↗</NuxtLink>
      </div>
      <form class="bg-off-black border border-white/10 p-5 md:p-7" @submit.prevent="saveArticle">
        <p class="eyebrow">Article editor</p><h3 class="font-serif text-3xl mt-2 mb-6">{{ selectedArticle ? 'Edit article' : 'Write an article' }}</h3>
        <div class="grid sm:grid-cols-2 gap-4">
          <label class="text-xs text-muted sm:col-span-2">Title<input v-model="articleForm.title" required maxlength="180" class="field" /></label>
          <label class="text-xs text-muted">URL slug<input v-model="articleForm.slug" class="field" placeholder="auto from title" /></label>
          <label class="text-xs text-muted">Category<input v-model="articleForm.category" class="field" placeholder="Notes, Story, Update" /></label>
          <label class="text-xs text-muted sm:col-span-2">Short intro<textarea v-model="articleForm.excerpt" rows="2" maxlength="500" class="field" placeholder="A short summary for the blog list" /></label>
          <label class="text-xs text-muted sm:col-span-2">Article content<textarea v-model="articleForm.content" required rows="12" class="field" placeholder="Write your story or article here. Separate paragraphs with a blank line." /></label>
          <label class="text-xs text-muted">Visibility<select v-model="articleForm.status" class="field"><option>Draft</option><option>Published</option></select></label>
          <label class="text-xs text-muted">Cover image URL<input v-model="articleForm.image_url" type="text" class="field" placeholder="Optional https:// URL or /images/file.png" /></label>
          <label class="text-xs text-muted sm:col-span-2">{{ uploadingArticleImage ? 'Uploading cover…' : 'Upload cover image' }}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="field" :disabled="uploadingArticleImage" @change="uploadArticleImage" /></label>
          <label class="text-xs text-muted sm:col-span-2">{{ uploadingArticleGallery ? 'Uploading images…' : 'Add images to article (up to 12)' }}<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" class="field" :disabled="uploadingArticleGallery" @change="uploadArticleImages" /></label>
          <div v-if="articleForm.image_urls?.length" class="sm:col-span-2"><p class="text-xs text-muted mb-2">Article image gallery</p><div class="grid grid-cols-3 sm:grid-cols-4 gap-2"><div v-for="(image,index) in articleForm.image_urls" :key="image" class="relative aspect-square"><img :src="image" class="w-full h-full object-cover" alt="Article gallery image" /><button type="button" class="absolute top-1 right-1 bg-rich-black/90 text-red-200 px-2 py-1 text-xs" :aria-label="`Remove article image ${index + 1}`" @click="articleForm.image_urls?.splice(index, 1)">×</button></div></div></div>
        </div>
        <p v-if="articleNotice" class="text-sm text-gold-accent mt-4">{{ articleNotice }}</p>
        <div class="flex gap-3 mt-6"><button class="bg-cream text-rich-black px-5 py-3 text-xs uppercase tracking-widest disabled:opacity-50" :disabled="saving || uploadingArticleImage || uploadingArticleGallery">{{ uploadingArticleImage || uploadingArticleGallery ? 'Wait for image upload…' : saving ? 'Saving…' : 'Save article' }}</button><button v-if="selectedArticle" type="button" class="border border-white/20 px-5 py-3 text-xs uppercase tracking-widest" @click="editArticle()">New article</button></div>
      </form>
    </section>
  </main>
</template>
<style scoped>.field { display:block; width:100%; margin-top:.5rem; padding:.7rem .8rem; color:#f5f5f0; background:#141414; border:1px solid #ffffff24; font:inherit; font-size:.875rem; } option { background:#1c1c1c; }</style>
