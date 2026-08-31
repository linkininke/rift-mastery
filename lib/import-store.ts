import {readStoredJson,writeStoredJson} from '@/lib/cloud-store';
export async function readImports(){const value=await readStoredJson<any[]>('matches',[]);if(Array.isArray(value)&&value.length)return value;const legacy=await readStoredJson<any[]>('imports',[]);return Array.isArray(legacy)?legacy:[]}
export async function writeImports(data:any[]){await writeStoredJson('matches',data)}
