#!/usr/bin/env python3
"""
Assa na arte a sombra que destaca o caminho.

Por que assar em vez de desenhar no navegador: a sombra é um borrão gaussiano
grande sobre 2080×756. Desenhada em SVG ela fica ajustável, mas o navegador
tem de rasterizar o filtro, e qualquer coisa que invalide a camada (a pulsação
do "você está aqui", o arrasto horizontal num Android fraco) manda rasterizar
de novo. Assada, custa zero em tempo de execução.

A geometria continua vindo da arte: os 15 passos e os pratos das clareiras são
lidos do `mundo-*.js`, que por sua vez saiu do `detectar-arte.py`. Então isto
serve o universo e o deserto sem número novo escrito à mão.

⚠️ Um degradê reto de cima e de baixo NÃO serve. A trilha ocupa só a faixa
y 364-434, mas as três clareiras moram justamente onde um degradê desses
escureceria (Video Book em 211-275 e Movies em 243-314 no alto, Songs em
600-659 embaixo). Escurecer "em cima e embaixo" apagaria os três programas.
Por isso a luz é um corredor seguindo os passos mais uma bolha por clareira.

    python3 assar-sombra.py mundo-essentials-2.js 0.42
    python3 assar-sombra.py mundo-essentials-2.js 0.28 0.42 0.55   # compara
"""
import json, re, sys, os
from PIL import Image, ImageDraw, ImageFilter

CORREDOR = 190   # largura do corredor de luz ao longo da trilha, em px da arte
FOLGA_X  = 95    # quanto a bolha de cada clareira passa dos pratos
FOLGA_Y  = 80
BORRAO   = 34    # o mesmo stdDeviation que o SVG usava
TINTA    = (7, 28, 13)   # verde quase preto; escurece sem lavar a cor


def ler_mundo(caminho):
    """Tira do mundo-*.js só o que a sombra precisa, sem depender de node."""
    s = open(caminho, encoding='utf-8').read()
    def lista(bloco):
        return json.loads('[' + bloco.replace('\n', '').replace(' ', '') + ']')
    arte = re.search(r"arte:\s*'([^']+)'", s).group(1)
    larg = int(re.search(r'larg:\s*(\d+)', s).group(1))
    alt  = int(re.search(r'alt:\s*(\d+)', s).group(1))
    passos = lista(re.search(r'passos:\s*\[(.*?)\n  \]', s, re.S).group(1))
    clareiras = [lista(b) for b in re.findall(r'slots:\[(.*?)\]\}', s, re.S)]
    return arte, larg, alt, passos, clareiras


def mascara_de_luz(larg, alt, passos, clareiras):
    """Branco = fica claro, preto = escurece."""
    m = Image.new('L', (larg, alt), 0)
    d = ImageDraw.Draw(m)
    d.line([tuple(p) for p in passos], fill=255, width=CORREDOR, joint='curve')
    for p in passos:                      # tapa o vinco que o `joint` deixa nas curvas
        d.ellipse((p[0]-CORREDOR//2, p[1]-CORREDOR//2,
                   p[0]+CORREDOR//2, p[1]+CORREDOR//2), fill=255)
    for slots in clareiras:
        xs = [s[0] for s in slots]; ys = [s[1] for s in slots]
        d.ellipse((min(xs)-FOLGA_X, min(ys)-FOLGA_Y,
                   max(xs)+FOLGA_X, max(ys)+FOLGA_Y), fill=255)
    return m.filter(ImageFilter.GaussianBlur(BORRAO))


def assar(js, forcas):
    arte, larg, alt, passos, clareiras = ler_mundo(js)
    fonte = arte.replace('.webp', '.png')
    im = Image.open(fonte).convert('RGB')
    if im.size != (larg, alt):
        raise SystemExit('a arte é %dx%d mas o mundo diz %dx%d' % (im.size + (larg, alt)))
    print('%s  %dx%d  ·  %d passos, %d clareiras'
          % (fonte, larg, alt, len(passos), len(clareiras)))

    luz = mascara_de_luz(larg, alt, passos, clareiras)
    escuro = Image.new('RGB', (larg, alt), TINTA)

    for f in forcas:
        # alfa = (1 - luz) * força: escurece o que a luz não alcança
        alfa = luz.point(lambda v, f=f: int((255 - v) * f))
        out = im.copy()
        out.paste(escuro, (0, 0), alfa)
        base = os.path.splitext(fonte)[0] + '-sombra%02d' % round(f * 100)
        out.save(base + '.png')
        os.system('cwebp -q 82 -m 6 "%s.png" -o "%s.webp" >/dev/null 2>&1' % (base, base))
        kb = os.path.getsize(base + '.webp') / 1024
        print('  força %.2f  →  %s.webp  (%d KB)' % (f, os.path.basename(base), kb))


if __name__ == '__main__':
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    assar(sys.argv[1], [float(x) for x in sys.argv[2:]])
