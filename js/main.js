// ============================================================
// MAGIC BOSSES — JS COMMUN (toutes les pages)
// ============================================================

var BACKEND = 'https://magic-bosses-backend-production.up.railway.app';
var photoBase64 = null;

// ── Orage animé — pluie + éclairs (canvas global) ─────────
(function () {
  var canvas = document.getElementById('orageCanvas');
  var flash  = document.getElementById('eclairFlash');
  if (!canvas || !flash) return;
  var ctx = canvas.getContext('2d');
  var mobile = window.innerWidth < 768;
  function redim() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  redim();
  window.addEventListener('resize', redim, { passive: true });
  var NB = mobile ? 120 : 280, gouttes = [];
  function nvGoutte(y) {
    return { x: Math.random()*canvas.width, y: y !== undefined ? y : Math.random()*canvas.height,
      longueur: 14+Math.random()*26, vitesse: 10+Math.random()*16, opacite: 0.18+Math.random()*0.38, angle: 0.12 };
  }
  for (var i=0;i<NB;i++) gouttes.push(nvGoutte());
  var nuages=[];
  for (var n=0;n<(mobile?3:5);n++) nuages.push({ x:Math.random()*canvas.width, y:20+Math.random()*(canvas.height*0.35), rayon:120+Math.random()*200, vitesse:0.08+Math.random()*0.15, opacite:0.06+Math.random()*0.10 });
  var eclairActif=false, eclairPts=[];
  function genEclair(x0,y0) {
    var pts=[{x:x0,y:y0}],x=x0,y=y0,max=10+Math.floor(Math.random()*8);
    for (var s=0;s<max;s++) { x+=(Math.random()-0.45)*80; y+=40+Math.random()*60; pts.push({x:x,y:y}); if(y>canvas.height*0.85)break; }
    return pts;
  }
  function flashEclair() {
    eclairActif=true; eclairPts=genEclair(canvas.width*(0.2+Math.random()*0.6),0);
    flash.style.opacity='0.06'; flash.style.transition='opacity 0s';
    setTimeout(function(){flash.style.transition='opacity 0.18s ease';flash.style.opacity='0';},60);
    setTimeout(function(){flash.style.transition='opacity 0s';flash.style.opacity='0.04';setTimeout(function(){flash.style.transition='opacity 0.25s ease';flash.style.opacity='0';},40);},120);
    setTimeout(function(){eclairActif=false;},250);
    setTimeout(flashEclair,4000+Math.random()*8000);
  }
  setTimeout(flashEclair,2000+Math.random()*3000);
  function animer() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    nuages.forEach(function(n){ var g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.rayon); g.addColorStop(0,'rgba(20,10,40,'+n.opacite+')'); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(n.x,n.y,n.rayon,0,Math.PI*2); ctx.fill(); n.x+=n.vitesse; if(n.x-n.rayon>canvas.width)n.x=-n.rayon; });
    ctx.lineWidth=1;
    gouttes.forEach(function(g){ var dx=g.longueur*Math.sin(g.angle),dy=g.longueur*Math.cos(g.angle); ctx.beginPath(); ctx.moveTo(g.x,g.y); ctx.lineTo(g.x+dx,g.y+dy); ctx.strokeStyle='rgba(174,194,224,'+g.opacite+')'; ctx.stroke(); g.x+=g.vitesse*Math.sin(g.angle); g.y+=g.vitesse; if(g.y>canvas.height+g.longueur){var ng=nvGoutte(-g.longueur);g.x=ng.x;g.y=ng.y;g.vitesse=ng.vitesse;g.opacite=ng.opacite;} });
    if(eclairActif&&eclairPts.length>1){ ctx.shadowBlur=18; ctx.shadowColor='rgba(180,150,255,0.9)'; ctx.strokeStyle='rgba(220,200,255,0.92)'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(eclairPts[0].x,eclairPts[0].y); for(var p=1;p<eclairPts.length;p++)ctx.lineTo(eclairPts[p].x,eclairPts[p].y); ctx.stroke(); if(eclairPts.length>4){var m=eclairPts[Math.floor(eclairPts.length/2)];ctx.beginPath();ctx.moveTo(m.x,m.y);ctx.lineTo(m.x+40+Math.random()*60,m.y+60+Math.random()*80);ctx.strokeStyle='rgba(200,170,255,0.55)';ctx.lineWidth=0.8;ctx.stroke();} ctx.shadowBlur=0;ctx.lineWidth=1; }
    requestAnimationFrame(animer);
  }
  animer();
})();

// ── Navbar — scroll + hamburger ───────────────────────────
var navbar    = document.getElementById('navbar');
var hamburger = document.getElementById('hamburger');
var navLiens  = document.getElementById('navLiens');
if (navbar) window.addEventListener('scroll', function() { navbar.classList.toggle('scrolle', window.scrollY > 40); });
if (hamburger && navLiens) {
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('ouvert');
    navLiens.classList.toggle('ouverte');
  });
}
function fermerMenu() {
  if (hamburger) hamburger.classList.remove('ouvert');
  if (navLiens)  navLiens.classList.remove('ouverte');
}

// ── Scroll reveal ─────────────────────────────────────────
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.rev,.rev-g,.rev-d').forEach(function(el){ el.classList.add('ok'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if(e.isIntersecting){ e.target.classList.add('ok'); obs.unobserve(e.target); } });
  }, { threshold: 0.10 });
  document.querySelectorAll('.rev,.rev-g,.rev-d').forEach(function(el){ obs.observe(el); });
})();

// ── Mascotte — rotation messages ─────────────────────────
var msgsMascotte = ['Montre-moi ta bosse !','Devis gratuit en 2 min !','Je passe près de chez toi ?'];
var idxMsg = 0;
setInterval(function() {
  var b = document.getElementById('bulleFlottante');
  if (!b) return;
  idxMsg = (idxMsg+1) % msgsMascotte.length;
  b.style.opacity = '0';
  setTimeout(function(){ b.textContent = msgsMascotte[idxMsg]; b.style.opacity = '1'; b.style.transition = 'opacity 0.3s'; }, 200);
}, 4200);
var mascotte = document.getElementById('mascotte');
if (mascotte) mascotte.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); ouvrirDevis(); } });

// ── Ouvrir / Fermer devis ────────────────────────────────
function ouvrirDevis() {
  var p = document.getElementById('devisPanel');
  var o = document.getElementById('devisOverlay');
  if (p) p.classList.add('ouvert');
  if (o) o.classList.add('ouvert');
  document.body.style.overflow = 'hidden';
}
function fermerDevis() {
  var p = document.getElementById('devisPanel');
  var o = document.getElementById('devisOverlay');
  if (p) p.classList.remove('ouvert');
  if (o) o.classList.remove('ouvert');
  document.body.style.overflow = '';
}
var devisPanel = document.getElementById('devisPanel');
if (devisPanel) {
  devisPanel.addEventListener('transitionend', function(e) {
    if (!this.classList.contains('ouvert') && e.propertyName === 'transform') {
      setTimeout(function() {
        var form = document.getElementById('devisForm');
        var succ = document.getElementById('devisSucces');
        if (form && succ) {
          form.reset(); form.style.display = 'block'; succ.style.display = 'none';
          photoBase64 = null;
          var ap = document.getElementById('photoApercu');
          if (ap) { ap.style.display='none'; ap.innerHTML=''; }
          var btn = document.getElementById('btnEnvoyer');
          if (btn) { btn.textContent='ENVOYER MON DEVIS →'; btn.disabled=false; }
          document.querySelectorAll('.dispo-creneau').forEach(function(b){ b.classList.remove('sel'); });
          var bp = document.getElementById('bullePanneau');
          if (bp) bp.textContent = 'Dis-moi tout sur ta bosse !';
        }
      }, 400);
    }
  });
}

// ── Bulles contextuelles formulaire ──────────────────────
var bullesFormulaire = {
  devisPrenom: 'Enchanté ! Je suis Maxime.',
  devisNom:    'Enchanté ! Je suis Maxime.',
  devisAdresse:'Pour vérifier si je suis dans ta zone !',
  devisCP:     'Ton code postal me permet de calculer la distance.',
  devisVille:  'Ça m\'aide à organiser mes tournées !',
  devisTel:    'Pour te rappeler avec un devis personnalisé.',
  devisType:   'Pas sûr ? La photo m\'aidera à trancher.',
  devisDesc:   'Donne-moi un maximum de détails !'
};
document.querySelectorAll('#devisForm input,#devisForm select,#devisForm textarea').forEach(function(el) {
  el.addEventListener('focus', function() {
    var m = bullesFormulaire[el.id];
    var bp = document.getElementById('bullePanneau');
    if (m && bp) bp.textContent = m;
  });
});

// ── Disponibilités ────────────────────────────────────────
(function() {
  var grille = document.getElementById('dispoGrille');
  if (!grille) return;
  var jours    = ['Lun','Mar','Mer','Jeu','Ven','Sam'];
  var creneaux = [{ txt:'Matin',sous:'8h–12h' },{ txt:'Après-midi',sous:'13h–18h' }];
  jours.forEach(function(j) {
    creneaux.forEach(function(c) {
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'dispo-creneau';
      btn.dataset.val = j + ' ' + c.txt;
      btn.innerHTML = j + '<br>' + c.sous;
      btn.addEventListener('click', function(){ btn.classList.toggle('sel'); });
      grille.appendChild(btn);
    });
  });
})();

// ── Upload photo ──────────────────────────────────────────
function compresserPhoto(fichier) {
  if (!fichier) return;
  var img = new Image(), lecteur = new FileReader();
  lecteur.onload = function(e) {
    img.onload = function() {
      var canvas = document.createElement('canvas'), MAX = 1200;
      var l = img.width, h = img.height;
      if (l>MAX||h>MAX) { if(l>h){h=Math.round(h*MAX/l);l=MAX;}else{l=Math.round(l*MAX/h);h=MAX;} }
      canvas.width=l; canvas.height=h;
      canvas.getContext('2d').drawImage(img,0,0,l,h);
      photoBase64 = canvas.toDataURL('image/jpeg',0.82);
      var ap = document.getElementById('photoApercu');
      if (ap) { ap.style.display='block'; ap.innerHTML='<img src="'+photoBase64+'" style="max-height:175px;width:100%;object-fit:cover">'; }
      var bp = document.getElementById('bullePanneau');
      if (bp) bp.textContent = 'Parfait, je vois bien la bosse !';
    };
    img.src = e.target.result;
  };
  lecteur.readAsDataURL(fichier);
}
var photoInput = document.getElementById('photoInput');
if (photoInput) photoInput.addEventListener('change', function(){ compresserPhoto(this.files[0]); });

// ── Validation inline ─────────────────────────────────────
function afficherErreur(el, msg) {
  el.style.borderColor = '#F5820A';
  var parent = el.closest('.form-champ') || el.parentElement;
  var err = parent.querySelector('.erreur-champ');
  if (!err) { err = document.createElement('span'); err.className = 'erreur-champ'; parent.appendChild(err); }
  err.textContent = msg;
}
function effacerErreur(el) {
  el.style.borderColor = '';
  var parent = el.closest('.form-champ') || el.parentElement;
  var err = parent.querySelector('.erreur-champ');
  if (err) err.remove();
}
['devisPrenom','devisNom','devisAdresse','devisCP','devisVille','devisTel','devisType'].forEach(function(id) {
  var el = document.getElementById(id);
  if (el) el.addEventListener('input', function(){ effacerErreur(el); });
});

// ── Haversine ─────────────────────────────────────────────
function haversine(lat1,lon1,lat2,lon2) {
  var R=6371,dLat=(lat2-lat1)*Math.PI/180,dLon=(lon2-lon1)*Math.PI/180;
  var a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
var LONS_LAT=46.675, LONS_LON=5.556;

// ── Sauvegarde + envoi backend ────────────────────────────
function sauvegarderDevis(devis) {
  try { var tous=JSON.parse(localStorage.getItem('magicbosses_devis')||'[]'); tous.push(devis); localStorage.setItem('magicbosses_devis',JSON.stringify(tous)); } catch(e){}
  fetch(BACKEND+'/webhook/devis',{
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      client_nom:devis.nom, client_prenom:devis.prenom, client_telephone:devis.telephone,
      adresse:devis.adresse+', '+devis.codePostal+' '+devis.ville,
      creneau:(devis.disponibilites||[]).join(', '),
      type_prestation:devis.typeBosse,
      notes:[devis.description,devis.optionRayures?'+ Rayures':'',devis.optionLustrage?'+ Lustrage':''].filter(Boolean).join(' | ')||'',
      photo_url:devis.photoBase64||null,
    }),
  }).catch(function(){});
  afficherSucces();
}
function afficherSucces() {
  var form = document.getElementById('devisForm');
  var succ = document.getElementById('devisSucces');
  if (form) form.style.display = 'none';
  if (succ) succ.style.display = 'block';
  var bp = document.getElementById('bullePanneau');
  if (bp) bp.textContent = 'Reçu ! Maxime te recontacte très vite.';
  lancerConfetti();
}
function soumettreDevis(e) {
  e.preventDefault();
  var ok = true;
  function v(id, test, msg) {
    var el = document.getElementById(id);
    if (!test(el.value)) { afficherErreur(el, msg); ok=false; } else effacerErreur(el);
  }
  v('devisPrenom', function(s){return s.trim().length>0;}, 'Prénom requis');
  v('devisNom',    function(s){return s.trim().length>0;}, 'Nom requis');
  v('devisAdresse',function(s){return s.trim().length>0;}, 'Adresse requise');
  v('devisCP',     function(s){return /^\d{5}$/.test(s.trim());}, 'Code postal invalide (5 chiffres)');
  v('devisVille',  function(s){return s.trim().length>0;}, 'Ville requise');
  v('devisTel',    function(s){return /^(\+33|0)[1-9](\s?\d{2}){4}$/.test(s.trim().replace(/\s/g,''));}, 'Numéro invalide (ex : 06 12 34 56 78)');
  v('devisType',   function(s){return s!=='';}, 'Merci de choisir un type de bosse');
  if (!photoBase64) { var bph=document.querySelector('.btn-photo'); if(bph)bph.style.borderColor='#F5820A'; ok=false; }
  var acc = document.getElementById('acceptResponsabilite');
  var ab  = document.querySelector('.accept-bloc');
  if (!acc || !acc.checked) { if(ab)ab.style.borderColor='#F5820A'; ok=false; } else if(ab) ab.style.borderColor='';
  if (!ok) { var premErreur=document.querySelector('#devisPanel .erreur-champ'); if(premErreur)premErreur.scrollIntoView({behavior:'smooth',block:'center'}); return; }
  var btnEnv = document.getElementById('btnEnvoyer');
  if (btnEnv) { btnEnv.textContent='Envoi en cours...'; btnEnv.disabled=true; }
  var bp2 = document.getElementById('bullePanneau');
  if (bp2) bp2.textContent = 'Envoi en cours...';
  var disponibilites = Array.from(document.querySelectorAll('.dispo-creneau.sel')).map(function(b){return b.dataset.val;});
  var devis = {
    id:'MB-'+Date.now(), timestamp:new Date().toISOString(),
    prenom:document.getElementById('devisPrenom').value.trim(),
    nom:document.getElementById('devisNom').value.trim(),
    adresse:document.getElementById('devisAdresse').value.trim(),
    codePostal:document.getElementById('devisCP').value.trim(),
    ville:document.getElementById('devisVille').value.trim(),
    telephone:document.getElementById('devisTel').value.trim(),
    typeBosse:document.getElementById('devisType').value,
    optionRayures:document.getElementById('optRayures').checked,
    optionLustrage:document.getElementById('optLustrage').checked,
    description:document.getElementById('devisDesc').value.trim(),
    photoBase64:photoBase64,
    disponibilites:disponibilites,
    statut:'en_attente'
  };
  var adresseFull = devis.adresse+', '+devis.codePostal+' '+devis.ville+', France';
  fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q='+encodeURIComponent(adresseFull),{headers:{'Accept-Language':'fr'}})
    .then(function(r){return r.json();})
    .then(function(res){ if(res&&res[0]){var lat=parseFloat(res[0].lat),lon=parseFloat(res[0].lon);devis.coords={lat:lat,lon:lon};devis.distanceLons=Math.round(haversine(lat,lon,LONS_LAT,LONS_LON)*10)/10;devis.zone_locale=devis.distanceLons<35;} })
    .catch(function(){}).then(function(){sauvegarderDevis(devis);});
}

// ── Confetti ──────────────────────────────────────────────
function lancerConfetti() {
  var couleurs=['#7B2FBE','#F5820A','#F5C518','#a855f7','#fb923c'];
  for (var i=0;i<60;i++) {
    (function(i){ setTimeout(function(){
      var p=document.createElement('div'); p.className='confetti';
      var c=couleurs[Math.floor(Math.random()*couleurs.length)],s=6+Math.random()*8;
      p.style.cssText='left:'+(Math.random()*100)+'vw;width:'+s+'px;height:'+s+'px;background:'+c+';border-radius:'+(Math.random()>0.5?'50%':'2px')+';animation:confettiFall '+(1.5+Math.random()*2)+'s linear forwards;animation-delay:'+(Math.random()*0.8)+'s;transform:rotate('+(Math.random()*360)+'deg);';
      document.body.appendChild(p);
      setTimeout(function(){p.remove();},4000);
    },i*30); })(i);
  }
}

// ── Admin ─────────────────────────────────────────────────
async function ouvrirAdmin() {
  function hashMdp(s){var h=0;for(var i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;}return Math.abs(h).toString(16).padStart(8,'0');}
  var CIBLE=hashMdp('Maxime39190/');
  var stocke=sessionStorage.getItem('mb_admin_auth');
  if(stocke!==CIBLE){var mdp=prompt('Mot de passe administrateur :');if(!mdp||hashMdp(mdp)!==CIBLE){alert('Mot de passe incorrect.');return;}sessionStorage.setItem('mb_admin_auth',CIBLE);}
  var panel=document.getElementById('adminPanel');
  panel.style.display='flex'; document.body.style.overflow='hidden';
  var liste=document.getElementById('adminListe');
  liste.innerHTML='<div class="admin-vide">Chargement…</div>';
  var tous=[];
  try{var res=await fetch(BACKEND+'/api/demandes');tous=await res.json();}
  catch(e){liste.innerHTML='<div class="admin-vide">Serveur inaccessible.</div>';return;}
  document.getElementById('adminStats').innerHTML=
    '<div class="admin-stat"><div class="admin-stat-val">'+tous.length+'</div><div class="admin-stat-lbl">Total</div></div>'+
    '<div class="admin-stat"><div class="admin-stat-val" style="color:var(--orange)">'+tous.filter(function(d){return d.statut==='en_attente';}).length+'</div><div class="admin-stat-lbl">En attente</div></div>'+
    '<div class="admin-stat"><div class="admin-stat-val" style="color:var(--violet)">'+tous.filter(function(d){return d.statut==='planifie'||d.statut==='acceptee';}).length+'</div><div class="admin-stat-lbl">Planifiés</div></div>'+
    '<div class="admin-stat"><div class="admin-stat-val" style="color:#4ade80">'+tous.filter(function(d){return d.statut==='termine';}).length+'</div><div class="admin-stat-lbl">Terminés</div></div>';
  if(!tous.length){liste.innerHTML='<div class="admin-vide">Aucun devis pour l\'instant.</div>';return;}
  liste.innerHTML=tous.map(function(d){
    var date=new Date(d.created_at).toLocaleString('fr-FR');
    var badge={en_attente:'<span class="badge-statut badge-attente">EN ATTENTE</span>',planifie:'<span class="badge-statut badge-planifie">PLANIFIÉ</span>',acceptee:'<span class="badge-statut badge-planifie">ACCEPTÉE</span>',termine:'<span class="badge-statut badge-termine">TERMINÉ</span>'}[d.statut]||'';
    return '<div class="devis-item"><div class="devis-item-entete"><span class="devis-item-id">#'+d.id+'</span><span class="devis-item-nom">'+d.client_prenom+' '+d.client_nom+'</span>'+badge+'<span class="devis-item-date">'+date+'</span></div><div class="devis-item-corps">📍 '+(d.adresse||'')+' &nbsp;|&nbsp; 📞 '+(d.client_telephone||'')+' &nbsp;|&nbsp; 🔧 '+(d.type_prestation||'')+(d.notes?'<br>💬 '+d.notes:'')+'</div><div class="devis-item-actions"><button class="action-btn" onclick="changerStatut('+d.id+',\'en_attente\')">En attente</button><button class="action-btn" onclick="changerStatut('+d.id+',\'planifie\')">Planifié</button><button class="action-btn" onclick="changerStatut('+d.id+',\'termine\')">Terminé</button><button class="action-btn" style="border-color:rgba(239,68,68,0.38);color:rgba(239,68,68,0.65)" onclick="supprimerDevis('+d.id+')">Supprimer</button></div></div>';
  }).join('');
}
function fermerAdmin(){ document.getElementById('adminPanel').style.display='none'; document.body.style.overflow=''; }
async function changerStatut(id,statut){ try{await fetch(BACKEND+'/api/demandes/'+id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({statut:statut})});}catch(e){alert('Erreur lors de la mise à jour.');return;} ouvrirAdmin(); }
async function supprimerDevis(id){ if(!confirm('Supprimer ce devis ? Cette action est irréversible.'))return; try{await fetch(BACKEND+'/api/demandes/'+id,{method:'DELETE'});}catch(e){alert('Erreur lors de la suppression.');return;} ouvrirAdmin(); }
function exporterJSON(){ var data=localStorage.getItem('magicbosses_devis')||'[]'; var blob=new Blob([data],{type:'application/json'}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download='magicbosses-'+new Date().toISOString().split('T')[0]+'.json'; a.click(); URL.revokeObjectURL(url); }

// ── Double-clic logo footer → admin ──────────────────────
var clicsAdmin=0,timerAdmin=null;
var logoFooter = document.getElementById('logoFooter');
if (logoFooter) {
  logoFooter.addEventListener('click', function(){
    clicsAdmin++; clearTimeout(timerAdmin);
    timerAdmin=setTimeout(function(){clicsAdmin=0;},600);
    if(clicsAdmin>=2){clicsAdmin=0;ouvrirAdmin();}
  });
}

// ── Keyboard Échap ────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var dp = document.getElementById('devisPanel');
    var ap = document.getElementById('adminPanel');
    var lb = document.getElementById('lightbox');
    if (dp && dp.classList.contains('ouvert')) fermerDevis();
    if (ap && ap.style.display==='flex') fermerAdmin();
    if (lb && lb.classList.contains('ouvert')) fermerLightbox();
  }
});

// ── Toast social proof ────────────────────────────────────
setTimeout(function() {
  var tous=JSON.parse(localStorage.getItem('magicbosses_devis')||'[]');
  var semaine=tous.filter(function(d){return new Date(d.timestamp)>new Date(Date.now()-7*24*60*60*1000);}).length;
  if(semaine>=2){
    var t=document.createElement('div');
    t.style.cssText='position:fixed;bottom:110px;left:1rem;z-index:450;background:rgba(10,8,20,0.96);border:1px solid var(--violet);border-radius:11px;padding:11px 15px;font-size:13px;max-width:220px;line-height:1.4;color:#fff;animation:apparaitre 0.4s ease;';
    t.innerHTML='🔥 <strong>'+semaine+' personnes</strong> ont demandé un devis cette semaine';
    document.body.appendChild(t);
    setTimeout(function(){t.remove();},5000);
  }
},3500);

// ── Cookies ───────────────────────────────────────────────
(function(){ if(!localStorage.getItem('cookieConsent')){ var cb=document.getElementById('cookieBanner'); if(cb)cb.style.display='flex'; } })();
function accepterCookies(){ localStorage.setItem('cookieConsent','accepted'); var cb=document.getElementById('cookieBanner'); if(cb)cb.style.display='none'; }
function refuserCookies() { localStorage.setItem('cookieConsent','refused');  var cb=document.getElementById('cookieBanner'); if(cb)cb.style.display='none'; }

// ── Lightbox (si présente dans la page) ──────────────────
var photosGalerie = [
  { src:'20260331_151838.jpg', alt:'Réalisation Magic Bosses' },
  { src:'20260331_152420.jpg', alt:'Débosselage sans peinture' },
  { src:'capture_190208.png',  alt:'Réalisation Magic Bosses' },
  { src:'capture_190156.png',  alt:'Résultat débosselage' },
  { src:'Snapchat-694287755.jpg', alt:'intervention débosselage sans peinture' },
  { src:'Snapchat-2016392202.jpg',alt:'Magic Bosses débosselage sans peinture' },
  { src:'20260305_145721.jpg', alt:'Travail de précision' },
];
var lbIdx = 0;
function ouvrirLightbox(idx) {
  lbIdx = idx;
  var lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.add('ouvert');
  afficherLbImg();
  document.body.style.overflow = 'hidden';
}
function afficherLbImg() {
  var p = photosGalerie[lbIdx];
  var lbImg = document.getElementById('lbImg');
  if (!lbImg) return;
  lbImg.innerHTML = '<div style="position:relative;display:inline-block"><img src="'+p.src+'" alt="'+p.alt+'"><span style="position:absolute;bottom:8px;right:10px;font-size:11px;color:rgba(255,255,255,0.42);text-shadow:0 1px 3px rgba(0,0,0,0.9)">'+(lbIdx+1)+' / '+photosGalerie.length+'</span></div>';
}
function fermerLightbox() {
  var lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('ouvert');
  document.body.style.overflow = '';
}
function navLb(dir) {
  lbIdx = (lbIdx+dir+photosGalerie.length) % photosGalerie.length;
  afficherLbImg();
}
var lb = document.getElementById('lightbox');
if (lb) lb.addEventListener('click', function(e){ if(e.target===this)fermerLightbox(); });
