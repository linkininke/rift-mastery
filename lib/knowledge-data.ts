export type KnowledgeModule={id:string;role:string;title:string;topic:string;rule:string;checks:string[]};

export const roleMeta=[
  {id:'TOP',name:'上路',desc:'换血、边线与单带',color:'bg-orange-400'},
  {id:'JUNGLE',name:'打野',desc:'路径、资源与节奏',color:'bg-emerald-400'},
  {id:'MID',name:'中路',desc:'线权、游走与团战',color:'bg-sky-400'},
  {id:'ADC',name:'下路',desc:'发育、输出与站位',color:'bg-rose-400'},
  {id:'SUPPORT',name:'辅助',desc:'视野、游走与开团',color:'bg-violet-400'}
] as const;

export const knowledgeModules:KnowledgeModule[]=[
  {id:'top-trade',role:'TOP',title:'换血窗口',topic:'对线',rule:'只在等级、兵线或技能至少占一项优势时主动换血。',checks:['确认双方关键技能','计算敌方小兵伤害','换血后仍能吃到下一波兵']},
  {id:'top-wave',role:'TOP',title:'边线兵线',topic:'兵线',rule:'先判断下一处资源，再决定推线、慢推或回推。',checks:['资源刷新时间','敌方能否多人抓边','传送是否可用']},
  {id:'top-side',role:'TOP',title:'单带边界',topic:'资源交换',rule:'没有两名敌方英雄位置信息时，不越过河道深推。',checks:['至少看见三名敌人','队友能否承接另一侧资源','保留撤退路线']},
  {id:'top-team',role:'TOP',title:'团战职责',topic:'团战',rule:'载入时明确自己是开团、侧切还是保护后排。',checks:['己方主输出是谁','敌方最大威胁是谁','第一轮技能给谁']},
  {id:'top-recall',role:'TOP',title:'回城与传送',topic:'节奏',rule:'优先用兵线制造回城窗口，不用传送修复可避免的贪线。',checks:['炮车线位置','下一波兵线方向','传送后的收益']},
  {id:'jg-path',role:'JUNGLE',title:'开局路径',topic:'路径',rule:'根据三路线权和对位强弱规划前三组野怪，而非固定刷法。',checks:['哪一路有稳定控制','哪一路会先被推线','敌方打野可能从哪里开']},
  {id:'jg-track',role:'JUNGLE',title:'打野追踪',topic:'地图意识',rule:'每次敌方打野出现，都更新他的补刀数、营地和下一步方向。',checks:['记录首次露头位置','比较双方补刀','给危险半区信号']},
  {id:'jg-objective',role:'JUNGLE',title:'资源前置',topic:'资源',rule:'资源刷新前 45 秒先处理附近兵线、视野和回城。',checks:['惩戒是否可用','附近两路线权','队友装备是否已更新']},
  {id:'jg-gank',role:'JUNGLE',title:'抓人收益',topic:'决策',rule:'没有击杀也必须换到闪现、兵线、镀层或资源中的至少一项。',checks:['成功概率','路程成本','暴露位置后的反向损失']},
  {id:'jg-crossmap',role:'JUNGLE',title:'对侧交换',topic:'资源交换',rule:'确认无法赶到时立刻拿对侧野区、塔或资源，不做迟到支援。',checks:['能否及时到场','对侧可拿什么','交换后下一步位置']},
  {id:'mid-prio',role:'MID',title:'线权使用',topic:'兵线',rule:'推完线后只做有明确收益的移动，否则隐藏视野并先回线。',checks:['边线是否可抓','河道是否有资源','下一波兵是否会丢']},
  {id:'mid-trade',role:'MID',title:'技能换血',topic:'对线',rule:'用对手补刀或技能真空作为换血信号，不为消耗漏关键兵。',checks:['对手关键技能冷却','己方打野位置','换血后的兵线状态']},
  {id:'mid-roam',role:'MID',title:'游走判断',topic:'地图意识',rule:'先推线再移动；没有线权时只支援能立即改变结果的战斗。',checks:['移动时间','边线控制链','敌方是否已后撤']},
  {id:'mid-fight',role:'MID',title:'团战位置',topic:'团战',rule:'开战前明确第一轮技能目标和第二个安全落点。',checks:['敌方开团技能','己方前排位置','自身闪现或保命技能']},
  {id:'mid-recall',role:'MID',title:'回城节奏',topic:'经济',rule:'用炮车线或推进线回城，避免带着大额金币争夺中立资源。',checks:['当前金币能买什么','下一资源时间','回线会漏几只兵']},
  {id:'adc-cs',role:'ADC',title:'安全发育',topic:'经济',rule:'无法确认威胁位置时，宁可少吃一只远程兵也不交保命技能。',checks:['敌方打野与中路位置','辅助是否在身边','下一波兵线方向']},
  {id:'adc-trade',role:'ADC',title:'双人路换血',topic:'对线',rule:'在对方补刀或辅助技能落空时，与己方辅助同时输出。',checks:['双方辅助站位','小兵数量','治疗与召唤师技能']},
  {id:'adc-rotate',role:'ADC',title:'推塔转线',topic:'转线',rule:'下塔告破后优先转中获取安全线权，让单人线接边线。',checks:['中塔状态','先锋或小龙时间','辅助能否先做视野']},
  {id:'adc-team',role:'ADC',title:'团战输出',topic:'团战',rule:'先打安全目标，等关键威胁技能交出后再调整输出位置。',checks:['谁能碰到自己','保命技能给谁留','下一处可移动位置']},
  {id:'adc-item',role:'ADC',title:'装备节点',topic:'装备',rule:'围绕下一波团战选择即时战力，而不是机械照抄完整出装。',checks:['对方护甲和治疗','自身输出环境','回城金币能否成装']},
  {id:'sup-lane',role:'SUPPORT',title:'对线站位',topic:'对线',rule:'和 ADC 保持可同时攻击同一目标的距离，避免形成一打二。',checks:['双方二级时间','关键技能冷却','草丛视野归属']},
  {id:'sup-roam',role:'SUPPORT',title:'游走窗口',topic:'节奏',rule:'ADC 安全、兵线回推或已经回城时再离线游走。',checks:['ADC 会不会被越塔','中野是否能配合','返回下路的时间']},
  {id:'sup-vision',role:'SUPPORT',title:'视野路线',topic:'地图意识',rule:'视野服务于下一处资源和行动，不为插眼单独进入无信息区域。',checks:['队友能否同行','扫描是否可用','插眼后的撤退路线']},
  {id:'sup-engage',role:'SUPPORT',title:'开团判断',topic:'团战',rule:'开团前确认队友距离、敌方人数和关键技能，三者缺一不硬开。',checks:['主输出能否跟上','敌方反打点','开团后的退路']},
  {id:'sup-peel',role:'SUPPORT',title:'保护与反开',topic:'阵容',rule:'当己方后排是唯一胜点时，把第一轮控制留给突进者。',checks:['己方核心是谁','敌方切入方式','控制技能优先级']}
];
