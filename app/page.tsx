'use client';

import { useEffect, useMemo, useState } from 'react';
import { Camera, CheckCircle2, ChevronDown, ClipboardCheck, Footprints, Heart, MapPin, NotebookPen, RefreshCcw, Sparkles, Users } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

type WeddingKey = 'A' | 'B';
type GuideState = { checked: Record<string, boolean>; notes: Record<string, string>; details: { couple: string; time: string; courthouse: string; vip: string } };
type Section = { id: string; eyebrow: string; title: string; icon: typeof Camera; intro?: string; items: string[]; prompts?: string[]; tip?: string };
const blankGuide = (): GuideState => ({ checked: {}, notes: {}, details: { couple: '', time: '', courthouse: '', vip: '' } });
const poseFrames = ['Wide', 'Medium', 'Tight', 'Vertical', 'Horizontal', 'Camera smile', 'Transition candid'];

const sections: Section[] = [
  { id: 'preflight', eyebrow: 'Before leaving', title: 'Pre-shoot checklist', icon: ClipboardCheck, intro: 'Confirm the people, place, rules and gear before the day starts moving.', items: [
    'Time, address and exact meeting point confirmed', 'Courthouse access, security, flash and ceremony-position rules checked', 'Names, pronunciations, preferred terms, VIPs and mobility needs reviewed', 'Rings, IDs, documents, vows and designated item holder confirmed', 'Camera clocks synced; cards formatted; batteries and backup body ready', 'Lenses clean; RAW enabled; focus and test exposure checked', 'Weather, indoor backup, street route and departure alarm checked', 'Water, rain cover and compact bag packed'],
    tip: 'Welcome: “I’ll guide you the whole way. Nothing has to feel stiff. I’ll give you a simple direction, you two keep moving and reacting to each other, and I’ll adjust the little details. If anything feels uncomfortable, tell me and we’ll switch it immediately.”' },
  { id: 'before', eyebrow: 'Courthouse story · 01', title: 'Before the ceremony', icon: MapPin, items: [
    'Exterior establishing frames: facade, doors, steps and neighborhood', 'Arrival, greeting, walking in and courthouse signage', 'Security, elevator, hallway and waiting-room candids (as permitted)', 'Rings, bouquet, attire, shoes, vows and documents', 'Individual portraits of each partner', 'Quiet connection: hands, glances, nerves, laughter and family support'],
    tip: 'Photograph the anticipation without interrupting it. Stay alert for hands, eye contact and the small exchanges between people.' },
  { id: 'during', eyebrow: 'Courthouse story · 02', title: 'During the ceremony', icon: Heart, items: [
    'Room-wide scene setter and entrance', 'Officiant or judge, witnesses and family reactions', 'Vows: speaker, listener and both in one frame', 'Ring exchange: wide context plus tight hands', 'Pronouncement and immediate reactions', 'First kiss, embrace, applause and laughter', 'Signing, witnesses and certificate details where permitted'],
    tip: 'Prioritize the non-repeatable moment first, then vary framing only when movement and rules allow.' },
  { id: 'after', eyebrow: 'Courthouse story · 03', title: 'Just married', icon: Sparkles, items: [
    'Exit through the doors and first just-married reaction', 'Steps celebration, congratulations, hugs and ring reactions', 'Certificate portrait with private numbers covered', 'Couple with officiant/judge and witnesses if permitted', 'Family formals before anyone is released', 'Five-pose couple flow, then city walk'],
    tip: 'Let the first celebration unfold before directing. Capture it cleanly, then rebuild one celebratory frame if needed.' },
  { id: 'pose-walk', eyebrow: 'Pose flow · 01', title: 'Lovely Walk', icon: Footprints, intro: 'Begin with movement. It warms them up, creates interaction and buys you time to read the light.', items: poseFrames, prompts: [
    '“Hold hands and take a slow, lovely walk straight toward me. Don’t look at me — look at each other. Stay close, keep the pace easy, and let your free hands relax.”',
    '“Now walk away from me, still connected. Talk to each other. Halfway down, bump hips gently, laugh it off, and keep walking.”',
    '“Perfect. Turn back toward me and do it again, but this time one of you lead for three steps, then switch.”'],
    tip: 'Bridge shot: photograph the turn, the reset, swinging hands and whatever happens after the hip bump.' },
  { id: 'pose-kiss', eyebrow: 'Pose flow · 02', title: 'Smile Into / Out of Kiss', icon: Heart, intro: 'The approach and release are often more expressive than the kiss itself.', items: poseFrames, prompts: [
    '“Come chest-to-chest and get comfortable. Bring your faces close. On three, smile into the kiss — like you’re trying to kiss with your teeth. It may feel ridiculous; that’s exactly why it works.”',
    '“Now let the kiss happen. Hold it for a beat, then slowly pull apart and smile out of the kiss — at each other, not at me.”',
    '“Good. Stay close, noses almost touching. One of you whisper something that will make the other laugh.”', 'If they look at you: “No, no — I meant smile at each other, not at me!”'],
    tip: 'Bridge shot: stay on them after the kiss for the exhale, laugh, forehead touch and hand adjustment.' },
  { id: 'pose-kidnap', eyebrow: 'Pose flow · 03', title: 'Kidnap / Sneak-up Hug', icon: Users, intro: 'Offer this as a comfortable, opt-in surprise hug. No lifting; keep every movement gentle.', items: poseFrames, prompts: [
    '“You’re going to sneak up from behind, wrap them in a big surprise hug, and give one gentle side-to-side shake. No lifting. Keep it comfortable. You in front: you’re delighted, look back to see who caught you, and grab onto their arms.”',
    '“On three: one, two, three — sneak-up hug! Keep your faces close, then let it turn into whatever feels natural.”',
    '“Great. Do it once more, smaller and slower. This time give a squeeze, then both look at each other.”'],
    tip: 'Bridge shot: capture the approach, impact, look-back and the moment they untangle.' },
  { id: 'pose-pretzel', eyebrow: 'Pose flow · 04', title: 'Pretzel Hug', icon: Users, intro: 'A connected, layered pose that moves easily from playful to quiet.', items: poseFrames, prompts: [
    '“Stand one directly behind the other. Let both arms rest down for a second. On three, wrap up into a pretzel hug — arms around each other, hands connected, and give a few gentle squeezes. One, two, three.”',
    '“Back partner, bring your face in close. Both of you turn slightly toward each other. Keep your cheeks or temples near, then rock the boat gently side to side.”',
    '“Now get smiley with each other. Front partner, look back. Back partner, look at them — then both close your eyes for one calm frame.”'],
    tip: 'Watch every hand. If an arm has no job, connect it, soften it or hide it naturally.' },
  { id: 'pose-camera', eyebrow: 'Pose flow · 05', title: 'Smile / Look at Camera', icon: Camera, intro: 'Finish every location with one clean, printable camera-facing portrait.', items: poseFrames, prompts: [
    '“Wrap up with all your arms — no hands hanging without a job. Bring your faces nice and close, turn in, touch at the temple if that feels natural, and lean just slightly toward my lens. Beautiful. Eyes right here.”',
    '“Hold that. Soft smile first… now the big family smile. Great. Keep the pose and look at each other for one last frame.”',
    '“Now switch who is slightly forward, reconnect your hands, and give me one clean vertical and one horizontal.”'],
    tip: 'Insurance frame: check expression, hands, clothing, background edges and focus before moving on.' },
  { id: 'family', eyebrow: 'People coverage', title: 'Family & groups', icon: Users, items: [
    'Everyone present', 'Both immediate families / support circles', 'Each partner’s side separately', 'Parents or guardians', 'Siblings', 'Grandparents or elders', 'Children', 'Witnesses', 'Officiant or judge, if permitted', 'Friends'], prompts: [
    '“Everyone, bring your feet in and close the gaps. Turn your shoulders slightly toward the couple. Hands relaxed or connected — nothing floating. Faces toward me. I’ll take three for blinking.”',
    '“Stay together. Look at the couple and celebrate them — then everybody back to me for one clean frame.”',
    '“Please send the next group in while I photograph this one. Once you’ve been photographed, stay nearby until I release you.”'],
    tip: 'Start largest, remove people, and keep the couple anchored. Take at least three frames of every must-have group.' },
  { id: 'street', eyebrow: 'City portraits', title: 'Street walking sequence', icon: MapPin, items: [
    'Courthouse steps and doorway / columns', 'Sidewalk walk toward and away', 'Safe crosswalk with legal signal', 'Corner pause and city-context portrait', 'Reflections in glass or polished surfaces', 'Layered traffic, architecture and pedestrian frames', 'Transit or car moment only if it happens naturally'], prompts: [
    '“Walk like you’re headed somewhere together, not performing for me. Stay connected, look at each other, and keep moving through the frame.”',
    '“At the corner, stop shoulder-to-shoulder, take in the city for a second, then turn toward each other when I call it.”',
    '“On the next few steps, one of you look back at me while the other keeps looking forward. Then switch.”',
    '“Pause in the doorway. Give me the clean camera portrait first — now forget me and settle into each other.”'],
    tip: 'Safety script: “I’ll choose the safe position and watch the signal. You never need to rush or stop in the street for a photograph.”' },
  { id: 'reset', eyebrow: 'Between weddings', title: 'Client reset', icon: RefreshCcw, items: [
    'Back up Wedding A and physically isolate its cards', 'Fresh cards and batteries loaded', 'Lens cleaned; exposure and white balance reset', 'Wedding B details, VIPs and meeting point reopened', 'Hydrate, eat and confirm travel buffer', 'Send arrival update only if already agreed with client'],
    tip: 'Treat the second wedding as a fresh production. Never rely on memory from the first client.' },
];

const storageKey = 'courthouse-field-guide-v1';

type WebMCPContext = { registerTool: (tool: { name: string; title: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean; untrustedContentHint: boolean }; execute: (input: unknown) => unknown }, options?: { signal: AbortSignal }) => void | Promise<void> };

export default function Home() {
  const [activeWedding, setActiveWedding] = useState<WeddingKey>('A');
  const [guides, setGuides] = useState<Record<WeddingKey, GuideState>>({ A: blankGuide(), B: blankGuide() });
  const [loaded, setLoaded] = useState(false);
  const [quickOnly, setQuickOnly] = useState(false);
  useEffect(() => { try { const saved = window.localStorage.getItem(storageKey); if (saved) setGuides(JSON.parse(saved)); } catch {} setLoaded(true); }, []);
  useEffect(() => { if (loaded) window.localStorage.setItem(storageKey, JSON.stringify(guides)); }, [guides, loaded]);
  useEffect(() => {
    const context = (document as Document & { modelContext?: WebMCPContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const validIds = new Set(sections.flatMap((section) => section.items.map((_, index) => `${section.id}-${index}`)));
    try {
      void Promise.resolve(context.registerTool({
        name: 'complete_wedding_guide_items',
        title: 'Complete wedding guide items',
        description: 'Mark one or more checklist items complete for Wedding A or Wedding B in the visible courthouse field guide.',
        inputSchema: { type: 'object', properties: { wedding: { type: 'string', enum: ['A', 'B'] }, itemIds: { type: 'array', items: { type: 'string' }, minItems: 1, uniqueItems: true } }, required: ['wedding', 'itemIds'], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const value = input as { wedding?: unknown; itemIds?: unknown };
          if ((value.wedding !== 'A' && value.wedding !== 'B') || !Array.isArray(value.itemIds) || !value.itemIds.every((id) => typeof id === 'string' && validIds.has(id))) throw new Error('Invalid wedding or checklist item ID.');
          const wedding = value.wedding as WeddingKey;
          const ids = value.itemIds as string[];
          setGuides((current) => ({ ...current, [wedding]: { ...current[wedding], checked: { ...current[wedding].checked, ...Object.fromEntries(ids.map((id) => [id, true])) } } }));
          return { wedding, completed: ids, count: ids.length };
        },
      }, { signal: lifecycle.signal })).catch(() => undefined);
    } catch {}
    return () => lifecycle.abort();
  }, []);
  const guide = guides[activeWedding];
  const total = useMemo(() => sections.reduce((sum, section) => sum + section.items.length, 0), []);
  const complete = Object.values(guide.checked).filter(Boolean).length;
  const percent = Math.round((complete / total) * 100);
  const setChecked = (id: string, value: boolean) => setGuides((current) => ({ ...current, [activeWedding]: { ...current[activeWedding], checked: { ...current[activeWedding].checked, [id]: value } } }));
  const setNote = (id: string, value: string) => setGuides((current) => ({ ...current, [activeWedding]: { ...current[activeWedding], notes: { ...current[activeWedding].notes, [id]: value } } }));
  const setDetail = (field: keyof GuideState['details'], value: string) => setGuides((current) => ({ ...current, [activeWedding]: { ...current[activeWedding], details: { ...current[activeWedding].details, [field]: value } } }));
  const resetWedding = () => { if (window.confirm(`Clear every checkmark, note and detail for Wedding ${activeWedding}?`)) setGuides((current) => ({ ...current, [activeWedding]: blankGuide() })); };
  const jumpTo = (id: string) => { setQuickOnly(false); window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); };

  return <main className="min-h-screen bg-[#071018] text-slate-100">
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071018]/95 backdrop-blur-xl"><div className="mx-auto max-w-5xl px-4 pb-3 pt-3 sm:px-6">
      <div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-400 text-[#071018] shadow-[0_0_24px_rgba(251,191,36,.2)]"><Camera className="size-5" strokeWidth={2.4}/></div><div className="min-w-0"><p className="truncate text-[10px] font-bold uppercase tracking-[.22em] text-amber-300">Field Guide</p><h1 className="truncate text-base font-bold tracking-tight sm:text-lg">Courthouse Wedding Run-of-Show</h1></div></div><span className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex"><CheckCircle2 className="size-3.5 text-emerald-400"/> Saved on this device</span></div>
      <div className="mt-3 flex items-center gap-3"><Tabs value={activeWedding} onValueChange={(value) => setActiveWedding(value as WeddingKey)} className="shrink-0"><TabsList className="h-11 rounded-xl border border-white/10 bg-white/5 p-1"><TabsTrigger value="A" className="min-w-24 rounded-lg text-sm data-[state=active]:bg-amber-400 data-[state=active]:text-[#071018]">Wedding A</TabsTrigger><TabsTrigger value="B" className="min-w-24 rounded-lg text-sm data-[state=active]:bg-amber-400 data-[state=active]:text-[#071018]">Wedding B</TabsTrigger></TabsList></Tabs><div className="min-w-0 flex-1"><div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-400"><span>{complete} / {total} shots</span><span>{percent}%</span></div><Progress value={percent} className="h-2 bg-white/10 [&>div]:bg-emerald-400"/></div></div>
    </div></header>
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-5 sm:px-6">
      <section className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,.07),rgba(255,255,255,.025))] p-4 shadow-2xl shadow-black/20 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-[.2em] text-amber-300">Wedding {activeWedding} dashboard</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Today’s assignment</h2></div><div className="flex gap-2"><Button onClick={() => setQuickOnly((v) => !v)} className="h-11 rounded-xl bg-amber-400 px-4 font-bold text-[#071018] hover:bg-amber-300"><ClipboardCheck className="size-4"/> {quickOnly ? 'Full guide' : 'Quick view'}</Button><Button variant="outline" size="icon" onClick={resetWedding} aria-label={`Clear Wedding ${activeWedding}`} className="size-11 rounded-xl border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"><RefreshCcw className="size-4"/></Button></div></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3"><Input value={guide.details.couple} onChange={(e) => setDetail('couple', e.target.value)} placeholder="Couple / identifier" aria-label="Couple or identifier" className="h-12 rounded-xl border-white/10 bg-black/20 text-base placeholder:text-slate-500"/><Input value={guide.details.time} onChange={(e) => setDetail('time', e.target.value)} placeholder="Ceremony time" aria-label="Ceremony time" className="h-12 rounded-xl border-white/10 bg-black/20 text-base placeholder:text-slate-500"/><Input value={guide.details.courthouse} onChange={(e) => setDetail('courthouse', e.target.value)} placeholder="Courthouse / meeting point" aria-label="Courthouse and meeting point" className="h-12 rounded-xl border-white/10 bg-black/20 text-base placeholder:text-slate-500"/></div>
        <Textarea value={guide.details.vip} onChange={(e) => setDetail('vip', e.target.value)} placeholder="VIPs, family combinations, sensitivities, access notes…" className="mt-3 min-h-20 rounded-xl border-white/10 bg-black/20 text-base placeholder:text-slate-500"/>
      </section>
      <nav aria-label="Guide shortcuts" className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">{[['preflight','Preflight'],['before','Before'],['during','Ceremony'],['pose-walk','5 poses'],['family','Groups'],['street','City'],['quick-reference','Final check']].map(([id,label]) => <button key={id} onClick={() => jumpTo(id)} className="h-10 shrink-0 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-300 active:bg-amber-400 active:text-[#071018]">{label}</button>)}</nav>
      {!quickOnly ? <div className="mt-5 space-y-4">{sections.map((section) => <GuideSection key={section.id} section={section} guide={guide} setChecked={setChecked} setNote={setNote}/>)}</div> : <QuickReference guide={guide} setChecked={setChecked} jumpTo={jumpTo}/>} {!quickOnly && <QuickReference guide={guide} setChecked={setChecked} jumpTo={jumpTo}/>} 
    </div>
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b1721]/96 px-4 py-3 backdrop-blur-xl sm:hidden"><div className="mx-auto flex max-w-md items-center gap-3"><div className="min-w-0 flex-1"><p className="text-xs font-bold">Wedding {activeWedding} · {percent}% complete</p><Progress value={percent} className="mt-1.5 h-1.5 bg-white/10 [&>div]:bg-emerald-400"/></div><Button onClick={() => setQuickOnly((v) => !v)} className="h-11 rounded-xl bg-amber-400 font-bold text-[#071018] hover:bg-amber-300">{quickOnly ? 'Full guide' : 'Quick view'}</Button></div></div>
  </main>;
}

function GuideSection({ section, guide, setChecked, setNote }: { section: Section; guide: GuideState; setChecked: (id:string,value:boolean)=>void; setNote:(id:string,value:string)=>void }) {
  const Icon = section.icon; const done = section.items.filter((_,i) => guide.checked[`${section.id}-${i}`]).length;
  return <section id={section.id} className="scroll-mt-40 overflow-hidden rounded-2xl border border-white/10 bg-white/[.035]"><Accordion type="single" collapsible defaultValue={section.id === 'preflight' ? section.id : undefined}><AccordionItem value={section.id} className="border-0"><AccordionTrigger className="min-h-20 px-4 py-4 text-left hover:no-underline sm:px-5 [&>svg]:hidden"><div className="flex w-full items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl border border-amber-300/20 bg-amber-400/10 text-amber-300"><Icon className="size-5"/></span><span className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">{section.eyebrow}</span><span className="mt-0.5 block text-lg font-bold text-slate-100">{section.title}</span></span><span className="mr-1 text-xs font-bold text-slate-500">{done}/{section.items.length}</span><ChevronDown className="size-5 text-slate-500 transition-transform duration-200 [[data-state=open]_&]:rotate-180"/></div></AccordionTrigger><AccordionContent className="px-4 pb-5 sm:px-5">
    {section.intro && <p className="mb-4 max-w-3xl text-sm leading-6 text-slate-400">{section.intro}</p>}<div className="grid gap-2 sm:grid-cols-2">{section.items.map((item,i) => { const id=`${section.id}-${i}`; return <CheckRow key={id} id={id} label={item} checked={!!guide.checked[id]} onChecked={setChecked}/>; })}</div>
    {section.prompts && <div className="mt-5 rounded-2xl border border-amber-300/15 bg-amber-300/[.055] p-4"><p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-amber-300">Say this</p><div className="space-y-3">{section.prompts.map((prompt) => <p key={prompt} className="text-sm leading-6 text-slate-200">{prompt}</p>)}</div></div>}
    {section.tip && <p className="mt-4 border-l-2 border-emerald-400 pl-3 text-sm leading-6 text-slate-400"><span className="font-bold text-emerald-300">Director’s note: </span>{section.tip}</p>}
    <div className="mt-5"><label htmlFor={`notes-${section.id}`} className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-slate-500"><NotebookPen className="size-3.5"/> Section notes</label><Textarea id={`notes-${section.id}`} value={guide.notes[section.id] || ''} onChange={(e) => setNote(section.id,e.target.value)} placeholder="Add reminders, names, variations or location notes…" className="min-h-24 rounded-xl border-white/10 bg-black/20 text-base placeholder:text-slate-600"/></div>
  </AccordionContent></AccordionItem></Accordion></section>;
}

function CheckRow({ id,label,checked,onChecked }:{id:string;label:string;checked:boolean;onChecked:(id:string,value:boolean)=>void}) { return <label htmlFor={id} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${checked ? 'border-emerald-400/25 bg-emerald-400/10 text-slate-400' : 'border-white/[.07] bg-black/15 text-slate-200 active:bg-white/10'}`}><Checkbox id={id} checked={checked} onCheckedChange={(v)=>onChecked(id,v===true)} className="size-6 shrink-0 rounded-md border-slate-500 data-[state=checked]:border-emerald-400 data-[state=checked]:bg-emerald-400 data-[state=checked]:text-[#071018]"/><span className={`text-sm leading-5 ${checked ? 'line-through decoration-slate-600' : ''}`}>{label}</span></label>; }

const quickItems = [
  ['preflight-0','Meeting point + time confirmed','preflight'],['preflight-4','Cards, batteries + backup ready','preflight'],['before-0','Courthouse exterior','before'],['before-1','Arrival + entrance','before'],['during-0','Ceremony wide','during'],['during-2','Vows + reactions','during'],['during-3','Rings','during'],['during-5','Kiss + embrace','during'],['during-6','Signing + witnesses','during'],['after-0','Just-married exit','after'],['family-0','Everyone present','family'],['pose-walk-0','Lovely Walk','pose-walk'],['pose-kiss-0','Smile into/out of kiss','pose-kiss'],['pose-kidnap-0','Sneak-up hug','pose-kidnap'],['pose-pretzel-0','Pretzel hug','pose-pretzel'],['pose-camera-0','Clean camera portrait','pose-camera'],['street-1','City walking','street']
] as const;

function QuickReference({guide,setChecked,jumpTo}:{guide:GuideState;setChecked:(id:string,value:boolean)=>void;jumpTo:(id:string)=>void}) { return <section id="quick-reference" className="scroll-mt-40 mt-5 rounded-2xl border border-amber-300/20 bg-[linear-gradient(145deg,rgba(251,191,36,.11),rgba(255,255,255,.025))] p-4 sm:p-6"><div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-400 text-[#071018]"><ClipboardCheck className="size-5"/></span><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-amber-300">Phone-first final pass</p><h2 className="mt-0.5 text-xl font-bold">Quick-reference checklist</h2><p className="mt-1 text-sm text-slate-400">Tap a label to jump back to its full section.</p></div></div><div className="mt-5 grid gap-2 sm:grid-cols-2">{quickItems.map(([id,label,section]) => <div key={id} className="flex min-h-12 items-center gap-2 rounded-xl border border-white/[.08] bg-black/20 px-3"><Checkbox id={`quick-${id}`} checked={!!guide.checked[id]} onCheckedChange={(v)=>setChecked(id,v===true)} className="size-6 shrink-0 rounded-md border-slate-500 data-[state=checked]:border-emerald-400 data-[state=checked]:bg-emerald-400 data-[state=checked]:text-[#071018]"/><button onClick={()=>jumpTo(section)} className={`min-h-11 flex-1 text-left text-sm ${guide.checked[id] ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{label}</button></div>)}</div><div className="mt-5 rounded-xl bg-black/20 p-4 text-sm leading-6 text-slate-300"><strong className="text-amber-300">Flow mantra:</strong> Place → Explain → Confirm → Release → Vary → Bridge.<br/>At every setup: wide, medium, tight · vertical, horizontal · camera-smile insurance · transition candid.</div></section>; }
