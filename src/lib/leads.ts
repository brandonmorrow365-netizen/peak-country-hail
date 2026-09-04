export function validateLead(form:FormData){
 const read=(key:string,max:number,required=false)=>{const value=form.get(key);if(typeof value!=='string'||value.length>max||(required&&!value.trim()))throw new Error('Please check the '+key.replaceAll('_',' ')+' field.');return value.trim();};
 const name=read('name',100,true),email=read('email',254),phone=read('phone',40),location=read('location',120,true),vehicle=read('vehicle',160,true),damage=read('damage_type',40,true),message=read('message',4000),preferred=read('preferred_contact',10,true),source=read('source_page',100,true);
 if(!['email','phone'].includes(preferred))throw new Error('Choose a contact method.');
 if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Enter a valid email address.');
 if(phone&&(phone.replace(/\D/g,'').length<7||phone.replace(/\D/g,'').length>15))throw new Error('Enter a valid phone number.');
 if(preferred==='email'&&!email||preferred==='phone'&&!phone)throw new Error('Provide your preferred contact details.');
 if(!['hail','door-ding','crease','other'].includes(damage))throw new Error('Choose a damage type.');
 if(!['/contact/','/free-hail-inspection/'].includes(source))throw new Error('Invalid source page.');
 if(form.get('consent')!=='yes')throw new Error('Please acknowledge the contact consent.');
 if(form.get('website'))throw new Error('Unable to accept this request.');
 return {name,email,phone,location,vehicle,damage,message,preferred,source};
}
export async function submitLead(request:Request,env:Cloudflare.Env):Promise<{status:number;message:string;ok?:boolean}>{
 if(env.FORMS_ENABLED!=='true'||!env.DB||!env.TURNSTILE_SECRET_KEY||!env.TURNSTILE_SITE_KEY)return {status:503,message:'Online requests are not available yet. Please return when contact details are published.'};
 const url=new URL(request.url);
 if(request.headers.get('origin')!==url.origin)return {status:403,message:'Please submit the form from this website.'};
 if(!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded'))return {status:415,message:'Unsupported form format.'};
 try{
  // Bound the actual streamed body, including requests without Content-Length.
  const reader=request.body?.getReader();if(!reader)return {status:400,message:'No form data received.'};
  let bytes=0;const chunks:Uint8Array[]=[];
  while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>24000){await reader.cancel();return {status:413,message:'The form is too large. Shorten your message.'};}chunks.push(value);}
  const body=new Uint8Array(bytes);let offset=0;for(const c of chunks){body.set(c,offset);offset+=c.length;}
  const form=new FormData();for(const [k,v] of new URLSearchParams(new TextDecoder().decode(body))){if(form.has(k))return {status:400,message:'Duplicate form fields are not accepted.'};form.set(k,v);}
  let lead;try{lead=validateLead(form);}catch(e){return {status:400,message:(e as Error).message};}
  const token=form.get('cf-turnstile-response');if(typeof token!=='string'||!token||token.length>2048)return {status:400,message:'Complete the spam protection and try again.'};
  const result=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:env.TURNSTILE_SECRET_KEY,response:token}),signal:AbortSignal.timeout(10000)});
  if(!result.ok)return {status:503,message:'Spam protection is temporarily unavailable. Please try again.'};
  const verification=await result.json() as {success?:boolean;hostname?:string;action?:string};
  if(!verification.success||verification.hostname!==url.hostname||verification.action!=='lead')return {status:400,message:'Spam verification expired or failed. Reload the form and try again.'};
  const recent=await env.DB.prepare('SELECT COUNT(*) AS count FROM leads WHERE created_at>? AND (email=? AND email<>\'\' OR phone=? AND phone<>\'\')').bind(new Date(Date.now()-3600000).toISOString(),lead.email,lead.phone).first<{count:number}>();
  if((recent?.count||0)>=3)return {status:429,message:'Several requests have already been received for these contact details. Please try again later.'};
  await env.DB.prepare('INSERT INTO leads(id,created_at,name,email,phone,location,vehicle,damage_type,message,preferred_contact,source_page,consent_version) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),new Date().toISOString(),lead.name,lead.email,lead.phone,lead.location,lead.vehicle,lead.damage,lead.message,lead.preferred,lead.source,'contact-v1').run();
  return {status:200,ok:true,message:'Your request has been saved. This is not an appointment confirmation.'};
 }catch{return {status:503,message:'We could not confirm that your request was saved. Please try again later.'};}
}
