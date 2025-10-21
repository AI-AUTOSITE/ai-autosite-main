// app/tools/haiku-generator/lib/season-words.ts
import { SeasonWordDatabase, SeasonWord, Season } from './types'

const sw = (
  word: string,
  jp: string,
  syl: number,
  cat: string,
  img: 'visual' | 'auditory' | 'tactile' | 'olfactory' | 'gustatory',
  com: 1 | 2 | 3 | 4 | 5,
  tags: string[]
): SeasonWord => ({
  word,
  japanese: jp,
  syllables: syl,
  category: cat,
  imagery: img,
  commonality: com,
  tags
})

export const seasonWordsData: SeasonWordDatabase = {
  spring: [
    sw('cherry blossoms', '桜', 4, 'nature', 'visual', 5, ['flower', 'pink', 'fleeting']),
    sw('spring rain', '春雨', 2, 'weather', 'auditory', 5, ['gentle', 'nurturing']),
    sw('butterfly', '蝶', 3, 'nature', 'visual', 5, ['flutter', 'delicate']),
    sw('new leaves', '若葉', 2, 'nature', 'visual', 5, ['green', 'fresh']),
    sw('spring breeze', '春風', 2, 'weather', 'tactile', 5, ['warm', 'soft']),
    sw('robins', 'コマドリ', 2, 'nature', 'auditory', 4, ['bird', 'song']),
    sw('tulips', 'チューリップ', 2, 'nature', 'visual', 5, ['colorful', 'garden']),
    sw('morning dew', '朝露', 3, 'weather', 'visual', 5, ['droplets', 'sparkling']),
    sw('plum blossoms', '梅', 3, 'nature', 'visual', 4, ['white', 'fragrant']),
    sw('warm sunlight', '春日', 3, 'weather', 'visual', 5, ['golden', 'gentle']),
    sw('frogs', '蛙', 1, 'nature', 'auditory', 4, ['croaking', 'pond']),
    sw('swallows', '燕', 2, 'nature', 'visual', 4, ['swift', 'graceful']),
    sw('planting seeds', '種まき', 3, 'activity', 'tactile', 4, ['hope', 'earth']),
    sw('daffodils', '水仙', 3, 'nature', 'visual', 4, ['yellow', 'bright']),
    sw('melting snow', '雪解け', 3, 'weather', 'visual', 3, ['thaw', 'dripping']),
    sw('bees', '蜂', 1, 'nature', 'auditory', 5, ['buzzing', 'busy']),
    sw('renewal', '更新', 3, 'concept', 'visual', 4, ['rebirth', 'hope']),
    sw('spring mist', '春霞', 2, 'weather', 'visual', 3, ['soft', 'hazy']),
    sw('meadow', '草原', 2, 'landscape', 'visual', 4, ['wildflowers', 'green']),
    sw('budding trees', '芽吹き', 3, 'nature', 'visual', 5, ['growth', 'awakening']),
    sw('rainbow', '虹', 2, 'weather', 'visual', 4, ['colorful', 'arc']),
    sw('ladybugs', '天道虫', 3, 'nature', 'visual', 4, ['red', 'spotted']),
    sw('spring shower', '春時雨', 2, 'weather', 'auditory', 4, ['brief', 'fresh']),
    sw('garden', '庭園', 2, 'landscape', 'visual', 5, ['flowers', 'peaceful']),
    sw('hope', '希望', 1, 'concept', 'visual', 5, ['optimism', 'future']),
  ],

  summer: [
    sw('cicadas', '蝉', 3, 'nature', 'auditory', 5, ['loud', 'heat']),
    sw('summer heat', '暑さ', 3, 'weather', 'tactile', 5, ['intense', 'sweat']),
    sw('fireflies', '蛍', 3, 'nature', 'visual', 5, ['glow', 'night']),
    sw('sunflowers', 'ひまわり', 3, 'nature', 'visual', 5, ['yellow', 'tall']),
    sw('thunderstorm', '雷雨', 3, 'weather', 'auditory', 4, ['lightning', 'dramatic']),
    sw('beach', '浜', 1, 'landscape', 'visual', 5, ['sand', 'waves']),
    sw('ocean waves', '波', 3, 'landscape', 'auditory', 5, ['crashing', 'rhythm']),
    sw('dragonflies', '蜻蛉', 3, 'nature', 'visual', 4, ['hovering', 'iridescent']),
    sw('bright sun', '太陽', 2, 'weather', 'visual', 5, ['blazing', 'hot']),
    sw('watermelon', '西瓜', 4, 'nature', 'gustatory', 5, ['sweet', 'juicy']),
    sw('long days', '長日', 2, 'weather', 'visual', 4, ['extended', 'light']),
    sw('swimming', '水泳', 2, 'activity', 'tactile', 5, ['cool', 'refreshing']),
    sw('mosquitoes', '蚊', 3, 'nature', 'auditory', 5, ['buzzing', 'biting']),
    sw('cool shade', '木陰', 2, 'landscape', 'tactile', 5, ['refuge', 'relief']),
    sw('bamboo', '竹', 3, 'nature', 'visual', 4, ['green', 'tall']),
    sw('summer rain', '夕立', 3, 'weather', 'auditory', 4, ['sudden', 'cooling']),
    sw('festival', '祭り', 3, 'activity', 'auditory', 5, ['drums', 'celebration']),
    sw('fireworks', '花火', 2, 'activity', 'visual', 5, ['colorful', 'night']),
    sw('morning glory', '朝顔', 3, 'nature', 'visual', 4, ['blue', 'vine']),
    sw('hot breeze', '熱風', 2, 'weather', 'tactile', 4, ['dry', 'scorching']),
    sw('green leaves', '青葉', 2, 'nature', 'visual', 5, ['lush', 'dense']),
    sw('lotus', '蓮', 2, 'nature', 'visual', 4, ['floating', 'pink']),
    sw('starry night', '星空', 3, 'weather', 'visual', 5, ['clear', 'twinkling']),
    sw('hammock', 'ハンモック', 2, 'activity', 'tactile', 3, ['swaying', 'lazy']),
    sw('passion', '情熱', 2, 'concept', 'tactile', 4, ['intense', 'burning']),
  ],

  autumn: [
    sw('autumn leaves', '紅葉', 3, 'nature', 'visual', 5, ['red', 'orange', 'falling']),
    sw('harvest moon', '中秋の名月', 3, 'weather', 'visual', 5, ['full', 'golden']),
    sw('crisp air', '秋気', 2, 'weather', 'tactile', 5, ['cool', 'clear']),
    sw('migrating geese', '雁', 4, 'nature', 'visual', 4, ['formation', 'flying']),
    sw('chestnuts', '栗', 2, 'nature', 'gustatory', 4, ['roasted', 'sweet']),
    sw('persimmons', '柿', 3, 'nature', 'visual', 4, ['orange', 'hanging']),
    sw('autumn wind', '秋風', 3, 'weather', 'auditory', 5, ['rustling', 'cool']),
    sw('scarecrow', '案山子', 2, 'landscape', 'visual', 3, ['field', 'watching']),
    sw('rice harvest', '稲刈り', 3, 'activity', 'tactile', 4, ['golden', 'reaping']),
    sw('cool nights', '夜寒', 2, 'weather', 'tactile', 4, ['chilly', 'clear']),
    sw('chrysanthemums', '菊', 4, 'nature', 'visual', 4, ['yellow', 'white']),
    sw('acorns', 'どんぐり', 2, 'nature', 'visual', 4, ['brown', 'falling']),
    sw('mushrooms', '茸', 2, 'nature', 'visual', 3, ['damp', 'forest']),
    sw('frost', '霜', 1, 'weather', 'visual', 4, ['white', 'cold']),
    sw('dried grass', '枯草', 2, 'nature', 'visual', 4, ['brown', 'rustling']),
    sw('shorter days', '日短', 3, 'weather', 'visual', 4, ['evening', 'darkness']),
    sw('deer', '鹿', 1, 'nature', 'visual', 3, ['graceful', 'forest']),
    sw('pumpkins', 'かぼちゃ', 2, 'nature', 'visual', 5, ['orange', 'round']),
    sw('autumn rain', '秋雨', 3, 'weather', 'auditory', 4, ['steady', 'melancholy']),
    sw('apples', '林檎', 2, 'nature', 'gustatory', 5, ['crisp', 'red']),
    sw('fallen leaves', '落葉', 3, 'nature', 'auditory', 5, ['crunching', 'carpet']),
    sw('twilight', '黄昏', 2, 'weather', 'visual', 4, ['fading', 'purple']),
    sw('loneliness', '寂寥', 3, 'concept', 'visual', 3, ['solitude', 'quiet']),
    sw('reflection', '省察', 3, 'concept', 'visual', 3, ['contemplation', 'introspection']),
    sw('gratitude', '感謝', 3, 'concept', 'visual', 4, ['thankful', 'harvest']),
  ],

  winter: [
    sw('snow', '雪', 1, 'weather', 'visual', 5, ['white', 'silent', 'falling']),
    sw('cold wind', '冷風', 2, 'weather', 'tactile', 5, ['biting', 'harsh']),
    sw('frozen pond', '氷池', 3, 'landscape', 'visual', 4, ['ice', 'still']),
    sw('icicles', '氷柱', 3, 'weather', 'visual', 4, ['hanging', 'dripping']),
    sw('bare trees', '枯木', 2, 'nature', 'visual', 5, ['skeletal', 'stark']),
    sw('snowflakes', '雪片', 2, 'weather', 'visual', 5, ['unique', 'delicate']),
    sw('winter moon', '冬月', 3, 'weather', 'visual', 5, ['bright', 'cold']),
    sw('silence', '静寂', 3, 'concept', 'auditory', 5, ['muffled', 'peaceful']),
    sw('hot chocolate', 'ココア', 4, 'activity', 'gustatory', 5, ['warm', 'sweet']),
    sw('fireplace', '暖炉', 2, 'activity', 'visual', 4, ['crackling', 'cozy']),
    sw('frostbite', '霜焼け', 2, 'weather', 'tactile', 3, ['numb', 'painful']),
    sw('hibernation', '冬眠', 4, 'nature', 'tactile', 3, ['sleeping', 'hidden']),
    sw('snowman', '雪だるま', 2, 'activity', 'visual', 5, ['round', 'cheerful']),
    sw('ice skating', 'スケート', 3, 'activity', 'tactile', 4, ['gliding', 'graceful']),
    sw('short days', '日短', 2, 'weather', 'visual', 5, ['darkness', 'early']),
    sw('evergreens', '常緑樹', 3, 'nature', 'visual', 4, ['pine', 'green']),
    sw('footprints', '足跡', 2, 'visual', 'visual', 4, ['trail', 'snow']),
    sw('starlight', '星光', 2, 'weather', 'visual', 5, ['clear', 'bright']),
    sw('frost patterns', '霜の花', 3, 'weather', 'visual', 3, ['crystals', 'window']),
    sw('cabin', '山小屋', 2, 'landscape', 'visual', 3, ['shelter', 'remote']),
    sw('cold breath', '白息', 2, 'weather', 'visual', 5, ['vapor', 'visible']),
    sw('solitude', '孤独', 3, 'concept', 'tactile', 4, ['isolation', 'introspection']),
    sw('resilience', '忍耐', 4, 'concept', 'tactile', 3, ['endurance', 'strength']),
    sw('stillness', '静止', 2, 'concept', 'visual', 4, ['motionless', 'calm']),
    sw('hope', '希望', 1, 'concept', 'visual', 4, ['waiting', 'spring']),
  ]
}

export function getSeasonWords(season: Season): SeasonWord[] {
  return seasonWordsData[season]
}

export function getRandomSeasonWord(season: Season): SeasonWord {
  const words = seasonWordsData[season]
  return words[Math.floor(Math.random() * words.length)]
}

export function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}