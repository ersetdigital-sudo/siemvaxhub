import {
  OPS,
  SERVICES,
  SERVICE_ORDER,
  type Item,
  type Service,
} from "@/lib/catalog";
import {
  getCatalog,
  type CatalogMethod,
  type CatalogService,
} from "@/lib/db/server";
import type { WebBrand } from "@/lib/db/types";

export type HydratedService = Omit<Service, "items"> & {
  slug: string;
  dbServiceId?: string;
  itemGroups: Record<string, Item[]>;
  billItem: Item | null;
};

export type Storefront = {
  services: Record<string, HydratedService>;
  methods: CatalogMethod[];
  brand: WebBrand | null;
};

function providerKeys(service: Service) {
  return service.detect
    ? Object.keys(OPS)
    : Object.keys(service.providers ?? {});
}

function providerLabel(service: Service, key: string) {
  return service.detect ? OPS[key]?.name ?? key : service.providers?.[key] ?? key;
}

function baseOf(service: Service) {
  const { items: _ignored, ...base } = service;
  void _ignored;
  return base;
}

function hydrateService(
  slug: string,
  service: Service,
  dbService: CatalogService | undefined,
): HydratedService {
  const base = baseOf(service);

  if (service.bill) {
    const fixed = dbService?.products[0];
    return {
      ...base,
      slug,
      dbServiceId: dbService?.dbId,
      itemGroups: {},
      billItem: fixed
        ? {
            id: "bill",
            name: fixed.nama,
            price: fixed.hargaJual,
            dbId: fixed.id,
          }
        : null,
    };
  }

  const itemGroups: Record<string, Item[]> = {};
  for (const key of providerKeys(service)) {
    const label = providerLabel(service, key);
    const list = service.items?.(key) ?? [];
    let cursor = 0;
    itemGroups[key] = list.map((item) => {
      const dbProduct =
        dbService?.products.find(
          (product) => product.nama === `${label} · ${item.name}`,
        ) ??
        dbService?.products.find((product) => product.nama === item.name) ??
        dbService?.products[cursor];
      cursor += 1;
      return dbProduct
        ? { ...item, price: dbProduct.hargaJual, dbId: dbProduct.id }
        : item;
    });
  }

  return {
    ...base,
    slug,
    dbServiceId: dbService?.dbId,
    itemGroups,
    billItem: null,
  };
}

export async function getStorefront(): Promise<Storefront> {
  const result = await getCatalog();
  const bySlug = new Map(
    (result.data?.services ?? []).map((service) => [service.slug, service]),
  );
  const services: Record<string, HydratedService> = {};
  for (const slug of SERVICE_ORDER) {
    services[slug] = hydrateService(slug, SERVICES[slug], bySlug.get(slug));
  }

  return {
    services,
    methods: result.data?.methods ?? [],
    brand: result.data?.brand ?? null,
  };
}

export async function getHydratedService(slug: string) {
  const storefront = await getStorefront();
  return {
    service: storefront.services[slug] ?? null,
    services: storefront.services,
    methods: storefront.methods,
    brand: storefront.brand,
  };
}
