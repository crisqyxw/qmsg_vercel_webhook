export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 检查环境变量配置
    const envCount = [
      process.env.QMSG_KEY,
      process.env.QMSG_QQ_GROUP,
      process.env.WEBHOOK_SECRET
    ].filter(Boolean).length;

    // 检查QMSG API是否可访问
    let qmsgConfigured = false;
    if (process.env.QMSG_KEY) {
      try {
        const testUrl = `https://qmsg.zendee.cn/group/${process.env.QMSG_KEY}`;
        const response = await fetch(testUrl, { method: 'HEAD' });
        qmsgConfigured = response.ok;
      } catch (error) {
        qmsgConfigured = false;
      }
    }

    const status = {
      api: {
        online: true,
        version: '1.0.0',
        uptime: process.uptime()
      },
      qmsg: {
        configured: !!process.env.QMSG_KEY,
        reachable: qmsgConfigured,
        qqGroup: process.env.QMSG_QQ_GROUP ? '已配置' : '未配置'
      },
      envCount,
      timestamp: new Date().toISOString(),
      deployment: {
        platform: 'Vercel',
        region: process.env.VERCEL_REGION || 'unknown'
      }
    };

    res.status(200).json(status);
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}