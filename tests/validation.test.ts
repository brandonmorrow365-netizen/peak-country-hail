import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseHail,reportDay,csvRows,fresh} from '../src/lib/weather.ts';
import {validateLead,submitLead} from '../src/lib/leads.ts';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
const header='Time,Size,Location,County,State,Lat,Lon,Comments\n';
test('SPC rollover, units, coordinates, quoted commas and state filtering',()=>{
 const rows=parseHail(header+'0030,175,Greeley,Weld,CO,40.42,-104.7,"Reported, preliminary"\n1200,100,Test,Test,NE,41,-102,test\n','2026-09-03');
 assert.equal(rows.length,1);assert.equal(rows[0].occurred_at,'2026-09-04T00:30:00.000Z');assert.equal(rows[0].size_inches,1.75);assert.equal(rows[0].longitude,-104.7);assert.equal(rows[0].comments,'Reported, preliminary');
});
test('unexpected schemas and invalid observations fail closed',()=>{
 assert.throws(()=>parseHail('<html>Error</html>','2026-09-03'));
 assert.throws(()=>parseHail(header+'2561,175,X,Weld,CO,40,-104,test\n','2026-09-03'));
 assert.throws(()=>parseHail(header+'1230,175,X,Weld,CO,,oops,test\n','2026-09-03'));
 assert.deepEqual(parseHail(header,'2026-09-03'),[]);
 assert.throws(()=>csvRows('"unclosed'));
});
test('report day changes at noon UTC',()=>{
 assert.equal(reportDay(Date.parse('2026-09-04T11:59:59Z')),'2026-09-03');
 assert.equal(reportDay(Date.parse('2026-09-04T12:00:00Z')),'2026-09-04');
});
test('failed and stale source checks are not fresh',()=>{
 assert.equal(fresh({status:'error',completed_at:new Date().toISOString()},15),false);
 assert.equal(fresh({status:'success',completed_at:'2000-01-01T00:00:00Z'},15),false);
});
function form(){const f=new FormData();for(const[k,v]of Object.entries({name:'Test',email:'test@example.com',phone:'',location:'Greeley',vehicle:'Test vehicle',damage_type:'hail',message:'',preferred_contact:'email',source_page:'/contact/',consent:'yes'}))f.set(k,v);return f;}
test('lead validation enforces consent, preferred contact, bounds and source',()=>{
 assert.equal(validateLead(form()).name,'Test');
 for(const [key,value] of [['consent','no'],['email','bad'],['name','x'.repeat(101)],['source_page','https://example.com'],['damage_type','invented']]){const f=form();f.set(key,value);assert.throws(()=>validateLead(f));}
});
test('unconfigured forms refuse submissions',async()=>{assert.equal((await submitLead(new Request('https://example.com/contact/',{method:'POST'}),{})).status,503);});
test('verified submission writes through prepared statements and rejects wrong host',async()=>{
 const sqlite=new DatabaseSync(':memory:');sqlite.exec(readFileSync(new URL('../migrations/0001_initial.sql',import.meta.url),'utf8'));
 const db={
  prepare(sql:string){
   return {bind(...values:unknown[]){
    return {async first(){return sqlite.prepare(sql).get(...values as never[]);},async run(){return sqlite.prepare(sql).run(...values as never[]);}};
   }};
  }
 } as unknown as D1Database;
 const env={DB:db,FORMS_ENABLED:'true',TURNSTILE_SITE_KEY:'test',TURNSTILE_SECRET_KEY:'test'};
 const original=globalThis.fetch;
 try{
  globalThis.fetch=async()=>Response.json({success:true,hostname:'example.com',action:'lead'});
  const body=new URLSearchParams(Array.from(form().entries()) as [string,string][]);body.set('cf-turnstile-response','test-token');
  const request=()=>new Request('https://example.com/contact/',{method:'POST',headers:{Origin:'https://example.com','Content-Type':'application/x-www-form-urlencoded'},body});
  assert.equal((await submitLead(request(),env)).ok,true);
  assert.equal((sqlite.prepare('SELECT COUNT(*) AS count FROM leads').get() as {count:number}).count,1);
  globalThis.fetch=async()=>Response.json({success:true,hostname:'attacker.example',action:'lead'});
  assert.equal((await submitLead(request(),env)).status,400);
  assert.equal((sqlite.prepare('SELECT COUNT(*) AS count FROM leads').get() as {count:number}).count,1);
 }finally{globalThis.fetch=original;sqlite.close();}
});
