/**
 * @name Total-Info-Generator
 * @description
 * 专用于【组合订阅】的脚本。具有双重功能：
 * 1. 在顶部生成一个所有子订阅流量汇总的、美化的【总览】信息节点。
 * 2. 将汇总后的流量信息写回 sub-store 存储，以持久化数据。
 *
 * @version 1.1 (双功能版)
 * @author Gemini (改编自 sub-store 官方示例)
 */
async function operator(proxies = [], targetPlatform, context) {
  // --- 1. 数据获取与汇总 (改编自官方脚本) ---
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

  let uploadSum = 0;
  let downloadSum = 0;
  let totalSum = 0;
  let earliestExpire = null; // 使用 null 作为初始值，更严谨

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

  // --- 2. 生成美化的总览信息节点 (用于本次请求的即时显示) ---
  if (totalSum > 0) {
    const nameParts = [];
    const usedSum = uploadSum + downloadSum;
    const usedT = flowTransfer(usedSum);
    const totalT = flowTransfer(totalSum);
    nameParts.push(`总流量: ${usedT.value} ${usedT.unit} / ${totalT.value} ${totalT.unit}`);

    if (earliestExpire) {
      const expiryDate = new Date(earliestExpire * 1000).toLocaleDateString();
      nameParts.push(`最早到期: ${expiryDate}`);
    }

    const finalName = `Info-总览 | ${nameParts.join(' | ')}`;
    const totalInfoNode = {
      type: 'ss', server: 'info.local', port: 1, cipher: 'none', password: 'info',
      name: finalName,
    };
    proxies.unshift(totalInfoNode);
  }

  // --- 3. 新增：将汇总信息写回 Sub-Store 数据库 (用于持久化) ---
  const COLLECTIONS_KEY = 'collections';
  const allCols = $.read(COLLECTIONS_KEY) || [];
  const colIndex = allCols.findIndex(c => c.name === collection.name);

  if (colIndex !== -1) {
    // 构建标准的 subUserinfo 字符串
    const subUserinfoStr = `upload=${uploadSum}; download=${downloadSum}; total=${totalSum}${
      earliestExpire ? `; expire=${earliestExpire}` : ''
    }`;
    
    // 更新当前组合订阅的 subUserinfo 字段
    allCols[colIndex].subUserinfo = subUserinfoStr;
    
    // 将修改后的整个 collections 数组写回数据库
    $.write(allCols, COLLECTIONS_KEY);
    console.log(`Total-Info-Generator: 已将汇总流量信息写回组合订阅 '${collection.name}'。`);
  }
  
  return proxies;
}
