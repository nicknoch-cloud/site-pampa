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

  // Envia o evento ao Google Tag Manager (o GA4 só grava se houver consentimento)
  // Descobre em que parte da página o link estava
  function localDoClique(a) {
    if (a.closest('.whatsapp-float')) return 'botao_flutuante';
    if (a.closest('.site-header')) return 'menu';
    if (a.closest('.site-footer')) return 'rodape';
    if (a.closest('.hero')) return 'topo';
    var secao = a.closest('section');
    var titulo = secao && secao.querySelector('h2, h1, h3');
    if (titulo) return (titulo.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    return 'conteudo';
  }

  function eventoGTM(nome, a) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: nome,
      link_url: a.href,
      link_text: ((a.textContent || '').trim() || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').slice(0, 100),
      local_clique: localDoClique(a),
      pagina: window.location.pathname
    });
  }

  function consentimentoGoogle(valor) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('consent', 'update', {
      ad_storage: valor, analytics_storage: valor,
      ad_user_data: valor, ad_personalization: valor
    });
  }

  // Conversões: pré-cadastro, Kunk, WhatsApp e botões "Associe-se"
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (a.hasAttribute('data-form-cadastro') || href.indexOf('docs.google.com/forms') !== -1) {
      evento('Lead', { content_name: 'Formulário de pré-cadastro' });
      eventoGTM('clique_pre_cadastro', a);
    } else if (a.hasAttribute('data-kunk') || href.indexOf('cadastro.pampa.org.br') !== -1) {
      evento('Lead', { content_name: 'Cadastro no Kunk' });
      eventoGTM('clique_kunk', a);
    } else if (href.indexOf('wa.me/') !== -1) {
      evento('Contact', { content_name: 'WhatsApp' });
      eventoGTM('clique_whatsapp', a);
    } else if (href.indexOf('associe-se') !== -1) {
      eventoGTM('clique_associe_se', a);
    }
  });

  // ---------- Formulário de pré-cadastro (Associe-se) ----------
  // Envia os dados para a planilha da associação (Google Apps Script) e abre o WhatsApp do acolhimento.
  // Cole aqui a URL do app da web do Apps Script (termina em /exec). Vazio = só abre o WhatsApp.
  var URL_PRE_CADASTRO = 'https://script.google.com/macros/s/AKfycbypKFuj1gkEOCt_8BXSAS8_PSIHq_PlCjF1jmDLKwQJOmxAEhaghCoI3vE0kYW4eAOJ/exec';
  var WHATSAPP_ACOLHIMENTO = '5551920012851';

  function iniciarPreCadastro() {
    var form = document.getElementById('form-pre-cadastro');
    if (!form) return;
    var erro = form.querySelector('.pc-erro');
    var sucesso = form.querySelector('.pc-sucesso');
    var botao = form.querySelector('.pc-enviar');

    function marcar(campo, invalido) { campo.classList.toggle('pc-invalido', invalido); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var nome = f.nome.value.trim();
      var telefone = f.telefone.value.trim();
      var digitos = telefone.replace(/\D/g, '');
      var email = f.email.value.trim();
      var motivo = f.motivo.value;
      var problemas = [];

      marcar(f.nome, nome.length < 3); if (nome.length < 3) problemas.push('seu nome');
      var telOk = digitos.length >= 10 && digitos.length <= 13;
      marcar(f.telefone, !telOk); if (!telOk) problemas.push('um telefone com DDD');
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      marcar(f.email, !emailOk); if (!emailOk) problemas.push('um e-mail válido');
      marcar(f.motivo, !motivo); if (!motivo) problemas.push('o motivo do contato');
      var consOk = f.consentimento.checked;
      f.consentimento.closest('.pc-consentimento').classList.toggle('pc-invalido', !consOk);
      if (!consOk) problemas.push('a autorização de uso dos dados');

      if (problemas.length) {
        erro.textContent = 'Falta preencher: ' + problemas.join(', ') + '.';
        erro.hidden = false;
        var primeiro = form.querySelector('.pc-invalido input, .pc-invalido, input.pc-invalido, select.pc-invalido');
        if (primeiro && primeiro.focus) primeiro.focus();
        return;
      }
      erro.hidden = true;

      var texto = 'Olá! Acabei de fazer o pré-cadastro no site da P.A.M.P.A.\n\n' +
        'Nome: ' + nome + '\nTelefone: ' + telefone + '\nE-mail: ' + email + '\nMotivo: ' + motivo;
      var linkWa = 'https://wa.me/' + WHATSAPP_ACOLHIMENTO + '?text=' + encodeURIComponent(texto);

      // Robôs preenchem o campo escondido: finge sucesso e não envia nada
      if (f.site.value) { form.reset(); return; }

      botao.disabled = true;
      botao.textContent = 'Enviando...';

      if (URL_PRE_CADASTRO) {
        try {
          fetch(URL_PRE_CADASTRO, {
            method: 'POST', mode: 'no-cors', keepalive: true,
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ nome: nome, telefone: telefone, email: email, motivo: motivo, pagina: location.href })
          }).catch(function () {});
        } catch (err) {}
      }

      evento('Lead', { content_name: 'Pré-cadastro no site' });
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'envio_pre_cadastro', motivo: motivo, pagina: location.pathname });

      sucesso.querySelector('.pc-link-wa').href = linkWa;
      sucesso.hidden = false;
      botao.textContent = 'Abrindo o WhatsApp...';
      setTimeout(function () {
        window.location.href = linkWa;
        botao.disabled = false;
        botao.textContent = 'Enviar e continuar no WhatsApp';
      }, 600);
    });
  }

  function mostrarAviso() {
    if (document.querySelector('.cookie-aviso')) return;
    var box = document.createElement('div');
    box.className = 'cookie-aviso';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Aviso de cookies');
    box.innerHTML =
      '<p><strong>A gente cuida dos seus dados.</strong> Usamos cookies para entender como o site é usado e melhorar nossa comunicação, inclusive com o Google e a Meta (Facebook e Instagram). Você escolhe: nada é ativado sem o seu aceite.</p>' +
      '<div class="cookie-acoes">' +
        '<button type="button" class="btn btn-secondary cookie-recusar">Recusar</button>' +
        '<button type="button" class="btn btn-primary cookie-aceitar">Aceitar</button>' +
      '</div>';
    document.body.appendChild(box);
    box.querySelector('.cookie-aceitar').addEventListener('click', function () {
      salvarEscolha('aceito'); box.remove(); consentimentoGoogle('granted'); carregarPixel();
    });
    box.querySelector('.cookie-recusar').addEventListener('click', function () {
      salvarEscolha('recusado'); box.remove(); consentimentoGoogle('denied');
    });
  }

  function iniciar() {
    iniciarPreCadastro();
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
