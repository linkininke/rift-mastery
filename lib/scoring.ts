export type ScoreMap=Record<string,number>;
const goals:Record<string,{title:string;rule:string}>={
  '对线':{title:'前 8 分钟减少无收益换血',rule:'前 8 分钟不因贪消耗漏掉炮车，且保持血量可控'},
  '兵线':{title:'资源刷新前先处理兵线',rule:'3 次资源刷新中至少 2 次提前处理兵线'},
  '地图意识':{title:'每波兵线后扫一次小地图',rule:'关键死亡前能够说出敌方打野最后位置'},
  '资源交换':{title:'丢资源时立即寻找对侧收益',rule:'无法争夺时，在 10 秒内转向兵线、塔或对侧野区'},
  '团战':{title:'进场前确认双方关键技能',rule:'每次团战前明确自己的第一目标和安全位置'},
  '英雄熟练度':{title:'固定一套基础连招窗口',rule:'在训练模式连续 10 次无失误完成'},
  '装备理解':{title:'回城前先判断下一件散件',rule:'依据对手伤害类型和当前金币选择散件'},
  '阵容理解':{title:'载入时写下一句话赢法',rule:'明确己方开团点、输出点和对方最大威胁'},
  '稳定性':{title:'控制第一次可控死亡',rule:'前 10 分钟不因无视野压线死亡'}
};
export function analyzeScores(scores:ScoreMap){const entries=Object.entries(scores);const average=Math.round(entries.reduce((a,[,v])=>a+v,0)/entries.length*20);const [dimension,value]=entries.sort((a,b)=>a[1]-b[1])[0];return {average,weakest:{dimension,value},goal:goals[dimension]??goals['稳定性']};}
