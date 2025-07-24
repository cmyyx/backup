/**
 * @description
 * 一致的 rename 脚本 (带“护盾”，用于【组合订阅】)
 * 1. [聚合] 聚合来自多个【零散】信息节点的数据。
 * 2. [护盾] 忽略所有已由 Info-Generator 生成的 "Info-" 节点，避免重复处理。
 * 3. [一致性] 最终生成的信使节点，其命名和格式与 Info-Generator 完全相同。
 *
 * @author Gemini
 */
function operator(proxies) {
    const providerTagRegex = /\[(.*?)\]/;
    const infoNodePrefix = 'Info-';
    const infoNodeKeywords = ['剩余流量', '可用流量', '套餐到期', '重置'];
    const trafficRegex = /(?:剩余|可用)流量[\s:：]*([\d.]+[\s]*(?:G|M|T)B?)/i;
    const expiryRegex = /套餐到期[\s:：]*(\d{4}-\d{2}-\d{2})/;
    const resetRegex = /重置[\s:：]*(.*?)(?:\r\n|\r|\n|$)/;

    const providers = new Map();
    const infoNodeNamesToRemove = [];

    proxies.forEach(p => {
        if (p.name.startsWith(infoNodePrefix)) {
            return; // 护盾：放行成品
        }

        const tagMatch = p.name.match(providerTagRegex);
        if (!tagMatch) return;

        const providerName = tagMatch[1]; // 从 `[服务商名]` 中提取 `服务商名`
        if (infoNodeKeywords.some(keyword => p.name.includes(keyword))) {
            if (!providers.has(providerName)) providers.set(providerName, {});
            const providerData = providers.get(providerName);

            const trafficMatch = p.name.match(trafficRegex);
            if (trafficMatch) providerData.trafficInfo = trafficMatch[1].trim().replace(/\s/g, '');

            const expiryMatch = p.name.match(expiryRegex);
            if (expiryMatch) providerData.expiryInfo = expiryMatch[1].trim();
            
            const resetMatch = p.name.match(resetRegex);
            if (resetMatch) providerData.resetInfo = resetMatch[1].trim();

            infoNodeNamesToRemove.push(p.name);
        }
    });

    const newInfoNodesToAdd = [];
    providers.forEach((data, providerName) => {
        if (Object.keys(data).length > 0) {
            // --- 采用与 Info-Generator 完全一致的命名和格式 ---
            const nameParts = [
                `${infoNodePrefix}${providerName}`, // 使用提取出的服务商名，不带括号
                `\n流量：${data.trafficInfo || 'N/A'}`,
                `\n到期：${data.expiryInfo || 'N/A'}`,
            ];
            if (data.resetInfo) {
                nameParts.push(`\n重置：${data.resetInfo}`);
            }
            const newName = nameParts.join('');
            
            newInfoNodesToAdd.push({
                name: newName,
                type: 'ss', server: 'info.local', port: 1, password: 'info', cipher: 'none'
            });
        }
    });

    let finalProxies = proxies.filter(p => !infoNodeNamesToRemove.includes(p.name));
    finalProxies = newInfoNodesToAdd.concat(finalProxies);
    return finalProxies;
}