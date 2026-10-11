'use strict';

/*
 * TAPA’UL HABDIN — PUBLIC CONTENT
 * Sumber: CV yang diberikan + halaman jurnal yang ditautkan.
 * Karya berstatus draft atau dari diskusi pribadi diberi label eksplisit.
 * Untuk menerbitkan perubahan secara global, ubah array di berkas ini lalu unggah ulang.
 */
const SETTINGS = {
  contactEmail: '', // Tambahkan email profesional pemilik sebelum website dipublikasikan, misalnya 'alamat@domain.id'.
  ownerName: 'Tapa’ul Habdin, Lc., MA',
  localStorageKey: 'th-portfolio-local-v1',
  youtubeChannel: 'https://www.youtube.com/@MajelisNurillah'
};

const publications = [
  {
    id:'journal-2026', year:'2026', group:'jurnal',
    title:'Kitab Suci Al-Qur’an-Hadis: Refrensi Resepsi, Performasi dan Aktualisasi Budaya Masyarakat Sosio-Kultural Indonesia',
    authors:'M. Riyan Hidayat, Aghnia Faradits, Retno Yuliati, Tapaul Habdin, Amilin Agustin',
    journal:'At-Tahfidz · Vol. 7 No. 2 (2026) · hlm. 190–201',
    tags:['Living Qur’an & Hadis','Sosio-kultural'],
    doi:'10.53649/vp42dy67',
    url:'https://e-journal.uqi.ac.id/index.php/attahfidz/article/view/2122'
  },
  {
    id:'journal-2025', year:'2025', group:'jurnal',
    title:'Epistemologi Pendekatan Historis Angelika Neuwirth dan Fazlur Rahman',
    authors:'Rida Sopiah Wardah & Tapaul Habdin',
    journal:'At-Tahfidz · Vol. 6 No. 2 (2025) · hlm. 146–160',
    tags:['Epistemologi','Tafsir kontemporer'],
    doi:'10.53649/at-tahfidz.v6i2.1129',
    url:'https://e-journal.uqi.ac.id/index.php/attahfidz/article/view/1129'
  },
  {
    id:'service-2025', year:'2025', group:'pengabdian',
    title:'Penguatan Karakter Anti-Bullying Era Society 5.0: Studi pada Siswa SMAN 01 Indralaya',
    authors:'Mustafiyanti, Zaimuddin, Tapa’ul Habdin, Zaenal Abidin, Muhammad Muttaqin, Zainuddin',
    journal:'Eastasouth Journal of Effective Community Services · Vol. 3 No. 3 (2025)',
    tags:['Pengabdian masyarakat','Pendidikan karakter'],
    doi:'10.58812/ejecs.v3i03.330',
    url:'https://ejcs.eastasouth-institute.com/index.php/ejecs/article/view/330'
  },
  {
    id:'journal-2020', year:'2020', group:'jurnal',
    title:'Faktor-Faktor Kebinasaan Umat Terdahulu dalam Al-Qur’an',
    authors:'Tapaul Habdin',
    journal:'At-Tahfidz · Edisi Vol. 1 No. 2 (2020) · hlm. 72–91',
    tags:['Tafsir tematik','Kisah Al-Qur’an'],
    doi:'10.53649/at-tahfidz.v1i02.435',
    url:'https://e-journal.uqi.ac.id/index.php/attahfidz/article/view/435'
  },
  {
    id:'journal-2019', year:'2019', group:'jurnal',
    title:'Kabilah Arab dan Dialeknya: Studi Dialek dalam Al-Qur’an',
    authors:'Tapaul Habdin',
    journal:'At-Tahfidz · Edisi Vol. 1 No. 1 (2019) · hlm. 81–98',
    tags:['Bahasa Arab','Dialektologi Qur’ani'],
    doi:'10.53649/at-tahfidz.v1i01.429',
    url:'https://e-journal.uqi.ac.id/index.php/attahfidz/article/view/429'
  }
];

const defaultPortfolio = [
  {id:'p1',title:'Kumpulan Shalawat Hidayah Nur',year:'2025',category:'Buku & Shalawat',status:'Tercantum di CV',description:'Karya buku shalawat yang tercantum dalam curriculum vitae tahun 2025. Naskah lengkap dan identitas penerbit belum dilampirkan untuk perpustakaan digital.',url:'',symbol:'۞'},
  {id:'p3',title:'التفاؤل ببركة خير الرسل ﷺ',year:'Dalam pengembangan',category:'Buku & Shalawat',status:'Naskah pengembangan',description:'Proyek syair madah Nabi berbahasa Arab yang sedang disusun dan disempurnakan. Teks final belum dipublikasikan pada website ini.',url:'',symbol:'✦'},
  {id:'p4',title:'Majelis Dzikir Shalawat Nurillah',year:'Komunitas',category:'Pengabdian',status:'Aktivitas komunitas',description:'Pembinaan majelis zikir, shalawat, dan kajian keagamaan sebagai ruang belajar dan kebersamaan masyarakat.',url:'',symbol:'✺'},
  {id:'p5',title:'Rumah Tahfizh Aqwamu Qila',year:'Komunitas',category:'Pengabdian',status:'Pembinaan Al-Qur’an',description:'Kegiatan dan ruang pembinaan tahfizh Al-Qur’an di lingkungan Indralaya; dokumentasi lengkap dapat ditambahkan.',url:'',symbol:'❁'},
  {id:'p6',title:'Materi Ilmu Al-Qur’an & Tafsir',year:'Akademik',category:'Materi Kajian',status:'Arsip pengajaran',description:'Pengembangan bahan perkuliahan dan perangkat pembelajaran bidang Al-Qur’an, tafsir, dan ilmu-ilmu pendukungnya.',url:'',symbol:'✧'}
];

/* Video yang ditambahkan manual tetap dapat ditampilkan sebagai cadangan.
 * Video terbaru otomatis diambil dari data/shalawat-videos.json (dihasilkan
 * GitHub Actions dan RSS resmi YouTube; tidak memerlukan API key di browser).
 */
const featuredVideos = [];
let syncedVideos = [];
let videosLastSignature = null;
let videosFeedUpdatedAt = null;


const sectionIndex = [
  {title:'Tentang Tapa’ul Habdin',subtitle:'Profil, pendidikan, afiliasi',url:'#profil',keywords:'biografi tentang profil dosen al azhar iiq uqi'},
  {title:'Keahlian & Riset',subtitle:'Ilmu Al-Qur’an, tafsir sufi, maqāṣid',url:'#keahlian',keywords:'keahlian riset penelitian metodologi'},
  {title:'Publikasi Akademik',subtitle:'Artikel jurnal dan pengabdian',url:'#publikasi',keywords:'jurnal artikel ilmiah doi publikasi'},
  {title:'Perpustakaan Karya',subtitle:'Buku, syair, materi pembelajaran',url:'#portofolio',keywords:'portofolio buku shalawat karya madah'},
  {title:'Riwayat Pendidikan & Organisasi',subtitle:'Al-Azhar, IIQ, UQI, MUI, LPTQ',url:'#perjalanan',keywords:'pendidikan karier organisasi mui lptq'},
  {title:'Pengabdian Masyarakat',subtitle:'Majelis Nurillah, Aqwamu Qila, anti-bullying',url:'#pengabdian',keywords:'pengabdian majelis tahfizh bullying'},
  {title:'YouTube Majelis Nurillah',subtitle:'Kajian, shalawat, video dan siaran langsung',url:'#video',keywords:'youtube majelis nurillah channel kanal video live shorts kajian shalawat'},
  {title:'Kanal @MajelisNurillah',subtitle:'Buka kanal YouTube',url:'https://www.youtube.com/@MajelisNurillah',keywords:'youtube subscribe channel kanal resmi video rekaman'},
  {title:'Kontak & Kolaborasi',subtitle:'Undangan, riset, kerja sama',url:'#kontak',keywords:'hubungi email nomor kontak jadwal undangan'}
];

function el(name, className, text) { const node=document.createElement(name); if(className) node.className=className; if(text!==undefined) node.textContent=String(text); return node; }
function makeLink(href,label,className,external=false){ const a=el('a',className,label); a.href=href;if(external){a.target='_blank';a.rel='noopener noreferrer';}return a; }
function cleanUrl(v){ try{const u=new URL(v);return ['https:','http:'].includes(u.protocol)?u.toString():'';}catch{return '';}}
function filterText(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,'').replace(/\s+/g,' ').trim();}
function safeReadPortfolio(){try{const parsed=JSON.parse(localStorage.getItem(SETTINGS.localStorageKey)||'[]');return Array.isArray(parsed)?parsed.filter(x=>x&&typeof x.title==='string'&&typeof x.description==='string').slice(0,100).map(x=>({id:String(x.id||Date.now()),title:x.title.slice(0,180),year:String(x.year||'—').slice(0,20),category:String(x.category||'Lainnya').slice(0,50),status:String(x.status||'Arsip').slice(0,70),description:x.description.slice(0,500),url:cleanUrl(x.url||''),symbol:'✧',local:true})):[];}catch{return [];}}
let addedPortfolio=safeReadPortfolio();
function allPortfolio(){return [...defaultPortfolio,...addedPortfolio];}


function parseYouTubeVideoId(raw) {
  try {
    const u = new URL(raw);
    const hostname=u.hostname.toLowerCase();let id='';
    if(hostname==='youtu.be'||hostname==='www.youtu.be') id=u.pathname.slice(1).split('/')[0];
    else if(['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(hostname)) {
      if(u.pathname==='/watch')id=u.searchParams.get('v')||'';
      else if(u.pathname.startsWith('/shorts/')||u.pathname.startsWith('/live/')||u.pathname.startsWith('/embed/'))id=u.pathname.split('/')[2]||'';
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : '';
  }catch{return '';}
}
function niceVideoDate(raw){
  if(!raw)return '';
  const date=new Date(raw);
  if(!Number.isFinite(date.getTime()))return '';
  return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Jakarta'}).format(date);
}
function setVideoFeedStatus(message){
  const target=document.getElementById('videoFeedStatus');
  if(target)target.textContent=message;
}
function renderFeaturedVideos(){
  const target=document.getElementById('featuredVideos');if(!target)return;target.replaceChildren();
  const all=[...syncedVideos,...featuredVideos].filter(v=>v&&parseYouTubeVideoId(v.url||''));
  const seen=new Set();
  const videos=all.filter(v=>{const id=parseYouTubeVideoId(v.url);if(seen.has(id))return false;seen.add(id);return true;}).slice(0,6);
  if(!videos.length){
    const empty=el('div','video-empty');
    const left=el('div','video-empty-mark','▶');
    const content=el('div');
    content.append(el('strong','','Menunggu video shalawat terbaru'),el('p','','Saat belum ada hasil sinkronisasi, video tetap dapat ditonton dari kanal resmi. Sistem menampilkan unggahan shalawat berdasarkan judul video yang cocok di RSS YouTube.'));
    empty.append(left,content,makeLink(SETTINGS.youtubeChannel+'/videos','Lihat video di YouTube ↗','text-link',true));target.append(empty);return;
  }
  for(const item of videos){
    const id=parseYouTubeVideoId(item.url);const card=el('article','video-card');const frame=el('div','video-frame');
    const cover=el('button','video-poster');cover.type='button';cover.setAttribute('aria-label','Putar video: '+item.title);cover.style.backgroundImage=`linear-gradient(#082b2b22,#082b2b99),url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`;
    cover.append(el('span','video-play-symbol','▶'));cover.addEventListener('click',()=>{
      const iframe=el('iframe','video-iframe');iframe.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1';iframe.title='Video YouTube: '+item.title;iframe.loading='lazy';iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';frame.replaceChildren(iframe);
    });frame.append(cover);card.append(frame);
    const text=el('div','video-card-content');
    const date=niceVideoDate(item.published_at);
    if(date)text.append(el('div','video-pub-date','DIPUBLIKASIKAN · '+date));
    text.append(el('h4','',item.title||'Video shalawat Majelis Nurillah'));
    text.append(el('p','','Video dari kanal YouTube Majelis Nurillah. Putar langsung atau buka sumber aslinya di YouTube.'));
    text.append(makeLink(item.url,'Tonton di YouTube ↗','video-external',true));card.append(text);target.append(card);
  }
}
async function loadAutoVideos(){
  // CORS YouTube tidak diperlukan: browser hanya memuat JSON dari domain website.
  try{
    const response=await fetch('data/shalawat-videos.json',{cache:'no-store'});
    if(!response.ok)throw new Error('HTTP '+response.status);
    const result=await response.json();
    if(result?.schema!=='majelis-nurillah-youtube-v1'||!Array.isArray(result.videos))throw new Error('Format data tidak dikenali');
    const parsed=result.videos.filter(v=>v&&typeof v.title==='string'&&typeof v.url==='string'&&parseYouTubeVideoId(v.url)&&typeof v.published_at==='string').slice(0,24);
    const signature=JSON.stringify([result.updated_at||'',parsed.map(x=>x.id)]);
    if(signature!==videosLastSignature){
      videosLastSignature=signature;
      syncedVideos=parsed;
      videosFeedUpdatedAt=result.updated_at||null;
      renderFeaturedVideos();
    }
    if(videosFeedUpdatedAt){
      const last=niceVideoDate(videosFeedUpdatedAt);
      setVideoFeedStatus((syncedVideos.length?'Tersinkron otomatis':'Belum ada judul shalawat terdeteksi')+' · Diperiksa '+last+' · Pembaruan terjadwal setiap 6 jam');
    }else{
      setVideoFeedStatus('Menunggu sinkronisasi pertama dari GitHub Actions · Lihat petunjuk pemasangan');
    }
  }catch(error){
    setVideoFeedStatus('Data YouTube belum tersedia di hosting. Anda tetap dapat menonton langsung di kanal resmi.');
  }
}

function renderPublications(){
  const target=document.getElementById('publicationList');if(!target)return;
  const active=document.querySelector('[data-pub-filter].active')?.dataset.pubFilter||'semua';
  const term=filterText(document.getElementById('pubSearch')?.value||'');
  const matches=publications.filter(x=>(active==='semua'||x.group===active)&&filterText([x.title,x.authors,x.journal,...x.tags,x.year].join(' ')).includes(term));
  target.replaceChildren();document.getElementById('allCount').textContent=String(publications.length).padStart(2,'0');
  if(!matches.length){target.append(el('p','empty-state','Tidak ada publikasi yang cocok dengan pencarian.'));return;}
  for(const item of matches){
    const article=el('article','publication-item');
    article.append(el('div','publication-year',item.year));
    const body=el('div','publication-main');body.append(el('h3','',item.title),el('p','',item.authors),el('p','',item.journal));
    const tags=el('div','pub-tags');for(const t of item.tags)tags.append(el('span','pub-tag',t));body.append(tags);article.append(body);
    const link=makeLink(item.url,'Lihat jurnal  ↗','pub-link',true);link.title='Lihat artikel terverifikasi di situs jurnal';article.append(link);target.append(article);
  }
}
function renderPortfolio(){
  const target=document.getElementById('portfolioGrid');target.replaceChildren();
  for(const [i,item] of allPortfolio().entries()){
    const card=el('article','portfolio-card');
    const index=el('div','portfolio-index');index.append(el('span','',String(i+1).padStart(2,'0')+' / '+item.category.toUpperCase()),el('span','portfolio-badge',item.status));
    card.append(index,el('div','portfolio-art',item.symbol||'✧'),el('h3','',item.title),el('p','',item.description));
    const foot=el('div','portfolio-foot');foot.append(el('span','',item.year));
    if(cleanUrl(item.url))foot.append(makeLink(item.url,'Lihat karya ↗','',true));
    else foot.append(el('span','',item.local?'Entri lokal':'Arsip / dokumentasi'));
    card.append(foot);target.append(card);
  }
}
function renderStudioList(){
  const target=document.getElementById('studioList');target.replaceChildren();
  if(!addedPortfolio.length){target.append(el('p','studio-message','Belum ada entri tambahan di browser ini.'));return;}
  for(const item of addedPortfolio){const row=el('div','studio-row');const desc=el('div');desc.append(el('strong','',item.title),el('small','',item.category+' · '+item.year));row.append(desc);const remove=el('button','','Hapus');remove.type='button';remove.setAttribute('aria-label','Hapus '+item.title);remove.addEventListener('click',()=>{addedPortfolio=addedPortfolio.filter(x=>x.id!==item.id);savePortfolio();});row.append(remove);target.append(row);}
}
function savePortfolio(){try{localStorage.setItem(SETTINGS.localStorageKey,JSON.stringify(addedPortfolio));}catch{document.getElementById('studioMessage').textContent='Penyimpanan browser penuh atau tidak tersedia. Gunakan ekspor JSON.';}renderStudioList();renderPortfolio();}

let lastFocused=null;
function lockBackground(open){document.body.classList.toggle('locked',open);}
function openAssistant(){lastFocused=document.activeElement;document.getElementById('assistantBackdrop').hidden=false;const drawer=document.getElementById('assistantDrawer');drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');lockBackground(true);setTimeout(()=>document.getElementById('assistantInput').focus(),100);}
function closeAssistant(){document.getElementById('assistantBackdrop').hidden=true;const drawer=document.getElementById('assistantDrawer');drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');lockBackground(false);lastFocused?.focus?.();}
function showModal(id,focus){lastFocused=document.activeElement;document.getElementById(id).hidden=false;lockBackground(true);setTimeout(()=>document.getElementById(focus)?.focus(),50);}
function hideModal(id){document.getElementById(id).hidden=true;lockBackground(false);lastFocused?.focus?.();}
function assistantReply(message){
  const q=filterText(message);
  if(/(assalam|salam|halo|hai|selamat)/.test(q))return {text:'Wa’alaikumussalam. Selamat datang. Saya dapat membantu menemukan publikasi, pendidikan, penelitian, pengabdian, dan cara menyiapkan pesan kolaborasi.',links:[['Jelajahi profil','#profil']]};
  if(/(youtube|kanal|channel|video|shorts|siaran|live|shalawat terbaru|sholawat terbaru)/.test(q))return {text:'Video shalawat dari kanal @MajelisNurillah ditampilkan otomatis setelah sinkronisasi terjadwal website diaktifkan. Daftar dipilih dari judul unggahan yang berkaitan dengan shalawat dan diperbarui setiap enam jam melalui RSS resmi YouTube.'+(syncedVideos.length?' Saat ini tersedia '+syncedVideos.length+' video terpilih dalam arsip website.':''),links:[['Lihat video shalawat','#video'],['Buka kanal YouTube',SETTINGS.youtubeChannel]]};
  if(/(publikasi|jurnal|artikel|doi|karya ilmiah)/.test(q))return {text:'Ada '+publications.length+' publikasi yang berhasil ditelusuri. Yang terbaru adalah artikel bersama tentang resepsi, performasi, dan aktualisasi budaya Al-Qur’an–Hadis pada tahun 2026. Tersedia pula publikasi epistemologi tafsir historis (2025), pengabdian anti-bullying (2025), dan dua tulisan sebelumnya dalam At-Tahfidz.',links:[['Lihat semua publikasi','#publikasi'],['Buka artikel terbaru',publications[0].url]]};
  if(/(pendidikan|kuliah|al azhar|al-azhar|iiq|gelar|sarjana|master|s2|s3|doktor)/.test(q))return {text:'Pendidikan S1 ditempuh di Universitas Al-Azhar Kairo (2000–2005) bidang Tafsir dan Ilmu-ilmu Al-Qur’an, S2 di IIQ Jakarta (2013–2015) bidang Ulumul Qur’an dan Ulumul Hadits, serta sejak 2024 menjalani S3 Ilmu Al-Qur’an dan Tafsir di IIQ Jakarta. Data berdasarkan CV.',links:[['Lihat linimasa pendidikan','#perjalanan']]};
  if(/(riset|disertasi|penelitian|studi doktoral)/.test(q))return {text:'Beliau sedang menempuh studi doktoral Ilmu Al-Qur’an dan Tafsir di IIQ Jakarta. Rincian penelitian yang masih berlangsung tidak ditampilkan secara publik pada website ini.',links:[['Lihat bidang keahlian','#keahlian']]};
  if(/(mengajar|dosen|uqi|kampus|universitas|madrasah|sekolah)/.test(q))return {text:'Berdasarkan CV, beliau mengajar di Madrasah Aliyah Al-Ittifaqiah sejak 2015 dan menjadi dosen tetap Program Studi Ilmu Al-Qur’an dan Tafsir, Fakultas Ushuluddin UQI Indralaya sejak 2016.',links:[['Lihat pengalaman','#perjalanan']]};
  if(/(majelis|nurillah|hidayah nur|shalawat|aqwamu|tahfizh|tahfiz|zikir|dzikir)/.test(q))return {text:'Kegiatan pengabdian meliputi Majelis Dzikir Shalawat Nurillah dan pembinaan melalui Rumah Tahfizh Aqwamu Qila. CV menyebut buku “Kumpulan Shalawat Hidayah Nur” (2025). Kanal YouTube @MajelisNurillah juga terhubung dari website ini.',links:[['Lihat pengabdian','#pengabdian'],['Kanal YouTube',SETTINGS.youtubeChannel],['Lihat arsip karya','#portofolio']]};
  if(/(organisasi|mui|lptq|fatwa|koordinator|amanah)/.test(q))return {text:'Dalam CV tercatat amanah Sekretaris Komisi Fatwa MUI Ogan Ilir periode 2021–2026 dan Koordinator Bidang Pencarian Bakat, Pembinaan dan Pelatihan LPTQ Ogan Ilir periode 2025–2030.',links:[['Lihat linimasa','#perjalanan']]};
  if(/(kontak|hubung|email|nomor|whatsapp|jadwal|undang|narasumber|kolaborasi|bertemu)/.test(q))return {text:SETTINGS.contactEmail?'Anda dapat menyiapkan pesan kolaborasi melalui formulir kontak di halaman ini. Pengiriman akan menggunakan aplikasi email Anda.':'Silakan buka formulir kontak untuk menyiapkan pesan. Karena alamat email resmi belum diberikan, formulir saat ini menyalin isi pesan, bukan mengirimkannya atau menjanjikan jadwal pertemuan.',links:[['Buka formulir kontak','#kontak']]};
  if(/(siapa|biografi|profil|tapaul|tapa ul|tentang|asal)/.test(q))return {text:'Tapa’ul Habdin, Lc., MA adalah akademisi Al-Qur’an dan Tafsir berbasis di Indralaya, Ogan Ilir, Sumatera Selatan. Ia menekuni pendidikan, penelitian tafsir, penulisan, dan pengabdian melalui lembaga serta komunitas keagamaan.',links:[['Baca profil','#profil']]};
  const relevant=[...publications.map(p=>({title:p.title,url:p.url})),...allPortfolio().map(p=>({title:p.title,url:p.url||'#portofolio'}))].filter(p=>q.length>3&&filterText(p.title).split(' ').some(w=>w.length>4&&q.includes(w))).slice(0,2);
  if(relevant.length)return {text:'Saya menemukan karya yang mungkin berkaitan dengan pertanyaan Anda. Silakan periksa informasi lengkapnya melalui tautan berikut.',links:relevant.map(p=>[p.title,p.url])};
  return {text:'Maaf, informasi itu belum tersedia di basis pengetahuan website ini. Saya dapat menjawab pertanyaan tentang profil, pendidikan, publikasi, riset, karya, organisasi, atau pengabdian. Untuk hal di luar itu, gunakan formulir kontak.',links:[['Lihat publikasi','#publikasi'],['Kontak','#kontak']]};
}
function appendMessage(text,from){const container=document.getElementById('assistantMessages');const div=el('div','assistant-message '+from);if(from==='bot')div.append(el('span','msg-author','ASISTEN PROFIL'));div.append(el('p','',text));container.append(div);container.scrollTop=container.scrollHeight;return div;}
function submitAssistant(text){if(!text.trim())return;appendMessage(text,'user');const answer=assistantReply(text);const div=appendMessage(answer.text,'bot');for(const [label,url] of answer.links||[]){const a=makeLink(url,'↗ '+label,'',url.startsWith('http'));a.style.display='block';a.style.marginTop='7px';a.addEventListener('click',()=>{if(url.startsWith('#'))closeAssistant();});div.append(a);}document.getElementById('assistantInput').value='';}
function renderGlobalSearch(query){const target=document.getElementById('globalSearchResults');target.replaceChildren();const q=filterText(query);const items=[...sectionIndex.map(x=>({...x,kind:'HALAMAN'})),...publications.map(x=>({title:x.title,subtitle:x.journal,url:x.url,kind:'JURNAL',keywords:x.authors+' '+x.tags.join(' ')})),...allPortfolio().map(x=>({title:x.title,subtitle:x.category+' · '+x.status,url:x.url||'#portofolio',kind:'KARYA',keywords:x.description}))];const filtered=q?items.filter(x=>filterText([x.title,x.subtitle,x.keywords||''].join(' ')).includes(q)):items.slice(0,6);if(!filtered.length){target.append(el('p','empty-state','Tidak ditemukan. Coba istilah lain.'));return;}for(const x of filtered.slice(0,13)){const row=el('div','global-result');const info=el('div');info.append(el('strong','',x.title),el('small','',x.kind+' · '+x.subtitle));const link=makeLink(x.url,'Buka ↗','',x.url.startsWith('http'));link.addEventListener('click',()=>hideModal('searchModal'));row.append(info,link);target.append(row);}}
function copyText(str){if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(str);return new Promise((resolve,reject)=>{const ta=document.createElement('textarea');ta.value=str;ta.style.cssText='position:fixed;left:-9999px';document.body.append(ta);ta.select();const success=document.execCommand('copy');ta.remove();success?resolve():reject(new Error('Copy unsupported'));});}
function localExport(){const data={schema:'tapaul-habdin-portfolio-v1',exported:new Date().toISOString(),items:addedPortfolio};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='koleksi-karya-tapaul-habdin.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);document.getElementById('studioMessage').textContent='Koleksi lokal berhasil diekspor menjadi JSON.';}
function init(){
  document.getElementById('currentYear').textContent=String(new Date().getFullYear());
  renderPublications();renderPortfolio();renderStudioList();renderFeaturedVideos();loadAutoVideos();setInterval(loadAutoVideos,10*60*1000);
  for(const chip of document.querySelectorAll('[data-pub-filter]'))chip.addEventListener('click',()=>{document.querySelectorAll('[data-pub-filter]').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-pressed','false');});chip.classList.add('active');chip.setAttribute('aria-pressed','true');renderPublications();});
  document.getElementById('pubSearch').addEventListener('input',renderPublications);
  document.querySelectorAll('[data-open-assistant]').forEach(x=>x.addEventListener('click',openAssistant));document.getElementById('closeAssistant').addEventListener('click',closeAssistant);document.getElementById('assistantBackdrop').addEventListener('click',closeAssistant);
  document.getElementById('assistantForm').addEventListener('submit',e=>{e.preventDefault();submitAssistant(document.getElementById('assistantInput').value);});document.querySelectorAll('[data-question]').forEach(x=>x.addEventListener('click',()=>submitAssistant(x.dataset.question)));
  document.getElementById('openSearch').addEventListener('click',()=>{renderGlobalSearch('');showModal('searchModal','globalSearchInput');});document.getElementById('globalSearchInput').addEventListener('input',e=>renderGlobalSearch(e.target.value));document.querySelectorAll('[data-close-search]').forEach(x=>x.addEventListener('click',()=>hideModal('searchModal')));
  document.getElementById('openStudio').addEventListener('click',()=>showModal('studioModal','studioTitle'));document.getElementById('footerStudio').addEventListener('click',()=>showModal('studioModal','studioTitle'));document.getElementById('closeStudio').addEventListener('click',()=>hideModal('studioModal'));
  for(const id of ['searchModal','studioModal'])document.getElementById(id).addEventListener('click',e=>{if(e.target.id===id)hideModal(id);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!document.getElementById('searchModal').hidden)hideModal('searchModal');else if(!document.getElementById('studioModal').hidden)hideModal('studioModal');else if(document.getElementById('assistantDrawer').classList.contains('open'))closeAssistant();}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();renderGlobalSearch('');showModal('searchModal','globalSearchInput');}});
  const toggle=document.getElementById('menuToggle'),mobile=document.getElementById('mobileNav');toggle.addEventListener('click',()=>{mobile.hidden=!mobile.hidden;toggle.setAttribute('aria-expanded',String(!mobile.hidden));});mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.hidden=true;toggle.setAttribute('aria-expanded','false');}));
  window.addEventListener('scroll',()=>{const denom=document.documentElement.scrollHeight-window.innerHeight;document.getElementById('readingLine').style.transform='scaleX('+(denom>0?Math.min(1,window.scrollY/denom):0)+')';},{passive:true});
  document.getElementById('contactForm').addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(e.currentTarget);const subject='Permintaan '+f.get('purpose')+' — Website Tapa’ul Habdin';const message='Kepada Tapa’ul Habdin, Lc., MA\n\nNama: '+f.get('name')+'\nEmail: '+f.get('email')+'\nKeperluan: '+f.get('purpose')+'\n\n'+f.get('message');const feedback=document.getElementById('contactFeedback');if(SETTINGS.contactEmail){window.location.href='mailto:'+SETTINGS.contactEmail+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(message);feedback.textContent='Aplikasi email akan dibuka. Periksa dan tekan Kirim di aplikasi email Anda.';}else{try{await copyText(subject+'\n\n'+message);feedback.textContent='Pesan berhasil disalin ke clipboard. Belum terkirim karena alamat kontak resmi belum diatur.';}catch{feedback.textContent='Clipboard tidak tersedia. Salin teks formulir secara manual untuk mengirimkannya.';}}});
  document.getElementById('studioForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);if(addedPortfolio.length>=100){document.getElementById('studioMessage').textContent='Maksimal 100 entri lokal.';return;}addedPortfolio.unshift({id:'local-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),title:String(f.get('title')).trim(),year:String(f.get('year')).trim()||'—',category:String(f.get('category')),status:String(f.get('status')),description:String(f.get('description')).trim(),url:cleanUrl(String(f.get('url')||'')),symbol:'✧',local:true});savePortfolio();e.currentTarget.reset();document.getElementById('studioMessage').textContent='Karya ditambahkan secara lokal. Ekspor JSON sebelum berpindah perangkat.';});
  document.getElementById('exportData').addEventListener('click',localExport);
  document.getElementById('importData').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>500000)throw Error('Ukuran terlalu besar (maksimal 500 KB).');const data=JSON.parse(await file.text());if(data?.schema!=='tapaul-habdin-portfolio-v1'||!Array.isArray(data.items))throw Error('Format JSON tidak dikenali.');const fresh=[];for(const row of data.items.slice(0,100)){if(typeof row.title!=='string'||typeof row.description!=='string')continue;fresh.push({id:'import-'+fresh.length+'-'+Date.now(),title:row.title.slice(0,180),year:String(row.year||'—').slice(0,20),category:String(row.category||'Lainnya').slice(0,50),status:String(row.status||'Arsip').slice(0,70),description:row.description.slice(0,500),url:cleanUrl(row.url||''),symbol:'✧',local:true});}addedPortfolio=fresh;savePortfolio();document.getElementById('studioMessage').textContent='Koleksi lokal berhasil diimpor: '+fresh.length+' entri.';}catch(err){document.getElementById('studioMessage').textContent='Impor gagal: '+err.message;}e.target.value='';});
  document.getElementById('resetData').addEventListener('click',()=>{if(!confirm('Hapus semua tambahan lokal? Entri bawaan tidak akan dihapus.'))return;addedPortfolio=[];savePortfolio();document.getElementById('studioMessage').textContent='Perubahan lokal telah direset.';});
}
document.addEventListener('DOMContentLoaded',init);
