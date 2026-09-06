import {readFileSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const run=(command,args)=>{const result=spawnSync(command,args,{stdio:'inherit',env:process.env});if(result.status!==0)process.exit(result.status??1);};
run('pnpm',['exec','astro','build']);
const generated=JSON.parse(readFileSync('dist/server/wrangler.json','utf8'));
const production=JSON.parse(readFileSync('wrangler.production.jsonc','utf8'));
const deploy={...generated,name:production.name,workers_dev:production.workers_dev,preview_urls:production.preview_urls,routes:production.routes,vars:production.vars,triggers:production.triggers,observability:production.observability};
writeFileSync('dist/server/wrangler.production.json',JSON.stringify(deploy,null,2)+'\n');
run('pnpm',['exec','wrangler','deploy','--config','dist/server/wrangler.production.json']);
