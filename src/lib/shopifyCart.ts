import { isShopifyConfigured, shopify } from './shopify';

const STORAGE_KEY = 'checkoutId';

function isCheckoutUsable(checkout: any) {
  if (!checkout) return false;
  if (!checkout.webUrl) return false;
  if (checkout.completedAt) return false;
  return true;
}

async function createFreshCheckout() {
  const checkout = await shopify.checkout.create();
  localStorage.setItem(STORAGE_KEY, checkout.id as string);
  return checkout;
}

export async function addToCart(variantId: string, quantity = 1): Promise<any> {
  if (!isShopifyConfigured) {
    throw new Error('Shopify non configurato.');
  }

  const tryOnce = async () => {
    let checkoutId = localStorage.getItem(STORAGE_KEY);
    let checkout: any = null;

    if (checkoutId) {
      checkout = await shopify.checkout.fetch(checkoutId);
      if (!isCheckoutUsable(checkout)) {
        localStorage.removeItem(STORAGE_KEY);
        checkoutId = null;
      }
    }

    if (!checkoutId) {
      checkout = await createFreshCheckout();
      checkoutId = checkout.id;
    }

    const updated = await shopify.checkout.addLineItems(checkoutId, [{ variantId, quantity }]);
    const usable = isCheckoutUsable(updated) ? updated : await shopify.checkout.fetch(checkoutId);
    if (!isCheckoutUsable(usable)) {
      throw new Error('Checkout Shopify non disponibile.');
    }
    return usable;
  };

  try {
    return await tryOnce();
  } catch (e) {
    localStorage.removeItem(STORAGE_KEY);
    return await tryOnce();
  }
}

export async function addToCartAndGetCheckoutUrl(variantId: string, quantity = 1): Promise<string> {
  if (!isShopifyConfigured) {
    throw new Error('Shopify non configurato.');
  }

  const tryOnce = async () => {
    let checkoutId = localStorage.getItem(STORAGE_KEY);
    let checkout: any = null;

    if (checkoutId) {
      checkout = await shopify.checkout.fetch(checkoutId);
      if (!isCheckoutUsable(checkout)) {
        localStorage.removeItem(STORAGE_KEY);
        checkoutId = null;
      }
    }

    if (!checkoutId) {
      checkout = await createFreshCheckout();
      checkoutId = checkout.id;
    }

    const updated = await shopify.checkout.addLineItems(checkoutId, [{ variantId, quantity }]);
    const usable = isCheckoutUsable(updated) ? updated : await shopify.checkout.fetch(checkoutId);
    if (!isCheckoutUsable(usable)) {
      throw new Error('Checkout Shopify non disponibile.');
    }
    return usable.webUrl as string;
  };

  try {
    return await tryOnce();
  } catch (e) {
    localStorage.removeItem(STORAGE_KEY);
    return await tryOnce();
  }
}
