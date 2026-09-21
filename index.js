const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: 'ใส่_CHANNEL_ACCESS_TOKEN_ของคุณ',
  channelSecret: 'ใส่_CHANNEL_SECRET_ของคุณ'
};

const app = express();
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

// หน้าแรกสำหรับเช็คว่าเซิร์ฟเวอร์ทำงานปกติ
app.get('/', (req, res) => {
  res.send('LINE Bot is running!');
});

// รับ Webhook
app.post('/api/webhook', line.middleware(config), async (req, res) => {
  try {
    const events = req.body.events;

    if (!events || events.length === 0) {
      return res.status(200).json({});
    }

    await Promise.all(
      events.map(async (event) => {
        if (event.type === 'message' && event.message.type === 'text') {
          const userText = event.message.text.trim().toLowerCase();

          if (userText === 'sale') {
            await client.replyMessage({
              replyToken: event.replyToken,
              messages: [
                {
                  type: 'flex',
                  altText: 'โปรโมชันพิเศษ Super Sale',
                  contents: {
                    type: 'bubble',
                    hero: {
                      type: 'image',
                      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                      size: 'full',
                      aspectRatio: '20:13',
                      aspectMode: 'cover'
                    },
                    body: {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'text',
                          text: '⚡ ดิลพิเศษ Super Sale',
                          weight: 'bold',
                          size: 'xl',
                          color: '#FF334B'
                        },
                        {
                          type: 'text',
                          text: 'คอร์สเรียนลดสูงสุดทันที 20%',
                          weight: 'bold',
                          size: 'md',
                          margin: 'md'
                        }
                      ]
                    },
                    footer: {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'button',
                          action: {
                            type: 'uri',
                            label: 'รับสิทธิ์เลย',
                            uri: 'https://line.me'
                          },
                          style: 'primary',
                          color: '#06C755'
                        }
                      ]
                    }
                  }
                }
              ]
            });
          }
        }
      })
    );

    return res.status(200).json({});
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
