// 각 화면은 앱 셸(index.html: 사이드바·상단 바) 안의 iframe 으로 열린다.
// - 셸 안(embedded): 화면 자체의 헤더/로그인 화면을 숨기고, 로그인이 필요해지면 셸에 알린다.
// - 직접 열렸을 때(주소창·북마크·새 탭): 셸로 보내 같은 틀 안에서 열리게 한다. (디버깅용: ?standalone=1)
(function(){
  var root = document.documentElement, embedded = false;
  try { embedded = window.self !== window.top; } catch (e) { embedded = true; }
  if (!embedded){
    if (/[?&]standalone=1/.test(location.search)) return;
    var file = location.pathname.split('/').pop() || 'home.html';
    location.replace('index.html#' + file + location.search);
    return;
  }
  root.classList.add('embedded', 'pre-auth');
  document.addEventListener('DOMContentLoaded', function(){
    var login = document.getElementById('loginScreen');
    if (login) new MutationObserver(function(){
      if (/display:\s*flex/.test(login.getAttribute('style') || '')) parent.postMessage({ type: 'nfcf-login-needed' }, location.origin);
    }).observe(login, { attributes: true, attributeFilter: ['style'] });
  });
})();
