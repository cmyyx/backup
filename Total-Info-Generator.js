/**
 * @name Total-Info-Generator
 * @description
 * 专用于【组合订阅】的脚本。具有双重功能：
 * 1. 在顶部生成一个所有子订阅流量汇总的、美化的【总览】信息节点。
 * 2. 将汇总后的流量信息写回 sub-store 存储，以持久化数据。
 *
 * @version 1.3 (独立时间节点版)
 * @author Gemini (改编自 sub-store 官方示例)
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

  // --- 1. 数据获取与汇总 ---
  const $ = $substore;
  const { source } = context;
  const { _collection: collection } = source;

  if (!collection) {
    console.log('Total-Info-Generator: 非组合订阅，脚本跳过。');
    return proxies;
  }

  const { parseFlowHeaders, getFlowHeaders, flowTransfer } = flowUtils;
  const allSubsInStore = $.read('subs') || [];
  const subNamesInCollection = [...collection.subscriptions];

  let uploadSum = 0, downloadSum = 0, totalSum = 0;
  let earliestExpire = null;

  for (const sub of allSubsInStore) {
    if (subNamesInCollection.includes(sub.name)) {
      let subInfo;
      try {
        if (sub.subUserinfo) {
          subInfo = /^https?:\/\//.test(sub.subUserinfo)
            ? await getFlowHeaders(undefined, undefined, undefined, sub.proxy, sub.subUserinfo)
            : sub.subUserinfo;
        } else {
          const url = `${sub.url}`.split(/[\r\n]+/)[0].trim();
          subInfo = await getFlowHeaders(url);
        }

        if (subInfo) {
          const { total, usage: { upload, download }, expires } = parseFlowHeaders(subInfo);
          if (upload > 0) uploadSum += upload;
          if (download > 0) downloadSum += download;
          if (total > 0) totalSum += total;
          if (expires && expires * 1000 > Date.now()) {
            if (!earliestExpire || expires < earliestExpire) {
              earliestExpire = expires;
            }
          }
        }
      } catch (e) {
        console.error(`Total-Info-Generator: 处理子订阅 ${sub.name} 出错:`, e);
      }
    }
  }

  // --- 2. 生成美化的总览信息节点 ---
  if (totalSum > 0) {
    const nameParts = [];
    const usedSum = uploadSum + downloadSum;
    const usedT = flowTransfer(usedSum);
    const totalT = flowTransfer(totalSum);
    nameParts.push(`总流量: ${usedT.value} ${usedT.unit} / ${totalT.value} ${totalT.unit}`);

    // 最早到期日信息 (使用新的格式化函数)
    if (earliestExpire) {
      const expiryDateStr = toYYYYMMDD(new Date(earliestExpire * 1000));
      if (expiryDateStr) {
        nameParts.push(`最早到期: ${expiryDateStr}`);
      }
    }

    // 创建总览节点
    const finalName = `Info-总览 | ${nameParts.join(' | ')}`;
    const totalInfoNode = {
      type: 'ss', server: 'info.local', port: 1, cipher: 'none', password: 'info',
      name: finalName,
    };

    // 创建独立的更新时间节点
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const updateTime = `${month}/${day} ${hours}:${minutes}`;
    const timeInfoNode = {
        type: 'ss', server: 'info.local', port: 1, cipher: 'none', password: 'info',
        name: `Info-更新于: ${updateTime}`,
    };

    // 将两个节点都添加到开头，并确保时间节点在最前
    proxies.unshift(totalInfoNode);
    proxies.unshift(timeInfoNode);
  }

  // --- 3. 持久化数据 ---
  const COLLECTIONS_KEY = 'collections';
  const allCols = $.read(COLLECTIONS_KEY) || [];
  const colIndex = allCols.findIndex(c => c.name === collection.name);

  if (colIndex !== -1) {
    const subUserinfoStr = `upload=${uploadSum}; download=${downloadSum}; total=${totalSum}${earliestExpire ? `; expire=${earliestExpire}` : ''}`;
    allCols[colIndex].subUserinfo = subUserinfoStr;
    $.write(allCols, COLLECTIONS_KEY);
    console.log(`Total-Info-Generator: 已将汇总流量信息写回组合订阅 '${collection.name}'。`);
  }
  
  return proxies;
}
