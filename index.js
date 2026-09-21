const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: 'B8EAmE1jDDO2753uzbdEPBSMedTq5DFp0TjjAd/3SsOfh5jZfY+IVIMWxSoBfdUPvon4Yu7/vjdAVowntV7clW6lrUy9uJPZYJMp66DUGfr0HTZmyvKGoNNKbijez757cTSYTK5CjVAZrauw+5RVrgdB04t89/1O/w1cDnyilFU=', // ใส่ Channel Access Token จาก LINE Developers
  channelSecret: '8824246de8dcc7bd7d04d7c61de1aeef'             // ใส่ Channel Secret
};

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

module.exports = async (req, res) => {
  // LINE จะยิง Verify มาด้วย POST request
  if (req.method !== 'POST') {
    return res.status(200).send('OK');
  }

  try {
    const events = req.body.events;

    // ตรวจสอบกรณี LINE กดปุ่ม Verify (events จะเป็น array ว่าง [])
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
                          text: '⚡ Super Sale ลด 20%',
                          weight: 'bold',
                          size: 'xl'
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
};
