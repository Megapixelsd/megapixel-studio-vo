// ============================================
// MEGAPIXEL STUDIO VO - CONSTANTES
// ============================================

import type { VoiceProfile } from '../types';

export const DIALECTS = [
  {
    id: 'algerian',
    title: 'الجزائرية الدارجة',
    titleEn: 'Algerian Darija',
    profiles: [] as VoiceProfile[],
  },
  {
    id: 'fusha',
    title: 'العربية الفصحى',
    titleEn: 'Modern Standard Arabic',
    profiles: [] as VoiceProfile[],
  }
];

export const VOICE_TYPES = ['بالغ', 'كبار السن', 'شخصية كارتونية'];
export const VOICE_FIELDS = [
  { id: 'ads', title: 'إعلانات', titleEn: 'Advertising' },
  { id: 'doc', title: 'وثائقي', titleEn: 'Documentary' },
  { id: 'podcast', title: 'بودكاست', titleEn: 'Podcast' },
  { id: 'novels', title: 'روايات', titleEn: 'Novels' },
];

export const CATEGORY_STYLES: Record<string, { color: string; icon: string }> = {
  ads: { color: 'from-orange-500/20 to-red-500/20', icon: 'mic-ads' },
  doc: { color: 'from-blue-500/20 to-cyan-500/20', icon: 'mic-documentary' },
  podcast: { color: 'from-purple-500/20 to-pink-500/20', icon: 'mic-podcast' },
  novels: { color: 'from-emerald-500/20 to-teal-500/20', icon: 'mic-book' },
  corporate: { color: 'from-slate-500/20 to-gray-500/20', icon: 'mic-youtube' },
  cartoon: { color: 'from-yellow-500/20 to-orange-500/20', icon: 'mic-kids' },
  youtube: { color: 'from-red-500/20 to-pink-500/20', icon: 'mic-youtube' },
  drama: { color: 'from-indigo-500/20 to-purple-500/20', icon: 'mic-documentary' },
  edu: { color: 'from-green-500/20 to-emerald-500/20', icon: 'mic-book' },
};

export const STUDIO_CONTROLS = {
  temp: {
    title: 'درجة حرارة الصوت',
    titleEn: 'Vocal Warmth',
    options: [
      { label: 'دافئ', labelEn: 'Warm', desc: 'صوت دافئ مُشبع بنبرة إنسانية وعمق إحساس.', descEn: 'Warm voice saturated with human warmth.' },
      { label: 'متوازن', labelEn: 'Balanced', desc: 'صوت متوازن ومباشر وموضوعي.', descEn: 'Balanced, direct, and objective voice.' },
      { label: 'حاد', labelEn: 'Sharp', desc: 'صوت حاد محايد قليل العاطفة.', descEn: 'Sharp, neutral, low-emotion voice.' },
    ]
  },
  emotion: {
    title: 'مستوى الانفعال',
    titleEn: 'Emotion Level',
    options: [
      { label: 'هادئ', labelEn: 'Calm', desc: 'إلقاء سلس هادئ مناسب للمحتوى الهادئ.', descEn: 'Smooth delivery for quiet content.' },
      { label: 'متوسط', labelEn: 'Medium', desc: 'توازن بين الحماس والهدوء.', descEn: 'Balance of enthusiasm and calm.' },
      { label: 'قوي', labelEn: 'Strong', desc: 'نبرة مؤثرة مليئة بالحيوية.', descEn: 'Immersive tone filled with energy.' },
      { label: 'شديد', labelEn: 'Intense', desc: 'أداء قوي جدًا للمقاطع الدرامية.', descEn: 'Very powerful performance for drama.' },
    ]
  },
  speed: {
    title: 'سرعة الإلقاء',
    titleEn: 'Delivery Speed',
    options: [
      { label: 'بطيئة', labelEn: 'Slow', desc: 'لتقديم روايات وقصص طويلة بتركيز.', descEn: 'For novels and long stories.' },
      { label: 'متوسطة', labelEn: 'Normal', desc: 'عامة ومتوازنة لمعظم المحتوى.', descEn: 'General and balanced.' },
      { label: 'سريعة', labelEn: 'Fast', desc: 'للإعلانات والنصوص التسويقية.', descEn: 'For ads and marketing.' },
    ]
  },
  depth: {
    title: 'عمق النبرة',
    titleEn: 'Tone Depth',
    options: [
      { label: 'خفيفة', labelEn: 'Light', desc: 'نبرة طفولية أو مرحة.', descEn: 'Childlike or playful tone.' },
      { label: 'متوسطة', labelEn: 'Natural', desc: 'طبيعية متوازنة.', descEn: 'Natural and balanced.' },
      { label: 'عميقة', labelEn: 'Deep', desc: 'صوت وثائقي وحكائي قوي.', descEn: 'Strong documentary voice.' },
    ]
  },
  pitch: {
    title: 'طبقة الصوت',
    titleEn: 'Vocal Pitch',
    options: [
      { label: 'عالية', labelEn: 'High', desc: 'نبرة مرتفعة للقصص الكرتونية.', descEn: 'High pitch for cartoons.' },
      { label: 'متوسطة', labelEn: 'Natural', desc: 'نبرة طبيعية.', descEn: 'Natural pitch.' },
      { label: 'منخفضة', labelEn: 'Low', desc: 'صوت رجولي أو درامي عميق.', descEn: 'Deep masculine or dramatic.' },
    ]
  },
  drama: {
    title: 'شدة التأثير الدرامي',
    titleEn: 'Dramatic Intensity',
    options: [
      { label: 'خفيف', labelEn: 'Subtle', desc: 'مناسب للمحتوى الواقعي.', descEn: 'Suitable for realistic content.' },
      { label: 'متوسط', labelEn: 'Moderate', desc: 'مناسب للسرد والأدب.', descEn: 'Suitable for narration.' },
      { label: 'قوي', labelEn: 'Strong', desc: 'مناسب للوثائقيات والإعلانات.', descEn: 'For documentaries and epic ads.' },
    ]
  },
};

export const PREVIEW_SCRIPTS: Record<string, string> = {
  ads: 'دلوقتي تقدر توصل فكرتك بصوت واضح ومؤثر يخلي رسالتك توصل بسهولة.',
  doc: 'في هذا الفيلم الوثائقي، نستعرض رحلة مليئة بالتفاصيل والحقائق.',
  podcast: 'أهلاً بيكم، النهارده هنتكلم عن موضوع مهم بشكل بسيط وهادئ.',
  novels: 'وفي ليلة هادئة، بدأت الحكاية من حيث لم يتوقع أحد.',
  corporate: 'نحن نؤمن بتقديم حلول مبتكرة تساعد عملاءنا على النجاح.',
  cartoon: 'يلا بينا نبدأ المغامرة ونشوف إيه اللي هيحصل!',
  youtube: 'أهلاً يا أصدقاء، فيديو النهارده هيكون مميز جداً، خليكم معانا.',
  drama: 'الأحداث تتسارع، والغموض يلف المكان، ماذا سيحدث غداً؟',
  edu: 'في هذا الدرس، سنتعلم مهارات جديدة تساعدنا في تطوير ذواتنا.'
};

export const WORKFLOW_STEPS = [
  { id: 'new', label: 'المشروع' },
  { id: 'import', label: 'استيراد النص' },
  { id: 'script', label: 'تجهيز النص' },
  { id: 'multi', label: 'توزيع وتوزيع النص' },
  { id: 'pilot', label: 'مقطع تجريبي' },
  { id: 'production', label: 'الإنتاج النهائي' }
];

export const SECURITY_CONFIG = {
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000,    // 15 minutes
  sessionDuration: 8 * 60 * 60 * 1000, // 8 heures
  passwordMinLength: 12,
};