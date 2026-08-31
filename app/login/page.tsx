"use client";
import {FormEvent,useState} from 'react';
import {useRouter} from 'next/navigation';
import {Crosshair,Eye,EyeOff,LoaderCircle,LockKeyhole} from 'lucide-react';

export default function Login(){
  const router=useRouter();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [show,setShow]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const submit=async(e:FormEvent)=>{e.preventDefault();setLoading(true);setError('');try{const response=await fetch('/api/local-auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password})});const result=await response.json();if(!response.ok)throw new Error(result.error);const destination=new URLSearchParams(window.location.search).get('next')||'/';router.replace(destination);router.refresh()}catch(err:any){setError(err.message||'登录失败')}finally{setLoading(false)}};
  return <div className="relative grid min-h-screen flex-1 place-items-center overflow-hidden p-5"><div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-mint/10 blur-[110px]"/><div className="card relative w-full max-w-md p-7 md:p-9"><div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10"><Crosshair className="text-gold"/></div><div><h1 className="text-xl font-black">峡谷进阶</h1><p className="text-[10px] tracking-[.2em] text-white/35">RIFT MASTERY</p></div></div><div className="mt-8"><p className="eyebrow">欢迎回来</p><h2 className="mt-2 text-2xl font-black">登录你的训练档案</h2><p className="muted mt-2">你的对局、复盘和长期趋势只属于这个账号。</p></div><form onSubmit={submit} className="mt-7 space-y-4"><label className="grid gap-2 text-sm text-white/55">账号<input value={email} onChange={e=>setEmail(e.target.value)} type="email" autoComplete="username" placeholder="请输入邮箱" required/></label><label className="grid gap-2 text-sm text-white/55">密码<div className="relative"><input value={password} onChange={e=>setPassword(e.target.value)} type={show?'text':'password'} autoComplete="current-password" placeholder="请输入密码" required className="w-full pr-11"/><button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>{error&&<div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</div>}<button disabled={loading} className="button mt-2 w-full py-3 disabled:opacity-60">{loading?<LoaderCircle className="animate-spin" size={18}/>:<LockKeyhole size={18}/>}登录</button></form><p className="mt-6 text-center text-xs text-white/25">私有训练档案 · 会话有效期 30 天</p></div></div>
}
