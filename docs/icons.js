(function(){
  const paths={
    street:'<path class="icon-green" d="M4 17V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z"/><path class="icon-line" d="M7 9V7h2M15 7h2v2M17 15v2h-2M9 17H7v-2M9 14l5-5m-1 0h1v1"/>',
    editorial:'<path class="icon-green" d="M4 4h16v16H4z"/><path class="icon-orange" d="m12 6 6 6-6 6-6-6 6-6Z"/><path class="icon-cream" d="m12 9 3 3-3 3-3-3 3-3Z"/>',
    wedding:'<path class="icon-green" d="M4 5h16v14H4z"/><path class="icon-orange" d="M12 18S6 14.5 6 10a3.2 3.2 0 0 1 6-1.5A3.2 3.2 0 0 1 18 10c0 4.5-6 8-6 8Z"/>',
    portrait:'<path class="icon-green" d="M4 4h16v16H4z"/><circle class="icon-orange" cx="12" cy="9" r="3"/><path class="icon-cream" d="M7 18c.4-3 2-4.5 5-4.5s4.6 1.5 5 4.5H7Z"/>',
    prep:'<path class="icon-cream" d="M6 5h12v16H6z"/><path class="icon-green" d="M9 3h6v4H9z"/><path class="icon-line" d="m9 14 2 2 4-5"/>',
    place:'<path class="icon-cream" d="M4 10h16v10H4z"/><path class="icon-orange" d="m3 10 9-6 9 6H3Z"/><path class="icon-line" d="M7 11v7m5-7v7m5-7v7M3 20h18"/>',
    people:'<circle class="icon-orange" cx="12" cy="7" r="3"/><circle class="icon-green" cx="6" cy="10" r="2.5"/><circle class="icon-green" cx="18" cy="10" r="2.5"/><path class="icon-cream" d="M7 20c.2-4 2-6 5-6s4.8 2 5 6H7Z"/><path class="icon-line" d="M2 19c.2-3 1.5-4.5 4-4.5M22 19c-.2-3-1.5-4.5-4-4.5"/>',
    camera:'<path class="icon-green" d="M3 8h18v12H3z"/><path class="icon-orange" d="m7 8 2-3h6l2 3"/><circle class="icon-cream" cx="12" cy="14" r="4"/><circle class="icon-orange" cx="12" cy="14" r="1.8"/>',
    spark:'<path class="icon-orange" d="M12 2c.7 5 2.3 7.3 7 8-4.7.7-6.3 3-7 8-.7-5-2.3-7.3-7-8 4.7-.7 6.3-3 7-8Z"/><path class="icon-green" d="M19 15c.3 2 1 3 3 3.5-2 .4-2.7 1.4-3 3.5-.3-2-1-3-3-3.5 2-.4 2.7-1.4 3-3.5Z"/>',
    movement:'<path class="icon-line" d="M3 7h13l-3-3m3 3-3 3M21 17H8l3 3m-3-3 3-3"/><circle class="icon-orange" cx="5" cy="17" r="2"/><circle class="icon-green" cx="19" cy="7" r="2"/>',
    embrace:'<circle class="icon-green" cx="9" cy="12" r="5"/><circle class="icon-orange" cx="15" cy="12" r="5"/><path class="icon-line" d="M10.5 8.4a5 5 0 0 1 0 7.2m3-7.2a5 5 0 0 0 0 7.2"/>',
    frame:'<path class="icon-line" d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/><circle class="icon-orange" cx="12" cy="12" r="4"/><circle class="icon-cream" cx="12" cy="12" r="1.4"/>',
    light:'<circle class="icon-orange" cx="12" cy="12" r="4"/><path class="icon-line" d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/>',
    sequence:'<path class="icon-green" d="M3 5h6v6H3z"/><path class="icon-orange" d="M15 5h6v6h-6z"/><path class="icon-cream" d="M9 14h6v6H9z"/><path class="icon-line" d="M9 8h6m-3 3v3"/>',
    direction:'<path class="icon-line" d="M4 18c3-8 8-10 16-10m-4-4 4 4-4 4"/><circle class="icon-orange" cx="5" cy="18" r="2"/>',
    gear:'<path class="icon-green" d="M4 8h16v12H4z"/><path class="icon-line" d="M8 8V5h8v3"/><path class="icon-orange" d="M4 12h16v4H4z"/><path class="icon-cream" d="M10 13h4v3h-4z"/>',
    city:'<path class="icon-line" d="M3 21V9h7v12m0 0V4h7v17m0 0v-9h4v9M6 12h1m-1 4h1m7-9h-1m1 4h-1m1 4h-1M2 21h20"/>',
    wrap:'<circle class="icon-green" cx="12" cy="12" r="9"/><path class="icon-line" d="m7.5 12 3 3 6-7"/>',
    play:'<path class="icon-green" d="M4 4h16v16H4z"/><path class="icon-orange" d="m10 8 6 4-6 4V8Z"/>',
    add:'<circle class="icon-green" cx="12" cy="12" r="9"/><path class="icon-line" d="M12 7v10M7 12h10"/>',
    arrowRight:'<path class="icon-line" d="M4 12h15m-5-5 5 5-5 5"/>',
    back:'<path class="icon-line" d="M20 12H5m5-5-5 5 5 5"/>',
    download:'<path class="icon-green" d="M5 18h14v3H5z"/><path class="icon-line" d="M12 3v12m-4-4 4 4 4-4"/>',
    upload:'<path class="icon-green" d="M5 18h14v3H5z"/><path class="icon-line" d="M12 16V4m-4 4 4-4 4 4"/>',
    archive:'<path class="icon-green" d="M4 8h16v12H4z"/><path class="icon-orange" d="M3 4h18v4H3z"/><path class="icon-line" d="M9 12h6"/>',
    info:'<circle class="icon-green" cx="12" cy="12" r="9"/><path class="icon-line" d="M12 11v6m0-10h.01"/>',
    duplicate:'<path class="icon-green" d="M8 4h12v12H8z"/><path class="icon-cream" d="M4 8h12v12H4z"/><path class="icon-line" d="M8 12h4m-2-2v4"/>',
    delete:'<path class="icon-cream" d="M6 7h12l-1 14H7L6 7Z"/><path class="icon-line" d="M4 7h16M9 7V4h6v3m-5 4v6m4-6v6"/>',
    star:'<path class="icon-orange" d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>',
    image:'<path class="icon-green" d="M3 5h18v14H3z"/><circle class="icon-orange" cx="8" cy="10" r="2"/><path class="icon-cream" d="m5 18 5-5 3 3 2-2 4 4"/>',
    drag:'<circle class="icon-orange" cx="8" cy="7" r="1"/><circle class="icon-orange" cx="16" cy="7" r="1"/><circle class="icon-green" cx="8" cy="12" r="1"/><circle class="icon-green" cx="16" cy="12" r="1"/><circle class="icon-orange" cx="8" cy="17" r="1"/><circle class="icon-orange" cx="16" cy="17" r="1"/>',
    note:'<path class="icon-cream" d="M5 3h14v18H5z"/><path class="icon-orange" d="m8 16 1-4 7-7 3 3-7 7-4 1Z"/>',
    chevron:'<path class="icon-line" d="m7 9 5 5 5-5"/>',
    close:'<path class="icon-line" d="m6 6 12 12M18 6 6 18"/>',
    menu:'<path class="icon-line" d="M4 6h16M4 12h16M4 18h16"/>'
  };
  const aliases={'↗':'street','◆':'editorial','◇':'editorial','♥':'wedding','＋':'add','✓':'wrap','⌂':'place','●':'people','◉':'camera','◎':'camera','▣':'frame','✦':'spark','↔':'movement','◐':'light','▤':'sequence','↝':'direction','∞':'embrace','⌖':'city','⌁':'gear'};
  window.ActiveShotIcon=function(name,className=''){
    const key=paths[name]?name:(aliases[name]||'frame');
    return '<svg class="as-icon '+className+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+paths[key]+'</svg>';
  };
})();
