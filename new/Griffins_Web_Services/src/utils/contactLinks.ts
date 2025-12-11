// src/utils/contactLinks.ts
import type { CollectionEntry } from 'astro:content';
import { formatPhoneNumber } from '@/utils/string';

export interface ContactLink {
  id: string;
  title: string;          // Raw title/value (email, phone digits, etc.)
  displayTitle: string;   // Nicely formatted label for UI
  url?: string;           // Full href (mailto:, tel:, etc.)
  linkPrefix?: string;
  tags?: string[];
  description?: string;
  icon?: any;
}

function extractData(item: any): any {
  if (!item) return {};
  if (item.data) return { ...item.data, id: item.id ?? item.data.id };
  return item;
}

export function normalizeContactLinks(items: Array<any>): ContactLink[] {
  return items
    .map((item) => {
      const data = extractData(item);
      const id = String(data.id ?? item?.id ?? 'contact');
      const rawTitle = String(data.title ?? '');
      const linkPrefix = data.linkPrefix ?? '';
      const tags: string[] = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [];

      const displayTitle = isPhoneContactId(id)
        ? formatPhoneNumber(rawTitle)
        : rawTitle;

      const url = data.url ?? (linkPrefix ? `${linkPrefix}${rawTitle}` : undefined);

      return {
        id,
        title: rawTitle,
        displayTitle,
        url,
        linkPrefix,
        tags,
        description: data.description,
        icon: data.icon,
      };
    })
    .filter((link) => !!link.title);
}

export async function getContactLinks(): Promise<ContactLink[]> {
  const { getCollection } = await import('astro:content');
  const entries = await getCollection('contact-us');
  return normalizeContactLinks(entries as CollectionEntry<'contact-us'>[]);
}

const PHONE_CONTACT_IDS = new Set(["phone"]);
const EMAIL_CONTACT_IDS = new Set(["email", "support-email", "contact-email"]);

export const isPhoneContactId = (id?: string | null): boolean =>
  id ? PHONE_CONTACT_IDS.has(id.toLowerCase()) : false;

export const isEmailContactId = (id?: string | null): boolean =>
  id ? EMAIL_CONTACT_IDS.has(id.toLowerCase()) : false;
