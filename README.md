# Artalk QMSG Webhook

将Artalk评论通知转发到QMSG QQ群的服务，部署在Vercel上。

## 功能

- 完全兼容Artalk官方Webhook格式
- 接收Artalk的Webhook POST请求
- 使用notify_body作为消息内容直接转发到QMSG
- 自动处理消息长度和格式优化
- 通过QMSG API发送消息到指定QQ群
- 返回处理结果给Artalk

## 部署到Vercel

### 方法一：一键部署
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/artalk-qmsg-webhook)

### 方法二：本地部署

1. 克隆项目：
```bash
git clone https://github.com/yourusername/artalk-qmsg-webhook.git
cd artalk-qmsg-webhook
```

2. 安装Vercel CLI（可选）：
```bash
npm install -g vercel
```

3. 部署：
```bash
vercel
```

## 环境变量配置

在Vercel项目设置中添加以下环境变量：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `QMSG_KEY` | QMSG的API密钥 | `xxxxxxxxxx` |
| `QMSG_QQ_GROUP` | 目标QQ群号 | `123456789` |
| `WEBHOOK_SECRET` | Webhook安全密钥（可选） | `your_secret` |

## Artalk配置

在Artalk后台设置中配置Webhook：

1. 进入Artalk管理后台
2. 找到Webhook设置
3. 添加新的Webhook：
   - URL: `https://your-vercel-app.vercel.app/webhook`
   - 事件类型: 评论创建
   - 请求方式: POST
   - Content-Type: application/json

## 仪表盘功能

访问部署后的根URL即可查看仪表盘：

1. **服务状态监控** - 实时显示API和QMSG连接状态
2. **配置信息** - 显示Webhook URL和环境变量配置
3. **一键测试** - 直接测试Webhook功能
4. **自动刷新** - 每30秒自动更新状态

## 本地开发

```bash
# 安装依赖（如果需要）
npm install

# 启动开发服务器
npm run dev

# 访问仪表盘
# 打开浏览器访问 http://localhost:3000

# 部署到生产环境
npm run deploy
```

## 功能特性

- ✅ 完全兼容Artalk官方Webhook格式
- ✅ 直接使用notify_body作为消息内容
- ✅ 自动消息长度优化和格式清理
- ✅ 实时服务状态监控仪表盘
- ✅ 自动环境变量检查
- ✅ 一键测试Webhook功能
- ✅ 响应式设计，支持移动端

## API端点

- `POST /webhook` - 接收Artalk Webhook请求
- `GET /api/status` - 获取服务状态信息
- `GET /` - 仪表盘页面

## 请求示例

```json
{
  "notify_subject": "新评论通知",
  "notify_body": "@测试用户:\n\n测试内容\n\nhttps://127.0.0.1/index.html?atk_comment=1057",
  "comment": {
    "id": 1057,
    "content": "测试内容",
    "user_id": 226,
    "nick": "测试用户",
    "email_encrypted": "654236c1e78i4c09a17c4869c9d43910",
    "link": "https://qwqaq.com",
    "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_4_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
    "date": "2022-05-23 17:00:23",
    "is_collapsed": false,
    "is_pending": false,
    "is_pinned": false,
    "is_allow_reply": false,
    "rid": 0,
    "badge_name": "",
    "badge_color": "",
    "visible": true,
    "vote_up": 0,
    "vote_down": 0,
    "page_key": "/index.html",
    "page_url": "https://127.0.0.1/index.html",
    "site_name": "ArtalkDocs"
  },
  "parent_comment": null
}
```

## 响应示例

```json
{
  "success": true,
  "reason": "success"
}
```

## 注意事项

1. QMSG API有频率限制，请合理使用
2. 建议在Vercel中配置环境变量，不要硬编码在代码中
3. 如需增强安全性，可添加Webhook签名验证

## 许可证

MIT