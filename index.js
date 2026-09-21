const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: 'B8EAmE1jDDO2753uzbdEPBSMedTq5DFp0TjjAd/3SsOfh5jZfY+IVIMWxSoBfdUPvon4Yu7/vjdAVowntV7clW6lrUy9uJPZYJMp66DUGfr0HTZmyvKGoNNKbijez757cTSYTK5CjVAZrauw+5RVrgdB04t89/1O/w1cDnyilFU=', // ใส่ Channel Access Token จาก LINE Developers
  channelSecret: '8824246de8dcc7bd7d04d7c61de1aeef'             // ใส่ Channel Secret
};

const app = express();
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

// Endpoint รับ Webhook จาก LINE
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

async function handleEvent(event) {
  // เช็คว่าเป็นข้อความตัวอักษรหรือไม่
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userText = event.message.text.trim().toLowerCase();

  // ตรวจสอบคีย์เวิร์ด (เช่น ลูกค้ากดปุ่ม Rich Menu ที่ส่งคำว่า 'sale')
  if (userText === 'sale') {
    const flexMessage = {
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
            },
            {
              type: 'text',
              text: 'สมัครพร้อมเพื่อน ลดเพิ่มอีก 500 บาท/ท่าน พร้อมฟรีค่าแรกเข้าและอุปกรณ์พื้นฐาน',
              size: 'sm',
              color: '#666666',
              wrap: true,
              margin: 'sm'
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
                label: 'สมัครโปรโมชันนี้',
                uri: 'https://line.me'
              },
              style: 'primary',
              color: '#06C755'
            }
          ]
        }
      }
    };

    // ใช้ replyToken ตอบกลับทันที (ฟรี ไม่เสียโควตาข้อความ)
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [flexMessage]
    });
  }

  return Promise.resolve(null);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});