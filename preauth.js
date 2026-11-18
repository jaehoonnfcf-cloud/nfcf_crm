// 메뉴 이동 시 로그인 화면이 깜빡이는 현상 방지.
// 같은 탭에서 이미 로그인·승인된 경우(sessionStorage), 인증 확인이 끝나기 전에도 앱 화면을 먼저 보여준다.
// 확인 결과 로그인이 필요하면 각 화면의 기존 코드가 #app 을 숨기고 로그인 화면을 보여주며, 이때 캐시를 지운다.
(function(){
  var KEY = 'nfcf_auth', cache = null;
  try { cache = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) {}
  var root = document.documentElement;
  if (cache) root.classList.add('pre-auth');
  function clear(){ try { sessionStorage.removeItem(KEY); } catch (e) {} root.classList.remove('pre-auth'); }
  document.addEventListener('DOMContentLoaded', function(){
    var app = document.getElementById('app'), login = document.getElementById('loginScreen');
    if (!app) return;
    var email = document.getElementById('userEmail'), adminLinks = document.querySelectorAll('#navAssignLink, #navAdminLink');
    if (cache){
      if (email && cache.n) email.textContent = cache.n;
      if (cache.a) adminLinks.forEach(function(a){ a.style.display = ''; });   // 관리자 메뉴가 뒤늦게 튀어나오지 않도록
    }
    function save(){
      if (!/block/.test(app.getAttribute('style') || '')) return;
      var admin = !!document.querySelector('#navAdminLink') && document.getElementById('navAdminLink').style.display !== 'none';
      try { sessionStorage.setItem(KEY, JSON.stringify({ n: email ? email.textContent : '', a: admin })); } catch (e) {}
    }
    new MutationObserver(function(){
      var s = app.getAttribute('style') || '';
      if (/display:\s*none/.test(s)) clear(); else save();
    }).observe(app, { attributes: true, attributeFilter: ['style'] });
    if (login) new MutationObserver(function(){
      if (/display:\s*flex/.test(login.getAttribute('style') || '')) clear();   // 로그인 화면이 실제로 필요해졌을 때
    }).observe(login, { attributes: true, attributeFilter: ['style'] });
    var watch = document.querySelectorAll('#userEmail, #navAdminLink');
    watch.forEach(function(el){ new MutationObserver(save).observe(el, { attributes: true, childList: true, characterData: true, subtree: true }); });
  });
})();

// ---------- 화면 공통 셸: 상단 바(검색·프로필) + 메뉴 그룹 라벨 ----------
document.addEventListener('DOMContentLoaded', function(){
  var app = document.getElementById('app'); if (!app) return;
  var header = app.querySelector(':scope > header'), box = header && header.querySelector('.user-box');
  if (!header || !header.querySelector('.brand') || !box) return;   // 고객 상세처럼 .brand 가 없는 화면은 제외
  var main = app.querySelector(':scope > main');
  var email = document.getElementById('userEmail'), adminLink = document.getElementById('navAdminLink');

  // 관리 메뉴(배정관리·관리자)는 맨 아래 그룹으로 모은다
  var so = document.getElementById('signOutBtn'), asg = document.getElementById('navAssignLink');
  if (so && so.parentNode === box){ if (asg) box.insertBefore(asg, so); if (adminLink) box.insertBefore(adminLink, so); }
  // 메뉴 그룹 라벨
  [['home.html', '내 고객'], ['index.html', null], ['vip.html', '수신 · 실적'], ['customer-assignment.html', '관리']].forEach(function(g){
    if (!g[1]) return;
    var a = box.querySelector('a[href="' + g[0] + '"]') || (g[0] === 'customer-assignment.html' ? box.querySelector('a[href="admin.html"]') : null);
    if (!a) return;
    var l = document.createElement('div'); l.className = 'nav-label'; l.textContent = g[1]; if (g[0] === 'customer-assignment.html') l.id = 'navLabelAdmin';
    box.insertBefore(l, a);
  });
  var first = box.querySelector('a[href="home.html"]') || box.querySelector('a[href="index.html"]');
  if (first && !box.querySelector('.nav-label')){ var l0 = document.createElement('div'); l0.className = 'nav-label'; l0.textContent = '메뉴'; box.insertBefore(l0, first); }

  // 상단 바
  var bar = document.createElement('div'); bar.className = 'topbar';
  bar.innerHTML = '<form class="gsearch" autocomplete="off"><span class="ic">🔍</span><input type="search" placeholder="고객번호 · 성명 · 고객정보 검색 후 Enter" aria-label="고객 검색" /></form>'
    + '<div class="profile"><span class="av"></span><span class="pn"><span class="pname"></span><small class="prole"></small></span></div>';
  app.insertBefore(bar, main);
  bar.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault(); var q = bar.querySelector('input').value.trim();
    if (q) location.href = 'index.html?q=' + encodeURIComponent(q);
  });
  function sync(){
    var n = (email && email.textContent || '').trim(), isAdm = adminLink && adminLink.style.display !== 'none';
    bar.querySelector('.pname').textContent = n || '사용자'; bar.querySelector('.av').textContent = (n || '?').charAt(0);
    bar.querySelector('.prole').textContent = isAdm ? '관리자' : '담당자';
    var lab = document.getElementById('navLabelAdmin'), assign = document.getElementById('navAssignLink');
    if (lab) lab.style.display = (isAdm || (assign && assign.style.display !== 'none')) ? '' : 'none';
  }
  sync();
  [email, adminLink, document.getElementById('navAssignLink')].forEach(function(el){
    if (el) new MutationObserver(sync).observe(el, { attributes: true, childList: true, characterData: true, subtree: true });
  });
});
