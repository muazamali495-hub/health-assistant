'use strict';

/**
 * Emergency red flags. If any of these match, the assistant stops giving
 * self-care advice and tells the user to seek emergency care immediately.
 * Nothing here is a diagnosis - these are "go now, do not wait" patterns.
 *
 * Each rule carries English, Urdu-script and Roman-Urdu keywords, because
 * users type Urdu in both scripts.
 */

const RED_FLAGS = [
  {
    id: 'cardiac',
    keywords: [
      'chest pain', 'chest pressure', 'chest tightness', 'crushing pain', 'pain in chest',
      'heart attack', 'pain radiating to arm', 'pain in left arm', 'jaw pain with sweating',
      'سینے میں درد', 'دل کا دورہ', 'سینے پر بوجھ', 'بائیں بازو میں درد',
      'seene mein dard', 'seene me dard', 'dil ka dora', 'chaati mein dard', 'dil ka daura'
    ],
    en: 'Chest pain or pressure can be a heart attack. Do not drive yourself. Get to the nearest emergency room now, or call Rescue 1122.',
    ur: 'سینے میں درد یا دباؤ دل کے دورے کی علامت ہو سکتی ہے۔ خود گاڑی نہ چلائیں۔ فوراً قریبی ہسپتال کے ایمرجنسی وارڈ جائیں یا ریسکیو 1122 کو کال کریں۔'
  },
  {
    id: 'breathing',
    keywords: [
      'cannot breathe', "can't breathe", 'difficulty breathing', 'shortness of breath',
      'gasping', 'blue lips', 'choking', 'severe breathlessness',
      'سانس نہیں آ رہا', 'سانس لینے میں دشواری', 'دم گھٹ رہا', 'ہونٹ نیلے',
      'saans nahi aa raha', 'saans lene me mushkil', 'dam ghut raha', 'sans nahi aa rahi'
    ],
    en: 'Serious difficulty breathing is an emergency. Sit upright, loosen tight clothing, and get emergency help immediately (Rescue 1122).',
    ur: 'سانس لینے میں شدید دشواری ایمرجنسی ہے۔ سیدھا بیٹھیں، تنگ کپڑے ڈھیلے کریں اور فوراً ایمرجنسی مدد لیں (ریسکیو 1122)۔'
  },
  {
    id: 'stroke',
    keywords: [
      'face drooping', 'slurred speech', 'cannot speak', 'weakness on one side',
      'one side of body weak', 'numbness on one side', 'sudden confusion', 'stroke',
      'فالج', 'منہ ٹیڑھا', 'زبان لڑکھڑا', 'ایک طرف کمزوری', 'جسم کا ایک حصہ سن',
      'falij', 'muh terha', 'zaban larkharahat', 'ek taraf kamzori'
    ],
    en: 'These are stroke warning signs. Every minute counts - go to a hospital emergency department right now.',
    ur: 'یہ فالج کی علامات ہیں۔ ایک ایک منٹ قیمتی ہے، ابھی فوراً ہسپتال کی ایمرجنسی میں جائیں۔'
  },
  {
    id: 'bleeding',
    keywords: [
      'vomiting blood', 'blood in vomit', 'blood in stool', 'black stool', 'coughing blood',
      'heavy bleeding', 'bleeding will not stop', 'blood in urine',
      'خون کی الٹی', 'پاخانے میں خون', 'کالا پاخانہ', 'کھانسی میں خون', 'شدید خون بہنا', 'پیشاب میں خون',
      'khoon ki ulti', 'pakhane me khoon', 'kala pakhana', 'khoon aa raha'
    ],
    en: 'Bleeding from the stomach, lungs or a wound that will not stop is an emergency. Go to a hospital now.',
    ur: 'معدے، پھیپھڑوں یا زخم سے خون آنا جو رک نہ رہا ہو، ایمرجنسی ہے۔ ابھی ہسپتال جائیں۔'
  },
  {
    id: 'consciousness',
    keywords: [
      'unconscious', 'fainted', 'passed out', 'not waking up', 'seizure', 'fits',
      'convulsions', 'head injury', 'hit my head hard',
      'بے ہوش', 'دورہ پڑا', 'مرگی کا دورہ', 'سر پر شدید چوٹ', 'ہوش نہیں آ رہا',
      'behosh', 'be hosh', 'dora para', 'mirgi', 'sar par chot'
    ],
    en: 'Loss of consciousness, a seizure, or a serious head injury needs emergency care immediately. Do not give food or water to an unconscious person.',
    ur: 'بے ہوشی، دورہ، یا سر کی شدید چوٹ میں فوری ایمرجنسی علاج ضروری ہے۔ بے ہوش شخص کو کچھ کھلائیں پلائیں نہیں۔'
  },
  {
    id: 'severe_abdomen',
    keywords: [
      'severe abdominal pain', 'unbearable stomach pain', 'rigid stomach', 'appendix pain',
      'pain in right lower abdomen', 'cannot stand the stomach pain',
      'پیٹ میں شدید درد', 'ناقابل برداشت پیٹ درد', 'اپینڈکس', 'پیٹ سخت',
      'pait me shadeed dard', 'pet me bohat dard', 'appendix ka dard'
    ],
    en: 'Severe, sudden or unbearable abdominal pain can mean appendicitis or another surgical emergency. Do not eat, drink or take a painkiller - get to a hospital.',
    ur: 'پیٹ میں شدید یا اچانک ناقابلِ برداشت درد اپینڈکس یا کسی اور سرجیکل ایمرجنسی کی علامت ہو سکتا ہے۔ کچھ کھائیں پئیں نہیں، درد کی گولی نہ لیں، ہسپتال جائیں۔'
  },
  {
    id: 'meningitis',
    keywords: [
      'stiff neck with fever', 'neck stiffness fever', 'rash with fever', 'fever and rash',
      'light hurts my eyes', 'severe headache with fever', 'worst headache of my life',
      'گردن اکڑ گئی بخار', 'بخار کے ساتھ دانے', 'روشنی سے تکلیف', 'شدید سر درد اور بخار',
      'gardan akar', 'bukhar aur dane', 'sakht sar dard bukhar'
    ],
    en: 'Fever with a stiff neck, a rash, light sensitivity or the worst headache you have ever had can be meningitis. Go to an emergency department now.',
    ur: 'بخار کے ساتھ گردن کا اکڑنا، جسم پر دانے، روشنی سے تکلیف یا زندگی کا شدید ترین سر درد گردن توڑ بخار ہو سکتا ہے۔ ابھی ایمرجنسی جائیں۔'
  },
  {
    id: 'anaphylaxis',
    keywords: [
      'swollen face', 'swollen tongue', 'throat closing', 'lips swelling', 'allergic reaction severe',
      'hives all over with breathing', 'anaphylaxis',
      'چہرہ سوج', 'زبان سوج', 'گلا بند ہو رہا', 'ہونٹ سوج',
      'chehra soj', 'zaban soj', 'gala band ho raha'
    ],
    en: 'Swelling of the face, lips, tongue or throat is a severe allergic reaction. This can block the airway. Get emergency help immediately.',
    ur: 'چہرے، ہونٹوں، زبان یا گلے کی سوجن شدید الرجک ری ایکشن ہے۔ اس سے سانس کی نالی بند ہو سکتی ہے۔ فوراً ایمرجنسی مدد لیں۔'
  },
  {
    id: 'pregnancy',
    keywords: [
      'pregnant and bleeding', 'bleeding during pregnancy', 'pregnant severe pain',
      'no fetal movement', 'baby not moving', 'water broke',
      'حمل میں خون', 'حاملہ اور خون', 'بچے کی حرکت نہیں',
      'hamal me khoon', 'hamla khoon', 'bache ki harkat nahi'
    ],
    en: 'Bleeding, severe pain or reduced baby movement during pregnancy needs to be checked by a doctor or hospital right away.',
    ur: 'حمل کے دوران خون آنا، شدید درد، یا بچے کی حرکت کم ہونا فوری طور پر ڈاکٹر یا ہسپتال سے چیک کرانا ضروری ہے۔'
  },
  {
    id: 'infant',
    keywords: [
      'newborn fever', 'baby fever', 'infant fever', 'my baby is not feeding',
      'child not waking', 'baby limp', 'sunken eyes baby',
      'نوزائیدہ بخار', 'شیر خوار بخار', 'بچہ دودھ نہیں پی رہا', 'بچہ سست',
      'naozaida bukhar', 'bacha dodh nahi pi raha', 'bacha sust'
    ],
    en: 'Fever, poor feeding or unusual sleepiness in a baby under 3 months is always an emergency. Take the baby to a doctor immediately - do not give any medicine at home.',
    ur: 'تین ماہ سے چھوٹے بچے میں بخار، دودھ نہ پینا یا غیر معمولی سستی ہمیشہ ایمرجنسی ہے۔ بچے کو فوراً ڈاکٹر کے پاس لے جائیں، گھر پر کوئی دوا نہ دیں۔'
  },
  {
    id: 'self_harm',
    keywords: [
      'want to die', 'kill myself', 'suicide', 'end my life', 'self harm', 'hurt myself',
      'no reason to live', 'overdose',
      'خودکشی', 'مرنا چاہتا', 'جینا نہیں چاہتا', 'اپنے آپ کو نقصان',
      'khudkushi', 'marna chahta', 'jeena nahi chahta'
    ],
    en: 'I am really glad you said this. This is not something to handle alone, and no medicine from this app is the answer. Please talk to someone right now - a person you trust, or Umang Pakistan on 0311-7786264, or the Ministry of Health helpline 1166. If you feel you may act on it, go to a hospital emergency department.',
    ur: 'آپ نے یہ بات کہی، یہ اچھا کیا۔ اسے اکیلے سہنے کی ضرورت نہیں، اور اس ایپ کی کوئی دوا اس کا حل نہیں۔ ابھی کسی سے بات کریں: کوئی قابلِ اعتماد شخص، اُمنگ پاکستان 0311-7786264، یا وزارتِ صحت کی ہیلپ لائن 1166۔ اگر آپ کو لگے کہ آپ خود کو نقصان پہنچا سکتے ہیں تو ہسپتال کی ایمرجنسی میں جائیں۔',
    tone: 'support'
  },
  {
    id: 'poisoning',
    keywords: [
      'swallowed poison', 'took too many pills', 'poisoning', 'drank kerosene',
      'snake bite', 'dog bite', 'scorpion sting',
      'زہر', 'زیادہ گولیاں کھا لیں', 'سانپ نے کاٹا', 'کتے نے کاٹا',
      'zeher', 'saanp ne kata', 'kutte ne kata', 'zyada goliyan kha li'
    ],
    en: 'Poisoning, an overdose, or a snake or dog bite needs emergency treatment. Do not try to induce vomiting. Take the container or details of what was taken with you to the hospital.',
    ur: 'زہر، زیادہ گولیاں، یا سانپ یا کتے کا کاٹنا ایمرجنسی علاج کا متقاضی ہے۔ الٹی کرانے کی کوشش نہ کریں۔ جو چیز کھائی گئی ہو اس کا ڈبہ ساتھ ہسپتال لے جائیں۔'
  },
  {
    id: 'dehydration_severe',
    keywords: [
      'no urine for a day', 'not passing urine', 'sunken eyes', 'cannot keep water down',
      'vomiting everything', 'very weak cannot stand',
      'پیشاب نہیں آ رہا', 'آنکھیں اندر دھنس', 'پانی بھی نہیں رک رہا', 'کھڑا نہیں ہو سکتا',
      'peshab nahi aa raha', 'pani bhi ulti', 'khara nahi ho sakta'
    ],
    en: 'Not passing urine, sunken eyes, or vomiting up even water means severe dehydration. This needs a drip at a hospital, not home treatment.',
    ur: 'پیشاب نہ آنا، آنکھوں کا اندر دھنسنا، یا پانی بھی نہ ٹھہرنا شدید ڈی ہائیڈریشن ہے۔ اس کے لیے ہسپتال میں ڈرپ چاہیے، گھریلو علاج نہیں۔'
  }
];

const EMERGENCY_CONTACTS = {
  en: [
    'Rescue 1122 - ambulance and emergency (nationwide)',
    'Edhi Ambulance - 115',
    'Ministry of Health helpline - 1166',
    'Umang mental health helpline - 0311-7786264'
  ],
  ur: [
    'ریسکیو 1122 - ایمبولینس اور ایمرجنسی',
    'ایدھی ایمبولینس - 115',
    'وزارتِ صحت ہیلپ لائن - 1166',
    'اُمنگ ذہنی صحت ہیلپ لائن - 0311-7786264'
  ]
};

module.exports = { RED_FLAGS, EMERGENCY_CONTACTS };
