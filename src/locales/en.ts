import type { TranslationKeys } from '../i18n';

const en: TranslationKeys = {
  common: {
    app_title: '4:6 Method Interactive Timer',
    app_description:
      'Brew perfect coffee with the 4:6 method developed by Tetsu Kasuya, 2016 World Brewers Cup Champion',
    start_brewing: 'Start Brewing',
    stop: 'Stop',
    brew_again: 'Brew Again',
    units: {
      grams: 'g',
      ml: 'ml',
      times: 'times',
      minutes: 'min',
      seconds: 'sec',
      min_short: 'min',
      sec_short: 's',
    },
  },
  setup: {
    title: 'Recipe Setup',
    bean_weight: 'Coffee Bean Amount',
    taste_preference: 'Taste Preference',
    strength_preference: 'Strength Preference',
    recipe_preview: 'Recipe Preview',
    total_water: 'Total Water:',
    pour_count: 'Pour Count:',
    brew_time: 'Brew Time:',
    ratio: 'Ratio:',
    taste: {
      sweet: 'Sweet',
      balanced: 'Balanced',
      bright: 'Bright & Acidic',
    },
    strength: {
      light: 'Light (4 pours)',
      medium: 'Medium (5 pours)',
      strong: 'Strong (6 pours)',
    },
    taste_sweet: 'Sweet',
    taste_balanced: 'Balanced',
    taste_bright: 'Bright & Acidic',
    strength_light: 'Light (4 pours)',
    strength_standard: 'Standard (5 pours)',
    strength_strong: 'Strong (6 pours)',
  },
  timer: {
    preparing: 'Preparing...',
    pour_action: 'Pour {{count}}',
    completed: 'Brewing Complete!',
    enjoy_coffee: 'Your delicious coffee is ready',
    brewing_summary: 'Brewing Summary',
    beans_used: 'Beans Used:',
    pour_label: 'pours',
  },
  complete: {
    title: 'Brewing Complete!',
    message: 'Your delicious coffee is ready',
    summary_title: 'Brewing Summary',
    beans_used: 'Beans Used:',
    total_water: 'Total Water:',
    pour_count: 'Pour Count:',
    brew_time: 'Brew Time:',
  },
};

export default en;
