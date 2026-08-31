"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {CloudDownload,LoaderCircle,Monitor,RefreshCw,ShieldCheck} from 'lucide-react';

type Game={gameId:string;champion:string|number;win:boolean;kills:number;deaths:number;assists:number;playedAt:string};

export default function SyncPage(){
  const [games,setGames]=useState<Game[]>([]);
  const [loading,setLoading]=useState(true);
  const [syncing,setSyncing]=useState(false);
  const [message,setMessage]=useState('');
  const [companion,setCompanion]=useState<'checking'|'ready'|'offline'>('checking');
  const load=async()=>{setLoading(true);try{setGames(await fetch('/api/lcu/import',{cache:'no-store'}).then(r=>r.json()))}finally{setLoading(false)}};
  const checkCompanion=async()=>{if(window.location.hostname==='localhost'||window.location.hostname==='127.0.0.1'){setCompanion('ready');return}try{const response=await fetch('http://127.0.0.1:19423/health',{cache:'no-store'});setCompanion(response.ok?'ready':'offline')}catch{setCompanion('offline')}};
  useEffect(()=>{load();checkCompanion()},[]);
  const sync=async()=>{
    setSyncing(true);setMessage('正在通过本地助手连接国服客户端…');
    try{
      const localPage=window.location.hostname==='localhost'||window.location.hostname==='127.0.0.1';
      const response=await fetch(localPage?'/api/lcu/run':'http://127.0.0.1:19423/sync',{method:'POST'});
      const result=await response.json();
      if(!response.ok)throw new Error(result.error);
      await load();setMessage('同步完成，最新对局已加入待复盘队列。');
    }catch(error:any){setCompanion('offline');setMessage(error.message||'无法连接本地同步助手，请先双击 start-companion.cmd 启动。')}
    finally{setSyncing(false)}
  };
  return <div className="mx-auto max-w-5xl p-5 md:p-9">
    <p className="eyebrow">本机安全连接</p>
    <h1 className="mt-2 text-3xl font-black">国服战绩同步</h1>
    <p className="mt-2 text-white/45">从当前登录的 LOL 客户端读取最近 20 局，不需要输入或保存 QQ 密码。</p>
    <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_.7fr]">
      <section className="card p-6">
        <div className="flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-mint/10 text-mint"><Monitor/></div><div><div className="flex items-center gap-2"><h2 className="text-lg font-bold">客户端已登录？直接同步</h2><span className={`rounded-full px-2 py-0.5 text-[10px] ${companion==='ready'?'bg-mint/10 text-mint':companion==='offline'?'bg-rose-400/10 text-rose-300':'bg-white/5 text-white/35'}`}>{companion==='ready'?'助手已连接':companion==='offline'?'助手未启动':'检测中'}</span></div><p className="muted mt-1">首次使用双击项目里的 start-companion.cmd，之后网页可直接同步。</p></div></div>
        <button onClick={sync} disabled={syncing} className="button mt-6 w-full py-3 disabled:opacity-60">{syncing?<LoaderCircle className="animate-spin" size={18}/>:<CloudDownload size={18}/>} {syncing?'正在连接并导入…':'一键同步最近战绩'}</button>
        {message&&<div className={`mt-4 rounded-xl px-4 py-3 text-sm ${message.includes('完成')?'bg-mint/10 text-mint':'bg-white/5 text-white/55'}`}>{message}</div>}
        <p className="mt-4 text-xs leading-5 text-white/30">本地助手只接受本站请求，临时客户端令牌不会离开你的电脑；云端仅接收战绩字段。</p>
      </section>
      <aside className="card p-6"><div className="flex items-center gap-2 text-mint"><ShieldCheck size={19}/><b>隐私保护</b></div><ul className="mt-4 space-y-3 text-sm leading-6 text-white/45"><li>客户端令牌仅在本机内存使用</li><li>不会读取或上传 QQ 密码</li><li>仅保存训练需要的战绩字段</li><li>重复对局会自动跳过</li></ul></aside>
    </div>
    <section className="card mt-4 overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 p-5"><div><p className="eyebrow">待复盘队列</p><h2 className="mt-1 text-lg font-bold">已导入 {games.length} 局</h2></div><button onClick={load} className="text-white/35 hover:text-white" title="刷新">{loading?<LoaderCircle className="animate-spin" size={19}/>:<RefreshCw size={19}/>}</button></div>
      {!loading&&games.length===0?<div className="grid place-items-center px-5 py-16 text-center"><CloudDownload className="text-white/20" size={34}/><b className="mt-4">还没有导入对局</b><p className="muted mt-2">保持国服客户端登录，点击上方一键同步。</p></div>:games.slice(0,10).map(g=><div key={g.gameId} className="grid gap-3 border-b border-white/5 p-5 last:border-0 sm:grid-cols-[1fr_1fr_auto] sm:items-center"><div><b>{g.champion}</b><p className="text-xs text-white/35">{new Date(g.playedAt).toLocaleString('zh-CN')}</p></div><div><span className={g.win?'text-mint':'text-rose-400'}>{g.win?'胜利':'失败'}</span><p className="text-xs text-white/40">{g.kills} / {g.deaths} / {g.assists}</p></div><Link className="button-secondary" href={`/matches/new?gameId=${g.gameId}`}>{(g as any).reviewStatus==='COMPLETED'?'查看复盘':'开始复盘'}</Link></div>)}
    </section>
  </div>
}
