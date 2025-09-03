import { uiText } from "@/app/lib/ui-strings";

describe("ui-strings", () => {
  test("zh-hans basic strings and formatters", () => {
    const t = uiText("zh-hans");
    expect(t.header.home).toBe("首页");
    expect(t.detail.labels.unicode_version).toBe("Unicode 版本");
    expect(t.copy.copied("链接")).toBe("已复制 链接");
    expect(t.detail.prev_aria("OK 手势")).toBe("上一条：OK 手势");
    expect(t.common.site_name).toBe("Emoji Family");
  });

  test("zh-hant basic strings and formatters", () => {
    const t = uiText("zh-hant");
    expect(t.header.home).toBe("首頁");
    expect(t.detail.labels.category).toBe("分類");
    expect(t.copy.copy_link).toBe("複製連結");
    expect(t.detail.next_aria("笑臉")).toBe("下一個：笑臉");
  });

  test("en basic strings and formatters", () => {
    const t = uiText("en");
    expect(t.header.search).toBe("Search");
    expect(t.detail.labels.aliases).toBe("Aliases");
    expect(t.copy.copy_unicode).toBe("Copy Unicode");
    expect(t.detail.prev_aria("OK Hand")).toBe("Previous: OK Hand");
    expect(t.search.results_count(3, "ok")).toBe("3 results for “ok”");
  });
});

