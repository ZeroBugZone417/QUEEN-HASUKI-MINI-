<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>YouTube Downloader — Premium Neon</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
  body{margin:0; font-family:'Poppins',sans-serif; background:#07070a; color:#fff;}
  .wrap{width:94%; max-width:980px; margin:40px auto;}
  .card{background:rgba(255,255,255,0.03); border-radius:14px; padding:20px; border:1px solid rgba(255,0,76,0.12);}
  .searchRow{display:flex; gap:10px; margin-top:10px;}
  .input{flex:1; display:flex; gap:8px; align-items:center; background:rgba(255,255,255,0.02); border-radius:10px; padding:10px; border:1px solid rgba(255,0,76,0.08);}
  .input input{background:transparent; border:0; outline:0; color:#fff; width:100%;}
  .btn{background:linear-gradient(90deg,#ff0044,#8a00ff); border:0; padding:10px 14px; border-radius:10px; cursor:pointer; color:#fff; font-weight:600;}
  .results{margin-top:16px; display:flex; flex-direction:column; gap:12px;}
  .resultItem{display:flex; gap:12px; align-items:center; background:rgba(255,255,255,0.01); border-radius:10px; padding:10px; border:1px solid rgba(255,255,255,0.02);}
  .resultThumb{width:110px; height:62px; border-radius:8px; overflow:hidden; flex-shrink:0; background:#111;}
  .resultMeta{flex:1}
  .resultMeta h4{margin:0; font-size:15px;}
  .resultMeta p{margin:4px 0 0; font-size:13px; color:#bdbdbd;}
  .resultActions{display:flex; gap:8px;}
  .smallBtn{padding:8px 10px; border-radius:8px; border:0; cursor:pointer; font-weight:600; font-size:13px;}
  .smallBtn.mp3{background:linear-gradient(90deg,#00c853,#00e676); color:#030;}
  .smallBtn.mp4{background:linear-gradient(90deg,#2196f3,#7c4dff); color:#fff;}
  .log{margin-top:14px; font-family:monospace; font-size:13px; color:#bdbdbd; background:rgba(255,255,255,0.02); padding:10px; border-radius:8px;}
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <h1>YouTube Downloader — Premium</h1>
    <div class="searchRow">
      <div class="input">
        <input id="q" placeholder="Search song or paste YouTube URL..." />
      </div>
      <button class="btn" id="searchBtn">Search</button>
    </div>
    <div id="results" class="results"></div>
    <div class="log" id="log">Ready…</div>
  </div>
</div>

<script>
const resultsEl = document.getElementById('results');
const logEl = document.getElementById('log');
const qEl = document.getElementById('q');
const searchBtn = document.getElementById('searchBtn');

function log(msg, err=false){
  const time = new Date().toLocaleTimeString();
  logEl.innerText = `[${time}] ${msg}` + (err ? " ⚠️" : "");
}

async function searchYT(query){
  try {
    log('Searching...');
    const res = await fetch(`https://api-aswin-sparky.vercel.app/api/download/ytmp3?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    if(!data || !data.result) throw new Error('No results');
    return [data.result]; // return single object as array
  } catch(e){
    log('Search failed', true);
    return [];
  }
}

function renderResults(list){
  resultsEl.innerHTML = '';
  if(list.length===0){ resultsEl.innerHTML='<div style="color:#bdbdbd">No results found.</div>'; return; }
  list.forEach((it, idx)=>{
    const item = document.createElement('div');
    item.className='resultItem';
    item.innerHTML = `
      <div class="resultThumb"><img src="${it.thumbnail || ''}" style="width:100%;height:100%;object-fit:cover"/></div>
      <div class="resultMeta">
        <h4>${it.title}</h4>
        <p>${it.duration || 'N/A'} • ${it.views || 'N/A'}</p>
      </div>
      <div class="resultActions">
        <button class="smallBtn mp3" data-url="${it.video_url}">MP3</button>
        <button class="smallBtn mp4" data-url="${it.video_url}">MP4</button>
      </div>
    `;
    resultsEl.appendChild(item);
  });

  document.querySelectorAll('.smallBtn.mp3').forEach(btn=>{
    btn.onclick = async ()=>{
      try {
        log('Preparing MP3 download...');
        const res = await fetch(`https://api-aswin-sparky.vercel.app/api/download/ytmp3?query=${encodeURIComponent(btn.dataset.url)}`);
        const data = await res.json();
        const a=document.createElement('a');
        a.href = data.result.download_url;
        a.download = (data.result.title || 'song')+'.mp3';
        a.target='_blank';
        document.body.appendChild(a); a.click(); a.remove();
        log('MP3 download started.');
      } catch(e){ log('Download failed', true); alert('MP3 download failed'); }
    }
  });

  document.querySelectorAll('.smallBtn.mp4').forEach(btn=>{
    btn.onclick = async ()=>{
      try {
        log('Preparing MP4 download...');
        const res = await fetch(`https://api-aswin-sparky.vercel.app/api/download/ytmp4?url=${encodeURIComponent(btn.dataset.url)}`);
        const data = await res.json();
        const a=document.createElement('a');
        a.href = data.result.download_url;
        a.download = (data.result.title || 'video')+'.mp4';
        a.target='_blank';
        document.body.appendChild(a); a.click(); a.remove();
        log('MP4 download started.');
      } catch(e){ log('Download failed', true); alert('MP4 download failed'); }
    }
  });
}

searchBtn.addEventListener('click', async ()=>{
  const q = qEl.value.trim();
  if(!q) return log('Enter search term or YouTube URL!');
  resultsEl.innerHTML = '<div style="color:#bdbdbd">Searching…</div>';
  const list = await searchYT(q);
  renderResults(list);
});

qEl.addEventListener('keydown', (e)=>{ if(e.key==='Enter') searchBtn.click(); });
</script>
</body>
</html>
