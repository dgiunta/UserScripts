// ==UserScript==
// @name           JIRA 4.0 Limit Horizontal Scrolling
// @namespace      http://userscripts.org/scripts/show/68084
// @description    add a table-layout: fixed to all tables
// @include        http://jira.atlassian.com/browse/*
// ==/UserScript==

(function() {
  var el       = document.createElement('div'),
      b        = document.getElementsByTagName('body')[0],
      otherlib = false,
      msg      = '';

  el.style.position        = 'fixed';
  el.style.height          = '32px';
  el.style.width           = '220px';
  el.style.marginLeft      = '-110px';
  el.style.top             = '0';
  el.style.left            = '50%';
  el.style.padding         = '5px 10px 5px 10px';
  el.style.zIndex          = 1001;
  el.style.fontSize        = '12px';
  el.style.color           = '#222';
  el.style.backgroundColor = '#f99';

  if(typeof jQuery != 'undefined') {
    msg = 'This page already using jQuery v' + jQuery.fn.jquery;
    return showMsg();
  } else if (typeof $ == 'function') {
    otherlib = true;
  }

  // more or less stolen form jquery core and adapted by paul irish
  function getScript(url, success){
    var script = document.createElement('script');
    script.src = url;

    var head = document.getElementsByTagName('head')[0],
    done = false;

    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function(){
      var that = this;
      function isDone () {
        return !done && (!that.readyState || 
                          that.readyState == 'loaded' || 
                          that.readyState == 'complete');
      };
      
      if (isDone()) {
        done = true;
        success();
      }
    };

    head.appendChild(script);
  };
    
  getScript('http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js', function() {
    if (typeof jQuery=='undefined') {
      msg = 'Sorry, but jQuery wasn\'t able to load';
    } else {
      msg = 'This page is now jQuerified with v' + jQuery.fn.jquery;
      if (otherlib) msg += ' and noConflict(). Use $jq(), not $().';
    }
    
    return showMsg();
  });
  
  function showMsg() {
    el.innerHTML=msg;
    b.appendChild(el);
    window.setTimeout(function() {
      if (typeof jQuery == 'undefined') {
        b.removeChild(el);
      } else {
        jQuery(el).fadeOut('slow', function() {
          jQuery(this).remove();
        });
        if (otherlib) $jq = jQuery.noConflict();
      }
    }, 500);
    onSuccess();
  };
  
  function onSuccess () {
    var $             = jQuery,
        oldContainer  = $('#dashboard_tabs'),
        tabContainers = $('td', oldContainer),
        title         = tabContainers.shift(),
        links         = $('a', tabContainers),
        container     = $('<ul id="dashboard_tabs" />'),
        header        = $('<h5 />').text($(title).text());
  
    container.append(header, links.wrap("<li />")).replace(oldContainer);
  }
})();