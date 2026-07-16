/* Miniversal · EN/中文 language toggle (English default, persisted) */
(function () {
  'use strict';

  var ZH = {
    'brand.sub': '迷你宇宙',
    'nav.playground': '乐园',
    'nav.cafe': '咖啡馆',
    'nav.pricing': '票价',
    'nav.party': '生日派对',
    'nav.visit': '到访',
    'nav.cta': '预约游玩',

    'hero.badge': '悉尼 · Marrickville · 太空主题儿童咖啡馆',
    'hero.t1': '欢迎登陆',
    'hero.t2': '<span class="grad">Miniversal</span> 迷你宇宙',
    'hero.t3': '小小宇航员，<span class="grad grad--2">出发！</span> 🚀',
    'hero.sub': '一间给爸妈的咖啡馆，一整个给孩子的宇宙。<br />现磨好咖啡、驻店厨师现做美食——<br />而 <strong>0–10 岁</strong> 的小宇航员，正在火箭滑梯和星尘球池里撒欢。',
    'hero.cta1': '预约游玩',
    'hero.cta2': '进来看看',
    'hero.stat1': '岁全龄段小宇航员',
    'hero.stat2': '主题星际游乐区',
    'hero.stat3': '人生日派对可容纳',
    'hero.scroll': '向下探索',

    'marquee': '<span>现磨咖啡</span><i>✦</i><span>手工披萨</span><i>✦</i><span>甜点蛋糕</span><i>✦</i><span>儿童餐</span><i>✦</i><span>火箭滑梯</span><i>✦</i><span>星尘球池</span><i>✦</i><span>乐高星球</span><i>✦</i><span>软垫银河</span><i>✦</i><span>现磨咖啡</span><i>✦</i><span>手工披萨</span><i>✦</i><span>甜点蛋糕</span><i>✦</i><span>儿童餐</span><i>✦</i><span>火箭滑梯</span><i>✦</i><span>星尘球池</span><i>✦</i><span>乐高星球</span><i>✦</i><span>软垫银河</span><i>✦</i>',

    'play.eyebrow': '✦ THE PLAYGROUND · 星际游乐场',
    'play.h2': '八大主题游乐区，<br />一整座<span class="grad">属于孩子的宇宙</span>',
    'play.p': '你安心喝咖啡的时候，孩子拥有一整个宇宙。从火箭发射台到星尘球海，每一处都为好奇心而设计——安全、干净、每天多次消毒。',

    'c1.h': '火箭滑梯', 'c1.s': 'ROCKET SLIDES',
    'c1.p': '登上巨型火箭，从星球之巅一路俯冲而下，尖叫与欢笑同时发射升空。',
    'c2.h': '星尘球池', 'c2.s': 'STARDUST BALL PIT',
    'c2.p': '跳进闪闪发光的巨型球海，成千上万颗「星尘」，像遨游在无垠星辰之间。',
    'c3.h': '软垫银河', 'c3.s': 'SOFT-PLAY GALAXY',
    'c3.p': '柔软安全的软垫王国，尽情攀爬、翻滚、穿梭，把整片银河当作游乐场。',
    'c4.h': '乐高星球', 'c4.s': 'LEGO PLANET',
    'c4.p': '小小建筑师的创意基地，用一块块积木搭出属于自己的星球与飞船。',
    'c5.h': '障碍闯关', 'c5.s': 'OBSTACLE COURSE',
    'c5.p': '穿越「陨石带」的勇气挑战，锻炼平衡、协调与胆量，一关接一关。',
    'c6.h': '街机 & 互动游戏', 'c6.s': 'ARCADE & GAMES',
    'c6.p': '点亮一块块屏幕，一场接一场的互动冒险，等着小宇航员来挑战高分。',
    'c7.h': '角色扮演', 'c7.s': 'DRESS-UP ZONE',
    'c7.p': '换上宇航服、戴上头盔，展开一段只属于自己的想象力太空剧。',
    'c8.h': '幼儿专区', 'c8.s': 'TODDLER BAY',
    'c8.p': '为 0–3 岁宝宝准备的温柔小星域，独立、安全、无忧，第一次冒险从这里开始。',

    'cafe.eyebrow': '☕ THE CAFÉ · 咖啡馆',
    'cafe.h2': '首先，这是一家<br /><span class="grad grad--2">认真做咖啡</span>的店',
    'cafe.p': 'Miniversal 的本体是一家儿童咖啡馆。认真对待的现磨咖啡、驻店厨师现做的手工披萨、香甜蛋糕与健康儿童餐——你可以真正坐下来，好好吃一顿、喘口气，孩子就在不远处的宇宙里探险。',
    'cafe.l1': '<span>☕</span> 现磨咖啡 · 认真对待的每一杯',
    'cafe.l2': '<span>🍕</span> 手工披萨 · 驻店厨师现烤',
    'cafe.l3': '<span>🍰</span> 甜点蛋糕 · 香甜不腻的小奖励',
    'cafe.l4': '<span>🧒</span> 健康儿童餐 · 挑嘴宝宝也爱吃',
    'cafe.l5': '<span>🧃</span> 鲜榨果汁 · 冒险补给的能量源',

    'price.eyebrow': '🎟️ ENTRY · 入场票价',
    'price.h2': '票价<span class="grad">一目了然</span>',
    'price.p': '6 个月以下宝宝免费入场。为了安全与卫生，小朋友需穿防滑袜，家长入场也请穿袜子（现场均可购买）。',
    'price.week': '工作日 Weekday',
    'price.weekend': '周末 Weekend',
    'price.h.age': '年龄',
    'price.h.hourly': '按小时 Hourly',
    'price.h.day': '全天通票 Day Pass',
    'price.r1': '6–12 个月',
    'price.r2': '1–3 岁',
    'price.r3': '4–12 岁',
    'price.r4': '成人',
    'price.r5': '6 个月以下',
    'price.free': '免费 Free',
    'price.note': '* 价格以门店现场公示为准。防滑袜可现场购买。',

    'party.eyebrow': '🎂 BIRTHDAY · 星际庆典',
    'party.h2': '一场专属孩子的<br /><span class="grad grad--2">星际生日派对</span>',
    'party.p': '把最难忘的一天交给我们。专属派对管家全程协助，你只管和孩子一起享受这场太空庆典。',
    'party.l1': '<b>厨师现做儿童餐</b>每位小朋友一份，驻店厨师亲手烹制',
    'party.l2': '<b>鲜榨果汁</b>每位小朋友一杯，冒险补给不间断',
    'party.l3': '<b>防滑袜</b>每位小朋友一双，安心尽情玩',
    'party.l4': '<b>独享主题派对房</b>Miniversal 主题餐具与桌面布置',
    'party.l5': '<b>定制主题邀请函</b>一份独一无二的太空邀约',
    'party.l6': '<b>专属派对管家</b>全程协助，帮你安排好每个细节',
    'party.m1': '👶 最多可容纳 <strong>50</strong> 位小朋友',
    'party.m2': '📅 工作日最低 <strong>15</strong> 人 · 周末最低 <strong>23</strong> 人起订',
    'party.cta': '预订派对',

    'visit.eyebrow': '📍 VISIT US · 到访我们',
    'visit.h2': '来 Miniversal，<span class="grad">发射一场冒险</span>',
    'visit.i1h': '地址',
    'visit.i1p': '24–28 Murray St<br />Marrickville NSW 2204',
    'visit.i1l': '在地图中打开 →',
    'visit.i2h': '电话预约',
    'visit.i2l': '拨打电话 →',
    'visit.i3h': '适龄',
    'visit.i3p': '0–10 岁小宇航员<br />各年龄段都有专属区域',
    'visit.i4h': '营业时间',
    'visit.i4p': '营业时间可能因私人包场调整，<br />出行前请查看 Google 最新信息',
    'visit.bh': '准备好出发了吗？',
    'visit.bp': '预约游玩、包场派对，或只是来喝杯咖啡看孩子撒欢——随时欢迎登陆迷你宇宙。',
    'visit.bcta': '立即预约',

    'footer.p': '悉尼 Marrickville 的太空主题儿童咖啡馆。<br />一间给爸妈的咖啡馆，一整个给孩子的宇宙。🚀',
    'footer.made': 'Made with ✦ for little astronauts'
  };

  var META = {
    title: {
      en: document.title,
      zh: 'Miniversal 迷你宇宙 · 悉尼太空主题儿童咖啡馆 | 小小宇航员，出发！'
    },
    desc: {
      en: '',
      zh: 'Miniversal 迷你宇宙——悉尼 Marrickville 的太空主题儿童咖啡馆。爸妈享受现磨好咖啡与厨师现做美食，0–10 岁小宇航员在火箭滑梯、星尘球池和软垫银河里尽情探索。'
    }
  };
  var descEl = document.querySelector('meta[name="description"]');
  if (descEl) META.desc.en = descEl.getAttribute('content');

  /* Capture English defaults from the DOM */
  var els = document.querySelectorAll('[data-i18n], [data-i18n-html]');
  var EN = {};
  els.forEach(function (el) {
    var html = el.hasAttribute('data-i18n-html');
    var key = el.getAttribute(html ? 'data-i18n-html' : 'data-i18n');
    if (!(key in EN)) EN[key] = html ? el.innerHTML : el.textContent;
  });

  var btn = document.getElementById('langBtn');
  var lang;
  try { lang = localStorage.getItem('mv-lang'); } catch (e) { lang = null; }
  if (lang !== 'zh' && lang !== 'en') lang = 'en';

  function apply(l) {
    lang = l;
    var dict = l === 'zh' ? ZH : EN;
    els.forEach(function (el) {
      var html = el.hasAttribute('data-i18n-html');
      var key = el.getAttribute(html ? 'data-i18n-html' : 'data-i18n');
      var v = dict[key];
      if (v == null) return;
      if (html) el.innerHTML = v;
      else el.textContent = v;
    });
    document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
    document.title = META.title[l];
    if (descEl) descEl.setAttribute('content', META.desc[l]);
    if (btn) btn.textContent = l === 'zh' ? 'EN' : 'ZH';
    var bgm = document.getElementById('bgmBtn');
    if (bgm) bgm.title = l === 'zh' ? '背景音乐' : 'Background music';
    try { localStorage.setItem('mv-lang', l); } catch (e) { /* ignore */ }
  }

  if (btn) {
    btn.addEventListener('click', function () {
      apply(lang === 'zh' ? 'en' : 'zh');
    });
  }

  if (lang === 'zh') apply('zh');
})();
