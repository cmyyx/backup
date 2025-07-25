/**
 * @name Sub-Info-Generator
 * @description
 * 一个强大且独立的 sub-store 脚本，用于在订阅顶部生成一个美观的流量信息节点。
 * 内置前置清理功能，可移除订阅源自带的零散信息节点。
 *
 * @version 3.1 (文档完整版)
 * @author Gemini
 *
 * @param {string} [providerName] - 自定义在节点名称中显示的服务商名称。若不提供，则自动使用订阅本身的名称。
 * @param {boolean} [showRemaining=false] - 是否显示剩余流量而非已用流量。设置为 true 则显示剩余流量。
 * @param {boolean} [hideExpire=false] - 是否隐藏到期时间信息。
 * @param {number} [resetDay] - 每月的流量重置日 (例如: 1)。用于计算重置倒计时。
 * @param {string} [startDate] - 计费周期的开始日期 (格式: 'YYYY-MM-DD')。优先级高于 resetDay。
 * @param {number} [cycleDays] - 计费周期的天数 (例如: 30)。需要与 startDate 配合使用。
 * @param {boolean} [noFlow=false] - 完全跳过流量信息的获取和显示。
 *
 * @example
 * # 使用自定义名称"MyProvider"，并显示剩余流量
 * http://example.com/sub#providerName=MyProvider&showRemaining=true
 */
async function operator(proxies = [], targetPlatform, context) {
  // --- 1. 前置清洁工 ---
  const junkNodeKeywords = ['剩余流量', '可用流量', '套餐到期', '重置', '到期时间', '流量信息'];
  const cleanedProxies = proxies.filter(p => {
    return !p.name.startsWith('Info-') && !junkNodeKeywords.some(keyword => p.name.includes(keyword));
  });

  // --- 2. 核心逻辑 ---
  const args = $arguments || {};
  const { parseFlowHeaders, getFlowHeaders, flowTransfer, getRmainingDays } = flowUtils;
  const sub = context.source[cleanedProxies?.[0]?._subName || cleanedProxies?.[0]?.subName];
  if (!sub) {
    return cleanedProxies;
  }

  let subInfo;
  try {
    if (args.noFlow) {
        // 参数指定不获取流量
    } else if (sub.subUserinfo) {
      if (/^https?:\/\//.test(sub.subUserinfo)) {
        subInfo = await getFlowHeaders(undefined, undefined, undefined, sub.proxy, sub.subUserinfo);
      } else {
        subInfo = sub.subUserinfo;
      }
    } else {
      const url = `${sub.url}`.split(/[\r\n]+/)[0].trim();
      subInfo = await getFlowHeaders(url);
    }
  } catch (e) {
    console.error(`获取订阅 ${sub.name} 流量信息时出错:`, e);
  }

  if (subInfo) {
    const { expires, total, usage: { upload, download } } = parseFlowHeaders(subInfo);
    const nameParts = [];

    // 流量信息
    let used = upload + download;
    if (args.showRemaining) {
      const remaining = total - used;
      const remainingT = flowTransfer(Math.abs(remaining));
      nameParts.push(`流量: 剩 ${remainingT.value} ${remainingT.unit}`);
    } else {
      const usedT = flowTransfer(used);
      const totalT = flowTransfer(total);
      nameParts.push(`流量: ${usedT.value} ${usedT.unit} / ${totalT.value} ${totalT.unit}`);
    }

    // 到期时间
    if (expires && !args.hideExpire) {
      const expiryDate = new Date(expires * 1000).toLocaleDateString();
      nameParts.push(`到期: ${expiryDate}`);
    }

    // 重置信息
    try {
      const remainingDays = getRmainingDays({
        resetDay: args.resetDay,
        startDate: args.startDate,
        cycleDays: args.cycleDays,
      });
      if (remainingDays) {
         nameParts.push(`重置: ${remainingDays} 天后`);
      }
    } catch (e) { /* 忽略错误 */ }

    const displayName = args.providerName || sub.name;
    const finalName = `Info-${displayName} | ${nameParts.join(' | ')}`;

    const infoNode = {
      type: 'ss', server: 'info.local', port: 1, cipher: 'none', password: 'info',
      name: finalName,
    };
    
    cleanedProxies.unshift(infoNode);
  }

  return cleanedProxies;
}
