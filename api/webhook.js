export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const data = req.body;
      const comment = data.comment;
      const parentComment = data.parent_comment;

      let message = `新评论通知：\n`;
      message += `评论ID：${comment.id}\n`;
      message += `评论者：${comment.nick}\n`;
      message += `评论内容：${comment.content}\n`;
      message += `评论时间：${comment.date}`;

      if (parentComment) {
        message += `\n回复给：${parentComment.nick}`;
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
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({
      success: false,
      reason: 'Method Not Allowed'
    });
  }
}

async function sendMessageToQmsg(message) {
  const qmsgKey = process.env.QMSG_KEY;
  const targetQqGroup = process.env.QMSG_QQ_GROUP;

  if (!qmsgKey || !targetQqGroup) {
    return {
      success: false,
      reason: 'QMSG configuration missing'
    };
  }

  const url = `https://qmsg.zendee.cn/send/${qmsgKey}?msg=${encodeURIComponent(message)}&qq=${targetQqGroup}`;

  try {
    const response = await fetch(url, {
      method: 'GET'
    });
    
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