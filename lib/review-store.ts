import {readStoredJson,writeStoredJson} from '@/lib/cloud-store';
export {abilityDimensions} from '@/lib/review-data';

export type Review={id:string;gameId:string;form:{result:string;role:string;champion:string;opponent:string;kills:string;deaths:string;assists:string;duration:string};scores:Record<string,number>;quick:Record<string,string>;note:string;average:number;weakest:string;goal:{title:string;rule:string};createdAt:string;updatedAt:string};

export async function readReviews(){const value=await readStoredJson<Review[]>('reviews',[]);return Array.isArray(value)?value:[]}
export async function writeReviews(value:Review[]){await writeStoredJson('reviews',value.slice(0,500))}
