export const INGREDIENTS = {
  chicken: { id: 'chicken', name: '嫩雞肉', unit: '盆', costPerUnit: 2200, perBento: 1/64, prepStrategy: 'ceil' },
  rice: { id: 'rice', name: '白飯', unit: '鍋', costPerUnit: 200, perBento: 1/60, prepStrategy: 'ceil' },
  cabbage: { id: 'cabbage', name: '百吉藍白菜', unit: '籃', costPerUnit: 220, perBento: 1/55, prepStrategy: 'half' },
  tofu: { id: 'tofu', name: '油豆腐', unit: '包', costPerUnit: 230, perBento: 1/80, prepStrategy: 'ceil' },
  egg: { id: 'egg', name: '荷包蛋', unit: '籃', costPerUnit: 800, perBento: 1/180, prepStrategy: 'ceil' },
  chickenOil: { id: 'chickenOil', name: '雞油醬', unit: '包', costPerUnit: 180, perBento: 1/128, prepStrategy: 'ceil' },
  scallion: { id: 'scallion', name: '蔥醬', unit: '罐', costPerUnit: 180, perBento: 1/300, prepStrategy: 'ceil' },
  ginger: { id: 'ginger', name: '薑絲', unit: '份', costPerUnit: 0.78, perBento: 1, prepStrategy: 'none' }
};

export const BENTO_TYPES = [
  {
    id: 'signature_chicken',
    name: '招牌嫩雞便當',
    price: 120, // 預設售價
    ingredients: {
      chicken: 1/64,
      rice: 1/60,
      cabbage: 1/55,
      tofu: 1/80,
      egg: 1/180,
      chickenOil: 1/128,
      scallion: 1/300,
      ginger: 1
    }
  }
];
