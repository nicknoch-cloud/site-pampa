// P.A.M.P.A. — comportamentos de interface

document.addEventListener('DOMContentLoaded', function () {
  // Menu mobile
  var toggle = document.querySelector('.menu-toggle');
  var header = document.querySelector('.site-header');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      header.classList.toggle('aberto');
    });
  }

  // Acordeão de FAQ
  var perguntas = document.querySelectorAll('.faq-question');
  perguntas.forEach(function (botao) {
    botao.addEventListener('click', function () {
      var item = botao.closest('.faq-item');
      var resposta = item.querySelector('.faq-answer');
      var jaAberto = item.classList.contains('aberto');

      document.querySelectorAll('.faq-item.aberto').forEach(function (aberto) {
        aberto.classList.remove('aberto');
        aberto.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!jaAberto) {
        item.classList.add('aberto');
        resposta.style.maxHeight = resposta.scrollHeight + 'px';
      }
    });
  });

  // Marca o link ativo do menu conforme a página atual
  var caminho = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    if (link.getAttribute('href') === caminho) {
      link.classList.add('active');
    }
  });
});

// ---------- Consentimento de cookies + Meta Pixel (LGPD) ----------
// O Pixel só é carregado depois que a pessoa aceita. A escolha fica salva no navegador.
(function () {
  var PIXEL_ID = '1165398806144308';
  var CHAVE = 'pampa_cookies'; // 'aceito' | 'recusado'

  function lerEscolha() { try { return localStorage.getItem(CHAVE); } catch (e) { return null; } }
  function salvarEscolha(v) { try { localStorage.setItem(CHAVE, v); } catch (e) {} }

  function carregarPixel() {
    if (window.fbq) return;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  function evento(nome, dados) { if (window.fbq) fbq('track', nome, dados || {}); }

  // Conversões: cliques no cadastro do Kunk e no WhatsApp
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (a.hasAttribute('data-form-cadastro') || href.indexOf('docs.google.com/forms') !== -1) {
      evento('Lead', { content_name: 'Formulário de pré-cadastro' });
    } else if (a.hasAttribute('data-kunk') || href.indexOf('cadastro.pampa.org.br') !== -1) {
      evento('Lead', { content_name: 'Cadastro no Kunk' });
    } else if (href.indexOf('wa.me/') !== -1) {
      evento('Contact', { content_name: 'WhatsApp' });
    }
  });

  function mostrarAviso() {
    if (document.querySelector('.cookie-aviso')) return;
    var box = document.createElement('div');
    box.className = 'cookie-aviso';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Aviso de cookies');
    box.innerHTML =
      '<p><strong>A gente cuida dos seus dados.</strong> Usamos cookies para entender como o site é usado e melhorar nossa comunicação, inclusive com a Meta (Facebook e Instagram). Você escolhe: nada é ativado sem o seu aceite.</p>' +
      '<div class="cookie-acoes">' +
        '<button type="button" class="btn btn-secondary cookie-recusar">Recusar</button>' +
        '<button type="button" class="btn btn-primary cookie-aceitar">Aceitar</button>' +
      '</div>';
    document.body.appendChild(box);
    box.querySelector('.cookie-aceitar').addEventListener('click', function () {
      salvarEscolha('aceito'); box.remove(); carregarPixel();
    });
    box.querySelector('.cookie-recusar').addEventListener('click', function () {
      salvarEscolha('recusado'); box.remove();
    });
  }

  function iniciar() {
    // Link no rodapé para rever a escolha
    var rodape = document.querySelector('.footer-bottom');
    if (rodape && !rodape.querySelector('.cookie-link')) {
      var link = document.createElement('button');
      link.type = 'button';
      link.className = 'cookie-link';
      link.textContent = 'Preferências de cookies';
      link.addEventListener('click', function () {
        try { localStorage.removeItem(CHAVE); } catch (e) {}
        mostrarAviso();
      });
      rodape.appendChild(link);
    }
    var escolha = lerEscolha();
    if (escolha === 'aceito') carregarPixel();
    else if (escolha !== 'recusado') mostrarAviso();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
