(() => {
 const cfg=window.KRATHONG_CONFIG;
 const client=window.supabase?.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY);
 const $=id=>document.getElementById(id);
 const loginPanel=$('loginPanel'),dashboard=$('dashboard');
 function status(msg){$('status').textContent=msg}
 if(!client){status('ไม่พบ Supabase SDK หรือ Config');return;}
 async function check(){const {data:{session}}=await client.auth.getSession();if(!session)return;const {data,error}=await client.from('krathong_admins').select('user_id').eq('user_id',session.user.id).maybeSingle();if(error||!data){await client.auth.signOut();status('บัญชีนี้ไม่ได้รับสิทธิ์ Admin');return;}loginPanel.hidden=true;dashboard.hidden=false;await load();}
 async function load(){const {data,error}=await client.from('krathongs').select('id,name,wish,design,created_at').order('created_at',{ascending:false});if(error){$('list').textContent='โหลดข้อมูลไม่สำเร็จ: '+error.message;return;}$('count').textContent=`${data.length} รายการ`;const list=$('list');list.replaceChildren();data.forEach(row=>{const article=document.createElement('article');article.className='item';const heading=document.createElement('h3');heading.textContent=row.name||'ไม่ระบุชื่อ';const meta=document.createElement('small');meta.textContent=`${row.design||'lotus'} · ${row.created_at||''}`;const wish=document.createElement('p');wish.textContent=row.wish||'';const btn=document.createElement('button');btn.className='delete';btn.textContent='ลบรายการ';btn.onclick=async()=>{if(!confirm('ลบคำอธิษฐานรายการนี้?'))return;const {error}=await client.from('krathongs').delete().eq('id',row.id);if(error)alert('ลบไม่สำเร็จ: '+error.message);else load();};article.append(heading,meta,wish,btn);list.append(article);});}
 $('loginForm').addEventListener('submit',async e=>{e.preventDefault();status('กำลังเข้าสู่ระบบ…');const {error}=await client.auth.signInWithPassword({email:$('email').value,password:$('password').value});if(error){status(error.message);return;}await check();});
 $('logout').onclick=async()=>{await client.auth.signOut();dashboard.hidden=true;loginPanel.hidden=false;};check();
})();
