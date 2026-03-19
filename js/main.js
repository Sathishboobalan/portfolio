/* Sathish Boobalan Portfolio — Main JS */

// ════ PAGE LOADER — ANIMATED PERCENTAGE ════
(function(){
  var bar=document.getElementById('loaderBar');
  var pctEl=document.getElementById('loaderPct');
  var pctVal=0, targetVal=0, rafId;

  function tick(){
    if(pctVal < targetVal){
      pctVal = Math.min(pctVal + 1, targetVal);
      if(bar) bar.style.width = pctVal + '%';
      if(pctEl) pctEl.textContent = pctVal + '%';
    }
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  // Staged progress milestones
  [[28,180],[52,380],[70,650],[85,950],[93,1250]].forEach(function(s){
    setTimeout(function(){ targetVal = s[0]; }, s[1]);
  });

  function finish(){
    targetVal = 100;
    setTimeout(function(){
      cancelAnimationFrame(rafId);
      var loader=document.getElementById('page-loader');
      if(loader) loader.classList.add('hidden');
      if(typeof AOS!=='undefined'){
        AOS.init({once:true,duration:700,easing:'ease-out-cubic',offset:60});
      }
      animateSkillBarsInView();
    }, 520);
  }

  if(document.readyState==='complete'){ setTimeout(finish,80); }
  else { window.addEventListener('load',finish); setTimeout(finish,3500); }
})();

// ════ NAVIGATION ════
function navTo(id){
  var el=document.getElementById(id);
  if(!el)return;
  var top=el.getBoundingClientRect().top+window.pageYOffset-76;
  window.scrollTo({top:top,behavior:'smooth'});
}
function closeMobile(){document.getElementById('mobileMenu').classList.remove('open');document.getElementById('hamburger').classList.remove('open');}
function toggleMobile(){document.getElementById('mobileMenu').classList.toggle('open');document.getElementById('hamburger').classList.toggle('open');}
var NAV_SECTIONS=['home','about','skills','experience','projects','testimonials','resume','contact'];
window.addEventListener('scroll',function(){
  document.getElementById('navbar').classList.toggle('scrolled',window.pageYOffset>40);
  var y=window.pageYOffset+120,active=NAV_SECTIONS[0];
  NAV_SECTIONS.forEach(function(id){var el=document.getElementById(id);if(el&&el.offsetTop<=y)active=id;});
  document.querySelectorAll('[data-section]').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-section')===active);});
},{passive:true});

// ════ THEME ════
var isDark=localStorage.getItem('theme')==='dark'||(!localStorage.getItem('theme')&&window.matchMedia('(prefers-color-scheme:dark)').matches);
function applyTheme(){
  document.documentElement.setAttribute('data-theme',isDark?'dark':'light');
  document.getElementById('themeBtn').innerHTML=isDark?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>';
  localStorage.setItem('theme',isDark?'dark':'light');
}
function toggleTheme(){isDark=!isDark;applyTheme();}
applyTheme();

// ════ COLOR PICKER ════
var presetColors=[
  {hex:'#C84B31',label:'Ember Red'},
  {hex:'#2563EB',label:'Royal Blue'},
  {hex:'#059669',label:'Emerald'},
  {hex:'#7C3AED',label:'Violet'},
  {hex:'#DB2777',label:'Rose'},
  {hex:'#D97706',label:'Amber'},
  {hex:'#0891B2',label:'Cyan'},
  {hex:'#16A34A',label:'Green'},
  {hex:'#DC2626',label:'Red'},
  {hex:'#4F46E5',label:'Indigo'},
  {hex:'#0F172A',label:'Slate'},
  {hex:'#EA580C',label:'Orange'},
];
function hexToRgb(h){var r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return r+','+g+','+b;}
function lighten(h,p){var r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);r=Math.min(255,Math.round(r+(255-r)*p));g=Math.min(255,Math.round(g+(255-g)*p));b=Math.min(255,Math.round(b+(255-b)*p));return'#'+r.toString(16).padStart(2,'0')+g.toString(16).padStart(2,'0')+b.toString(16).padStart(2,'0');}
function darken(h,p){var r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);r=Math.max(0,Math.round(r*(1-p)));g=Math.max(0,Math.round(g*(1-p)));b=Math.max(0,Math.round(b*(1-p)));return'#'+r.toString(16).padStart(2,'0')+g.toString(16).padStart(2,'0')+b.toString(16).padStart(2,'0');}
function applyAccent(hex){
  var root=document.documentElement;
  root.style.setProperty('--accent',hex);
  root.style.setProperty('--accent-light',lighten(hex,.18));
  root.style.setProperty('--accent-dark',darken(hex,.18));
  root.style.setProperty('--accent-rgb',hexToRgb(hex));
  root.style.setProperty('--accent-bg','rgba('+hexToRgb(hex)+',.08)');
  document.querySelector('.color-panel-btn').style.background=hex;
  document.querySelectorAll('.cp-swatch').forEach(function(s){s.classList.toggle('active',s.dataset.hex===hex);});
  localStorage.setItem('accentColor',hex);
}
function toggleColorPanel(){document.getElementById('colorPopup').classList.toggle('open');}
document.addEventListener('click',function(e){var panel=document.querySelector('.color-panel');if(!panel.contains(e.target))document.getElementById('colorPopup').classList.remove('open');});

// Build swatches
var presetsEl=document.getElementById('cpPresets');
presetColors.forEach(function(c){
  var s=document.createElement('div');s.className='cp-swatch';s.style.background=c.hex;s.dataset.hex=c.hex;s.title=c.label;
  s.onclick=function(){applyAccent(c.hex);document.getElementById('colorPickerInput').value=c.hex;};
  presetsEl.appendChild(s);
});
var saved=localStorage.getItem('accentColor');
if(saved){applyAccent(saved);document.getElementById('colorPickerInput').value=saved;}

// Photo is static — no upload needed

// ════ TYPEWRITER ════
var roles=['Full Stack Developer','Java Spring Boot Engineer','Backend Specialist','Angular Developer'];
var rIdx=0,cIdx=0,deleting=false;
function type(){
  var cur=roles[rIdx];
  document.getElementById('typed').textContent=deleting?cur.substring(0,cIdx--):cur.substring(0,cIdx++);
  var delay=deleting?60:100;
  if(!deleting&&cIdx===cur.length+1){delay=2200;deleting=true;}
  else if(deleting&&cIdx===0){deleting=false;rIdx=(rIdx+1)%roles.length;delay=400;}
  setTimeout(type,delay);
}
type();

// ════ MARQUEE ════
var techStack=[
  {name:'Java',icon:'fab fa-java',color:'#f89820'},
  {name:'Spring Boot',icon:'fas fa-leaf',color:'#6DB33F'},
  {name:'Angular',icon:'fab fa-angular',color:'#DD0031'},
  {name:'JavaScript',icon:'fab fa-js',color:'#F7DF1E'},
  {name:'SQL',icon:'fas fa-database',color:'#336791'},
  {name:'IntelliJ',icon:'fas fa-code',color:'#6B57FF'},
  {name:'Git',icon:'fab fa-git-alt',color:'#F05032'},
  {name:'Bootstrap',icon:'fab fa-bootstrap',color:'#7952B3'},
  {name:'REST API',icon:'fas fa-plug',color:'#0EA5E9'},
  {name:'Microservices',icon:'fas fa-cubes',color:'#8B5CF6'},
  {name:'Eclipse',icon:'fas fa-circle-dot',color:'#2C2255'},
];
var track=document.getElementById('marqueeTrack');
techStack.concat(techStack).forEach(function(t){var el=document.createElement('div');el.className='tech-chip';el.innerHTML='<i class="'+t.icon+'" style="color:'+t.color+'"></i><span>'+t.name+'</span>';track.appendChild(el);});

// ════ SKILLS ════
var skills=[
  // Backend
  {name:'Core Java',level:90,category:'Backend'},
  {name:'Spring Boot',level:88,category:'Backend'},
  {name:'REST APIs',level:90,category:'Backend'},
  {name:'Microservice Architecture',level:78,category:'Backend'},
  {name:'OOP Principles',level:88,category:'Backend'},
  {name:'SOLID Principles',level:86,category:'Backend'},
  {name:'Stream API',level:82,category:'Backend'},
  // Frontend
  {name:'JavaScript',level:80,category:'Frontend'},
  {name:'Angular',level:65,category:'Frontend'},
  {name:'Bootstrap',level:82,category:'Frontend'},
  // Database
  {name:'SQL',level:88,category:'Database'},
  {name:'Database Design',level:82,category:'Database'},
  {name:'Neo4J',level:72,category:'Database'},
  // Tools & Practices
  {name:'IntelliJ IDEA',level:90,category:'Tools'},
  {name:'Eclipse IDE',level:82,category:'Tools'},
  {name:'Visual Studio Code',level:85,category:'Tools'},
  {name:'Git',level:88,category:'Tools'},
  {name:'GitHub Desktop',level:85,category:'Tools'},
  {name:'Agile Methodologies',level:85,category:'Tools'},
  // Soft Skills
  {name:'Analytical Problem Solving',level:88,category:'Soft Skills'},
  {name:'Troubleshooting',level:86,category:'Soft Skills'},
  {name:'Team Collaboration',level:90,category:'Soft Skills'},
];
var activeCat='Backend',cats=[];
skills.forEach(function(s){if(cats.indexOf(s.category)===-1)cats.push(s.category);});
var tabsEl=document.getElementById('categoryTabs');
cats.forEach(function(cat){
  var btn=document.createElement('button');btn.className='cat-tab'+(cat===activeCat?' active':'');btn.textContent=cat;
  btn.onclick=function(){activeCat=cat;renderSkills();document.querySelectorAll('.cat-tab').forEach(function(b){b.classList.toggle('active',b.textContent===cat);});};
  tabsEl.appendChild(btn);
});
function getLvl(n){return n>=90?'Expert':n>=80?'Advanced':n>=70?'Proficient':'Intermediate';}
function renderSkills(){
  var grid=document.getElementById('skillsGrid');grid.innerHTML='';
  skills.filter(function(s){return s.category===activeCat;}).forEach(function(s){
    var d=document.createElement('div');d.className='skill-card';
    d.innerHTML='<div class="skill-header"><span class="skill-name">'+s.name+'</span><div class="skill-meta"><span class="skill-pct">'+s.level+'%</span><span class="skill-level-label">'+getLvl(s.level)+'</span></div></div><div class="skill-bar-track"><div class="skill-bar-fill" style="width:'+s.level+'%"></div></div>';
    grid.appendChild(d);
  });
}
renderSkills();

// ════ EXPERIENCE ════
var experiences=[
  {company:'UST HealthProof',role:'Technical Analyst — Full Stack Developer',period:'Apr 2024 – Present',duration:'1+ yr',location:'Chennai, India',current:true,
    description:'Working on Workflow+ — an enterprise claim adjudication platform that syncs claim data from Health Rules Payer (HRP). The system supports 7 role types including Examiner, Auditor, Manager, Lead, MQO, Ops Governor and Admin, each with tailored dashboards and reports.',
    achievements:[
      'Developed Examiner module: claim processing, rebuttal submission and review flows',
      'Built Auditor module: claim audit, fail/pass decisions, rebuttal accept/reject workflows',
      'Implemented MQO auditing side workflows and Ops Governor governance dashboards',
      'Wrote SQL Stored Procedures for HRP data sync and workflow state management',
      'Delivered role-specific reports and dashboards for Manager, Lead, Auditor and Ops Governor'
    ],
    tech:['Java','Spring Boot','SQL Stored Procs','Angular','REST API','IntelliJ IDEA']},
  {company:'Stradegi Solutions',role:'Technical Analyst',period:'Oct 2020 – Mar 2024',duration:'3.5 yrs',location:'Chennai, India',current:false,
    description:'Developed nFlows — a flexible no-code business automation platform for dynamic entity, workflow, rule and dashboard construction. Also contributed to Pro Hunt, an internal interview management system.',
    achievements:[
      'Led migration from core Java to Spring Boot; built foundational architecture and data helpers',
      'Designed Rule Hierarchy and Common Landing Page modules with graph-view data rendering',
      'Achieved 20% improvement in system scalability handling increased production loads',
      'Implemented 30% boost in application speed and responsiveness through targeted optimisations',
      'Reduced system errors by 25%, resulting in a more stable user-facing application',
      'Executed end-to-end data migration for modules with thorough business validations',
      'Developed Pro Hunt: question bank, test scoring by weightage, notification emails'
    ],
    tech:['Java','Spring Boot','JavaScript','Angular','Bootstrap','SQL','OOP/SOLID','IntelliJ IDEA']}
];
var activeExp=0;
function renderExp(){
  var sb=document.getElementById('expSidebar');sb.innerHTML='';
  experiences.forEach(function(e,i){
    var d=document.createElement('div');d.className='exp-tab'+(i===activeExp?' active':'');
    d.innerHTML='<div class="exp-tab-inner"><span class="exp-company">'+e.company+'</span><span class="exp-period">'+e.period+'</span></div>'+(e.current?'<span class="current-badge">Current</span>':'');
    d.onclick=function(){activeExp=i;renderExp();};sb.appendChild(d);
  });
  var e=experiences[activeExp];
  document.getElementById('expDetail').innerHTML=
    '<div class="exp-detail"><div class="exp-detail-header"><div>'
    +'<h3 class="exp-role">'+e.role+'</h3>'
    +'<div class="exp-meta-row"><span><i class="fas fa-building"></i> '+e.company+'</span><span><i class="fas fa-map-marker-alt"></i> '+e.location+'</span><span><i class="fas fa-clock"></i> '+e.duration+'</span></div>'
    +'</div>'+(e.current?'<span class="current-badge big">Current Role</span>':'')+'</div>'
    +'<p class="exp-description">'+e.description+'</p>'
    +'<div class="exp-achievements"><h4 class="ach-title"><i class="fas fa-trophy"></i> Key Achievements</h4><ul>'
    +e.achievements.map(function(a){return'<li><i class="fas fa-arrow-right"></i><span>'+a+'</span></li>';}).join('')+'</ul></div>'
    +'<div class="exp-tech"><h4 class="ach-title"><i class="fas fa-layer-group"></i> Technologies Used</h4>'
    +'<div class="tech-tags">'+e.tech.map(function(t){return'<span class="tag">'+t+'</span>';}).join('')+'</div></div></div>';
}
renderExp();

// ════ PROJECTS ════
var projects=[
  {name:'Workflow+ — Claim Adjudication',desc:'Enterprise healthcare claim adjudication platform supporting 7 role types (Examiner, Auditor, Manager, Lead, MQO, Ops Governor, Admin) with full claim lifecycle management, audit trails, and rebuttal workflows.',tech:['Java','Spring Boot','SQL Stored Procs','Angular','REST API'],highlight:true,category:'Healthcare'},
  {name:'nFlows — Business Automation',desc:'No-code platform for dynamic construction of entities, workflows, rules and dashboards. Highly configurable for any business domain with cross-module integration and data migration capabilities.',tech:['Java','Spring Boot','JavaScript','Angular','Bootstrap','SQL'],highlight:true,category:'Enterprise'},
  {name:'Pro Hunt — Interview Platform',desc:'Internal interview management system for scheduling, question bank management, candidate evaluation and automated result notification emails based on question weightage.',tech:['Spring Boot','Angular','SQL','REST API'],highlight:false,category:'Internal Tool'},
  {name:'Rule Hierarchy Module',desc:'Graph-view rule management module with hierarchical rule display, dependency tracking, and dynamic rule evaluation for the nFlows automation platform.',tech:['Java','Spring Boot','JavaScript','SQL'],highlight:false,category:'Module'},
  {name:'Role Manager & User Preference',desc:'Configurable role management and user preference system supporting fine-grained access control across the nFlows platform with dynamic permission inheritance.',tech:['Spring Boot','Angular','SQL','OOP'],highlight:false,category:'Module'},
];
var activeFilter='All',allCats=['All'];
projects.forEach(function(p){if(allCats.indexOf(p.category)===-1)allCats.push(p.category);});
var fb=document.getElementById('filterBar');
allCats.forEach(function(cat){
  var btn=document.createElement('button');btn.className='filter-btn'+(cat===activeFilter?' active':'');btn.textContent=cat;
  btn.onclick=function(){activeFilter=cat;renderProjects();document.querySelectorAll('.filter-btn').forEach(function(b){b.classList.toggle('active',b.textContent===cat);});};
  fb.appendChild(btn);
});
function renderProjects(){
  var grid=document.getElementById('projectsGrid'),list=activeFilter==='All'?projects:projects.filter(function(p){return p.category===activeFilter;});
  grid.innerHTML=list.map(function(p){
    return'<div class="project-card'+(p.highlight?' highlight':'')+'"><div class="project-top"><div class="project-icon"><i class="fas fa-code-branch"></i></div></div>'
    +'<div class="project-body"><div class="project-meta"><span class="project-cat">'+p.category+'</span>'+(p.highlight?'<span class="highlight-badge"><i class="fas fa-star"></i> Featured</span>':'')+'</div>'
    +'<h3 class="project-name">'+p.name+'</h3><p class="project-desc">'+p.desc+'</p></div>'
    +'<div class="project-tech">'+p.tech.map(function(t){return'<span class="tag">'+t+'</span>';}).join('')+'</div></div>';
  }).join('');
}
renderProjects();

// ════ CONTACT FORM ════
function submitForm(e){
  e.preventDefault();var btn=document.getElementById('submitBtn');
  btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending...';btn.disabled=true;
  setTimeout(function(){
    document.getElementById('contactForm').style.display='none';
    document.getElementById('successMsg').style.display='flex';
    setTimeout(function(){
      document.getElementById('successMsg').style.display='none';
      document.getElementById('contactForm').style.display='flex';
      document.getElementById('contactForm').reset();
      btn.innerHTML='<i class="fas fa-paper-plane"></i> Send Message';btn.disabled=false;
    },4000);
  },1500);
}

// ════ PDF DOWNLOAD ════
function downloadResume(){
  var btn=document.getElementById('downloadBtn');
  btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Preparing...';btn.disabled=true;
  var accentColor=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#C84B31';
  var w=window.open('','_blank','width=960,height=1200');
  if(!w){btn.innerHTML='<i class="fas fa-download"></i> Download PDF';btn.disabled=false;return;}
  w.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Sathish Boobalan \u2013 Resume</title>'
  +'<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">'
  +'<style>'
  +'*{box-sizing:border-box;margin:0;padding:0}'
  +'body{font-family:\'DM Sans\',sans-serif;font-size:10pt;line-height:1.5;color:#1A1814;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}'
  +'@page{size:A4;margin:11mm 13mm}'
  +'.wrap{max-width:794px;margin:0 auto}'
  +'.hdr{padding-bottom:13px;border-bottom:2.5px solid '+accentColor+';margin-bottom:16px;display:flex;justify-content:space-between;align-items:flex-start}'
  +'.name{font-family:\'Syne\',sans-serif;font-size:22pt;font-weight:800;color:#1A1814;letter-spacing:-.03em;line-height:1.1}'
  +'.ttl{font-family:\'Syne\',sans-serif;font-size:10pt;font-weight:600;color:'+accentColor+';margin-top:3px}'
  +'.ct{text-align:right;font-size:8.5pt;color:#5C5751;line-height:1.9}'
  +'.body{display:grid;grid-template-columns:1fr 192px;gap:20px}'
  +'.sec{margin-bottom:13px}'
  +'.stitle{font-family:\'Syne\',sans-serif;font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:'+accentColor+';border-bottom:1px solid #EDE8DF;padding-bottom:3px;margin-bottom:8px}'
  +'.sum{font-size:8.5pt;color:#5C5751;line-height:1.65}'
  +'.exp{margin-bottom:11px}'
  +'.exph{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:4px}'
  +'.expr{font-family:\'Syne\',sans-serif;font-size:9.5pt;font-weight:700;color:#1A1814}'
  +'.expd{font-size:7.5pt;color:#9E9A94;background:#F5F5F5;padding:1px 6px;border-radius:3px;white-space:nowrap}'
  +'.expc{font-size:8.5pt;color:'+accentColor+';font-weight:600;margin:3px 0 5px;display:flex;align-items:center;gap:6px}'
  +'.badge{background:#FFF0ED;color:'+accentColor+';font-size:6.5pt;font-weight:700;padding:1px 5px;border-radius:8px}'
  +'.proj-desc{font-size:8pt;color:#5C5751;line-height:1.6;margin-bottom:4px}'
  +'.bul{padding-left:12px;margin-bottom:5px}.bul li{font-size:8.5pt;color:#5C5751;margin-bottom:2px;line-height:1.5}'
  +'.tags{display:flex;flex-wrap:wrap;gap:3px;margin-top:4px}'
  +'.tag{padding:2px 7px;background:#FFF0ED;color:'+accentColor+';border-radius:3px;font-size:7pt;font-weight:600}'
  +'.sk{margin-bottom:5px}.skr{display:flex;justify-content:space-between;font-size:7.5pt;color:#1A1814;font-weight:500;margin-bottom:2px}'
  +'.btr{height:3.5px;background:#EDE8DF;border-radius:2px;overflow:hidden}'
  +'.btf{height:100%;background:linear-gradient(90deg,'+accentColor+'cc,'+accentColor+');border-radius:2px}'
  +'.si{margin-bottom:6px;display:flex;align-items:flex-start;gap:5px}'
  +'.si-icon{font-size:7.5pt;color:'+accentColor+';flex-shrink:0;margin-top:1px}'
  +'.sin{font-size:8pt;font-weight:600;color:#1A1814}.sii{font-size:7pt;color:#9E9A94;margin-top:1px}'
  +'.edu{font-weight:700;font-size:8.5pt;color:#1A1814}.edui{font-size:8pt;color:#5C5751}.edum{font-size:7.5pt;color:#9E9A94}'
  +'</style></head><body><div class="wrap">'
  // Header - no award box
  +'<div class="hdr"><div>'
  +'<div class="name">Sathish Boobalan</div>'
  +'<div class="ttl">Full Stack Developer</div>'
  +'</div><div class="ct">'
  +'<div>+91 88258 71070</div><div>sathishbalucs@gmail.com</div>'
  +'<div>linkedin.com/in/sathishboobalan</div><div>Chennai, Tamil Nadu, India</div>'
  +'</div></div>'
  +'<div class="body"><div>'
  // Summary - updated
  +'<div class="sec"><div class="stitle">Professional Summary</div>'
  +'<p class="sum">Experienced Full Stack Software Developer with 5+ years, specializing in Java, Spring Boot, JavaScript, and Angular. Proven track record in designing, developing, and deploying robust web applications. Adept collaborator across the development lifecycle, excelling in crafting intuitive front-end interfaces and efficient server-side applications. Ready to contribute seasoned skills to dynamic software projects.</p></div>'
  // Experience
  +'<div class="sec"><div class="stitle">Work Experience</div>'
  +'<div class="exp">'
  +'<div class="exph"><div class="expr">Technical Analyst \u2014 Full Stack Developer</div><div class="expd">Apr 2024 \u2013 Present</div></div>'
  +'<div class="expc">UST HealthProof \u2022 Chennai <span class="badge">Current</span></div>'
  +'<p class="proj-desc"><strong>Workflow+</strong> \u2014 Claim adjudication platform syncing from HRP, supporting Examiner, Auditor, Manager, Lead, MQO, Ops Governor and Admin roles.</p>'
  +'<ul class="bul">'
  +'<li>Developed Examiner module: claim processing, rebuttal submission and review flows</li>'
  +'<li>Built Auditor module: claim audit, fail/pass decisions, rebuttal accept/reject workflows</li>'
  +'<li>Implemented MQO auditing workflows and Ops Governor governance dashboards</li>'
  +'<li>Wrote SQL Stored Procedures for HRP data sync and workflow state management</li>'
  +'<li>Delivered role-specific reports and dashboards for all 7 user roles</li>'
  +'</ul>'
  +'<div class="tags"><span class="tag">Java</span><span class="tag">Spring Boot</span><span class="tag">SQL Stored Procs</span><span class="tag">Angular</span><span class="tag">REST API</span><span class="tag">IntelliJ IDEA</span></div></div>'
  +'<div class="exp">'
  +'<div class="exph"><div class="expr">Technical Analyst</div><div class="expd">Oct 2020 \u2013 Mar 2024</div></div>'
  +'<div class="expc">Stradegi Solutions \u2022 Chennai</div>'
  +'<p class="proj-desc"><strong>nFlows</strong> \u2014 No-code business automation platform. <strong>Pro Hunt</strong> \u2014 Internal interview management system.</p>'
  +'<ul class="bul">'
  +'<li>Led migration from core Java to Spring Boot; built foundational architecture and helper utilities</li>'
  +'<li>Designed Rule Hierarchy and Landing Page modules with graph-view rendering</li>'
  +'<li>Achieved 20% scalability improvement and 30% performance boost through targeted optimisations</li>'
  +'<li>Reduced system errors by 25%; executed end-to-end data migration with business validations</li>'
  +'<li>Developed Pro Hunt: question bank, test scoring by weightage, automated result notifications</li>'
  +'</ul>'
  +'<div class="tags"><span class="tag">Java</span><span class="tag">Spring Boot</span><span class="tag">Angular</span><span class="tag">JavaScript</span><span class="tag">SQL</span><span class="tag">Bootstrap</span><span class="tag">OOP/SOLID</span><span class="tag">IntelliJ IDEA</span></div></div></div>'
  // Education
  +'<div class="sec"><div class="stitle">Education</div>'
  +'<div class="edu">B.E. Computer Science Engineering</div>'
  +'<div class="edui">K.S.R. College of Engineering, Tiruchengode</div>'
  +'<div class="edum">2016 \u2013 2020 \u2022 GPA: 8.89 / 10</div></div>'
  +'</div>'
  // Sidebar - NO award box, NO languages, Angular 40%, full tools list
  +'<div>'
  +'<div class="sec"><div class="stitle">Core Skills</div>'
  +[['Core Java / Spring Boot','90'],['SQL / Stored Procs','88'],['REST APIs','90'],['JavaScript','80'],['Angular','65'],['Microservices','78']].map(function(s){return'<div class="sk"><div class="skr"><span>'+s[0]+'</span><span>'+s[1]+'%</span></div><div class="btr"><div class="btf" style="width:'+s[1]+'%"></div></div></div>';}).join('')+'</div>'
  +'<div class="sec"><div class="stitle">Tools & Principles</div>'
  +'<div class="tags">'
  +'<span class="tag">IntelliJ IDEA</span><span class="tag">Eclipse IDE</span><span class="tag">VS Code</span>'
  +'<span class="tag">Git</span><span class="tag">GitHub Desktop</span>'
  +'<span class="tag">OOP</span><span class="tag">SOLID</span><span class="tag">Stream API</span>'
  +'<span class="tag">Agile</span><span class="tag">Bootstrap</span><span class="tag">Neo4J</span>'
  +'</div></div>'
  // Achievements with icons (matching PDF style)
  +'<div class="sec"><div class="stitle">Achievements</div>'
  +'<div class="si"><span class="si-icon">&#9733;</span><div><div class="sin">Shining Star — R&R Award</div><div class="sii">UST HealthProof · 2024</div></div></div>'
  +'<div class="si"><span class="si-icon">\u25b6</span><div><div class="sin">20% Scalability Improvement</div><div class="sii">Increased system efficiency under load</div></div></div>'
  +'<div class="si"><span class="si-icon">\u25b6</span><div><div class="sin">30% Performance Boost</div><div class="sii">Improved app speed &amp; responsiveness</div></div></div>'
  +'<div class="si"><span class="si-icon">\u25b6</span><div><div class="sin">25% Bug Reduction</div><div class="sii">More stable user-facing application</div></div</div></div></div>'
  +'<div class="sec"><div class="stitle">Strengths</div>'
  +'<div class="si"><span class="si-icon">&#9654;</span><div><div class="sin">Technology Adaptability</div><div class="sii">Quick learner across technologies</div></div></div>'
  +'<div class="si"><span class="si-icon">&#9654;</span><div><div class="sin">Team Collaboration</div><div class="sii">Cross-functional communication</div></div></div>'
  +'</div>'
  +'</div></div></div>'
  +'<scr'+'ipt>window.onload=function(){setTimeout(function(){window.print();},700);}<\/script>'
  +'</body></html>');
  w.document.close();
  setTimeout(function(){btn.innerHTML='<i class="fas fa-download"></i> Download PDF';btn.disabled=false;},2000);
}

// ════ TESTIMONIAL CAROUSEL ════
(function(){
  var track=document.getElementById('carouselTrack');
  var dotsEl=document.getElementById('carouselDots');
  var progBar=document.getElementById('carouselProgress');
  if(!track)return;
  var cards=track.querySelectorAll('.testimonial-card');
  var total=cards.length;
  var current=0;
  var DELAY=4200;
  var autoTimer=null;

  function getVis(){
    return window.innerWidth<=600?1:window.innerWidth<=900?2:3;
  }

  function buildDots(){
    dotsEl.innerHTML='';
    var pages=Math.ceil(total/getVis());
    for(var i=0;i<pages;i++){
      var d=document.createElement('div');
      d.className='carousel-dot'+(i===0?' active':'');
      (function(idx){d.onclick=function(){goTo(idx);resetAuto();};})(i);
      dotsEl.appendChild(d);
    }
  }

  function goTo(page){
    var vis=getVis();
    var pages=Math.ceil(total/vis);
    current=((page%pages)+pages)%pages;
    // Compute card width including gap
    var cardEl=cards[0];
    var style=window.getComputedStyle(cardEl);
    var cardW=cardEl.offsetWidth + parseInt(style.marginLeft||0)*2;
    track.style.transform='translateX(-'+(current*vis*cardW)+'px)';
    dotsEl.querySelectorAll('.carousel-dot').forEach(function(d,i){d.classList.toggle('active',i===current);});
  }

  function startProg(){
    if(!progBar)return;
    progBar.style.transition='none';progBar.style.width='0%';
    setTimeout(function(){
      if(progBar){progBar.style.transition='width '+DELAY+'ms linear';progBar.style.width='100%';}
    },40);
  }

  function resetAuto(){
    clearTimeout(autoTimer);
    startProg();
    autoTimer=setTimeout(function(){goTo(current+1);resetAuto();},DELAY);
  }

  buildDots();
  resetAuto();

  document.getElementById('carouselPrev').onclick=function(){goTo(current-1);resetAuto();};
  document.getElementById('carouselNext').onclick=function(){goTo(current+1);resetAuto();};

  // Touch swipe
  var tx=0;
  track.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});
  track.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>48){goTo(dx<0?current+1:current-1);resetAuto();}});

  // Pause on hover
  var outer=document.getElementById('testimonialCarousel');
  outer.addEventListener('mouseenter',function(){clearTimeout(autoTimer);if(progBar){progBar.style.transition='none';}});
  outer.addEventListener('mouseleave',function(){resetAuto();});

  window.addEventListener('resize',function(){buildDots();goTo(0);});
})();

// ════ SKILL BARS — SCROLL TRIGGERED ════
function animateSkillBarsInView(){
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var b=e.target;
        if(b.dataset.targetW){
          b.style.transition='width 1.1s cubic-bezier(.16,1,.3,1)';
          b.style.width=b.dataset.targetW;
        }
        obs.unobserve(b);
      }
    });
  },{threshold:0.25});
  document.querySelectorAll('.skill-bar-fill,.rv-bar-fill').forEach(function(b){
    var w=b.style.width;
    if(w&&w!=='0%'){
      b.dataset.targetW=w;
      b.style.width='0%';
      obs.observe(b);
    }
  });
}