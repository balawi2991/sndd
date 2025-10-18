/**
 * Seed Demo Data Script
 * Adds sample training materials and indexes them
 */

const { Client } = require('pg');
require('dotenv').config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

const demoMaterials = [
  {
    type: 'text',
    title: 'دليل البدء السريع',
    content: `
مرحباً بك في Sanad - منصة الذكاء الاصطناعي المتقدمة!

## ما هو Sanad؟
Sanad هو نظام ذكاء اصطناعي متطور يمكنه الإجابة على أسئلتك بناءً على المواد التدريبية التي تضيفها.

## كيف يعمل؟
1. أضف مواد تدريبية (ملفات، روابط، نصوص)
2. سيتم فهرسة المحتوى تلقائياً
3. اطرح أسئلتك في الـ Widget
4. سيجيب الذكاء الاصطناعي بناءً على المحتوى المفهرس

## المميزات:
- ✅ ردود فورية ودقيقة
- ✅ مصادر موثقة لكل إجابة
- ✅ دعم اللغة العربية والإنجليزية
- ✅ واجهة سهلة الاستخدام
- ✅ قابل للتخصيص بالكامل

## البدء:
1. اذهب إلى صفحة Training Materials
2. أضف محتوى خاص بك
3. جرب الـ Widget في صفحة Try My Agent
4. خصص المظهر في صفحة Appearance
    `.trim()
  },
  {
    type: 'text',
    title: 'الأسئلة الشائعة',
    content: `
# الأسئلة الشائعة (FAQ)

## كيف أضيف مواد تدريبية؟
يمكنك إضافة مواد تدريبية بثلاث طرق:
1. رفع ملفات (PDF, DOCX, TXT)
2. إضافة روابط لصفحات ويب
3. كتابة نص مباشرة

## كم من الوقت تستغرق الفهرسة؟
الفهرسة تتم تلقائياً وتستغرق عادة من 10 ثوانٍ إلى دقيقة واحدة حسب حجم المحتوى.

## هل يدعم النظام اللغة العربية؟
نعم! النظام يدعم اللغة العربية بشكل كامل ويمكنه فهم والرد على الأسئلة بالعربية.

## كم عدد المواد التي يمكنني إضافتها؟
يمكنك إضافة عدد غير محدود من المواد التدريبية.

## هل يمكنني تخصيص مظهر الـ Widget؟
نعم! يمكنك تخصيص:
- الألوان
- الشعار
- الصورة الرمزية
- النصوص
- الأسئلة المقترحة

## كيف أدمج الـ Widget في موقعي؟
1. اذهب إلى صفحة Embed
2. انسخ الكود
3. ألصقه قبل وسم </body> في موقعك
    `.trim()
  },
  {
    type: 'text',
    title: 'خطط الأسعار',
    content: `
# خطط الأسعار

## الخطة المجانية (Free)
- ✅ 100 رسالة شهرياً
- ✅ 5 مواد تدريبية
- ✅ Widget واحد
- ✅ دعم عبر البريد الإلكتروني

السعر: مجاناً

## خطة المحترفين (Pro)
- ✅ 1,000 رسالة شهرياً
- ✅ 50 مادة تدريبية
- ✅ 3 Widgets
- ✅ تخصيص كامل
- ✅ دعم ذو أولوية
- ✅ تحليلات متقدمة

السعر: $29/شهرياً

## خطة الأعمال (Business)
- ✅ 10,000 رسالة شهرياً
- ✅ مواد تدريبية غير محدودة
- ✅ Widgets غير محدودة
- ✅ API Access
- ✅ دعم 24/7
- ✅ مدير حساب مخصص
- ✅ تدريب مخصص

السعر: $99/شهرياً

## خطة المؤسسات (Enterprise)
- ✅ رسائل غير محدودة
- ✅ كل مميزات Business
- ✅ نشر خاص (On-premise)
- ✅ SLA مضمون
- ✅ تكامل مخصص
- ✅ دعم فني مخصص

السعر: تواصل معنا
    `.trim()
  }
];

async function seedDemoData() {
  log('\n🌱 Starting Demo Data Seeding...', 'cyan');

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    log('❌ DATABASE_URL not found', 'red');
    process.exit(1);
  }

  const client = new Client({ connectionString: dbUrl });

  try {
    await client.connect();
    log('✅ Connected to database', 'green');

    // Get or create demo user
    log('\n👤 Checking demo user...', 'yellow');
    const userResult = await client.query(
      `SELECT id FROM users WHERE email = 'demo@sanad.com'`
    );

    let userId;
    if (userResult.rows.length === 0) {
      log('📝 Creating demo user...', 'yellow');
      const newUser = await client.query(`
        INSERT INTO users (id, email, name)
        VALUES ('demo-user-id', 'demo@sanad.com', 'Demo User')
        RETURNING id
      `);
      userId = newUser.rows[0].id;
      log('✅ Demo user created', 'green');
    } else {
      userId = userResult.rows[0].id;
      log('✅ Demo user exists', 'green');
    }

    // Add training materials
    log('\n📚 Adding training materials...', 'yellow');
    
    for (const material of demoMaterials) {
      // Check if material already exists
      const existing = await client.query(
        `SELECT id FROM training_materials WHERE user_id = $1 AND title = $2`,
        [userId, material.title]
      );

      if (existing.rows.length === 0) {
        const result = await client.query(`
          INSERT INTO training_materials (user_id, type, title, content)
          VALUES ($1, $2, $3, $4)
          RETURNING id
        `, [userId, material.type, material.title, material.content]);

        log(`   ✅ Added: ${material.title}`, 'green');
      } else {
        log(`   ⏭️  Skipped (exists): ${material.title}`, 'yellow');
      }
    }

    // Count materials
    const count = await client.query(
      `SELECT COUNT(*) as count FROM training_materials WHERE user_id = $1`,
      [userId]
    );

    log(`\n✅ Total materials: ${count.rows[0].count}`, 'green');

    await client.end();

    log('\n🎉 Demo data seeded successfully!', 'green');
    log('\n📝 Next steps:', 'cyan');
    log('   1. Run indexing script to index materials');
    log('   2. Or use the API to index them');
    log('   3. Start the server: npm run dev');
    log('');

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

seedDemoData();
