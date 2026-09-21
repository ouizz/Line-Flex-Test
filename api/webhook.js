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

// Route เช็คสถานะการทำงานของเซิร์ฟเวอร์
app.get('/', (req, res) => {
  res.send('LINE Bot Service is online!');
});

// Route รับ Webhook จาก LINE
app.post('/api/webhook', line.middleware(config), async (req, res) => {
  try {
    const events = req.body.events;

    // ตรวจสอบกรณี LINE กดยิง Verify
    if (!events || events.length === 0) {
      return res.status(200).json({});
    }

    await Promise.all(events.map(handleEvent));
    return res.status(200).json({});
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).end();
  }
});

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return null;
  }

  const userText = event.message.text.trim().toLowerCase();
  let flexContents = null;
  let altText = 'ข้อความตอบกลับจากระบบ';

  // 1. แบบ Bubble โปรโมชัน
  if (userText === 'sale') {
    altText = '⚡ ดิลพิเศษ Super Sale';
    flexContents = {
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
            text: 'สมัครพร้อมเพื่อน ลดเพิ่มอีก 500 บาท/ท่าน พร้อมรับสิทธิ์พิเศษทันที',
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
              label: 'รับสิทธิ์โปรโมชัน',
              uri: 'https://line.me'
            },
            style: 'primary',
            color: '#06C755'
          }
        ]
      }
    };
  }

  // 2. แบบ Receipt / ใบเสร็จ
  else if (userText === 'bill') {
    altText = 'ใบเสร็จรับเงินคำสั่งซื้อ #OD-94821';
    flexContents = {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: 'ใบเสร็จรับเงิน', weight: 'bold', color: '#1DB446', size: 'sm' },
          { type: 'text', text: '฿850.00', weight: 'bold', size: 'xxl', margin: 'md' },
          { type: 'text', text: 'หมายเลขคำสั่งซื้อ #OD-94821', size: 'xs', color: '#aaaaaa', wrap: true },
          { type: 'separator', margin: 'xxl' },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'xxl',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'เสื้อยืด Oversize (ขาว)', size: 'sm', color: '#555555', flex: 0 },
                  { type: 'text', text: '฿450', size: 'sm', color: '#111111', align: 'end' }
                ]
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'หมวกแก๊ป Minimal', size: 'sm', color: '#555555', flex: 0 },
                  { type: 'text', text: '฿350', size: 'sm', color: '#111111', align: 'end' }
                ]
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'ค่าจัดส่งด่วน', size: 'sm', color: '#555555', flex: 0 },
                  { type: 'text', text: '฿50', size: 'sm', color: '#111111', align: 'end' }
                ]
              }
            ]
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            action: { type: 'uri', label: 'ดูหลักฐานการโอน', uri: 'https://line.me' },
            style: 'secondary'
          }
        ]
      }
    };
  }

  // 3. แบบฝังวิดีโอ (Video Hero)
  else if (userText === 'vdo') {
    altText = 'วิดีโอแนะนำหลักสูตร';
    flexContents = {
      type: 'bubble',
      hero: {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        previewUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=600',
        altContent: {
          type: 'image',
          size: 'full',
          aspectRatio: '16:9',
          aspectMode: 'cover',
          url: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=600'
        },
        aspectRatio: '16:9'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: 'วิดีโอแนะนำสินค้าและบริการ', weight: 'bold', size: 'lg' },
          {
            type: 'text',
            text: 'สามารถกดเล่นวิดีโอจากในแชทได้โดยตรง รองรับภาพปกและการแสดงผลแบบ HD',
            size: 'sm',
            color: '#666666',
            wrap: true,
            margin: 'sm'
          }
        ]
      }
    };
  }

  // 4. แบบ Carousel สไลด์รายการสินค้า
  else if (userText === 'shop') {
    altText = 'รายการสินค้าแนะนำ';
    flexContents = {
      type: 'carousel',
      contents: [
        {
          type: 'bubble',
          hero: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
            size: 'full',
            aspectRatio: '1:1',
            aspectMode: 'cover'
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              { type: 'text', text: 'Smart Watch Series 9', weight: 'bold', size: 'md' },
              { type: 'text', text: '฿9,900', size: 'sm', color: '#06C755', weight: 'bold', margin: 'xs' }
            ]
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                action: { type: 'message', label: 'สนใจนาฬิกา', text: 'สั่งซื้อ นาฬิกา' },
                style: 'primary',
                height: 'sm',
                color: '#06C755'
              }
            ]
          }
        },
        {
          type: 'bubble',
          hero: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
            size: 'full',
            aspectRatio: '1:1',
            aspectMode: 'cover'
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              { type: 'text', text: 'Headphone Wireless Pro', weight: 'bold', size: 'md' },
              { type: 'text', text: '฿4,500', size: 'sm', color: '#06C755', weight: 'bold', margin: 'xs' }
            ]
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                action: { type: 'message', label: 'สนใจหูฟัง', text: 'สั่งซื้อ หูฟัง' },
                style: 'primary',
                height: 'sm',
                color: '#06C755'
              }
            ]
          }
        }
      ]
    };
  }

  // 5. แบบเมนูปุ่มกดตาราง (Menu Grid)
  else if (userText === 'menu') {
    altText = 'ศูนย์บริการลูกค้า';
    flexContents = {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: 'ศูนย์บริการลูกค้า', weight: 'bold', size: 'lg', align: 'center' },
          { type: 'text', text: 'กรุณาเลือกบริการที่ต้องการทำรายการ', size: 'xs', color: '#aaaaaa', align: 'center', margin: 'xs' },
          {
            type: 'box',
            layout: 'horizontal',
            margin: 'xl',
            spacing: 'md',
            contents: [
              {
                type: 'button',
                action: { type: 'message', label: '📦 เช็คพัสดุ', text: 'เช็คพัสดุ' },
                style: 'secondary'
              },
              {
                type: 'button',
                action: { type: 'message', label: '💳 ชำระเงิน', text: 'bill' },
                style: 'secondary'
              }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            margin: 'md',
            spacing: 'md',
            contents: [
              {
                type: 'button',
                action: { type: 'uri', label: '🌐 เว็บไซต์', uri: 'https://line.me' },
                style: 'secondary'
              },
              {
                type: 'button',
                action: { type: 'message', label: '📞 ติดต่อ จนท.', text: 'ติดต่อเจ้าหน้าที่' },
                style: 'secondary'
              }
            ]
          }
        ]
      }
    };
  }

  // หากตรงกับคำสั่งที่กำหนดไว้ ให้ตอบกลับด้วย Flex Message
  if (flexContents) {
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: 'flex',
          altText: altText,
          contents: flexContents
        }
      ]
    });
  }

  return null;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
