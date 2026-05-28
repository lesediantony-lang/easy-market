import { useState, useRef, useEffect } from "react";

/* ─── THEME ─────────────────────────────────────────── */
const C = {
  bg:       "#07090F",
  surface:  "#0E1320",
  card:     "#141B2D",
  cardHover:"#1A2340",
  border:   "#1E2D45",
  accent:   "#00D4AA",
  accentDim:"#00D4AA22",
  gold:     "#F0B429",
  red:      "#F56565",
  blue:     "#4299E1",
  text:     "#EDF2F7",
  sub:      "#A0AEC0",
  muted:    "#4A5568",
  online:   "#48BB78",
};

/* ─── SEED DATA ──────────────────────────────────────── */
const CONTACTS = [
  { id: 1, name: "TechVibe HR",    avatar: "T", role: "Employer",  online: true,  last: "We'd love to schedule an interview!", time: "2m",  unread: 2 },
  { id: 2, name: "Priya S.",       avatar: "P", role: "Applicant", online: true,  last: "I've attached my updated CV.",         time: "15m", unread: 0 },
  { id: 3, name: "GrowthCo Hiring",avatar: "G", role: "Employer",  online: false, last: "Thanks for applying!",                 time: "1h",  unread: 1 },
  { id: 4, name: "Kwame O.",       avatar: "K", role: "Worker",    online: true,  last: "I can start the job tomorrow.",        time: "3h",  unread: 0 },
  { id: 5, name: "Amara D.",       avatar: "A", role: "Employer",  online: false, last: "What's your availability?",            time: "1d",  unread: 0 },
  { id: 6, name: "Nadia A.",       avatar: "N", role: "Applicant", online: false, last: "Please find my portfolio link below.", time: "2d",  unread: 0 },
];

const SEED_MESSAGES = {
  1: [
    { id: 1,  from: "them", text: "Hi Jordan! We reviewed your application for the React Developer role.",          time: "10:02 AM", read: true },
    { id: 2,  from: "them", text: "Your portfolio is impressive — especially the dashboard project.",               time: "10:03 AM", read: true },
    { id: 3,  from: "me",   text: "Thank you so much! I'm really excited about the opportunity at TechVibe.",      time: "10:15 AM", read: true },
    { id: 4,  from: "me",   text: "I'd be happy to provide any additional information you need.",                   time: "10:16 AM", read: true },
    { id: 5,  from: "them", text: "We'd love to schedule an interview! Are you free this Friday at 2 PM?",         time: "10:20 AM", read: false },
    { id: 6,  from: "them", text: "It would be a 30-minute video call with our tech lead.",                        time: "10:21 AM", read: false },
  ],
  2: [
    { id: 1, from: "me",   text: "Hi Priya, we saw your application for the Graphic Designer position.",           time: "Yesterday", read: true },
    { id: 2, from: "them", text: "Hello! Yes, I'm very interested. I have 5 years of experience with Figma.",      time: "Yesterday", read: true },
    { id: 3, from: "them", text: "I've attached my updated CV.",                                                   time: "Yesterday", read: true },
  ],
  3: [
    { id: 1, from: "them", text: "Thanks for applying to our Sales Executive opening!",                            time: "Mon", read: true },
    { id: 2, from: "me",   text: "Thank you! I'm very interested in the commission structure you mentioned.",      time: "Mon", read: true },
    { id: 3, from: "them", text: "Thanks for applying!",                                                          time: "Tue", read: false },
  ],
  4: [
    { id: 1, from: "me",   text: "Hi Kwame, I saw your bid on the house painting task. Looks good!",              time: "9:00 AM", read: true },
    { id: 2, from: "them", text: "Thank you! I have 6 years of experience and use premium Dulux paint.",          time: "9:05 AM", read: true },
    { id: 3, from: "them", text: "I can start the job tomorrow.",                                                  time: "9:06 AM", read: true },
  ],
  5: [
    { id: 1, from: "them", text: "Hello! I'm interested in hiring you for a gardening task.",                     time: "Mon", read: true },
    { id: 2, from: "them", text: "What's your availability?",                                                     time: "Mon", read: true },
  ],
  6: [
    { id: 1, from: "them", text: "Hi, I'd like to apply for the Content Writer role.",                            time: "Sun", read: true },
    { id: 2, from: "them", text: "Please find my portfolio link below.",                                          time: "Sun", read: true },
    { id: 3, from: "me",   text: "Thanks Nadia! We'll review it and get back to you.",                           time: "Sun", read: true },
  ],
};

const JOBS = [
  { id:1, title:"React Developer",   company:"TechVibe",     loc:"Remote",        pay:"P21,000-P37,000/mo", type:"Full-time",  skills:["React","Node.js","TypeScript"], posted:"2h",  urgent:true,  apps:12, contactId:1 },
  { id:2, title:"Graphic Designer",  company:"CreativeHub",  loc:"Gaborone",      pay:"P8,500-P13,000/mo",  type:"Part-time",  skills:["Figma","Photoshop"],           posted:"5h",  urgent:false, apps:7,  contactId:6 },
  { id:3, title:"Sales Executive",   company:"GrowthCo",     loc:"Francistown",   pay:"Commission+Base",    type:"Full-time",  skills:["Sales","CRM"],                 posted:"1d",  urgent:true,  apps:23, contactId:3 },
  { id:4, title:"Content Writer",    company:"MediaBlast",   loc:"Remote",        pay:"P5,500-P9,500/mo",   type:"Freelance",  skills:["SEO","Copywriting"],           posted:"3h",  urgent:false, apps:4,  contactId:5 },
  { id:5, title:"Accountant",        company:"FinEdge Ltd",  loc:"Maun",          pay:"P16,000-P21,000/mo", type:"Full-time",  skills:["QuickBooks","Excel"],          posted:"6h",  urgent:false, apps:9,  contactId:2 },
];

const LABOUR = [
  { id:1, poster:"James K.", task:"House Painting – 3 bedroom apt",          loc:"Gaborone, Block 8",    budget:"P1,300", dur:"2 days",  cat:"Painting",    urgent:true,  bids:3, contactId:4 },
  { id:2, poster:"Amara D.", task:"Garden Clearing & Landscaping",           loc:"Francistown",          budget:"P850",   dur:"1 day",   cat:"Gardening",   urgent:false, bids:5, contactId:5 },
  { id:3, poster:"Sarah M.", task:"Plumbing – Fix leaking pipes",            loc:"Maun",                 budget:"P650",   dur:"Half day",cat:"Plumbing",    urgent:true,  bids:2, contactId:2 },
  { id:4, poster:"Bongani T.",task:"Moving furniture – 2-bedroom flat",      loc:"Lobatse",              budget:"P1,600", dur:"1 day",   cat:"Moving",      urgent:false, bids:7, contactId:6 },
  { id:5, poster:"Fatima B.", task:"Electrical wiring for new extension",    loc:"Kasane",               budget:"P2,100", dur:"3 days",  cat:"Electrical",  urgent:false, bids:1, contactId:3 },
];

const COMMUNITY = [
  { id:1, user:"Nadia A.",  av:"N", role:"UX Designer",  text:"Just landed my first remote job through Easy Market! Make sure your profile has a strong headline and portfolio. 🎉", likes:47, comments:12, time:"1h" },
  { id:2, user:"Kwame O.",  av:"K", role:"Plumber",       text:"Completed 8 labour gigs this month. The bidding system is fair and clients are genuine. Changed my hustle game.", likes:33, comments:8,  time:"3h" },
  { id:3, user:"Priya S.",  av:"P", role:"HR Manager",    text:"Hired 3 people in one week. The CV system makes screening so much faster. Highly recommended for small businesses.", likes:61, comments:19, time:"5h" },
  { id:4, user:"Tunde B.",  av:"T", role:"Freelancer",    text:"Tips for first client: respond fast, be professional in your bid, offer a small intro discount. Works every time 💪", likes:89, comments:24, time:"8h" },
];

/* ─── SMALL COMPONENTS ───────────────────────────────── */
function Avatar({ letter, size = 40, color = C.accent, online }) {
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg,${color},${color}99)`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:size*0.4, color:"#000" }}>
        {letter}
      </div>
      {online !== undefined && (
        <div style={{ position:"absolute", bottom:1, right:1, width:10, height:10, borderRadius:"50%", background: online ? C.online : C.muted, border:`2px solid ${C.bg}` }} />
      )}
    </div>
  );
}

function Tag({ text, color = C.blue }) {
  return <span style={{ background:color+"22", color, border:`1px solid ${color}44`, borderRadius:6, padding:"2px 9px", fontSize:11, fontWeight:700 }}>{text}</span>;
}

function Btn({ children, onClick, variant="primary", sm, full, style={} }) {
  const base = { border:"none", borderRadius:10, cursor:"pointer", fontWeight:700, fontFamily:"inherit", transition:"opacity 0.15s", padding: sm?"7px 15px":"11px 20px", fontSize: sm?12:14, width: full?"100%":undefined };
  const v = { primary:{background:C.accent,color:"#000"}, outline:{background:"transparent",color:C.accent,border:`2px solid ${C.accent}`}, ghost:{background:C.border||"#1E2D45",color:C.text}, red:{background:C.red,color:"#fff"}, gold:{background:C.gold,color:"#000"} };
  return <button style={{...base,...(v[variant]||v.primary),...style}} onClick={onClick}>{children}</button>;
}

function Card({ children, style={} }) {
  return <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:18, ...style }}>{children}</div>;
}

/* ─── MODALS ─────────────────────────────────────────── */
function Modal({ title, onClose, children, maxW=480 }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"#000c", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:C.surface, borderRadius:20, padding:24, width:"100%", maxWidth:maxW, border:`1px solid ${C.border}`, maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <span style={{ fontSize:17, fontWeight:800, color:C.text }}>{title}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.sub, cursor:"pointer", fontSize:22 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ApplyModal({ job, onClose, openChat }) {
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const [cv, setCv] = useState("");
  const ref = useRef();
  return (
    <Modal title="📨 Apply for Position" onClose={onClose}>
      <Card style={{ marginBottom:16, background:C.bg }}>
        <div style={{ fontWeight:700, color:C.text }}>{job.title}</div>
        <div style={{ color:C.sub, fontSize:13 }}>{job.company} · {job.loc}</div>
      </Card>
      {step===1 && <>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Cover message — why are you the best fit?" rows={4}
          style={{ width:"100%", background:C.card, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:14, padding:12, fontFamily:"inherit", resize:"vertical", boxSizing:"border-box", outline:"none", marginBottom:14 }} />
        <div onClick={()=>ref.current.click()} style={{ background:C.card, border:`2px dashed ${cv?C.accent:C.border}`, borderRadius:10, padding:18, textAlign:"center", cursor:"pointer", marginBottom:16 }}>
          <div style={{ fontSize:30, marginBottom:6 }}>{cv?"✅":"📄"}</div>
          <div style={{ color:cv?C.accent:C.sub, fontSize:13, fontWeight:600 }}>{cv||"Upload CV / Resume (PDF, DOC)"}</div>
        </div>
        <input ref={ref} type="file" accept=".pdf,.doc,.docx" style={{ display:"none" }} onChange={e=>{ if(e.target.files[0]) setCv(e.target.files[0].name); }} />
        <Btn full onClick={()=>setStep(2)}>Continue →</Btn>
      </>}
      {step===2 && <>
        <Card style={{ marginBottom:16, background:C.bg }}>
          <div style={{ color:C.sub, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Review</div>
          {cv && <div style={{ color:C.accent, fontSize:13, marginBottom:8 }}>📎 {cv}</div>}
          <div style={{ color:C.text, fontSize:13, lineHeight:1.7 }}>{msg||<span style={{color:C.sub}}>No message.</span>}</div>
        </Card>
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="ghost" style={{ flex:1 }} onClick={()=>setStep(1)}>← Edit</Btn>
          <Btn variant="primary" style={{ flex:2 }} onClick={()=>setStep(3)}>📨 Submit</Btn>
        </div>
      </>}
      {step===3 && (
        <div style={{ textAlign:"center", padding:"16px 0" }}>
          <div style={{ fontSize:56, marginBottom:14 }}>🎉</div>
          <div style={{ fontSize:19, fontWeight:800, color:C.text, marginBottom:8 }}>Application Sent!</div>
          <div style={{ color:C.sub, fontSize:14, lineHeight:1.7, marginBottom:22 }}>The employer will review it shortly. You can message them directly for faster response.</div>
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <Btn variant="ghost" onClick={onClose}>Close</Btn>
            <Btn onClick={()=>{ onClose(); openChat(job.contactId); }}>💬 Message Employer</Btn>
          </div>
        </div>
      )}
    </Modal>
  );
}

function BidModal({ job, onClose, openChat }) {
  const [step, setStep] = useState(1);
  const [price, setPrice] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <Modal title="💰 Place Your Bid" onClose={onClose}>
      <Card style={{ marginBottom:16, background:C.bg }}>
        <div style={{ fontWeight:700, color:C.text }}>{job.task}</div>
        <div style={{ color:C.sub, fontSize:13 }}>{job.poster} · {job.loc}</div>
        <div style={{ color:C.accent, fontWeight:700, marginTop:4 }}>Budget: {job.budget}</div>
      </Card>
      {step===1 && <>
        <div style={{ marginBottom:14 }}>
          <label style={{ color:C.sub, fontSize:12, display:"block", marginBottom:6 }}>Your Price Offer (BWP — Botswana Pula)</label>
          <div style={{ display:"flex", alignItems:"center", background:C.card, borderRadius:10, border:`1px solid ${C.border}` }}>
            <span style={{ padding:"10px 14px", color:C.accent, fontWeight:700 }}>P</span>
            <input value={price} onChange={e=>setPrice(e.target.value)} type="number" placeholder="Enter amount in Pula"
              style={{ flex:1, background:"none", border:"none", color:C.text, fontSize:15, padding:"10px 14px", outline:"none", fontFamily:"inherit" }} />
          </div>
        </div>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Describe your experience and approach..." rows={4}
          style={{ width:"100%", background:C.card, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:14, padding:12, fontFamily:"inherit", resize:"vertical", boxSizing:"border-box", outline:"none", marginBottom:16 }} />
        <Btn full onClick={()=>setStep(2)}>Review Bid →</Btn>
      </>}
      {step===2 && <>
        <Card style={{ marginBottom:16, background:C.bg }}>
          {price && <div style={{ color:C.accent, fontWeight:800, fontSize:18, marginBottom:8 }}>Your Bid: P{price}</div>}
          <div style={{ color:C.text, fontSize:13, lineHeight:1.7 }}>{msg||<span style={{color:C.sub}}>No message.</span>}</div>
        </Card>
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="ghost" style={{ flex:1 }} onClick={()=>setStep(1)}>← Edit</Btn>
          <Btn variant="gold" style={{ flex:2 }} onClick={()=>setStep(3)}>Submit Bid 🔨</Btn>
        </div>
      </>}
      {step===3 && (
        <div style={{ textAlign:"center", padding:"16px 0" }}>
          <div style={{ fontSize:56, marginBottom:14 }}>✅</div>
          <div style={{ fontSize:19, fontWeight:800, color:C.text, marginBottom:8 }}>Bid Placed!</div>
          <div style={{ color:C.sub, fontSize:14, lineHeight:1.7, marginBottom:22 }}>The task poster will review your bid. Message them to stand out!</div>
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <Btn variant="ghost" onClick={onClose}>Close</Btn>
            <Btn onClick={()=>{ onClose(); openChat(job.contactId); }}>💬 Message Poster</Btn>
          </div>
        </div>
      )}
    </Modal>
  );
}

function PostModal({ type, onClose }) {
  const [form, setForm] = useState({});
  const [done, setDone] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const inp = { width:"100%", background:C.card, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:14, padding:"11px 14px", fontFamily:"inherit", outline:"none", boxSizing:"border-box", marginBottom:14 };
  return (
    <Modal title={type==="labour"?"🔨 Post Labour Task":"📋 Post a Job"} onClose={onClose}>
      {!done ? <>
        <input placeholder={type==="labour"?"Task title (e.g. Paint 3-bed house)":"Job title (e.g. React Developer)"} style={inp} onChange={e=>set("title",e.target.value)} />
        <input placeholder={type==="labour"?"Your name":"Company / Business name"} style={inp} onChange={e=>set("co",e.target.value)} />
        <input placeholder="Location (or Remote)" style={inp} onChange={e=>set("loc",e.target.value)} />
        <input placeholder={type==="labour"?"Budget (e.g. P1,200)":"Salary range (e.g. P16,000-P21,000/mo)"} style={inp} onChange={e=>set("pay",e.target.value)} />
        {type==="labour" && <input placeholder="Duration (e.g. 2 days)" style={inp} onChange={e=>set("dur",e.target.value)} />}
        <textarea placeholder="Description..." rows={4} style={{...inp,resize:"vertical"}} onChange={e=>set("desc",e.target.value)} />
        {type==="job" && <input placeholder="Skills needed (e.g. React, Python)" style={inp} onChange={e=>set("skills",e.target.value)} />}
        <Btn full onClick={()=>setDone(true)}>🚀 Post Now</Btn>
      </> : (
        <div style={{ textAlign:"center", padding:"16px 0" }}>
          <div style={{ fontSize:56, marginBottom:14 }}>✅</div>
          <div style={{ fontSize:19, fontWeight:800, color:C.text, marginBottom:8 }}>Posted Successfully!</div>
          <div style={{ color:C.sub, fontSize:14, marginBottom:22 }}>Your {type==="labour"?"task":"job"} is live. Applicants will reach out soon.</div>
          <Btn onClick={onClose}>Done</Btn>
        </div>
      )}
    </Modal>
  );
}

/* ─── MESSAGES SCREEN (full chat) ────────────────────── */
function MessagesScreen({ activeConvId, setActiveConvId }) {
  const [conversations, setConversations] = useState(() => {
    const map = {};
    CONTACTS.forEach(c => { map[c.id] = [...(SEED_MESSAGES[c.id]||[])]; });
    return map;
  });
  const [contacts, setContacts] = useState(CONTACTS);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const bottomRef = useRef();
  const activeContact = contacts.find(c=>c.id===activeConvId);
  const msgs = activeConvId ? (conversations[activeConvId]||[]) : [];

  useEffect(()=>{
    if(bottomRef.current) bottomRef.current.scrollIntoView({ behavior:"smooth" });
  },[msgs, activeConvId]);

  // Mark as read when opening
  useEffect(()=>{
    if(activeConvId) {
      setContacts(cs=>cs.map(c=>c.id===activeConvId?{...c,unread:0}:c));
    }
  },[activeConvId]);

  const send = () => {
    if(!input.trim()||!activeConvId) return;
    const newMsg = { id:Date.now(), from:"me", text:input.trim(), time:"now", read:true };
    setConversations(prev=>({ ...prev, [activeConvId]:[...(prev[activeConvId]||[]),newMsg] }));
    setContacts(cs=>cs.map(c=>c.id===activeConvId?{...c,last:input.trim(),time:"now"}:c));
    setInput("");
    // Simulate reply after 1.5s
    const replyTexts = ["Got it, thanks!", "Sounds good.", "I'll get back to you shortly.", "Perfect, let's proceed.", "Can we discuss further?", "Noted!"];
    setTimeout(()=>{
      const reply = { id:Date.now()+1, from:"them", text:replyTexts[Math.floor(Math.random()*replyTexts.length)], time:"now", read:true };
      setConversations(prev=>({ ...prev, [activeConvId]:[...(prev[activeConvId]||[]),reply] }));
      setContacts(cs=>cs.map(c=>c.id===activeConvId?{...c,last:reply.text,time:"now"}:c));
    },1500);
  };

  const filtered = contacts.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));
  const totalUnread = contacts.reduce((a,c)=>a+c.unread,0);

  if (activeConvId && activeContact) {
    return (
      <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 130px)" }}>
        {/* Chat header */}
        <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={()=>setActiveConvId(null)} style={{ background:"none", border:"none", color:C.sub, cursor:"pointer", fontSize:20, padding:0 }}>←</button>
          <Avatar letter={activeContact.avatar} size={40} online={activeContact.online} />
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, color:C.text, fontSize:15 }}>{activeContact.name}</div>
            <div style={{ color: activeContact.online?C.online:C.muted, fontSize:12 }}>{activeContact.online?"● Online":"● Offline"} · {activeContact.role}</div>
          </div>
          <button style={{ background:"none", border:"none", color:C.sub, cursor:"pointer", fontSize:20 }}>⋮</button>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 14px", display:"flex", flexDirection:"column", gap:10 }}>
          {msgs.map(m=>(
            <div key={m.id} style={{ display:"flex", justifyContent: m.from==="me"?"flex-end":"flex-start" }}>
              {m.from==="them" && <Avatar letter={activeContact.avatar} size={30} style={{ marginRight:8 }} />}
              <div style={{ maxWidth:"75%", background: m.from==="me"?C.accent:C.card, color: m.from==="me"?"#000":C.text, borderRadius: m.from==="me"?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"10px 14px", fontSize:14, lineHeight:1.6 }}>
                <div>{m.text}</div>
                <div style={{ fontSize:10, color: m.from==="me"?"#00000066":C.muted, marginTop:4, textAlign:"right" }}>{m.time} {m.from==="me"&&(m.read?"✓✓":"✓")}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ background:C.surface, borderTop:`1px solid ${C.border}`, padding:"10px 14px", display:"flex", gap:10, alignItems:"center" }}>
          <button style={{ background:"none", border:"none", color:C.sub, cursor:"pointer", fontSize:22 }}>📎</button>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Type a message..." style={{ flex:1, background:C.card, border:`1px solid ${C.border}`, borderRadius:24, color:C.text, fontSize:14, padding:"10px 16px", fontFamily:"inherit", outline:"none" }} />
          <button onClick={send} style={{ width:40, height:40, borderRadius:"50%", background: input.trim()?C.accent:C.muted, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, transition:"background 0.2s" }}>
            ➤
          </button>
        </div>
      </div>
    );
  }

  // Inbox list
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div>
          <span style={{ fontSize:20, fontWeight:900, color:C.text }}>Messages</span>
          {totalUnread>0 && <span style={{ background:C.red, color:"#fff", borderRadius:20, padding:"2px 9px", fontSize:11, fontWeight:700, marginLeft:8 }}>{totalUnread}</span>}
        </div>
        <button style={{ background:"none", border:"none", color:C.sub, cursor:"pointer", fontSize:22 }}>✏️</button>
      </div>

      <div style={{ display:"flex", alignItems:"center", background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"9px 14px", marginBottom:16, gap:8 }}>
        <span>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conversations..."
          style={{ flex:1, background:"none", border:"none", color:C.text, fontSize:14, outline:"none", fontFamily:"inherit" }} />
      </div>

      {filtered.map(c=>(
        <div key={c.id} onClick={()=>setActiveConvId(c.id)}
          style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 4px", borderBottom:`1px solid ${C.border}`, cursor:"pointer" }}>
          <Avatar letter={c.avatar} size={50} online={c.online} color={c.role==="Employer"?C.gold:c.role==="Worker"?C.blue:C.accent} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
              <span style={{ fontWeight:700, color:C.text, fontSize:15 }}>{c.name}</span>
              <span style={{ color:C.muted, fontSize:11 }}>{c.time}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ color:C.sub, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:200 }}>{c.last}</span>
              {c.unread>0 && <span style={{ background:C.accent, color:"#000", borderRadius:"50%", width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0 }}>{c.unread}</span>}
            </div>
            <Tag text={c.role} color={c.role==="Employer"?C.gold:c.role==="Worker"?C.blue:C.accent} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── PAGE TABS ──────────────────────────────────────── */
function HomePage({ goto, openChat }) {
  return (
    <div>
      <div style={{ background:"linear-gradient(135deg,#0d2137 0%,#091a2e 50%,#0d1f0d 100%)", borderRadius:20, padding:"32px 22px", marginBottom:22, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-50, right:-50, width:200, height:200, borderRadius:"50%", background:C.accent+"18", filter:"blur(50px)" }} />
        <div style={{ position:"relative" }}>
          <div style={{ display:"inline-block", background:C.accent+"22", border:`1px solid ${C.accent}44`, borderRadius:20, padding:"4px 14px", fontSize:12, color:C.accent, fontWeight:700, marginBottom:14 }}>
            🇧🇼 Botswana's Job Network
          </div>
          <h1 style={{ color:C.text, fontSize:27, fontWeight:900, margin:"0 0 10px", lineHeight:1.2 }}>
            Find Work.<br /><span style={{ color:C.accent }}>Hire Talent.</span><br />Get Things Done.
          </h1>
          <p style={{ color:C.sub, fontSize:13, lineHeight:1.7, marginBottom:20 }}>From tech careers to manual labour — Easy Market connects the right people, fast.</p>
          <div style={{ display:"flex", gap:10 }}>
            <Btn onClick={()=>goto("Find Jobs")}>Find Jobs →</Btn>
            <Btn variant="outline" onClick={()=>goto("Hire")}>Post a Job</Btn>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:22 }}>
        {[["12K+","Jobs"],["8K+","Workers"],["95%","Hired"]].map(([n,l])=>(
          <Card key={l} style={{ textAlign:"center", padding:14 }}>
            <div style={{ color:C.accent, fontWeight:900, fontSize:20 }}>{n}</div>
            <div style={{ color:C.muted, fontSize:11 }}>{l}</div>
          </Card>
        ))}
      </div>

      <div style={{ fontWeight:800, color:C.text, fontSize:16, marginBottom:12 }}>Browse Categories</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:22 }}>
        {[["💻","Tech & IT","2.4K jobs"],["🎨","Design","890 jobs"],["📊","Finance","1.1K jobs"],["🔧","Manual Labour","3.2K tasks"],["📝","Writing","650 jobs"],["🏥","Healthcare","780 jobs"]].map(([icon,name,count])=>(
          <div key={name} onClick={()=>goto(name.includes("Labour")?"Labour Market":"Find Jobs")}
            style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"13px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:22 }}>{icon}</span>
            <div><div style={{ color:C.text, fontWeight:700, fontSize:13 }}>{name}</div><div style={{ color:C.muted, fontSize:11 }}>{count}</div></div>
          </div>
        ))}
      </div>

      <div style={{ fontWeight:800, color:C.text, fontSize:16, marginBottom:12 }}>🔥 Hot Listings</div>
      {JOBS.slice(0,3).map(j=>(
        <div key={j.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:14, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontWeight:700, color:C.text }}>{j.title}</div>
            <div style={{ color:C.sub, fontSize:12, margin:"3px 0" }}>{j.company} · {j.loc}</div>
            <div style={{ color:C.accent, fontSize:13, fontWeight:700 }}>{j.pay}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
            {j.urgent && <Tag text="Urgent" color={C.red} />}
            <Btn sm onClick={()=>goto("Find Jobs")}>View</Btn>
          </div>
        </div>
      ))}
      <Btn variant="ghost" full style={{ marginTop:4 }} onClick={()=>goto("Find Jobs")}>View All Jobs →</Btn>
    </div>
  );
}

function FindJobsPage({ openChat }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const types = ["All","Full-time","Part-time","Freelance","Remote"];
  const list = JOBS.filter(j=>(filter==="All"||j.type===filter||(filter==="Remote"&&j.loc==="Remote"))&&(j.title.toLowerCase().includes(search.toLowerCase())||j.company.toLowerCase().includes(search.toLowerCase())));
  return (
    <div>
      {modal && <ApplyModal job={modal} onClose={()=>setModal(null)} openChat={openChat} />}
      <div style={{ fontWeight:900, color:C.text, fontSize:20, marginBottom:14 }}>💼 Find Jobs</div>
      <div style={{ display:"flex", alignItems:"center", background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"9px 14px", marginBottom:12, gap:8 }}>
        <span>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search jobs, companies..."
          style={{ flex:1, background:"none", border:"none", color:C.text, fontSize:14, outline:"none", fontFamily:"inherit" }} />
      </div>
      <div style={{ display:"flex", gap:8, overflowX:"auto", marginBottom:16, paddingBottom:4 }}>
        {types.map(t=>(
          <button key={t} onClick={()=>setFilter(t)} style={{ border:`1px solid ${filter===t?C.accent:C.border}`, background:filter===t?C.accent:"transparent", color:filter===t?"#000":C.sub, borderRadius:20, padding:"6px 15px", cursor:"pointer", whiteSpace:"nowrap", fontSize:13, fontWeight:600, fontFamily:"inherit" }}>{t}</button>
        ))}
      </div>
      {list.map(j=>(
        <Card key={j.id} style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
            <div>
              <div style={{ fontWeight:800, color:C.text, fontSize:16 }}>{j.title}</div>
              <div style={{ color:C.sub, fontSize:13 }}>{j.company}</div>
            </div>
            {j.urgent && <Tag text="🔥 Urgent" color={C.red} />}
          </div>
          <div style={{ display:"flex", gap:14, marginBottom:10, flexWrap:"wrap" }}>
            <span style={{ color:C.sub, fontSize:13 }}>📍 {j.loc}</span>
            <span style={{ color:C.accent, fontSize:13, fontWeight:700 }}>💰 {j.pay}</span>
            <span style={{ color:C.sub, fontSize:13 }}>⏰ {j.posted}</span>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
            {j.skills.map(s=><Tag key={s} text={s} />)}
            <Tag text={j.type} color={C.gold} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ color:C.muted, fontSize:12 }}>{j.apps} applicants</span>
            <div style={{ display:"flex", gap:8 }}>
              <Btn sm variant="ghost" onClick={()=>openChat(j.contactId)}>💬 Message</Btn>
              <Btn sm onClick={()=>setModal(j)}>Apply →</Btn>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function HirePage({ openChat }) {
  const [post, setPost] = useState(false);
  return (
    <div>
      {post && <PostModal type="job" onClose={()=>setPost(false)} />}
      <div style={{ fontWeight:900, color:C.text, fontSize:20, marginBottom:6 }}>🤝 Hire Talent</div>
      <div style={{ color:C.sub, fontSize:14, marginBottom:18 }}>Find the right person for your team or project.</div>
      <Btn full style={{ marginBottom:22, padding:14 }} onClick={()=>setPost(true)}>➕ Post a Job Opening</Btn>
      <div style={{ fontWeight:700, color:C.text, marginBottom:14 }}>Recent Applicants</div>
      {[{name:"Alex M.",role:"React Developer",rating:4.8,exp:"3 yrs",av:"A",cid:2},{name:"Chinwe A.",role:"Graphic Designer",rating:4.6,exp:"5 yrs",av:"C",cid:6},{name:"Sipho D.",role:"Sales Exec",rating:4.9,exp:"7 yrs",av:"S",cid:3}].map(ap=>(
        <Card key={ap.name} style={{ marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <Avatar letter={ap.av} size={44} />
            <div>
              <div style={{ fontWeight:700, color:C.text }}>{ap.name}</div>
              <div style={{ color:C.sub, fontSize:12 }}>{ap.role} · {ap.exp}</div>
              <div style={{ color:C.gold, fontSize:12 }}>⭐ {ap.rating}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn sm variant="ghost">📄 CV</Btn>
            <Btn sm onClick={()=>openChat(ap.cid)}>💬</Btn>
          </div>
        </Card>
      ))}
      <div style={{ fontWeight:700, color:C.text, margin:"22px 0 14px" }}>Why Hire on Easy Market?</div>
      {[["⚡","Fast Matching","Get applicants within hours."],["📄","CV Review","Review CVs directly in the platform."],["💬","Direct Messaging","Chat privately with every candidate."],["🔒","Secure","Safe messaging and verified profiles."]].map(([icon,t,d])=>(
        <Card key={t} style={{ marginBottom:10, display:"flex", gap:14, alignItems:"flex-start" }}>
          <span style={{ fontSize:26 }}>{icon}</span>
          <div><div style={{ fontWeight:700, color:C.text, marginBottom:3 }}>{t}</div><div style={{ color:C.sub, fontSize:13 }}>{d}</div></div>
        </Card>
      ))}
    </div>
  );
}

function LabourPage({ openChat }) {
  const [bidModal, setBidModal] = useState(null);
  const [postModal, setPostModal] = useState(false);
  const [cat, setCat] = useState("All");
  const cats = ["All","Painting","Plumbing","Electrical","Gardening","Moving","Cleaning"];
  const list = LABOUR.filter(j=>cat==="All"||j.cat===cat);
  return (
    <div>
      {postModal && <PostModal type="labour" onClose={()=>setPostModal(false)} />}
      {bidModal && <BidModal job={bidModal} onClose={()=>setBidModal(null)} openChat={openChat} />}
      <div style={{ fontWeight:900, color:C.text, fontSize:20, marginBottom:6 }}>🔨 Labour Market</div>
      <div style={{ color:C.sub, fontSize:14, marginBottom:16 }}>Post tasks or bid on manual labour gigs near you.</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
        <Btn style={{ padding:14 }} onClick={()=>setPostModal(true)}>➕ Post Task</Btn>
        <Btn variant="outline" style={{ padding:14 }}>🔍 Find Work</Btn>
      </div>
      <div style={{ display:"flex", gap:8, overflowX:"auto", marginBottom:16, paddingBottom:4 }}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{ border:`1px solid ${cat===c?C.accent:C.border}`, background:cat===c?C.accent:"transparent", color:cat===c?"#000":C.sub, borderRadius:20, padding:"6px 14px", cursor:"pointer", whiteSpace:"nowrap", fontSize:13, fontWeight:600, fontFamily:"inherit" }}>{c}</button>
        ))}
      </div>
      {list.map(j=>(
        <Card key={j.id} style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <Tag text={j.cat} />
            {j.urgent && <Tag text="⚡ Urgent" color={C.red} />}
          </div>
          <div style={{ fontWeight:800, color:C.text, fontSize:15, marginBottom:4 }}>{j.task}</div>
          <div style={{ color:C.sub, fontSize:13, marginBottom:10 }}>Posted by {j.poster}</div>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:12 }}>
            <span style={{ color:C.sub, fontSize:13 }}>📍 {j.loc}</span>
            <span style={{ color:C.accent, fontWeight:700, fontSize:14 }}>💰 {j.budget}</span>
            <span style={{ color:C.sub, fontSize:13 }}>⏰ {j.dur}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ color:C.muted, fontSize:12 }}>{j.bids} bids placed</span>
            <div style={{ display:"flex", gap:8 }}>
              <Btn sm variant="ghost" onClick={()=>openChat(j.contactId)}>💬 Message</Btn>
              <Btn sm variant="gold" onClick={()=>setBidModal(j)}>Place Bid →</Btn>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function CommunityPage() {
  const [posts, setPosts] = useState(COMMUNITY);
  const [txt, setTxt] = useState("");
  const [liked, setLiked] = useState({});
  const submit = () => {
    if(!txt.trim()) return;
    setPosts([{ id:Date.now(), user:"You", av:"Y", role:"Member", text:txt.trim(), likes:0, comments:0, time:"just now" },...posts]);
    setTxt("");
  };
  const like = (id) => {
    setLiked(l=>({...l,[id]:!l[id]}));
    setPosts(ps=>ps.map(p=>p.id===id?{...p,likes:p.likes+(liked[id]?-1:1)}:p));
  };
  return (
    <div>
      <div style={{ fontWeight:900, color:C.text, fontSize:20, marginBottom:6 }}>💬 Community</div>
      <div style={{ color:C.sub, fontSize:14, marginBottom:18 }}>Share tips, wins, and connect with workers and employers.</div>
      <Card style={{ marginBottom:18 }}>
        <textarea value={txt} onChange={e=>setTxt(e.target.value)} placeholder="Share a tip, ask a question, or celebrate a win..." rows={3}
          style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:14, padding:12, fontFamily:"inherit", resize:"none", boxSizing:"border-box", outline:"none" }} />
        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:10 }}>
          <Btn sm onClick={submit}>📨 Post</Btn>
        </div>
      </Card>
      {posts.map(p=>(
        <Card key={p.id} style={{ marginBottom:14 }}>
          <div style={{ display:"flex", gap:12, marginBottom:10 }}>
            <Avatar letter={p.av} size={42} color={C.blue} />
            <div>
              <div style={{ fontWeight:700, color:C.text }}>{p.user}</div>
              <div style={{ color:C.sub, fontSize:12 }}>{p.role} · {p.time}</div>
            </div>
          </div>
          <div style={{ color:C.text, fontSize:14, lineHeight:1.7, marginBottom:12 }}>{p.text}</div>
          <div style={{ display:"flex", gap:18 }}>
            <button onClick={()=>like(p.id)} style={{ background:"none", border:"none", color:liked[p.id]?C.red:C.muted, cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", gap:5 }}>{liked[p.id]?"❤️":"🤍"} {p.likes}</button>
            <button style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13 }}>💬 {p.comments}</button>
            <button style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13 }}>🔗 Share</button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ProfilePage() {
  const [cv, setCv] = useState("Jordan_Mwangi_CV.pdf");
  const ref = useRef();
  return (
    <div>
      <div style={{ fontWeight:900, color:C.text, fontSize:20, marginBottom:18 }}>👤 My Profile</div>
      <Card style={{ marginBottom:18, textAlign:"center" }}>
        <div style={{ width:78, height:78, borderRadius:"50%", background:`linear-gradient(135deg,${C.accent},#007a63)`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:30, color:"#000", margin:"0 auto 12px" }}>J</div>
        <div style={{ fontSize:19, fontWeight:800, color:C.text }}>Jordan Mwangi</div>
        <div style={{ color:C.sub, fontSize:13, margin:"4px 0 8px" }}>Full Stack Developer · Nairobi, Kenya</div>
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:14 }}>
          <Tag text="⭐ 4.9" color={C.gold} />
          <Tag text="✅ Verified" color={C.accent} />
        </div>
        <Btn sm>✏️ Edit Profile</Btn>
      </Card>
      <Card style={{ marginBottom:18 }}>
        <div style={{ fontWeight:700, color:C.text, marginBottom:12 }}>📄 My CV / Resume</div>
        <div style={{ background:C.bg, border:`1px solid ${C.accent}44`, borderRadius:12, padding:14, display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
          <span style={{ fontSize:30 }}>📋</span>
          <div>
            <div style={{ fontWeight:700, color:C.accent }}>{cv}</div>
            <div style={{ color:C.muted, fontSize:12 }}>Active · Used in applications</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <Btn sm variant="ghost" onClick={()=>ref.current.click()}>🔄 Replace</Btn>
          <Btn sm variant="ghost">👁️ Preview</Btn>
        </div>
        <input ref={ref} type="file" accept=".pdf,.doc,.docx" style={{ display:"none" }} onChange={e=>{ if(e.target.files[0]) setCv(e.target.files[0].name); }} />
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
        {[["14","Applications",C.blue],["3","Interviews",C.accent],["2","Offers",C.gold],["8","Saved",C.sub]].map(([n,l,col])=>(
          <Card key={l} style={{ textAlign:"center", padding:14 }}>
            <div style={{ color:col, fontWeight:900, fontSize:22 }}>{n}</div>
            <div style={{ color:C.muted, fontSize:12 }}>{l}</div>
          </Card>
        ))}
      </div>
      <Card style={{ marginBottom:18 }}>
        <div style={{ fontWeight:700, color:C.text, marginBottom:10 }}>🛠️ Skills</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {["React","Node.js","TypeScript","MongoDB","Python","Docker","AWS"].map(s=><Tag key={s} text={s} />)}
        </div>
      </Card>
      <Btn variant="red" full>🚪 Sign Out</Btn>
    </div>
  );
}

/* ─── ROOT APP ───────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState("Home");
  const [chatId, setChatId] = useState(null);

  const openChat = (contactId) => {
    setChatId(contactId);
    setTab("Messages");
  };

  const totalUnread = CONTACTS.reduce((a,c)=>a+c.unread,0);

  const NAV = [
    { name:"Home",         icon:"🏠" },
    { name:"Find Jobs",    icon:"💼" },
    { name:"Hire",         icon:"🤝" },
    { name:"Labour Market",icon:"🔨" },
    { name:"Messages",     icon:"💬", badge: totalUnread },
    { name:"Profile",      icon:"👤" },
  ];

  const renderPage = () => {
    switch(tab) {
      case "Home":         return <HomePage goto={setTab} openChat={openChat} />;
      case "Find Jobs":    return <FindJobsPage openChat={openChat} />;
      case "Hire":         return <HirePage openChat={openChat} />;
      case "Labour Market":return <LabourPage openChat={openChat} />;
      case "Messages":     return <MessagesScreen activeConvId={chatId} setActiveConvId={setChatId} />;
      case "Profile":      return <ProfilePage />;
      default:             return <HomePage goto={setTab} openChat={openChat} />;
    }
  };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:"'Segoe UI',system-ui,sans-serif", color:C.text, maxWidth:480, margin:"0 auto", paddingBottom:76, position:"relative" }}>
      {/* Top bar */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"13px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:150 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:"#000", fontSize:17 }}>E</div>
          <span style={{ fontWeight:900, fontSize:19, color:C.text }}>Easy Market</span>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={()=>{ setChatId(null); setTab("Messages"); }} style={{ background:"none", border:"none", color:C.sub, cursor:"pointer", fontSize:20, position:"relative" }}>
            💬
            {totalUnread>0 && <span style={{ position:"absolute", top:-4, right:-4, background:C.red, color:"#fff", borderRadius:"50%", width:16, height:16, fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{totalUnread}</span>}
          </button>
          <button style={{ background:"none", border:"none", color:C.sub, cursor:"pointer", fontSize:20 }}>🔔</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:"18px 14px" }}>{renderPage()}</div>

      {/* Bottom nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", zIndex:150 }}>
        {NAV.map(n=>(
          <button key={n.name} onClick={()=>{ if(n.name!=="Messages") setChatId(null); setTab(n.name); }}
            style={{ flex:1, background:"none", border:"none", padding:"9px 3px 11px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, position:"relative" }}>
            <span style={{ fontSize:18 }}>{n.icon}</span>
            <span style={{ fontSize:9, color:tab===n.name?C.accent:C.muted, fontWeight:tab===n.name?800:500, fontFamily:"inherit" }}>{n.name.split(" ")[0]}</span>
            {tab===n.name && <div style={{ width:4, height:4, borderRadius:"50%", background:C.accent }} />}
            {n.badge>0 && <div style={{ position:"absolute", top:6, right:"18%", background:C.red, borderRadius:"50%", width:14, height:14, fontSize:8, fontWeight:800, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>{n.badge}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}
