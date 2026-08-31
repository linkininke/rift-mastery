import {readStoredJson,writeStoredJson} from '@/lib/cloud-store';

export type TrainingTask={id:string;title:string;dimension:string;successRule:string;targetCount:number;completedCount:number;status:'ACTIVE'|'COMPLETED'|'ARCHIVED';selected:boolean;sourceReviewId?:string;createdAt:string;updatedAt:string};
export async function readTrainingTasks(){const value=await readStoredJson<TrainingTask[]>('training-tasks',[]);return Array.isArray(value)?value:[]}
export async function writeTrainingTasks(value:TrainingTask[]){await writeStoredJson('training-tasks',value.slice(0,100))}
