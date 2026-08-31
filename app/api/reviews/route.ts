import {NextResponse} from 'next/server';
import {analyzeScores} from '@/lib/scoring';
import {abilityDimensions,readReviews,writeReviews,type Review} from '@/lib/review-store';
import {readTrainingTasks,writeTrainingTasks,type TrainingTask} from '@/lib/training-store';
import {readImports,writeImports} from '@/lib/import-store';

const clean=(value:unknown,max=1000)=>String(value??'').trim().slice(0,max);
const clamp=(value:unknown)=>Math.max(1,Math.min(5,Number(value)||3));
const durationSeconds=(value:unknown)=>{const text=clean(value,12);if(/^\d+:\d{1,2}$/.test(text)){const [minutes,seconds]=text.split(':').map(Number);return minutes*60+seconds}return Number(text)||0};

export async function GET(request:Request){const reviews=await readReviews();const gameId=new URL(request.url).searchParams.get('gameId');return NextResponse.json(gameId?reviews.find(review=>review.gameId===gameId)||null:reviews.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)))}

export async function POST(request:Request){
  const body=await request.json();const form=body.form||{};const incomingScores=body.scores||{};const scores=Object.fromEntries(abilityDimensions.map(dimension=>[dimension,clamp(incomingScores[dimension])]));const analysis=analyzeScores(scores);const reviews=await readReviews();const requestedId=clean(body.gameId,100);const gameId=requestedId||`manual-${crypto.randomUUID()}`;const previous=reviews.find(review=>review.gameId===gameId);const now=new Date().toISOString();
  if(!clean(form.champion,60))return NextResponse.json({error:'请填写使用英雄'},{status:400});
  const review:Review={id:previous?.id||crypto.randomUUID(),gameId,form:{result:clean(form.result,10)==='失败'?'失败':'胜利',role:clean(form.role,10)||'中路',champion:clean(form.champion,60),opponent:clean(form.opponent,60),kills:clean(form.kills,6),deaths:clean(form.deaths,6),assists:clean(form.assists,6),duration:clean(form.duration,12)},scores,quick:{death:clean(body.quick?.death,40),macro:clean(body.quick?.macro,40),next:clean(body.quick?.next,40)},note:clean(body.note),average:analysis.average,weakest:analysis.weakest.dimension,goal:analysis.goal,createdAt:previous?.createdAt||now,updatedAt:now};
  await writeReviews([review,...reviews.filter(item=>item.gameId!==gameId)]);
  const games=await readImports();const index=games.findIndex((game:any)=>String(game.gameId)===gameId);if(index>=0)games[index]={...games[index],reviewStatus:'COMPLETED',reviewScore:analysis.average};else games.unshift({gameId,playedAt:now,champion:review.form.champion,opponent:review.form.opponent,role:review.form.role,win:review.form.result==='胜利',kills:Number(review.form.kills)||0,deaths:Number(review.form.deaths)||0,assists:Number(review.form.assists)||0,duration:durationSeconds(review.form.duration),cs:0,reviewStatus:'COMPLETED',reviewScore:analysis.average});await writeImports(games);
  const tasks=await readTrainingTasks();let task=tasks.find(item=>item.title===analysis.goal.title&&item.status==='ACTIVE');if(!task){const hasSelected=tasks.some(item=>item.selected&&item.status==='ACTIVE');task={id:crypto.randomUUID(),title:analysis.goal.title,dimension:analysis.weakest.dimension,successRule:analysis.goal.rule,targetCount:3,completedCount:0,status:'ACTIVE',selected:!hasSelected,sourceReviewId:review.id,createdAt:now,updatedAt:now};tasks.unshift(task);await writeTrainingTasks(tasks)}
  return NextResponse.json({review,analysis,task,created:!previous},{status:previous?200:201});
}
