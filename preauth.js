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
