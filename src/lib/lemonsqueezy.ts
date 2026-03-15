import crypto from "crypto";
import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

function setup() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) throw new Error("LEMONSQUEEZY_API_KEY not set");
  lemonSqueezySetup({ apiKey });
}

export function getLSStoreId(): string {
  const id = process.env.LEMONSQUEEZY_STORE_ID;
  if (!id) throw new Error("LEMONSQUEEZY_STORE_ID not set");
  return id;
}

export function getLSVariantId(product: "pro" | "pack"): string {
  const key = product === "pro" ? "LEMONSQUEEZY_VARIANT_ID_PRO" : "LEMONSQUEEZY_VARIANT_ID_PACK";
  const id = process.env[key];
  if (!id) throw new Error(`${key} not set`);
  return id;
}

export async function createLSCheckoutUrl(
  product: "pro" | "pack",
  options: { email?: string; userId?: string; successUrl: string }
): Promise<string> {
  setup();
  const storeId = getLSStoreId();
  const variantId = parseInt(getLSVariantId(product), 10);

  const { data, error } = await createCheckout(storeId, variantId, {
    checkoutOptions: { embed: false },
    checkoutData: {
      email: options.email,
      custom: {
        user_id: options.userId || "",
        product,
      },
    },
    productOptions: {
      redirectUrl: options.successUrl,
    },
  });

  if (error) throw new Error((error as any).message || "Failed to create Lemon Squeezy checkout");
  return data!.data.attributes.url;
}

export function verifyLSWebhookSignature(rawBody: Buffer, signature: string, secret: string): boolean {
  try {
    const hmac = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(hmac, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}

// Map Lemon Squeezy subscription status to our internal plan states
export function mapLSStatusToPlan(status: string): "active" | "cancelled" | "past_due" | null {
  switch (status) {
    case "active":
    case "trialing":
      return "active";
    case "cancelled":
    case "expired":
      return "cancelled";
    case "past_due":
    case "unpaid":
    case "paused":
      return "past_due";
    default:
      return null;
  }
}
