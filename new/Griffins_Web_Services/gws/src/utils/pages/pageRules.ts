// src/utils/pages/pageRules.ts
/**
 * Page Rules (Environment Agnostic)
 *
 * Pure data-based helpers to decide whether pages should be generated.
 * Accepts plain frontmatter/meta objects so it can be shared between
 * browser/server code and Node-only build tooling.
 */

// Helper to normalize either a full entry or raw data
const getItemData = (entryOrData: any) =>
  entryOrData?.data ? entryOrData.data : entryOrData;

export function isDraft(itemData: any): boolean {
  return getItemData(itemData)?.draft === true;
}

export function getItemProperty<T>(
  itemData: any,
  metaData: any,
  itemKey: string,
  metaKey: string,
  defaultValue: T
): T {
  const item = getItemData(itemData);

  if (item?.[itemKey] !== undefined) {
    return item[itemKey];
  }
  if (metaData?.[metaKey] !== undefined) {
    return metaData[metaKey];
  }
  return defaultValue;
}

export function shouldItemHavePageData(
  itemData: any,
  metaData: any,
  defaultValue: boolean = true
): boolean {
  if (isDraft(itemData)) return false;
  return getItemProperty(itemData, metaData, "hasPage", "itemsHasPage", defaultValue);
}

export function shouldItemUseRootPathData(
  itemData: any,
  metaData: any,
  defaultValue: boolean = false
): boolean {
  return getItemProperty(itemData, metaData, "rootPath", "itemsRootPath", defaultValue);
}

export function shouldCollectionHavePageMeta(
  metaData: any,
  defaultValue: boolean = true
): boolean {
  if (metaData?.hasPage === false) return false;
  return defaultValue;
}

export function shouldProcessCollectionData(
  entries: any[],
  metaData: any
): boolean {
  if (metaData?.itemsHasPage !== false) {
    return true;
  }

  // Only process if an item explicitly opts in (and isn't draft)
  return entries.some((entry) => {
    const data = getItemData(entry);
    return data?.hasPage === true && !isDraft(data);
  });
}
