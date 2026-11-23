import {useState} from 'react';
import './journey.css';

type JourneyProps={count:number;capacity:number;trend:number;online:boolean};
type Stage={eyebrow:string;title:string;heading:string;description:string;detail:string};
const stages:Stage[]=[
  {eyebrow:'INPUT / 01',title:'Capture',heading:'Start with authorised vision.',description:'Connect a compatible recorder, IP camera or local testing webcam through a controlled source adapter.',detail:'Camera access, consent and hardware compatibility must be verified before any real pilot.'},
  {eyebrow:'PERCEPTION / 02',title:'Estimate',heading:'Understand the space, not the people.',description:'The proposed vision layer estimates occupancy from frames while suppressing unreliable observations.',detail:'No facial recognition, visitor identity tracking or default footage retention is part of the proposed scope.'},
  {eyebrow:'INTELLIGENCE / 03',title:'Interpret',heading:'Translate counts into context.',description:'Illustrative occupancy thresholds and trend checks suggest conditions for a staff member to review.',detail:'The demonstration uses provisional 70% and 90% thresholds, not certified crowd-safety limits.'},
  {eyebrow:'EXPERIENCE / 04',title:'Inform',heading:'Share clarity. Protect privacy.',description:'A proposed public interface shows a simple aggregate crowd condition and the freshness of the information.',detail:'Raw video stays outside the public experience; estimated conditions do not guarantee waiting times or safety.'}
];

function MiniIcon({index}:{index:number}) {
  const glyphs=[
    <><rect x="3" y="6" width="12" height="12" rx="2"/><path d="m15 10 6-4v12l-6-4"/></>,
    <><path d="M3 12s3.2-6 9-6 9 6 9 6-3.2 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="3"/></>,
    <><path d="M3 3v18h18"/><path d="m6 14 4-5 4 3 6-7"/></>,
    <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18"/></>
  ];
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{glyphs[index]}</svg>;
}

export default function Journey({count,capacity,trend,online}:JourneyProps){
  const [active,setActive]=useState(0);
  const safeCapacity = Math.max(1, capacity);

  const pct = Math.min(100, Math.round(count / safeCapacity * 100));

  const forecast = Math.min(
      100,
      Math.round(Math.max(0, count + trend * 3) / safeCapacity * 100)
  );
  const condition=!online?'Unavailable':pct>=90?'Very busy':pct>=70?'Busy':'Normal';
  const risk=!online?'Data unavailable':pct>=90?'Critical condition':pct>=70?'Warning condition':forecast>=90?'Projected risk':'Normal condition';
  const outputs=[
    online?'Illustrative source connected':'Source unavailable',
    online?count+' people (estimated)':'Estimate unavailable',
    risk,
    condition+' · aggregate status'
  ];
  const privacy=['Staff-only source','No identities','Staff decision required','Public metadata only'];
  const activeStage=stages[active];
  return <section className="journey-section" id="journey" aria-labelledby="journey-title">
    <div className="journey-ambient" aria-hidden="true"/>
    <div className="shell">
      <div className="section-head journey-heading">
        <span className="eyebrow"><i/> INTERACTIVE SYSTEM STORY</span>
        <h2 id="journey-title">From a signal<br/>to a clearer decision.</h2>
        <p>Explore the four proposed stages behind VISIO. Each step explains what the system could do, what it would show and what remains protected.</p>
      </div>
      <div className="journey-layout">
        <div className="journey-console">
          <div className="journey-console-top"><span className="journey-console-led"><i/> CONCEPT LAB / VISIO</span><span>0{active+1} <em>/ 04</em></span></div>
          <div className={'journey-stage-visual journey-visual-'+active}>
            <div className="journey-visual-grid" aria-hidden="true"/>
            <svg className="journey-signal-svg" viewBox="0 0 560 270" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
              <circle cx="280" cy="136" r="105" className="journey-orbit journey-orbit-outer"/>
              <circle cx="280" cy="136" r="70" className="journey-orbit"/>
              <circle cx="280" cy="136" r="36" className="journey-orbit"/>
              <path d="M280 11v250M155 136h250" className="journey-axis"/>
              <path d="M280 136l105-70" className="journey-scan-beam"/>
              {[[209,88],[249,112],[309,83],[350,148],[285,201],[216,176],[330,194],[260,60]].map(([x,y],i)=><g key={i} className={'journey-target journey-target-'+i}><circle cx={x} cy={y} r={i%3===0?6:4}/><circle cx={x} cy={y} r={i%3===0?15:11} className="journey-target-halo"/></g>)}
            </svg>
            <div className="journey-visual-main">
              <span className="journey-visual-icon"><MiniIcon index={active}/></span>
              <span className="journey-visual-number">0{active+1}</span>
              <span className="journey-visual-label">{activeStage.eyebrow}</span>
            </div>
            <span className="journey-corner journey-corner-tl"/><span className="journey-corner journey-corner-tr"/><span className="journey-corner journey-corner-bl"/><span className="journey-corner journey-corner-br"/>
            <span className="journey-visual-badge"><span/> CONCEPT VISUALISATION</span>
          </div>
          <div className="journey-console-content" aria-live="polite" aria-atomic="true">
            <span className="journey-stage-label">{activeStage.eyebrow}</span>
            <h3>{activeStage.heading}</h3>
            <p>{activeStage.description}</p>
          </div>
          <div className="journey-console-metrics">
            <div><span>EXAMPLE OUTPUT</span><strong>{outputs[active]}</strong></div>
            <div><span>INFORMATION BOUNDARY</span><strong>{privacy[active]}</strong></div>
          </div>
          <div className="journey-progress" aria-label={'Stage '+(active+1)+' of 4'}>
            {stages.map((stage,i)=><button key={stage.title} className={i===active?'is-active':''} type="button" aria-label={'Show stage '+(i+1)+': '+stage.title} aria-pressed={i===active} onClick={()=>setActive(i)}/>)}
          </div>
        </div>
        <div className="journey-controls">
          <div className="journey-controls-heading"><span>THE INFORMATION JOURNEY</span><span>SELECT A STAGE</span></div>
          <div className="journey-steps" role="group" aria-label="System journey stages">
            {stages.map((stage,i)=><button type="button" key={stage.eyebrow} className={'journey-step '+(active===i?'is-active':'')} aria-pressed={active===i} onClick={()=>setActive(i)}>
              <span className="journey-step-number">0{i+1}</span>
              <span className="journey-step-content"><span className="journey-step-kicker">{stage.eyebrow}</span><strong>{stage.title}</strong><span className="journey-step-subtitle">{stage.description}</span></span>
              <span className="journey-step-arrow" aria-hidden="true">↗</span>
            </button>)}
          </div>
          <div className="journey-understanding"><span className="journey-understanding-symbol" aria-hidden="true">✳</span><p>{activeStage.detail}</p></div>
          <a className="journey-try-link" href="#demo">Explore this with the simulator <span aria-hidden="true">↗</span></a>
          <p className="journey-footnote">Illustrative process · Linked to the scenario controls below · No camera connection or real-time inference</p>
        </div>
        <div className="journey-navigation">
          <button
              type="button"
              onClick={() => setActive((prev) => Math.max(0, prev - 1))}
              disabled={active === 0}
          >
            ← Previous
          </button>

          <span>
    Stage {active + 1} of {stages.length}
  </span>

          <button
              type="button"
              onClick={() =>
                  setActive((prev) => Math.min(stages.length - 1, prev + 1))
              }
              disabled={active === stages.length - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  </section>;
}
