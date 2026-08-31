import {NextResponse} from 'next/server';
import {analyzeScores} from '@/lib/scoring';
export async function POST(request:Request){const body=await request.json();if(!body.scores||typeof body.scores!=='object')return NextResponse.json({error:'缺少评分'}, {status:400});return NextResponse.json(analyzeScores(body.scores));}
