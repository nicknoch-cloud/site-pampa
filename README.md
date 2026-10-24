# Site da P.A.M.P.A. — pampa.org.br

Site estático (HTML, CSS e JS puros, sem etapa de build).

## Como editar
Edite os arquivos direto na branch `main` (pelo github.com ou por um clone).
Cada alteração enviada à `main` é publicada automaticamente.

## Hospedagem
- **GitHub Pages** (principal): publica a raiz da branch `main`.
  O arquivo `CNAME` define o domínio `pampa.org.br`; `.nojekyll` faz o
  GitHub publicar os arquivos como estão.
- `netlify.toml` fica como alternativa caso o site volte a ser publicado pelo Netlify.

## Estrutura
- `index.html`, `quem-somos.html`, `associe-se.html`, `orientacoes.html`, `contato.html` — páginas
- `css/style.css` — estilos · `js/main.js` — menu e comportamentos
- `images/` — logos e símbolos · `fonts/` — fontes da identidade visual

## Depois de editar CSS ou JS

O Cloudflare guarda `css/style.css` e `js/main.js` por até 4 horas. Depois de alterar qualquer um deles, rode `python3 tools/versionar.py` antes do commit: ele atualiza o `?v=` nas páginas e força todo mundo a baixar a versão nova.
