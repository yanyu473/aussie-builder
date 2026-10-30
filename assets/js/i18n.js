/* ==========================================================================
   i18n — English is the source of truth and lives in the HTML.
   This file holds the Simplified Chinese overlay plus the swap engine.
   Add a key to ZH, add data-i18n="key" to the element. Done.
   ========================================================================== */

const ZH = {
  /* ---- Shell ---- */
  'meta.langSwitch': 'Switch to English',
  'nav.cases': '案例展示',
  'nav.services': '服务介绍',
  'nav.pricing': '报价套餐',
  'nav.contact': '联系我们',
  'nav.cta': '获取免费报价',
  'mobile.call': '打电话给我们',
  'nav.brandSub': '本地商家建站',

  'footer.blurb': '用 AI 帮澳洲中小企业快速做出专业官网。填一份问卷，我们负责剩下的。',
  'footer.colCompany': '公司',
  'footer.colServices': '服务',
  'footer.colContact': '联系方式',
  'footer.about': '关于我们',
  'footer.cases': '客户案例',
  'footer.contact': '联系我们',
  'footer.privacy': '隐私政策',
  'footer.terms': '服务条款',
  'footer.site': '建站套餐',
  'footer.seo': '本地 SEO',
  'footer.care': '网站维护',
  'footer.rights': '保留所有权利。',
  'footer.abn': 'ABN 12 345 678 901',

  /* ---- Shared ---- */
  'cta.title': '准备好看看你的官网长什么样了吗？',
  'cta.body': '告诉我们你的生意是做什么的，一个工作日内给你一份针对性报价。不签约、不催单。',
  'cta.primary': '获取免费报价',
  'cta.secondary': '先看看案例',

  /* ---- Home · hero ---- */
  'preview.eyebrow': '试一试',
  'preview.title': '把你的店名放上去',
  'preview.lede': '两个字段，不用留邮箱。这只是样式预览、不是真做出来的站——但这是让你最快看懂我们意思的办法。',
  'preview.nameLabel': '你的店名',
  'preview.namePh': '例如：Bella\'s Nails',
  'preview.industryLabel': '你是做什么的',
  'preview.note': '只是样式预览。真正的站从你的内容开始，不是套模板。',
  'preview.cta': '来真的',
  'hero.tabsLabel': '按行业看示例站',
  'hero.tab1': '餐厅',
  'hero.tab2': '美甲',
  'hero.tab3': '五金',
  'hero.tab4': '体育',
  'hero.tab5': '高尔夫',
  'home.hero.eyebrow': '面向澳洲中小企业',
  'home.hero.title': '给澳洲小店做一个像样的官网，<em>几天上线</em>。',
  'home.hero.sub': '不用写代码，也不用跟设计公司来回拉扯。咖啡馆、美甲店、五金工具店、体育用品店、高尔夫店——你只需要填一份问卷，剩下的交给我们。',
  'home.hero.cta': '获取免费报价',
  'home.hero.ctaAlt': '查看案例',
  'home.hero.m1': '起步价 AUD $499',
  'home.hero.m2': '首稿 3 个工作日交付',
  'home.hero.m3': '不收年费绑定',
  'home.hero.chipA': '首稿交付',
  'home.hero.chipAVal': '3 个工作日',
  'home.hero.chipB': '适配',
  'home.hero.chipBVal': '手机 / 电脑 / 平板',

  'home.strip.label': '专注五个行业',
  'home.strip.i1': '餐厅与咖啡馆',
  'home.strip.i2': '美甲美业',
  'home.strip.i3': '五金工具',
  'home.strip.i4': '体育用品',
  'home.strip.i5': '高尔夫用品',

  /* ---- Home · values ---- */
  'home.values.eyebrow': '为什么是我们',
  'home.values.title': '省掉中间那些来回',
  'home.values.lede': '传统建站要走需求、设计、前端、上线四拨人。我们把能自动化的部分交给 AI，把人留在真正需要判断的地方。',
  'home.values.v1t': 'AI 起草整站',
  'home.values.v1d': '你填一份简短问卷，AI 按行业模板把整站文案和版式先搭出来。你审，我们改，不从空白页开始。',
  'home.values.v2t': '按澳洲习惯做',
  'home.values.v2d': '营业时间、谷歌地图、本地电话格式、英文措辞——这些默认就配好，不用你逐条交代。',
  'home.values.v3t': '首稿 3 个工作日',
  'home.values.v3d': '不是三周。首稿出来你先看方向对不对，方向对了再谈细节。',
  'home.values.v4t': '手机上先做好',
  'home.values.v4d': '八成客人是在手机上找到你的。所以每个页面都先在手机尺寸上过一遍，再放到电脑上看。',

  /* ---- Home · cases ---- */
  'home.cases.eyebrow': '客户案例',
  'home.cases.title': '五个行业，五种做法',
  'home.cases.lede': '下面都是我们按行业做的示例站。真实客户项目在上线前会签授权，未授权的门店名我们不会用。',
  'home.cases.all': '查看全部案例',
  'home.cases.prev': '上一个案例',
  'home.cases.next': '下一个案例',
  'home.cases.play': '暂停自动轮播',
  'home.cases.pause': '继续自动轮播',
  'home.cases.goto': '跳到第 {n} 个案例',

  /* ---- Home · process ---- */
  'home.process.eyebrow': '怎么合作',
  'home.process.title': '四步，从问卷到上线',
  'home.process.lede': '整个流程你只需要参与两次：填问卷，和看首稿。',
  'home.process.s1t': '告诉我们你的生意',
  'home.process.s1d': '一份 10 分钟的问卷：做什么的、在哪个区、有几家店、想突出什么。',
  'home.process.s2t': 'AI 起草整站',
  'home.process.s2d': '按行业模板 + 你填的内容生成初稿，文案、版式、结构一次到位。',
  'home.process.s3t': '你审核，我们改',
  'home.process.s3d': '把不满意的地方标出来，我们按轮次改。基础版 1 轮，专业版 3 轮。',
  'home.process.s4t': '交付并上线',
  'home.process.s4d': '绑域名、配邮箱、提交谷歌收录。上线当天给你一份操作说明。',
  'home.process.more': '了解每一步的细节',

  /* ---- Home · pricing preview ---- */
  'home.pricing.eyebrow': '报价',
  'home.pricing.title': '三档，起步价写在这里',
  'home.pricing.lede': '所有价格以澳元计价，不含 GST。域名和托管单独报价，也可以你自己买。',
  'home.pricing.all': '查看完整报价对比',
  'home.pricing.from': '起步价',
  'home.pricing.popular': '最受欢迎',

  /* ---- Home · FAQ ---- */
  'home.faq.eyebrow': '常见问题',
  'home.faq.title': '先回答几个最常问的',
  'home.faq.q1': '多久能做好？',
  'home.faq.a1': '首稿 3 个工作日。基础版整体 5 个工作日交付，专业版 7 个，定制版 10–14 个。计时从你交齐素材那天开始，不是从签约那天。',
  'home.faq.q2': '我需要会写代码吗？',
  'home.faq.a2': '不需要。你要做的是把生意讲清楚——卖什么、客人是谁、想让客人做什么。剩下的排版和代码我们处理。',
  'home.faq.q3': '以后我自己能改文案和价格吗？',
  'home.faq.a3': '能。上线时我们会给你一个后台账号，改文字、换图片、调价格都可以自己来。不想自己弄也可以按次找我们。',
  'home.faq.q4': '需要我提供什么？',
  'home.faq.a4': 'Logo（没有我们可以做一个简单的字标）、门店照片或产品图、营业时间和地址、一段介绍你生意的文字。文案写不出来也没关系，问卷里问什么你答什么就行。',
  'home.faq.ask': '还有别的问题？问我们的 AI 助手',
  'home.faq.more': '查看全部问题',

  /* ---- Cases page ---- */
  'cases.hero.eyebrow': '客户案例',
  'cases.hero.title': '五个行业，看做法差别在哪',
  'cases.hero.sub': '同一个模板引擎，餐厅要的是订位和菜单，五金店要的是产品目录和门店位置。下面每一张都能点开看大图和说明。',
  'cases.filter.all': '全部',
  'cases.filter.label': '按行业筛选',
  'cases.count': '共 {n} 个案例',
  'cases.empty': '这个行业暂时还没有案例。',
  'cases.zoom': '查看大图',
  'cases.open': '打开案例：{name}',
  'cases.lightboxClose': '关闭',
  'cases.disclaimer': '以上均为按行业制作的示例站，使用匿名 Demo 品牌。真实客户项目在获得书面授权后才会公开。',

  /* ---- Services page ---- */
  'services.hero.eyebrow': '服务介绍',
  'services.hero.title': 'AI 建站到底是怎么做的',
  'services.hero.sub': '外面说「AI 建站」的有两种：一种是给你一个拖拽编辑器让你自己拼；另一种是真的把整站先做出来给你看。我们是后者。',
  'services.how.eyebrow': '流程',
  'services.how.title': '四步，每一步你都能看见东西',
  'services.step1t': '第 1 步 · 问卷',
  'services.step1d': '十分钟，十几个问题。行业、位置、营业时间、想突出的卖点、有没有现成照片。答不上来的可以空着，我们会追问。',
  'services.step1n': '你参与',
  'services.step2t': '第 2 步 · AI 起草',
  'services.step2d': '系统按行业模板生成结构，用你填的内容写文案，配色和字体从一组为澳洲本地商业调过的方案里选。出来的是一份能点能看的完整初稿，不是设计稿。',
  'services.step2n': '我们做',
  'services.step3t': '第 3 步 · 你审核',
  'services.step3d': '你会拿到一个预览链接，手机电脑都能打开。哪里不对直接在页面上标注，或者列个清单发给我们。',
  'services.step3n': '你参与',
  'services.step4t': '第 4 步 · 交付上线',
  'services.step4d': '绑域名、配企业邮箱、提交谷歌收录、装统计。上线后给你一份后台操作说明，改字换图自己就能做。',
  'services.step4n': '我们做',

  'services.inc.eyebrow': '包含什么',
  'services.inc.title': '每一档都包含的基础件',
  'services.inc.lede': '下面这些不是加钱项，是底线。',
  'services.inc.i1t': '手机优先的自适应',
  'services.inc.i1d': '先在 375px 宽度上排好，再放大到桌面。不是把电脑版缩小。',
  'services.inc.i2t': '联系与咨询表单',
  'services.inc.i2d': '带蜜罐和频率限制，挡掉大部分垃圾提交。',
  'services.inc.i3t': '谷歌地图与营业时间',
  'services.inc.i3d': '门店位置、营业时间、一键拨号，放在客人找得到的地方。',
  'services.inc.i4t': '基础 SEO 结构',
  'services.inc.i4d': '标题、描述、结构化数据、sitemap。基础版不含关键词优化，专业版起包含。',
  'services.inc.i5t': 'HTTPS 与澳洲机房',
  'services.inc.i5d': '优先走悉尼节点，澳洲本地打开不用绕半个地球。',
  'services.inc.i6t': '一份操作说明',
  'services.inc.i6d': '上线当天给你，图文版，讲清楚怎么改文字、换图、看访问数据。',

  'services.not.eyebrow': '不做什么',
  'services.not.title': '这些不在本期范围',
  'services.not.lede': '写清楚边界，省得后面扯皮。',
  'services.not.i1': '在线收款与电商结账',
  'services.not.i2': '客户登录、会员系统、自助后台',
  'services.not.i3': '在线预约排期系统（可以接第三方，另计）',
  'services.not.i4': '多语言站群',
  'services.not.i5': '投放广告与长期内容运营',

  'services.ind.eyebrow': '覆盖行业',
  'services.ind.title': '我们最熟的五个行业',
  'services.ind.lede': '每个行业都有一套调过的模板，不是拿同一个版子换个颜色。',

  /* ---- Pricing page ---- */
  'pricing.hero.eyebrow': '报价',
  'pricing.hero.title': '三档套餐，价格写在明面上',
  'pricing.hero.sub': '所有价格以澳元计价，不含 GST。以下为参考起步价，正式报价在确认需求后书面给出。',
  'pricing.popular': '最受欢迎',
  'pricing.choose': '选这一档',
  'pricing.note': '不含 GST。域名与托管按年另计（约 AUD $40–120/年），也可以自己购买。',
  'pricing.plans.eyebrow': '套餐',
  'pricing.plans.title': '三档，同一套做法',
  'pricing.plans.lede': '流程完全一样。差别只在页数、商品数量和修改轮次。',
  'pricing.matrix.eyebrow': '逐项对比',
  'pricing.matrix.title': '三档到底差在哪',
  'pricing.matrix.lede': '横向滚动查看完整对比。',
  'pricing.matrix.feature': '功能项',
  'pricing.matrix.starter': '基础版',
  'pricing.matrix.pro': '专业版',
  'pricing.matrix.custom': '定制版',
  'pricing.matrix.note': '以上为 MVP 上线时的参考起步价。域名、托管与后期维护可单独报价。',
  'pricing.faq.title': '关于价格和流程',

  /* ---- Contact page ---- */
  'contact.hero.eyebrow': '联系我们',
  'contact.hero.title': '说说你的生意，我们给个具体价',
  'contact.hero.sub': '填完这张表，一个工作日内会有人联系你。如果只是想先问几句，右下角的 AI 助手随时在。',
  'contact.form.title': '需求提交',
  'contact.form.legend': '带 * 的是必填项',
  'contact.f.business': '店名',
  'contact.f.businessPh': '例如：Fern & File Nail Studio',
  'contact.f.industry': '所属行业',
  'contact.f.industryPh': '请选择',
  'contact.f.industryOther': '其他行业',
  'contact.f.name': '联系人',
  'contact.f.namePh': '怎么称呼你',
  'contact.f.email': '邮箱',
  'contact.f.emailPh': 'name@example.com',
  'contact.f.phone': '电话',
  'contact.f.phonePh': '04XX XXX XXX',
  'contact.f.phoneHint': '澳洲手机号或固定电话，可不填',
  'contact.f.site': '现有网站（如有）',
  'contact.f.sitePh': 'https://',
  'contact.f.brief': '项目简述',
  'contact.f.briefPh': '你的店做什么、开在哪、最想让客人看到什么。三五行就够。',
  'contact.f.briefHint': '最多 500 字',
  'contact.f.plan': '意向套餐',
  'contact.f.planAny': '还不确定',
  'contact.f.submit': '提交需求',
  'contact.f.submitting': '提交中…',
  'contact.f.privacy': '提交即表示你同意我们按<a href="privacy.html">隐私政策</a>处理这些信息。我们不会把资料转给第三方，也不会给你发营销邮件。',
  'contact.err.required': '这一项必填',
  'contact.err.email': '邮箱格式看起来不对',
  'contact.err.phone': '电话格式看起来不对',
  'contact.err.brief': '请控制在 500 字以内',
  'contact.err.rate': '刚提交过一次，请等一分钟再试。',
  'contact.err.network': '提交失败，请稍后重试，或直接发邮件给我们。',
  'contact.ok.title': '收到了',
  'contact.ok.body': '我们会在 1 个工作日内联系你。如果急，可以直接打 <a href="tel:+61280000000">+61 2 8000 0000</a>。',
  'contact.ok.demo': '预览模式——这条需求没有发出去。',
  'contact.ok.again': '再提交一份',
  'contact.aside.title': '直接联系',
  'contact.aside.hours': '周一至周五 9:00–17:00 AEST',
  'contact.aside.response': '1 个工作日内回复',
  'contact.aside.mapTitle': '服务范围',
  'contact.aside.mapBody': '远程交付，覆盖全澳。悉尼、墨尔本、布里斯班、珀斯、阿德莱德均有客户。',
  'contact.aside.chatTitle': '不想填表？',
  'contact.aside.chatBody': '右下角 AI 助手可以先答你几个问题，需要报价时再留联系方式。',
  'contact.aside.chatBtn': '打开 AI 助手',

  /* ---- Privacy page ---- */
  'privacy.title': '隐私政策',
  'privacy.updated': '最后更新：2026 年 10 月 30 日',

  /* ---- Chat ---- */
  'chat.launcher': '有问题？问 AI',
  'chat.title': 'AI 助手',
  'chat.status': '在线 · 通常秒回',
  'chat.close': '关闭对话',
  'chat.placeholder': '输入你的问题…',
  'chat.send': '发送',
  'chat.quick1': '做一个站多少钱？',
  'chat.quick2': '多久能交付？',
  'chat.quick3': '我需要准备什么？',
  'chat.quick4': '你们做我这个行业吗？',
  'chat.lead.title': '留个联系方式，我们发你一份具体报价',
  'chat.lead.submit': '提交',
  'chat.lead.business': '店名',
  'chat.lead.industry': '行业',
  'chat.lead.name': '联系人',
  'chat.lead.email': '邮箱',
  'chat.lead.phone': '电话',
  'chat.lead.brief': '一句话需求',
  'chat.lead.err': '店名、联系人和邮箱（或电话）需要填一下。',
  'chat.lead.ok': '收到了，我们会在 1 个工作日内联系你。',
  'chat.handoff': '这个问题我拿不准，不想给你错的答案。方便留个联系方式吗？我们一个工作日内让真人回你。',
  'chat.priceGuard': '具体报价要看你的页面数和功能。三档起步价是 AUD $499 / $999 / $1,999+，更准的数字要看过需求才能给——我不想在这里给你一个之后要改的数。',

  /* ---- Quote estimator ---- */
  'est.eyebrow': '估算',
  'est.title': '先自己估个价，再决定要不要聊',
  'est.lede': '四个问题，不用留邮箱。你会拿到一个价格区间和它对应的套餐——正式报价要看过需求才给。',
  'est.q1': '你的生意属于',
  'est.q2': '大概几个页面',
  'est.q3': '要展示多少产品',
  'est.q4': '还要加什么（可多选）',
  'est.p1': '1–5 页',
  'est.p2': '6–10 页',
  'est.p3': '11 页以上',
  'est.pr1': '不需要产品列表',
  'est.pr2': '10 个以内',
  'est.pr3': '50 个以内',
  'est.pr4': '不限',
  'est.e1': '在线预约组件',
  'est.e2': '博客或资讯',
  'est.e3': '第二语言',

  /* ---- Handover checklist ---- */
  'services.hand.eyebrow': '交付当天',
  'services.hand.title': '你实际拿到手的东西',
  'services.hand.lede': '不是承诺，是上线那天真会交到你手里的清单。',
  'services.hand.i1t': '域名，已解析上线',
  'services.hand.i1d': '注册在你名下，DNS 配好，强制 HTTPS。',
  'services.hand.i2t': '站点文件',
  'services.hand.i2d': '静态文件归你所有，不用把站租回去。',
  'services.hand.i3t': '一个后台账号',
  'services.hand.i3d': '改文字、换照片、调价格，不用找我们。',
  'services.hand.i4t': '一份书面操作手册',
  'services.hand.i4d': '你真正会做的那三件事，配截图。',
  'services.hand.i5t': '已接好的数据分析',
  'services.hand.i5d': 'GA4 或 Plausible 接通，该埋的事件都在跑。',
  'services.hand.i6t': 'Search Console 已配置',
  'services.hand.i6d': 'sitemap 已提交，收录已申请，站点已验证。',
  'services.hand.i7t': '能用的企业邮箱',
  'services.hand.i7d': 'hello@你的域名，配好、测过、该转发的地方都转发。',
  'services.hand.i8t': '一份速度报告',
  'services.hand.i8d': '手机和桌面的 Lighthouse 分数，随站一起交付。',

  /* ---- What each case deliberately left out ---- */
  'c1.left': '没有在线点单。厨房就是接电话下单，店主不想改。',
  'c2.left': '没有电商。产品在店里坐着卖，不从仓库发货。',
  'c3.left': '没有购物车。trade 客户直接打柜台电话，购物车只会是摆设。',
  'c4.left': '没有会员系统。俱乐部报名还是各俱乐部自己管。',
  'c5.left': '没有开球时间预订。那在球场自己的系统里，不在商店网站上。',

  /* ---- Case study pages ---- */
  'cases.quick': '快速预览',
  'caseDetail.back': '全部案例',
  'caseDetail.brief': '需求',
  'caseDetail.built': '我们做了什么',
  'caseDetail.leftOut': '故意没做',
  'caseDetail.facts': '项目信息',
  'caseDetail.fIndustry': '行业',
  'caseDetail.fPackage': '套餐',
  'caseDetail.fPages': '页面数',
  'caseDetail.fTime': '交付周期',
  'caseDetail.cta': '做一个类似的站',
  'caseDetail.prev': '上一个',
  'caseDetail.next': '下一个',
  'caseDetail.more': '更多案例',

  'case.c1.summary': '悉尼 Neutral Bay 一家 32 座的餐厅，受够了在电话里反复回答同样三个问题。',
  'case.c1.brief1': 'Bistro Nord 有一份 2019 年的 PDF 菜单在网上流传，一个没人更新的 Facebook 主页，还有一部在出餐时响个不停的电话。店主希望客人进门之前就能自己搞清楚三件事：今晚吃什么、几点开门、能不能订到位子。',
  'case.c1.brief2': '他们已经在用 OpenTable，而且用得挺好。网站的任务是站在它前面，而不是替换它。',
  'case.c1.b1t': '今晚的菜单，放在首页',
  'case.c1.b1d': '厨师每天早上改一个纯文本文件就行。全程没有 PDF。',
  'case.c1.b2t': '订位，交给原来的系统',
  'case.c1.b2d': 'OpenTable 组件在面板里打开。能用的东西我们没有重做。',
  'case.c1.b3t': '营业时间，写两遍',
  'case.c1.b3d': '页头一次，地图旁一次——因为这才是客人真正要问的。',
  'case.c1.b4t': '一页，五个锚点',
  'case.c1.b4d': '没人会去读餐厅的「关于我们」。所以我们没做。',
  'case.c1.caption': '首页：今晚的菜单、营业时间、订位入口，全在首屏。',
  'case.c1.pkg': '专业版',
  'case.c1.days': '7 个工作日',

  'case.c2.summary': '一家四张椅子的工作室，说实话，价目表就是它的整个网站。',
  'case.c2.brief1': 'Fern & File 的客人来之前就想好了要什么——工作室的 Instagram 已经替她们做完了说服。她们找不到的是价格，而店主停不下来的，是在私信里一个个报价格。',
  'case.c2.brief2': '所以价目表放到了首屏，预约按钮就放在旁边。',
  'case.c2.b1t': '价格放最前面',
  'case.c2.b1d': '三项服务，三个价格。没有「详询客服」。',
  'case.c2.b2t': 'Fresha 直接嵌入',
  'case.c2.b2d': '她们本来就在用的预约系统，离价格一次点击。',
  'case.c2.b3t': 'Afterpay，只解释一次',
  'case.c2.b3d': '单独一页，首页保持干净。',
  'case.c2.b4t': 'Instagram 用链接，不嵌时间线',
  'case.c2.b4d': '时间线加载慢，而且没人会在网站上刷它。',
  'case.c2.caption': '价格在首屏，预约就在旁边。',
  'case.c2.pkg': '基础版',
  'case.c2.days': '5 个工作日',

  'case.c3.summary': '一万两千个 SKU 的柜台生意，压根没打算变成网店。',
  'case.c3.brief1': 'Rivet & Co. 卖给那些直接打柜台电话的师傅，他们也希望保持这样。他们缺的是：新客户在开车去 Virginia 之前，没法确认这里到底有没有那个型号的紧固件。',
  'case.c3.brief2': '需求是一个能搜的目录、一个门店定位，还有一个能落到正确收件箱的 trade 开户表单。没有任何能下单的东西。',
  'case.c3.b1t': '可搜索的目录',
  'case.c3.b1d': '一万两千个条目，按工种和品牌筛选。',
  'case.c3.b2t': 'Trade 开户表单',
  'case.c3.b2d': '店名、ABN、两个推荐人。直接进财务邮箱。',
  'case.c3.b3t': '门店定位与营业时间',
  'case.c3.b3d': '按天列，包括 trade 柜台早上 6 点开门。',
  'case.c3.b4t': '全站没有购物车',
  'case.c3.b4d': '下单就是打电话。我们没有假装不是。',
  'case.c3.caption': '目录就是产品，柜台就是收银台。',
  'case.c3.pkg': '定制版',
  'case.c3.days': '12 个工作日',

  'case.c4.summary': '一家海边体育用品店，真正的差异点是免费足型测量。',
  'case.c4.brief1': 'Coastline 跟大型连锁卖一样的牌子，价格还更差。连锁店没有的，是有人真的看你跑一段，然后告诉你脚上这双不对。',
  'case.c4.brief2': '所以足型测量成了首页的主 CTA，配上自己的预约表单和周六档期。',
  'case.c4.b1t': '五个品类页',
  'case.c4.b1d': '跑步、橄榄球、游泳、健身、板球。一页一个，不是一个筛选器。',
  'case.c4.b2t': '足型测量预约',
  'case.c4.b2d': '带时间段的表单，周六限六个。',
  'case.c4.b3t': '线上下单到店取',
  'case.c4.b3d': '网上订，当天柜台拿。',
  'case.c4.b4t': '俱乐部公告',
  'case.c4.b4d': '一个普通列表，本地俱乐部找我们更新。',
  'case.c4.caption': '足型测量是卖点，所以按钮给它。',
  'case.c4.pkg': '专业版',
  'case.c4.days': '7 个工作日',

  'case.c5.summary': '一家高端球具店，需要的是克制，不是功能。',
  'case.c5.brief1': 'Fairway 只进四个牌子，不是十四个，而且会告诉你手上那支一号木其实还挺好。这份诚实就是生意本身——一个花哨的网站反而会把它毁掉。',
  'case.c5.brief2': '所以这个站刻意做得很安静：大量留白、把定制服务放最前面、二手区用店主自己就能维护的方式。',
  'case.c5.b1t': '定制放最前面',
  'case.c5.b1d': '60 分钟 TrackMan 课时，首页可约。',
  'case.c5.b2t': '二手区就是一张表',
  'case.c5.b2d': '普通 HTML 表格，店主自己改。没有要学的库存系统。',
  'case.c5.b3t': '四个品牌',
  'case.c5.b3d': '正经列出来，不是一墙 logo。',
  'case.c5.b4t': '会员页',
  'case.c5.b4d': '权益、营业时间、怎么加入。',
  'case.c5.caption': '克制本身就是设计决定。',
  'case.c5.pkg': '定制版',
  'case.c5.days': '10 个工作日',

  /* ---- Case studies ---- */
  'c1.tag': '餐厅与咖啡馆',
  'c1.name': 'Bistro Nord',
  'c1.desc': '菜单、订位、营业时间，一屏讲完。',
  'c1.long': '单页餐厅站，把当日菜单直接放在首页——PDF 菜单是客人第一个放弃的东西。订位沿用店主原有的 OpenTable 组件，能用的东西我们没重做。',
  'c1.s1': '5 页', 'c1.s2': '菜单 + 订位', 'c1.s3': '谷歌地图', 'c1.s4': '联系表单',

  'c2.tag': '美甲美业',
  'c2.name': 'Fern & File',
  'c2.desc': '服务价目、在线预约、Afterpay 说明。',
  'c2.long': '价目表放在首屏——客人就是为这个来的。预约用 Fresha 组件嵌入。Afterpay 和礼品卡单独一页，首页保持干净。',
  'c2.s1': '4 页', 'c2.s2': '服务价目', 'c2.s3': 'Fresha 预约', 'c2.s4': 'Instagram 同步',

  'c3.tag': '五金工具',
  'c3.name': 'Rivet & Co.',
  'c3.desc': '产品目录、库存查询、trade 账户开通。',
  'c3.long': '围绕柜台生意做，不是购物车。一万两千个 SKU 可搜，但下单还是打电话——这家店本来就是这么卖的。Trade 账户申请表直接进他们邮箱。',
  'c3.s1': '8 页', 'c3.s2': '目录搜索', 'c3.s3': 'Trade 账户表单', 'c3.s4': '门店定位',

  'c4.tag': '体育用品',
  'c4.name': 'Coastline Sports',
  'c4.desc': '品类导航、免费足型测量预约、门店信息。',
  'c4.long': '五个品类，一页一个。重点是免费足型测量——这是他们跟大型连锁的区别，所以单独做了预约表单，还留了周六档期。',
  'c4.s1': '6 页', 'c4.s2': '品类分页', 'c4.s3': '足型测量预约', 'c4.s4': '线上下单到店取',

  'c5.tag': '高尔夫用品',
  'c5.name': 'Fairway Golf',
  'c5.desc': '球杆定制、二手寄卖、会员权益。',
  'c5.long': '高端店需要克制：四个品牌、留白、把定制服务放最前面。二手区就是一张普通表格，店主自己更新。',
  'c5.s1': '7 页', 'c5.s2': '定制预约', 'c5.s3': '二手列表', 'c5.s4': '会员页',

  /* ---- Plans ---- */
  'p.starter.name': '基础版',
  'p.starter.for': '个体户 / 单店',
  'p.starter.f1': '最多 5 页',
  'p.starter.f2': '手机 / 电脑自适应',
  'p.starter.f3': '联系表单',
  'p.starter.f4': '谷歌地图与营业时间',
  'p.starter.f5': '最多 10 个商品',
  'p.starter.f6': '1 轮修改',
  'p.starter.f7': '5 个工作日交付',

  'p.pro.name': '专业版',
  'p.pro.for': '本地小商家',
  'p.pro.f1': '最多 10 页',
  'p.pro.f2': '3 轮修改',
  'p.pro.f3': '基础 SEO 设置',
  'p.pro.f4': '最多 50 个商品',
  'p.pro.f5': '社交媒体链接',
  'p.pro.f6': '含基础版全部内容',
  'p.pro.f7': '7 个工作日交付',

  'p.custom.name': '定制版',
  'p.custom.for': '多产品 / 多页面店铺',
  'p.custom.f1': '不限页数',
  'p.custom.f2': '专属设计师对接',
  'p.custom.f3': '不限商品数 + 分类',
  'p.custom.f4': '不限修改（范围内）',
  'p.custom.f5': '高级 SEO + 本地 SEO',
  'p.custom.f6': '10–14 个工作日',

  /* ---- Pricing matrix ---- */
  'm.r1': '目标客户',
  'm.r1.s': '个体户 / 单店', 'm.r1.p': '本地小商家', 'm.r1.c': '多产品 / 多页面店铺',
  'm.r2': '页面数量',
  'm.r2.s': '最多 5 页', 'm.r2.p': '最多 10 页', 'm.r2.c': '不限页数',
  'm.r3': 'AI 自动首稿',
  'm.r3.s': '包含', 'm.r3.p': '包含', 'm.r3.c': '包含 + 专属设计师',
  'm.r4': '手机 / 电脑自适应',
  'm.r5': '联系 / 咨询表单',
  'm.r6': '谷歌地图嵌入',
  'm.r7': '产品 / 图册展示',
  'm.r7.s': '最多 10 个商品', 'm.r7.p': '最多 50 个商品', 'm.r7.c': '不限 + 商品分类',
  'm.r8': '社交媒体链接',
  'm.r9': '修改次数',
  'm.r9.s': '1 轮', 'm.r9.p': '3 轮', 'm.r9.c': '不限（范围内）',
  'm.r10': '基础 SEO',
  'm.r10.s': '不含', 'm.r10.p': '包含', 'm.r10.c': '包含 + 本地 SEO',
  'm.r11': '交付周期',
  'm.r11.s': '5 个工作日', 'm.r11.p': '7 个工作日', 'm.r11.c': '10–14 个工作日',
  'm.r12': '参考起步价（AUD）',
  'm.r12.s': '$499', 'm.r12.p': '$999', 'm.r12.c': '$1,999 起',
  'm.yes': '包含',
  'm.no': '不含',

  /* ---- Pricing FAQ extras ---- */
  'pricing.faq.q5': '可以先付一半吗？',
  'pricing.faq.a5': '可以。签约付 50% 定金，交付时付尾款。澳元开票，支持银行转账。这个网站本身不做在线收款。',
  'pricing.faq.q6': '价格含 GST 吗？',
  'pricing.faq.a6': '不含。页面上的都是不含 GST 的参考起步价，正式报价单会单独列税。',
  'pricing.faq.q7': '域名和托管要另外付吗？',
  'pricing.faq.a7': '要。域名加托管大约 AUD $40–120 一年，取决于你选什么。也可以自己买，我们帮你配好。',

  /* ---- Services extras ---- */
  'services.ind.i1': '菜单、订位、营业时间放在最前面',
  'services.ind.i2': '价目表、在线预约、Afterpay',
  'services.ind.i3': '产品目录、库存、trade 账户',
  'services.ind.i4': '品类分页、到店取货、活动通知',
  'services.ind.i5': '定制预约、二手寄卖、会员'
};

/* ---------- Engine ---------- */
(function () {
  const STORE_KEY = 'ab.lang';
  const ATTR_MAP = {
    'data-i18n-ph': 'placeholder',
    'data-i18n-aria': 'aria-label',
    'data-i18n-title': 'title'
  };

  const original = new WeakMap();
  let current = 'en';

  function nodes() {
    return document.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-ph], [data-i18n-aria], [data-i18n-title]');
  }

  function cache() {
    nodes().forEach(function (el) {
      if (original.has(el)) return;
      const snap = {};
      if (el.hasAttribute('data-i18n') || el.hasAttribute('data-i18n-html')) {
        snap.html = el.innerHTML;
      }
      Object.keys(ATTR_MAP).forEach(function (attr) {
        if (el.hasAttribute(attr)) {
          const name = ATTR_MAP[attr];
          snap['@' + name] = el.getAttribute(name) || '';
        }
      });
      original.set(el, snap);
    });
  }

  function interpolate(str, vars) {
    if (!vars) return str;
    return str.replace(/\{(\w+)\}/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(vars, k) ? vars[k] : m;
    });
  }

  function apply(lang, vars) {
    current = lang === 'zh' ? 'zh' : 'en';
    cache();

    nodes().forEach(function (el) {
      const snap = original.get(el) || {};
      const isHtml = el.hasAttribute('data-i18n-html');
      const keyEl = el.hasAttribute('data-i18n') ? el : el.hasAttribute('data-i18n-html') ? el : null;

      if (keyEl) {
        const key = keyEl.getAttribute(isHtml ? 'data-i18n-html' : 'data-i18n');
        const val = current === 'zh' ? ZH[key] : null;
        if (current === 'zh' && typeof val === 'string') {
          if (isHtml) el.innerHTML = interpolate(val, vars);
          else el.textContent = interpolate(val, vars);
        } else if (snap.html !== undefined) {
          el.innerHTML = snap.html;
        }
      }

      Object.keys(ATTR_MAP).forEach(function (attr) {
        if (!el.hasAttribute(attr)) return;
        const name = ATTR_MAP[attr];
        const key = el.getAttribute(attr);
        const val = current === 'zh' ? ZH[key] : null;
        el.setAttribute(name, interpolate(typeof val === 'string' ? val : (snap['@' + name] || ''), vars));
      });
    });

    document.documentElement.lang = current === 'zh' ? 'zh-CN' : 'en-AU';
    document.documentElement.setAttribute('data-lang', current);

    const btn = document.getElementById('langToggle');
    if (btn) {
      btn.textContent = current === 'zh' ? 'EN' : '中文';
      btn.setAttribute('aria-label', current === 'zh' ? 'Switch to English' : '切换到中文');
    }

    try { localStorage.setItem(STORE_KEY, current); } catch (e) { /* private mode */ }

    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: current } }));
  }

  function t(key, vars) {
    if (current === 'zh' && typeof ZH[key] === 'string') return interpolate(ZH[key], vars);
    return null;
  }

  window.I18N = {
    apply: apply,
    t: t,
    get lang() { return current; },
    isZh: function () { return current === 'zh'; },
    /**
     * Resolve a UI string: prefer the explicit Chinese dictionary,
     * otherwise fall back to the English string passed in.
     */
    pick: function (en, zh) { return current === 'zh' && zh ? zh : en; }
  };

  function boot() {
    let saved = 'en';
    try { saved = localStorage.getItem(STORE_KEY) || 'en'; } catch (e) { /* noop */ }
    cache();
    if (saved === 'zh') apply('zh');

    const btn = document.getElementById('langToggle');
    if (btn) {
      btn.addEventListener('click', function () {
        apply(current === 'zh' ? 'en' : 'zh');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
