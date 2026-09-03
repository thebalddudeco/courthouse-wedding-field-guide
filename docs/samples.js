const themes=[
 {id:'editorial',number:'01',name:'Editorial Sand',copy:'Gallery-catalog restraint with warm stone surfaces, black ink and a cool sky accent.',personality:'Artful · quiet · high-fashion',best:'Editorial and wedding storytelling',watch:'Needs strong contrast outdoors'},
 {id:'technical',number:'02',name:'Technical Black',copy:'Pure black, hairline grids and one camera-orange signal color. Built to feel like professional equipment.',personality:'Precise · fast · uncompromising',best:'Bright exteriors and field-speed use',watch:'The starkest and most utilitarian option'},
 {id:'gallery',number:'03',name:'Gallery Night',copy:'Deep green-black surfaces, warm cream type and amber details with softer, modern geometry.',personality:'Premium · friendly · cinematic',best:'A broad photography audience',watch:'Rounder and more app-like than editorial'},
 {id:'darkroom',number:'04',name:'Darkroom Gold',copy:'Charcoal, aged gold and photographic-paper cream inspired by classic labs and archival print boxes.',personality:'Crafted · timeless · tactile',best:'A distinctive photographer-first identity',watch:'Vintage cues need disciplined typography'}
];
let index=0;
const buttons=[...document.querySelectorAll('[data-set-theme]')];
function setTheme(next){index=(next+themes.length)%themes.length;const t=themes[index];document.body.dataset.theme=t.id;buttons.forEach(b=>b.classList.toggle('active',b.dataset.setTheme===t.id));document.querySelector('.sample-count').textContent=t.number+' / 04';document.querySelector('.direction-number').textContent=t.number;document.querySelector('.direction-notes h2').textContent=t.name;document.querySelector('.direction-copy').textContent=t.copy;const values=document.querySelectorAll('.direction-notes dd');values[0].textContent=t.personality;values[1].textContent=t.best;values[2].textContent=t.watch}
buttons.forEach((button,i)=>button.onclick=()=>setTheme(i));
document.getElementById('previousTheme').onclick=()=>setTheme(index-1);document.getElementById('nextTheme').onclick=()=>setTheme(index+1);
document.querySelectorAll('.phase-tabs button').forEach(button=>button.onclick=()=>{document.querySelectorAll('.phase-tabs button').forEach(b=>b.classList.remove('active'));button.classList.add('active')});
document.querySelectorAll('.shot').forEach(button=>button.onclick=e=>{if(e.target.classList.contains('toggle-star')){e.target.textContent=e.target.textContent==='★'?'☆':'★';return}button.classList.toggle('done');button.querySelector('.check').textContent=button.classList.contains('done')?'✓':''});
