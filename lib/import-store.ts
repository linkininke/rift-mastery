import {readStoredJson,writeStoredJson} from '@/lib/cloud-store';
export async function readImports(){const value=await readStoredJson<any[]>('matches',[]);return Array.isArray(value)?value:[]}
export async function writeImports(data:any[]){await writeStoredJson('matches',data)}
