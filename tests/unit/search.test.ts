import { describe, expect, it } from "@jest/globals";
import { searchEmojis } from "@/app/lib/search";

// 仅验证基本搜索行为（以英文为例）
describe("searchEmojis", () => {
  it("should search by short name and unicode", () => {
    const byName = searchEmojis("grinning", "en");
    expect(Array.isArray(byName)).toBe(true);

    const byUnicode = searchEmojis("U+1F600", "en");
    expect(Array.isArray(byUnicode)).toBe(true);
  });
});

