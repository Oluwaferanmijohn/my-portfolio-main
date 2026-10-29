import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env first.");

const supabase = createClient(url, key, { auth: { persistSession: false } });
const images = [
  ["myhostel", "myhostel.PNG"],
  ["agrigrains", "agrigrains.PNG"],
  ["poketincome", "poketincome.PNG"],
  ["mooviz", "moviz.PNG"],
  ["phenry-technologies", "phenrytech.PNG"],
];

for (const [slug, fileName] of images) {
  const file = await readFile(new URL(`../assets/image/${fileName}`, import.meta.url));
  const path = `seed/${slug.toLowerCase()}.${fileName.split(".").at(-1).toLowerCase()}`;
  const { error: uploadError } = await supabase.storage.from("portfolio-media").upload(path, file, {
    contentType: fileName.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg",
    upsert: true,
  });
  if (uploadError) throw new Error(`Could not upload ${fileName}: ${uploadError.message}`);
  const { data: publicFile } = supabase.storage.from("portfolio-media").getPublicUrl(path);
  const { error: updateError } = await supabase.from("portfolio_projects").update({ image_url: publicFile.publicUrl }).eq("slug", slug);
  if (updateError) throw new Error(`Uploaded ${fileName}, but could not update its project record: ${updateError.message}`);
  console.log(`Uploaded ${fileName} for ${slug}.`);
}

const articleImage = await readFile(new URL("../public/images/article-ai-cover.jpg", import.meta.url));
const articlePath = "seed/articles/using-ai-with-intention-cover.jpg";
const { error: articleUploadError } = await supabase.storage.from("portfolio-media").upload(articlePath, articleImage, {
  contentType: "image/jpeg",
  upsert: true,
});
if (articleUploadError) throw new Error(`Could not upload the sample article cover: ${articleUploadError.message}`);
const { data: articlePublicFile } = supabase.storage.from("portfolio-media").getPublicUrl(articlePath);
const { error: articleUpdateError } = await supabase.from("portfolio_articles").update({ image_url: articlePublicFile.publicUrl }).eq("slug", "using-ai-with-intention");
if (articleUpdateError) throw new Error(`Uploaded the article cover, but could not update its article record: ${articleUpdateError.message}`);
console.log("Uploaded the sample article cover.");
