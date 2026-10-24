#!/usr/bin/env python3
"""Atualiza o ?v= de css/style.css e js/main.js em todas as páginas com o hash do conteúdo.
Rode depois de editar o CSS ou o JS:  python3 tools/versionar.py
Assim o Cloudflare e os navegadores baixam a versão nova na hora, em vez de usar a cópia guardada."""
import glob, hashlib, os, re
raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(raiz)
for arquivo, padrao in [("css/style.css", r'href="css/style\.css(\?v=[0-9a-f]+)?"'), ("js/main.js", r'src="js/main\.js(\?v=[0-9a-f]+)?"')]:
    v = hashlib.sha1(open(arquivo, "rb").read()).hexdigest()[:8]
    attr = 'href' if arquivo.endswith('.css') else 'src'
    for pagina in glob.glob("*.html"):
        t = open(pagina, encoding="utf-8").read()
        n = re.sub(padrao, f'{attr}="{arquivo}?v={v}"', t)
        if n != t:
            open(pagina, "w", encoding="utf-8").write(n)
    print(arquivo, "->", v)
