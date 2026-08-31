import http from 'node:http';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {existsSync,readFileSync} from 'node:fs';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const projectDir=path.dirname(scriptDir);
const syncScript=path.join(scriptDir,'lcu-sync.mjs');
const config={};
for(const file of [path.join(projectDir,'.env.local'),path.join(projectDir,'.env')]){
  if(!existsSync(file))continue;
  for(const line of readFileSync(file,'utf8').split(/\r?\n/)){const match=line.match(/^([^#=]+)=["']?(.*?)["']?$/);if(match)config[match[1]]=match[2]}
}
const port=Number(process.env.RIFT_COMPANION_PORT||19423);
const webOrigin=process.env.RIFT_WEB_ORIGIN||config.RIFT_WEB_ORIGIN||'https://rift-mastery.1464501541ljy.workers.dev';
const allowedOrigins=new Set([webOrigin,'http://localhost:3000','http://127.0.0.1:3000']);
let running=false;

function cors(request,response){const origin=request.headers.origin||'';if(allowedOrigins.has(origin)){response.setHeader('Access-Control-Allow-Origin',origin);response.setHeader('Vary','Origin');response.setHeader('Access-Control-Allow-Private-Network','true');response.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');response.setHeader('Access-Control-Allow-Headers','content-type')}return !origin||allowedOrigins.has(origin)}
function json(response,status,body){response.writeHead(status,{'content-type':'application/json; charset=utf-8'});response.end(JSON.stringify(body))}
function sync(){return new Promise((resolve,reject)=>{let output='';const child=spawn(process.execPath,[syncScript],{cwd:projectDir,windowsHide:true,env:{...process.env,RIFT_MASTERY_URL:process.env.RIFT_MASTERY_URL||config.RIFT_MASTERY_URL||webOrigin,RIFT_SYNC_TOKEN:process.env.RIFT_SYNC_TOKEN||config.RIFT_SYNC_TOKEN||''}});child.stdout.on('data',data=>output+=data);child.stderr.on('data',data=>output+=data);child.on('error',reject);child.on('close',code=>code===0?resolve(output.trim()):reject(new Error(output.trim().split(/\r?\n/).pop()||'同步失败')))})}

const server=http.createServer(async(request,response)=>{if(!cors(request,response))return json(response,403,{error:'不允许的网页来源'});if(request.method==='OPTIONS'){response.writeHead(204);return response.end()}if(request.url==='/health'&&request.method==='GET')return json(response,200,{ok:true,status:running?'syncing':'ready'});if(request.url==='/sync'&&request.method==='POST'){if(running)return json(response,409,{error:'同步正在进行中'});running=true;try{const message=await sync();return json(response,200,{ok:true,message})}catch(error){return json(response,500,{error:error.message})}finally{running=false}}return json(response,404,{error:'未找到接口'})});
server.listen(port,'127.0.0.1',()=>console.log(`峡谷进阶同步助手已启动：http://127.0.0.1:${port}`));
