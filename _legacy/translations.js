// Translation data
const translations = {
    en: {
        nav: {
            home: "Home",
            cases: "Cases",
            pricing: "Pricing"
        },
        hero: {
            title: "Professional Websites for Australian Small Businesses",
            subtitle: "AI-powered website creation in days, not weeks. Perfect for cafes, nail salons, retail stores, and sports shops.",
            cta: "Get Free Quote",
            viewCases: "View Cases"
        },
        values: {
            ai: {
                title: "AI Generated",
                desc: "Fill a simple form, AI drafts your entire website"
            },
            fast: {
                title: "Fast Delivery",
                desc: "First draft within 3 business days"
            },
            mobile: {
                title: "Mobile First",
                desc: "80% of customers find you on mobile"
            },
            local: {
                title: "Local Optimized",
                desc: "Designed for Australian business needs"
            }
        },
        cases: {
            title: "Customer Showcases",
            subtitle: "Real websites built for Australian businesses"
        },
        pricing: {
            title: "Transparent Pricing",
            subtitle: "No hidden fees, clear packages",
            starter: {
                name: "Starter",
                feature1: "✓ Up to 5 pages",
                feature2: "✓ Mobile responsive",
                feature3: "✓ Contact form",
                feature4: "✓ Google Maps",
                feature5: "✓ 5 business days delivery"
            },
            pro: {
                name: "Professional",
                badge: "Most Popular",
                feature1: "✓ Up to 10 pages",
                feature2: "✓ 3 rounds of revisions",
                feature3: "✓ Basic SEO setup",
                feature4: "✓ Product gallery (50 items)",
                feature5: "✓ 7 business days delivery"
            },
            custom: {
                name: "Custom",
                feature1: "✓ Unlimited pages",
                feature2: "✓ Unlimited revisions",
                feature3: "✓ Advanced SEO",
                feature4: "✓ Dedicated designer",
                feature5: "✓ 10-14 days delivery"
            }
        },
        footer: {
            rights: "All rights reserved."
        },
        chat: {
            title: "AI Assistant",
            welcome: "Hi! I'm here to help. What can I do for you?",
            quick1: "Pricing info",
            quick2: "How long does it take?",
            quick3: "Do I need technical skills?",
            inputPlaceholder: "Type your message..."
        }
    },
    zh: {
        nav: {
            home: "首页",
            cases: "案例",
            pricing: "报价"
        },
        hero: {
            title: "为澳洲中小企业打造专业官网",
            subtitle: "AI 智能生成，几天交付。专为咖啡馆、美甲店、零售店、体育用品店定制。",
            cta: "获取免费报价",
            viewCases: "查看案例"
        },
        values: {
            ai: {
                title: "AI 自动生成",
                desc: "只需填写简单问卷，AI 自动起草整站"
            },
            fast: {
                title: "极速交付",
                desc: "首稿 3 个工作日内交付"
            },
            mobile: {
                title: "移动优先",
                desc: "80% 的客户通过手机找到您"
            },
            local: {
                title: "本地优化",
                desc: "专为澳洲商业需求设计"
            }
        },
        cases: {
            title: "客户案例展示",
            subtitle: "为澳洲企业打造的真实网站"
        },
        pricing: {
            title: "透明报价",
            subtitle: "无隐形消费，清晰套餐",
            starter: {
                name: "基础版",
                feature1: "✓ 最多 5 页",
                feature2: "✓ 手机/电脑自适应",
                feature3: "✓ 联系表单",
                feature4: "✓ 谷歌地图嵌入",
                feature5: "✓ 5 个工作日交付"
            },
            pro: {
                name: "专业版",
                badge: "最受欢迎",
                feature1: "✓ 最多 10 页",
                feature2: "✓ 3 轮修改",
                feature3: "✓ 基础 SEO 设置",
                feature4: "✓ 产品展示（50 个商品）",
                feature5: "✓ 7 个工作日交付"
            },
            custom: {
                name: "定制版",
                feature1: "✓ 不限页数",
                feature2: "✓ 不限修改次数",
                feature3: "✓ 高级 SEO",
                feature4: "✓ 专属设计师",
                feature5: "✓ 10-14 天交付"
            }
        },
        footer: {
            rights: "版权所有。"
        },
        chat: {
            title: "AI 助手",
            welcome: "您好！我是 AI 助手，有什么可以帮您的吗？",
            quick1: "了解报价",
            quick2: "需要多久完成？",
            quick3: "我需要懂技术吗？",
            inputPlaceholder: "输入您的问题..."
        }
    }
};

// Case studies data
const caseStudies = {
    en: [
        {
            industry: "Restaurant — Sydney NSW",
            title: "Italian Bistro",
            description: "Modern restaurant website with online menu and booking integration",
            emoji: "🍝"
        },
        {
            industry: "Nail Salon — Melbourne VIC",
            title: "Luxury Nails & Spa",
            description: "Elegant salon website with service gallery and appointment system",
            emoji: "💅"
        },
        {
            industry: "Hardware Store — Brisbane QLD",
            title: "Tool Master",
            description: "Product catalog website for local hardware retail shop",
            emoji: "🔧"
        },
        {
            industry: "Sports Shop — Perth WA",
            title: "Active Gear",
            description: "Dynamic sports equipment store with product showcase",
            emoji: "⚽"
        },
        {
            industry: "Golf Shop — Adelaide SA",
            title: "Pro Golf Australia",
            description: "Premium golf equipment retailer with membership portal",
            emoji: "⛳"
        }
    ],
    zh: [
        {
            industry: "餐厅 — 悉尼新南威尔士州",
            title: "意大利餐厅",
            description: "现代餐厅网站，含在线菜单和预订功能",
            emoji: "🍝"
        },
        {
            industry: "美甲沙龙 — 墨尔本维多利亚州",
            title: "奢华美甲美容",
            description: "优雅沙龙网站，含服务展示和预约系统",
            emoji: "💅"
        },
        {
            industry: "五金工具店 — 布里斯班昆士兰州",
            title: "工具大师",
            description: "本地五金零售店产品目录网站",
            emoji: "🔧"
        },
        {
            industry: "体育用品店 — 珀斯西澳大利亚州",
            title: "运动装备",
            description: "动态体育用品商店，含产品展示",
            emoji: "⚽"
        },
        {
            industry: "高尔夫用品店 — 阿德莱德南澳大利亚州",
            title: "澳洲职业高尔夫",
            description: "高端高尔夫装备零售商，含会员门户",
            emoji: "⛳"
        }
    ]
};
