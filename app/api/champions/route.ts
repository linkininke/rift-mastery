import {NextResponse} from 'next/server';
import {readStoredJson,writeStoredJson} from '@/lib/cloud-store';
import {readImports} from '@/lib/import-store';

type PoolChampion={id:string;champion:string;role:string;tier:string;notes:string;matchup:string;createdAt:string};
const roles=new Set(['上路','打野','中路','下路','辅助']);
const tiers=new Set(['主力','备选','练习']);
const clean=(value:unknown,max=400)=>String(value??'').trim().slice(0,max);

async function pool(){const value=await readStoredJson<PoolChampion[]>('champion-pool',[]);return Array.isArray(value)?value:[]}
async function response(){
  const [items,games]=await Promise.all([pool(),readImports()]);
  return items.map(item=>{const related=games.filter((game:any)=>clean(game.champion,60).toLowerCase()===item.champion.toLowerCase());const wins=related.filter((game:any)=>game.win).length;return {...item,games:related.length,wins,winRate:related.length?Math.round(wins/related.length*100):null}});
}

export async function GET(){return NextResponse.json(await response())}

export async function POST(request:Request){
  const body=await request.json();const champion=clean(body.champion,40);const role=clean(body.role,10);const tier=clean(body.tier,10);
  if(!champion||!roles.has(role)||!tiers.has(tier))return NextResponse.json({error:'请完整填写英雄、位置和定位'},{status:400});
  const items=await pool();if(items.some(item=>item.champion.toLowerCase()===champion.toLowerCase()&&item.role===role))return NextResponse.json({error:'该英雄已在这个位置的英雄池中'},{status:409});
  items.unshift({id:crypto.randomUUID(),champion,role,tier,notes:clean(body.notes),matchup:clean(body.matchup,800),createdAt:new Date().toISOString()});await writeStoredJson('champion-pool',items);return NextResponse.json(await response(),{status:201});
}

export async function PATCH(request:Request){
  const body=await request.json();const id=clean(body.id,80);const items=await pool();const index=items.findIndex(item=>item.id===id);if(index<0)return NextResponse.json({error:'没有找到该英雄'},{status:404});
  const role=clean(body.role,10);const tier=clean(body.tier,10);if(role&&!roles.has(role)||tier&&!tiers.has(tier))return NextResponse.json({error:'位置或英雄池定位无效'},{status:400});
  items[index]={...items[index],role:role||items[index].role,tier:tier||items[index].tier,notes:clean(body.notes),matchup:clean(body.matchup,800)};await writeStoredJson('champion-pool',items);return NextResponse.json(await response());
}

export async function DELETE(request:Request){
  const id=new URL(request.url).searchParams.get('id')||'';const items=await pool();const next=items.filter(item=>item.id!==id);if(next.length===items.length)return NextResponse.json({error:'没有找到该英雄'},{status:404});await writeStoredJson('champion-pool',next);return NextResponse.json(await response());
}
