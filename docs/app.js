const T=window.SHOTFLOW_TEMPLATES;
const STORAGE='shotflow-data-v2';
const freshState=()=>({version:2,shoots:[]});
let db=loadData(),activeId=null,newType='wedding',quickMode=false,installPrompt=null;
const $=id=>document.getElementById(id);
const clone=value=>JSON.parse(JSON.stringify(value));
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);

function loadData(){
 try{const parsed=JSON.parse(localStorage.getItem(STORAGE));if(parsed?.version===2&&Array.isArray(parsed.shoots))return parsed}catch{}
 return migrateWeddingData();
}
function migrateWeddingData(){
 const next=freshState();
 try{
  const old=JSON.parse(localStorage.getItem('courthouse-field-guide-pages-v1'));
  ['A','B'].forEach(letter=>{const value=old?.[letter];if(!value)return;const used=Object.keys(value.checked||{}).length||Object.values(value.details||{}).some(Boolean)||Object.values(value.notes||{}).some(Boolean);if(!used)return;const shoot=createShootRecord('wedding','Wedding '+letter,'','');shoot.people=value.details?.couple||'';shoot.location=value.details?.courthouse||'';shoot.brief=value.details?.vip||'';shoot.checked=value.checked||{};shoot.notes=value.notes||{};next.shoots.push(shoot)});
 }catch{}
 localStorage.setItem(STORAGE,JSON.stringify(next));return next;
}
function persist(message='Saved'){
 localStorage.setItem(STORAGE,JSON.stringify(db));$('saveStatus').classList.add('saving');$('saveStatus').lastChild.textContent=' '+message;clearTimeout(persist.timer);persist.timer=setTimeout(()=>{$('saveStatus').classList.remove('saving');$('saveStatus').lastChild.textContent=' Saved'},650);
}
function createShootRecord(type,name,date,location){
 return{id:uid(),type,name:name||T[type].defaultName,date:date||'',location:location||'',people:'',brief:'',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),archived:false,checked:{},notes:{},sections:clone(T[type].sections)};
}
function current(){return db.shoots.find(s=>s.id===activeId)}

function renderHome(){
 document.body.style.setProperty('--mode','#fbbf24');
 $('typeGrid').innerHTML=Object.entries(T).map(([key,t])=>'<button class="type-card" data-new="'+key+'" style="--card-accent:'+t.color+'"><span class="type-icon">'+t.icon+'</span><span class="type-copy"><strong>'+esc(t.label)+'</strong><small>'+esc(t.description)+'</small></span><span class="type-arrow">→</span></button>').join('');
 const active=db.shoots.filter(s=>!s.archived).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
 const archived=db.shoots.filter(s=>s.archived).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
 $('shootCount').textContent=active.length;
 $('shootList').innerHTML=active.length?active.map(shootCard).join(''):emptyState();
 $('archiveSection').classList.toggle('hidden',!archived.length);
 $('archiveList').innerHTML=archived.map(shootCard).join('');
 document.querySelectorAll('[data-new]').forEach(b=>b.addEventListener('click',()=>openNewShoot(b.dataset.new)));
 document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openGuide(b.dataset.open)));
}
function shootCard(s){
 const t=T[s.type],counts=countShoot(s),date=s.date?new Date(s.date).toLocaleString([], {month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):'Date not set';
 return '<button class="shoot-card" data-open="'+s.id+'" style="--card-accent:'+t.color+'"><span class="shoot-mode">'+t.icon+'</span><span class="shoot-copy"><small>'+esc(t.label)+' · '+esc(date)+'</small><strong>'+esc(s.name)+'</strong><span>'+esc(s.location||'Location not set')+'</span></span><span class="shoot-progress"><b>'+counts.percent+'%</b><i><em style="width:'+counts.percent+'%"></em></i></span></button>';
}
function emptyState(){return '<div class="empty-state"><span>◎</span><strong>No active shoots yet</strong><p>Choose a field guide above to start an assignment.</p></div>'}
function openNewShoot(type){
 newType=type;const t=T[type];$('dialogType').textContent=t.icon+' '+t.label;$('dialogType').style.setProperty('--mode',t.color);$('newShootName').value=t.defaultName;$('newShootDate').value='';$('newShootLocation').value='';$('newShootDialog').showModal();setTimeout(()=>$('newShootName').select(),50);
}
function createNewShoot(){
 const name=$('newShootName').value.trim();if(!name)return;
 const shoot=createShootRecord(newType,name,$('newShootDate').value,$('newShootLocation').value.trim());db.shoots.push(shoot);persist();$('newShootDialog').close();openGuide(shoot.id);
}
function openGuide(id){
 activeId=id;quickMode=false;const s=current();if(!s)return;document.body.style.setProperty('--mode',T[s.type].color);$('homeView').classList.add('hidden');$('guideView').classList.remove('hidden');$('bottomBar').classList.remove('hidden');hydrateGuide();window.scrollTo(0,0);
}
function goHome(){activeId=null;$('guideView').classList.add('hidden');$('bottomBar').classList.add('hidden');$('homeView').classList.remove('hidden');renderHome();window.scrollTo(0,0)}

function hydrateGuide(){
 const s=current(),t=T[s.type];$('modePill').textContent=t.icon+' '+t.label;$('modePill').style.setProperty('--mode',t.color);$('guideEyebrow').textContent=t.label.toUpperCase()+' ASSIGNMENT';$('shootName').value=s.name;$('shootDate').value=s.date;$('shootLocation').value=s.location;$('shootPeople').value=s.people;$('shootBrief').value=s.brief;$('bottomTitle').textContent=s.name;$('addSectionButton').classList.toggle('hidden',s.type!=='custom');$('quickToggle').textContent='☑ Quick view';$('bottomQuick').textContent='Quick';
 renderSections();renderQuick();updateProgress();
}
function renderSections(){
 const s=current();
 $('sectionNav').innerHTML=s.sections.map(section=>'<button data-jump="'+section.id+'">'+esc(section.title)+'</button>').join('')+'<button data-jump="quickReference">Final check</button>';
 $('guideSections').innerHTML=s.sections.map((section,index)=>{
  const items=section.items.map((item,i)=>{const id=section.id+'-'+i;return '<label class="check-row"><input type="checkbox" data-item="'+id+'" '+(s.checked[id]?'checked':'')+'><span>'+esc(item)+'</span></label>'}).join('');
  const prompts=section.prompts?.length?'<div class="prompts"><h3>SAY THIS</h3>'+section.prompts.map(p=>'<p>'+esc(p)+'</p>').join('')+'</div>':'';
  const add=s.type==='custom'?'<button class="add-item" data-add-item="'+section.id+'">＋ Add checklist item</button>':'';
  return '<details class="guide-section" id="'+section.id+'" '+(index===0?'open':'')+'><summary><span class="section-icon">'+section.icon+'</span><span class="section-title"><small>'+esc(section.eyebrow)+'</small><strong>'+esc(section.title)+'</strong></span><span class="section-count" data-count="'+section.id+'"></span><span class="chevron">⌄</span></summary><div class="section-body">'+(section.intro?'<p class="intro">'+esc(section.intro)+'</p>':'')+'<div class="check-grid">'+items+'</div>'+add+prompts+'<p class="director-note"><strong>FIELD NOTE: </strong>'+esc(section.tip||'Capture the safe version first, then make space to experiment.')+'</p><label class="notes-label" for="note-'+section.id+'">✎ SECTION NOTES</label><textarea class="section-note" id="note-'+section.id+'" data-note="'+section.id+'" placeholder="Add names, variations, problems or location notes…">'+esc(s.notes[section.id]||'')+'</textarea></div></details>'
 }).join('');
 bindGuideControls();updateSectionCounts();
}
function renderQuick(){
 const s=current(),t=T[s.type];const ids=(t.quick||[]).filter(id=>findItem(s,id));
 $('quickReference').innerHTML='<div class="quick-head"><span class="quick-icon">'+t.icon+'</span><div><span class="eyebrow">FIELD-SPEED VIEW</span><h2>'+esc(t.label)+' essentials</h2><p>The minimum coverage pass. Tap a label for the full section.</p></div></div><div class="quick-grid">'+ids.map(id=>{const found=findItem(s,id);return '<div class="quick-row '+(s.checked[id]?'done':'')+'"><input type="checkbox" data-item="'+id+'" '+(s.checked[id]?'checked':'')+'><button data-jump="'+found.section.id+'">'+esc(found.item)+'</button></div>'}).join('')+'</div><div class="mantra"><strong>'+flowTitle(s.type)+'</strong> '+flowText(s.type)+'</div>';
 bindGuideControls();
}
function findItem(s,id){for(const section of s.sections){for(let i=0;i<section.items.length;i++)if(section.id+'-'+i===id)return{section,item:section.items[i]}}return null}
function flowTitle(type){return type==='wedding'?'Flow mantra:':type==='editorial'?'Coverage rule:':type==='street'?'Street rhythm:':'Portrait rhythm:'}
function flowText(type){return type==='wedding'?'Place → Explain → Confirm → Release → Vary → Bridge.':type==='editorial'?'Clean frame → required orientations → movement → detail → experiment.':type==='street'?'Observe → compose → wait → anticipate → shoot through the moment.':'Connect → place → direct → vary → review → release.'}
function bindGuideControls(){
 document.querySelectorAll('[data-item]').forEach(input=>{input.onchange=e=>setChecked(e.target.dataset.item,e.target.checked)});
 document.querySelectorAll('[data-note]').forEach(note=>{note.oninput=e=>{const s=current();s.notes[e.target.dataset.note]=e.target.value;touch(s);persist()}});
 document.querySelectorAll('[data-jump]').forEach(button=>{button.onclick=()=>jumpTo(button.dataset.jump)});
 document.querySelectorAll('[data-add-item]').forEach(button=>{button.onclick=()=>openItemDialog(button.dataset.addItem)});
}
function setChecked(id,value){
 const s=current();s.checked[id]=value;touch(s);persist();document.querySelectorAll('[data-item="'+id+'"]').forEach(input=>input.checked=value);document.querySelectorAll('.quick-row').forEach(row=>{const input=row.querySelector('[data-item]');if(input)row.classList.toggle('done',!!s.checked[input.dataset.item])});updateSectionCounts();updateProgress();
}
function countShoot(s){const total=s.sections.reduce((n,section)=>n+section.items.length,0),done=Object.values(s.checked).filter(Boolean).length;return{total,done,percent:total?Math.round(done/total*100):0}}
function updateSectionCounts(){const s=current();s.sections.forEach(section=>{const done=section.items.filter((_,i)=>s.checked[section.id+'-'+i]).length;const el=document.querySelector('[data-count="'+section.id+'"]');if(el)el.textContent=done+'/'+section.items.length})}
function updateProgress(){const s=current(),c=countShoot(s);$('progressPercent').textContent=c.percent+'%';$('progressCount').textContent=c.done+' / '+c.total+' complete';$('progressBar').style.width=c.percent+'%';$('progressRing').style.setProperty('--progress',c.percent*3.6+'deg');$('bottomProgress').textContent=c.percent+'% · '+c.done+'/'+c.total}
function touch(s){s.updatedAt=new Date().toISOString()}
function jumpTo(id){if(quickMode&&id!=='quickReference')toggleQuick(false);setTimeout(()=>$(id)?.scrollIntoView({behavior:'smooth',block:'start'}),40)}
function toggleQuick(force){quickMode=typeof force==='boolean'?force:!quickMode;$('guideView').classList.toggle('quick-mode',quickMode);$('quickToggle').textContent=quickMode?'☷ Full guide':'☑ Quick view';$('bottomQuick').textContent=quickMode?'Full':'Quick';if(quickMode)jumpTo('quickReference')}

let itemSectionId=null;
function openItemDialog(sectionId){itemSectionId=sectionId;$('newItemText').value='';$('newItemPrompt').value='';$('itemDialog').showModal();setTimeout(()=>$('newItemText').focus(),50)}
function addCustomItem(){
 const text=$('newItemText').value.trim();if(!text)return;const s=current(),section=s.sections.find(x=>x.id===itemSectionId);if(!section)return;section.items.push(text);const prompt=$('newItemPrompt').value.trim();if(prompt)(section.prompts||(section.prompts=[])).push(prompt);touch(s);persist();$('itemDialog').close();renderSections();renderQuick();updateProgress();$(section.id).open=true;showToast('Checklist item added');
}
function addCustomSection(){
 const title=prompt('Name this section:');if(!title?.trim())return;const s=current(),id='custom-'+uid();s.sections.push({id,eyebrow:'Custom section',title:title.trim(),icon:'＋',items:[],prompts:[],tip:'Add the coverage and reminders this assignment needs.'});touch(s);persist();renderSections();renderQuick();$(id).open=true;jumpTo(id);
}

function openAppMenu(){
 $('menuTitle').textContent='ShotFlow options';$('menuActions').innerHTML='<button data-menu="export">⇩ Export backup</button><button data-menu="import">⇧ Import backup</button><button data-menu="archive-view">▤ View archive</button><button data-menu="about">ⓘ Data and offline use</button>';$('menuDialog').showModal();bindMenu();
}
function openGuideMenu(){
 const s=current();$('menuTitle').textContent=s.name;$('menuActions').innerHTML='<button data-menu="duplicate">⧉ Duplicate guide</button><button data-menu="archive">'+(s.archived?'↥ Restore to active':'✓ Move to archive')+'</button><button data-menu="export">⇩ Export all data</button><button data-menu="delete" class="danger">⌫ Delete this shoot</button>';$('menuDialog').showModal();bindMenu();
}
function bindMenu(){document.querySelectorAll('[data-menu]').forEach(b=>b.onclick=()=>runMenu(b.dataset.menu))}
function runMenu(action){
 $('menuDialog').close();
 if(action==='export')exportData();
 if(action==='import')$('importInput').click();
 if(action==='archive-view'){goHome();$('archiveSection').classList.remove('hidden');setTimeout(()=>$('archiveSection').scrollIntoView({behavior:'smooth'}),50)}
 if(action==='about')alert('ShotFlow stores assignments on this device. Export a backup before clearing browser data or changing devices. After the first online visit, the core app is available offline.');
 if(action==='duplicate'){const source=current(),copy=clone(source);copy.id=uid();copy.name=source.name+' — Copy';copy.createdAt=new Date().toISOString();copy.updatedAt=copy.createdAt;copy.archived=false;db.shoots.push(copy);persist();openGuide(copy.id);showToast('Guide duplicated')}
 if(action==='archive'){const s=current();s.archived=!s.archived;touch(s);persist();goHome();showToast(s.archived?'Moved to archive':'Restored to active')}
 if(action==='delete'){const s=current();if(confirm('Permanently delete “'+s.name+'”? This cannot be undone unless it is in an exported backup.')){db.shoots=db.shoots.filter(x=>x.id!==s.id);persist();goHome();showToast('Shoot deleted')}}
}
function exportData(){
 const payload={app:'ShotFlow',version:2,exportedAt:new Date().toISOString(),data:db};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='shotflow-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast('Backup downloaded');
}
async function importData(file){
 try{const payload=JSON.parse(await file.text()),incoming=payload?.data||payload;if(incoming?.version!==2||!Array.isArray(incoming.shoots))throw new Error();if(!confirm('Replace the shoots on this device with the imported backup?'))return;db=incoming;persist('Imported');goHome();showToast('Backup restored')}catch{alert('That file is not a valid ShotFlow backup. Your current data was not changed.')}finally{$('importInput').value=''}
}
function showToast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>$('toast').classList.remove('show'),2200)}

function registerWebMCP(){
 const context=document.modelContext;if(!context?.registerTool)return;
 const lifecycle=new AbortController();
 try{Promise.resolve(context.registerTool({
  name:'create_shoot_guide',title:'Create shoot guide',description:'Create and open a new Street, Editorial, Wedding, or Custom/Portrait assignment in ShotFlow.',
  inputSchema:{type:'object',properties:{type:{type:'string',enum:['street','editorial','wedding','custom']},name:{type:'string',minLength:1},date:{type:'string'},location:{type:'string'}},required:['type','name'],additionalProperties:false},
  annotations:{readOnlyHint:false,untrustedContentHint:false},
  execute(input){
   if(!input||!T[input.type]||typeof input.name!=='string'||!input.name.trim())throw new Error('A valid guide type and non-empty name are required.');
   if(input.date!==undefined&&typeof input.date!=='string')throw new Error('Date must be a string.');
   if(input.location!==undefined&&typeof input.location!=='string')throw new Error('Location must be a string.');
   const shoot=createShootRecord(input.type,input.name.trim(),input.date||'',input.location?.trim()||'');db.shoots.push(shoot);persist();openGuide(shoot.id);return{id:shoot.id,type:shoot.type,name:shoot.name,status:'created'};
  }
 },{signal:lifecycle.signal})).catch(()=>{})}catch{}
}

$('newShootForm').addEventListener('submit',e=>{e.preventDefault();createNewShoot()});
$('itemForm').addEventListener('submit',e=>{e.preventDefault();addCustomItem()});
document.querySelectorAll('[data-close]').forEach(button=>button.onclick=()=>$(button.dataset.close).close());
$('homeButton').onclick=goHome;$('backButton').onclick=goHome;$('bottomBack').onclick=goHome;
$('moreButton').onclick=openAppMenu;$('guideMenuButton').onclick=openGuideMenu;
$('backupButton').onclick=exportData;$('importInput').onchange=e=>e.target.files[0]&&importData(e.target.files[0]);
$('quickToggle').onclick=()=>toggleQuick();$('bottomQuick').onclick=()=>toggleQuick();$('addSectionButton').onclick=addCustomSection;
['shootName','shootDate','shootLocation','shootPeople','shootBrief'].forEach(id=>{$(id).oninput=e=>{const s=current(),field={shootName:'name',shootDate:'date',shootLocation:'location',shootPeople:'people',shootBrief:'brief'}[id];s[field]=e.target.value;$('bottomTitle').textContent=s.name;touch(s);persist()}});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('installButton').classList.remove('hidden')});
$('installButton').onclick=async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('installButton').classList.add('hidden')};
renderHome();
registerWebMCP();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
