import type { LangCode } from "./languages";

/**
 * Ready-made invitation copy per language.
 * Used by the "Quick phrases" panel and by the multi-event story generator,
 * so users get correct native text instead of typing everything themselves.
 */

type Pack = {
  events: { key: string; title: string; tagline: string; emoji: string }[];
  phrases: string[];
  labels: { date: string; time: string; venue: string; rsvp: string; withLove: string };
};

const EN: Pack = {
  events: [
    { key: "main", title: "Wedding Invitation", tagline: "Together with their families", emoji: "💍" },
    { key: "haldi", title: "Haldi Ceremony", tagline: "A morning of turmeric & blessings", emoji: "💛" },
    { key: "mehendi", title: "Mehendi Ceremony", tagline: "Henna, music & dance", emoji: "🌿" },
    { key: "sangeet", title: "Sangeet Night", tagline: "A night of music & dance", emoji: "🎶" },
    { key: "shaadi", title: "The Wedding", tagline: "Two souls, one journey", emoji: "✨" },
    { key: "reception", title: "Reception", tagline: "Dinner & celebrations", emoji: "🥂" },
  ],
  phrases: ["You're Invited", "Save the Date", "RSVP by 1st of next month", "Dinner to follow", "With love & blessings"],
  labels: { date: "Date", time: "Time", venue: "Venue", rsvp: "RSVP", withLove: "With love" },
};

export const PACKS: Partial<Record<LangCode, Pack>> = {
  en: EN,

  hi: {
    events: [
      { key: "main", title: "विवाह निमंत्रण", tagline: "अपने परिवारों के साथ", emoji: "💍" },
      { key: "haldi", title: "हल्दी समारोह", tagline: "हल्दी और आशीर्वाद की सुबह", emoji: "💛" },
      { key: "mehendi", title: "मेहंदी समारोह", tagline: "मेहंदी, संगीत और नृत्य", emoji: "🌿" },
      { key: "sangeet", title: "संगीत समारोह", tagline: "संगीत और नृत्य की रात", emoji: "🎶" },
      { key: "shaadi", title: "शुभ विवाह", tagline: "दो आत्माएँ, एक यात्रा", emoji: "✨" },
      { key: "reception", title: "प्रीतिभोज", tagline: "भोजन और उत्सव", emoji: "🥂" },
    ],
    phrases: ["आपका सादर आमंत्रण", "शुभ विवाह", "कृपया आगमन करें", "प्रीतिभोज उपरांत", "शुभकामनाओं सहित"],
    labels: { date: "दिनांक", time: "समय", venue: "स्थान", rsvp: "संपर्क", withLove: "शुभकामनाओं सहित" },
  },

  mr: {
    events: [
      { key: "main", title: "लग्न निमंत्रण", tagline: "दोन्ही कुटुंबांकडून", emoji: "💍" },
      { key: "haldi", title: "हळदी समारंभ", tagline: "हळदीची आनंदी सकाळ", emoji: "💛" },
      { key: "mehendi", title: "मेंदी समारंभ", tagline: "मेंदी, संगीत आणि गजर", emoji: "🌿" },
      { key: "sangeet", title: "संगीत समारंभ", tagline: "संगीत आणि नृत्याची संध्याकाळ", emoji: "🎶" },
      { key: "shaadi", title: "शुभ लग्न", tagline: "दोन जीव, एक प्रवास", emoji: "✨" },
      { key: "reception", title: "स्वागत समारंभ", tagline: "जेवण आणि उत्सव", emoji: "🥂" },
    ],
    phrases: ["आपले मनःपूर्वक आमंत्रण", "शुभ लग्न", "कृपया उपस्थित रहा", "जेवणाचे आमंत्रण", "शुभेच्छांसह"],
    labels: { date: "दिनांक", time: "वेळ", venue: "ठिकाण", rsvp: "संपर्क", withLove: "शुभेच्छांसह" },
  },

  raj: {
    events: [
      { key: "main", title: "विवाह निमंत्रण", tagline: "दोन्ही परिवारों की ओर से", emoji: "💍" },
      { key: "haldi", title: "हल्दी रस्म", tagline: "बागो की हल्दी", emoji: "💛" },
      { key: "mehendi", title: "मेहंदी रस्म", tagline: "मेहंदी, गीत और घूमर", emoji: "🌿" },
      { key: "sangeet", title: "संगीत संध्या", tagline: "गीत-संगीत की रात", emoji: "🎶" },
      { key: "shaadi", title: "शुभ विवाह", tagline: "सात जनमों का साथ", emoji: "✨" },
      { key: "reception", title: "प्रीतिभोज", tagline: "भोजन और उत्सव", emoji: "🥂" },
    ],
    phrases: ["पधारो म्हारे देस", "शुभ विवाह", "कृपया पधारो", "भोज प्रीतिभोज", "शुभकामना साथ"],
    labels: { date: "तारीख", time: "समय", venue: "ठिकाण", rsvp: "संपर्क", withLove: "शुभकामना साथ" },
  },

  pa: {
    events: [
      { key: "main", title: "ਵਿਆਹ ਸੱਦਾ", tagline: "ਦੋਵੇਂ ਪਰਿਵਾਰਾਂ ਵੱਲੋਂ", emoji: "💍" },
      { key: "haldi", title: "ਹਲਦੀ ਰਸਮ", tagline: "ਹਲਦੀ ਅਤੇ ਅਸੀਸਾਂ ਦੀ ਸਵੇਰ", emoji: "💛" },
      { key: "mehendi", title: "ਮਿਹੰਦੀ ਰਸਮ", tagline: "ਮਿਹੰਦੀ, ਸੰਗੀਤ ਅਤੇ ਡਾਂਸ", emoji: "🌿" },
      { key: "sangeet", title: "ਸੰਗੀਤ ਰਾਤ", tagline: "ਸੰਗੀਤ ਅਤੇ ਡਾਂਸ ਦੀ ਰਾਤ", emoji: "🎶" },
      { key: "shaadi", title: "ਵਿਆਹ", tagline: "ਦੋ ਰੂਹਾਂ, ਇੱਕ ਸਫ਼ਰ", emoji: "✨" },
      { key: "reception", title: "ਰਿਸੈਪਸ਼ਨ", tagline: "ਖਾਣਾ ਅਤੇ ਜਸ਼ਨ", emoji: "🥂" },
    ],
    phrases: ["ਤੁਹਾਡਾ ਜੀ ਆਇਆ ਨੂੰ", "ਵਿਆਹ ਦਾ ਸੱਦਾ", "ਕਿਰਪਾ ਕਰਕੇ ਆਓ", "ਖਾਣੇ ਦਾ ਸੱਦਾ", "ਸ਼ੁਭਕਾਮਨਾਵਾਂ ਨਾਲ"],
    labels: { date: "ਤਾਰੀਖ਼", time: "ਸਮਾਂ", venue: "ਥਾਂ", rsvp: "ਸੰਪਰਕ", withLove: "ਸ਼ੁਭਕਾਮਨਾਵਾਂ ਨਾਲ" },
  },

  gu: {
    events: [
      { key: "main", title: "લગ્ન આમંત્રણ", tagline: "બંને પરિવારો તરફથી", emoji: "💍" },
      { key: "haldi", title: "હળદી સમારંભ", tagline: "હળદી અને આશીર્વાદની સવાર", emoji: "💛" },
      { key: "mehendi", title: "મહેંદી સમારંભ", tagline: "મહેંદી, સંગીત અને ડાન્સ", emoji: "🌿" },
      { key: "sangeet", title: "સંગીત સંધ્યા", tagline: "સંગીત અને ડાન્સની રાત", emoji: "🎶" },
      { key: "shaadi", title: "શુભ લગ્ન", tagline: "બે આત્મા, એક યાત્રા", emoji: "✨" },
      { key: "reception", title: "સ્વાગત સમારંભ", tagline: "ભોજન અને ઉત્સવ", emoji: "🥂" },
    ],
    phrases: ["તમારું હાર્દિક આમંત્રણ", "શુભ લગ્ન", "કૃપા કરીને આવજો", "ભોજન આમંત્રણ", "શુભેચ્છાઓ સાથે"],
    labels: { date: "તારીખ", time: "સમય", venue: "સ્થળ", rsvp: "સંપર્ક", withLove: "શુભેચ્છાઓ સાથે" },
  },

  bn: {
    events: [
      { key: "main", title: "বিবাহ নিমন্ত্রণ", tagline: "দুই পরিবারের পক্ষ থেকে", emoji: "💍" },
      { key: "haldi", title: "হলুদ অনুষ্ঠান", tagline: "হলুদ ও আশীর্বাদের সকাল", emoji: "💛" },
      { key: "mehendi", title: "মেহেদি অনুষ্ঠান", tagline: "মেহেদি, সংগীত ও নৃত্য", emoji: "🌿" },
      { key: "sangeet", title: "সংগীত রাত", tagline: "সংগীত ও নৃত্যের রাত", emoji: "🎶" },
      { key: "shaadi", title: "শুভ বিবাহ", tagline: "দুটি আত্মা, এক যাত্রা", emoji: "✨" },
      { key: "reception", title: "ভোজসভা", tagline: "খাবার ও উদযাপন", emoji: "🥂" },
    ],
    phrases: ["আপনার আন্তরিক নিমন্ত্রণ", "শুভ বিবাহ", "অনুগ্রহ করে আসুন", "ভোজের নিমন্ত্রণ", "শুভেচ্ছা সহ"],
    labels: { date: "তারিখ", time: "সময়", venue: "স্থান", rsvp: "যোগাযোগ", withLove: "শুভেচ্ছা সহ" },
  },

  ta: {
    events: [
      { key: "main", title: "திருமண அழைப்பு", tagline: "இரு குடும்பங்களின் அழைப்பு", emoji: "💍" },
      { key: "haldi", title: "மஞ்சள் நிகழ்ச்சி", tagline: "மஞ்சள் மற்றும் ஆசீர்வாதம்", emoji: "💛" },
      { key: "mehendi", title: "மெஹந்தி நிகழ்ச்சி", tagline: "மெஹந்தி, இசை மற்றும் நடனம்", emoji: "🌿" },
      { key: "sangeet", title: "இசை இரவு", tagline: "இசை மற்றும் நடனம்", emoji: "🎶" },
      { key: "shaadi", title: "திருமணம்", tagline: "இரு உயிர்கள், ஒரு பயணம்", emoji: "✨" },
      { key: "reception", title: "வரவேற்பு", tagline: "உணவு மற்றும் கொண்டாட்டம்", emoji: "🥂" },
    ],
    phrases: ["உங்களை அன்புடன் அழைக்கிறோம்", "திருமண அழைப்பு", "வருகை தாருங்கள்", "உணவு அழைப்பு", "வாழ்த்துகளுடன்"],
    labels: { date: "தேதி", time: "நேரம்", venue: "இடம்", rsvp: "தொடர்பு", withLove: "வாழ்த்துகளுடன்" },
  },

  te: {
    events: [
      { key: "main", title: "వివాహ ఆహ్వానం", tagline: "రెండు కుటుంబాల తరఫున", emoji: "💍" },
      { key: "haldi", title: "పసుపు కార్యక్రమం", tagline: "పసుపు మరియు ఆశీర్వాదాలు", emoji: "💛" },
      { key: "mehendi", title: "మెహందీ కార్యక్రమం", tagline: "మెహందీ, సంగీతం మరియు నృత్యం", emoji: "🌿" },
      { key: "sangeet", title: "సంగీత రాత్రి", tagline: "సంగీతం మరియు నృత్యం", emoji: "🎶" },
      { key: "shaadi", title: "శుభ వివాహం", tagline: "రెండు ఆత్మలు, ఒక ప్రయాణం", emoji: "✨" },
      { key: "reception", title: "విందు", tagline: "భోజనం మరియు వేడుక", emoji: "🥂" },
    ],
    phrases: ["మీరు ఆహ్వానించబడ్డారు", "శుభ వివాహం", "దయచేసి రండి", "భోజన ఆహ్వానం", "శుభాకాంక్షలతో"],
    labels: { date: "తేదీ", time: "సమయం", venue: "వేదిక", rsvp: "సంప్రదించండి", withLove: "శుభాకాంక్షలతో" },
  },

  ml: {
    events: [
      { key: "main", title: "വിവാഹ ക്ഷണം", tagline: "രണ്ട് കുടുംബങ്ങളുടെയും ക്ഷണം", emoji: "💍" },
      { key: "haldi", title: "മഞ്ഞല് ചടങ്ങ്", tagline: "മഞ്ഞളും അനുഗ്രഹവും", emoji: "💛" },
      { key: "mehendi", title: "മെഹന്തി ചടങ്ങ്", tagline: "മെഹന്തി, സംഗീതം, നൃത്തം", emoji: "🌿" },
      { key: "sangeet", title: "സംഗീത രാവ്", tagline: "സംഗീതവും നൃത്തവും", emoji: "🎶" },
      { key: "shaadi", title: "വിവാഹം", tagline: "രണ്ട് ആത്മാക്കൾ, ഒരു യാത്ര", emoji: "✨" },
      { key: "reception", title: "സ്വീകരണം", tagline: "ഭക്ഷണവും ആഘോഷവും", emoji: "🥂" },
    ],
    phrases: ["സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു", "വിവാഹ ക്ഷണം", "ദയവായി വരിക", "ഭക്ഷണ ക്ഷണം", "ആശംസകളോടെ"],
    labels: { date: "തീയതി", time: "സമയം", venue: "സ്ഥലം", rsvp: "ബന്ധപ്പെടുക", withLove: "ആശംസകളോടെ" },
  },

  kn: {
    events: [
      { key: "main", title: "ಮದುವೆಯ ಆಹ್ವಾನ", tagline: "ಎರಡು ಕುಟುಂಬಗಳ ಆಹ್ವಾನ", emoji: "💍" },
      { key: "haldi", title: "ಅರಿಶಿನ ಸಮಾರಂಭ", tagline: "ಅರಿಶಿನ ಮತ್ತು ಆಶೀರ್ವಾದ", emoji: "💛" },
      { key: "mehendi", title: "ಮೆಹಂದಿ ಸಮಾರಂಭ", tagline: "ಮೆಹಂದಿ, ಸಂಗೀತ ಮತ್ತು ನೃತ್ಯ", emoji: "🌿" },
      { key: "sangeet", title: "ಸಂಗೀತ ರಾತ್ರಿ", tagline: "ಸಂಗೀತ ಮತ್ತು ನೃತ್ಯ", emoji: "🎶" },
      { key: "shaadi", title: "ಮದುವೆ", tagline: "ಎರಡು ಆತ್ಮ, ಒಂದು ಪಯಣ", emoji: "✨" },
      { key: "reception", title: "ಸ್ವಾಗತ ಸಮಾರಂಭ", tagline: "ಊಟ ಮತ್ತು ಸಂಭ್ರಮ", emoji: "🥂" },
    ],
    phrases: ["ನಿಮ್ಮನ್ನು ಆಹ್ವಾನಿಸುತ್ತಿದ್ದೇವೆ", "ಮದುವೆಯ ಆಹ್ವಾನ", "ದಯವಿಟ್ಟು ಬನ್ನಿ", "ಊಟದ ಆಹ್ವಾನ", "ಶುಭಾಶಯಗಳೊಂದಿಗೆ"],
    labels: { date: "ದಿನಾಂಕ", time: "ಸಮಯ", venue: "ಸ್ಥಳ", rsvp: "ಸಂಪರ್ಕ", withLove: "ಶುಭಾಶಯಗಳೊಂದಿಗೆ" },
  },

  or: {
    events: [
      { key: "main", title: "ବିବାହ ନିମନ୍ତ୍ରଣ", tagline: "ଦୁଇ ପରିବାରଙ୍କ ତରଫରୁ", emoji: "💍" },
      { key: "haldi", title: "ହଳଦୀ ଅନୁଷ୍ଠାନ", tagline: "ହଳଦୀ ଓ ଆଶୀର୍ବାଦ", emoji: "💛" },
      { key: "mehendi", title: "ମେହେଦି ଅନୁଷ୍ଠାନ", tagline: "ମେହେଦି, ସଙ୍ଗୀତ ଓ ନୃତ୍ୟ", emoji: "🌿" },
      { key: "sangeet", title: "ସଙ୍ଗୀତ ରାତି", tagline: "ସଙ୍ଗୀତ ଓ ନୃତ୍ୟ", emoji: "🎶" },
      { key: "shaadi", title: "ଶୁଭ ବିବାହ", tagline: "ଦୁଇ ଆତ୍ମା, ଗୋଟିଏ ଯାତ୍ରା", emoji: "✨" },
      { key: "reception", title: "ଭୋଜି", tagline: "ଖାଦ୍ୟ ଓ ଉତ୍ସବ", emoji: "🥂" },
    ],
    phrases: ["ଆପଣଙ୍କୁ ଆମନ୍ତ୍ରଣ", "ଶୁଭ ବିବାହ", "ଦୟାକରି ଆସନ୍ତୁ", "ଭୋଜି ନିମନ୍ତ୍ରଣ", "ଶୁଭେଚ୍ଛା ସହ"],
    labels: { date: "ତାରିଖ", time: "ସମୟ", venue: "ସ୍ଥାନ", rsvp: "ସମ୍ପର୍କ", withLove: "ଶୁଭେଚ୍ଛା ସହ" },
  },

  ur: {
    events: [
      { key: "main", title: "شادی کی دعوت", tagline: "دونوں خاندانوں کی جانب سے", emoji: "💍" },
      { key: "haldi", title: "ہلدی تقریب", tagline: "ہلدی اور دعاؤں کی صبح", emoji: "💛" },
      { key: "mehendi", title: "مہندی تقریب", tagline: "مہندی، موسیقی اور رقص", emoji: "🌿" },
      { key: "sangeet", title: "سنگیت کی رات", tagline: "موسیقی اور رقص کی رات", emoji: "🎶" },
      { key: "shaadi", title: "شادی", tagline: "دو روحیں، ایک سفر", emoji: "✨" },
      { key: "reception", title: "ولیمہ", tagline: "کھانا اور جشن", emoji: "🥂" },
    ],
    phrases: ["آپ کو دعوت دی جاتی ہے", "شادی کی دعوت", "براہ کرم تشریف لائیں", "ولیمے کی دعوت", "دعاؤں کے ساتھ"],
    labels: { date: "تاریخ", time: "وقت", venue: "مقام", rsvp: "رابطہ", withLove: "دعاؤں کے ساتھ" },
  },
};

export function pack(code?: string | null): Pack {
  return PACKS[(code as LangCode) ?? "en"] ?? EN;
}

export const EVENT_KEYS = EN.events.map((e) => e.key);
export type EventKey = (typeof EVENT_KEYS)[number];
