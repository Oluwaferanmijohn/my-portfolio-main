export default defineEventHandler((event) => ({ publicKey: useRuntimeConfig(event).public.vapidPublicKey }));
