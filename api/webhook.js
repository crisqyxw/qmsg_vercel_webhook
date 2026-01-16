export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const data = req.body;
      const { notify_subject, notify_body, comment, parent_comment } = data;

      if (!notify_body) {
        return res.status(400).json({
          success: false,
          reason: 'Missing required field: notify_body'
        });
      }

      let message = notify_body;
      if (notify_subject) {
        message = `【${notify_subject}】\n\n${message}`;
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

  const cleanedMessage = cleanMessageForQmsg(message);
  const url = `https://qmsg.zendee.cn/send/${qmsgKey}?msg=${encodeURIComponent(cleanedMessage)}&qq=${targetQqGroup}`;

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

function cleanMessageForQmsg(message) {
  let cleaned = message;
  
  if (cleaned.length > 1000) {
    cleaned = cleaned.substring(0, 997) + '...';
  }
  
  cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  return cleaned;
}