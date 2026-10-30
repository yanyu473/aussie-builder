# Aussie Builder — 营销官网 MVP

面向澳洲中小企业的 AI 建站服务官网。按 `产品需求文档（PRD）v1.0` 实现，纯静态前端 + 一个零依赖的本地后端。

> **在线预览**：https://yanyu473.github.io/aussie-builder/
>
> 托管在 GitHub Pages 上，所以**没有后端**——表单会进入「预览模式」，线索不会真的发送，页面上也写明了这一点。要看完整的表单提交、后台看板和线索通知，本地跑 `python server.py`。

---

## 快速开始

```bash
# Windows：双击 start.bat
# 或手动
python server.py
```

验证它真的能用：

```bash
python _tools/smoke_test.py      # 34 项端到端检查
python _tools/contrast_check.py  # 21 组配色的 WCAG 对比度
```

两个脚本都是非零退出码表示有失败，可以直接接 CI。

打开 `http://localhost:8000`。启动时控制台会打印后台地址和管理令牌：

```
site    http://127.0.0.1:8000/index.html
admin   http://127.0.0.1:8000/admin.html?token=xxxxxxxx
```

**没有 Python 也能看**——`index.html` 可以直接双击打开，或丢到任意静态托管上。此时表单进入**预览模式**：校验照常、成功页照常，但不会保存，页面上会明确写出「这条没有发出去」。这不是假装成功。

---

## 它现在真能做什么

| 功能 | 有后端 | 纯静态托管 |
|---|---|---|
| 联系表单 | 写入 `data/leads.jsonl`，后台可见 | 预览模式，明确提示未发送 |
| 聊天留资 | 同上，`source=chat` | 预览模式 |
| 后台看板 | 列表、筛选、改状态、写备注、导出 CSV | 不可用 |
| 报价估算器 | 全功能，参数带进表单并随线索保存 | 同左（纯前端计算） |
| 聊天机器人 | 配置了模型密钥时走真模型，否则走内置知识库 | 内置知识库 |
| 首屏演示切换 | 全功能（5 个行业可点，自动轮播） | 同左（纯前端） |
| 「把你的店名放上去」 | 全功能（输入即换，纯前端） | 同左 |

---

## 页面结构

| 文件 | 对应 PRD 章节 | 内容 |
|---|---|---|
| `index.html` | 6. 首页详细需求 | 首屏 Banner（可切换）、行业条、价值卖点、案例轮播、**店名实时预览**、四步流程（深色块）、报价预告、FAQ 精选 |
| `cases.html` | 9. 案例展示页 | 行业筛选、16:10 卡片网格、悬停放大、大图弹窗（含「故意没做」说明） |
| `case-*.html` ×5 | 9. 案例详情 | 每案独立页面：需求、做了什么、故意没做、项目信息、上下篇 |
| `services.html` | 4.1 / 6.4 | 四步流程详解、每档都含的基础件、交付清单、明确不做的事、覆盖行业 |
| `pricing.html` | 7. 报价页 | 报价估算器、三档套餐、12 行功能矩阵、7 条价格与流程 FAQ |
| `contact.html` | 10. 联系 / 需求提交 | 8 字段表单 + 蜜罐 + 频率限制 + 成功态 + 估算器参数预填 |
| `admin.html` | — | 线索看板（令牌保护，`noindex`） |
| `privacy.html` | 12. 隐私合规 | 隐私政策（Privacy Act 1988 / APPs）+ 服务条款 |
| `404.html` | — | 兜底页 |

---

## 目录

```
aussie-ai-builder/
├── index.html / cases.html / services.html / pricing.html / contact.html
├── case-restaurant.html / case-salon.html / case-hardware.html
├── case-sports.html / case-golf.html          5 个案例详情页
├── privacy.html / 404.html / admin.html
├── server.py              本地后端（标准库，无依赖）
├── start.bat              启动 server.py
├── sitemap.xml / robots.txt / manifest.webmanifest
├── .gitignore             忽略 data/
├── data/                  运行时生成：leads.jsonl + .token（不进版本库）
├── assets/
│   ├── css/site.css       全部样式（token → 组件 → 页面 → 响应式 → v3 编辑感层）
│   ├── js/
│   │   ├── api.js         后端探测 + 线索/对话客户端
│   │   ├── admin.js       后台看板逻辑
│   │   ├── i18n.js        中文词条 + 语言切换引擎（英文在 HTML 里，是 SEO 源）
│   │   ├── site.js        导航、抽屉、轮播、案例筛选与灯箱、表单校验与提交
│   │   ├── estimator.js   报价估算器
│   │   ├── chat.js        聊天（模型优先，知识库兜底）+ 留资流程
│   │   └── analytics.js   GA4 加载器（默认关闭，填 ID 即生效）
│   ├── fonts/inter-latin.woff2   Inter 可变字体（100–900，自托管）
│   └── img/
│       ├── cases/*.webp   5 张行业示例站截图
│       ├── favicon.svg / favicon-32.png / apple-touch-icon.png
│       └── og-cover.jpg
├── demo/                  5 个示例站源文件 + photos/ 实拍素材（重新出图用）
├── _tools/
│   ├── build_pages.py     页面生成器
│   ├── smoke_test.py      端到端冒烟测试
│   └── contrast_check.py  WCAG 对比度审计
└── _legacy/               v1（Claude 首版）原文件，仅作对照保留
```

---

## 后端

`server.py`，Python 标准库，无需 `pip install`。

### 接口

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/health` | 前端用它判断走哪条路径；返回 `{ok, backend, chat, leads}` |
| `POST` | `/api/leads` | 提交线索。蜜罐字段 `company_website` 有值则静默丢弃；按 IP 限流 5 次 / 10 分钟 |
| `GET` | `/api/leads` | 列表，需 `X-Admin-Token` |
| `PATCH` | `/api/leads/<id>` | 改 `status` / `notes`，需令牌 |
| `GET` | `/api/leads.csv` | 导出 CSV（带 BOM，Excel 直接打开），需令牌 |

### 数据

追加写入 `data/leads.jsonl`，一行一条，`fsync` 落盘。改状态时整体重写（先写临时文件再替换）。**没有数据库依赖，文件即数据**——要迁移到 MySQL/Supabase 就是照着字段建表。

字段：`id / created_at / source / status / business / industry / name / email / phone / site / brief / plan / estimate / notes / ip / ua`

### 安全

- 管理令牌首次启动随机生成到 `data/.token`（权限 600），或用 `AB_ADMIN_TOKEN` 覆盖。
- `data/` 目录整体返回 403，不通过静态服务暴露。
- 服务端二次校验所有字段（邮箱、电话、长度），不信任前端。
- 限流：线索 5 次 / 10 分钟，聊天 40 条 / 10 分钟，都按 IP。内存态，重启清零；生产环境请在反向代理层再做一层。
- 响应头：`Content-Security-Policy`（无 `unsafe-inline` 脚本）、`X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy`、`Permissions-Policy`、`Cross-Origin-Opener-Policy`。
- 文本响应走 gzip（CSS 54KB → 11KB，首页 40KB → 8KB），图片不压。
- 未知路径返回真正的 `404.html`（状态码 404），不是断连。
- `AB_DATA_DIR` 可以把数据目录指到别处（测试和容器部署用）。

### 线索通知

线索进来时除了落盘，还可以推出去。不配就什么都不发。

```bash
# 任意能收 JSON POST 的地址：Slack / 飞书 / Zapier / 自建
AB_LEAD_WEBHOOK=https://hooks.slack.com/services/xxx

# 或者走邮件
AB_SMTP_HOST=smtp.example.com
AB_SMTP_PORT=587
AB_SMTP_USER=you@example.com
AB_SMTP_PASS=...
AB_LEAD_EMAIL=leads@yourdomain.com.au
```

推送在后台线程里跑，**不会拖慢访客的提交**；失败只写日志，不影响线索已经存下来这件事。Webhook 的 body 同时带 `text`（Slack/Discord 直接可读）和完整的 `lead` 对象。

### 接真模型（可选）

不配密钥时聊天走 `assets/js/chat.js` 里的规则知识库——即时、离线、不可能编报价。

配了密钥就走真模型，`server.py` 里已内置系统提示词（把套餐、加项、交付周期、明确不做的范围都写死在里面，并禁止模型自报价）：

```bash
# Windows PowerShell
$env:AB_LLM_KEY="sk-..."
$env:AB_LLM_MODEL="gpt-4o-mini"      # 可选
python server.py
```

任何 OpenAI 兼容的网关都行（`AB_LLM_BASE` 改地址）。模型调用失败、超时或没配额时，前端**自动回退到知识库**，不会把错误抛给访客。

---

## 部署到生产

前端是纯静态的，三条路：

1. **托管静态文件**（Netlify / Vercel / S3 / GitHub Pages）：表单进入预览模式。要收线索，把 `<form data-endpoint="https://your-api/leads">` 填上，前端会直接 POST 到你自己的接口，字段同上。
2. **跑 `server.py`**（任意有 Python 的机器 + 反向代理）：改 `--host 0.0.0.0`，前面套 Nginx/Caddy 做 TLS 和一层限流。
3. **换成无服务器函数**：`/api/leads` 的逻辑很短，搬到 Cloudflare Workers / Vercel Functions 半天的事。

---

## 文案与多语言

**英文是主语言，直接写在 HTML 里**——SEO 抓得到、首屏不会闪。中文是一层覆盖：

- 英文文案：改 HTML 里的文本节点。
- 中文文案：改 `assets/js/i18n.js` 的 `ZH` 对象，键名对应 `data-i18n="..."`。
- 属性用 `data-i18n-ph` / `data-i18n-aria` / `data-i18n-title`；含内联标签的用 `data-i18n-html`。
- 语言选择存 `localStorage`（`ab.lang`）。

> 序号（`01 / 02`）写在 `data-i18n` 的**外层**——写在里面会被 textContent 覆盖掉。

> `privacy.html` 只有英文。澳洲法律文书用英文是惯例，也避免译文歧义。

---

## 报价估算器

`pricing.html#estimator`，逻辑在 `assets/js/estimator.js`。

- 价格常量在文件顶部（`BASE` / `PRODUCTS` / `EXTRAS`），和 `pricing.html` 的功能矩阵同源，改价两处一起改。
- 只出区间不出单一数字：`high = ceil(low × 1.22 / 50) × 50`。
- 跳转时带 `tier / pages / products / extras`，`site.js` 读参数预填套餐与需求描述，`estimate` 字段随线索一起入库。

---

## 重新生成

页头 / 页尾 / 聊天窗只在 `index.html` 维护一份，其余页面由生成器拼装：

```bash
python _tools/build_pages.py
```

改完 `index.html` 记得重跑，否则其他页面还是旧的。

重新出案例截图：

```bash
# 改 demo/*.html（照片在 demo/photos/），然后
chrome --headless=new --force-device-scale-factor=2 --window-size=1440,900 \
       --screenshot=out.png demo/restaurant.html
# 缩到 1440×900 转 WebP（quality 82，约 40–70KB/张）
```

---

## 变更记录

### v9 — 把一个名字变成一张网站

首页新增「Put your name on it」：输入店名、点一个行业，右边立刻出现一张**带你自己名字的迷你网站**——地址栏、logo、导航、标题、按钮全套换掉。

- 六个皮肤对应五套 demo 站的真实配色与字体（餐厅/美甲/高尔夫用衬线，五金/体育用无衬线），另有一个中性皮肤给「其他行业」。
- 纯前端，无请求、无生成、无 AI 调用——打字即渲染。这是刻意的：**它不需要联网就能用，也不会让人等**。
- 文案上明确写「A style preview, not a build」，不假装是生成出来的站。迷你站的英文是故意的——它模拟的是客户自己的澳洲站。
- 名字用 `createTextNode` 写入，输入 `<img onerror=...>` 不会注入（已验证）。
- 这一节把首页区块编号推到 01–06，底色节奏也重排成 白 / 浅 / 白 / 深 / 浅 / 白。

### v8 — 去依赖与可验证的无障碍

这一轮没有加功能，处理的是两件「说了但没做」的事：

- **字体自托管**：Inter 从 Google Fonts 换成仓库内的一个 47KB 可变字体（100–900 全覆盖）。全站从此**没有任何第三方请求**——少一次 DNS + TLS 握手，不阻塞渲染，离线可用，访客 IP 也不再流到 Google。CSP 里的 `fonts.googleapis.com` / `fonts.gstatic.com` 随之删掉，`font-src` 收窄到 `'self'`。顺带发现 Python 的 mimetypes 不认识 `.woff2`，补了 `font/woff2` / `font/webmanifest` 等类型。
- **对比度审计**：README 一直写着「WCAG 2.1 AA」，但从没算过。新增 `_tools/contrast_check.py`，直接从 `site.css` 读色值算 21 组配色，查出三处不达标并修掉：

  | 位置 | 原值 | 比值 | 现值 | 比值 |
  |---|---|---|---|---|
  | 编号数字 | `#A96A1D` | 4.41 | `#A2651A` | 4.76 |
  | 页脚版权行 | 白 42% | 4.07 | 白 48% | 4.92 |
  | 表单占位符 | `#9AA5A2` | 2.54 | `#6B7674` | 4.70 |

  审计脚本读的是样式表本身（含 `rgba()` 里的透明度），不会和实际样式漂移。

另外两件小事：后台加了搜索框（业务名 / 联系人 / 邮箱 / 电话 / 需求 / 备注全文匹配）；5 个案例页补了 `CreativeWork` 结构化数据。

### v7 — 案例深度

案例之前只有卡片和弹窗，点进去是个死胡同，也分享不出去。这一版把 5 个案例都做成独立页面：

- 每个案例一页：需求背景（两段）、我们做了什么（四条）、**故意没做**（一条）、项目信息卡（行业 / 套餐 / 页面数 / 周期）、上下篇导航。
- 卡片本身变成真链接（`h3 > a` + 撑满整卡的伪元素），原来那个「点卡片开弹窗」改成卡片下方的「快速预览」按钮——PRD 第 9 节要的弹窗还在，但主操作变成了跳转。
- 首页轮播的「查看完整案例」直接指向对应页面。
- sitemap 从 6 个 URL 增加到 11 个。
- 冒烟测试覆盖到 34 项。

### v6 — 交互感

首页原本是一张静态截图，这一版把它变成可操作的产品演示：

- **首屏行业切换**：浏览器框下方一排 tab（餐厅 / 美甲 / 五金 / 体育 / 高尔夫），点一下换图 + 换地址栏域名。默认每 4.8 秒自动轮播，**用户一点就停**，不再抢注意力。悬停暂停、方向键切换、`aria-selected` + roving tabindex 都做了。图片先解码再淡入，不会出现空白帧。
- **阅读进度条**：顶部 2px 渐变线，从墨绿到赭石。`scrollHeight` 只在 resize / 内容高度变化（ResizeObserver）时测量，滚动时只写一个样式。
- **案例轮播支持滑动**：手机上左右滑切换，之前只能点箭头。
- **估算器数值反馈**：价格变化时数字轻微弹一下，明细逐条淡入。
- **悬停反馈**：价值卖点的编号字距张开、流程步骤的大数字变白上移。

### v5 — 生产就绪

后端能跑了，但还不够上线。这一版补的是运营和加固：

- **线索通知**：`AB_LEAD_WEBHOOK`（Slack / 飞书 / Zapier 任选）或 SMTP 邮件。后台线程推送，不阻塞访客提交；失败只记日志。
- **安全头**：CSP（把 admin 的内联脚本拆成 `assets/js/admin.js` 才能去掉 `unsafe-inline`）、nosniff、X-Frame-Options、Referrer-Policy、Permissions-Policy、COOP。
- **gzip**：文本响应全部压缩，CSS 54KB → 11KB，首页 40KB → 8KB；图片不压。顺带修了 Python 3.12+ 把 `.js` 的 MIME 改成 `text/javascript` 导致 JS 漏压的问题。
- **404**：未知路径返回真正的 404 页（之前是直接断连）。
- **聊天限流**：40 条 / 10 分钟 / IP，保护模型接口。
- **移动端粘性 CTA**：滚动 700px 后出现「打电话 + 获取报价」，联系页自动隐藏；出现时聊天按钮上移让位。
- **冒烟测试**：`_tools/smoke_test.py`，29 项断言，跑在临时数据目录上，不碰真实线索，非零退出码可直接接 CI。

### v4 — 从壳到能用

之前表单是演示模式、聊天是纯前端关键词匹配，线索提交后哪也不去。这一版补上后端：

- **`server.py`**：静态服务 + 线索接口 + 后台接口 + 可选模型代理，标准库实现。
- **`admin.html`**：线索看板，统计、状态筛选、展开看详情、改状态、写备注、导出 CSV。
- **`api.js`**：启动时探测 `/api/health`，自动在「真后端 / 预览模式」之间切换；所有调用方都等这个探测结果，所以探测没完成就提交也不会走错路。
- 表单三种传输按优先级：表单自带 `data-endpoint` → 本地后端 → 预览模式。预览模式在成功页明确写「这条没有发出去」，不假装成功。
- 聊天：后端报有模型就走真模型（带系统提示词防编报价），否则或失败时自动回退到内置知识库。

### v3 — 编辑感与转化

- 字号整体放大一档；区块标题改两栏（标题左、导语右）；价值卖点改发丝线网格 + 编号；四步流程改深色块 + 超大数字。
- 新增报价估算器与表单参数预填。
- 服务页加交付清单，案例灯箱加「故意没做」。
- 5 个 demo 站的 CSS 插画换成实拍照片。
- 补 favicon / apple-touch-icon / manifest；标题层级跳级清零。

### v2 — 对齐 PRD

- 报价从 `$599 / $1,299 / $2,499+` 改回 PRD 的 `$499 / $999 / $1,999 起`；套餐矩阵从 5 条补到 12 行。
- 单页拆成 5 个独立页面 + 隐私政策 + 404；补四步流程、FAQ、联系表单、案例筛选与弹窗。
- 聊天机器人 5 类关键词扩到 8 类意图，加留资流程、兜底转人工、价格硬编码。
- 补 SEO（OG / JSON-LD / hreflang / sitemap / robots）与 WCAG 2.1 AA 基础项。
- 修 v1 的 `.carousel-image` 无效 `object-fit`、移动端 `1fr` 网格溢出、导航在手机上直接消失。

---

## 已知待办

- [ ] **正式澳元定价待业务负责人确认**。当前为 PRD 参考价，估算器加项（产品图册 $150/$450、预约嵌入 $180、博客 $250、多语言 $600）也是按这套推的。
- [ ] **品牌名、Logo、主色、域名待定**。占位域名 `aussiebuilder.com.au` 写在 canonical / OG / sitemap / manifest 里，换域名时全局替换。
- [ ] 联系方式是占位：`hello@aussiebuilder.com.au` / `+61 2 8000 0000` / `ABN 12 345 678 901`。
- [ ] 案例为匿名 Demo 品牌，照片为 AI 生成，正式对外前建议换成客户实拍或授权图库。
- [ ] 生产部署前：`server.py` 前面套反向代理做 TLS；`AB_ADMIN_TOKEN` 改成强口令；`AB_LEAD_WEBHOOK` 或 SMTP 至少配一个（否则线索只在后台，没人知道）。
- [ ] 线索量上来后把 `data/leads.jsonl` 换成真数据库——字段已定，照着建表即可。
- [ ] `privacy.html` 是模板级文本，上线前建议过一遍法务。

---

## 浏览器与性能

- Chrome / Safari / Edge / Firefox 近两个大版本，iOS Safari、Android Chrome。
- 无 JS 时：内容全部可读，导航和表单降级为普通链接/原生提交，轮播只显示第一张。
- 图片总量约 320 KB。**无任何第三方请求**——字体自托管，无 CDN、无统计脚本（GA4 默认关闭）。
- 已做：`prefers-reduced-motion`、打印样式、`focus-visible`、`overflow-x` 保护、`minmax(0,1fr)` 防溢出。

---

**版本**：v9.0（PRD v1.0 + 编辑感 + 可用后端 + 生产加固 + 交互 + 案例页 + 去依赖 + 实时预览）
**更新日期**：2026-10-30
