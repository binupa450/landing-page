import React,{useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';
import './premium.css';
import './motion.css';
import './signature.css';
import './team.css';
import Journey from './Journey';
import Member5_Rimaz_DashboardSimulation, {Dashboard} from './Member5_Rimaz_DashboardSimulation';
import {calculateOccupancy} from './member5Metrics';
import {getPreset, type PresetName} from './member5Presets';
const icons:Record<string,React.ReactNode>={
eye:<><path d="M2 12s3.4-7 10-7 10 7 10 7-3.4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,camera:<><rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3"/></>,chart:<><path d="M3 3v18h18M6 14l4-5 4 3 6-7"/></>,shield:<><path d="M12 2 3 6v6c0 5 4 8 9 10 5-2 9-5 9-10V6l-9-4Z"/><path d="m8 12 3 3 5-6"/></>,bell:<><path d="M18 8a6 6 0 0 0-12 0c0 6-3 6-3 8h18c0-2-3-2-3-8M10 20h4"/></>,clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,users:<><circle cx="9" cy="7" r="3"/><path d="M2 20v-3a7 7 0 0 1 14 0v3M17 4a3 3 0 0 1 0 6M19 13a5 5 0 0 1 3 5v2"/></>,arrow:<><path d="M4 12h16m-6-6 6 6-6 6"/></>,check:<path d="m4 12 5 5L20 6"/>,layers:<><path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/></>,server:<><rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h1M7 17.5h1"/></>,globe:<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18"/></>,menu:<path d="M4 6h16M4 12h16M4 18h16"/>,download:<><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/></>,activity:<path d="M2 12h5l3-8 4 16 3-8h5"/>,lock:<><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,code:<><path d="m7 7-5 5 5 5m10-10 5 5-5 5M14 4l-4 16"/></>,close:<path d="m5 5 14 14M19 5 5 19"/>
};
function Icon({name,size=20}:{name:string,size?:number}){return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]||icons.layers}</svg>}
function scrollToPageTop(){if(window.location.hash){window.history.replaceState(window.history.state,'',window.location.pathname+window.location.search)}window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
function Brand(){return <a className="brand" href="#top" aria-label="VISIO — back to top" onClick={e=>{e.preventDefault();scrollToPageTop()}}><span className="mark"><Icon name="eye" size={26}/></span><strong>VISIO<span>.</span></strong></a>}
const features=[['camera','Existing cameras. New intelligence.','Connect to an authorised, compatible CCTV recorder or IP camera stream. A local webcam provides a repeatable fallback.'],['users','See occupancy, not identities.','A pre-trained vision model estimates people within a monitoring zone, filters unreliable detections and stabilises counts.'],['bell','Alerts that explain themselves.','Sustained occupancy conditions generate proposed warning or critical incidents, with a clear reason and response workflow.'],['chart','Anticipate changing crowds.','A proposed short-term trend model explores early warning. Unreliable or insufficient observations suppress forecasts.'],['globe','A better visit starts before arrival.','A public interface shows aggregate crowd status, last update and typical quieter periods when enough history exists.'],['shield','Privacy is part of the architecture.','Protected staff video is separate from public metadata. The design excludes facial recognition and default recording.']];
type TeamMember = { number: string; name: string; role: string; description: string; portrait?: string; linkedin?: string };
const teamMembers: TeamMember[] = [
  {number:'01',name:'Binupa',role:'Project Manager',description:'Coordinates the project, plans tasks and resources, and keeps the team focused on delivering the project on time.',portrait:'/team/binupa.webp'},
  {number:'02',name:'Nethis',role:'Scrum Master',description:'Facilitates team collaboration, supports Scrum practices, and helps the team identify and resolve blockers.'},
  {number:'03',name:'Vithum Abeywickrama',role:'Front End Developer',description:'Develops the user interface and builds responsive, accessible, and user-friendly website experiences.',portrait:'/team/vithum.webp',linkedin:'https://www.linkedin.com/in/vithum-abeywickrama-0272623b4/'},
  {number:'04',name:'Sanula',role:'Technical Leader',description:'Guides technical decisions, oversees the system architecture, and helps maintain code quality across the project.'},
  {number:'05',name:'Rimaz Thaha',role:'Back End Developer & Camera Integration',description:'Develops server-side functionality, manages application logic and project data, and works on integrating authorised DVR/NVR and IP camera feeds into VISIO.',portrait:'/team/rimaz.webp',linkedin:'https://www.linkedin.com/in/mohamed-rimaz-0303b4296/'},
  {number:'06',name:'Ramika Punsara',role:'QA (Quality Assurance)',description:'Tests the application, identifies defects, and checks that features work as expected before release.',portrait:'/team/ramika.webp',linkedin:'https://www.linkedin.com/in/ramika-punsara-5284b0401/'}
];
function App(){const [menu,setMenu]=useState(false),[people,setPeople]=useState(38),[capacity,setCapacity]=useState(50),[trend,setTrend]=useState(3),[online,setOnline]=useState(true),[source,setSource]=useState('CCTV adapter'),[mode,setMode]=useState<'staff'|'public'>('staff'),[ack,setAck]=useState(false),[privacy,setPrivacy]=useState(false),[showToTop,setShowToTop]=useState(false);const {pct,projected:prediction}=calculateOccupancy(people,capacity,trend,online);
const applyPreset=(name:PresetName)=>{const {people,capacity,trend,online}=getPreset(name);setPeople(people);setCapacity(capacity);setTrend(trend);setOnline(online);setAck(false);setMode('staff')};
useEffect(()=>{setAck(false)},[people,capacity,online,trend,source]);useEffect(()=>{function key(e:KeyboardEvent){if(e.key==='Escape'){setPrivacy(false);setMenu(false)}}window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
useEffect(()=>{
  const root=document.documentElement;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const selectors='.section-head, .problem-grid article, .feature-grid .feature, .pipeline-node, .split-flow > div, .stack b, .simulation, .research-grid > div, .research-list > div, .team-grid article, .cta-inner > div';
  const targets=Array.from(document.querySelectorAll<HTMLElement>(selectors));
  let revealObserver:IntersectionObserver|undefined;
  if(!reduced.matches && 'IntersectionObserver' in window){
    targets.forEach((el)=>{
      el.dataset.visioReveal='true';
      const siblings=Array.from(el.parentElement?.children||[]);
      const order=siblings.indexOf(el);
      const delay=el.matches('.feature,.pipeline-node,.team-grid article,.problem-grid article,.stack b,.research-list > div') ? Math.min(Math.max(order,0),5)*75 : 0;
      el.style.setProperty('--reveal-delay',delay+'ms');
    });
    revealObserver=new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          revealObserver?.unobserve(entry.target);
        }
      });
    },{threshold:0.08,rootMargin:'0px 0px -24px 0px'});
    targets.forEach(el=>revealObserver?.observe(el));
    root.classList.add('visio-motion-ready');
  }
  const navLinks=Array.from(document.querySelectorAll<HTMLAnchorElement>('.navlinks a[href^="#"]'));
  const navTargets=navLinks.map(link=>document.getElementById(link.hash.slice(1)));
  let frame=0;
  const syncScroll=()=>{
    frame=0;
    const available=Math.max(1,root.scrollHeight-window.innerHeight);
    const offset=Math.max(0,window.scrollY);
    root.style.setProperty('--visio-scroll-progress',String(Math.min(1,offset/available)));
    root.classList.toggle('visio-scrolled',offset>32);
    setShowToTop(offset>560);
    if(!reduced.matches){
      root.style.setProperty('--visio-hero-shift',Math.min(155,offset*.16)+'px');
      root.style.setProperty('--visio-card-shift',Math.max(-55,-offset*.09)+'px');
    }
    let active=-1;
    navTargets.forEach((el,i)=>{if(el && el.getBoundingClientRect().top<window.innerHeight*.42){active=i}});
    navLinks.forEach((link,i)=>{const selected=i===active;link.classList.toggle('is-active',selected);if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
  };
  const onScroll=()=>{if(!frame)frame=requestAnimationFrame(syncScroll)};
  syncScroll();
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  return ()=>{
    revealObserver?.disconnect();
    window.removeEventListener('scroll',onScroll);
    window.removeEventListener('resize',onScroll);
    if(frame)cancelAnimationFrame(frame);
    root.classList.remove('visio-motion-ready','visio-scrolled');
    root.style.removeProperty('--visio-scroll-progress');
    root.style.removeProperty('--visio-hero-shift');
    root.style.removeProperty('--visio-card-shift');
  };
},[]);
return <><div className="visio-scroll-progress" aria-hidden="true"/><a className="skip" href="#main">Skip to content</a><header className="header" id="top"><div className="nav shell"><Brand/><nav className={menu?'navlinks open':'navlinks'} aria-label="Main navigation">{[['#solution','Solution'],['#technology','Technology'],['#journey','Experience'],['#demo','Interactive demo'],['#team','Team']].map(([h,t])=><a key={h} href={h} onClick={()=>setMenu(false)}>{t}</a>)}</nav><a className="btn small header-cta" href="#demo">Explore demo <Icon name="arrow" size={17}/></a><button className="menu-button" aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu} onClick={()=>setMenu(!menu)}><Icon name={menu?'close':'menu'}/></button></div></header><main id="main">
<section className="hero dark"><div className="hero-mesh"/><div className="shell hero-inner"><div className="hero-copy"><span className="eyebrow"><i/> INTELLIGENT OCCUPANCY · ACADEMIC PROJECT</span><h1>See the crowd.<br/><span>Anticipate<br className="desktop-break"/> the risk.</span></h1><p>Turn compatible, authorised live camera feeds into actionable occupancy information. Help staff respond earlier and visitors choose a better time to arrive.</p><div className="hero-actions"><a className="btn primary" href="#demo">Try the interactive demo <Icon name="arrow"/></a><a className="btn outline" href="#technology">How it works</a></div><div className="hero-note"><Icon name="shield" size={16}/> Privacy-conscious by design <span>•</span> Human decisions, AI assistance</div><a className="hero-scroll-cue" href="#solution"><span>SCROLL TO EXPLORE</span><span className="scroll-cue-icon"><Icon name="arrow" size={15}/></span></a></div><div className="hero-visual"><div className="hero-signal-field" aria-hidden="true"><span/><span/><span/></div><div className="visual-topline"><div className="float-label"><span className="pulse"/> <span>Concept monitoring dashboard</span></div><span className="visual-system-id">ZONE / 01 <i/> SIMULATED</span></div><Dashboard Icon={Icon}/><div className="visual-note">Product concept · Simulated data, not a live client deployment</div></div></div><div className="shell trust-strip"><span><Icon name="camera"/> DVR / NVR &amp; IP camera concept</span><span><Icon name="activity"/> AI-powered occupancy</span><span><Icon name="shield"/> Privacy-first design</span><span><Icon name="globe"/> Public information</span></div></section>
<section className="section light" id="solution"><div className="shell"><div className="section-head"><span className="eyebrow dark-label">01 / THE CHALLENGE</span><h2>More than watching<br/>a camera feed.</h2><p>Busy waiting areas can change quickly. Conventional footage alone does not tell staff how close a zone is to its configured capacity, and visitors may have little information before travelling.</p></div><div className="problem-grid"><article><span>01</span><Icon name="eye" size={31}/><h3>Manual monitoring</h3><p>Staff cannot continuously count every person in a monitored space.</p></article><article><span>02</span><Icon name="bell" size={31}/><h3>Delayed awareness</h3><p>Growing occupancy can go unnoticed until conditions become difficult to manage.</p></article><article><span>03</span><Icon name="clock" size={31}/><h3>Uncertain visits</h3><p>Customers need simple, trustworthy crowd information before leaving home.</p></article></div></div></section>
<section className="section feature-section"><div className="shell"><div className="section-head"><span className="eyebrow dark-label">02 / THE SOLUTION</span><h2>One system.<br/>Six capabilities.</h2><p>VISIO is designed to transform authorised camera input into useful information, without exposing private footage to the public.</p></div><div className="feature-grid">{features.map(([ic,h,p],i)=><article className="feature" key={h}><div className="feature-top"><span className="feature-icon"><Icon name={ic} size={27}/></span><span>0{i+1}</span></div><h3>{h}</h3><p>{p}</p></article>)}</div></div></section>
<section className="section dark technology" id="technology"><div className="shell"><div className="section-head"><span className="eyebrow"><i/> 03 / HOW IT WORKS</span><h2>From camera<br/>to clear decisions.</h2><p>Two possible inputs. One proposed processing pipeline. Private staff access and public aggregate information are deliberately separated.</p></div><div className="pipeline"><div className="source-stack"><div className="pipeline-node"><Icon name="camera" size={30}/><b>Authorised DVR / NVR</b><small>Compatible IP camera or recorder</small></div><div className="pipeline-node fallback"><Icon name="camera" size={23}/><b>Webcam fallback</b><small>Controlled university testing</small></div></div><div className="pipe-arrow"><Icon name="arrow" size={26}/></div><div className="pipeline-node"><Icon name="layers" size={30}/><b>Camera adapter</b><small>Frame decoding &amp; health</small></div><div className="pipe-arrow"><Icon name="arrow" size={26}/></div><div className="pipeline-node"><Icon name="eye" size={30}/><b>AI vision</b><small>YOLO · OpenCV · Python</small></div><div className="pipe-arrow"><Icon name="arrow" size={26}/></div><div className="pipeline-node"><Icon name="server" size={30}/><b>Intelligence layer</b><small>Spring Boot · MySQL</small></div></div><div className="split-flow"><div><Icon name="lock" size={25}/><strong>Staff control</strong><p>Protected video, real-time counts and incident workflow.</p></div><div><Icon name="globe" size={25}/><strong>Public information</strong><p>Aggregate status, freshness and approved historic patterns.</p></div></div><div className="stack"><span>Proposed technology stack</span>{['React','TypeScript','Spring Boot','Python','YOLO','OpenCV','MySQL','WebSocket'].map(t=><b key={t}>{t}</b>)}</div><p className="micro">Actual device support, network permissions, model licences and ethical approvals must be verified before an institutional pilot.</p></div></section>
<Journey count={people} capacity={capacity} trend={trend} online={online}/><Member5_Rimaz_DashboardSimulation
  people={people} capacity={capacity} trend={trend} online={online}
  source={source} mode={mode} ack={ack} pct={pct} prediction={prediction}
  setPeople={setPeople} setCapacity={setCapacity} setTrend={setTrend}
  setOnline={setOnline} setSource={setSource} setMode={setMode}
  setAck={setAck} applyPreset={applyPreset} Icon={Icon}
/>
<section className="section light" id="research"><div className="shell research-grid"><div><span className="eyebrow dark-label">05 / RESEARCH &amp; RESPONSIBILITY</span><h2>Built to be<br/>evaluated.</h2><p className="lead">VISIO is a proposed research-driven undergraduate software engineering project, not a certified crowd-safety product.</p></div><div className="research-list">{[['Detection accuracy','Compare estimated and manually labelled counts under approved test conditions.'],['Alert reliability','Compare fixed, sustained and trend-based warning methods.'],['System reliability','Measure latency, source loss, recovery and protected endpoint behaviour.'],['Ethical practice','Obtain approval, minimise personal data and keep operators responsible for decisions.']].map(([h,p])=><div key={h}><span className="check-icon"><Icon name="check"/></span><div><h3>{h}</h3><p>{p}</p></div></div>)}</div></div></section>
<section id="team" className="section team-section"><div className="shell">
  <div className="section-head"><span className="eyebrow dark-label">06 / THE TEAM</span><h2>Six minds.<br/>One mission.</h2><p>Meet the six-member undergraduate team behind VISIO — bringing together project leadership, engineering, Scrum and quality assurance.</p></div>
  <div className="team-grid">{teamMembers.map(member=><article className="team-member" key={member.number}>
    <div className="team-member-photo">{member.portrait?<img src={member.portrait} alt={member.name+' — '+member.role} width="280" height="280" loading="lazy" decoding="async" />:<div className="team-member-placeholder" aria-label="VISIO team member photo pending"><Icon name="users" size={38}/><span>VISIO</span></div>}</div>
    <span className="team-member-number">TEAM MEMBER / {member.number}</span>
    <h3>{member.name}</h3><strong className="team-member-role">{member.role}</strong>
    <p>{member.description}</p>
    <div className="team-member-footer">{member.linkedin?<a className="team-member-social" href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={'View '+member.name+' on LinkedIn'} title={'View '+member.name+' on LinkedIn'}><svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 2H3.55C2.7 2 2 2.68 2 3.52v16.96C2 21.32 2.7 22 3.55 22h16.9c.86 0 1.55-.68 1.55-1.52V3.52C22 2.68 21.31 2 20.45 2ZM7.93 18.75H4.97V9.2h2.96v9.55ZM6.45 7.89a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44ZM18.75 18.75h-2.96V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.49V9.2h2.84v1.3h.04c.4-.75 1.36-1.55 2.8-1.55 2.99 0 3.58 1.97 3.58 4.54v5.26Z"/></svg><span>LinkedIn profile</span><Icon name="arrow" size={15}/></a>:<span className="team-member-no-link">VISIO CORE TEAM</span>}</div>
  </article>)}</div>
  <div className="academic"><Icon name="code" size={20}/><span>Agile Team Project · IIT / University of Westminster · 2026/27</span></div>
</div></section>
<section className="cta dark"><div className="shell cta-inner"><div><span className="eyebrow"><i/> EXPLORE THE PROJECT</span><h2>Better awareness.<br/><span>Better decisions.</span></h2><p>Experience the interactive concept and discover how VISIO is designed to work.</p></div><div className="cta-actions"><a className="btn primary" href="#demo">Explore the demo <Icon name="arrow"/></a></div></div></section>
</main><footer><div className="shell footer-grid"><div><Brand/><p>Smart Crowd Monitoring and Public Occupancy Information System</p><small>Student project marketing site. No live client deployment is claimed.</small></div><div><b>Explore</b><a href="#solution">Solution</a><a href="#technology">Technology</a><a href="#journey">Experience</a><a href="#demo">Try the demo</a></div><div><b>Project</b><a href="#team">Team &amp; workstreams</a><button className="footer-link" onClick={()=>setPrivacy(true)}>Privacy notice</button><small>Project email and social links pending team confirmation.</small></div></div><div className="shell footer-bottom"><span>© 2026 VISIO · Academic project</span><span>Concept only · Simulated demonstration</span></div></footer>{showToTop&&<button className="back-to-top" type="button" aria-label="Return to top of page" title="Back to top" onClick={scrollToPageTop}><Icon name="arrow" size={21}/><span>TOP</span></button>}{privacy&&<div className="modal-backdrop" onClick={()=>setPrivacy(false)}><section role="dialog" aria-modal="true" aria-label="Privacy notice" className="privacy-dialog" onClick={e=>e.stopPropagation()}><button className="dialog-close" autoFocus aria-label="Close privacy notice" onClick={()=>setPrivacy(false)}><Icon name="close"/></button><h2>Privacy notice</h2><p>This marketing page does not access your camera, collect form submissions or use advertising trackers. The interactive demonstration runs locally in your browser and uses simulated data. Normal hosting infrastructure may retain standard request logs for operation and security.</p><p>The proposed product processes only authorised camera inputs and exposes aggregate public information, not identifiable footage. Any future institutional deployment requires separate approval, privacy assessment and access controls.</p><button className="btn primary" onClick={()=>setPrivacy(false)}>Close</button></section></div>}</>}
createRoot(document.getElementById('root')!).render(<App/>);
