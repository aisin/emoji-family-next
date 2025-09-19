export function validateSearchQuery(query: string): boolean {
  return query.length <= 100 && !/[<>"'&]/.test(query);
}

export function validateUnicodeParam(unicode: string): boolean {
  return /^U\+[0-9A-F]{4,6}$/i.test(unicode);
}

export function coalesceShortCode(val?: string): string | undefined {
  // 数据中 zh.json 有把 short_code 错写成 undefined 的情况，这里兜底
  if (!val || val === "undefined") return undefined;
  return val;
}

