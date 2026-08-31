import {promises as fs} from 'node:fs';
import path from 'node:path';
const file=path.join(process.cwd(),'data','imports.json');
async function kv(){try{const {getCloudflareContext}=await import('@opennextjs/cloudflare');const env:any=(await getCloudflareContext({async:true})).env;return env.MATCHES_KV||null}catch{return null}}
export async function readImports(){const store=await kv();if(store){const value=await store.get('matches','json');return Array.isArray(value)?value:[]}try{return JSON.parse(await fs.readFile(file,'utf8'))}catch{return []}}
export async function writeImports(data:any[]){const store=await kv();if(store){await store.put('matches',JSON.stringify(data));return}await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,JSON.stringify(data,null,2),'utf8')}
