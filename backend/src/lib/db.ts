import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.PB_HOST as string);
await pb.collection('users').authWithPassword(process.env.USERNAME as string, process.env.PASSWORD as string);

export default pb;
