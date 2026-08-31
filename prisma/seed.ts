import {PrismaClient,Role,MatchResult,AbilityDimension} from '@prisma/client';
const db=new PrismaClient();
async function main(){const user=await db.user.upsert({where:{email:'demo@rift.local'},update:{},create:{email:'demo@rift.local',name:'示例召唤师'}});const match=await db.match.create({data:{userId:user.id,champion:'奥莉安娜',opponent:'劫',role:Role.MID,result:MatchResult.WIN,kills:6,deaths:2,assists:11,generatedGoal:'资源刷新前先处理兵线'}});await db.abilityScore.createMany({data:Object.values(AbilityDimension).map((dimension,i)=>({matchId:match.id,dimension,value:[4,3,3,3,4,4,4,3,4][i]}))});}
main().finally(()=>db.$disconnect());
