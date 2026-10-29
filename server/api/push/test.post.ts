import { requirePortfolioAdmin } from "../../utils/admin";
import { notifyPortfolioAdmin } from "../../utils/push";

export default defineEventHandler(async (event) => {
  await requirePortfolioAdmin(event);
  const sent = await notifyPortfolioAdmin(event, "Push notification test", "Portfolio");
  if (!sent) throw createError({ statusCode: 409, statusMessage: "Enable notifications on this device first and confirm VAPID keys are set." });
  return { ok: true };
});
