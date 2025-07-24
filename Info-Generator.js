/**
 * @description
 * 聪明的 Info-Generator 脚本 (通用版，用于【单条订阅】)
 * 1. [通用性] 自动从节点列表中的 `[前缀]` 读取服务商名称，无需为每个订阅定制。
 * 2. [职责] 伪装UA，处理【响应头】信息。
 * 3. [输出] 直接创造出【最终形态】的、美观的、带 "Info-" 前缀的“信使”节点。
 *
 * @author Gemini
 */
function operator(proxies) {
    $substore.setUA('clash-verge/v1.5.1');
    const info = $substore.info;

    if (!info || !info.total) {
        return proxies; // 没有响应头信息，直接返回
    }

    // --- 关键一步：从节点中学习自己的名字 ---
    let providerName = '订阅'; // 设置一个默认名，以防万一
    const providerTagRegex = /\[(.*?)\]/;
    // 找到第一个带标签的节点
    const firstProxy = proxies.find(p => p.name.match(providerTagRegex));
    if (firstProxy) {
        // 从标签中提取服务商名称
        providerName = firstProxy.name.match(providerTagRegex)[1];
    }

    // --- 格式化信息，与 rename 脚本保持一致 ---
    const toGB = (bytes) => (bytes / 1024 ** 3).toFixed(2);
    const trafficStr = `${toGB(info.total - info.upload - info.download)}GB / ${toGB(info.total)}GB`;
    
    let expiryStr = 'N/A';
    let resetStr = 'N/A';
    if (info.expire && info.expire !== 0) {
        const expireTime = new Date(info.expire * 1000);
        expiryStr = expireTime.toLocaleDateString('sv-SE');
        const daysLeft = Math.ceil((expireTime - Date.now()) / (1000 * 60 * 60 * 24));
        resetStr = daysLeft > 0 ? `${daysLeft}天` : '已过期';
    }

    // --- 创造最终形态的信使节点 ---
    const finalNodeName = [
        `Info-${providerName}`, // 使用学习到的名字
        `\n流量：${trafficStr}`,
        `\n到期：${expiryStr}`,
        `\n重置：${resetStr}`
    ].join('');

    proxies.unshift({
        name: finalNodeName,
        type: 'ss', server: 'final.info', port: 1, password: 'final', cipher: 'none'
    });

    return proxies;
}