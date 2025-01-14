export enum InstructionEnum {
  UNKNOWN = 1,
  DICE = 2,
  CHECK = 3
}

export const propertyToChineseMap = new Map([
  ['roleId', '角色ID'],
  ['strength', '力量'],
  ['dexterity', '敏捷'],
  ['willpower', '意志'],
  ['constitution', '体质'],
  ['appearance', '外貌'],
  ['education', '教育'],
  ['size', '体型'],
  ['intelligence', '智力'],
  ['sanity', '理智'],
  ['luck', '幸运'],
  ['magicPoints', '魔法'],
  ['healthPoints', '体力'],
  ['accounting', '会计'],
  ['anthropology', '人类学'],
  ['appraisal', '估价'],
  ['archaeology', '考古学'],
  ['acting', '表演'],
  ['charm', '魅惑'],
  ['climb', '攀爬'],
  ['computerUse', '计算机使用'],
  ['creditRating', '信用评级'],
  ['cthulhuMythos', '克苏鲁神话'],
  ['disguise', '乔装'],
  ['dodge', '闪避'],
  ['drive', '汽车驾驶'],
  ['electricRepair', '电气维修'],
  ['electronics', '电子学'],
  ['fastTalk', '话术'],
  ['fistfight', '斗殴'],
  ['firearms', '手枪'],
  ['firstAid', '急救'],
  ['history', '历史'],
  ['intimidate', '恐吓'],
  ['jump', '跳跃'],
  ['english', '英语'],
  ['russian', '俄语'],
  ['law', '法律'],
  ['libraryUse', '图书馆使用'],
  ['listen', '聆听'],
  ['locksmith', '锁匠'],
  ['machineRepair', '机械维修'],
  ['medicine', '医学'],
  ['naturalWorld', '博物学'],
  ['navigation', '领航'],
  ['occult', '神秘学'],
  ['persuade', '说服'],
  ['psychology', '心理学'],
  ['ride', '骑术'],
  ['pharmacy', '药学'],
  ['sleightOfHand', '妙手'],
  ['investigation', '侦查'],
  ['stealth', '潜行'],
  ['survival', '生存'],
  ['swim', '游泳'],
  ['throwAbility', '投掷'],
  ['track', '追踪'],
  ['animalTraining', '动物训练'],
  ['demolition', '爆破'],
  ['lipReading', '读唇'],
  ['hypnosis', '催眠'],
  ['artillery', '炮术']
])

export const chineseToPropertyMap = new Map<string, string>([
  ['力量', 'strength'],
  ['敏捷', 'dexterity'],
  ['意志', 'willpower'],
  ['体质', 'constitution'],
  ['外貌', 'appearance'],
  ['教育', 'education'],
  ['体型', 'size'],
  ['智力', 'intelligence'],
  ['灵感', 'intelligence'],
  ['幸运', 'luck'],
  ['运气', 'luck'],
  ['魔法', 'magicPoints'],
  ['体力', 'healthPoints'],
  ['会计', 'accounting'],
  ['人类学', 'anthropology'],
  ['估价', 'appraisal'],
  ['考古学', 'archaeology'],
  ['表演', 'acting'],
  ['魅惑', 'charm'],
  ['攀爬', 'climb'],
  ['计算机使用', 'computerUse'],
  ['电脑', 'computerUse'],
  ['信誉', 'creditRating'],
  ['克苏鲁', 'cthulhuMythos'],
  ['乔装', 'disguise'],
  ['闪避', 'dodge'],
  ['驾驶', 'drive'],
  ['电气维修', 'electricRepair'],
  ['电子学', 'electronics'],
  ['话术', 'fastTalk'],
  ['斗殴', 'fistfight'],
  ['手枪', 'firearms'],
  ['急救', 'firstAid'],
  ['历史', 'history'],
  ['恐吓', 'intimidate'],
  ['跳跃', 'jump'],
  ['英语', 'english'],
  ['母语', 'english'],
  ['法律', 'law'],
  ['图书馆使用', 'libraryUse'],
  ['聆听', 'listen'],
  ['开锁', 'locksmith'],
  ['机械维修', 'machineRepair'],
  ['医学', 'medicine'],
  ['博物学', 'naturalWorld'],
  ['自然学', 'naturalWorld'],
  ['导航', 'navigation'],
  ['神秘学', 'occult'],
  ['操作重型机械', 'drive'],
  ['说服', 'persuade'],
  ['精神分析', 'psychology'],
  ['心理学', 'psychology'],
  ['骑术', 'ride'],
  ['药学', 'pharmacy'],
  ['妙手', 'sleightOfHand'],
  ['侦查', 'investigation'],
  ['潜行', 'stealth'],
  ['生存', 'survival'],
  ['游泳', 'swim'],
  ['投掷', 'throwAbility'],
  ['追踪', 'track'],
  ['驯兽', 'demolition'],
  ['潜水', 'swim'],
  ['爆破', 'demolition'],
  ['读唇', 'lipReading'],
  ['催眠', 'hypnosis'],
  ['炮术', 'artillery'],
  ['信用', 'creditRating'],
  ['信用评级', 'creditRating'],
  ['克苏鲁神话', 'cthulhuMythos'],
  ['汽车', 'drive'],
  ['汽车驾驶', 'drive'],
  ['图书馆', 'libraryUse'],
  ['撬锁', 'locksmith'],
  ['锁匠', 'locksmith'],
  ['领航', 'navigation'],
  ['重型操作', 'drive'],
  ['重型机械', 'drive'],
  ['重型', 'drive'],
  ['str', 'strength'],
  ['dex', 'dexterity'],
  ['pow', 'willpower'],
  ['con', 'constitution'],
  ['app', 'appearance'],
  ['edu', 'education'],
  ['siz', 'size'],
  ['int', 'intelligence'],
  ['san', 'sanity'],
  ['理智', 'sanity'],
  ['理智值', 'sanity'],
  ['mp', 'magicPoints'],
  ['hp', 'healthPoints'],
  ['cm', 'size'],
  ['计算机', 'computerUse']
])
