(function () {
  var TO = ['iida.from0', 'gmail.com'].join('@');
  var $ = function (id) { return document.getElementById(id); };
  var f = {
    company: $('f-company'), name: $('f-name'), email: $('f-email'),
    storage: $('f-storage'), status: $('f-status'), message: $('f-message'),
    source: $('f-source'), referral: $('f-referral'), consent: $('f-consent')
  };
  var tried = false;

  function errs() {
    return {
      company: !f.company.value.trim(),
      name: !f.name.value.trim(),
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim()),
      consent: !f.consent.checked
    };
  }
  function paint() {
    var e = errs();
    ['company', 'name', 'email', 'consent'].forEach(function (k) {
      var box = document.querySelector('[data-err="' + k + '"]');
      var bad = tried && e[k];
      if (box) box.hidden = !bad;
      if (f[k] && k !== 'consent') f[k].style.borderColor = bad ? '#c5221f' : '#b9c4e0';
    });
  }
  ['company', 'name', 'email'].forEach(function (k) { f[k].addEventListener('input', paint); });
  f.consent.addEventListener('change', paint);

  var wrap = $('referral-wrap');
  function toggleRef() {
    var v = f.source.value;
    wrap.hidden = !(v === '知人・取引先の紹介' || v === 'セミナー・イベント' || v === 'その他');
  }
  f.source.addEventListener('change', toggleRef);

  document.querySelector('#form-wrap .btn-primary').addEventListener('click', function () {
    tried = true; paint();
    var e = errs();
    if (e.company || e.name || e.email || e.consent) return;
    var lines = [
      '会社名: ' + f.company.value,
      'ご担当者名: ' + f.name.value,
      'メールアドレス: ' + f.email.value,
      '保存形態: ' + (f.storage.value || '未選択'),
      '現在の輸出状況: ' + (f.status.value || '未選択'),
      'お知りになった経路: ' + (f.source.value || '未選択'),
      'ご紹介者・詳細: ' + (f.referral.value || 'なし'),
      'ご相談内容:',
      f.message.value
    ];
    var btn = this, errBox = $('send-err');
    errBox.hidden = true;
    btn.disabled = true;
    var payload = {
      _subject: '【From 0】無料相談のお申し込み',
      _template: 'table',
      _captcha: 'false',
      '会社名': f.company.value,
      'ご担当者名': f.name.value,
      'メールアドレス': f.email.value,
      '保存形態': f.storage.value || '未選択',
      '現在の輸出状況': f.status.value || '未選択',
      'お知りになった経路': f.source.value || '未選択',
      'ご紹介者・詳細': f.referral.value || 'なし',
      'ご相談内容': f.message.value,
      _replyto: f.email.value
    };
    fetch('https://formsubmit.co/ajax/' + TO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok && String(d.success) !== 'false', d: d }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error('send failed');
        $('form-wrap').hidden = true;
        $('done-wrap').hidden = false;
        window.scrollTo({ top: $('contact').getBoundingClientRect().top + window.pageYOffset - 92, behavior: 'smooth' });
      })
      .catch(function () {
        btn.disabled = false;
        errBox.hidden = false;
        var body = Object.keys(payload).filter(function (k) { return k.charAt(0) !== '_'; })
          .map(function (k) { return k + ': ' + payload[k]; }).join('\n');
        $('send-mail').href = 'mailto:' + TO + '?subject=' + encodeURIComponent(payload._subject) + '&body=' + encodeURIComponent(body);
      });
  });
})();

;(function(){document.addEventListener('contextmenu',function(e){if(e.target.tagName==='IMG')e.preventDefault();});document.addEventListener('dragstart',function(e){if(e.target.tagName==='IMG')e.preventDefault();});})();
