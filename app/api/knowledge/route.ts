import {NextResponse} from 'next/server';
import {readStoredJson,writeStoredJson} from '@/lib/cloud-store';
import {knowledgeModules} from '@/lib/knowledge-data';

type Progress=Record<string,{completed:boolean;note:string;updatedAt:string}>;
const ids=new Set(knowledgeModules.map(item=>item.id));

export async function GET(){return NextResponse.json(await readStoredJson<Progress>('knowledge-progress',{}))}

export async function PUT(request:Request){
  const body=await request.json();const id=String(body.id||'');if(!ids.has(id))return NextResponse.json({error:'知识模块不存在'},{status:404});
  const progress=await readStoredJson<Progress>('knowledge-progress',{});const current=progress[id]||{completed:false,note:'',updatedAt:''};
  progress[id]={completed:typeof body.completed==='boolean'?body.completed:current.completed,note:typeof body.note==='string'?body.note.trim().slice(0,1000):current.note,updatedAt:new Date().toISOString()};
  await writeStoredJson('knowledge-progress',progress);return NextResponse.json(progress[id]);
}
