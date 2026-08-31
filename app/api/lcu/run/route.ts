import {NextResponse} from 'next/server';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'node:path';

const exec=promisify(execFile);

export async function POST(request:Request){
  const host=request.headers.get('host')||'';
  if(!host.startsWith('localhost:')&&!host.startsWith('127.0.0.1:')){
    return NextResponse.json({error:'一键同步仅能在本机使用'},{status:403});
  }
  const script=path.join(process.cwd(),'scripts','lcu-sync.mjs');
  const command=`$p=Start-Process -FilePath '${process.execPath.replaceAll("'","''")}' -ArgumentList @('${script.replaceAll("'","''")}') -WorkingDirectory '${process.cwd().replaceAll("'","''")}' -Verb RunAs -WindowStyle Hidden -Wait -PassThru; exit $p.ExitCode`;
  try{
    await exec('powershell.exe',['-NoProfile','-Command',command],{windowsHide:true,timeout:60000});
    return NextResponse.json({ok:true});
  }catch(error:any){
    const cancelled=String(error?.message||'').includes('canceled')||String(error?.message||'').includes('取消');
    return NextResponse.json({error:cancelled?'你取消了 Windows 权限确认':'同步未完成，请确认 LOL 客户端已经登录'},{status:400});
  }
}
