#!/usr/bin/env python3
"""
Detecta a geometria de um mundo da trajetória DENTRO da arte pintada.

A arte manda na geometria: as posições dos marcos da trilha e dos pratos das
clareiras nunca são estimadas a olho, são medidas na imagem. Se a arte for
repintada, isto roda de novo e as coordenadas do HTML são trocadas.

    python3 detectar-arte.py assets/trajetoria/essentials-2-v2.png

Imprime as coordenadas prontas para colar em PASSOS/PROGRAMAS e escreve um
PNG de depuração com os marcos numerados por cima — **sempre olhar esse PNG
antes de escrever coordenada**. O que mais sai errado do gerador é a
contagem, e é justamente o que quebra o encaixe.

Só precisa de Pillow (`pip3 install pillow`). Sem numpy de propósito: a
imagem tem 1,6 M de pixels e o flood fill em Python puro roda em segundos.
"""
import sys
from PIL import Image, ImageDraw

# ── as três famílias de mancha, medidas na arte da floresta ────────────────
# pedra  : laje clara e pouco saturada (~231,217,205) sobre areia (~222,178,93)
# prato  : branco quase puro com aro quente de 2-3px
# madeira: marrom quente; vem em tábuas separadas por sulco escuro, então
#          NÃO fecha num componente só — é medida pela caixa envolvente
#          dentro de uma janela, não por componente conexo.
def e_pedra(p):
    # o limiar é frouxo de propósito: a última laje já está na areia do
    # deserto e a luz quente dali a escurece o bastante para escapar de um
    # corte apertado.
    r, g, b = p
    return r > 195 and g > 185 and b > 168 and (max(p) - min(p)) < 62 and b < 245

def e_prato(p):
    r, g, b = p
    return r > 243 and g > 243 and b > 240

def e_madeira(p):
    r, g, b = p
    return 90 < r < 235 and 45 < g < 165 and 5 < b < 115 and r - b > 75 and r - g > 45


def componentes(dados, W, H, pred, min_px):
    """Componentes conexos por 4-vizinhança, filtrados por área."""
    visto = bytearray(W * H)
    achados = []
    for i in range(W * H):
        if visto[i] or not pred(dados[i]):
            continue
        pilha, pts = [i], []
        visto[i] = 1
        while pilha:
            j = pilha.pop()
            pts.append(j)
            x, y = j % W, j // W
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < W and 0 <= ny < H:
                    k = ny * W + nx
                    if not visto[k] and pred(dados[k]):
                        visto[k] = 1
                        pilha.append(k)
        if len(pts) >= min_px:
            xs = [p % W for p in pts]
            ys = [p // W for p in pts]
            achados.append((round(sum(xs) / len(xs)), round(sum(ys) / len(ys)), len(pts)))
    achados.sort()
    return achados


def caixa(px, pred, janela):
    """Centro da caixa envolvente dentro de uma janela — para a madeira."""
    x0, x1, y0, y1 = janela
    xs, ys = [], []
    for y in range(y0, y1):
        for x in range(x0, x1):
            if pred(px[x, y]):
                xs.append(x)
                ys.append(y)
    if not xs:
        return None
    return ((min(xs) + max(xs)) // 2, (min(ys) + max(ys)) // 2)


def main():
    caminho = sys.argv[1] if len(sys.argv) > 1 else 'assets/trajetoria/essentials-2-v2.png'
    im = Image.open(caminho).convert('RGB')
    W, H = im.size
    dados = list(im.getdata())
    print('arte: %s  %d × %d  (proporção %.2f:1)' % (caminho, W, H, W / H))

    pedras = componentes(dados, W, H, e_pedra, 900)
    pratos = componentes(dados, W, H, e_prato, 700)

    print('\n%d pedras na trilha:' % len(pedras))
    for x, y, n in pedras:
        print('  [%d,%d],' % (x, y))

    print('\n%d pratos de clareira (5 por clareira = 15):' % len(pratos))
    for x, y, n in pratos:
        print('  [%d,%d],' % (x, y))

    # A madeira não fecha em componente. Procura nos vãos entre pedras
    # consecutivas que estejam largos demais para serem vão normal.
    print('\nmadeira (vãos suspeitos entre pedras consecutivas):')
    if len(pedras) > 2:
        vaos = [pedras[i + 1][0] - pedras[i][0] for i in range(len(pedras) - 1)]
        tipico = sorted(vaos)[len(vaos) // 2]
        for i, v in enumerate(vaos):
            if v > tipico * 1.45:
                a, b = pedras[i], pedras[i + 1]
                c = caixa(im.load(), e_madeira, (a[0] + 30, b[0] - 30,
                                                 max(0, min(a[1], b[1]) - 90),
                                                 min(H, max(a[1], b[1]) + 90)))
                print('  entre x=%d e x=%d (vão %d, típico %d) → %s'
                      % (a[0], b[0], v, tipico,
                         ('[%d,%d]' % c) if c else 'nada marrom aqui: pode ser só uma curva'))
    print('  ⚠️ conferir cada um no PNG de depuração: ponte de rio não é marco.')

    # ── o PNG de conferência ──────────────────────────────────────────────
    dbg = im.copy()
    d = ImageDraw.Draw(dbg)
    for i, (x, y, n) in enumerate(pedras, 1):
        d.ellipse((x - 26, y - 26, x + 26, y + 26), outline=(255, 0, 0), width=5)
        d.text((x - 6, y - 8), str(i), fill=(255, 0, 0))
    for x, y, n in pratos:
        d.ellipse((x - 20, y - 20, x + 20, y + 20), outline=(0, 80, 255), width=4)
    saida = '_debug-lajes.png'
    dbg.save(saida)
    print('\n→ %s  (vermelho = pedra numerada, azul = prato). OLHAR ANTES DE USAR.' % saida)


if __name__ == '__main__':
    main()
