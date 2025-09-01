# 设计文档

## 概述

Emoji Family 网站是一个基于 Next.js 15 和 TypeScript 的现代化多语言 Emoji 合集平台。网站采用 App Router 架构，使用 Tailwind CSS 4 进行样式设计，支持静态生成（SSG）以获得最佳性能。项目结构简洁清晰，数据驱动，易于维护和扩展。

## 架构

### 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **字体**: Geist Sans & Geist Mono
- **部署**: 支持静态导出和 Vercel 部署

### 目录结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── [lang]/            # 多语言路由
│   │   ├── page.tsx       # 首页
│   │   ├── categories/    # 分类页面
│   │   │   └── [slug]/    # 动态分类页面
│   │   ├── sub-categories/ # 子分类页面
│   │   │   └── [slug]/    # 动态子分类页面
│   │   ├── emoji/         # 单个 Emoji 页面
│   │   │   └── [unicode]/ # 动态 Emoji 页面
│   │   └── search/        # 搜索页面
│   ├── components/        # 可复用组件
│   ├── lib/              # 工具函数和类型定义
│   └── globals.css       # 全局样式
├── data/                 # 静态数据文件
│   ├── category/         # 分类数据
│   └── emojis/          # Emoji 数据
└── types/               # TypeScript 类型定义
```

## 组件和接口

### 核心组件架构

#### 1. 布局组件

```typescript
// Layout 组件负责整体页面结构
interface LayoutProps {
  children: React.ReactNode;
  lang: string;
}

// Header 组件包含导航和语言切换
interface HeaderProps {
  lang: string;
  currentPath: string;
}

// Footer 组件包含版权和链接信息
interface FooterProps {
  lang: string;
}
```

#### 2. Emoji 相关组件

```typescript
// EmojiCard 组件用于显示 Emoji 卡片
interface EmojiCardProps {
  emoji: EmojiData;
  lang: string;
  size?: "small" | "medium" | "large";
}

// EmojiDetail 组件用于显示 Emoji 详细信息
interface EmojiDetailProps {
  emoji: EmojiData;
  lang: string;
}

// EmojiGrid 组件用于网格布局显示多个 Emoji
interface EmojiGridProps {
  emojis: EmojiData[];
  lang: string;
  columns?: number;
}
```

#### 3. 分类组件

```typescript
// CategoryCard 组件用于显示分类卡片
interface CategoryCardProps {
  category: CategoryData;
  lang: string;
  showCount?: boolean;
}

// CategoryNav 组件用于分类导航
interface CategoryNavProps {
  categories: CategoryData[];
  currentCategory?: string;
  lang: string;
}

// Breadcrumb 组件用于面包屑导航
interface BreadcrumbProps {
  items: BreadcrumbItem[];
  lang: string;
}
```

#### 4. 搜索组件

```typescript
// SearchBox 组件用于搜索输入
interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder: string;
  lang: string;
}

// SearchResults 组件用于显示搜索结果
interface SearchResultsProps {
  results: EmojiData[];
  query: string;
  lang: string;
}

// SearchSuggestions 组件用于搜索建议
interface SearchSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}
```

## 数据模型

### 核心数据类型

#### Emoji 数据模型

```typescript
interface EmojiData {
  emoji: string; // Emoji 符号
  os_support: OSSupport[]; // 操作系统支持信息
  images_url: string; // 图片 URL
  base_info: {
    emoji: string;
    short_name: string; // 短名称
    apple_name: string; // Apple 名称
    known_as: string[]; // 已知别名
    unicode: string; // Unicode 编码
    short_code: string; // 短代码 (:code:)
    decimal: string; // 十进制代码
    unicode_version: string; // Unicode 版本
    emoji_version: string; // Emoji 版本
    category: string; // 主分类
    sub_category: string; // 子分类
    keywords: string[]; // 关键词
    proposal: string[]; // 提案信息
  };
  langs: LanguageData[]; // 多语言名称
}

interface OSSupport {
  type: "iOS" | "android" | "windows";
  value: string;
}

interface LanguageData {
  lang: string; // 语言代码
  name: string; // 本地化名称
}
```

#### 分类数据模型

```typescript
interface CategoryData {
  category: string; // 分类名称（带 Emoji）
  title: string; // 分类标题
  slug: string; // URL slug
  url: string; // 完整 URL
  count?: number; // Emoji 数量
  subs?: SubCategoryData[]; // 子分类
}

interface SubCategoryData {
  category: string; // 子分类名称（带 Emoji）
  title: string; // 子分类标题
  slug: string; // URL slug
  url: string; // 完整 URL
  count: number; // Emoji 数量
}
```

### 数据访问层

#### 数据服务接口

```typescript
interface DataService {
  // Emoji 相关方法
  getEmojiByUnicode(unicode: string, lang: string): Promise<EmojiData | null>;
  getEmojisByCategory(categorySlug: string, lang: string): Promise<EmojiData[]>;
  getEmojisBySubCategory(
    subCategorySlug: string,
    lang: string
  ): Promise<EmojiData[]>;
  searchEmojis(query: string, lang: string): Promise<EmojiData[]>;

  // 分类相关方法
  getCategories(lang: string): Promise<CategoryData[]>;
  getCategoryBySlug(slug: string, lang: string): Promise<CategoryData | null>;
  getSubCategories(lang: string): Promise<CategoryData[]>;
  getSubCategoryBySlug(
    slug: string,
    lang: string
  ): Promise<SubCategoryData | null>;
}
```

## 错误处理

### 错误类型定义

```typescript
enum ErrorType {
  NOT_FOUND = "NOT_FOUND",
  INVALID_LANGUAGE = "INVALID_LANGUAGE",
  DATA_LOAD_ERROR = "DATA_LOAD_ERROR",
  SEARCH_ERROR = "SEARCH_ERROR",
}

interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
}
```

### 错误处理策略

1. **404 错误**: 当 Emoji 或分类不存在时，显示友好的 404 页面
2. **语言回退**: 当请求的语言不支持时，回退到英文
3. **数据加载错误**: 显示错误提示并提供重试选项
4. **搜索错误**: 显示搜索失败提示，保持用户输入

### 错误页面组件

```typescript
interface ErrorPageProps {
  error: AppError;
  lang: string;
  onRetry?: () => void;
}

interface NotFoundPageProps {
  lang: string;
  type: "emoji" | "category" | "page";
}
```

## 测试策略

### 测试层级

1. **单元测试**: 测试工具函数、数据处理逻辑
2. **组件测试**: 测试 React 组件的渲染和交互
3. **集成测试**: 测试页面级别的功能
4. **E2E 测试**: 测试完整的用户流程

### 测试工具

- **Jest**: 单元测试框架
- **React Testing Library**: 组件测试
- **Playwright**: E2E 测试

### 关键测试场景

```typescript
// 数据服务测试
describe("DataService", () => {
  test("should load emoji data correctly");
  test("should handle missing emoji gracefully");
  test("should support multiple languages");
  test("should filter by category correctly");
});

// 组件测试
describe("EmojiCard", () => {
  test("should render emoji information");
  test("should handle click events");
  test("should support different sizes");
});

// 页面测试
describe("Emoji Detail Page", () => {
  test("should display emoji details");
  test("should show OS support information");
  test("should provide language switching");
});
```

## 性能优化

### 静态生成策略

1. **预生成热门页面**: 生成前 100 个最常用的 Emoji 页面
2. **增量静态再生成**: 使用 ISR 按需生成其他页面
3. **分类页面预生成**: 预生成所有主分类和子分类页面

### 代码分割

```typescript
// 动态导入大型组件
const EmojiGrid = dynamic(() => import("./EmojiGrid"), {
  loading: () => <EmojiGridSkeleton />,
});

// 按路由分割代码
const SearchPage = dynamic(() => import("./SearchPage"));
```

### 图片优化

1. **Next.js Image 组件**: 自动优化图片格式和大小
2. **懒加载**: 使用 Intersection Observer 实现图片懒加载
3. **WebP 支持**: 在支持的浏览器中使用 WebP 格式

### 缓存策略

```typescript
// 静态数据缓存
const CACHE_DURATION = {
  EMOJI_DATA: 24 * 60 * 60, // 24 小时
  CATEGORY_DATA: 12 * 60 * 60, // 12 小时
  SEARCH_RESULTS: 5 * 60, // 5 分钟
};

// 浏览器缓存配置
const cacheHeaders = {
  "Cache-Control": "public, max-age=31536000, immutable",
};
```

## 国际化设计

### 语言支持

- **主要语言**: 英文 (en)、简体中文 (zh-hans)、繁体中文 (zh-hant)
- **扩展语言**: 支持添加更多语言

### URL 结构

```
/en/                          # 英文首页
/zh-hans/                     # 简体中文首页
/en/categories/A              # 英文分类页面
/zh-hans/categories/A         # 中文分类页面
/en/emoji/U+1F600            # 英文 Emoji 页面
/zh-hans/emoji/U+1F600       # 中文 Emoji 页面
```

### 语言切换实现

```typescript
interface LanguageSwitcherProps {
  currentLang: string;
  currentPath: string;
  availableLanguages: Language[];
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
}
```

## SEO 优化

### Meta 标签策略

```typescript
interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
  alternateLanguages?: AlternateLanguage[];
}

// 动态生成 meta 标签
function generateMetaTags(emoji: EmojiData, lang: string): SEOConfig {
  return {
    title: `${emoji.emoji} ${emoji.base_info.short_name} - Emoji Family`,
    description: `Learn about ${emoji.emoji} emoji: ${
      emoji.base_info.short_name
    }. Unicode: ${
      emoji.base_info.unicode
    }, Keywords: ${emoji.base_info.keywords.join(", ")}`,
    keywords: [emoji.base_info.short_name, ...emoji.base_info.keywords],
    ogImage: `/api/og/emoji/${encodeURIComponent(emoji.base_info.unicode)}`,
    canonical: `https://emojifamily.com/${lang}/emoji/${encodeURIComponent(
      emoji.base_info.unicode
    )}`,
  };
}
```

### 结构化数据

```typescript
// JSON-LD 结构化数据
interface EmojiStructuredData {
  "@context": "https://schema.org";
  "@type": "Thing";
  name: string;
  description: string;
  identifier: string;
  category: string;
  keywords: string[];
}
```

### 站点地图生成

```typescript
// 自动生成 sitemap.xml
interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
  alternateLanguages?: AlternateLanguage[];
}
```

## 响应式设计

### 断点设计

```css
/* Tailwind CSS 断点 */
sm: 640px   /* 小屏幕 */
md: 768px   /* 中等屏幕 */
lg: 1024px  /* 大屏幕 */
xl: 1280px  /* 超大屏幕 */
2xl: 1536px /* 超超大屏幕 */
```

### 组件响应式策略

```typescript
// 响应式网格布局
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// 响应式 Emoji 卡片大小
const emojiSizes = {
  sm: "text-2xl", // 移动端
  md: "text-3xl", // 平板
  lg: "text-4xl", // 桌面
  xl: "text-5xl", // 大屏幕
};
```

## 安全考虑

### 输入验证

```typescript
// 搜索查询验证
function validateSearchQuery(query: string): boolean {
  return query.length <= 100 && !/[<>\"'&]/.test(query);
}

// Unicode 参数验证
function validateUnicodeParam(unicode: string): boolean {
  return /^U\+[0-9A-F]{4,6}$/i.test(unicode);
}
```

### XSS 防护

1. **React 自动转义**: 利用 React 的自动 HTML 转义
2. **DOMPurify**: 对用户输入进行清理
3. **CSP 头部**: 配置内容安全策略

### 数据验证

```typescript
// 运行时数据验证
import { z } from "zod";

const EmojiDataSchema = z.object({
  emoji: z.string(),
  base_info: z.object({
    unicode: z.string(),
    short_name: z.string(),
    category: z.string(),
  }),
});
```
