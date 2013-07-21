onDOMReady(function () {
  
  window.setTimeout(demos,   50,  0);
  window.setTimeout(demos,  150,  1);
  window.setTimeout(demos,  300,  2);
  window.setTimeout(demos,  450,  3);
  window.setTimeout(demos,  600,  4);
  window.setTimeout(demos,  750,  5);
  window.setTimeout(demos,  900,  6);
  window.setTimeout(demos, 1050,  8);
  window.setTimeout(demos, 1200,  9);
  window.setTimeout(demos, 1350, 10);
  window.setTimeout(demos, 1450, 11);
  window.setTimeout(demos, 1500, 12);
  window.setTimeout(demos, 1650, 13);
  
  window.setTimeout(demos, 100, 7, '#e3ae23');
  window.setTimeout(demos, 200, 7, '#e33323');
  window.setTimeout(demos, 300, 7, '#1333f3');
  window.setTimeout(demos, 400, 7, '#13f3f3');
  window.setTimeout(demos, 500, 7, '#cccccc');
  window.setTimeout(demos, 600, 7, '#666666');
  window.setTimeout(demos, 700, 7, '#000000');
});

function demos (i) {
  var args = Array.prototype.slice.call(arguments), ele, pos, bsize, bode, bgele;
  switch (i) {
    case 0:
      dompteur.addCSS('* {font-family: "Lucida Grande", "Lucida Sans Unicode", Geneva, sans-serif; }');
      dompteur.addCSS('style.css');
      break;
    case 1:
      $('#demoele').addHTML('<br>add HTML via Id');
      break;
    case 2:
      $('.demoeleclass')[0].addHTML('<br>add HTML via Class');
      break;
    case 3:
      $('#demodiv').$(' p')[1].addHTML('<br>add HTML via TagName');
      break;
    case 4:
      $('#demodiv').$(' div')[0].$(' p').forEach(
        function (elem) {
          elem.addHTML('add HTML via Id, two TagNames and forEach');
        }
      );
      break;
    case 5:
      $('#demodiv').childNodes.last().addAsFirst({
        text:'foo',
        tag:'p'
      });
      break;
    case 6:
      ele = document.createElement('p');
      ele.innerText = 'bar';
      $('#demodiv').childNodes.last().addAsLast(ele);
      break;
    case 7:
      $('#demodiv').find('p').forEach(
        function (elem) {
          elem.setCSS({'color': args[1]});
        }
      );
      break;
    case 8:
      var xml = $('#xmlexample').innerHTML;
      xml = xml.substr(9, xml.length-13);
      $('#demoxml').addViaXML(xml, function (json) {
        var i, chapter, html = '';
        for (i = 0; i < json.CHAPTERS.CHAPTER.length; i++) {
          chapter = json.CHAPTERS.CHAPTER[i];
          html += chapter.START.$ + ' ' + chapter.TITLE.$;
          if (typeof chapter.HREF.$ === 'string') {
            if (chapter.HREF.$.length > 3) {
              html += ' &lt;' + chapter.HREF.$ + '&gt;';
              /*
              if (typeof chapter.IMAGE.$ === 'string') {
                if (chapter.IMAGE.$.length > 3) {
                  html += ' &lt;' + chapter.IMAGE.$ + '&gt;';
                }
              }
              */
            }
          }
          html += '<br/>';
        }
        return html;
      });
      break;
    case 9:
      window.setTimeout("$('#demoencode').addAsFirst('<br/><br/>');", 1000);
      $(' head')[0].find('style')[0].innerHTML = '';
      $('#demoencode').addHTML($('#demoele').encodeHTML() + '<br/>');
      $('#demoencode').addHTML('<div>foo</div>'.encodeHTML() + '<br/>');
      $('#demoencode').addHTML('&lt;div&gt;foo&lt/div&gt;'.decodeHTML() + '<br/>');
      break;
    case 10:
      $('#withstyle').setHTML(JSON.stringify($('#withstyle').getCSS(), null, '  '));
      $('#withstyle').setCSS({'display':'block'});
      break;
    case 11:
      $('#withstyle').setHTML(JSON.stringify($('#withstyle').getPosition(), null, '  '));
      break;
    case 12:
      $('#withstyle').clearCSS();
      break;
    case 13:
      dompteur.addCSS('./lightbox.css');
      bode = document.getElementsByTagName('body')[0];
      bsize = {
        //width: bode.offsetWidth,
        height: bode.offsetHeight+15
      };
      pos = $('#demoele').getPosition();
      bgele = $('#' + dompteur.addDiv('foo'));
      bgele.setCSS(bsize).className = 'lightbox background';
      $('#' + dompteur.addDiv('bar')).setCSS(pos).setCSS({'position': 'absolute', 'background-color': '#ccc'}).className = 'lightbox content';
      bgele.onclick = function () {
        $('.lightbox').forEach(function (elem) {
          elem.style.display = 'none';
        })
        //this.style.display = 'none'
      };
      break;
  }
}
