import type { TranslationKeys } from '../i18n';

const ja: TranslationKeys = {
  common: {
    app_title: '4:6 Method Interactive Timer',
    app_description:
      '世界チャンピオンの粕谷哲さんが開発した4:6メソッドで、完璧なコーヒーを淹れましょう',
    start_brewing: '抽出を開始',
    stop: '停止',
    brew_again: 'もう一度淹れる',
    units: {
      grams: 'g',
      ml: 'ml',
      times: '回',
      minutes: '分',
      seconds: '秒',
      min_short: '分',
      sec_short: '秒',
    },
  },
  setup: {
    title: 'レシピ設定',
    bean_weight: 'コーヒー豆の量',
    taste_preference: '味の好み',
    strength_preference: '濃さの好み',
    recipe_preview: 'レシピプレビュー',
    total_water: '総水量:',
    pour_count: '注湯回数:',
    brew_time: '抽出時間:',
    ratio: '比率:',
    taste: {
      sweet: '甘め',
      balanced: 'バランス',
      bright: '酸味・明るめ',
    },
    strength: {
      light: '薄め (4回)',
      medium: '標準 (5回)',
      strong: '濃いめ (6回)',
    },
    taste_sweet: '甘め',
    taste_balanced: 'バランス',
    taste_bright: '酸味・明るめ',
    strength_light: '薄め (4回)',
    strength_standard: '標準 (5回)',
    strength_strong: '濃いめ (6回)',
  },
  timer: {
    preparing: '準備中...',
    pour_action: '{{count}}回目の注湯',
    completed: '抽出完了！',
    enjoy_coffee: '美味しいコーヒーが完成しました',
    brewing_summary: '抽出サマリー',
    beans_used: '使用豆量:',
    pour_label: '注湯',
  },
  complete: {
    title: '抽出完了！',
    message: '美味しいコーヒーが完成しました',
    summary_title: '抽出サマリー',
    beans_used: '使用豆量:',
    total_water: '総水量:',
    pour_count: '注湯回数:',
    brew_time: '抽出時間:',
  },
};

export default ja;
