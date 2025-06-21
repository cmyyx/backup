/*
powerfullz 的 Substore 订阅转换脚本
传入参数：
- loadbalance: 启用负载均衡 (默认false)
- landing: 启用落地节点功能 (默认false)
*/

const inArg = $arguments; // console.log(inArg)
const loadbalance = inArg.loadbalance || false,
    landing = inArg.landing || false;

const defaultProxies = [
    "节点选择", "香港节点", "台湾节点", "狮城节点", "日本节点", "韩国节点", "美国节点", "英国节点", "加拿大节点",
    "澳洲节点", "欧盟节点", "非洲节点", "自动选择", "手动切换", "全球直连"
];

const defaultSelector = [
    "自动选择", "香港节点", "台湾节点", "狮城节点", "日本节点", "韩国节点", "美国节点", "英国节点", "加拿大节点",
    "澳洲节点", "欧盟节点", "非洲节点", "手动切换"
];

const globalProxies = [
    "节点选择", "手动切换", "自动选择", "人工智能", "加密货币", "Telegram", "Google", "YouTube", "Netflix", "TikTok",
    "E-Hentai", "PikPak", "巴哈姆特", "哔哩哔哩", "懂王社媒", "学术资源", "游戏平台", "微软服务", "搜狗输入", "静态资源",
    "FCM推送", "Steam修复", "Play商店修复", "全球直连", "广告拦截", "漏网之鱼", "故障转移", "香港节点", "台湾节点",
    "狮城节点", "日本节点", "韩国节点", "美国节点", "英国节点", "加拿大节点", "澳洲节点", "欧盟节点", "非洲节点"
];

const proxyGroups = [
    {
        "name": "节点选择",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png",
        "type": "select",
        "proxies": defaultSelector
    },
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
        "proxies": defaultProxies,
    },
    {
        "name": "加密货币",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Cryptocurrency_3.png",
        "type": "select",
        "proxies": defaultProxies,
    },
    {
        "name": "Telegram",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram.png",
        "type": "select",
        "proxies": defaultProxies,
    },
    {
        "name": "Google",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Google_Search.png",
        "type": "select",
        "proxies": defaultProxies,
    },
    {
        "name": "YouTube",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube.png",
        "type": "select",
        "proxies": defaultProxies,
    },
    {
        "name": "Netflix",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Netflix.png",
        "type": "select",
        "proxies": defaultProxies,
    },
    {
        "name": "TikTok",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/TikTok.png",
        "type": "select",
        "proxies": defaultProxies,
    },
    {
        "name": "E-Hentai",
        "icon": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/icons/Ehentai.png",
        "type": "select",
        "proxies": defaultProxies,
    },
    {
        "name": "PikPak",
        "icon": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/icons/PikPak.png",
        "type": "select",
        "proxies": defaultProxies,
    },
    {
        "name": "巴哈姆特",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Bahamut.png",
        "type": "select",
        "proxies": [
            "台湾节点", "节点选择", "手动切换", "全球直连"
        ]
    },
    {
        "name": "哔哩哔哩",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/bilibili.png",
        "type": "select",
        "proxies": [
            "全球直连", "台湾节点", "香港节点"
        ]
    },
    {
        "name": "懂王社媒",
        "icon": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/icons/TruthSocial.png",
        "type": "select",
        "proxies": [
            "美国节点", "加拿大节点", "节点选择", "手动切换"
        ]
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
        "name": "搜狗输入",
        "icon": "https://fastly.jsdelivr.net/gh/powerfullz/override-rules@master/icons/Sougou.png",
        "type": "select",
        "proxies": [
            "全球直连", "REJECT"
        ]
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
            "全球直连", "节点选择"
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
            "全球直连", "节点选择"
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
    {
        "name": "漏网之鱼",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png",
        "type": "select",
        "proxies": [
            "节点选择", "全球直连"
        ]
    },
    {
        "name": "故障转移",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Available_1.png",
        "type": "fallback",
        "lazy": false,
        "proxies": [
            "台湾节点", "香港节点", "狮城节点", "日本节点", "韩国节点", "美国节点", "英国节点", "加拿大节点",
            "澳洲节点", "欧盟节点", "非洲节点", "手动切换", "全球直连"
        ]
    },
    {
        "name": "香港节点",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png",
        "include-all": true,
        "filter": "(?i)港|HK|hk|Hong Kong|HongKong|hongkong",
        "exclude-filter": "(?i)家宽|家庭|商宽|落地",
        "type": "url-test",
        "interval": 300,
        "tolerance": 20,
        "lazy": false
    },
    {
        "name": "台湾节点",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png",
        "include-all": true,
        "filter": "(?i)台|新北|彰化|TW|Taiwan",
        "exclude-filter": "(?i)家宽|家庭|商宽|落地",
        "type": "url-test",
        "interval": 300,
        "tolerance": 20,
        "lazy": false
    },
    {
        "name": "狮城节点",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png",
        "include-all": true,
        "filter": "(?i)新加坡|坡|狮城|SG|Singapore",
        "exclude-filter": "(?i)家宽|家庭|商宽|落地",
        "type": "url-test",
        "interval": 300,
        "tolerance": 20,
        "lazy": false
    },
    {
        "name": "日本节点",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png",
        "include-all": true,
        "filter": "(?i)日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan",
        "exclude-filter": "(?i)家宽|家庭|商宽|落地",
        "type": "url-test",
        "interval": 300,
        "tolerance": 20,
        "lazy": false
    },
    {
        "name": "韩国节点",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Korea.png",
        "include-all": true,
        "filter": "(?i)KR|Korea|KOR|首尔|韩|韓",
        "exclude-filter": "(?i)家宽|家庭|商宽|落地",
        "type": "url-test",
        "interval": 300,
        "tolerance": 20,
        "lazy": false
    },
    {
        "name": "美国节点",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png",
        "include-all": true,
        "filter": "(?i)美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States",
        "exclude-filter": "(?i)家宽|家庭|商宽|落地",
        "type": "url-test",
        "interval": 300,
        "tolerance": 20,
        "lazy": false
    },
    {
        "name": "加拿大节点",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Canada.png",
        "include-all": true,
        "filter": "(?i)加拿大|多伦多|Toronto|温哥华|Vancouver|蒙特利尔|Montreal|卡尔加里|Calgary|渥太华|Ottawa",
        "exclude-filter": "(?i)家宽|家庭|商宽|落地",
        "type": "url-test",
        "interval": 300,
        "tolerance": 20,
        "lazy": false
    },
    {
        "name": "英国节点",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_Kingdom.png",
        "include-all": true,
        "filter": "(?i)英国|UK|GB|伦敦|London|曼彻斯特|Manchester|伯明翰|Birmingham|利物浦|Liverpool|谢菲联|Sheffield",
        "exclude-filter": "(?i)家宽|家庭|商宽|落地",
        "type": "url-test",
        "interval": 300,
        "tolerance": 20,
        "lazy": false
    },
    {
        "name": "澳洲节点",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Australia.png",
        "include-all": true,
        "filter": "(?i)澳洲|悉尼|墨尔本|布里斯班|堪培拉|黄金海岸|珀斯|阿德莱德|澳大利亚|AU|Australia",
        "exclude-filter": "(?i)家宽|家庭|商宽|落地",
        "type": "url-test",
        "interval": 300,
        "tolerance": 20,
        "lazy": false
    },
    {
        "name": "欧盟节点",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/European_Union.png",
        "include-all": true,
        "filter": "(奥地利|Austria|AUT|AT|维也纳|Vienna|比利时|Belgium|BEL|BE|布鲁塞尔|Brussels|根特|Ghent|安特卫普|Antwerp|保加利亚|Bulgaria|BGR|BG|索菲亚|Sofia|克罗地亚|Croatia|HRV|HR|萨格勒布|Zagreb|塞浦路斯|Cyprus|CYP|CY|尼科西亚|Nicosia|捷克|Czechia|Czech|CZE|CZ|布拉格|Prague|丹麦|Denmark|DNK|DK|哥本哈根|Copenhagen|欧登塞|Odense|爱沙尼亚|Estonia|EST|EE|塔林|Tallinn|芬兰|Finland|FIN|FI|赫尔辛基|Helsinki|法国|France|FRA|FR|巴黎|Paris|马赛|Marseille|里昂|Lyon|德国|Germany|DEU|DE|法兰克福|Frankfurt|柏林|Berlin|慕尼黑|Munich|杜塞尔多夫|Dusseldorf|汉堡|Hamburg|希腊|Greece|GRC|EL|GR|雅典|Athens|匈牙利|Hungary|HUN|HU|布达佩斯|Budapest|爱尔兰|Ireland|IRL|IE|都柏林|Dublin|意大利|Italy|ITA|IT|米兰|Milan|罗马|Rome|拉脱维亚|Latvia|LVA|LV|里加|Riga|立陶宛|Lithuania|LTU|LT|维尔纽斯|Vilnius|卢森堡|Luxembourg|LUX|LU|卢森堡市|卢森堡|马耳他|Malta|MLT|MT|瓦莱塔|Valletta|荷兰|Netherlands|NLD|NL|阿姆斯特丹|Amsterdam|鹿特丹|Rotterdam|波兰|Poland|POL|PL|华沙|Warsaw|克拉科夫|Krakow|葡萄牙|Portugal|PRT|PT|里斯本|Lisbon|波尔图|Porto|罗马尼亚|Romania|ROU|RO|布加勒斯特|Bucharest|斯洛伐克|Slovakia|SVK|SK|布拉迪斯拉发|Bratislava|斯洛文尼亚|Slovenia|SVN|SI|卢布尔雅那|Ljubljana|西班牙|Spain|ESP|ES|马德里|Madrid|巴塞罗那|Barcelona|瑞典|Sweden|SWE|SE|斯德哥尔摩|Stockholm|马尔默|Malmö|Malmo)",
        "exclude-filter": "(?i)家宽|家庭|商宽|落地",
        "type": "select"
    },
    {
        "name": "非洲节点",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Africa_Map.png",
        "include-all": true,
        "filter": "(?i)非洲|Africa|南非|South Africa|埃及|Egypt|开罗|Cairo|尼日利亚|Nigeria|拉各斯|Lagos",
        "exclude-filter": "(?i)家宽|家庭|商宽|落地",
        "type": "select"
    },
    {
        "name": "GLOBAL",
        "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
        "include-all": true,
        "type": "select",
        "proxies": globalProxies
    }
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
    "apple_cdn": {
        "type": "http", "behavior": "domain", "format": "text", "interval": 86400,
        "url": "https://ruleset.skk.moe/Clash/domainset/apple_cdn.txt",
        "path": "./sukkaw_ruleset/apple_cdn.txt"
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
    }
}

const rules = [
    "RULE-SET,ADBlock,广告拦截",
    "RULE-SET,AdditionalFilter,广告拦截",
    "RULE-SET,sogouinput,搜狗输入",
    "RULE-SET,TruthSocial,懂王社媒",
    "RULE-SET,cdn_domainset,静态资源",
    "RULE-SET,cdn_non_ip,静态资源",
    "RULE-SET,apple_cdn,全球直连",
    "RULE-SET,microsoft_cdn_non_ip,全球直连",
    "RULE-SET,ai_non_ip,人工智能",
    "RULE-SET,Microsoft,微软服务",
    "RULE-SET,EHentai,E-Hentai",
    "RULE-SET,TikTok,TikTok",
    "RULE-SET,SteamFix,Steam修复",
    "RULE-SET,PlayStoreFix,Play商店修复",
    "RULE-SET,GoogleFCM,FCM推送",
    "GEOSITE,GOOGLE-PLAY@CN,全球直连",
    "GEOSITE,GOOGLE,Google",
    "GEOSITE,YOUTUBE@CN,全球直连",
    "GEOSITE,YOUTUBE,YouTube",
    "GEOSITE,NETFLIX,Netflix",
    "GEOSITE,BAHAMUT,巴哈姆特",
    "GEOSITE,BILIBILI,哔哩哔哩",
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
    "MATCH,漏网之鱼"
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
    "ipv6": true,
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

function handleLoadBalance(group) {
    const targetNames = ["香港节点", "台湾节点", "狮城节点", "日本节点",
        "韩国节点", "美国节点", "英国节点", "加拿大节点", "澳洲节点"];
    for (names of targetNames) {
        for (groups of group) {
            if (groups.name === names) {
                groups.type = "load-balance";
                groups["strategy"] = "consistent-hashing";
                delete groups["tolerance"];
                delete groups["lazy"];
                delete groups["interval"];
                break;
            }
        }
    }
    return group;
}

function handleLanding(group) {
    const landingGroups = [
        {
            "name": "落地节点",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Airport.png",
            "type": "select",
            "include-all": true,
            "filter": "(?i)家宽|家庭|商宽|落地",
        },
        {
            "name": "前置代理",
            "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png",
            "type": "select",
            "include-all": true,
            "exclude-filter": "(?i)家宽|家庭|商宽|落地",
            "proxies": defaultSelector
        }
    ];

    group.splice(2, 0, ...landingGroups);

    idx = defaultProxies.indexOf("自动选择");
    defaultProxies.splice(idx, 0, "落地节点");

    idx = defaultSelector.indexOf("手动切换");
    defaultSelector.splice(idx, 0, "落地节点");

    idx = globalProxies.indexOf("自动选择");
    globalProxies.splice(idx, 0, ...["落地节点", "前置代理"]);

    return group;
}

function main(config) {
    // proxy-groups
    if (landing && loadbalance) {
        config["proxy-groups"] = handleLanding(handleLoadBalance(proxyGroups));
    }
    else {
        if (loadbalance) {
            config["proxy-groups"] = handleLoadBalance(proxyGroups);
        }
        else if (landing) {
            config["proxy-groups"] = handleLanding(proxyGroups);
        }
        else {
            config["proxy-groups"] = proxyGroups;
        }
    }

    // rule-providers
    config["rule-providers"] = ruleProviders;

    // rules
    config["rules"] = rules;

    // sniffer
    config["sniffer"] = snifferConfig;

    // dns
    config["dns"] = dnsConfig;

    //geox-url
    if (!config["geox-url"]) config["geox-url"] = {};
    config["geodata-mode"] = true;
    config["geox-url"] = geoxURL;

    return config;
}
