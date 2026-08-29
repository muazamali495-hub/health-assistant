'use strict';

/**
 * OTC-only medicine reference.
 *
 * Hard rules baked into this file:
 *  - No antibiotics, no oral steroids, no controlled or prescription-only
 *    drugs are ever suggested by this assistant.
 *  - Doses are ADULT self-care doses only. Anything for a child, a pregnant
 *    or breastfeeding person, or a chronic-disease patient is routed to
 *    "ask a doctor or pharmacist".
 *  - Brand names are common Pakistani brands, listed only so the user can
 *    recognise the product at a pharmacy. The generic name is primary.
 */

const MEDICINES = {
  paracetamol: {
    generic: 'Paracetamol (Acetaminophen)',
    generic_ur: 'پیراسیٹامول',
    brands: ['Panadol', 'Calpol', 'Provas', 'Febrol'],
    form: 'Tablet 500 mg / syrup',
    adultDose: '500-1000 mg every 6 hours as needed.',
    adultDose_ur: 'ایک سے دو گولی (500 تا 1000 ملی گرام) ہر 6 گھنٹے بعد، ضرورت کے مطابق۔',
    maxDaily: 'Do not exceed 3000 mg (six 500 mg tablets) in 24 hours.',
    maxDaily_ur: '24 گھنٹے میں 3000 ملی گرام (500 ملی گرام کی 6 گولیوں) سے زیادہ نہ لیں۔',
    cautions: [
      'Avoid alcohol. Not safe in liver disease.',
      'Check your other medicines - many cold and flu combinations already contain paracetamol.'
    ],
    cautions_ur: [
      'شراب کے ساتھ نہ لیں۔ جگر کی بیماری میں محفوظ نہیں۔',
      'زکام اور فلو کی بہت سی مرکب دوائیوں میں پہلے ہی پیراسیٹامول ہوتا ہے، دوہری خوراک سے بچیں۔'
    ]
  },

  ibuprofen: {
    generic: 'Ibuprofen',
    generic_ur: 'آئبوپروفین',
    brands: ['Brufen', 'Ibucin', 'Nurofen'],
    form: 'Tablet 200 / 400 mg',
    adultDose: '200-400 mg every 6-8 hours, always after food.',
    adultDose_ur: '200 تا 400 ملی گرام ہر 6 تا 8 گھنٹے بعد، ہمیشہ کھانے کے بعد۔',
    maxDaily: 'Do not exceed 1200 mg in 24 hours without medical advice. Use for 3 days at most.',
    maxDaily_ur: 'ڈاکٹر کے مشورے کے بغیر 24 گھنٹے میں 1200 ملی گرام سے زیادہ نہ لیں۔ زیادہ سے زیادہ 3 دن۔',
    cautions: [
      'Never take on an empty stomach.',
      'Avoid if you have a stomach ulcer, kidney disease, painkiller-triggered asthma, or are pregnant.',
      'Do NOT use if dengue is suspected - it increases bleeding risk. Use paracetamol instead.'
    ],
    cautions_ur: [
      'خالی پیٹ ہرگز نہ لیں۔',
      'معدے کے السر، گردے کی بیماری، دمہ، یا حمل کی صورت میں نہ لیں۔',
      'ڈینگی کے شبے میں ہرگز نہ لیں، خون بہنے کا خطرہ بڑھتا ہے۔ اس کی جگہ پیراسیٹامول لیں۔'
    ]
  },

  ors: {
    generic: 'Oral Rehydration Salts (ORS)',
    generic_ur: 'او آر ایس (نمکول)',
    brands: ['ORS sachet', 'Peditral', 'Nimkol'],
    form: 'Sachet dissolved in 1 litre of clean water',
    adultDose: 'Sip 200-400 ml after every loose motion or vomit, and keep sipping through the day.',
    adultDose_ur: 'ہر پتلے پاخانے یا الٹی کے بعد 200 تا 400 ملی لیٹر گھونٹ گھونٹ پئیں، اور دن بھر پیتے رہیں۔',
    maxDaily: 'No strict limit - dehydration is the bigger danger.',
    maxDaily_ur: 'کوئی سخت حد نہیں، پانی کی کمی زیادہ خطرناک ہے۔',
    cautions: [
      'Make it with clean or boiled water and finish it within 24 hours.',
      'Do not add extra sugar or salt.'
    ],
    cautions_ur: [
      'صاف یا ابلے ہوئے پانی میں بنائیں اور 24 گھنٹے میں ختم کر دیں۔',
      'اس میں اضافی چینی یا نمک نہ ڈالیں۔'
    ]
  },

  cetirizine: {
    generic: 'Cetirizine',
    generic_ur: 'سیٹریزین',
    brands: ['Rigix', 'Zyrtec', 'Cetrizine'],
    form: 'Tablet 10 mg',
    adultDose: '10 mg once daily, preferably at night.',
    adultDose_ur: '10 ملی گرام دن میں ایک بار، ترجیحاً رات کو۔',
    maxDaily: '10 mg in 24 hours.',
    maxDaily_ur: '24 گھنٹے میں 10 ملی گرام۔',
    cautions: [
      'Causes drowsiness - do not drive or operate machinery after taking it.',
      'Avoid alcohol.'
    ],
    cautions_ur: [
      'نیند آتی ہے، لینے کے بعد ڈرائیونگ یا مشینری نہ چلائیں۔',
      'شراب سے پرہیز کریں۔'
    ]
  },

  loratadine: {
    generic: 'Loratadine',
    generic_ur: 'لوریٹاڈین',
    brands: ['Softin', 'Claritin'],
    form: 'Tablet 10 mg',
    adultDose: '10 mg once daily.',
    adultDose_ur: '10 ملی گرام دن میں ایک بار۔',
    maxDaily: '10 mg in 24 hours.',
    maxDaily_ur: '24 گھنٹے میں 10 ملی گرام۔',
    cautions: ['Non-drowsy alternative to cetirizine - better if you have to work or study.'],
    cautions_ur: ['سیٹریزین کے مقابلے میں نیند نہیں لاتی، کام یا پڑھائی کے دوران بہتر ہے۔']
  },

  antacid: {
    generic: 'Antacid (magnesium + aluminium hydroxide)',
    generic_ur: 'اینٹی ایسڈ (معدے کا شربت)',
    brands: ['Mucaine', 'Gaviscon', 'Digene'],
    form: 'Suspension / chewable tablet',
    adultDose: '10 ml (or 1-2 chewable tablets) 30 minutes after meals and at bedtime.',
    adultDose_ur: '10 ملی لیٹر (یا 1 تا 2 چبانے والی گولی) کھانے کے 30 منٹ بعد اور سوتے وقت۔',
    maxDaily: 'Up to 4 doses a day, for a few days only.',
    maxDaily_ur: 'دن میں زیادہ سے زیادہ 4 خوراکیں، صرف چند دن کے لیے۔',
    cautions: [
      'Take at least 2 hours apart from other medicines - it blocks their absorption.',
      'Can cause loose motions (magnesium) or constipation (aluminium).'
    ],
    cautions_ur: [
      'دوسری دوائیوں سے کم از کم 2 گھنٹے کا وقفہ رکھیں۔',
      'پتلے پاخانے یا قبض کر سکتی ہے۔'
    ]
  },

  omeprazole: {
    generic: 'Omeprazole / Esomeprazole (acid blocker)',
    generic_ur: 'اومیپرازول یا ایسومیپرازول',
    brands: ['Risek', 'Nexum', 'Omega'],
    form: 'Capsule 20 mg',
    adultDose: '20 mg once daily, 30 minutes before breakfast.',
    adultDose_ur: '20 ملی گرام دن میں ایک بار، ناشتے سے 30 منٹ پہلے۔',
    maxDaily: 'Self-treat for 14 days at most. If symptoms persist, see a doctor.',
    maxDaily_ur: 'خود سے زیادہ سے زیادہ 14 دن۔ اس کے بعد بھی تکلیف ہو تو ڈاکٹر سے رجوع کریں۔',
    cautions: [
      'Long-term unsupervised use affects calcium, magnesium and vitamin B12 levels.',
      'Not a rescue medicine - it takes 1-3 days to work fully.'
    ],
    cautions_ur: [
      'لمبے عرصے تک بغیر نگرانی استعمال نقصان دہ ہے۔',
      'فوری آرام کی دوا نہیں، پورا اثر 1 تا 3 دن میں ہوتا ہے۔'
    ]
  },

  loperamide: {
    generic: 'Loperamide',
    generic_ur: 'لوپرامائیڈ',
    brands: ['Imodium'],
    form: 'Capsule 2 mg',
    adultDose: '2 mg after the first loose stool, then 2 mg after each further loose stool.',
    adultDose_ur: 'پہلے پتلے پاخانے کے بعد 2 ملی گرام، پھر ہر پتلے پاخانے کے بعد 2 ملی گرام۔',
    maxDaily: 'Maximum 8 mg in 24 hours for self-care, and 2 days at most.',
    maxDaily_ur: '24 گھنٹے میں زیادہ سے زیادہ 8 ملی گرام، اور زیادہ سے زیادہ 2 دن۔',
    cautions: [
      'Do NOT use if there is blood in the stool, high fever, or severe abdominal pain - it traps the infection.',
      'Not for children. Rehydrating with ORS matters far more than stopping the motions.'
    ],
    cautions_ur: [
      'پاخانے میں خون، تیز بخار یا شدید پیٹ درد ہو تو ہرگز نہ لیں۔',
      'بچوں کے لیے نہیں۔ پاخانہ روکنے سے زیادہ اہم او آر ایس سے پانی کی کمی پوری کرنا ہے۔'
    ]
  },

  hyoscine: {
    generic: 'Hyoscine butylbromide (antispasmodic)',
    generic_ur: 'ہائیوسین بیوٹائل برومائیڈ',
    brands: ['Buscopan'],
    form: 'Tablet 10 mg',
    adultDose: '10 mg up to 3 times a day for cramping abdominal or period pain.',
    adultDose_ur: 'مروڑ یا ماہواری کے درد کے لیے 10 ملی گرام دن میں تین بار تک۔',
    maxDaily: '60 mg in 24 hours; stop after 2-3 days.',
    maxDaily_ur: '24 گھنٹے میں 60 ملی گرام، 2 تا 3 دن بعد بند کر دیں۔',
    cautions: ['Avoid in glaucoma, prostate enlargement, or severe constipation.'],
    cautions_ur: ['گلوکوما، پروسٹیٹ کے مسئلے یا شدید قبض میں نہ لیں۔']
  },

  ispaghula: {
    generic: 'Ispaghula husk (psyllium fibre)',
    generic_ur: 'اسپغول کا چھلکا',
    brands: ['Fybogel', 'Ispaghol husk'],
    form: 'Powder / sachet',
    adultDose: 'One heaped teaspoon in a full glass of water, once or twice daily.',
    adultDose_ur: 'ایک بھری چمچ ایک پورے گلاس پانی میں، دن میں ایک یا دو بار۔',
    maxDaily: 'Twice daily.',
    maxDaily_ur: 'دن میں دو بار۔',
    cautions: [
      'Must be taken with plenty of water, otherwise it makes constipation worse.',
      'Do not take right before lying down.'
    ],
    cautions_ur: [
      'کافی پانی کے ساتھ لینا ضروری ہے، ورنہ قبض بڑھ سکتی ہے۔',
      'لیٹنے سے فوراً پہلے نہ لیں۔'
    ]
  },

  lactulose: {
    generic: 'Lactulose',
    generic_ur: 'لیکٹولوز',
    brands: ['Duphalac', 'Lilac'],
    form: 'Syrup',
    adultDose: '15 ml at bedtime for constipation.',
    adultDose_ur: 'قبض کے لیے رات کو سوتے وقت 15 ملی لیٹر۔',
    maxDaily: 'Up to 30 ml a day; the effect appears after 1-2 days.',
    maxDaily_ur: 'دن میں 30 ملی لیٹر تک، اثر 1 تا 2 دن میں ہوتا ہے۔',
    cautions: ['Can cause gas and bloating in the first few days.'],
    cautions_ur: ['شروع کے دنوں میں گیس اور پیٹ پھولنے کا سبب بن سکتی ہے۔']
  },

  salineSpray: {
    generic: 'Saline nasal spray / steam inhalation',
    generic_ur: 'نمکین پانی کا ناک سپرے اور بھاپ',
    brands: ['Normal saline nasal drops'],
    form: 'Spray / drops / steam',
    adultDose: 'Two sprays in each nostril 3-4 times a day; steam inhalation 2-3 times a day.',
    adultDose_ur: 'ہر نتھنے میں 2 سپرے دن میں 3 تا 4 بار، اور بھاپ دن میں 2 تا 3 بار۔',
    maxDaily: 'Safe to repeat as needed.',
    maxDaily_ur: 'ضرورت کے مطابق دہرا سکتے ہیں، محفوظ ہے۔',
    cautions: ['Completely safe - try this before reaching for a decongestant spray.'],
    cautions_ur: ['مکمل محفوظ، ڈی کنجسٹنٹ سپرے سے پہلے یہی استعمال کریں۔']
  },

  xylometazoline: {
    generic: 'Xylometazoline nasal spray (decongestant)',
    generic_ur: 'زائلومیٹازولین ناک سپرے',
    brands: ['Otrivin', 'Nazol'],
    form: 'Nasal spray 0.1%',
    adultDose: 'One spray in each nostril, up to 3 times a day.',
    adultDose_ur: 'ہر نتھنے میں ایک سپرے، دن میں 3 بار تک۔',
    maxDaily: 'MAXIMUM 3-5 days in total.',
    maxDaily_ur: 'زیادہ سے زیادہ 3 تا 5 دن۔',
    cautions: [
      'Using it beyond 5 days causes rebound blockage worse than the original problem.',
      'Avoid in high blood pressure and heart disease.'
    ],
    cautions_ur: [
      '5 دن سے زیادہ استعمال سے ناک پہلے سے زیادہ بند ہو جاتی ہے۔',
      'بلڈ پریشر یا دل کے مریض استعمال نہ کریں۔'
    ]
  },

  gargle: {
    generic: 'Salt-water gargle / povidone-iodine gargle',
    generic_ur: 'نمک ملے پانی کے غرارے',
    brands: ['Plain salt water', 'Betadine gargle'],
    form: 'Gargle',
    adultDose: 'Half a teaspoon of salt in a glass of warm water, gargle 3-4 times a day.',
    adultDose_ur: 'ایک گلاس نیم گرم پانی میں آدھا چمچ نمک، دن میں 3 تا 4 بار غرارے کریں۔',
    maxDaily: 'As needed.',
    maxDaily_ur: 'ضرورت کے مطابق۔',
    cautions: ['Do not swallow. Iodine gargles are not for pregnancy or thyroid disease.'],
    cautions_ur: ['نگلیں نہیں۔ آیوڈین والے غرارے حمل یا تھائیرائیڈ کے مریضوں کے لیے نہیں۔']
  },

  lozenge: {
    generic: 'Throat lozenges (benzydamine / menthol)',
    generic_ur: 'گلے کی گولیاں',
    brands: ['Strepsils', 'Difflam'],
    form: 'Lozenge / throat spray',
    adultDose: 'One lozenge every 2-3 hours as needed.',
    adultDose_ur: 'ضرورت کے مطابق ہر 2 تا 3 گھنٹے بعد ایک گولی۔',
    maxDaily: 'Up to 8 in a day.',
    maxDaily_ur: 'دن میں 8 تک۔',
    cautions: ['Relieves pain only - it does not treat an infection.'],
    cautions_ur: ['صرف درد میں آرام دیتی ہے، انفیکشن کا علاج نہیں۔']
  },

  honeyLemon: {
    generic: 'Honey in warm water (cough soother)',
    generic_ur: 'شہد اور نیم گرم پانی',
    brands: ['-'],
    form: 'Home remedy',
    adultDose: '1-2 teaspoons of honey in warm water, 2-3 times a day and at bedtime.',
    adultDose_ur: '1 تا 2 چمچ شہد نیم گرم پانی میں، دن میں 2 تا 3 بار اور سوتے وقت۔',
    maxDaily: 'As needed.',
    maxDaily_ur: 'ضرورت کے مطابق۔',
    cautions: ['NEVER give honey to a baby under 1 year. Take care if you are diabetic.'],
    cautions_ur: ['ایک سال سے چھوٹے بچے کو شہد ہرگز نہ دیں۔ ذیابیطس میں احتیاط کریں۔']
  },

  guaifenesin: {
    generic: 'Guaifenesin (expectorant cough syrup)',
    generic_ur: 'گوائفینیسن (بلغم نکالنے والا شربت)',
    brands: ['Mucolator', 'Robitussin expectorant'],
    form: 'Syrup',
    adultDose: '10 ml every 6-8 hours for a chesty, productive cough.',
    adultDose_ur: 'بلغم والی کھانسی کے لیے 10 ملی لیٹر ہر 6 تا 8 گھنٹے بعد۔',
    maxDaily: 'Four doses a day, for up to 5 days.',
    maxDaily_ur: 'دن میں 4 خوراکیں، زیادہ سے زیادہ 5 دن۔',
    cautions: [
      'Drink plenty of water with it - that is what actually loosens the mucus.',
      'Do not combine it with a cough-suppressant syrup at the same time.'
    ],
    cautions_ur: [
      'ساتھ زیادہ پانی پئیں، بلغم اسی سے پتلا ہوتا ہے۔',
      'کھانسی روکنے والے شربت کے ساتھ نہ ملائیں۔'
    ]
  },

  menthol: {
    generic: 'Menthol / eucalyptus chest rub',
    generic_ur: 'مینتھول بام (سینے پر ملنے والا)',
    brands: ['Vicks VapoRub'],
    form: 'Ointment',
    adultDose: 'Rub on the chest and back at bedtime.',
    adultDose_ur: 'رات کو سوتے وقت سینے اور کمر پر مالش کریں۔',
    maxDaily: 'Twice daily.',
    maxDaily_ur: 'دن میں دو بار۔',
    cautions: ['External use only. Never apply inside the nostrils or on broken skin.'],
    cautions_ur: ['صرف بیرونی استعمال۔ نتھنوں کے اندر یا زخم پر نہ لگائیں۔']
  },

  diclofenacGel: {
    generic: 'Diclofenac topical gel',
    generic_ur: 'ڈائیکلوفیناک جیل',
    brands: ['Voltral gel', 'Dicloran gel'],
    form: 'Gel 1%',
    adultDose: 'Apply a thin layer to the painful area 3-4 times a day and rub it in.',
    adultDose_ur: 'درد والی جگہ پر دن میں 3 تا 4 بار پتلی تہہ لگا کر مالش کریں۔',
    maxDaily: 'Four applications a day, up to 7 days.',
    maxDaily_ur: 'دن میں 4 بار، زیادہ سے زیادہ 7 دن۔',
    cautions: ['Do not apply on broken skin. Wash hands after use. Avoid in pregnancy.'],
    cautions_ur: ['زخمی جلد پر نہ لگائیں۔ استعمال کے بعد ہاتھ دھوئیں۔ حمل میں استعمال نہ کریں۔']
  },

  calamine: {
    generic: 'Calamine lotion',
    generic_ur: 'کالامائن لوشن',
    brands: ['Calamine lotion'],
    form: 'Lotion',
    adultDose: 'Apply to itchy areas 2-3 times a day.',
    adultDose_ur: 'خارش والی جگہ پر دن میں 2 تا 3 بار لگائیں۔',
    maxDaily: 'As needed.',
    maxDaily_ur: 'ضرورت کے مطابق۔',
    cautions: ['Soothing and safe. Stop if the rash spreads or blisters.'],
    cautions_ur: ['محفوظ ہے۔ اگر خارش پھیلے یا آبلے بنیں تو بند کر دیں۔']
  },

  hydrocortisone: {
    generic: 'Hydrocortisone 1% cream',
    generic_ur: 'ہائیڈروکورٹیزون 1 فیصد کریم',
    brands: ['Hydrocort 1%'],
    form: 'Cream',
    adultDose: 'A thin layer on the affected patch, twice a day.',
    adultDose_ur: 'متاثرہ جگہ پر دن میں دو بار پتلی تہہ۔',
    maxDaily: 'Maximum 7 days. Never on the face for more than 3 days.',
    maxDaily_ur: 'زیادہ سے زیادہ 7 دن۔ چہرے پر 3 دن سے زیادہ ہرگز نہیں۔',
    cautions: [
      'Do not use on a fungal infection, an open wound, or infected skin - it makes them worse.',
      'Avoid the face, groin and armpits unless a doctor advises it.'
    ],
    cautions_ur: [
      'فنگل انفیکشن، کھلے زخم یا انفیکشن والی جلد پر نہ لگائیں، حالت بگڑ جاتی ہے۔',
      'چہرے اور نازک حصوں پر ڈاکٹر کے مشورے کے بغیر نہ لگائیں۔'
    ]
  },

  clotrimazole: {
    generic: 'Clotrimazole 1% antifungal cream',
    generic_ur: 'کلوٹریمازول اینٹی فنگل کریم',
    brands: ['Canesten', 'Candid'],
    form: 'Cream',
    adultDose: 'Apply twice daily, covering 2 cm beyond the edge of the patch.',
    adultDose_ur: 'دن میں دو بار لگائیں، دھبے کے کنارے سے 2 سینٹی میٹر آگے تک۔',
    maxDaily: 'Continue for 1-2 weeks AFTER the rash clears, up to 4 weeks in total.',
    maxDaily_ur: 'دھبہ ٹھیک ہونے کے بعد بھی 1 تا 2 ہفتے جاری رکھیں، کل 4 ہفتے تک۔',
    cautions: ['Keep the area dry, wear loose cotton clothing, and do not share towels.'],
    cautions_ur: ['جگہ کو خشک رکھیں، ڈھیلے سوتی کپڑے پہنیں اور تولیہ کسی کے ساتھ شیئر نہ کریں۔']
  },

  dimenhydrinate: {
    generic: 'Dimenhydrinate / Meclizine',
    generic_ur: 'ڈائمن ہائیڈرینیٹ (گریوینیٹ)',
    brands: ['Gravinate', 'Travamin'],
    form: 'Tablet 50 mg',
    adultDose: '50 mg 30-60 minutes before travel; may repeat every 6-8 hours.',
    adultDose_ur: 'سفر سے 30 تا 60 منٹ پہلے 50 ملی گرام، ہر 6 تا 8 گھنٹے بعد دہرا سکتے ہیں۔',
    maxDaily: '200 mg in 24 hours.',
    maxDaily_ur: '24 گھنٹے میں 200 ملی گرام۔',
    cautions: ['Strong drowsiness - do not drive. Avoid in glaucoma and asthma.'],
    cautions_ur: ['شدید نیند آتی ہے، ڈرائیونگ نہ کریں۔ گلوکوما اور دمہ میں نہ لیں۔']
  },

  oralGel: {
    generic: 'Oral analgesic gel (for mouth ulcers)',
    generic_ur: 'منہ کے چھالوں کی جیل',
    brands: ['Bonjela', 'Orasel'],
    form: 'Oral gel',
    adultDose: 'Dab on the ulcer up to 4 times a day.',
    adultDose_ur: 'چھالے پر دن میں 4 بار تک لگائیں۔',
    maxDaily: 'Four applications a day.',
    maxDaily_ur: 'دن میں 4 بار۔',
    cautions: ['Not for children under 16. Avoid eating for 30 minutes after applying.'],
    cautions_ur: ['16 سال سے کم عمر بچوں کے لیے نہیں۔ لگانے کے بعد 30 منٹ کچھ نہ کھائیں۔']
  },

  artificialTears: {
    generic: 'Lubricating eye drops (artificial tears)',
    generic_ur: 'آنکھوں کے چکنے قطرے',
    brands: ['Refresh Tears', 'Tears Naturale'],
    form: 'Eye drops',
    adultDose: 'One drop in each eye 3-4 times a day.',
    adultDose_ur: 'ہر آنکھ میں ایک قطرہ، دن میں 3 تا 4 بار۔',
    maxDaily: 'Can be used as often as needed.',
    maxDaily_ur: 'ضرورت کے مطابق بار بار استعمال کر سکتے ہیں۔',
    cautions: [
      'Never use drops containing steroids or antibiotics without an eye specialist.',
      'Discard the bottle one month after opening.'
    ],
    cautions_ur: [
      'اسٹیرائیڈ یا اینٹی بائیوٹک والے قطرے آنکھوں کے ڈاکٹر کے بغیر ہرگز نہ ڈالیں۔',
      'کھولنے کے ایک ماہ بعد بوتل پھینک دیں۔'
    ]
  },

  antiseptic: {
    generic: 'Antiseptic solution + clean dressing',
    generic_ur: 'اینٹی سیپٹک محلول اور صاف پٹی',
    brands: ['Pyodine', 'Betadine'],
    form: 'Solution',
    adultDose: 'Wash the wound under clean running water, pat dry, apply, then cover with a clean dressing.',
    adultDose_ur: 'زخم کو صاف بہتے پانی سے دھوئیں، خشک کریں، لگائیں اور صاف پٹی باندھیں۔',
    maxDaily: 'Change the dressing once daily, or whenever it gets wet or dirty.',
    maxDaily_ur: 'پٹی روزانہ، یا گیلی یا گندی ہونے پر بدلیں۔',
    cautions: [
      'A deep, dirty, or animal-bite wound needs a doctor and a tetanus shot - not just antiseptic.',
      'Never put toothpaste, ash, or cooking oil on a wound or a burn.'
    ],
    cautions_ur: [
      'گہرا، گندا یا جانور کے کاٹنے کا زخم ہو تو ڈاکٹر اور ٹیٹنس انجیکشن ضروری ہے۔',
      'زخم یا جلنے پر ٹوتھ پیسٹ، راکھ یا تیل ہرگز نہ لگائیں۔'
    ]
  },

  zinc: {
    generic: 'Zinc supplement (with ORS, during diarrhoea)',
    generic_ur: 'زنک (او آر ایس کے ساتھ)',
    brands: ['Zincat', 'Zinc sulphate'],
    form: 'Tablet / syrup 20 mg',
    adultDose: '20 mg daily for 10-14 days alongside ORS during a diarrhoeal illness.',
    adultDose_ur: 'دستوں کے دوران او آر ایس کے ساتھ 20 ملی گرام روزانہ، 10 تا 14 دن۔',
    maxDaily: '20 mg a day.',
    maxDaily_ur: 'روزانہ 20 ملی گرام۔',
    cautions: ['Take after food - on an empty stomach it causes nausea.'],
    cautions_ur: ['کھانے کے بعد لیں، خالی پیٹ متلی ہوتی ہے۔']
  },

  coldCompress: {
    generic: 'Cold or warm compress',
    generic_ur: 'ٹھنڈی یا گرم ٹکور',
    brands: ['-'],
    form: 'Non-drug',
    adultDose: 'Apply for 15-20 minutes at a time, several times a day. Cold for fresh injury and swelling, warm for cramps and stiff muscles.',
    adultDose_ur: 'ایک بار میں 15 تا 20 منٹ، دن میں کئی بار۔ نئی چوٹ اور سوجن پر ٹھنڈی، مروڑ اور اکڑن پر گرم ٹکور۔',
    maxDaily: 'As needed.',
    maxDaily_ur: 'ضرورت کے مطابق۔',
    cautions: ['Wrap ice in a cloth - never place it directly on skin.'],
    cautions_ur: ['برف کو کپڑے میں لپیٹیں، براہِ راست جلد پر نہ رکھیں۔']
  },

  hydrationRest: {
    generic: 'Fluids, rest and sleep routine',
    generic_ur: 'پانی، آرام اور نیند کی عادات',
    brands: ['-'],
    form: 'Non-drug',
    adultDose: '8-10 glasses of water a day, fixed sleeping and waking times, and no screens for an hour before bed.',
    adultDose_ur: 'روزانہ 8 تا 10 گلاس پانی، سونے جاگنے کا مقررہ وقت، اور سونے سے ایک گھنٹہ پہلے اسکرین بند۔',
    maxDaily: '-',
    maxDaily_ur: '-',
    cautions: ['This is first-line treatment, not filler advice.'],
    cautions_ur: ['یہ پہلا اور اصل علاج ہے، محض ایک مشورہ نہیں۔']
  }
};

/**
 * Drug classes the assistant must never recommend on its own initiative.
 * Self-medication with antibiotics and benzodiazepines is a serious problem
 * in Pakistan, so these are blocked explicitly and called out to the user.
 */
const NEVER_SUGGEST = [
  'antibiotic', 'antibiotics', 'amoxicillin', 'augmentin', 'azithromycin', 'azomax',
  'ciprofloxacin', 'ciproxin', 'levofloxacin', 'flagyl', 'metronidazole', 'cefixime',
  'steroid', 'steroids', 'dexamethasone', 'prednisolone', 'deltacortril',
  'tramadol', 'nalbuphine', 'morphine', 'codeine', 'xanax', 'alprazolam',
  'lexotanil', 'bromazepam', 'diazepam', 'valium', 'zolpidem', 'sleeping pill'
];

module.exports = { MEDICINES, NEVER_SUGGEST };
