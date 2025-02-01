import { Logger } from 'tslog';

const log = new Logger({ minLevel: process.env.DEBUG ? 2 : 3, type: 'pretty' });

export default log;
