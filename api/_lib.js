/**
 * 共享工具函数 - QMSG消息发送和格式化
 */

/** 将消息发送到QMSG */
export async function sendMessageToQmsg(message) {
  const qmsgKey = process.env.QMSG_KEY;
  const targetQqGroup = process.env.QMSG_QQ_GROUP;

  if (!qmsgKey || !targetQqGroup) {
    return {
      success: false,
      reason: 'QMSG configuration missing'
    };
  }

  const cleanedMessage = cleanMessageForQmsg(message);
  const url = `https://qmsg.zendee.cn/send/${qmsgKey}?msg=${encodeURIComponent(cleanedMessage)}&qq=${targetQqGroup}`;

  try {
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message to Qmsg:', error);
    return {
      success: false,
      reason: 'Failed to send message to Qmsg'
    };
  }
}

/** 清洗消息内容，适配QMSG限制 */
export function cleanMessageForQmsg(message) {
  let cleaned = message;

  if (cleaned.length > 1000) {
    cleaned = cleaned.substring(0, 997) + '...';
  }

  cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  return cleaned;
}

/**
 * 将额度预警格式的请求体转换为消息文本
 * @param {Object} data - 额度预警请求体
 * @param {string} data.type - 预警类型，如 "quota_exceed"
 * @param {string} data.title - 预警标题
 * @param {string} data.content - 预警内容模板，含 {{value}} 占位符
 * @param {string[]} data.values - 替换占位符的值数组
 * @param {number} data.timestamp - Unix 时间戳（秒）
 */
export function formatBalanceWarnMessage(data) {
  const { type, title, content, values = [], timestamp } = data;

  // 替换 content 中的 {{value}} 占位符为实际值
  let formattedContent = content;
  if (values.length > 0) {
    formattedContent = content.replace('{{value}}', values[0]);
  }

  // 格式化时间戳
  let timeStr = '';
  if (timestamp) {
    const d = new Date(timestamp * 1000);
    timeStr = `\n时间: ${d.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`;
  }

  const typeLabels = {
    'quota_exceed': '⚠️ 额度预警',
  };

  const typeLabel = typeLabels[type] || type;
  const titleLine = title ? `【${title}】` : `【${typeLabel}】`;

  return `${titleLine}\n\n${formattedContent}${timeStr}`;
}
