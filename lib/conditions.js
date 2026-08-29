'use strict';

/**
 * Condition knowledge base.
 *
 * Each entry is a *possible explanation*, never a diagnosis. The engine
 * scores a user's description against `keywords` and returns the best
 * matches with self-care advice, OTC options (keys into medicines.js)
 * and explicit "see a doctor if" triggers.
 *
 * keywords include English, Urdu script and Roman Urdu, because users
 * dictate and type in all three.
 */

const CONDITIONS = [
  {
    id: 'common_cold',
    name: 'Common cold (viral upper respiratory infection)',
    name_ur: 'عام زکام (وائرل انفیکشن)',
    keywords: ['cold', 'runny nose', 'blocked nose', 'stuffy nose', 'sneezing', 'nasal congestion',
      'zukam', 'nazla', 'naak behna', 'naak band', 'chheenk',
      'زکام', 'نزلہ', 'ناک بہنا', 'ناک بند', 'چھینک'],
    advice: [
      'A cold is caused by a virus and settles on its own in 5-7 days. Antibiotics do nothing for it.',
      'Drink warm fluids often - water, soup, green tea - and rest.',
      'Steam inhalation two or three times a day clears the nose better than most sprays.',
      'Sleep with your head slightly raised on an extra pillow.'
    ],
    advice_ur: [
      'زکام وائرس سے ہوتا ہے اور 5 تا 7 دن میں خود ٹھیک ہو جاتا ہے۔ اینٹی بائیوٹک اس میں بے کار ہے۔',
      'گرم مشروبات بار بار پئیں، پانی، سوپ، قہوہ، اور آرام کریں۔',
      'دن میں دو تین بار بھاپ لینا زیادہ تر سپرے سے بہتر کام کرتا ہے۔',
      'سوتے وقت سر کے نیچے ایک اضافی تکیہ رکھیں۔'
    ],
    meds: ['paracetamol', 'salineSpray', 'honeyLemon', 'cetirizine'],
    seeDoctorIf: ['Fever above 101 F lasting more than 3 days', 'Green or bloody mucus with face pain', 'Breathlessness or wheezing'],
    seeDoctorIf_ur: ['بخار 101 سے اوپر تین دن سے زیادہ رہے', 'ناک سے سبز یا خون آمیز مواد اور چہرے میں درد', 'سانس پھولنا یا سینے سے آواز آنا']
  },
  {
    id: 'flu_fever',
    name: 'Fever / flu-like illness',
    name_ur: 'بخار یا فلو',
    keywords: ['fever', 'high temperature', 'body ache', 'chills', 'shivering', 'flu', 'feeling hot',
      'bukhar', 'tez bukhar', 'jism dard', 'kanpkapi', 'jism toot raha',
      'بخار', 'تیز بخار', 'جسم درد', 'کپکپی', 'ٹھنڈ لگنا', 'جسم ٹوٹ رہا'],
    advice: [
      'Check and note your temperature. Above 100.4 F counts as fever.',
      'Drink more fluids than usual - fever loses water fast.',
      'Sponge with normal-temperature water if the fever is high. Do not use ice or alcohol.',
      'Rest. Do not go to work or class while you have fever - you are contagious.'
    ],
    advice_ur: [
      'اپنا درجہ حرارت ناپیں اور لکھ لیں۔ 100.4 سے اوپر بخار شمار ہوتا ہے۔',
      'معمول سے زیادہ پانی اور مشروبات پئیں، بخار میں پانی تیزی سے کم ہوتا ہے۔',
      'بخار تیز ہو تو سادہ پانی سے ٹکور کریں۔ برف یا اسپرٹ استعمال نہ کریں۔',
      'آرام کریں۔ بخار میں کام یا کلاس پر نہ جائیں، بیماری دوسروں کو لگ سکتی ہے۔'
    ],
    meds: ['paracetamol', 'hydrationRest', 'ors'],
    seeDoctorIf: ['Fever lasting more than 3 days, or above 103 F', 'Fever with a rash, stiff neck, or confusion', 'Fever in pregnancy or in someone with diabetes, cancer or a transplant'],
    seeDoctorIf_ur: ['بخار تین دن سے زیادہ رہے یا 103 سے اوپر جائے', 'بخار کے ساتھ دانے، گردن کا اکڑنا یا بے ہوشی', 'حمل، ذیابیطس یا کمزور قوتِ مدافعت والے مریض میں بخار']
  },
  {
    id: 'dengue_suspect',
    strong: ['dengue', 'ڈینگی', 'dengue bukhar'],
    name: 'Possible dengue fever',
    name_ur: 'ڈینگی بخار کا شبہ',
    keywords: ['dengue', 'high fever with body pain', 'pain behind eyes', 'joint pain fever', 'platelets',
      'rash after fever', 'mosquito fever',
      'dengue bukhar', 'aankhon ke peeche dard', 'platelets kam',
      'ڈینگی', 'آنکھوں کے پیچھے درد', 'پلیٹلیٹس', 'ہڈیوں کا بخار'],
    advice: [
      'Use ONLY paracetamol for fever and pain. Ibuprofen, diclofenac, aspirin and Disprin increase bleeding risk in dengue.',
      'Get a CBC blood test done to check platelets, and repeat it as your doctor advises.',
      'Drink a lot of fluids: water, ORS, fresh juice, soup. Watch that you are passing urine normally.',
      'Watch for warning signs on days 3 to 6, when the fever drops - that is when dengue can get worse, not better.'
    ],
    advice_ur: [
      'بخار اور درد کے لیے صرف پیراسیٹامول لیں۔ آئبوپروفین، ڈسپرین اور ڈائیکلوفیناک ڈینگی میں خون بہنے کا خطرہ بڑھاتے ہیں۔',
      'سی بی سی ٹیسٹ کروائیں تاکہ پلیٹلیٹس کا پتہ چلے، اور ڈاکٹر کے مشورے سے دہرائیں۔',
      'زیادہ سے زیادہ مشروبات پئیں: پانی، او آر ایس، تازہ جوس، سوپ۔ خیال رکھیں کہ پیشاب معمول کے مطابق آ رہا ہو۔',
      'تیسرے سے چھٹے دن، جب بخار اترتا ہے، خطرے کی علامات پر نظر رکھیں، ڈینگی اسی وقت بگڑتا ہے۔'
    ],
    meds: ['paracetamol', 'ors', 'hydrationRest'],
    seeDoctorIf: ['Bleeding from gums or nose, or black stool', 'Severe abdominal pain or repeated vomiting', 'Restlessness, cold clammy skin, or reduced urine'],
    seeDoctorIf_ur: ['مسوڑھوں یا ناک سے خون، یا کالا پاخانہ', 'شدید پیٹ درد یا بار بار الٹی', 'بے چینی، جسم ٹھنڈا ہو جانا، یا پیشاب کم ہو جانا']
  },
  {
    id: 'sore_throat',
    name: 'Sore throat (pharyngitis)',
    name_ur: 'گلے کی خراش',
    keywords: ['sore throat', 'throat pain', 'painful swallowing', 'scratchy throat', 'tonsils',
      'gale me kharash', 'gala kharab', 'nigalne me dard', 'gale me dard',
      'گلے میں خراش', 'گلا خراب', 'نگلنے میں درد', 'گلے میں درد', 'ٹانسلز'],
    advice: [
      'Gargle with warm salt water three or four times a day - simple and genuinely effective.',
      'Warm liquids and honey soothe the lining. Avoid cold drinks, fried and very spicy food.',
      'Rest your voice and stop smoking or vaping while it heals.',
      'Most sore throats are viral. Do not take antibiotics unless a doctor confirms a bacterial throat infection.'
    ],
    advice_ur: [
      'دن میں تین چار بار نیم گرم نمکین پانی کے غرارے کریں، سادہ اور واقعی مؤثر علاج ہے۔',
      'گرم مشروبات اور شہد گلے کو سکون دیتے ہیں۔ ٹھنڈی چیزیں، تلی ہوئی اور بہت مرچ والی غذا سے پرہیز کریں۔',
      'آواز کو آرام دیں اور اس دوران سگریٹ نوشی بند رکھیں۔',
      'زیادہ تر گلے کی خراش وائرل ہوتی ہے۔ ڈاکٹر کی تصدیق کے بغیر اینٹی بائیوٹک نہ لیں۔'
    ],
    meds: ['gargle', 'lozenge', 'paracetamol', 'honeyLemon'],
    seeDoctorIf: ['White patches on the tonsils with high fever and no cough', 'Difficulty swallowing your own saliva, or drooling', 'Sore throat lasting more than a week'],
    seeDoctorIf_ur: ['ٹانسلز پر سفید دھبے، تیز بخار اور کھانسی نہ ہو', 'اپنا تھوک نگلنے میں دشواری یا رال بہنا', 'گلے کی خراش ایک ہفتے سے زیادہ رہے']
  },
  {
    id: 'cough',
    name: 'Cough',
    name_ur: 'کھانسی',
    keywords: ['cough', 'coughing', 'dry cough', 'phlegm', 'mucus', 'chest congestion', 'sputum',
      'khansi', 'sookhi khansi', 'balgham', 'seene me jakran',
      'کھانسی', 'خشک کھانسی', 'بلغم', 'سینے میں جکڑن'],
    advice: [
      'For a dry cough: honey in warm water, steam, and keeping the throat moist help most.',
      'For a cough with phlegm: drink more water - hydration thins mucus better than any syrup.',
      'Avoid smoke, dust and strong perfumes while you recover.',
      'A cough after a cold can linger 2-3 weeks. That alone is not a reason for antibiotics.'
    ],
    advice_ur: [
      'خشک کھانسی: شہد نیم گرم پانی میں، بھاپ، اور گلے کو تر رکھنا سب سے زیادہ فائدہ دیتے ہیں۔',
      'بلغم والی کھانسی: زیادہ پانی پئیں، بلغم کسی بھی شربت سے زیادہ پانی سے پتلا ہوتا ہے۔',
      'صحت یابی تک دھوئیں، گرد اور تیز خوشبو سے بچیں۔',
      'زکام کے بعد کھانسی 2 تا 3 ہفتے رہ سکتی ہے۔ صرف اس بنیاد پر اینٹی بائیوٹک نہ لیں۔'
    ],
    meds: ['honeyLemon', 'guaifenesin', 'salineSpray', 'menthol'],
    seeDoctorIf: ['Cough lasting more than 3 weeks', 'Coughing blood, or weight loss and night sweats (TB must be ruled out)', 'Wheezing or breathlessness'],
    seeDoctorIf_ur: ['کھانسی تین ہفتے سے زیادہ رہے', 'کھانسی میں خون، یا وزن کم ہونا اور رات کو پسینہ (ٹی بی کا ٹیسٹ ضروری)', 'سانس پھولنا یا سینے سے سیٹی کی آواز']
  },
  {
    id: 'sinusitis',
    name: 'Sinus congestion / sinusitis',
    name_ur: 'سائنس کی بندش',
    keywords: ['sinus', 'face pain', 'pressure around eyes', 'forehead pain', 'blocked sinus',
      'thick yellow mucus', 'sinusitis',
      'sinus ka dard', 'peshani me dard', 'chehre me dard',
      'سائنس', 'پیشانی میں درد', 'چہرے میں درد', 'آنکھوں کے گرد دباؤ'],
    advice: [
      'Steam inhalation and saline rinses are the mainstay - do them 3 times a day.',
      'A warm compress over the cheeks and forehead eases the pressure.',
      'Stay well hydrated so the mucus stays thin enough to drain.',
      'Sleep propped up rather than flat.'
    ],
    advice_ur: [
      'بھاپ اور نمکین پانی سے ناک کی صفائی سب سے اہم ہے، دن میں تین بار کریں۔',
      'گالوں اور پیشانی پر گرم ٹکور دباؤ کم کرتی ہے۔',
      'وافر پانی پئیں تاکہ مواد پتلا رہے اور نکل سکے۔',
      'سیدھا لیٹنے کے بجائے سر اونچا رکھ کر سوئیں۔'
    ],
    meds: ['salineSpray', 'paracetamol', 'xylometazoline', 'coldCompress'],
    seeDoctorIf: ['Symptoms lasting more than 10 days or worsening after improving', 'Swelling or redness around the eye', 'High fever with severe facial pain'],
    seeDoctorIf_ur: ['علامات 10 دن سے زیادہ رہیں یا بہتری کے بعد دوبارہ بگڑیں', 'آنکھ کے گرد سوجن یا سرخی', 'تیز بخار کے ساتھ چہرے میں شدید درد']
  },
  {
    id: 'allergic_rhinitis',
    strong: ['allergy', 'الرجی', 'allergic rhinitis'],
    name: 'Allergy / allergic rhinitis',
    name_ur: 'الرجی',
    keywords: ['allergy', 'allergic', 'itchy eyes', 'watery eyes', 'sneezing fits', 'dust allergy',
      'pollen', 'seasonal allergy',
      'allergy hai', 'chheenkein', 'aankhon me khujli', 'grid se allergy',
      'الرجی', 'چھینکیں', 'آنکھوں میں خارش', 'گرد سے الرجی', 'موسمی الرجی'],
    advice: [
      'Identify and avoid the trigger - dust, pollen, smoke, pets or a particular season.',
      'Rinse your nose with saline after coming home from outside.',
      'Wash bedding weekly in hot water and keep windows closed on dusty, windy days.',
      'Wear a mask when cleaning, sweeping or travelling on a bike.'
    ],
    advice_ur: [
      'وجہ پہچانیں اور اس سے بچیں: گرد، پولن، دھواں، جانور یا کوئی خاص موسم۔',
      'باہر سے آنے کے بعد نمکین پانی سے ناک صاف کریں۔',
      'بستر کی چادریں ہفتہ وار گرم پانی میں دھوئیں اور گرد والے دنوں میں کھڑکیاں بند رکھیں۔',
      'صفائی، جھاڑو یا بائیک پر سفر کے دوران ماسک پہنیں۔'
    ],
    meds: ['loratadine', 'cetirizine', 'salineSpray', 'artificialTears'],
    seeDoctorIf: ['Wheezing or breathlessness (allergy can trigger asthma)', 'Symptoms that persist despite daily antihistamines', 'Allergy affecting sleep or work for weeks'],
    seeDoctorIf_ur: ['سانس پھولنا یا سیٹی کی آواز (الرجی سے دمہ ہو سکتا ہے)', 'روزانہ دوا کے باوجود علامات برقرار رہیں', 'الرجی سے نیند یا کام ہفتوں متاثر ہو']
  },
  {
    id: 'tension_headache',
    name: 'Tension headache',
    name_ur: 'ذہنی دباؤ کا سر درد',
    keywords: ['headache', 'head pain', 'tight band around head', 'neck and head pain', 'stress headache',
      'sar dard', 'sir dard', 'sar me dard', 'gardan aur sar dard',
      'سر درد', 'سر میں درد', 'سر بھاری', 'گردن اور سر میں درد'],
    advice: [
      'Most everyday headaches come from dehydration, missed meals, poor sleep or screen strain.',
      'Drink two glasses of water, eat something, and rest your eyes in a dim room for 20 minutes.',
      'Gently massage the neck and shoulders, or apply a warm compress there.',
      'If you take painkillers more than twice a week, they can start causing the headaches themselves.'
    ],
    advice_ur: [
      'روزمرہ کا سر درد اکثر پانی کی کمی، کھانا چھوڑنے، نیند کی کمی یا اسکرین کی تھکن سے ہوتا ہے۔',
      'دو گلاس پانی پئیں، کچھ کھائیں، اور 20 منٹ کم روشنی والے کمرے میں آنکھیں بند کر کے لیٹیں۔',
      'گردن اور کندھوں کی ہلکی مالش کریں یا گرم ٹکور کریں۔',
      'اگر آپ ہفتے میں دو بار سے زیادہ درد کی گولی لیتے ہیں تو یہی گولیاں سر درد کی وجہ بن سکتی ہیں۔'
    ],
    meds: ['paracetamol', 'hydrationRest', 'coldCompress'],
    seeDoctorIf: ['A sudden, severe "worst ever" headache', 'Headache with fever, vomiting, vision change or weakness', 'Headache that wakes you from sleep or worsens over weeks'],
    seeDoctorIf_ur: ['اچانک شدید ترین سر درد', 'سر درد کے ساتھ بخار، الٹی، نظر کی تبدیلی یا کمزوری', 'ایسا سر درد جو نیند سے جگا دے یا ہفتوں میں بڑھتا جائے']
  },
  {
    id: 'migraine',
    strong: ['migraine', 'مائیگرین', 'آدھے سر کا درد'],
    name: 'Migraine',
    name_ur: 'آدھے سر کا درد (مائیگرین)',
    keywords: ['migraine', 'half head pain', 'throbbing headache', 'headache with nausea',
      'light sensitivity', 'aura',
      'aadhe sar ka dard', 'migraine ka dard', 'roshni se takleef',
      'مائیگرین', 'آدھے سر کا درد', 'دھڑکتا سر درد', 'روشنی سے تکلیف'],
    advice: [
      'At the first sign, go to a dark quiet room and lie down. Acting early works much better than waiting.',
      'Take your painkiller as soon as the attack starts, not after hours of pain.',
      'Keep a simple trigger diary: sleep, meals, stress, caffeine, screens, periods.',
      'Regular sleep and meal times prevent more attacks than any single medicine.'
    ],
    advice_ur: [
      'پہلی علامت پر ہی اندھیرے، پرسکون کمرے میں لیٹ جائیں۔ جلد عمل کرنا انتظار سے کہیں بہتر ہے۔',
      'درد کی دوا حملے کے شروع میں ہی لے لیں، گھنٹوں درد سہنے کے بعد نہیں۔',
      'ایک سادہ ڈائری رکھیں: نیند، کھانا، ذہنی دباؤ، کیفین، اسکرین، ماہواری۔',
      'وقت پر سونا اور کھانا کسی بھی دوا سے زیادہ حملوں کو روکتا ہے۔'
    ],
    meds: ['ibuprofen', 'paracetamol', 'coldCompress'],
    seeDoctorIf: ['Attacks more than twice a month (preventive treatment exists)', 'Weakness, speech difficulty or vision loss with the headache', 'A headache pattern that has clearly changed'],
    seeDoctorIf_ur: ['مہینے میں دو بار سے زیادہ حملے (بچاؤ کا علاج موجود ہے)', 'درد کے ساتھ کمزوری، بولنے میں دشواری یا نظر کا چلے جانا', 'سر درد کی نوعیت واضح طور پر بدل جائے']
  },
  {
    id: 'acidity_gerd',
    name: 'Acidity / heartburn (acid reflux)',
    name_ur: 'تیزابیت اور سینے کی جلن',
    keywords: ['acidity', 'heartburn', 'acid reflux', 'burning in chest', 'sour burps', 'gerd',
      'burning after eating', 'acid',
      'tezabiat', 'seene me jalan', 'khatti dakar', 'pait me jalan', 'moade me jalan',
      'تیزابیت', 'سینے میں جلن', 'کھٹی ڈکار', 'معدے میں جلن'],
    advice: [
      'Eat smaller meals more often instead of one large heavy meal.',
      'Do not lie down for 2-3 hours after eating. Raise the head of the bed if it troubles you at night.',
      'Cut back on tea, coffee, cola, very spicy or oily food, and smoking.',
      'If burning in the chest comes with exertion, sweating or left-arm pain, treat it as a heart problem until a doctor rules it out.'
    ],
    advice_ur: [
      'ایک بھاری کھانے کے بجائے تھوڑا تھوڑا اور بار بار کھائیں۔',
      'کھانے کے بعد 2 تا 3 گھنٹے نہ لیٹیں۔ رات کو تکلیف ہو تو بستر کا سرہانہ اونچا کر لیں۔',
      'چائے، کافی، کولا، بہت مرچ یا تیل والی غذا اور سگریٹ کم کریں۔',
      'اگر سینے کی جلن محنت، پسینے یا بائیں بازو کے درد کے ساتھ ہو تو اسے دل کا مسئلہ سمجھیں جب تک ڈاکٹر رد نہ کر دے۔'
    ],
    meds: ['antacid', 'omeprazole'],
    seeDoctorIf: ['Difficulty or pain on swallowing, or food sticking', 'Vomiting blood or black stools', 'Unintended weight loss, or symptoms lasting beyond 2 weeks of treatment'],
    seeDoctorIf_ur: ['نگلنے میں دشواری یا درد، یا لقمے کا اٹک جانا', 'خون کی الٹی یا کالا پاخانہ', 'وزن کا بلا وجہ کم ہونا، یا دو ہفتے علاج کے بعد بھی تکلیف']
  },
  {
    id: 'indigestion_gas',
    name: 'Indigestion / gas / bloating',
    name_ur: 'بدہضمی اور گیس',
    keywords: ['gas', 'bloating', 'indigestion', 'stomach full', 'burping', 'heavy stomach',
      'stomach upset after eating',
      'gas ka masla', 'badhazmi', 'pait phoolna', 'pait bhara bhara', 'dakar',
      'گیس', 'بدہضمی', 'پیٹ پھولنا', 'پیٹ بھاری', 'ڈکار'],
    advice: [
      'Eat slowly and chew properly. Swallowed air is a common cause of bloating.',
      'Cut down on fizzy drinks, chewing gum, and very oily or fried food for a few days.',
      'A short walk after meals helps more than lying down.',
      'Ajwain or saunf in warm water is a safe traditional remedy that genuinely helps some people.'
    ],
    advice_ur: [
      'آہستہ کھائیں اور اچھی طرح چبائیں۔ ہوا نگلنا پیٹ پھولنے کی عام وجہ ہے۔',
      'چند دن کے لیے بوتل والے مشروبات، چیونگم اور تلی ہوئی غذا کم کریں۔',
      'کھانے کے بعد لیٹنے کے بجائے تھوڑی چہل قدمی کریں۔',
      'نیم گرم پانی میں اجوائن یا سونف ایک محفوظ گھریلو نسخہ ہے جو بہت سوں کو فائدہ دیتا ہے۔'
    ],
    meds: ['antacid', 'hyoscine'],
    seeDoctorIf: ['Bloating with weight loss or a change in bowel habit lasting weeks', 'Severe pain rather than discomfort', 'Bloating with vomiting and inability to pass stool or gas'],
    seeDoctorIf_ur: ['پیٹ پھولنے کے ساتھ وزن کم ہونا یا ہفتوں تک پاخانے کی عادت بدل جانا', 'تکلیف کے بجائے شدید درد', 'الٹی کے ساتھ پیٹ پھولنا اور پاخانہ یا ہوا خارج نہ ہونا']
  },
  {
    id: 'diarrhea',
    name: 'Diarrhoea (loose motions)',
    name_ur: 'دست یا پتلے پاخانے',
    keywords: ['diarrhea', 'diarrhoea', 'loose motion', 'loose motions', 'watery stool', 'frequent stool',
      'dast', 'pait kharab', 'patle pakhane', 'motions lag gaye', 'dast lag gaye',
      'دست', 'پیٹ خراب', 'پتلے پاخانے', 'موشن'],
    advice: [
      'Rehydration is the treatment. ORS after every loose motion matters more than any tablet.',
      'Keep eating light food - rice, khichri, banana, yogurt, toast. Starving yourself makes recovery slower.',
      'Avoid milk, fried food, and very sugary drinks for a couple of days.',
      'Wash hands with soap after the toilet and before eating so it does not spread at home.'
    ],
    advice_ur: [
      'اصل علاج پانی کی کمی پوری کرنا ہے۔ ہر پتلے پاخانے کے بعد او آر ایس کسی بھی گولی سے زیادہ اہم ہے۔',
      'ہلکی غذا کھاتے رہیں: چاول، کھچڑی، کیلا، دہی، توس۔ فاقہ کرنے سے صحت یابی سست ہوتی ہے۔',
      'دو دن دودھ، تلی ہوئی چیزیں اور بہت میٹھے مشروبات سے پرہیز کریں۔',
      'بیت الخلا کے بعد اور کھانے سے پہلے صابن سے ہاتھ دھوئیں تاکہ گھر میں نہ پھیلے۔'
    ],
    meds: ['ors', 'zinc', 'loperamide'],
    seeDoctorIf: ['Blood or mucus in the stool, or high fever', 'Signs of dehydration: very little urine, dizziness on standing, dry mouth', 'Diarrhoea lasting more than 3 days, or in a small child or elderly person'],
    seeDoctorIf_ur: ['پاخانے میں خون یا آنو، یا تیز بخار', 'پانی کی کمی کی علامات: پیشاب بہت کم، کھڑے ہونے پر چکر، منہ خشک', 'دست تین دن سے زیادہ، یا چھوٹے بچے یا بزرگ میں']
  },
  {
    id: 'food_poisoning',
    strong: ['food poisoning', 'فوڈ پوائزننگ'],
    name: 'Food poisoning / gastroenteritis',
    name_ur: 'فوڈ پوائزننگ',
    keywords: ['food poisoning', 'ate outside and vomiting', 'stomach infection', 'vomiting and loose motions',
      'stale food', 'bad food',
      'food poisoning ho gayi', 'bahar ka khana', 'ulti aur dast', 'khana laga',
      'فوڈ پوائزننگ', 'باہر کا کھانا', 'الٹی اور دست', 'کھانا لگ گیا'],
    advice: [
      'Give the stomach a short rest - 1 to 2 hours of nothing but small sips of ORS or water.',
      'Then restart with bland food: plain rice, khichri, banana, toast, clear soup.',
      'Sip fluids constantly in small amounts. Large gulps trigger more vomiting.',
      'Note what you ate and whether others who ate it are also unwell.'
    ],
    advice_ur: [
      'معدے کو تھوڑا آرام دیں: ایک دو گھنٹے صرف او آر ایس یا پانی کے چھوٹے گھونٹ۔',
      'پھر سادہ غذا سے شروع کریں: سادہ چاول، کھچڑی، کیلا، توس، یخنی۔',
      'تھوڑا تھوڑا مسلسل پیتے رہیں۔ ایک ساتھ زیادہ پینے سے دوبارہ الٹی ہوتی ہے۔',
      'یاد رکھیں آپ نے کیا کھایا تھا اور کیا ساتھ کھانے والے بھی بیمار ہوئے۔'
    ],
    meds: ['ors', 'hydrationRest', 'zinc'],
    seeDoctorIf: ['Unable to keep even water down for more than 6 hours', 'Blood in vomit or stool, or high fever', 'Severe abdominal pain, or symptoms in a pregnant woman, child or elderly person'],
    seeDoctorIf_ur: ['چھ گھنٹے سے پانی بھی نہ ٹھہر رہا ہو', 'الٹی یا پاخانے میں خون، یا تیز بخار', 'شدید پیٹ درد، یا حاملہ خاتون، بچے یا بزرگ میں یہ علامات']
  },
  {
    id: 'constipation',
    strong: ['constipation', 'qabz', 'kabz', 'قبض'],
    name: 'Constipation',
    name_ur: 'قبض',
    keywords: ['constipation', 'hard stool', 'cannot pass stool', 'not passing motion', 'straining',
      'qabz', 'pakhana sakht', 'pait saaf nahi', 'kabz',
      'قبض', 'پاخانہ سخت', 'پیٹ صاف نہیں ہوتا'],
    advice: [
      'Increase fibre gradually: vegetables, fruit with skin, whole wheat roti, soaked raisins or figs.',
      'Drink 8-10 glasses of water a day - fibre without water makes constipation worse.',
      'Walk for 20-30 minutes daily. Movement moves the bowel.',
      'Go to the toilet at the same time each day, ideally after breakfast, and do not delay the urge.'
    ],
    advice_ur: [
      'ریشے والی غذا آہستہ آہستہ بڑھائیں: سبزیاں، چھلکے سمیت پھل، گندم کی روٹی، بھگوئی کشمش یا انجیر۔',
      'روزانہ 8 تا 10 گلاس پانی پئیں، پانی کے بغیر ریشہ قبض بڑھا دیتا ہے۔',
      'روزانہ 20 تا 30 منٹ چہل قدمی کریں۔ حرکت سے آنتیں حرکت کرتی ہیں۔',
      'روزانہ ایک ہی وقت پر، بہتر ہے ناشتے کے بعد، بیت الخلا جائیں اور حاجت کو نہ ٹالیں۔'
    ],
    meds: ['ispaghula', 'lactulose', 'hydrationRest'],
    seeDoctorIf: ['Blood in the stool, or a pencil-thin stool', 'Constipation alternating with diarrhoea, with weight loss', 'No stool and no gas passing at all, with a swollen painful abdomen'],
    seeDoctorIf_ur: ['پاخانے میں خون، یا پاخانہ بہت باریک', 'قبض اور دست باری باری، ساتھ وزن کم ہونا', 'بالکل پاخانہ اور ہوا خارج نہ ہو، پیٹ پھولا اور دردناک ہو']
  },
  {
    id: 'nausea_vomiting',
    name: 'Nausea and vomiting',
    name_ur: 'متلی اور الٹی',
    keywords: ['nausea', 'vomiting', 'feeling sick', 'throwing up', 'want to vomit', 'queasy',
      'ulti', 'matli', 'dil kharab', 'qai', 'ulti aa rahi',
      'متلی', 'الٹی', 'دل خراب', 'قے', 'جی متلانا'],
    advice: [
      'Take small sips of cool water or ORS every few minutes rather than drinking a lot at once.',
      'Avoid strong smells, oily food and lying flat right after eating.',
      'Dry toast, plain rice, crackers or a banana are easiest to keep down.',
      'Fresh air and slow deep breathing settle mild nausea surprisingly well.'
    ],
    advice_ur: [
      'ایک ساتھ زیادہ پینے کے بجائے ہر چند منٹ بعد ٹھنڈے پانی یا او آر ایس کے چھوٹے گھونٹ لیں۔',
      'تیز خوشبو، تیل والی غذا اور کھانے کے فوراً بعد لیٹنے سے پرہیز کریں۔',
      'خشک توس، سادہ چاول، بسکٹ یا کیلا سب سے آسانی سے ہضم ہوتے ہیں۔',
      'تازہ ہوا اور آہستہ گہرے سانس ہلکی متلی میں حیرت انگیز طور پر مفید ہیں۔'
    ],
    meds: ['ors', 'hydrationRest', 'dimenhydrinate'],
    seeDoctorIf: ['Vomiting for more than 24 hours, or unable to keep fluids down', 'Vomit containing blood or a coffee-ground appearance', 'Vomiting with severe headache, stiff neck or after a head injury'],
    seeDoctorIf_ur: ['24 گھنٹے سے زیادہ الٹی، یا مشروبات بھی نہ ٹھہریں', 'الٹی میں خون یا کافی کے رنگ کا مواد', 'الٹی کے ساتھ شدید سر درد، گردن کا اکڑنا، یا سر کی چوٹ کے بعد']
  },
  {
    id: 'motion_sickness',
    strong: ['motion sickness', 'travel sickness', 'سفر کی متلی'],
    name: 'Motion sickness',
    name_ur: 'سفر کی متلی',
    keywords: ['motion sickness', 'car sick', 'travel sickness', 'vomit while travelling', 'bus sick',
      'safar me ulti', 'gaari me matli', 'safar ki matli',
      'سفر میں الٹی', 'گاڑی میں متلی', 'سفر کی متلی'],
    advice: [
      'Sit in the front seat and look far ahead at the horizon, not at your phone or a book.',
      'Keep a window slightly open for fresh air.',
      'Travel on a light stomach - not empty, not heavy.',
      'Ginger or lemon to smell or chew helps many people.'
    ],
    advice_ur: [
      'اگلی سیٹ پر بیٹھیں اور دور افق کی طرف دیکھیں، موبائل یا کتاب پر نہیں۔',
      'کھڑکی تھوڑی کھلی رکھیں تاکہ تازہ ہوا آتی رہے۔',
      'سفر ہلکے پیٹ کے ساتھ کریں، نہ بالکل خالی نہ بھرا ہوا۔',
      'ادرک یا لیموں سونگھنا یا چبانا بہت سوں کو فائدہ دیتا ہے۔'
    ],
    meds: ['dimenhydrinate'],
    seeDoctorIf: ['Dizziness and spinning that happens without travelling', 'Vomiting with hearing loss or ringing in the ears', 'Symptoms that are new and severe in an older adult'],
    seeDoctorIf_ur: ['سفر کے بغیر بھی چکر آنا', 'الٹی کے ساتھ سماعت کا کم ہونا یا کانوں میں آواز', 'بزرگ افراد میں نئی اور شدید علامات']
  },
  {
    id: 'uti',
    strong: ['uti', 'urine infection', 'پیشاب کا انفیکشن'],
    name: 'Possible urinary tract infection',
    name_ur: 'پیشاب کی نالی کا انفیکشن',
    keywords: ['burning urine', 'burning while urinating', 'frequent urination', 'uti', 'urine infection',
      'pain while passing urine', 'cloudy urine',
      'peshab me jalan', 'peshab bar bar', 'peshab karte waqt dard', 'peshab ki jalan',
      'peshab karte waqt jalan', 'burning when i urinate', 'burning sensation urine',
      'پیشاب میں جلن', 'بار بار پیشاب', 'پیشاب کرتے وقت درد', 'پیشاب کا انفیکشن',
      'پیشاب کرتے وقت جلن', 'پیشاب میں تکلیف'],
    advice: [
      'Drink plenty of water throughout the day - this genuinely helps flush the infection.',
      'Do not hold urine. Empty the bladder fully and go as soon as you feel the urge.',
      'Avoid caffeine and very spicy food while symptoms last, as they irritate the bladder.',
      'A urine test (urine R/E and culture) is the right next step. A UTI usually needs a prescribed antibiotic - do NOT buy one over the counter yourself.'
    ],
    advice_ur: [
      'دن بھر وافر پانی پئیں، اس سے انفیکشن نکلنے میں واقعی مدد ملتی ہے۔',
      'پیشاب روکیں نہیں۔ مثانہ پوری طرح خالی کریں اور حاجت محسوس ہوتے ہی جائیں۔',
      'علامات کے دوران کیفین اور بہت مرچ والی غذا سے پرہیز کریں، یہ مثانے کو تنگ کرتی ہیں۔',
      'پیشاب کا ٹیسٹ کروانا اگلا درست قدم ہے۔ اس انفیکشن میں عموماً ڈاکٹر کی تجویز کردہ اینٹی بائیوٹک درکار ہوتی ہے، خود سے میڈیکل اسٹور سے ہرگز نہ لیں۔'
    ],
    meds: ['hydrationRest', 'paracetamol'],
    seeDoctorIf: ['Fever, chills, or pain in the back or side (the kidney may be involved)', 'Blood in the urine', 'Symptoms in pregnancy, in a man, in a child, or in a diabetic - these always need a doctor'],
    seeDoctorIf_ur: ['بخار، کپکپی، یا کمر یا پہلو میں درد (گردے تک انفیکشن پہنچ سکتا ہے)', 'پیشاب میں خون', 'حمل، مرد، بچے یا ذیابیطس کے مریض میں یہ علامات ہمیشہ ڈاکٹر کو دکھائیں']
  },
  {
    id: 'menstrual_cramps',
    name: 'Period pain (menstrual cramps)',
    name_ur: 'ماہواری کا درد',
    keywords: ['period pain', 'menstrual cramps', 'periods pain', 'cramps during periods', 'dysmenorrhea',
      'lower abdomen pain periods',
      'mahwari ka dard', 'periods me dard', 'pait me marorh periods',
      'ماہواری کا درد', 'ایام کا درد', 'پیٹ میں مروڑ ماہواری'],
    advice: [
      'A hot water bottle or warm compress on the lower abdomen is as effective as a mild painkiller for many people.',
      'Light walking or stretching reduces cramps, even though resting feels more natural.',
      'Take the painkiller at the first sign of pain rather than waiting for it to peak.',
      'Keep a simple cycle record - dates, flow, pain level. It helps a doctor a lot if this becomes a recurring problem.'
    ],
    advice_ur: [
      'پیٹ کے نچلے حصے پر گرم پانی کی بوتل یا گرم ٹکور بہت سوں کے لیے ہلکی دوا جتنی مؤثر ہے۔',
      'ہلکی چہل قدمی یا اسٹریچنگ درد کم کرتی ہے، اگرچہ آرام کرنے کو دل چاہتا ہے۔',
      'درد شروع ہوتے ہی دوا لے لیں، شدت کا انتظار نہ کریں۔',
      'ماہواری کا سادہ ریکارڈ رکھیں: تاریخیں، مقدار، درد کی شدت۔ مسئلہ بار بار ہو تو یہ ڈاکٹر کے بہت کام آتا ہے۔'
    ],
    meds: ['ibuprofen', 'paracetamol', 'coldCompress', 'hyoscine'],
    seeDoctorIf: ['Pain severe enough to stop you attending class or work every month', 'Very heavy bleeding, clots, or bleeding between periods', 'Pain that has recently become much worse than usual'],
    seeDoctorIf_ur: ['ہر مہینے درد اتنا شدید کہ کلاس یا کام ممکن نہ ہو', 'بہت زیادہ خون، لوتھڑے، یا ایام کے درمیان خون آنا', 'درد حال ہی میں معمول سے کہیں زیادہ بڑھ گیا ہو']
  },
  {
    id: 'back_muscle_pain',
    name: 'Back / muscle strain',
    name_ur: 'کمر یا پٹھوں کا درد',
    keywords: ['back pain', 'muscle pain', 'body pain', 'strain', 'stiff back', 'shoulder pain',
      'neck pain', 'pulled muscle',
      'kamar dard', 'pathon me dard', 'gardan me dard', 'kandhe me dard', 'kamar me dard',
      'back hurts', 'kamar dukh rahi', 'کمر دکھ رہی',
      'کمر درد', 'پٹھوں میں درد', 'گردن میں درد', 'کندھے میں درد'],
    advice: [
      'Keep moving gently. Complete bed rest makes back pain last longer, not shorter.',
      'Cold compress for the first 48 hours after a strain, then warm compress after that.',
      'Fix your sitting posture: feet flat, screen at eye level, and stand up every 30-40 minutes.',
      'Avoid lifting heavy weights with a bent back - bend the knees instead.'
    ],
    advice_ur: [
      'ہلکی حرکت جاری رکھیں۔ مکمل بستر پر آرام کمر درد کو لمبا کرتا ہے، کم نہیں کرتا۔',
      'کھنچاؤ کے بعد پہلے 48 گھنٹے ٹھنڈی ٹکور، اس کے بعد گرم ٹکور کریں۔',
      'بیٹھنے کا انداز درست کریں: پاؤں زمین پر، اسکرین آنکھ کی سطح پر، اور ہر 30 تا 40 منٹ بعد کھڑے ہوں۔',
      'کمر جھکا کر وزن نہ اٹھائیں، گھٹنے موڑ کر اٹھائیں۔'
    ],
    meds: ['diclofenacGel', 'paracetamol', 'ibuprofen', 'coldCompress'],
    seeDoctorIf: ['Pain shooting down the leg, or numbness and weakness in a limb', 'Loss of bladder or bowel control - this is an emergency', 'Back pain after a fall, or with fever or weight loss'],
    seeDoctorIf_ur: ['درد ٹانگ میں نیچے تک جائے، یا ہاتھ پاؤں سن یا کمزور ہوں', 'پیشاب یا پاخانے پر قابو نہ رہے، یہ ایمرجنسی ہے', 'گرنے کے بعد کمر درد، یا ساتھ بخار یا وزن کم ہونا']
  },
  {
    id: 'joint_pain',
    name: 'Joint pain',
    name_ur: 'جوڑوں کا درد',
    keywords: ['joint pain', 'knee pain', 'arthritis', 'swollen joint', 'stiff joints', 'ankle pain',
      'jodon ka dard', 'ghutne me dard', 'jor dard',
      'جوڑوں کا درد', 'گھٹنے میں درد', 'جوڑ اکڑنا'],
    advice: [
      'Keep the joint moving within a comfortable range - stiffness worsens with total rest.',
      'Reduce load on the joint: avoid stairs, squatting and sitting cross-legged on the floor for long.',
      'Losing even a few kilos noticeably reduces knee pain.',
      'Strengthening the muscles around the joint protects it more than any painkiller.'
    ],
    advice_ur: [
      'جوڑ کو آرام دہ حد تک حرکت دیتے رہیں، مکمل آرام سے اکڑن بڑھتی ہے۔',
      'جوڑ پر بوجھ کم کریں: سیڑھیاں، اکڑوں بیٹھنا اور دیر تک زمین پر پالتی مار کر بیٹھنے سے بچیں۔',
      'چند کلو وزن کم کرنے سے بھی گھٹنے کا درد نمایاں کم ہوتا ہے۔',
      'جوڑ کے گرد پٹھوں کو مضبوط کرنا کسی بھی درد کش دوا سے زیادہ حفاظت دیتا ہے۔'
    ],
    meds: ['diclofenacGel', 'paracetamol', 'coldCompress'],
    seeDoctorIf: ['A hot, red, very swollen joint with fever - this needs urgent assessment', 'Morning stiffness lasting more than an hour, or several joints involved', 'Joint pain after an injury with inability to bear weight'],
    seeDoctorIf_ur: ['جوڑ گرم، سرخ اور بہت سوجا ہوا ہو، ساتھ بخار، فوری معائنہ ضروری ہے', 'صبح کی اکڑن ایک گھنٹے سے زیادہ رہے، یا کئی جوڑ متاثر ہوں', 'چوٹ کے بعد جوڑ پر وزن نہ ڈالا جا سکے']
  },
  {
    id: 'toothache',
    strong: ['toothache', 'دانت کا درد', 'dant dard'],
    name: 'Toothache',
    name_ur: 'دانت کا درد',
    keywords: ['toothache', 'tooth pain', 'dental pain', 'cavity', 'gum pain', 'wisdom tooth',
      'dant dard', 'daant me dard', 'masoore me dard',
      'دانت کا درد', 'دانت میں درد', 'مسوڑھوں میں درد'],
    advice: [
      'Rinse with warm salt water and keep the area clean.',
      'Avoid very hot, very cold and sugary things until you see a dentist.',
      'Do not place a tablet directly against the gum - it burns the tissue.',
      'Painkillers only buy time. A tooth problem needs a dentist; it will not heal on its own.'
    ],
    advice_ur: [
      'نیم گرم نمکین پانی سے کلی کریں اور جگہ صاف رکھیں۔',
      'ڈینٹسٹ کو دکھانے تک بہت گرم، بہت ٹھنڈی اور میٹھی چیزوں سے پرہیز کریں۔',
      'گولی براہِ راست مسوڑھے پر نہ رکھیں، اس سے مسوڑھا جل جاتا ہے۔',
      'درد کش دوا صرف وقت دیتی ہے۔ دانت کا مسئلہ ڈینٹسٹ سے ہی حل ہوگا، خود ٹھیک نہیں ہوتا۔'
    ],
    meds: ['paracetamol', 'ibuprofen', 'gargle', 'coldCompress'],
    seeDoctorIf: ['Swelling of the face or jaw, or fever - a dental abscess can spread fast', 'Difficulty opening the mouth or swallowing', 'Pain lasting more than 2 days'],
    seeDoctorIf_ur: ['چہرے یا جبڑے کی سوجن یا بخار، دانت کا پھوڑا تیزی سے پھیل سکتا ہے', 'منہ کھولنے یا نگلنے میں دشواری', 'درد دو دن سے زیادہ رہے']
  },
  {
    id: 'mouth_ulcer',
    strong: ['mouth ulcer', 'منہ کے چھالے', 'munh me chhale'],
    name: 'Mouth ulcer',
    name_ur: 'منہ کے چھالے',
    keywords: ['mouth ulcer', 'mouth sore', 'blister in mouth', 'ulcer on tongue', 'canker sore',
      'munh me chhale', 'zaban par chhala', 'munh ka chhala',
      'منہ کے چھالے', 'زبان پر چھالا', 'منہ میں زخم'],
    advice: [
      'Most mouth ulcers heal on their own in 7-10 days.',
      'Avoid spicy, salty, acidic and very hot food until it heals.',
      'Use a soft toothbrush and keep the mouth clean with salt-water rinses.',
      'Recurring ulcers can point to stress, iron or B12 deficiency - worth a blood test if they keep coming back.'
    ],
    advice_ur: [
      'زیادہ تر چھالے 7 تا 10 دن میں خود ٹھیک ہو جاتے ہیں۔',
      'ٹھیک ہونے تک مرچ والی، نمکین، کھٹی اور بہت گرم غذا سے پرہیز کریں۔',
      'نرم برش استعمال کریں اور نمکین پانی کی کلیوں سے منہ صاف رکھیں۔',
      'بار بار چھالے ذہنی دباؤ یا آئرن یا بی12 کی کمی کی طرف اشارہ ہو سکتے ہیں، ٹیسٹ کروا لیں۔'
    ],
    meds: ['oralGel', 'gargle'],
    seeDoctorIf: ['An ulcer that has not healed in 3 weeks - this must be checked', 'Ulcers with fever, or spreading across the mouth', 'Ulcers with weight loss or difficulty eating'],
    seeDoctorIf_ur: ['چھالا تین ہفتوں میں ٹھیک نہ ہو، اسے ضرور چیک کروائیں', 'چھالوں کے ساتھ بخار، یا پورے منہ میں پھیلنا', 'چھالوں کے ساتھ وزن کم ہونا یا کھانے میں شدید دشواری']
  },
  {
    id: 'skin_allergy_itch',
    name: 'Skin rash / itching',
    name_ur: 'جلد پر خارش یا دانے',
    keywords: ['itching', 'rash', 'hives', 'skin allergy', 'red spots', 'itchy skin', 'welts',
      'khujli', 'jild par dane', 'jild me khujli', 'chakatte', 'khaarish',
      'خارش', 'جلد پر دانے', 'سرخ دھبے', 'چکتے', 'جلد کی الرجی'],
    advice: [
      'Try to identify what changed - a new soap, detergent, food, medicine, fabric or plant.',
      'Use lukewarm water, not hot, and a mild fragrance-free soap.',
      'Moisturise while the skin is still damp after washing.',
      'Keep nails short. Scratching breaks the skin and invites infection.'
    ],
    advice_ur: [
      'سوچیں کیا نیا استعمال کیا: صابن، سرف، غذا، دوا، کپڑا یا پودا۔',
      'گرم کے بجائے نیم گرم پانی اور بغیر خوشبو والا ہلکا صابن استعمال کریں۔',
      'نہانے کے فوراً بعد، جلد نم ہو تو موئسچرائزر لگائیں۔',
      'ناخن چھوٹے رکھیں۔ کھجانے سے جلد پھٹتی ہے اور انفیکشن ہو جاتا ہے۔'
    ],
    meds: ['cetirizine', 'calamine', 'hydrocortisone'],
    seeDoctorIf: ['Rash with swelling of the lips or face, or any breathing difficulty - emergency', 'Rash with fever, or blisters and peeling skin', 'A rash that keeps spreading despite treatment'],
    seeDoctorIf_ur: ['دانوں کے ساتھ ہونٹوں یا چہرے کی سوجن یا سانس میں دشواری، یہ ایمرجنسی ہے', 'دانوں کے ساتھ بخار، یا آبلے اور جلد کا اترنا', 'علاج کے باوجود دانے پھیلتے جائیں']
  },
  {
    id: 'fungal_infection',
    strong: ['ringworm', 'daad', 'داد', 'fungal infection', 'فنگل انفیکشن'],
    name: 'Fungal skin infection (ringworm / tinea)',
    name_ur: 'جلد کا فنگل انفیکشن (داد)',
    keywords: ['ringworm', 'fungal infection', 'daad', 'round patch on skin', 'itchy ring', 'tinea',
      'athlete foot', 'jock itch',
      'daad ho gaya', 'jild par gol nishan', 'fungal',
      'داد', 'جلد پر گول نشان', 'فنگل انفیکشن'],
    advice: [
      'Keep the area clean and completely dry - fungus thrives in moisture and sweat.',
      'Wear loose cotton clothes and change them daily. Do not share towels or clothes.',
      'Never apply a steroid cream on it - it clears the itch briefly and makes the infection spread.',
      'Treat for the full course and 1-2 weeks beyond the rash clearing, or it comes straight back.'
    ],
    advice_ur: [
      'متاثرہ جگہ کو صاف اور بالکل خشک رکھیں، فنگس نمی اور پسینے میں بڑھتی ہے۔',
      'ڈھیلے سوتی کپڑے پہنیں اور روز بدلیں۔ تولیہ یا کپڑے کسی کے ساتھ شیئر نہ کریں۔',
      'اس پر اسٹیرائیڈ کریم ہرگز نہ لگائیں، خارش وقتی طور پر کم ہوتی ہے مگر انفیکشن پھیل جاتا ہے۔',
      'پورا کورس کریں اور دھبہ ختم ہونے کے بعد بھی 1 تا 2 ہفتے جاری رکھیں، ورنہ فوراً واپس آ جاتا ہے۔'
    ],
    meds: ['clotrimazole'],
    seeDoctorIf: ['Infection on the scalp or nails - creams alone do not work there', 'Widespread patches, or a diabetic patient', 'No improvement after 2 weeks of antifungal cream'],
    seeDoctorIf_ur: ['سر کی جلد یا ناخنوں کا انفیکشن، وہاں صرف کریم کافی نہیں', 'دھبے جسم پر پھیلے ہوں، یا مریض ذیابیطس کا ہو', 'دو ہفتے کریم کے باوجود افاقہ نہ ہو']
  },
  {
    id: 'acne',
    strong: ['acne', 'pimples', 'کیل مہاسے', 'مہاسے'],
    name: 'Acne / pimples',
    name_ur: 'کیل مہاسے',
    keywords: ['acne', 'pimples', 'zits', 'blackheads', 'oily skin breakout',
      'keel muhase', 'daane chehre par', 'muhase',
      'کیل مہاسے', 'مہاسے', 'چہرے پر دانے'],
    advice: [
      'Wash the face twice a day with a gentle cleanser. Over-washing makes it worse.',
      'Do not squeeze or pick - that is what leaves permanent scars.',
      'Use non-comedogenic (oil-free) moisturiser and sunscreen.',
      'Improvement takes 6-8 weeks with any treatment. Switching products every week prevents progress.'
    ],
    advice_ur: [
      'دن میں دو بار ہلکے فیس واش سے چہرہ دھوئیں۔ بار بار دھونے سے حالت بگڑتی ہے۔',
      'دانے دبائیں یا نوچیں نہیں، مستقل نشان اسی سے پڑتے ہیں۔',
      'تیل سے پاک موئسچرائزر اور سن اسکرین استعمال کریں۔',
      'کسی بھی علاج سے بہتری میں 6 تا 8 ہفتے لگتے ہیں۔ ہر ہفتے پروڈکٹ بدلنے سے کچھ حاصل نہیں ہوتا۔'
    ],
    meds: ['hydrationRest'],
    seeDoctorIf: ['Deep painful lumps or cysts, or scarring starting to form', 'Acne with irregular periods and excess hair growth in women', 'No response after 8 weeks of over-the-counter care'],
    seeDoctorIf_ur: ['گہرے دردناک دانے یا گلٹیاں، یا نشان بننا شروع ہو جائیں', 'خواتین میں مہاسوں کے ساتھ بے قاعدہ ماہواری اور بالوں کی زیادتی', 'آٹھ ہفتے عام علاج کے باوجود فرق نہ پڑے']
  },
  {
    id: 'eye_irritation',
    name: 'Eye irritation / strain',
    name_ur: 'آنکھوں کی جلن یا تھکن',
    keywords: ['eye pain', 'red eye', 'itchy eyes', 'dry eyes', 'eye strain', 'burning eyes',
      'watery eye', 'conjunctivitis',
      'aankhon me jalan', 'aankh laal', 'aankhon me khujli', 'aankh dukh rahi',
      'آنکھوں میں جلن', 'آنکھ سرخ', 'آنکھوں میں خارش', 'آنکھیں دکھ رہی'],
    advice: [
      'Follow the 20-20-20 rule for screen strain: every 20 minutes, look 20 feet away for 20 seconds.',
      'Wash hands often and do not rub the eyes - most eye infections spread by hand.',
      'If one eye is red and sticky, use a separate towel so it does not pass to family members.',
      'Remove contact lenses until the eye is completely normal again.'
    ],
    advice_ur: [
      'اسکرین کی تھکن کے لیے 20-20-20 اصول: ہر 20 منٹ بعد، 20 فٹ دور، 20 سیکنڈ کے لیے دیکھیں۔',
      'ہاتھ بار بار دھوئیں اور آنکھیں نہ ملیں، آنکھوں کا انفیکشن زیادہ تر ہاتھوں سے پھیلتا ہے۔',
      'ایک آنکھ سرخ اور چپکی ہوئی ہو تو الگ تولیہ استعمال کریں تاکہ گھر والوں کو نہ لگے۔',
      'آنکھ مکمل ٹھیک ہونے تک کانٹیکٹ لینز نہ لگائیں۔'
    ],
    meds: ['artificialTears', 'coldCompress'],
    seeDoctorIf: ['Loss or blurring of vision, or seeing halos around lights', 'Severe eye pain, or injury with a foreign object or chemical', 'A red eye that does not settle in 2-3 days'],
    seeDoctorIf_ur: ['نظر کا کم ہونا یا دھندلا پن، یا روشنی کے گرد حلقے نظر آنا', 'آنکھ میں شدید درد، یا کوئی چیز یا کیمیکل چلا جانا', 'آنکھ کی سرخی 2 تا 3 دن میں ٹھیک نہ ہو']
  },
  {
    id: 'ear_pain',
    name: 'Ear pain',
    name_ur: 'کان کا درد',
    keywords: ['ear pain', 'earache', 'ear infection', 'blocked ear', 'ear discharge', 'ringing in ear',
      'kaan me dard', 'kaan band', 'kaan se pani',
      'کان میں درد', 'کان بند', 'کان سے پانی'],
    advice: [
      'Keep the ear dry. Do not put water, oil, or drops into it without a doctor seeing it first.',
      'Never insert cotton buds, matchsticks or keys - that is how eardrums get damaged.',
      'A warm compress against the outer ear eases the pain.',
      'If the ear feels blocked after a cold or a flight, swallowing and yawning often clears it.'
    ],
    advice_ur: [
      'کان خشک رکھیں۔ ڈاکٹر کو دکھائے بغیر اس میں پانی، تیل یا قطرے نہ ڈالیں۔',
      'روئی کی سلائی، ماچس کی تیلی یا چابی کان میں ہرگز نہ ڈالیں، پردہ اسی سے پھٹتا ہے۔',
      'کان کے باہر گرم ٹکور درد میں آرام دیتی ہے۔',
      'زکام یا ہوائی سفر کے بعد کان بند لگے تو نگلنے اور جمائی لینے سے اکثر کھل جاتا ہے۔'
    ],
    meds: ['paracetamol', 'coldCompress'],
    seeDoctorIf: ['Discharge of pus or blood from the ear', 'Ear pain with fever, or hearing loss', 'Ear pain in a child, or pain lasting more than 2 days'],
    seeDoctorIf_ur: ['کان سے پیپ یا خون آنا', 'کان کے درد کے ساتھ بخار، یا سماعت کا کم ہونا', 'بچے میں کان کا درد، یا درد دو دن سے زیادہ رہے']
  },
  {
    id: 'insomnia',
    strong: ['insomnia', 'بے خوابی', 'neend nahi aati'],
    name: 'Difficulty sleeping',
    name_ur: 'نیند نہ آنا',
    keywords: ['cannot sleep', 'insomnia', 'no sleep', 'sleepless', 'trouble sleeping', 'wake up at night',
      'neend nahi aati', 'neend ka masla', 'raat bhar jagta',
      'نیند نہیں آتی', 'بے خوابی', 'رات بھر جاگتا', 'نیند کا مسئلہ'],
    advice: [
      'Fix your wake-up time first - even on weekends. The sleep time follows on its own.',
      'No caffeine after 4 pm, and no screens for an hour before bed.',
      'If you cannot sleep within 20 minutes, get up and do something dull in dim light, then return to bed.',
      'Do not take sleeping pills without a doctor. They cause dependence quickly and stop working.'
    ],
    advice_ur: [
      'پہلے جاگنے کا وقت مقرر کریں، چھٹی کے دن بھی۔ سونے کا وقت خود بخود درست ہو جاتا ہے۔',
      'شام چار بجے کے بعد چائے یا کافی نہیں، اور سونے سے ایک گھنٹہ پہلے اسکرین بند۔',
      'اگر 20 منٹ میں نیند نہ آئے تو اٹھ کر کم روشنی میں کوئی سادہ کام کریں، پھر واپس لیٹیں۔',
      'نیند کی گولیاں ڈاکٹر کے بغیر ہرگز نہ لیں۔ ان کی عادت جلد پڑ جاتی ہے اور پھر اثر ختم ہو جاتا ہے۔'
    ],
    meds: ['hydrationRest'],
    seeDoctorIf: ['Poor sleep for more than a month affecting your daily functioning', 'Loud snoring with choking or gasping at night', 'Sleeplessness with low mood, or with palpitations and weight loss'],
    seeDoctorIf_ur: ['ایک مہینے سے زیادہ نیند خراب رہے اور روزمرہ کام متاثر ہو', 'رات کو تیز خراٹے اور سانس رکنے کا احساس', 'بے خوابی کے ساتھ افسردگی، یا دل کی دھڑکن تیز اور وزن کم ہونا']
  },
  {
    id: 'stress_anxiety',
    strong: ['anxiety', 'depression', 'بے چینی', 'ذہنی دباؤ', 'ghabrahat'],
    name: 'Stress / anxiety symptoms',
    name_ur: 'ذہنی دباؤ اور بے چینی',
    keywords: ['anxiety', 'stress', 'panic', 'worried all the time', 'tension', 'restless', 'nervous',
      'heart racing anxiety', 'depressed', 'low mood',
      'ghabrahat', 'bechaini', 'tension hai', 'pareshani', 'dil ghabrata', 'udasi',
      'گھبراہٹ', 'بے چینی', 'ذہنی دباؤ', 'پریشانی', 'دل گھبراتا', 'اداسی'],
    advice: [
      'Slow breathing works: breathe in for 4 seconds, hold 4, breathe out for 6. Repeat for 5 minutes.',
      'Physical activity, even a 20-minute walk daily, measurably reduces anxiety.',
      'Cut caffeine and nicotine - both directly worsen palpitations and restlessness.',
      'Talk to someone you trust. Saying it out loud is not weakness, and it genuinely helps.'
    ],
    advice_ur: [
      'آہستہ سانس لینا کام کرتا ہے: 4 سیکنڈ سانس اندر، 4 روکیں، 6 سیکنڈ میں باہر۔ پانچ منٹ دہرائیں۔',
      'جسمانی سرگرمی، روزانہ 20 منٹ کی چہل قدمی بھی، بے چینی کو نمایاں کم کرتی ہے۔',
      'چائے، کافی اور سگریٹ کم کریں، یہ دونوں دھڑکن اور بے چینی براہِ راست بڑھاتے ہیں۔',
      'کسی قابلِ اعتماد شخص سے بات کریں۔ بات کہہ دینا کمزوری نہیں، اور اس سے واقعی فرق پڑتا ہے۔'
    ],
    meds: ['hydrationRest'],
    seeDoctorIf: ['Anxiety or low mood lasting more than 2 weeks, or affecting study, work or sleep', 'Panic attacks that are becoming frequent', 'Any thought of harming yourself - seek help the same day'],
    seeDoctorIf_ur: ['بے چینی یا اداسی دو ہفتے سے زیادہ رہے، یا پڑھائی، کام یا نیند متاثر ہو', 'گھبراہٹ کے دورے بار بار ہونے لگیں', 'خود کو نقصان پہنچانے کا کوئی خیال آئے تو اسی دن مدد لیں']
  },
  {
    id: 'heat_exhaustion',
    name: 'Heat exhaustion / dehydration',
    name_ur: 'گرمی کا اثر اور پانی کی کمی',
    keywords: ['heat stroke', 'heat exhaustion', 'dehydration', 'too much heat', 'weakness in sun',
      'dizzy in heat', 'sweating a lot', 'thirsty weak',
      'garmi lag gai', 'loo lag gai', 'pani ki kami', 'garmi se kamzori',
      'گرمی لگ گئی', 'لو لگ گئی', 'پانی کی کمی', 'گرمی سے کمزوری'],
    advice: [
      'Move to a cool shaded place immediately and lie down with the legs slightly raised.',
      'Sip ORS or lemon water with a pinch of salt - plain water alone does not replace lost salts.',
      'Loosen clothing and cool the skin with a wet cloth or a fan.',
      'Avoid going out between 11 am and 4 pm during a heatwave.'
    ],
    advice_ur: [
      'فوراً ٹھنڈی سایہ دار جگہ پر جائیں اور ٹانگیں تھوڑی اونچی کر کے لیٹ جائیں۔',
      'او آر ایس یا چٹکی بھر نمک والا لیموں پانی گھونٹ گھونٹ پئیں، صرف سادہ پانی نمکیات پورے نہیں کرتا۔',
      'کپڑے ڈھیلے کریں اور گیلے کپڑے یا پنکھے سے جسم ٹھنڈا کریں۔',
      'گرمی کی لہر میں صبح 11 سے شام 4 بجے کے درمیان باہر نکلنے سے گریز کریں۔'
    ],
    meds: ['ors', 'hydrationRest', 'coldCompress'],
    seeDoctorIf: ['Confusion, fainting, or hot dry skin with no sweating - this is heat stroke, an emergency', 'No urine passed for many hours', 'Vomiting that prevents drinking fluids'],
    seeDoctorIf_ur: ['ذہنی الجھن، بے ہوشی، یا جلد گرم اور خشک اور پسینہ بند، یہ ہیٹ اسٹروک ہے، ایمرجنسی', 'کئی گھنٹوں سے پیشاب نہ آیا ہو', 'الٹی کی وجہ سے کچھ پیا نہ جا رہا ہو']
  },
  {
    id: 'minor_wound',
    name: 'Minor cut, graze or small burn',
    name_ur: 'معمولی زخم یا جلنا',
    keywords: ['cut', 'wound', 'scrape', 'graze', 'small burn', 'burnt my hand', 'blister', 'bruise',
      'zakhm', 'kat gaya', 'jal gaya', 'chot lag gai', 'khuraash',
      'زخم', 'کٹ گیا', 'جل گیا', 'چوٹ لگ گئی', 'چھالا'],
    advice: [
      'For a burn: hold it under cool running water for 20 minutes. Not ice, not toothpaste, not oil.',
      'For a cut: press with a clean cloth for 5-10 minutes to stop the bleeding, then wash with clean water.',
      'Cover with a clean dressing and change it daily.',
      'Do not burst blisters - the skin over them is a natural sterile cover.'
    ],
    advice_ur: [
      'جلنے پر: 20 منٹ تک ٹھنڈے بہتے پانی کے نیچے رکھیں۔ برف، ٹوتھ پیسٹ یا تیل ہرگز نہیں۔',
      'کٹ لگنے پر: صاف کپڑے سے 5 تا 10 منٹ دبائیں تاکہ خون رکے، پھر صاف پانی سے دھوئیں۔',
      'صاف پٹی سے ڈھانپیں اور روزانہ بدلیں۔',
      'آبلے نہ پھوڑیں، ان کے اوپر کی جلد قدرتی حفاظتی تہہ ہے۔'
    ],
    meds: ['antiseptic', 'paracetamol', 'coldCompress'],
    seeDoctorIf: ['A deep or gaping wound, one that will not stop bleeding, or a burn larger than your palm', 'A burn on the face, hands, joints or genitals, or any electrical or chemical burn', 'Increasing redness, swelling, pus or fever after 2 days, or any animal bite or rusty-object injury (tetanus)'],
    seeDoctorIf_ur: ['گہرا یا کھلا زخم، خون نہ رکے، یا ہتھیلی سے بڑا جلا ہوا حصہ', 'چہرے، ہاتھوں، جوڑوں یا نازک اعضا کا جلنا، یا بجلی یا کیمیکل سے جلنا', 'دو دن بعد سرخی، سوجن، پیپ یا بخار بڑھے، یا جانور کا کاٹا یا زنگ آلود چیز سے زخم (ٹیٹنس)']
  },
  {
    id: 'piles',
    strong: ['piles', 'hemorrhoids', 'haemorrhoids', 'bawaseer', 'بواسیر'],
    name: 'Piles (haemorrhoids)',
    name_ur: 'بواسیر',
    keywords: ['piles', 'hemorrhoids', 'haemorrhoids', 'pain during stool', 'lump near anus',
      'bleeding while passing stool',
      'bawaseer', 'pakhane me khoon', 'pakhana karte waqt dard',
      'بواسیر', 'پاخانے میں خون', 'پاخانہ کرتے وقت درد'],
    advice: [
      'Soften the stool - fibre and water do more than any cream. Straining is what causes and worsens piles.',
      'A warm sitz bath (sitting in warm water) for 10-15 minutes twice a day relieves pain well.',
      'Do not sit on the toilet for long periods, and leave the phone outside.',
      'Any bleeding from the back passage should be examined by a doctor at least once - do not assume it is only piles.'
    ],
    advice_ur: [
      'پاخانہ نرم رکھیں، ریشہ اور پانی کسی بھی کریم سے زیادہ فائدہ دیتے ہیں۔ زور لگانا ہی بواسیر کی وجہ اور بگاڑ ہے۔',
      'دن میں دو بار 10 تا 15 منٹ نیم گرم پانی میں بیٹھنا درد میں کافی آرام دیتا ہے۔',
      'بیت الخلا میں دیر تک نہ بیٹھیں، اور موبائل باہر رکھیں۔',
      'پاخانے کے راستے سے خون آنے پر ایک بار ڈاکٹر سے ضرور معائنہ کروائیں، یہ فرض نہ کریں کہ صرف بواسیر ہے۔'
    ],
    meds: ['ispaghula', 'lactulose', 'paracetamol'],
    seeDoctorIf: ['Heavy or persistent bleeding, or blood mixed into the stool', 'A painful hard lump that has appeared suddenly', 'Bleeding with weight loss or a change in bowel habit, especially over age 40'],
    seeDoctorIf_ur: ['زیادہ یا مسلسل خون، یا خون پاخانے میں ملا ہوا', 'اچانک نمودار ہونے والی دردناک سخت گلٹی', 'خون کے ساتھ وزن کم ہونا یا پاخانے کی عادت بدلنا، خاص طور پر 40 سال سے اوپر']
  },
  {
    id: 'dizziness',
    name: 'Dizziness / weakness',
    name_ur: 'چکر اور کمزوری',
    keywords: ['dizzy', 'dizziness', 'vertigo', 'feeling faint', 'lightheaded', 'weakness', 'fatigue',
      'tired all the time', 'low bp', 'spinning',
      'chakkar aate hain', 'kamzori', 'sar ghoomta', 'nqahat', 'thakan',
      'چکر آتے ہیں', 'کمزوری', 'سر گھومتا', 'تھکن', 'نقاہت'],
    advice: [
      'Stand up slowly from lying or sitting - sudden standing is the commonest cause of a head rush.',
      'Do not skip meals, and drink enough water. Low sugar and dehydration cause most everyday dizziness.',
      'If the room spins when you turn your head, sit down immediately and hold something stable.',
      'Persistent tiredness deserves basic blood tests: haemoglobin, blood sugar, thyroid and vitamin D. Anaemia is very common.'
    ],
    advice_ur: [
      'لیٹنے یا بیٹھنے کے بعد آہستہ اٹھیں، اچانک کھڑے ہونا چکر کی سب سے عام وجہ ہے۔',
      'کھانا نہ چھوڑیں اور مناسب پانی پئیں۔ شوگر کم ہونا اور پانی کی کمی روزمرہ چکروں کی بڑی وجہ ہیں۔',
      'سر گھمانے پر کمرہ گھومتا محسوس ہو تو فوراً بیٹھ جائیں اور کسی مضبوط چیز کو تھام لیں۔',
      'مسلسل تھکن پر بنیادی ٹیسٹ کروائیں: خون کی کمی، شوگر، تھائیرائیڈ اور وٹامن ڈی۔ خون کی کمی بہت عام ہے۔'
    ],
    meds: ['ors', 'hydrationRest'],
    seeDoctorIf: ['Dizziness with chest pain, palpitations, or fainting', 'Dizziness with slurred speech, double vision or one-sided weakness - emergency', 'Weakness with shortness of breath or very pale skin'],
    seeDoctorIf_ur: ['چکر کے ساتھ سینے میں درد، دھڑکن کی بے ترتیبی، یا بے ہوشی', 'چکر کے ساتھ زبان لڑکھڑانا، دُہرا نظر آنا یا ایک طرف کمزوری، یہ ایمرجنسی ہے', 'کمزوری کے ساتھ سانس پھولنا یا جسم کا بہت زرد ہو جانا']
  },
  {
    id: 'asthma_wheeze',
    strong: ['asthma', 'دمہ', 'dama', 'inhaler', 'انہیلر'],
    name: 'Wheezing / asthma flare',
    name_ur: 'دمہ یا سانس کی سیٹی',
    keywords: ['wheezing', 'asthma', 'whistling sound breathing', 'chest tightness breathing',
      'inhaler', 'breathless on exertion',
      'dama', 'saans me seeti', 'saans phoolta hai', 'inhaler chahiye',
      'دمہ', 'سانس میں سیٹی', 'سانس پھولتا', 'سینے میں جکڑن'],
    advice: [
      'Sit upright and stay calm. Lying flat makes breathing harder.',
      'If you have a prescribed reliever inhaler (salbutamol/Ventolin), use it exactly as your doctor instructed.',
      'Get away from the trigger: smoke, dust, cold air, strong smells, or a pet.',
      'Asthma needs a doctor-prescribed plan. This app cannot substitute for an inhaler prescription.'
    ],
    advice_ur: [
      'سیدھا بیٹھیں اور پرسکون رہیں۔ سیدھا لیٹنے سے سانس مزید مشکل ہو جاتی ہے۔',
      'اگر ڈاکٹر نے انہیلر (وینٹولن) تجویز کیا ہوا ہے تو اسے بالکل ہدایت کے مطابق استعمال کریں۔',
      'وجہ سے دور ہو جائیں: دھواں، گرد، ٹھنڈی ہوا، تیز خوشبو یا کوئی جانور۔',
      'دمے کے لیے ڈاکٹر کا مقرر کردہ علاج ضروری ہے۔ یہ ایپ انہیلر کے نسخے کا متبادل نہیں۔'
    ],
    meds: [],
    seeDoctorIf: ['Breathlessness at rest, difficulty speaking full sentences, or blue lips - emergency', 'Reliever inhaler not helping, or needed more than every 4 hours', 'Night-time waking with cough or wheeze more than once a week'],
    seeDoctorIf_ur: ['آرام کی حالت میں سانس پھولنا، پورا جملہ نہ بول پانا، یا ہونٹ نیلے، یہ ایمرجنسی ہے', 'انہیلر سے افاقہ نہ ہو، یا ہر 4 گھنٹے سے پہلے ضرورت پڑے', 'ہفتے میں ایک سے زیادہ بار رات کو کھانسی یا سانس کی وجہ سے آنکھ کھلے']
  }
];

module.exports = { CONDITIONS };
