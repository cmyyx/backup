/*
 * 服务器地址替换脚本 - 用于 Substore 订阅转换
 * 
 * 功能：批量替换节点的服务器地址（IP/域名）
 * 
 * 使用方法：
 * 在 Substore 中传入参数，格式：old1=new1&old2=new2
 * 
 * 示例：
 *   120.232.220.162=165.101.123.7
 *   120.232.220.162=165.101.123.7&old.com=new.com
 *   192.168.1.1=10.0.0.1&expired.com=active.com
 */

// ==================== 脚本逻辑（无需修改）====================

function main(config) {
    if (!config.proxies || !Array.isArray(config.proxies)) {
        console.log("[警告] 没有找到节点配置");
        return config;
    }

    // 获取传入的参数
    const serverReplace = typeof $arguments !== 'undefined' ? $arguments : {};
    
    if (Object.keys(serverReplace).length === 0) {
        console.log("[提示] 未传入替换参数，跳过处理");
        return config;
    }

    // 显示替换规则
    console.log("\n[替换规则]");
    Object.entries(serverReplace).forEach(([oldServer, newServer]) => {
        console.log(`  ${oldServer} -> ${newServer}`);
    });
    console.log("");

    let replacedCount = 0;
    const totalCount = config.proxies.length;

    config.proxies.forEach(proxy => {
        if (proxy.server && serverReplace[proxy.server]) {
            const oldServer = proxy.server;
            proxy.server = serverReplace[proxy.server];
            replacedCount++;
            console.log(`[替换] ${proxy.name}: ${oldServer} -> ${proxy.server}`);
        }
    });

    console.log(`\n[完成] 共 ${totalCount} 个节点，替换了 ${replacedCount} 个服务器地址\n`);

    return config;
}
