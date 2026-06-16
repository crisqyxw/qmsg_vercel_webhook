import { sendMessageToQmsg, formatBalanceWarnMessage, formatSubTrackrMessage } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      reason: 'Method Not Allowed'
    });
  }

  try {
    const data = req.body;

    // 检测格式类型
    const format = detectFormat(data);
    let message;

    if (format === 'artalk') {
      const { notify_subject, notify_body } = data;
      message = notify_body;
      if (notify_subject) {
        message = `【${notify_subject}】\n\n${message}`;
      }
    } else if (format === 'balance_warn') {
      message = formatBalanceWarnMessage(data);
    } else if (format === 'subtrackr') {
      message = formatSubTrackrMessage(data);
    } else {
      return res.status(400).json({
        success: false,
        reason: 'Unknown request format: requires "notify_body" (Artalk), "type" (balance_warn), or "event" (SubTrackr) field'
      });
    }

    const qmsgResponse = await sendMessageToQmsg(message);

    res.status(200).json({
      success: qmsgResponse.success,
      reason: qmsgResponse.reason
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      success: false,
      reason: 'Internal server error'
    });
  }
}

/**
 * 检测请求体格式类型
 * @returns {'artalk' | 'balance_warn' | 'subtrackr' | null}
 */
function detectFormat(data) {
  if (!data || typeof data !== 'object') return null;
  if (data.notify_body !== undefined) return 'artalk';
  if (data.event !== undefined) return 'subtrackr';
  if (data.type !== undefined) return 'balance_warn';
  return null;
}
