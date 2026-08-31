import {NextResponse,type NextRequest} from 'next/server';
const cookieName='rift_session';
const encoder=new TextEncoder();
function decode(value:string){try{return JSON.parse(atob(value.replace(/-/g,'+').replace(/_/g,'/')))}catch{return null}}
async function signature(payload:string){const key=await crypto.subtle.importKey('raw',encoder.encode(process.env.AUTH_SECRET||'dev-secret'),{name:'HMAC',hash:'SHA-256'},false,['sign']);const bytes=new Uint8Array(await crypto.subtle.sign('HMAC',key,encoder.encode(payload)));return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
export async function middleware(request:NextRequest){const path=request.nextUrl.pathname;if(path==='/login'||path==='/api/local-auth/login'||path.startsWith('/api/lcu/import')||path.startsWith('/api/auth'))return NextResponse.next();const raw=request.cookies.get(cookieName)?.value;const [payload,sig]=raw?.split('.')||[];const session=payload?decode(payload):null;if(!payload||!sig||!session||session.expires<Date.now()||await signature(payload)!==sig){const url=request.nextUrl.clone();url.pathname='/login';url.searchParams.set('next',path);return NextResponse.redirect(url)}return NextResponse.next()}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']};
