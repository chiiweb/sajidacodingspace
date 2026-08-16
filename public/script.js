const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const loader = $('#loader');
const loaderMessage = $('#loader-message');
const clock = $('#clock');
const progress = $('#scrollProgress');
const terminalForm = $('#terminalForm');
const terminalInput = $('#terminalInput');
const terminalOutput = $('#terminalOutput');
const themeButton = $('#themeButton');
const toast = $('#toast');
// Loading sound: browsers may block autoplay until the user interacts.
function playLoadSound(){
  const audio = $('#loadSound');
  if (!audio) return;
  audio.volume = 0.3;
  audio.currentTime = 0;
  const promise = audio.play();
  if (promise?.catch) promise.catch(() => {});
}
window.addEventListener('load', () => setTimeout(playLoadSound, 250));
document.addEventListener('pointerdown', playLoadSound, {once:true});
document.addEventListener('keydown', playLoadSound, {once:true});
// Create floating code particles
function createFloatingParticles(){const symbols=['<','/>','{}','();','var','const','let','=>','function'];for(let i=0;i<12;i++){const particle=document.createElement('div');particle.style.cssText=`position:fixed;font-size:${10+Math.random()*15}px;color:rgba(200,189,255,${Math.random()*.3+.1});pointer-events:none;z-index:-2;font-family:monospace;font-weight:bold;animation:float${i%3} ${8+Math.random()*6}s infinite;left:${Math.random()*100}%;top:${Math.random()*100}%`;particle.textContent=symbols[Math.floor(Math.random()*symbols.length)];document.body.appendChild(particle);}const style=document.createElement('style');style.textContent=`@keyframes float0{0%{transform:translateY(0px) rotateZ(0deg);opacity:0.3}50%{opacity:0.6}100%{transform:translateY(-100px) rotateZ(360deg);opacity:0}}@keyframes float1{0%{transform:translateX(0px) rotateZ(0deg);opacity:0.3}50%{opacity:0.6}100%{transform:translateX(80px) rotateZ(180deg);opacity:0}}@keyframes float2{0%{transform:translateY(0px) scale(1);opacity:0.3}50%{opacity:0.6;scale:1.2}100%{transform:translateY(60px);scale:0.8;opacity:0}}`;document.head.appendChild(style);}
createFloatingParticles();
// Click particles effect
document.addEventListener('click',e=>{const x=e.clientX;const y=e.clientY;for(let i=0;i<5;i++){const particle=document.createElement('div');particle.style.cssText=`position:fixed;left:${x}px;top:${y}px;width:8px;height:8px;background:radial-gradient(circle,#87e0a5,#c8bdff);border-radius:50%;pointer-events:none;z-index:999;animation:popParticle 0.6s ease-out forwards;opacity:0.8`;document.body.appendChild(particle);const angle=Math.random()*Math.PI*2;const velocity=3+Math.random()*3;const vx=Math.cos(angle)*velocity;const vy=Math.sin(angle)*velocity;let tx=0,ty=0;const startTime=Date.now();const duration=600;const animate=()=>{const elapsed=Date.now()-startTime;const progress=Math.min(elapsed/duration,1);tx+=vx;ty+=vy*(1-progress);particle.style.transform=`translate(${tx}px,${ty}px) scale(${1-progress})`;if(progress<1)requestAnimationFrame(animate);};animate();setTimeout(()=>particle.remove(),duration);}});
// Keyboard shortcuts panel
const shortcutsPanel=$('#keyboardShortcuts');$('#closeShortcuts').addEventListener('click',()=>shortcutsPanel.classList.remove('open'));
document.addEventListener('keydown',e=>{if(e.key==='?'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();shortcutsPanel.classList.toggle('open');}});
// Add keyboard shortcuts
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey){if(e.key.toLowerCase()==='s'){e.preventDefault();$('#runCodeBtn')?.click();showToast('🚀 code running');}}});

const resourceData = [
  {id:'html',type:'frontend',label:'html',title:'web structure',desc:'elements, semantic layouts, forms, links, media, and accessible page structure.',url:'https://developer.mozilla.org/en-US/docs/Web/HTML'},
  {id:'css',type:'frontend',label:'css',title:'visual design',desc:'selectors, box model, flexbox, grid, responsive layouts, animation, and visual polish.',url:'https://developer.mozilla.org/en-US/docs/Web/CSS'},
  {id:'javascript',type:'frontend',label:'javascript',title:'interactivity',desc:'events, functions, dom updates, arrays, objects, fetch, and responsive interfaces.',url:'https://developer.mozilla.org/en-US/docs/Web/JavaScript'},
  {id:'node',type:'backend',label:'node.js',title:'the backend',desc:'servers, routes, requests, modules, and connecting frontend code to backend code.',url:'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs'},
  {id:'express',type:'backend',label:'express',title:'api routes',desc:'learn the lightweight web framework behind this classroom and build your own endpoints.',url:'https://expressjs.com/en/starter/installing.html'},
  {id:'git',type:'backend',label:'git',title:'version control',desc:'save versions of projects, understand changes, and keep experiments organized.',url:'https://git-scm.com/docs/gittutorial'}
];
const projectData = [
  ['mini portfolio','build a one-page portfolio with a hero, projects, and contact section.','frontend'],
  ['quiz machine','make a quiz that keeps score and gives feedback after every answer.','javascript'],
  ['pixel canvas','draw on a little canvas and add tools such as clear, color, and undo.','javascript'],
  ['classroom api','make a tiny api that returns lessons, projects, or random coding facts.','node.js'],
  ['mood page','create an animated page that changes its look based on a selected mood.','css'],
  ['idea vault','store project ideas in local storage and let the user search and tag them.','javascript'],
  ['car dash','build a top-down car dodging game with arrow-key steering, increasing speed, and a saved high score.','javascript'],
  ['spellbook app','create a magical spellbook where clicking a spell reveals a random glowing effect and sparkle animation.','javascript'],
  ['star map','build an interactive night-sky map with clickable constellations and hover facts.','css'],
  ['potion mixer','combine magic ingredients and reveal a randomly generated potion name, color, and effect.','javascript'],
  ['virtual pet','take care of a cute pixel pet with hunger, happiness, and energy stats that change over time.','javascript'],
  ['meme generator','pick a template image and add customizable top and bottom captions like a meme maker.','javascript'],
  ['glow maze','build a dark maze game where the player only sees a small glowing radius around them.','javascript'],
  ['typing wizard','a magic-themed typing speed test that casts a spell faster the more accurately you type.','javascript']
];

// ---- windows-style lock screen -> sign-in spinner -> reveal ----
(function initLoader(){
  const lockScreen = $('#lockScreen');
  const signinScreen = $('#signinScreen');
  const lockTime = $('#lockTime');
  const lockDate = $('#lockDate');
  const loadingMessages = ['booting the classroom...','loading the lesson library...','connecting the frontend...','checking the node.js server...','almost ready ✦'];
  let loadingIndex = 0;
  let advanced = false;
  let loadingTimer = null;
  let pageLoaded = false;

  function tickLockClock(){
    const now = new Date();
    lockTime.textContent = now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    lockDate.textContent = now.toLocaleDateString([], {weekday:'long',month:'long',day:'numeric'});
  }
  tickLockClock();
  const lockClockTimer = setInterval(tickLockClock, 1000);

  function goToSignin(){
    if (advanced) return;
    advanced = true;
    clearInterval(lockClockTimer);
    lockScreen.classList.add('hide');
    signinScreen.classList.add('show');
    loaderMessage.textContent = loadingMessages[0];
    loadingTimer = setInterval(() => {
      loadingIndex++;
      loaderMessage.textContent = loadingMessages[loadingIndex % loadingMessages.length];
    }, 500);
    playLoadSound();
    maybeFinish();
  }

  lockScreen.addEventListener('click', goToSignin);
  document.addEventListener('keydown', goToSignin, {once:true});
  // auto-advance so the loader never gets stuck if nobody interacts
  setTimeout(goToSignin, 1800);

  function maybeFinish(){
    if (!advanced || !pageLoaded) return;
    setTimeout(() => {
      clearInterval(loadingTimer);
      loader.classList.add('hidden');
    }, 700);
  }

  window.addEventListener('load', () => { pageLoaded = true; maybeFinish(); });
  // safety net: never let the loader block the site for more than ~6s
  setTimeout(() => { pageLoaded = true; if (!advanced) goToSignin(); maybeFinish(); loader.classList.add('hidden'); }, 6000);
})();

function updateClock(){clock.textContent=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});}
updateClock();setInterval(updateClock,1000);
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${max?scrollY/max*100:0}%`;});

$$('.tilt').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${y*-5}deg) rotateY(${x*6}deg) translateY(-5px)`});card.addEventListener('pointerleave',()=>card.style.transform='');});

function addTerminalLine(text,command=false){const line=document.createElement('div');line.className='terminal-line';if(command){const safe=text.replaceAll('<','&lt;').replaceAll('>','&gt;');line.innerHTML=`<span class="purple">sajida@localhost:~$</span> ${safe}`;}else line.textContent=text;terminalOutput.appendChild(line);terminalOutput.scrollTop=terminalOutput.scrollHeight;}
async function runTerminalCommand(command){if(!command)return;addTerminalLine(command,true);terminalInput.value='';try{const r=await fetch('/api/terminal',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({command})});if(!r.ok)throw new Error('bad response');const data=await r.json();if(data.output==='__CLEAR__'){terminalOutput.innerHTML='';return;}data.output.split('\n').forEach(line=>addTerminalLine(line));}catch{addTerminalLine('error: could not connect to the node.js server.');showToast('the backend is not reachable — start the server with npm start');}}
terminalForm.addEventListener('submit',e=>{e.preventDefault();runTerminalCommand(terminalInput.value.trim());});
$('.terminal-quick').addEventListener('click',e=>{const b=e.target.closest('button[data-command]');if(!b)return;runTerminalCommand(b.dataset.command);terminalInput.focus();});

document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#terminal').scrollIntoView({behavior:'smooth'});setTimeout(()=>terminalInput.focus(),500);}if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();openSearch();}});

function showToast(message,duration=2200){toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),duration);}
function renderResources(filter='all',query=''){const grid=$('#resourceGrid');const q=query.toLowerCase();grid.innerHTML='';resourceData.filter(r=>(filter==='all'||r.type===filter)&&(r.title+r.label+r.desc).toLowerCase().includes(q)).forEach(r=>{const card=document.createElement('article');card.className='resource tilt';card.innerHTML=`<span>${r.label}</span><h3>${r.title}</h3><p>${r.desc}</p><div class="resource-actions"><button data-lesson="${r.id}">open lesson →</button><a href="${r.url}" target="_blank" rel="noopener">official docs ↗</a></div>`;grid.appendChild(card);});if(!grid.children.length)grid.innerHTML='<div class="resource"><span>no match</span><h3>nothing found</h3><p>try another topic or clear the search box.</p></div>';$$('.tilt',grid).forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${y*-4}deg) rotateY(${x*5}deg) translateY(-4px)`;}));}
renderResources();
$('#resourceSearch').addEventListener('input',e=>renderResources($('.filter.active').dataset.filter,e.target.value));
$$('.filter').forEach(b=>b.addEventListener('click',()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderResources(b.dataset.filter,$('#resourceSearch').value)}));

const modal=$('#lessonModal');const lessonContent=$('#lessonContent');
const lessonDetails={html:{title:'html lesson',text:'html gives a page its structure. start by thinking in meaningful sections, then add content with elements that describe what the content is.',items:['headings and paragraphs','links, images, and lists','forms and semantic sections','accessible page structure']},css:{title:'css lesson',text:'css controls how the structure looks and behaves. layout systems such as flexbox and grid make polished responsive pages much easier to build.',items:['selectors and the box model','flexbox and grid','responsive design','transitions and animation']},javascript:{title:'javascript lesson',text:'javascript adds behavior. start with small interactions, then connect those ideas to the dom and browser events.',items:['variables and functions','events and the dom','arrays and objects','fetch and browser storage']},node:{title:'node.js lesson',text:'node.js lets javascript run outside the browser. this project uses it to power the classroom api and terminal.',items:['create a server','make routes','return json','connect frontend requests']},express:{title:'express lesson',text:'express makes node web apps easier to organize by giving you routing and middleware tools.',items:['install express','create routes','send json','serve static files']},git:{title:'git lesson',text:'git helps keep project history organized so experiments can be changed without losing useful versions.',items:['initialize a repository','save a snapshot','review changes','work safely on experiments']}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-lesson]');if(!b)return;const d=lessonDetails[b.dataset.lesson];lessonContent.innerHTML=`<div class="lesson-content"><span>${b.dataset.lesson}</span><h2>${d.title}</h2><p>${d.text}</p><ul class="lesson-list">${d.items.map(x=>`<li>${x}</li>`).join('')}</ul><div class="lesson-actions"><a class="button primary" href="${resourceData.find(x=>x.id===b.dataset.lesson)?.url||'#'}" target="_blank" rel="noopener">open official docs ↗</a><button class="button secondary" id="closeLessonInside">back to classroom</button></div></div>`;modal.classList.add('open');modal.setAttribute('aria-hidden','false');});
function closeLesson(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');}$('#closeLesson').addEventListener('click',closeLesson);modal.addEventListener('click',e=>{if(e.target===modal)closeLesson();});document.addEventListener('click',e=>{if(e.target.id==='closeLessonInside')closeLesson();});

function renderProjects(){const grid=$('#projectGrid');grid.innerHTML=projectData.map((p,i)=>`<article class="project-card"><small>${String(i+1).padStart(2,'0')} / ${p[2]}</small><h3>${p[0]}</h3><p>${p[1]}</p><button data-project="${p[0]}">use this idea →</button></article>`).join('');}
renderProjects();
$('#projectGrid').addEventListener('click',e=>{const b=e.target.closest('[data-project]');if(!b)return;const idea=`<div>project idea: <strong>${b.dataset.project}</strong></div><div>next step: </div>`;$('#notes').innerHTML=idea;saveNotes();$('#notes').focus();const range=document.createRange();const sel=window.getSelection();const lastNode=$('#notes').lastChild;if(lastNode){range.setStart(lastNode,lastNode.textContent.length);sel.removeAllRanges();sel.addRange(range);}showToast('project idea added to the notebook');});
const notes=$('#notes');notes.innerHTML=localStorage.getItem('sajida-notes')||'';notes.addEventListener('input',saveNotes);notes.addEventListener('paste',e=>{e.preventDefault();const text=e.clipboardData.getData('text/plain');document.execCommand('insertText',false,text);});function saveNotes(){localStorage.setItem('sajida-notes',notes.innerHTML);const saveState=$('#saveState');saveState.textContent='✓ saved';saveState.style.color='#87e0a5';clearTimeout(saveNotes.timeout);saveNotes.timeout=setTimeout(()=>{saveState.textContent='saved locally';saveState.style.color='#7f7a8d';},2000);}$('#clearNotes').addEventListener('click',()=>{notes.innerHTML='';saveNotes();showToast('notebook cleared');});$('#fontSelector').addEventListener('change',e=>{document.execCommand('fontName',false,e.target.value);notes.focus();});$('#boldBtn').addEventListener('click',()=>{document.execCommand('bold',false,null);notes.focus();updateFormatButtons();});$('#italicBtn').addEventListener('click',()=>{document.execCommand('italic',false,null);notes.focus();updateFormatButtons();});$('#underlineBtn').addEventListener('click',()=>{document.execCommand('underline',false,null);notes.focus();updateFormatButtons();});notes.addEventListener('mouseup',updateFormatButtons);notes.addEventListener('keyup',updateFormatButtons);function updateFormatButtons(){$('#boldBtn').classList.toggle('active',document.queryCommandState('bold'));$('#italicBtn').classList.toggle('active',document.queryCommandState('italic'));$('#underlineBtn').classList.toggle('active',document.queryCommandState('underline'));}if(!notes.innerHTML.trim()){notes.setAttribute('data-placeholder','write project ideas, lesson notes, or tiny goals here...');}
const templates={html:`<!DOCTYPE html>
<html>
<head>
  <title>My Project</title>
  <style>
    body { font-family: sans-serif; margin: 20px; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <h1>Welcome!</h1>
  <p>Start coding here</p>
</body>
</html>`,css:`<h1>Flexbox Layout</h1>
<div style="display: flex; gap: 20px; flex-wrap: wrap;">
  <div style="flex: 1; min-width: 200px; background: #87e0a5; padding: 20px; border-radius: 8px;">Box 1</div>
  <div style="flex: 1; min-width: 200px; background: #f2b9df; padding: 20px; border-radius: 8px;">Box 2</div>
  <div style="flex: 1; min-width: 200px; background: #9cddff; padding: 20px; border-radius: 8px;">Box 3</div>
</div>`,flexbox:`<h1>CSS Grid</h1>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
  <div style="background: #c8bdff; padding: 30px; border-radius: 8px; text-align: center;">A</div>
  <div style="background: #f1b6de; padding: 30px; border-radius: 8px; text-align: center;">B</div>
  <div style="background: #a0d8f7; padding: 30px; border-radius: 8px; text-align: center;">C</div>
  <div style="background: #87e0a5; padding: 30px; border-radius: 8px; text-align: center;">D</div>
</div>`,'js-counter':`<h1>Counter App</h1>
<div style="text-align: center; font-size: 48px; margin: 20px 0;" id="count">0</div>
<button onclick="document.getElementById('count').textContent = parseInt(document.getElementById('count').textContent) + 1" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">+1</button>
<button onclick="document.getElementById('count').textContent = 0" style="padding: 10px 20px; font-size: 16px; cursor: pointer; margin-left: 10px;">Reset</button>`,form:`<h1>Contact Form</h1>
<form style="max-width: 400px;">
  <input type="text" placeholder="Your name" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px;">
  <input type="email" placeholder="Your email" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px;">
  <textarea placeholder="Your message" rows="5" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px;"></textarea>
  <button type="submit" style="padding: 10px 20px; background: #87e0a5; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Send</button>
</form>`,'car-game':`<!DOCTYPE html>
<html>
<head>
<style>
  body{margin:0;background:#111;display:flex;flex-direction:column;align-items:center;font-family:sans-serif;color:#fff;padding-top:14px}
  #score{font-size:20px;margin-bottom:8px}
  canvas{background:#333;border-radius:8px;touch-action:none}
  #hint{color:#aaa;font-size:12px;margin-top:8px}
</style>
</head>
<body>
  <div id="score">score: 0</div>
  <canvas id="game" width="320" height="480"></canvas>
  <div id="hint">use ← → arrow keys to dodge the cars</div>
  <script>
    const canvas=document.getElementById('game');
    const ctx=canvas.getContext('2d');
    const scoreEl=document.getElementById('score');
    let carX=canvas.width/2-20, carWidth=40, carHeight=70;
    let speed=3, score=0, gameOver=false;
    let obstacles=[];
    let keys={};
    document.addEventListener('keydown',e=>keys[e.key]=true);
    document.addEventListener('keyup',e=>keys[e.key]=false);
    function spawnObstacle(){
      const x=Math.random()*(canvas.width-40);
      obstacles.push({x,y:-80,w:40,h:70,color:['#e74c3c','#3498db','#f1c40f','#9b59b6'][Math.floor(Math.random()*4)]});
    }
    let spawnTimer=0;
    function update(){
      if(gameOver)return;
      if(keys['ArrowLeft'])carX-=5;
      if(keys['ArrowRight'])carX+=5;
      carX=Math.max(0,Math.min(canvas.width-carWidth,carX));
      spawnTimer++;
      if(spawnTimer>Math.max(25,60-speed*3)){spawnObstacle();spawnTimer=0;}
      obstacles.forEach(o=>o.y+=speed);
      obstacles=obstacles.filter(o=>o.y<canvas.height+80);
      obstacles.forEach(o=>{
        if(carX<o.x+o.w&&carX+carWidth>o.x&&420<o.y+o.h&&420+carHeight>o.y){
          gameOver=true;
        }
      });
      score++;
      speed=3+score/500;
      scoreEl.textContent='score: '+score;
    }
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#555';
      for(let i=0;i<canvas.width;i+=40)ctx.fillRect(i,0,2,canvas.height);
      ctx.fillStyle='#2ecc71';
      ctx.fillRect(carX,420,carWidth,carHeight);
      obstacles.forEach(o=>{ctx.fillStyle=o.color;ctx.fillRect(o.x,o.y,o.w,o.h);});
      if(gameOver){
        ctx.fillStyle='rgba(0,0,0,0.7)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle='#fff';
        ctx.font='20px sans-serif';
        ctx.textAlign='center';
        ctx.fillText('game over — score '+score,canvas.width/2,canvas.height/2-10);
        ctx.font='13px sans-serif';
        ctx.fillText('refresh to play again',canvas.width/2,canvas.height/2+16);
      }
    }
    function loop(){update();draw();requestAnimationFrame(loop);}
    loop();
  <\/script>
</body>
</html>`,'magic-spell':`<!DOCTYPE html>
<html>
<head>
<style>
  body{margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 20%,#3a1a6b,#0a0620 70%);font-family:sans-serif;color:#fff;text-align:center;padding:20px}
  h1{font-size:26px;margin-bottom:6px}
  p{color:#c9a3f5;font-size:13px;margin-bottom:24px}
  #spell{font-size:22px;min-height:60px;margin:16px 0;color:#f4ecff;text-shadow:0 0 12px #e879f9}
  button{background:linear-gradient(145deg,#c14fff,#ff4fd8);color:#180a2e;border:0;padding:14px 26px;border-radius:99px;font-weight:700;cursor:pointer;font-size:14px}
  .sparkle{position:fixed;pointer-events:none;font-size:16px;animation:rise 1.2s ease-out forwards}
  @keyframes rise{to{transform:translateY(-80px);opacity:0}}
</style>
</head>
<body>
  <h1>✨ magic spell generator ✨</h1>
  <p>click the wand to cast a random spell</p>
  <div id="spell">...</div>
  <button id="castBtn">🪄 cast a spell</button>
  <script>
    const spells=[
      'Glimmerwind — summons a gentle breeze of floating stars.',
      'Emberheart — wraps the caster in warm protective fire.',
      'Moonveil — turns you invisible under moonlight for one minute.',
      'Frostbloom — grows a flower made entirely of shimmering ice.',
      'Starfall Echo — calls down a shower of tiny harmless shooting stars.',
      'Whisperleaf — lets you understand what the trees are saying.',
      'Duskbind — freezes shadows in place for a few seconds.',
      'Auroralight — paints the sky with dancing magical colors.'
    ];
    const spellEl=document.getElementById('spell');
    document.getElementById('castBtn').addEventListener('click',e=>{
      spellEl.textContent=spells[Math.floor(Math.random()*spells.length)];
      for(let i=0;i<10;i++){
        const s=document.createElement('div');
        s.className='sparkle';
        s.textContent='✦';
        s.style.left=(e.clientX+(Math.random()*80-40))+'px';
        s.style.top=(e.clientY+(Math.random()*40-20))+'px';
        document.body.appendChild(s);
        setTimeout(()=>s.remove(),1200);
      }
    });
  <\/script>
</body>
</html>`};
// CODE EDITOR FUNCTIONALITY
const htmlEditor=$('#htmlEditor');const cssEditor=$('#cssEditor');const jsEditor=$('#jsEditor');const fileNameInput=$('#fileName');const codePreview=$('#codePreview');
function saveEditors(){const data={html:htmlEditor.value,css:cssEditor.value,js:jsEditor.value,name:fileNameInput.value||'index'};localStorage.setItem('sajida-code',JSON.stringify(data));}
function loadEditors(){const data=localStorage.getItem('sajida-code');if(data){const parsed=JSON.parse(data);htmlEditor.value=parsed.html||'';cssEditor.value=parsed.css||'';jsEditor.value=parsed.js||'';fileNameInput.value=parsed.name||'index';}}
loadEditors();
[htmlEditor,cssEditor,jsEditor,fileNameInput].forEach(el=>el.addEventListener('input',saveEditors));
// Tab switching
$$('.tab-btn').forEach(btn=>btn.addEventListener('click',e=>{const tab=e.target.dataset.tab;$$('.tab-btn').forEach(b=>b.classList.remove('active'));$$('.editor-tab').forEach(t=>t.classList.remove('active'));e.target.classList.add('active');document.querySelector(`.editor-tab[data-tab="${tab}"]`).classList.add('active');[htmlEditor,cssEditor,jsEditor].forEach(ed=>{if(ed.value)ed.focus();});}));
// Templates for code editor
$('#codeTemplates').addEventListener('change',e=>{if(!e.target.value)return;const template=templates[e.target.value];htmlEditor.value=template;if(e.target.value==='car-game'||e.target.value==='magic-spell'){cssEditor.value='';jsEditor.value='';}saveEditors();showToast(e.target.value==='car-game'?'🚗 car game loaded — press run!':e.target.value==='magic-spell'?'✨ spell generator loaded — press run!':'template loaded');e.target.value='';});
// Run code
$('#runCodeBtn').addEventListener('click',()=>{const html=htmlEditor.value;const css=cssEditor.value;const js=jsEditor.value;if(!html.trim()&&!css.trim()&&!js.trim()){showToast('write some code first');return;}const htmlContent=`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${fileNameInput.value||'My Project'}</title>
  <style>
    body { margin: 0; padding: 20px; font-family: sans-serif; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    ${js}
  </script>
  ${CONSOLE_HOOK}
</body>
</html>`;codePreview.srcdoc=htmlContent;previewConsole.innerHTML='<div class="console-line dim">console output will appear here when you run your code.</div>';showToast('code running!');});
// Clear editor
$('#clearEditor').addEventListener('click',()=>{if(confirm('clear all code?')){htmlEditor.value='';cssEditor.value='';jsEditor.value='';fileNameInput.value='index';saveEditors();codePreview.srcdoc='';showToast('editor cleared');}});
// Export code
$('#exportBtn').addEventListener('click',()=>{const html=htmlEditor.value;const css=cssEditor.value;const js=jsEditor.value;const htmlContent=`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${fileNameInput.value||'My Project'}</title>
  <style>
    body { margin: 0; padding: 20px; font-family: sans-serif; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    ${js}
  </script>
</body>
</html>`;const blob=new Blob([htmlContent],{type:'text/html'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${fileNameInput.value||'project'}.html`;a.click();URL.revokeObjectURL(url);showToast('downloaded: '+a.download);});
$('#clearPreview').addEventListener('click',()=>{codePreview.srcdoc='';showToast('preview cleared');});
// Copy to clipboard functionality
function addCopyButtons(){const editors=document.querySelectorAll('.editor-textarea');editors.forEach(editor=>{const copyBtn=document.createElement('button');copyBtn.className='copy-btn';copyBtn.textContent='📋 copy';copyBtn.style.position='absolute';copyBtn.style.top='10px';copyBtn.style.right='10px';copyBtn.style.zIndex='100';copyBtn.addEventListener('click',e=>{e.stopPropagation();const text=editor.value;if(!text.trim()){showToast('nothing to copy');return;}navigator.clipboard.writeText(text).then(()=>{copyBtn.textContent='✓ copied!';copyBtn.classList.add('copied');setTimeout(()=>{copyBtn.textContent='📋 copy';copyBtn.classList.remove('copied');},2000);}).catch(()=>showToast('copy failed'));});});}
setTimeout(addCopyButtons,100);
// Color picker for CSS
function enhanceCSSEditor(){const cssEditor=$('#cssEditor');const style=document.createElement('style');style.textContent=`.editor-tab[data-tab="css"] .editor-textarea::placeholder{color:#888;font-style:italic;}`;document.head.appendChild(style);}
enhanceCSSEditor();
// Code statistics
function updateStats(){const html=htmlEditor.value||'';const css=cssEditor.value||'';const js=jsEditor.value||'';const totalLines=html.split('\n').length+css.split('\n').length+js.split('\n').length;const totalChars=html.length+css.length+js.length;return{lines:totalLines,chars:totalChars};}
// Add editor hints
function addEditorHints(){const tabs=$$('.tab-btn');tabs.forEach(tab=>{tab.addEventListener('click',()=>{const tabName=tab.dataset.tab;const hints={html:'tip: use semantic HTML5 tags',css:'tip: try flexbox or grid layouts',js:'tip: console.log() for debugging'};showToast(hints[tabName]||'keep coding');});});}
addEditorHints();
// Track coding session
let sessionStats={filesCreated:0,codesRun:0,startTime:Date.now()};
const originalRunClick=$('#runCodeBtn').onclick;
$('#runCodeBtn').addEventListener('click',()=>{sessionStats.codesRun++;if(sessionStats.codesRun%5===0){showToast(`🎉 ${sessionStats.codesRun} code runs! keep going!`);}});
// Enhanced celebration with confetti
function createConfetti(){for(let i=0;i<30;i++){const confetti=document.createElement('div');confetti.style.cssText=`position:fixed;width:10px;height:10px;background:${['#87e0a5','#f2b9df','#9cddff','#c8bdff'][Math.floor(Math.random()*4)]};left:${Math.random()*100}%;top:-10px;border-radius:50%;pointer-events:none;z-index:3000;animation:confettiFall ${2+Math.random()*2}s ease-in forwards`;document.body.appendChild(confetti);setTimeout(()=>confetti.remove(),(2+Math.random()*2)*1000);}}
// Add confetti animation
const style=document.createElement('style');style.textContent=`@keyframes confettiFall{to{transform:translateY(100vh) rotateZ(360deg);opacity:0}}`;document.head.appendChild(style);
// Show cool stats on milestone
document.addEventListener('click',e=>{if(e.target.id==='celebrateButton'){createConfetti();const elapsed=Math.round((Date.now()-sessionStats.startTime)/1000);showToast(`✨ awesome! ${sessionStats.codesRun} runs in ${elapsed}s`);}});
// Code suggestions
function addCodeSuggestions(){const htmlEditor=$('#htmlEditor');const cssEditor=$('#cssEditor');const jsEditor=$('#jsEditor');[htmlEditor,cssEditor,jsEditor].forEach(editor=>{editor.addEventListener('keydown',e=>{if(e.key===';'||e.key==='}'){e.preventDefault();const curVal=editor.value;editor.value=curVal+e.key;editor.dispatchEvent(new Event('input'));}});});}
addCodeSuggestions();
// Add visual feedback on file operations
fileNameInput.addEventListener('input',()=>{const name=fileNameInput.value||'index';const ext='.html';const display=name+ext;fileNameInput.parentElement.querySelector('span').textContent=ext;showToast(`📁 ${display}`,500);});
// Enhance export with sound
const originalExport=$('#exportBtn')?.onclick;
$('#exportBtn')?.addEventListener('click',()=>{setTimeout(()=>showToast('⬇️ downloaded!'),100);playSound();});
// Easter egg: Konami code
let konamiCode='';const konamiPattern='ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRight';
document.addEventListener('keydown',e=>{konamiCode+=e.code;if(konamiCode.includes('ArrowUp')&&konamiCode.length>10){if(konamiCode.includes(konamiPattern.substring(0,Math.min(konamiCode.length,konamiPattern.length)))){if(konamiCode===konamiPattern){document.body.style.animation='rainbow 4s linear infinite';showToast('🌈 rainbow mode activated!');setTimeout(()=>document.body.style.animation='',4000);}}}if(konamiCode.length>20)konamiCode=konamiCode.slice(-10);});
// Add typing animation to headings
$$('h1,h2,h3').forEach(heading=>{if(!heading.classList.contains('already-animated')){heading.classList.add('already-animated');const text=heading.textContent;heading.textContent='';let index=0;const type=()=>{if(index<text.length){heading.textContent+=text[index];index++;setTimeout(type,30);}};if(heading.offsetParent!==null)type();}});
// Rainbow animation for easter egg
const rainbowStyle=document.createElement('style');rainbowStyle.textContent=`@keyframes rainbow{0%{background:#080810}14%{background-color:#080810}28%{background-color:#080810}42%{background-color:#080810}56%{background-color:#080810}70%{background-color:#080810}84%{background-color:#080810}100%{background-color:#080810}}`;document.head.appendChild(rainbowStyle);
// Add glow effect to active elements
$$('.tab-btn.active').forEach(btn=>btn.style.boxShadow='0 0 12px #87e0a566');
// Cool counter for projects viewed
let projectsViewed=0;
$$('[data-project]').forEach(btn=>btn.addEventListener('click',()=>{projectsViewed++;if(projectsViewed===10)showToast('📊 10 projects viewed! explorer!');}));
// Scroll reveal animations
function revealOnScroll(){const elements=$$('[data-reveal]');const observer=new IntersectionObserver((entries,observer)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.animation='slideIn 0.6s ease-out forwards';observer.unobserve(entry.target);}});});elements.forEach(el=>observer.observe(el));}
revealOnScroll();
// Add slide-in animation
const slideStyle=document.createElement('style');slideStyle.textContent=`@keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`;document.head.appendChild(slideStyle);
// Section counters with visual feedback
let sectionViews={};
$$('section').forEach((section,i)=>{const id=section.id||`section-${i}`;sectionViews[id]=0;const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){sectionViews[id]++;if(sectionViews[id]===1){section.style.animation='slideIn 0.8s ease-out';showToast(`📍 viewing: ${id.replace(/-/g,' ')}`);}}});});observer.observe(section);});
// Add smooth hover effects to buttons
$$('button').forEach(btn=>{btn.addEventListener('mouseenter',()=>btn.style.transform='scale(1.05)');btn.addEventListener('mouseleave',()=>btn.style.transform='scale(1)');})
// ---- multi-theme system ----
const THEME_ICONS={midnight:'☼',daylight:'☾',ocean:'🌊',sunset:'🌅',forest:'🌿',galaxy:'✨'};
function applyTheme(id){
  document.body.classList.remove('light-mode','theme-ocean','theme-sunset','theme-forest','theme-galaxy');
  if(id==='daylight')document.body.classList.add('light-mode');
  else if(id!=='midnight')document.body.classList.add('theme-'+id);
  themeButton.textContent=THEME_ICONS[id]||'☼';
  localStorage.setItem('sajida-theme-v2',id);
  $$('.theme-swatch').forEach(s=>s.classList.toggle('active',s.dataset.theme===id));
}
const savedTheme=localStorage.getItem('sajida-theme-v2')||(localStorage.getItem('sajida-theme')==='light'?'daylight':'midnight');
applyTheme(savedTheme);
const themePopover=$('#themePopover');
themeButton.addEventListener('click',e=>{e.stopPropagation();toolsPopover?.classList.remove('open');themePopover.classList.toggle('open');themePopover.setAttribute('aria-hidden',themePopover.classList.contains('open')?'false':'true');});
$$('.theme-swatch').forEach(btn=>btn.addEventListener('click',()=>{applyTheme(btn.dataset.theme);showToast(`theme set: ${btn.querySelector('.name').textContent}`);themePopover.classList.remove('open');unlockBadge('themeShifter');}));
document.addEventListener('click',e=>{if(!themePopover.contains(e.target)&&e.target!==themeButton)themePopover.classList.remove('open');});

// ---- toolkit popover: focus timer / achievements / magic cursor ----
const toolsButton=$('#toolsButton');
const toolsPopover=$('#toolsPopover');
toolsButton.addEventListener('click',e=>{e.stopPropagation();themePopover.classList.remove('open');toolsPopover.classList.toggle('open');toolsPopover.setAttribute('aria-hidden',toolsPopover.classList.contains('open')?'false':'true');});
document.addEventListener('click',e=>{if(!toolsPopover.contains(e.target)&&e.target!==toolsButton)toolsPopover.classList.remove('open');});

// -- pomodoro focus timer --
let timerSeconds=25*60, timerInterval=null, timerRunning=false;
const timerDisplay=$('#timerDisplay');
function renderTimer(){const m=String(Math.floor(timerSeconds/60)).padStart(2,'0');const s=String(timerSeconds%60).padStart(2,'0');timerDisplay.textContent=`${m}:${s}`;}
renderTimer();
$('#timerStart').addEventListener('click',()=>{
  timerRunning=!timerRunning;
  $('#timerStart').textContent=timerRunning?'pause':'start';
  if(timerRunning){
    timerInterval=setInterval(()=>{
      timerSeconds--;
      renderTimer();
      if(timerSeconds<=0){
        clearInterval(timerInterval);
        timerRunning=false;
        $('#timerStart').textContent='start';
        showToast('⏱ time\'s up — nice focus session!');
        createConfetti();
        unlockBadge('focusMaster');
        timerSeconds=25*60;
        renderTimer();
      }
    },1000);
  }else{
    clearInterval(timerInterval);
  }
});
$('#timerReset').addEventListener('click',()=>{clearInterval(timerInterval);timerRunning=false;$('#timerStart').textContent='start';timerSeconds=25*60;renderTimer();});
$$('.timer-presets button').forEach(b=>b.addEventListener('click',()=>{clearInterval(timerInterval);timerRunning=false;$('#timerStart').textContent='start';timerSeconds=parseInt(b.dataset.mins)*60;renderTimer();}));

// -- achievements / badges --
const BADGES=[
  {id:'welcome',icon:'👋',label:'Welcome'},
  {id:'codeRunner',icon:'▶',label:'Code Runner'},
  {id:'terminalPro',icon:'⌘',label:'Terminal Pro'},
  {id:'ideaCollector',icon:'💡',label:'Idea Collector'},
  {id:'explorer',icon:'🧭',label:'Explorer'},
  {id:'themeShifter',icon:'🎨',label:'Theme Shifter'},
  {id:'focusMaster',icon:'⏱',label:'Focus Master'},
  {id:'magicUser',icon:'✨',label:'Magic User'}
];
let unlockedBadges=JSON.parse(localStorage.getItem('sajida-badges')||'[]');
function renderBadges(){
  const grid=$('#badgeGrid');
  grid.innerHTML=BADGES.map(b=>`<div class="badge${unlockedBadges.includes(b.id)?' unlocked':''}" data-label="${b.label}">${b.icon}</div>`).join('');
  $('#badgeCount').textContent=`${unlockedBadges.length}/${BADGES.length}`;
}
function unlockBadge(id){
  if(unlockedBadges.includes(id))return;
  unlockedBadges.push(id);
  localStorage.setItem('sajida-badges',JSON.stringify(unlockedBadges));
  renderBadges();
  const b=BADGES.find(x=>x.id===id);
  if(b)showToast(`🏆 achievement unlocked: ${b.label}`);
}
renderBadges();
unlockBadge('welcome');

// -- magic cursor sparkle trail --
const magicSwitch=$('#magicSwitch');
let magicOn=localStorage.getItem('sajida-magic')==='on';
function setMagic(on){magicOn=on;magicSwitch.classList.toggle('on',on);localStorage.setItem('sajida-magic',on?'on':'off');if(on)unlockBadge('magicUser');}
setMagic(magicOn);
magicSwitch.addEventListener('click',()=>{setMagic(!magicOn);showToast(magicOn?'✨ magic cursor on':'magic cursor off');});
let lastSparkle=0;
document.addEventListener('pointermove',e=>{
  if(!magicOn)return;
  const now=Date.now();
  if(now-lastSparkle<60)return;
  lastSparkle=now;
  const s=document.createElement('div');
  s.className='magic-sparkle';
  s.textContent=['✦','✧','⋆','✨'][Math.floor(Math.random()*4)];
  s.style.left=e.clientX+'px';
  s.style.top=e.clientY+'px';
  s.style.color=['#c8bdff','#f2b9df','#9cddff','#87e0a5'][Math.floor(Math.random()*4)];
  document.body.appendChild(s);
  setTimeout(()=>s.remove(),900);
});

// ---- daily coding challenge ----
const CHALLENGES=[
  {title:'Color Swap Button',desc:'build a button that changes the page background to a new random color every click.',tag:'css / javascript',diff:'easy'},
  {title:'Countdown Clock',desc:'make a countdown timer that counts down to a chosen date and updates every second.',tag:'javascript',diff:'medium'},
  {title:'Magic 8-Ball',desc:'create a magic 8-ball that gives a random mystical answer when the user asks a question.',tag:'javascript',diff:'easy'},
  {title:'Card Flip Memory Game',desc:'build a memory matching game where cards flip and match pairs of icons.',tag:'javascript',diff:'medium'},
  {title:'Weather Mood Board',desc:'let the user pick a weather type and change the whole page theme to match it.',tag:'css / javascript',diff:'easy'},
  {title:'Typing Speed Test',desc:'time how fast and accurately someone can type a random sentence.',tag:'javascript',diff:'medium'},
  {title:'Star Rating Widget',desc:'build a reusable five-star rating component that saves the chosen rating.',tag:'javascript',diff:'easy'},
  {title:'Car Dodge Mini-Game',desc:'make a tiny canvas game where a car dodges obstacles falling from the top.',tag:'javascript / canvas',diff:'hard'},
  {title:'Spell Name Generator',desc:'combine random magical prefixes and suffixes to generate a new spell name each click.',tag:'javascript',diff:'easy'},
  {title:'Sticky Notes Board',desc:'create a draggable sticky-notes board where notes save to local storage.',tag:'javascript',diff:'hard'},
  {title:'Live Search Filter',desc:'filter a list of items live as the user types into a search box.',tag:'javascript',diff:'easy'},
  {title:'Constellation Map',desc:'draw connected stars on a canvas that light up and show a fact when hovered.',tag:'css / javascript',diff:'medium'}
];
function loadChallenge(random=true){
  const dayIndex=Math.floor(Date.now()/86400000)%CHALLENGES.length;
  const c=random?CHALLENGES[Math.floor(Math.random()*CHALLENGES.length)]:CHALLENGES[dayIndex];
  $('#challengeTitle').textContent=c.title;
  $('#challengeDesc').textContent=c.desc;
  $('#challengeTag').textContent=c.tag;
  const diffEl=$('#challengeDiff');
  diffEl.textContent=c.diff;
  diffEl.className='challenge-diff diff-'+c.diff;
  $('#challengeIcon').textContent=c.diff==='hard'?'🔥':c.diff==='medium'?'⚡':'🎯';
}
loadChallenge(false);
$('#newChallengeBtn').addEventListener('click',()=>{loadChallenge(true);showToast('🎲 new challenge loaded');});

// ---- mini browser ----
const browserFrame=$('#browserFrame');
const browserUrl=$('#browserUrl');
function loadBrowserUrl(raw){
  if(!raw)return;
  let url=raw.trim();
  if(!/^https?:\/\//i.test(url))url='https://'+url;
  try{
    browserFrame.src=url;
    browserUrl.value=url;
    showToast('loading '+url.replace(/^https?:\/\//,''));
  }catch{showToast('could not load that address');}
}
$('#browserGoBtn').addEventListener('click',()=>loadBrowserUrl(browserUrl.value));
browserUrl.addEventListener('keydown',e=>{if(e.key==='Enter')loadBrowserUrl(browserUrl.value);});
$$('.browser-quick button').forEach(b=>b.addEventListener('click',()=>loadBrowserUrl(b.dataset.url)));
loadBrowserUrl('https://developer.mozilla.org');

// ---- color palette generator ----
const paletteStrip=$('#paletteStrip');
let currentPalette=[];
function randomHex(){
  const hue=Math.floor(Math.random()*360);
  const sat=55+Math.floor(Math.random()*30);
  const light=45+Math.floor(Math.random()*25);
  return hslToHex(hue,sat,light);
}
function hslToHex(h,s,l){
  s/=100;l/=100;
  const k=n=>(n+h/30)%12;
  const a=s*Math.min(l,1-l);
  const f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));
  const toHex=x=>Math.round(255*x).toString(16).padStart(2,'0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}
function renderPalette(){
  paletteStrip.innerHTML=currentPalette.map((hex,i)=>`<div class="swatch-col${currentPalette[i].locked?' locked':''}" style="background:${hex.color}" data-index="${i}"><button class="lock" data-lock="${i}">${hex.locked?'🔒':'🔓'}</button><span class="hex">${hex.color}</span></div>`).join('');
}
function generatePalette(){
  currentPalette=currentPalette.length?currentPalette.map(c=>c.locked?c:{color:randomHex(),locked:false}):Array.from({length:5},()=>({color:randomHex(),locked:false}));
  renderPalette();
}
generatePalette();
$('#generatePaletteBtn').addEventListener('click',()=>{generatePalette();showToast('🎨 new palette generated');});
paletteStrip.addEventListener('click',e=>{
  const lockBtn=e.target.closest('[data-lock]');
  if(lockBtn){const i=parseInt(lockBtn.dataset.lock);currentPalette[i].locked=!currentPalette[i].locked;renderPalette();return;}
  const col=e.target.closest('.swatch-col');
  if(col){const hex=currentPalette[parseInt(col.dataset.index)].color;navigator.clipboard.writeText(hex).then(()=>showToast(`copied ${hex}`)).catch(()=>showToast('copy failed'));}
});
$('#copyPaletteBtn').addEventListener('click',()=>{
  const all=currentPalette.map(c=>c.color).join(', ');
  navigator.clipboard.writeText(all).then(()=>showToast('copied full palette')).catch(()=>showToast('copy failed'));
});

// ---- device preview toggle + fullscreen + console capture ----
const previewBody=$('#previewBody');
const previewConsole=$('#previewConsole');
$$('.device-btn[data-device]').forEach(b=>b.addEventListener('click',()=>{
  $$('.device-btn[data-device]').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  previewBody.className='preview-body device-'+b.dataset.device;
}));
$('#tabPreviewBtn').addEventListener('click',()=>{
  $('#tabPreviewBtn').classList.add('active');$('#tabConsoleBtn').classList.remove('active');
  previewBody.classList.remove('hidden');previewConsole.classList.remove('active');
});
$('#tabConsoleBtn').addEventListener('click',()=>{
  $('#tabConsoleBtn').classList.add('active');$('#tabPreviewBtn').classList.remove('active');
  previewBody.classList.add('hidden');previewConsole.classList.add('active');
});
$('#fullscreenPreviewBtn').addEventListener('click',()=>{
  const card=document.querySelector('.code-preview-card');
  if(!document.fullscreenElement)card.requestFullscreen?.();
  else document.exitFullscreen?.();
});
window.addEventListener('message',e=>{
  if(!e.data||e.data.source!=='sajida-console')return;
  const line=document.createElement('div');
  line.className='console-line '+e.data.level;
  line.textContent=e.data.message;
  previewConsole.appendChild(line);
  previewConsole.scrollTop=previewConsole.scrollHeight;
});
const CONSOLE_HOOK=`<script>(function(){const post=(level,args)=>{try{parent.postMessage({source:'sajida-console',level,message:args.map(a=>typeof a==='object'?JSON.stringify(a):String(a)).join(' ')},'*');}catch(e){}};['log','warn','error'].forEach(level=>{const orig=console[level];console[level]=function(...args){post(level,args);orig.apply(console,args);};});window.addEventListener('error',e=>post('error',[e.message]));})();<\/script>`;

let focus=false;$('#focusButton').addEventListener('click',()=>{focus=!focus;document.body.classList.toggle('focus-mode',focus);showToast(focus?'focus mode on':'focus mode off');if(focus)$('#terminal').scrollIntoView({behavior:'smooth'});});
const searchOverlay=$('#searchOverlay');const globalSearch=$('#globalSearch');function openSearch(){searchOverlay.classList.add('open');searchOverlay.setAttribute('aria-hidden','false');setTimeout(()=>globalSearch.focus(),50);renderSearch('');}function closeSearch(){searchOverlay.classList.remove('open');searchOverlay.setAttribute('aria-hidden','true');}$('#searchButton').addEventListener('click',openSearch);$('#closeSearch').addEventListener('click',closeSearch);searchOverlay.addEventListener('click',e=>{if(e.target===searchOverlay)closeSearch();});globalSearch.addEventListener('input',e=>renderSearch(e.target.value));function renderSearch(q){const items=[['home','#home','hero and welcome'],['classroom','#classroom','coding areas and shortcuts'],['terminal','#terminal','live node.js terminal'],['resources','#resources','lessons and official docs'],['projects','#projects','starter ideas and notebook']].concat(resourceData.map(r=>[r.title,`#resources`,'lesson: '+r.label]));const out=$('#searchResults');const clean=q.trim().toLowerCase();out.innerHTML=items.filter(x=>!clean||(x[0]+' '+x[2]).toLowerCase().includes(clean)).slice(0,10).map(x=>`<a class="search-item" href="${x[1]}"><b>${x[0]}</b><small>${x[2]}</small></a>`).join('')||'<div class="search-item">no results found</div>';$$('.search-item',out).forEach(a=>a.addEventListener('click',closeSearch));}

$('#randomIdeaButton').addEventListener('click',()=>{const p=projectData[Math.floor(Math.random()*projectData.length)];$('#projects').scrollIntoView({behavior:'smooth'});$('#notes').innerHTML=`<div>surprise idea: <strong>${p[0]}</strong></div><div>${p[1]}</div><div>next step: </div>`;saveNotes();showToast(`try building: ${p[0]}`);});
$('#celebrateButton').addEventListener('click',()=>{document.body.classList.add('celebrate');setTimeout(()=>document.body.classList.remove('celebrate'),850);showToast('nice work — keep building ✦');});

$$('nav a').forEach(link=>link.addEventListener('click',()=>{$$('nav a').forEach(x=>x.classList.remove('active'));link.classList.add('active');}));
async function checkServer(){try{const r=await fetch('/api/status');const d=await r.json();$('#serverText').textContent='server online';$('#terminalStatus').textContent='online';$('#footerStatus').textContent=`node ${d.node} • ${d.uptime}s uptime`;$('#sessionCount').textContent='01';}catch{$('#serverText').textContent='offline';$('#terminalStatus').textContent='offline';$('#footerStatus').textContent='start npm start to connect';}}
checkServer();setInterval(checkServer,10000);
// Sparkles removed - using fairylights.png instead
