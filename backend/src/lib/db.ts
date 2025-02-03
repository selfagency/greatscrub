import PocketBase from 'pocketbase';

import type { TypedPocketBase } from './pb.js';

const pb = new PocketBase(process.env.PB_HOST as string) as TypedPocketBase;
pb.autoCancellation(false);
await pb.collection('users').authWithPassword(process.env.USERNAME as string, process.env.PASSWORD as string);

export default pb;
