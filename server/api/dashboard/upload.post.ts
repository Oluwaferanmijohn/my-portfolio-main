import { requirePortfolioAdmin } from "../../utils/admin";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const form = await readMultipartFormData(event);
  const file = form?.find((part) => part.name === "file");
  const kind = form?.find((part) => part.name === "kind")?.data.toString() || "image";
  const isCv = kind === "cv";
  if (!file?.data || (isCv ? file.type !== "application/pdf" || file.data.byteLength > 10 * 1024 * 1024 : !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type || "") || file.data.byteLength > 5 * 1024 * 1024)) {
    throw createError({ statusCode: 400, statusMessage: isCv ? "Choose a PDF under 10 MB" : "Choose a JPG, PNG, WEBP, or AVIF image under 5 MB" });
  }
  const ext = isCv ? "pdf" : file.type!.split("/")[1]?.replace(/[^a-z0-9]/gi, "") || "img";
  const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const bucket = isCv ? "portfolio-documents" : "portfolio-media";
  const { error } = await supabase.storage.from(bucket).upload(path, file.data, { contentType: file.type, upsert: false });
  if (error) throw createError({ statusCode: 400, statusMessage: error.message });
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
});
