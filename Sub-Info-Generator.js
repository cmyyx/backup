/**
 * @name Sub-Info-Generator
 * @description
 * 一个强大且独立的 sub-store 脚本，用于在订阅顶部生成一个美观的流量信息节点。
 * 内置前置清理、智能重置日和自定义日期格式功能。
 *
 * @version 3.2 (智能重置日版)
 * @author Gemini
 *
 * @param {string} [providerName] - 自定义在节点名称中显示的服务商名称。若不提供，则自动使用订阅本身的名称。
 * @param {boolean} [showRemaining=false] - 是否显示剩余流量而非已用流量。
 * @param {boolean} [hideExpire=false] - 是否隐藏到期时间信息。
 * @param {number} [resetDay] - 每月的流量重置日 (例如: 1)。
 * @param {string} [startDate] - 计费周期的开始日期 (格式: 'YYYY-MM-DD')。
 * @param {number} [cycleDays] - 计费周期的天数 (例如: 30)。
 * @param {boolean} [noReset=false] - 设置为 true 可完全禁用重置日倒计时的计算和显示。
 * @param {boolean} [noFlow=false] - 完全跳过流量信息的获取和显示。
 *
 * @example
 * # 禁用重置日计算，并显示剩余流量
 * http://example.com/sub#noReset=true&showRemaining=true
 */
async function operator(proxies = [], targetPlatform, context) {
  // --- 辅助函数：格式化日期为 YYYY/MM/DD ---
  const toYYYYMMDD = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return null;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

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
    if (args.noFlow) { /* no-op */ }
    else if (sub.subUserinfo) {
      subInfo = /^https?:\/\//.test(sub.subUserinfo)
        ? await getFlowHeaders(undefined, undefined, undefined, sub.proxy, sub.subUserinfo)
        : sub.subUserinfo;
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
    const expiryDateObj = expires ? new Date(expires * 1000) : null;

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

    // 到期时间 (使用新的格式化函数)
    if (expiryDateObj && !args.hideExpire) {
      const expiryDateStr = toYYYYMMDD(expiryDateObj);
      if (expiryDateStr) {
        nameParts.push(`到期: ${expiryDateStr}`);
      }
    }

    // --- 智能重置日计算 ---
    if (!args.noReset) { // 检查是否需要禁用重置日计算
      let resetConfig = {};
      
      // 优先使用用户明确提供的参数
      if (args.startDate && args.cycleDays) {
        resetConfig = { startDate: args.startDate, cycleDays: args.cycleDays };
      } else if (args.resetDay) {
        resetConfig = { resetDay: args.resetDay };
      } else if (expiryDateObj) {
        // 如果没有提供参数，并且获取到了到期日，则自动使用到期日的“天”
        resetConfig = { resetDay: expiryDateObj.getDate() };
      }

      // 只有在配置有效时才尝试计算
      if (Object.keys(resetConfig).length > 0) {
        try {
          const remainingDays = getRmainingDays(resetConfig);
          if (remainingDays) {
            nameParts.push(`重置: ${remainingDays} 天后`);
          }
        } catch (e) { /* 忽略计算错误 */ }
      }
    }

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
