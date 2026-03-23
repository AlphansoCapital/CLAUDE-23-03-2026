function showPage(name){
  var o=document.getElementById('pageOverlay');
  document.querySelectorAll('.page-inner').forEach(function(d){d.style.display='none';});
  var pg=document.getElementById('page-'+name);
  if(pg){pg.style.display='block';}
  o.classList.add('visible');
  o.scrollTop=0;
  document.body.style.overflow='hidden';
  document.querySelectorAll('#mainJumpBar .jtab').forEach(function(b){b.classList.remove('active');});
}
function hidePage(){
  document.getElementById('pageOverlay').classList.remove('visible');
  document.body.style.overflow='';
}
document.addEventListener('keydown',function(e){if(e.key==='Escape')hidePage();});
function switchPdpImg(thumb,type){
  document.querySelectorAll('.pdp-thumb').forEach(function(t){t.classList.remove('active');});
  thumb.classList.add('active');
  var main=document.getElementById('pdpMainImg');
  var emojis={bottle:'🧴',texture:'💧',ingredient:'🌸',result:'✨'};
  var svg=main.querySelector('svg');
  if(svg) svg.style.opacity=(type==='bottle')?'1':'0.3';
  main.querySelector('svg') && (main.querySelector('svg').style.display=(type==='bottle')?'':'none');
  var existing=main.querySelector('.pdp-alt-img');
  if(existing) existing.remove();
  if(type!=='bottle'){
    var d=document.createElement('div');
    d.className='pdp-alt-img';
    d.style.cssText='font-size:90px;display:flex;align-items:center;justify-content:center;height:100%;';
    d.textContent=emojis[type]||'💧';
    main.appendChild(d);
  }
}
function selectSize(el){document.querySelectorAll('.pdp-size').forEach(function(s){s.classList.remove('active');});el.classList.add('active');}
function pdpAddToCart(btn){
  var orig=btn.innerHTML;
  btn.innerHTML='✓  Added to Bag!';
  btn.style.opacity='.7';
  var b=document.getElementById('cartBadge');
  if(b){b.textContent=parseInt(b.textContent||0)+1;}
  setTimeout(function(){btn.innerHTML=orig;btn.style.opacity='';},2000);
}
function pdpBuyNow(btn){
  btn.textContent='Redirecting…';
  btn.style.opacity='.7';
  setTimeout(function(){btn.textContent='Buy Now →';btn.style.opacity='';},1500);
}
function pdpWishlist(btn){
  if(btn.classList.contains('active')){
    btn.classList.remove('active');
    btn.textContent='♡ Save to Wishlist';
  } else {
    btn.classList.add('active');
    btn.textContent='♥ Saved to Wishlist';
  }
}
function toggleAccord(el){
  el.classList.toggle('open');
  var body=el.nextElementSibling;
  body.classList.toggle('open');
}
function recAdd(btn){
  var orig=btn.textContent;
  btn.textContent='✓ Added';
  btn.style.color='#7BC87B';
  btn.style.borderColor='rgba(120,200,120,.4)';
  var b=document.getElementById('cartBadge');
  if(b){b.textContent=parseInt(b.textContent||0)+1;}
  setTimeout(function(){btn.textContent=orig;btn.style.color='';btn.style.borderColor='';},1500);
}
function changeQty(btn,delta){
  var row=btn.closest('.cart-item');
  var n=row.querySelector('.qty-num');
  var v=Math.max(1,parseInt(n.textContent)+delta);
  n.textContent=v;
}
function removeCartItem(btn){
  var item=btn.closest('.cart-item');
  item.style.opacity='0';item.style.transition='opacity .3s';
  setTimeout(function(){item.remove();},300);
}
function applyPromo(btn){
  btn.textContent='✓';
  btn.style.color='#7BC87B';
  btn.style.borderColor='rgba(120,200,120,.4)';
}
function addToCartFromWishlist(btn){
  var orig=btn.textContent;
  btn.textContent='✓ Added!';
  btn.style.color='#7BC87B';
  btn.style.borderColor='rgba(120,200,120,.4)';
  var b=document.getElementById('cartBadge');
  if(b){b.textContent=parseInt(b.textContent||0)+1;}
  setTimeout(function(){btn.textContent=orig;btn.style.color='';btn.style.borderColor='';},1500);
}
function removeWishlist(btn){
  var card=btn.closest('.wl-card');
  card.style.opacity='0';card.style.transition='opacity .3s';
  setTimeout(function(){card.remove();},300);
}
function liveSearch(v){
  var q=v.toLowerCase();
  document.querySelectorAll('.src-card').forEach(function(c){
    c.style.display=(!q||c.dataset.name.toLowerCase().includes(q))?'':'none';
  });
}
function tagSearch(tag){
  var inp=document.getElementById('searchInput');
  if(inp){inp.value=tag;liveSearch(tag);}
}
function filterColl(btn,cat){
  document.querySelectorAll('.coll-tab').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
  document.querySelectorAll('.coll-card').forEach(function(c){
    c.style.display=(cat==='All'||c.dataset.cat===cat)?'':'none';
  });
}
function submitContact(btn){
  btn.textContent='Sending…';
  btn.disabled=true;
  setTimeout(function(){
    btn.textContent='✓ Message Sent — We\'ll reply within 24 hours';
    btn.style.background='rgba(40,130,60,.25)';
    btn.style.color='#7BC87B';
    btn.style.padding='16px 32px';
  },1400);
}
(function(){
  var t=document.getElementById('mtrack');
  ['Cruelty Free','Vegan Formulas','Sustainably Sourced','Paraben Free','Dermatologist Tested','Made in India'].concat(['Cruelty Free','Vegan Formulas','Sustainably Sourced','Paraben Free','Dermatologist Tested','Made in India']).concat(['Cruelty Free','Vegan Formulas','Sustainably Sourced','Paraben Free','Dermatologist Tested','Made in India']).concat(['Cruelty Free','Vegan Formulas','Sustainably Sourced','Paraben Free','Dermatologist Tested','Made in India']).forEach(function(tx){
    var s=document.createElement('span');s.className='marquee-item';s.innerHTML=tx+' <span style="color:#C9A96E;opacity:.4;font-size:8px;">✦</span>';t.appendChild(s);
  });
})();
function goTo(id,btn){document.getElementById(id).scrollIntoView({behavior:'smooth'});document.querySelectorAll('.jtab').forEach(function(b){b.classList.remove('active');});btn.classList.add('active');}
function setF(btn){document.querySelectorAll('.fbtn').forEach(function(b){b.classList.remove('active');});btn.classList.add('active');}
function toggleH(btn){btn.textContent=btn.textContent==='♡'?'♥':'♡';btn.style.color=btn.textContent==='♥'?'#C9A96E':'';}
(function(){
  var el=document.getElementById('timer1');
  if(!el)return;
  var t=5*3600+47*60+32;
  (function tick(){
    var h=Math.floor(t/3600),m=Math.floor((t%3600)/60),s=t%60;
    el.textContent=(h<10?'0':'')+h+':'+(m<10?'0':'')+m+':'+(s<10?'0':'')+s;
    if(t-->0)setTimeout(tick,1000);
  })();
})();
(function(){
  var o=document.getElementById('orders');
  if(!o)return;
  setInterval(function(){var v=parseInt(o.textContent.replace(/,/g,''))+Math.floor(Math.random()*3+1);o.textContent=v.toLocaleString('en-IN');},4000);
})();
(function(){
  var fills=document.querySelectorAll('.vstock-fill');
  var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){setTimeout(function(){e.target.style.width=e.target.dataset.w+'%';},200);io.unobserve(e.target);}});},{threshold:.1});
  fills.forEach(function(f){io.observe(f);});
})();
var sliderCur=0;
function slide(dir){
  var track=document.getElementById('strack');
  var cards=track.querySelectorAll('.tcard');
  var cw=cards[0]?cards[0].offsetWidth+16:336;
  var pages=Math.max(1,cards.length-2);
  sliderCur=Math.max(0,Math.min(sliderCur+dir,pages-1));
  track.style.transform='translateX(-'+(sliderCur*cw)+'px)';
  document.querySelectorAll('.sdot').forEach(function(d,i){d.classList.toggle('active',i===sliderCur);});
}
(function(){
  var dotsEl=document.getElementById('sdots');
  for(var i=0;i<3;i++){
    var d=document.createElement('div');d.className='sdot'+(i===0?' active':'');
    (function(idx){d.onclick=function(){var diff=idx-sliderCur;if(diff)slide(diff);};})(i);
    dotsEl.appendChild(d);
  }
  setInterval(function(){slide(sliderCur>=2?-sliderCur:1);},5000);
})();
function openShare(platform){
  var url=encodeURIComponent(window.location.href||'https://urbantrend.in');
  var text=encodeURIComponent('Discover Urban Trend — Bold beauty for bold lives ✨');
  var urls={
    instagram:'https://www.instagram.com/',
    whatsapp:'https://wa.me/?text='+text+'%20'+url,
    facebook:'https://www.facebook.com/sharer/sharer.php?u='+url,
    twitter:'https://twitter.com/intent/tweet?text='+text+'&url='+url,
    pinterest:'https://pinterest.com/pin/create/button/?url='+url+'&description='+text
  };
  if(urls[platform])window.open(urls[platform],'_blank','noopener,noreferrer,width=600,height=500');
}
function shareClick(platform,btn){
  var orig=btn.querySelector('.share-platform-name').textContent;
  btn.style.borderColor='rgba(201,169,110,0.6)';
  btn.style.background='rgba(201,169,110,0.1)';
  setTimeout(function(){btn.style.borderColor='';btn.style.background='';},1200);
  var tip=document.createElement('div');
  tip.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(10,9,8,.96);border:1px solid rgba(201,169,110,.4);padding:18px 32px;font-family:Cinzel,serif;font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:#C9A96E;z-index:9999;pointer-events:none;';
  tip.textContent='Opening '+platform+' share...';
  document.body.appendChild(tip);
  setTimeout(function(){document.body.removeChild(tip);},1600);
}
function pdpShare(platform){
  var productName='Street Glow Serum No. 7';
  var price='₹3,499';
  var url=encodeURIComponent('https://urbantrend.in/products/street-glow-serum');
  var text=encodeURIComponent('✨ Just found my holy grail — '+productName+' by @urbantrend.beauty is life-changing! '+price+' #UrbanTrendBeauty #GlowWithUT');
  var img=encodeURIComponent('https://urbantrend.in/products/street-glow-serum');
  var urls={
    instagram:'https://www.instagram.com/',
    whatsapp:'https://wa.me/?text='+text+'%20'+url,
    facebook:'https://www.facebook.com/sharer/sharer.php?u='+url+'&quote='+text,
    twitter:'https://twitter.com/intent/tweet?text='+text+'&url='+url,
    pinterest:'https://pinterest.com/pin/create/button/?url='+url+'&media='+img+'&description='+text
  };
  if(urls[platform])window.open(urls[platform],'_blank','noopener,noreferrer,width=600,height=520');
  var map={instagram:'.pdp-share-ig',whatsapp:'.pdp-share-wa',facebook:'.pdp-share-fb',twitter:'.pdp-share-tw',pinterest:'.pdp-share-pin'};
  var btn=document.querySelector(map[platform]);
  if(btn){btn.style.opacity='.5';setTimeout(function(){btn.style.opacity='';},600);}
}
function pdpCopyLink(btn){
  var url='https://urbantrend.in/products/street-glow-serum';
  if(navigator.clipboard){navigator.clipboard.writeText(url);}
  var orig=btn.innerHTML;
  btn.innerHTML='<span>✓ Copied!</span>';
  btn.style.color='#7BC87B';btn.style.borderColor='rgba(120,200,120,.4)';
  setTimeout(function(){btn.innerHTML=orig;btn.style.color='';btn.style.borderColor='';},2000);
}
function pdpCopyCaption(btn){
  var cap=document.getElementById('pdpCaption');
  var text=cap?cap.querySelector('.pdp-caption-text').textContent:'';
  if(navigator.clipboard&&text)navigator.clipboard.writeText(text);
  var orig=btn.textContent;
  btn.textContent='✓ Caption copied!';
  btn.style.color='#7BC87B';btn.style.borderColor='rgba(120,200,120,.4)';
  setTimeout(function(){btn.textContent=orig;btn.style.color='';btn.style.borderColor='';},2000);
}
function trackFollow(platform,btn){
  var orig=btn.textContent;
  btn.textContent='✓ Following '+platform+'!';
  btn.style.opacity='.7';
  setTimeout(function(){btn.textContent=orig;btn.style.opacity='';},2000);
}
var captions=[
  '✨ My current skincare obsession — the Street Glow Serum by Urban Trend is genuinely life-changing. Woke up with this glow and I\'m not ok 😭🔥',
  '🌿 Switched to Urban Trend 3 months ago and my skin has never looked better. The Peptide Eye Gel is EVERYTHING. Bye dark circles, hello glow ✨',
  '💛 Okay the Urban Velvet Base is the most comfortable foundation I\'ve worn. Full coverage but feels like nothing. Total game changer for Indian skin 🇮🇳',
  '🖤 Street Noir EDP is my signature scent now. Everyone asks what I\'m wearing and I just smile. @urbantrend.beauty never misses 🌹',
  '⚡ The Vitamin C Booster + Street Glow Serum combo is UNREAL. Two weeks in and my skin is brighter, smoother, and honestly just glowing nonstop.'
];
var capIdx=0;
function rotateCaption(btn){
  capIdx=(capIdx+1)%captions.length;
  var el=document.getElementById('shareCaption');
  el.style.opacity='0';
  setTimeout(function(){el.textContent=captions[capIdx];el.style.opacity='1';},200);
  el.style.transition='opacity .2s';
  btn.style.transform='rotate(360deg)';btn.style.transition='transform .5s';
  setTimeout(function(){btn.style.transform='';},600);
}
function copyCaption(){
  var text=document.getElementById('shareCaption').textContent+'\n\n';
  document.querySelectorAll('#shareHashtags .hash').forEach(function(h){text+=h.textContent+' ';});
  navigator.clipboard&&navigator.clipboard.writeText(text.trim());
  var btn=document.getElementById('copyBtn');
  var orig=document.getElementById('copyBtnText').textContent;
  btn.classList.add('copied');
  document.getElementById('copyBtnText').textContent='\u2713 Copied!';
  setTimeout(function(){btn.classList.remove('copied');document.getElementById('copyBtnText').textContent=orig;},2200);
}
var tabContent={
  story:{ caption:'✨ My current skincare obsession — the Street Glow Serum by Urban Trend is genuinely life-changing. Woke up with this glow and I\'m not ok 😭🔥', tags:['#UrbanTrendBeauty','#StreetGlowSerum','#GlowUp','#SkincareIndia','#LuxuryBeauty','#SkincareTok'] },
  post:{ caption:'Found my forever skincare brand 💛 Urban Trend\'s Street Glow Serum has completely transformed my skin in just 4 weeks. No filter, just Urban Trend ✨', tags:['#UrbanTrendBeauty','#NoFilter','#SkincareRoutine','#GlassSkın','#IndianBeauty','#SkinFirst'] },
  reel:{ caption:'POV: You tried Urban Trend\'s Street Glow Serum and now you can\'t stop showing everyone your skin 😭✨ Link in bio for the full routine.', tags:['#UrbanTrend','#SkincareTok','#GlowUp','#BeautyTok','#SkinTransformation','#IndianSkincare'] }
};
function switchTab(btn,type){
  document.querySelectorAll('.share-tab').forEach(function(t){t.classList.remove('active');});
  btn.classList.add('active');
  var c=document.getElementById('shareCaption');
  var h=document.getElementById('shareHashtags');
  c.style.opacity='0';h.style.opacity='0';
  setTimeout(function(){
    c.textContent=tabContent[type].caption;
    h.innerHTML=tabContent[type].tags.map(function(t){return'<span class="hash">'+t+'</span>';}).join('');
    c.style.opacity='1';h.style.opacity='1';
  },180);
  [c,h].forEach(function(el){el.style.transition='opacity .18s';});
}
(function(){
  var intro=document.getElementById('ut-intro');
  if(!intro)return;
  var pf=document.getElementById('introParticles');
  if(pf){
    for(var i=0;i<40;i++){
      var p=document.createElement('div');
      p.className='intro-particle';
      p.style.cssText='left:'+Math.random()*100+'%;animation-duration:'+(4+Math.random()*8)+'s;animation-delay:'+(Math.random()*4)+'s;';
      pf.appendChild(p);
    }
  }
  setTimeout(function(){closeIntro();},3000);
})();
function closeIntro(){
  var intro=document.getElementById('ut-intro');
  if(!intro||intro.classList.contains('hide'))return;
  intro.classList.add('hide');
  intro.addEventListener('animationend',function(){
    intro.style.display='none';
  },{once:true});
  setTimeout(function(){
    if(intro)intro.style.display='none';
  },1000);
  openPopup();
}
function openPopup(){
  if(localStorage.getItem('ut-popup-dismissed')){return;}
  setTimeout(function(){var o=document.getElementById('ut-popup-overlay');if(o)o.classList.add('open');},8000);
}
function closePopup(){
  var o=document.getElementById('ut-popup-overlay');if(o)o.classList.remove('open');
  localStorage.setItem('ut-popup-dismissed', Date.now());
}
function submitPopup(){
  var e=document.getElementById('popupEmail');
  if(!e||!e.value.includes('@')){if(e)e.style.borderColor='rgba(226,75,74,.6)';return;}
  e.style.borderColor='';
  var btn=document.querySelector('.popup-submit');
  if(btn){btn.textContent='\u2713 You\'re In!';btn.style.background='#2A8A4A';btn.style.color='#FAF6F0';}
  localStorage.setItem('ut-popup-dismissed', Date.now());
  console.log('Email captured:', e.value, '— connect Klaviyo/Mailchimp here');
  setTimeout(closePopup,2200);
}
/*(function(){
  var c=document.getElementById('ut-cursor');var r=document.getElementById('ut-cursor-ring');
  if(!c||!r)return;
  var mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;c.style.left=mx+'px';c.style.top=my+'px';});
  (function lerp(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;r.style.left=Math.round(rx)+'px';r.style.top=Math.round(ry)+'px';requestAnimationFrame(lerp);})();
  document.querySelectorAll('button,a,.pcard,.vcard,.ipost,.tier-card,.share-platform,.tpill').forEach(function(el){el.addEventListener('mouseenter',function(){c.classList.add('expand');r.classList.add('expand');});el.addEventListener('mouseleave',function(){c.classList.remove('expand');r.classList.remove('expand');});});
})();*/
window.addEventListener('scroll',function(){var h=document.documentElement.scrollHeight-window.innerHeight;var bar=document.getElementById('ut-progress');if(bar)bar.style.width=(window.scrollY/h*100)+'%';});
(function(){
  var awards=[{icon:'🏆',name:'Beauty Awards India 2024',year:'Best Serum'},{icon:'⭐',name:'Cosmopolitan Beauty Award',year:"Editor's Choice 2024"},{icon:'🌿',name:'Green Beauty Certified',year:'PETA Cruelty-Free'},{icon:'🔬',name:'Dermatologist Tested',year:'12 Clinical Studies'},{icon:'🥇',name:'Femina Beauty Awards',year:'Best Luxury Brand 2023'},{icon:'💎',name:'Elle Beauty Grand Prix',year:'Innovation Award'},{icon:'🌍',name:'Sustainable Beauty Global',year:'Net Zero Pledge 2030'},{icon:'✦',name:'Vogue India Beauty Awards',year:'Best Indian Brand'},{icon:'🏅',name:"Harper's Bazaar Beauty",year:'Breakthrough Brand 2023'}];
  var track=document.getElementById('awardsTrack');
  if(!track)return;
  [...awards,...awards].forEach(function(a){var d=document.createElement('div');d.className='award-item';d.innerHTML='<span class="award-icon">'+a.icon+'</span><div class="award-text"><span class="award-name">'+a.name+'</span><span class="award-year">'+a.year+'</span></div>';track.appendChild(d);});
})();
(function(){
  var slider=document.getElementById('baSlider');var clip=document.getElementById('baClip');var divider=document.getElementById('baDivider');
  if(!slider)return;
  var dragging=false;
  function setPos(x){var rect=slider.getBoundingClientRect();var pct=Math.max(5,Math.min(95,(x-rect.left)/rect.width*100));clip.style.width=pct+'%';divider.style.left=pct+'%';}
  slider.addEventListener('mousedown',function(e){dragging=true;setPos(e.clientX);});
  document.addEventListener('mousemove',function(e){if(dragging)setPos(e.clientX);});
  document.addEventListener('mouseup',function(){dragging=false;});
  slider.addEventListener('touchstart',function(e){dragging=true;setPos(e.touches[0].clientX);},{passive:true});
  slider.addEventListener('touchmove',function(e){if(dragging)setPos(e.touches[0].clientX);},{passive:true});
  slider.addEventListener('touchend',function(){dragging=false;});
})();
var baData={serum:{s1:'94%',l1:'Brighter skin',s2:'87%',l2:'Even skin tone',s3:'91%',l3:'Reduced dark spots',s4:'4.9★',l4:'Customer rating'},eye:{s1:'88%',l1:'Reduced puffiness',s2:'82%',l2:'Dark circle reduction',s3:'95%',l3:'Smoother eye area',s4:'4.8★',l4:'Customer rating'},base:{s1:'97%',l1:'Full coverage',s2:'92%',l2:'12-hour wear',s3:'89%',l3:'Skin-blur effect',s4:'4.9★',l4:'Customer rating'}};
function baSwitch(btn,type){document.querySelectorAll('.ba-tab').forEach(function(t){t.classList.remove('active');});btn.classList.add('active');var d=baData[type];['1','2','3','4'].forEach(function(n){var s=document.getElementById('baStat'+n);var l=document.getElementById('baStatL'+n);if(s)s.textContent=d['s'+n];if(l)l.textContent=d['l'+n];});}
function joinTier(btn,tier){
  var orig=btn.textContent;
  btn.textContent='\u2713 Joined '+tier+'!';
  btn.style.background='rgba(40,130,60,.25)';btn.style.color='#7BC87B';btn.style.borderColor='rgba(40,130,60,.5)';
  localStorage.setItem('ut-loyalty-tier', tier);
  console.log('Loyalty tier joined:', tier, '— connect Smile.io SDK here');
  setTimeout(function(){btn.textContent=orig;btn.style.background='';btn.style.color='';btn.style.borderColor='';},2500);
}
(function(){
  var nums=document.querySelectorAll('.sustain-num[data-target]');
  var done=false;
  var obs=new IntersectionObserver(function(entries){if(done)return;entries.forEach(function(e){if(e.isIntersecting){done=true;obs.disconnect();nums.forEach(function(el){var target=parseInt(el.dataset.target);var dur=2000,start=null;(function tick(ts){if(!start)start=ts;var p=Math.min((ts-start)/dur,1);var ease=1-Math.pow(1-p,3);var val=Math.round(ease*target);el.textContent=val>=1000?val.toLocaleString('en-IN'):val;if(p<1)requestAnimationFrame(tick);else el.textContent=target>=1000?target.toLocaleString('en-IN'):target;})(performance.now());});}});},{threshold:.3});
  var sustain=document.getElementById('sustainability');if(sustain)obs.observe(sustain);
})();
(function(){
  var obs=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target);}});},{threshold:.08});
  document.querySelectorAll('.reveal').forEach(function(el){obs.observe(el);});
})();
(function(){
  if(localStorage.getItem('ut-cookie-consent')) return;
  setTimeout(function(){
    var b=document.getElementById('cookieBanner');
    if(b) b.style.transform='translateY(0)';
  },1800);
})();
function cookieAccept(){
  localStorage.setItem('ut-cookie-consent','all');
  var b=document.getElementById('cookieBanner');
  if(b){b.style.transform='translateY(100%)';setTimeout(function(){b.style.display='none';},500);}
  showToast('Preferences saved ✓','success');
}
function cookieDecline(){
  localStorage.setItem('ut-cookie-consent','essential');
  var b=document.getElementById('cookieBanner');
  if(b){b.style.transform='translateY(100%)';setTimeout(function(){b.style.display='none';},500);}
}
function cookieManage(){
  showToast('Cookie preferences panel coming soon','info');
}
function showCookiePolicy(){
  showToast('Cookie policy: we use analytics and personalisation cookies only','info');
}
window.addEventListener('scroll',function(){
  var btn=document.getElementById('backToTop');
  if(!btn) return;
  if(window.scrollY>400){btn.style.opacity='1';btn.style.pointerEvents='auto';}
  else{btn.style.opacity='0';btn.style.pointerEvents='none';}
},{passive:true});
function showToast(msg,type){
  var c=document.getElementById('toastContainer');
  if(!c) return;
  var t=document.createElement('div');
  var colors={success:'rgba(40,130,60,0.95)',error:'rgba(180,40,40,0.95)',info:'rgba(10,9,8,0.97)'};
  var borders={success:'rgba(120,200,120,0.5)',error:'rgba(226,75,74,0.5)',info:'rgba(201,169,110,0.4)'};
  t.style.cssText='background:'+colors[type||'info']+';border:1px solid '+borders[type||'info']+';padding:12px 20px;font-family:Cinzel,serif;font-size:8px;letter-spacing:0.28em;text-transform:uppercase;color:#FAF6F0;pointer-events:auto;opacity:0;transform:translateX(20px);transition:all 0.35s cubic-bezier(0.22,1,0.36,1);backdrop-filter:blur(12px);min-width:220px;cursor:pointer;';
  t.textContent=msg;
  t.onclick=function(){dismissToast(t);};
  c.appendChild(t);
  requestAnimationFrame(function(){t.style.opacity='1';t.style.transform='translateX(0)';});
  setTimeout(function(){dismissToast(t);},3800);
}
function dismissToast(t){
  t.style.opacity='0';t.style.transform='translateX(20px)';
  setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t);},350);
}
(function(){
  var atc=document.getElementById('stickyATC');
  var overlay=document.getElementById('pageOverlay');
  if(!atc||!overlay) return;
  function checkAtc(){
    var pdp=document.getElementById('page-pdp');
    var pdpVisible=overlay.classList.contains('visible')&&pdp&&pdp.style.display!=='none';
    atc.style.bottom=(pdpVisible&&overlay.scrollTop>320)?'0':'-80px';
  }
  overlay.addEventListener('scroll',checkAtc,{passive:true});
  var origShow=window.showPage;
  window.showPage=function(n){if(origShow)origShow(n);setTimeout(checkAtc,50);};
  var origHide=window.hidePage;
  window.hidePage=function(){if(origHide)origHide();atc.style.bottom='-80px';};
})();
function openSizeGuide(){
  var m=document.getElementById('sizeGuideModal');
  if(m){m.style.display='flex';document.body.style.overflow='hidden';}
}
function closeSizeGuide(){
  var m=document.getElementById('sizeGuideModal');
  if(m){m.style.display='none';document.body.style.overflow='';}
}
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    closeSizeGuide();
    hidePage();
    closeMobileNav();
  }
});
var pincodeData={'400001':{city:'Mumbai',days:1,express:true},'400050':{city:'Bandra, Mumbai',days:1,express:true},'110001':{city:'New Delhi',days:2,express:true},'560001':{city:'Bengaluru',days:2,express:true},'600001':{city:'Chennai',days:3,express:false},'700001':{city:'Kolkata',days:3,express:false}};
function checkPincode(){
  var inp=document.getElementById('pincodeInput');
  var res=document.getElementById('pincodeResult');
  if(!inp||!res) return;
  var val=inp.value.trim();
  if(val.length!==6){res.style.display='block';res.innerHTML='<span style="color:rgba(226,75,74,0.8);">Please enter a valid 6-digit PIN code.</span>';return;}
  var data=pincodeData[val];
  res.style.display='block';
  if(data){
    var badge=data.days===1?'<span style="background:rgba(40,130,60,0.2);color:#7BC87B;border:1px solid rgba(120,200,120,0.3);padding:2px 8px;font-family:Cinzel,serif;font-size:6px;letter-spacing:0.28em;text-transform:uppercase;margin-left:8px;">Same / Next Day</span>':'';
    res.innerHTML='<span style="color:#7BC87B;">✓ Delivery available to '+data.city+'</span><br>'+(data.days===1?'Expected tomorrow':'Expected in '+data.days+' days')+badge+(data.express?'<br><span style="color:rgba(201,169,110,0.6);">Express delivery available</span>':'');
  } else {
    res.innerHTML='<span style="color:#C9A96E;">✓ Delivery available — expected in 4–6 days.</span>';
  }
}
document.addEventListener('DOMContentLoaded',function(){
  var inp=document.getElementById('pincodeInput');
  if(inp) inp.addEventListener('keydown',function(e){if(e.key==='Enter')checkPincode();});
});
var giftWrapEnabled=false;
function toggleGiftWrap(row){
  giftWrapEnabled=!giftWrapEnabled;
  var check=document.getElementById('giftWrapCheck');
  if(check) check.textContent=giftWrapEnabled?'✓':'';
  row.style.borderColor=giftWrapEnabled?'rgba(201,169,110,0.4)':'rgba(201,169,110,0.12)';
  row.style.background=giftWrapEnabled?'rgba(201,169,110,0.06)':'';
  showToast(giftWrapEnabled?'🎁 Gift wrapping added — ₹149':'Gift wrapping removed',giftWrapEnabled?'success':'info');
}
function trackOrder(){
  var inp=document.getElementById('trackingInput');
  var res=document.getElementById('trackingResult');
  if(!inp||!res) return;
  var val=inp.value.trim();
  if(!val){inp.style.borderColor='rgba(226,75,74,0.5)';return;}
  inp.style.borderColor='';
  var btn=inp.nextElementSibling;
  if(btn){btn.textContent='Tracking…';btn.disabled=true;}
  setTimeout(function(){
    res.style.display='block';
    res.style.opacity='0';
    setTimeout(function(){res.style.transition='opacity 0.5s';res.style.opacity='1';},50);
    if(btn){btn.textContent='Track →';btn.disabled=false;}
    res.scrollIntoView({behavior:'smooth',block:'start'});
    document.querySelectorAll('#revBars .rev-bar-fill').forEach(function(f){
      setTimeout(function(){f.style.width=f.dataset.w+'%';},300);
    });
  },1200);
}
function subscribeNewsletter(){
  var inp=document.getElementById('nlEmailInput');
  if(!inp) return;
  var v=inp.value.trim();
  if(!v||!v.includes('@')){inp.style.borderColor='rgba(226,75,74,0.5)';inp.focus();return;}
  inp.style.borderColor='';
  inp.value='';
  inp.placeholder='You\'re on the Glow List! ✓';
  inp.style.color='#7BC87B';
  inp.style.borderColor='rgba(120,200,120,0.4)';
  showToast('✓ Welcome to the Glow List!','success');
  localStorage.setItem('ut-newsletter','1');
  setTimeout(function(){inp.placeholder='your@email.com';inp.style.color='';inp.style.borderColor='';},3000);
}
(function(){
  var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){document.querySelectorAll('#revBars .rev-bar-fill').forEach(function(f){f.style.width=f.dataset.w+'%';});obs.disconnect();}});},{threshold:0.3});
  var revSection=document.querySelector('.pdp-reviews');
  if(revSection) obs.observe(revSection);
})();
function filterRevs(btn,type){
  document.querySelectorAll('.rev-filter-btn').forEach(function(b){b.style.background='none';b.style.borderColor='rgba(201,169,110,0.15)';b.style.color='rgba(201,169,110,0.5)';});
  btn.style.background='rgba(201,169,110,0.08)';btn.style.borderColor='rgba(201,169,110,0.35)';btn.style.color='#C9A96E';
  document.querySelectorAll('.review-card').forEach(function(c){
    if(type==='all') c.style.display='';
    else if(type==='5') c.style.display=c.dataset.stars==='5'?'':'none';
    else if(type==='photos') c.style.display=c.dataset.photos==='true'?'':'none';
  });
}
function loadMoreReviews(btn){
  btn.textContent='Loading…';
  setTimeout(function(){
    btn.textContent='All reviews shown';
    btn.disabled=true;
    btn.style.opacity='0.4';
    showToast('All 2,847 reviews loaded','info');
  },1000);
}
function openWriteReview(){
  showToast('Review form coming soon — connect Okendo or Judge.me SDK','info');
}
function openMobileNav(){
  document.getElementById('mobileNav').classList.add('open');
  document.getElementById('mobileNavOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeMobileNav(){
  document.getElementById('mobileNav').classList.remove('open');
  document.getElementById('mobileNavOverlay').classList.remove('open');
  document.body.style.overflow='';
}
var products = {
  'Street Glow Serum No. 7': { cat:'Skincare', sub:'30ml · Brightening', price:'₹ 3,499', desc:'Himalayan Rose and Vitamin C complex for radiant Indian skin. Reduces dark spots, evens skin tone, and delivers a glass-skin glow in 4 weeks.', benefits:['Reduces dark spots in 2 weeks','Himalayan Rose extract','SPF booster formula','Dermatologist tested'] },
  'Kashmir Saffron Mask': { cat:'Skincare', sub:'75ml · Radiance mask', price:'₹ 2,799', desc:'Pure Kashmiri saffron infused clay mask. Deep cleanses pores while delivering intense hydration and a natural golden glow.', benefits:['Pure Kashmiri saffron','Deep pore cleansing','15 min express glow','Suitable all skin types'] },
  'Urban Velvet Base': { cat:'Makeup', sub:'30ml · Full coverage', price:'₹ 1,899', desc:'Velvety smooth foundation crafted for Indian skin tones. 18-hour wear, transfer-proof formula with SPF 20 protection.', benefits:['18-hour long wear','SPF 20 protection','12 Indian skin shades','Sweat & transfer proof'] },
  'Street Noir EDP': { cat:'Fragrance', sub:'50ml · Oud & Amber', price:'₹ 4,999', desc:'A bold oriental fragrance inspired by the streets of Old Delhi. Notes of oud, amber, saffron, and sandalwood.', benefits:['12+ hour lasting','Oud & Amber base','Inspired by Old Delhi','Luxury glass bottle'] },
  'Peptide Eye Gel': { cat:'Skincare', sub:'15ml · De-puffing', price:'₹ 2,299', desc:'Advanced peptide complex targets dark circles, puffiness, and fine lines. Cool-touch applicator for instant relief.', benefits:['Reduces puffiness instantly','Triple peptide complex','Cool-touch applicator','Fragrance free'] },
  'Urban Glow Powder': { cat:'Makeup', sub:'8g · Buildable radiance', price:'₹ 1,499', desc:'Weightless illuminating powder with real pearl extract. Buildable from subtle sheen to full glow.', benefits:['Real pearl extract','Buildable radiance','Suits all skin tones','Weightless formula'] },
  'Himalayan Rose Toner': { cat:'Skincare', sub:'150ml · Balancing', price:'₹ 1,299', desc:'Alcohol-free toner with Himalayan rose water. Balances pH, tightens pores, and preps skin for serums.', benefits:['Alcohol-free formula','Himalayan rose water','pH balancing','Suitable for sensitive skin'] },
  'Saffron Hair Oil': { cat:'Hair', sub:'100ml · Strengthening', price:'₹ 1,299', desc:'Luxurious hair oil with pure saffron, coconut, and argan. Reduces breakage, adds shine, and promotes growth.', benefits:['Pure Kashmiri saffron','Reduces hair fall','Overnight repair mask','Suitable all hair types'] },
};
let currentQty = 1;
function openPD(name) {
  const p = products[name] || { cat:'Beauty', sub:'Premium formula', price:'₹ 1,999', desc:'Premium Urban Trend formula crafted for Indian skin. Dermatologist tested and approved.', benefits:['Dermatologist tested','Made for Indian skin','Cruelty free','Premium ingredients'] };
  document.getElementById('pdCat').textContent = p.cat;
  document.getElementById('pdName').textContent = name;
  document.getElementById('pdSub').textContent = p.sub;
  document.getElementById('pdPrice').textContent = p.price;
  document.getElementById('pdDesc').textContent = p.desc;
  document.getElementById('pdBenefits').innerHTML = p.benefits.map(b => `<div style="display:flex;align-items:center;gap:8px;"><span style="color:#C9A96E;font-size:12px;">✓</span><span style="font-family:Jost,sans-serif;font-size:12px;color:rgba(250,246,240,0.75);">${b}</span></div>`).join('');
  document.getElementById('pdImg').innerHTML = `<div style="text-align:center;"><div style="width:180px;height:220px;background:linear-gradient(145deg,#2A1A0E,#1A1008);border:1px solid rgba(201,169,110,0.2);display:flex;align-items:center;justify-content:center;margin:0 auto;"><span style="font-family:Cinzel,serif;font-size:13px;color:#C9A96E;letter-spacing:0.2em;text-transform:uppercase;text-align:center;padding:20px;">${name}</span></div><p style="font-family:Cinzel,serif;font-size:8px;color:rgba(201,169,110,0.5);letter-spacing:0.3em;margin-top:16px;text-transform:uppercase;">Urban Trend</p></div>`;
  currentQty = 1;
  document.getElementById('pdQty').textContent = 1;
  document.getElementById('pdModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function closePD() {
  document.getElementById('pdModal').style.display = 'none';
  document.body.style.overflow = '';
}
function changeQty(d) {
  currentQty = Math.max(1, currentQty + d);
  document.getElementById('pdQty').textContent = currentQty;
}
function addToCartPD() {
  const name = document.getElementById('pdName').textContent;
  closePD();
  if(typeof addToCart === 'function') addToCart(name);
}
document.getElementById('pdModal').addEventListener('click', function(e) {
  if(e.target === this) closePD();
});
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.pcard').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function(e) {
      if(e.target.classList.contains('heart') || e.target.classList.contains('pcard-overlay-btn')) return;
      const name = this.querySelector('.pcard-name');
      if(name) openPD(name.textContent.trim());
    });
    const btn = card.querySelector('.pcard-overlay-btn');
    if(btn) {
      btn.textContent = 'View Details';
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const name = card.querySelector('.pcard-name');
        if(name) openPD(name.textContent.trim());
      });
    }
  });
});