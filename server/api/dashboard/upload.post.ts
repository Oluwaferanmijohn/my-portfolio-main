import { requirePortfolioAdmin } from "../../utils/admin";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const form = await readMultipartFormData(event);
  const file = form?.find((part) => part.name === "file");
  const kind = form?.find((part) => part.name === "kind")?.data.toString() || "image";
  const isCv = kind === "cv";
  const bytes = file?.data;
  const isJpeg = Boolean(bytes && bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff);
  const isPng = Boolean(bytes && bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])));
  const isWebp = Boolean(bytes && bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP");
  const isAvif = Boolean(bytes && bytes.length >= 12 && bytes.toString("ascii", 4, 8) === "ftyp" && ["avif", "avis"].includes(bytes.toString("ascii", 8, 12)));
  const imageType = isJpeg ? "image/jpeg" : isPng ? "image/png" : isWebp ? "image/webp" : isAvif ? "image/avif" : "";
  const validPdf = Boolean(bytes && bytes.length >= 5 && bytes.toString("ascii", 0, 5) === "%PDF-");
  if (!file?.data || (isCv ? !validPdf || file.data.byteLength > 10 * 1024 * 1024 : !imageType || file.data.byteLength > 5 * 1024 * 1024)) {
    throw createError({ statusCode: 400, statusMessage: isCv ? "Choose a PDF under 10 MB" : "Choose a JPG, PNG, WEBP, or AVIF image under 5 MB" });
  }
  const contentType = isCv ? "application/pdf" : imageType;
  const ext = isCv ? "pdf" : contentType.split("/")[1];
  const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const bucket = isCv ? "portfolio-documents" : "portfolio-media";
  const { error } = await supabase.storage.from(bucket).upload(path, file.data, { contentType, upsert: false });
  if (error) throw createError({ statusCode: 400, statusMessage: error.message });
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
});
