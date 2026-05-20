type StorefrontError = {
  message: string;
  extensions?: {
    code?: string;
  };
};

const domain = import.meta.env.VITE_SHOPIFY_DOMAIN || 'dream3d-italy.myshopify.com';
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const apiVersion = '2024-01';

export const isShopifyConfigured = Boolean(domain && storefrontAccessToken);

async function storefrontRequest<TData>(
  query: string,
  variables?: Record<string, any>,
  options?: { signal?: AbortSignal }
): Promise<{ data: TData | null; errors: StorefrontError[] }> {
  if (!storefrontAccessToken) {
    return { data: null, errors: [{ message: 'Shopify non configurato (token mancante).' }] };
  }

  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    signal: options?.signal,
  });

  const json = await res.json();
  return {
    data: (json.data ?? null) as TData | null,
    errors: (json.errors ?? []) as StorefrontError[],
  };
}

function mapCustomerUserError(err: { code?: string | null; message: string }) {
  const code = (err.code || '').toUpperCase();
  const msg = err.message || '';
  const msgLower = msg.toLowerCase();

  if (code === 'TAKEN' || msgLower.includes('has already been taken') || msgLower.includes('already associated')) {
    return 'Esiste già un account con questa email. Prova ad accedere oppure usa “Password dimenticata?”.';
  }

  if (code === 'UNIDENTIFIED_CUSTOMER' || msgLower.includes('unidentified customer')) {
    return "Cliente non trovato o password errata. Se non vuoi/puoi creare un account, vai su “Ordini” e usa “Traccia un ordine senza account” incollando il link “Stato ordine” dalla mail di conferma Shopify. In alternativa, prova “Password dimenticata?” con la stessa email dell'acquisto per impostare la password.";
  }

  if (code === 'CUSTOMER_DISABLED' || msgLower.includes('customer is disabled')) {
    return "Account disabilitato. Contattaci per riattivarlo.";
  }

  if (code === 'INVALID' && (msgLower.includes('password') || msgLower.includes('email'))) {
    return 'Email o password non validi.';
  }

  return msg;
}

export type ShopifyCustomer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
};

export type ShopifyOrderLineItem = {
  title: string;
  quantity: number;
};

export type ShopifyOrder = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus?: string | null;
  fulfillmentStatus?: string | null;
  statusUrl?: string | null;
  currentTotalPrice?: { amount: string; currencyCode: string } | null;
  lineItems: ShopifyOrderLineItem[];
};

export async function createCustomer(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<{ id: string }> {
  const mutation = `
    mutation CustomerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
        }
        customerUserErrors {
          code
          message
        }
      }
    }
  `;

  const { data, errors } = await storefrontRequest<{
    customerCreate: {
      customer: { id: string } | null;
      customerUserErrors: { code?: string | null; message: string }[];
    };
  }>(mutation, { input });

  if (errors.length) throw new Error(errors[0].message);

  const userErrors = data?.customerCreate.customerUserErrors ?? [];
  if (userErrors.length) throw new Error(mapCustomerUserError(userErrors[0]));

  const id = data?.customerCreate.customer?.id;
  if (!id) throw new Error('Impossibile creare account Shopify.');

  return { id };
}

export async function createCustomerAccessToken(email: string, password: string): Promise<string> {
  const mutation = `
    mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          message
        }
      }
    }
  `;

  const { data, errors } = await storefrontRequest<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string } | null;
      customerUserErrors: { code?: string | null; message: string }[];
    };
  }>(mutation, { input: { email, password } });

  if (errors.length) throw new Error(errors[0].message);

  const userErrors = data?.customerAccessTokenCreate.customerUserErrors ?? [];
  if (userErrors.length) throw new Error(mapCustomerUserError(userErrors[0]));

  const token = data?.customerAccessTokenCreate.customerAccessToken?.accessToken;
  if (!token) throw new Error('Impossibile creare sessione cliente Shopify.');

  return token;
}

export async function deleteCustomerAccessToken(customerAccessToken: string): Promise<void> {
  const mutation = `
    mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        deletedCustomerAccessTokenId
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { errors } = await storefrontRequest<{
    customerAccessTokenDelete: { userErrors: { message: string }[] };
  }>(mutation, { customerAccessToken });

  if (errors.length) throw new Error(errors[0].message);
}

export async function recoverCustomer(email: string): Promise<void> {
  const mutation = `
    mutation CustomerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          code
          message
        }
      }
    }
  `;

  const { data, errors } = await storefrontRequest<{
    customerRecover: { customerUserErrors: { message: string }[] };
  }>(mutation, { email });

  if (errors.length) throw new Error(errors[0].message);
  const userErrors = data?.customerRecover.customerUserErrors ?? [];
  if (userErrors.length) throw new Error(mapCustomerUserError(userErrors[0]));
}

export async function fetchCustomer(customerAccessToken: string): Promise<ShopifyCustomer> {
  const query = `
    query Customer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
      }
    }
  `;

  const { data, errors } = await storefrontRequest<{ customer: ShopifyCustomer | null }>(query, {
    customerAccessToken,
  });

  if (errors.length) throw new Error(errors[0].message);
  if (!data?.customer) throw new Error('Sessione Shopify non valida.');

  return data.customer;
}

export async function fetchCustomerOrders(customerAccessToken: string, first = 20): Promise<ShopifyOrder[]> {
  const query = `
    query CustomerOrders($customerAccessToken: String!, $first: Int!) {
      customer(customerAccessToken: $customerAccessToken) {
        orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              name
              processedAt
              financialStatus
              fulfillmentStatus
              statusUrl
              currentTotalPrice {
                amount
                currencyCode
              }
              lineItems(first: 20) {
                edges {
                  node {
                    title
                    quantity
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const { data, errors } = await storefrontRequest<{
    customer: {
      orders: {
        edges: {
          node: {
            id: string;
            name: string;
            processedAt: string;
            financialStatus?: string | null;
            fulfillmentStatus?: string | null;
            statusUrl?: string | null;
            currentTotalPrice?: { amount: string; currencyCode: string } | null;
            lineItems: { edges: { node: ShopifyOrderLineItem }[] };
          };
        }[];
      };
    } | null;
  }>(query, { customerAccessToken, first });

  if (errors.length) throw new Error(errors[0].message);
  if (!data?.customer) throw new Error('Sessione Shopify non valida.');

  const edges = data.customer.orders.edges ?? [];
  return edges.map((e) => ({
    id: e.node.id,
    name: e.node.name,
    processedAt: e.node.processedAt,
    financialStatus: e.node.financialStatus ?? null,
    fulfillmentStatus: e.node.fulfillmentStatus ?? null,
    statusUrl: e.node.statusUrl ?? null,
    currentTotalPrice: e.node.currentTotalPrice ?? null,
    lineItems: (e.node.lineItems.edges ?? []).map((li) => li.node),
  }));
}
