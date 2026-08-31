import {promises as fs} from 'node:fs';
import path from 'node:path';

async function cloudKv(){
  try{
    const {getCloudflareContext}=await import('@opennextjs/cloudflare');
    const env:any=(await getCloudflareContext({async:true})).env;
    return env.MATCHES_KV||null;
  }catch{return null}
}

function localFile(key:string){return path.join(process.cwd(),'data',`${key}.json`)}

export async function readStoredJson<T>(key:string,fallback:T):Promise<T>{
  const store=await cloudKv();
  if(store){const value=await store.get(key,'json');return value??fallback}
  try{return JSON.parse(await fs.readFile(localFile(key),'utf8')) as T}catch{return fallback}
}

export async function writeStoredJson<T>(key:string,value:T){
  const store=await cloudKv();
  if(store){await store.put(key,JSON.stringify(value));return}
  await fs.mkdir(path.join(process.cwd(),'data'),{recursive:true});
  await fs.writeFile(localFile(key),JSON.stringify(value,null,2),'utf8');
}
