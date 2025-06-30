/*
powerfullz 的 Substore 订阅转换脚本
https://github.com/powerfullz/override-rules
传入参数：
- loadbalance: 启用负载均衡 (默认false)
- landing: 启用落地节点功能 (默认false)
- ipv6: 启用 IPv6 支持 (默认false)
- full: 启用完整配置，用于纯内核启动 (默认false)
*/

const inArg = $arguments; // console.log(inArg)
const loadBalance = parseBool(inArg.loadbalance) || false,
    landing = parseBool(inArg.landing) || false,
    ipv6Enabled = parseBool(inArg.ipv6) || false,
    fullConfig = parseBool(inArg.full) || false;

// 生成默认代理组
const defaultProxies = [
    "节点选择", "自动选择", "手动切换", "全球直连"
];

const defaultProxiesDirect = [
    "全球直连", "节点选择", "手动切换"
]

const defaultSelector = [
    "自动选择", "手动切换", "DIRECT"
];

const globalProxies = [
    "节点选择", "手动切换", "自动选择", "人工智能", "加密货币", "Telegram", "Apple", "Google", "YouTube", "Netflix", "Disney", "HBO Max", "Spotify", "TikTok",
    "E-Hentai", "PikPak", "巴哈姆特", "哔哩哔哩", "新浪微博", "Twitter(X)", "Truth Social", "学术资源", "瑟琴网站", "游戏平台", "微软服务", "Speedtest", "静态资源",
    "FCM推送", "Steam修复", "Play商店修复", "搜狗输入", "全球直连", "广告拦截"
];

const ruleProviders = {
    "ADBlock": {
        "type": "http", "behavior": "domain", "format": "text", "interval": 86400,
        "url": "https://adrules.top/adrules_domainset.txt",
        "path": "./ruleset/ADBlock.txt"
    },
    "Microsoft": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://ruleset.skk.moe/Clash/non_ip/microsoft.txt",
        "path": "./sukkaw_ruleset/microsoft_non_ip.txt"
    },
    "TruthSocial": {
        "url": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/TruthSocial.list",
        "path": "./ruleset/TruthSocial.list",
        "behavior": "classical", "interval": 86400, "format": "text", "type": "http"
    },
    "sogouinput": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://ruleset.skk.moe/Clash/non_ip/sogouinput.txt",
        "path": "./sukkaw_ruleset/sogouinput.txt"
    },
    "cdn_domainset": {
        "type": "http", "behavior": "domain", "format": "text", "interval": 86400,
        "url": "https://ruleset.skk.moe/Clash/domainset/cdn.txt",
        "path": "./sukkaw_ruleset/cdn_domainset.txt"
    },
    "cdn_non_ip": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://ruleset.skk.moe/Clash/non_ip/cdn.txt",
        "path": "./sukkaw_ruleset/cdn_non_ip.txt"
    },
    "microsoft_cdn_non_ip": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://ruleset.skk.moe/Clash/non_ip/microsoft_cdn.txt",
        "path": "./sukkaw_ruleset/microsoft_cdn_non_ip.txt"
    },
    "ai_non_ip": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://ruleset.skk.moe/Clash/non_ip/ai.txt",
        "path": "./sukkaw_ruleset/ai_non_ip.txt"
    },
    "TikTok": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/TikTok.list",
        "path": "./ruleset/TikTok.list"
    },
    "EHentai": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/EHentai.list",
        "path": "./ruleset/EHentai.list"
    },
    "PlayStoreFix": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/GooglePlayStoreFix.list",
        "path": "./ruleset/GooglePlayStoreFix.list"
    },
    "SteamFix": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/SteamFix.list"
    },
    "GoogleFCM": {
        "type": "http", "behavior": "classical", "interval": 86400, "format": "text",
        "path": "./ruleset/FirebaseCloudMessaging.list",
        "url": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/FirebaseCloudMessaging.list"
    },
    "AdditionalFilter": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "path": "./ruleset/AdditionalFilter.list",
        "url": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/AdditionalFilter.list"
    },
    "Weibo": {
        "type": "http", "behavior": "classical", "format": "text", "interval": 86400,
        "url": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/Weibo.list",
        "path": "./ruleset/Weibo.list"
    }
}

const rules = [
    "RULE-SET,ADBlock,广告拦截",
    "RULE-SET,AdditionalFilter,广告拦截",
    "RULE-SET,sogouinput,搜狗输入",
    "RULE-SET,TruthSocial,Truth Social",
    "RULE-SET,cdn_domainset,静态资源",
    "RULE-SET,cdn_non_ip,静态资源",
    "RULE-SET,microsoft_cdn_non_ip,全球直连",
    "RULE-SET,ai_non_ip,人工智能",
    "RULE-SET,Microsoft,微软服务",
    "RULE-SET,EHentai,E-Hentai",
    "RULE-SET,TikTok,TikTok",
    "RULE-SET,SteamFix,Steam修复",
    "RULE-SET,PlayStoreFix,Play商店修复",
    "RULE-SET,GoogleFCM,FCM推送",
    "RULE-SET,Weibo,新浪微博",
    "GEOSITE,GOOGLE-PLAY@CN,全球直连",
    "GEOSITE,APPLE@CN,全球直连",
    "GEOSITE,APPLE,Apple",
    "GEOSITE,YOUTUBE@CN,全球直连",
    "GEOSITE,YOUTUBE,YouTube",
    "GEOSITE,GOOGLE,Google",
    "GEOSITE,NETFLIX,Netflix",
    "GEOSITE,SPOTIFY,Spotify",
    "GEOSITE,TWITTER,Twitter(X)",
    "GEOSITE,DISNEY,Disney",
    "GEOSITE,HBO,HBO Max",
    "GEOSITE,BAHAMUT,巴哈姆特",
    "GEOSITE,BILIBILI,哔哩哔哩",
    "GEOSITE,OOKLA-SPEEDTEST,Speedtest",
    "GEOSITE,CATEGORY-PORN,瑟琴网站",
    "GEOSITE,CATEGORY-GAMES@CN,全球直连",
    "GEOSITE,CATEGORY-GAMES,游戏平台",
    "GEOSITE,CATEGORY-SCHOLAR-!CN,学术资源",
    "GEOSITE,CATEGORY-SCHOLAR-CN,全球直连",
    "GEOSITE,CATEGORY-CRYPTOCURRENCY,加密货币",
    "GEOSITE,TELEGRAM,Telegram",
    "GEOSITE,PIKPAK,PikPak",
    "GEOSITE,CN,全球直连",
    "GEOSITE,PRIVATE,全球直连",
    "GEOIP,NETFLIX,Netflix,no-resolve",
    "GEOIP,GOOGLE,Google,no-resolve",
    "GEOIP,TELEGRAM,Telegram,no-resolve",
    "GEOIP,CN,全球直连,no-resolve",
    "GEOIP,LAN,全球直连,no-resolve",
    "GEOIP,PRIVATE,全球直连,no-resolve",
    "MATCH,节点选择"
];

const snifferConfig = {
    "sniff": {
        "TLS": {
            "ports": [443, 8443],
            "override-destination": true
        },
        "HTTP": {
            "ports": [80, 8080, 8880],
            "override-destination": false
        },
        "QUIC": {
            "ports": [443, 8443],
            "override-destination": true
        }
    },
    "enable": true,
    "parse-pure-ip": true,
    "force-dns-mapping": true,
    "skip-domain": [
        "Mijia Cloud",
        "dlg.io.mi.com",
        "+.push.apple.com"
    ]
};

const dnsConfig = {
    "enable": true,
    "ipv6": ipv6Enabled,
    "prefer-h3": true,
    "enhanced-mode": "redir-host",
    "default-nameserver": [
        "119.29.29.29",
        "223.5.5.5",
    ],
    "nameserver": [
        "system",
        "quic://223.5.5.5",
        "tls://dot.pub",
        "tls://dns.alidns.com",
    ],
    "fallback": [
        "https://dns.cloudflare.com/dns-query",
        "https://dns.sb/dns-query",
        "tcp://208.67.222.222",
        "tcp://8.26.56.2"
    ],
    "proxy-server-nameserver": [
        "quic://223.5.5.5",
        "tls://dot.pub",
    ]
};

const geoxURL = {
    "geoip": "https://fastly.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/geoip.dat",
    "geosite": "https://fastly.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/geosite.dat",
    "mmdb": "https://fastly.jsdelivr.net/gh/Loyalsoldier/geoip@release/Country.mmdb",
    "asn": "https://fastly.jsdelivr.net/gh/Loyalsoldier/geoip@release/GeoLite2-ASN.mmdb"
};

const countryRegex = {
    "香港": "(?i)香港|港|HK|hk|Hong Kong|HongKong|hongkong",
    "澳门": "(?i)澳门|MO|Macau",
    "台湾": "(?i)台|新北|彰化|TW|Taiwan",
    "新加坡": "(?i)新加坡|坡|狮城|SG|Singapore",
    "日本": "(?i)日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan",
    "韩国": "(?i)KR|Korea|KOR|首尔|韩|韓",
    "美国": "(?i)美国|美|US|United States",
    "加拿大": "(?i)加拿大|Canada|CA",
    "英国": "(?i)英国|UK|伦敦|London",
    "澳大利亚": "(?i)澳洲|澳大利亚|AU|Australia",
    "德国": "(?i)德国|德|DE|Germany",
    "法国": "(?i)法国|法|FR|France",
    "俄罗斯": "(?i)俄罗斯|俄|RU|Russia",
    "泰国": "(?i)泰国|泰|TH|Thailand",
    "印度": "(?i)印度|IN|India",
    "马来西亚": "(?i)马来西亚|马来|MY|Malaysia",
}

function parseBool(value) {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
        return value.toLowerCase() === "true" || value === "1";
    }
    return false;
}

function parseCountries(config) {
    const proxies = config["proxies"];
    const result = [];
    const seen = new Set(); // 用于去重

    for (const [country, pattern] of Object.entries(countryRegex)) {
        // 创建正则表达式（去掉 (?i) 前缀并添加 'i' 标志）
        const regex = new RegExp(
            pattern.replace(/^\(\?i\)/, ''),
            'i'
        );

        for (const proxy of proxies) {
            const name = proxy.name;
            if (regex.test(name)) {
                // 防止重复添加国家名称
                if (!seen.has(country)) {
                    seen.add(country);
                    result.unshift(country);
                }
            }
        }
    }
    return result;
}

function buildCountryProxyGroups(countryList) {
    const countryIconURLs = {
        "香港": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png",
        "台湾": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png",
        "新加坡": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png",
        "日本": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png",
        "韩国": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Korea.png",
        "美国": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png",
        "英国": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_Kingdom.png",
        "加拿大": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Canada.png",
        "澳大利亚": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Australia.png",
        "德国": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Germany.png",
        "俄罗斯": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Russia.png",
        "泰国": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Thailand.png",
        "印度": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/India.png",
        "马来西亚": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Malaysia.png",
        "澳门": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Macao.png",
        "法国": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/France.png",
    };
    // 获取实际存在的国家列表

    const countryProxyGroups = [];

    // 为实际存在的国家创建节点组
    for (const country of countryList) {
        // 确保国家名称在预设的国家配置中存在
        if (countryRegex[country]) {
            const groupName = `${country}节点`;
            const pattern = countryRegex[country];

            const groupConfig = {
                "name": groupName,
                "icon": countryIconURLs[country],
                "include-all": true,
                "filter": pattern,
                "exclude-filter": "(?i)家宽|家庭|商宽|落地",
                "type": (loadBalance) ? "load-balance" : "url-test",
            };

            if (!loadBalance) {
                Object.assign(groupConfig, {
                    "interval": 300,
                    "tolerance": 20,
                    "lazy": false
                });
            }

            countryProxyGroups.push(groupConfig);
        }
    }

    return countryProxyGroups;
}

function buildProxyGroups(countryList, countryProxyGroups) {
    // 查看是否有特定国家的节点
    const hasTW = countryList.includes("台湾");
    const hasHK = countryList.includes("香港");
    const hasUS = countryList.includes("美国");
    return [
        {
            "name": "节点选择",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png",
            "type": "select",
            "proxies": defaultSelector
        },
        (landing) ? {
            "name": "落地节点",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Airport.png",
            "type": "select",
            "include-all": true,
            "filter": "(?i)家宽|家庭|商宽|落地",
        } : null,
        (landing) ? {
            "name": "前置代理",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png",
            "type": "select",
            "include-all": true,
            "exclude-filter": "(?i)家宽|家庭|商宽|落地",
            "proxies": defaultSelector
        } : null,
        {
            "name": "手动切换",
            "icon": "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/select.png",
            "include-all": true,
            "type": "select"
        },
        {
            "name": "自动选择",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Auto.png",
            "type": "url-test",
            "include-all": true,
            "exclude-filter": "(?i)家宽|家庭|商宽|落地",
            "interval": 300,
            "tolerance": 20,
            "lazy": false
        },
        {
            "name": "人工智能",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Bot.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "加密货币",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Cryptocurrency_3.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "Telegram",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "Apple",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Apple_2.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "Google",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Google_Search.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "YouTube",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "Netflix",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Netflix.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "Disney",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Disney.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "HBO Max",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/HBO.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "Spotify",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Spotify.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "TikTok",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/TikTok.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "E-Hentai",
            "icon": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/icons/Ehentai.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "PikPak",
            "icon": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/icons/PikPak.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "巴哈姆特",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Bahamut.png",
            "type": "select",
            "proxies": (hasTW) ? ["台湾节点", "节点选择", "手动切换", "全球直连"] : defaultProxies
        },
        {
            "name": "哔哩哔哩",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/bilibili.png",
            "type": "select",
            "proxies": (hasTW && hasHK) ? ["全球直连", "台湾节点", "香港节点"] : defaultProxies
        },
        {
            "name": "Twitter(X)",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Twitter.png",
            "type": "select",
            "proxies": defaultProxies
        },
        {
            "name": "新浪微博",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Weibo.png",
            "type": "select",
            "include-all": true,
            "proxies": defaultProxiesDirect
        },
        {
            "name": "Truth Social",
            "icon": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/icons/TruthSocial.png",
            "type": "select",
            "proxies": (hasUS) ? ["美国节点", "节点选择", "手动切换"] : defaultProxies
        },
        {
            "name": "学术资源",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Scholar.png",
            "type": "select",
            "proxies": [
                "节点选择", "手动切换", "全球直连"
            ]
        },
        {
            "name": "瑟琴网站",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Pornhub.png",
            "type": "select",
            "proxies": defaultProxies,
        },
        {
            "name": "游戏平台",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Game.png",
            "type": "select",
            "proxies": defaultProxies,
        },
        {
            "name": "微软服务",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Microsoft.png",
            "type": "select",
            "proxies": defaultProxies,
        },
        {
            "name": "Speedtest",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Speedtest.png",
            "type": "select",
            "proxies": defaultProxies,
        },
        {
            "name": "静态资源",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Cloudflare.png",
            "type": "select",
            "include-all": true,
            "proxies": defaultProxies,
        },
        {
            "name": "FCM推送",
            "icon": "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Google_Search.png",
            "type": "select",
            "proxies": [
                "全球直连", "Google", "节点选择"
            ]
        },
        {
            "name": "Steam修复",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Steam.png",
            "type": "select",
            "proxies": [
                "全球直连", "游戏平台", "节点选择"
            ]
        },
        {
            "name": "Play商店修复",
            "icon": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/icons/GooglePlay.png",
            "type": "select",
            "proxies": [
                "全球直连", "Google", "节点选择"
            ]
        },
        {
            "name": "搜狗输入",
            "icon": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/icons/Sougou.png",
            "type": "select",
            "proxies": [
                "全球直连", "REJECT"
            ]
        },
        {
            "name": "全球直连",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Direct.png",
            "type": "select",
            "proxies": [
                "DIRECT", "节点选择"
            ]
        },
        {
            "name": "广告拦截",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AdBlack.png",
            "type": "select",
            "proxies": [
                "REJECT", "全球直连"
            ]
        },
        ...countryProxyGroups,
        {
            "name": "GLOBAL",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
            "include-all": true,
            "type": "select",
            "proxies": globalProxies
        }
    ].filter(Boolean); // 过滤掉 null 值
}

function main(config) {
    // 查看当前有哪些国家的节点
    const countryList = parseCountries(config);
    // 修改默认代理组
    globalProxies.push(...countryList.reverse().map(c => `${c}节点`));
    for (const country of countryList.reverse()) {
        const groupName = `${country}节点`;
        defaultProxies.splice(1, 0, groupName);
        defaultSelector.splice(1, 0, groupName);
        defaultProxiesDirect.splice(2, 0, groupName);
    }
    // 处理落地
    if (landing) {
        idx = defaultProxies.indexOf("自动选择");
        defaultProxies.splice(idx, 0, "落地节点");

        idx = defaultSelector.indexOf("手动切换");
        defaultSelector.splice(idx, 0, "落地节点");

        idx = globalProxies.indexOf("自动选择");
        globalProxies.splice(idx, 0, ...["落地节点", "前置代理"]);
    }
    // 生成国家节点组
    const countryProxyGroups = buildCountryProxyGroups(countryList);
    // 生成代理组
    const proxyGroups = buildProxyGroups(countryList, countryProxyGroups);

    if (fullConfig) Object.assign(config, {
        "mixed-port": 7890,
        "redir-port": 7892,
        "tproxy-port": 7893,
        "routing-mark": 7894,
        "allow-lan": true,
        "ipv6": ipv6Enabled,
        "mode": "rule",
        "unified-delay": true,
        "tcp-concurrent": true,
        "find-process-mode": "off",
        "log-level": "info",
        "geodata-loader": "standard",
        "external-controller": ":9999",
        "profile": {
            "store-selected": true,
        }
    });

    Object.assign(config, {
        "proxy-groups": proxyGroups,
        "rule-providers": ruleProviders,
        "rules": rules,
        "sniffer": snifferConfig,
        "dns": dnsConfig,
        "geodata-mode": true,
        "geox-url": geoxURL,
    });

    return config;
}
