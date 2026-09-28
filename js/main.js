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
