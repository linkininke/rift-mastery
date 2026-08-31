import {createHmac} from 'node:crypto';
export const COOKIE_NAME='rift_session';
export function createSession(email:string){const expires=Date.now()+1000*60*60*24*30;const payload=Buffer.from(JSON.stringify({email,expires})).toString('base64url');const signature=createHmac('sha256',process.env.AUTH_SECRET||'dev-secret').update(payload).digest('base64url');return `${payload}.${signature}`}
