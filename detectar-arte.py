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

# ── achar as manchas claras e deixar a ARTE dizer quem é quem ─────────────
# Limiar de cor fixo não sobrevive a repintura: a v2 tinha prato quase branco
# (#fefefe) sobre pedra clara, e a v3 trocou a paleta inteira (pedra ficou mais
# quente, prato mais frio) e derrubou a detecção. O que NÃO muda entre artes é
# a relação: o prato é o disco mais lavado da cena e a pedra é mais saturada,
# porque a pedra pega a cor quente da areia e o prato não.
#
# Então achamos todas as manchas claras do tamanho certo, medimos a saturação
# de cada uma, e cortamos no maior vão da lista ordenada. Dois grupos saem
# sozinhos, sem número escrito à mão.
AREA_MIN    = 700
AREA_MAX    = 9000


def limiar_otsu(dados):
    """Acha sozinho onde acaba o fundo e começa o disco claro.

    O piso de brilho era a última suposição fixa que sobrava, e ela caiu na
    terceira arte: no universo os discos são (204,169,134), e um corte em 150
    os jogava fora inteiros porque a cena toda é escura. Otsu procura o corte
    que melhor separa a imagem em dois grupos, então cada arte traz o seu.

    Roda sobre o canal mais ESCURO de cada pixel: é ele que distingue um
    disco lavado (min alto) de uma cor saturada por mais clara que pareça.
    """
    hist = [0] * 256
    for p in dados:
        hist[min(p)] += 1
    total = len(dados)
    soma = sum(i * hist[i] for i in range(256))
    somaB, wB, melhor, corte = 0.0, 0, -1.0, 0
    for i in range(256):
        wB += hist[i]
        if wB == 0:
            continue
        wF = total - wB
        if wF == 0:
            break
        somaB += i * hist[i]
        entre = wB * wF * ((somaB / wB) - ((soma - somaB) / wF)) ** 2
        if entre > melhor:
            melhor, corte = entre, i
    return corte


def e_madeira(p):
    r, g, b = p
    return 90 < r < 235 and 45 < g < 165 and 5 < b < 115 and r - b > 75 and r - g > 45


def manchas(dados, W, H, corte):
    """Componentes conexos claros, com cor média e saturação de cada um."""
    def e_claro(p):
        return min(p) >= corte
    visto = bytearray(W * H)
    achados = []
    for i in range(W * H):
        if visto[i] or not e_claro(dados[i]):
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
                    if not visto[k] and e_claro(dados[k]):
                        visto[k] = 1
                        pilha.append(k)
        if not (AREA_MIN <= len(pts) <= AREA_MAX):
            continue
        xs = [q % W for q in pts]
        ys = [q // W for q in pts]
        larg, altu = max(xs) - min(xs) + 1, max(ys) - min(ys) + 1
        if larg > 3 * altu or altu > 3 * larg:      # tira riscos: cachoeira, cerca
            continue
        r = sum(dados[q][0] for q in pts) / len(pts)
        g = sum(dados[q][1] for q in pts) / len(pts)
        b = sum(dados[q][2] for q in pts) / len(pts)
        sat = (max(r, g, b) - min(r, g, b)) / max(r, g, b)
        achados.append(dict(x=round(sum(xs) / len(xs)), y=round(sum(ys) / len(ys)),
                            n=len(pts), sat=sat))
    return achados


def separar(ms):
    """Corta a lista de saturações no maior vão: lavados = prato, quentes = pedra."""
    if len(ms) < 4:
        return [], ms, 0.0
    ordem = sorted(ms, key=lambda m: m['sat'])
    vao, corte = 0, 0
    for i in range(1, len(ordem)):
        d = ordem[i]['sat'] - ordem[i - 1]['sat']
        if d > vao:
            vao, corte = d, i
    lim = (ordem[corte]['sat'] + ordem[corte - 1]['sat']) / 2
    pratos = sorted([m for m in ms if m['sat'] < lim], key=lambda m: m['x'])
    pedras = sorted([m for m in ms if m['sat'] >= lim], key=lambda m: m['x'])
    return pratos, pedras, lim


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


def agrupar(pratos, raio=260):
    """Junta pratos vizinhos em clareiras. Serve para conferir a contagem: o
    erro que mais aparece é uma clareira com 4 em vez de 5, ou um objeto
    claro qualquer entrando na lista como se fosse prato."""
    restantes = list(pratos)
    grupos = []
    while restantes:
        semente = restantes.pop(0)
        grupo = [semente]
        mudou = True
        while mudou:
            mudou = False
            for m in restantes[:]:
                if any((m['x'] - g['x']) ** 2 + (m['y'] - g['y']) ** 2 < raio ** 2 for g in grupo):
                    grupo.append(m)
                    restantes.remove(m)
                    mudou = True
        grupos.append(sorted(grupo, key=lambda g: g['x']))
    return sorted(grupos, key=lambda g: g[0]['x'])


def main():
    caminho = sys.argv[1] if len(sys.argv) > 1 else 'assets/trajetoria/essentials-2-v3.png'
    im = Image.open(caminho).convert('RGB')
    W, H = im.size
    dados = list(im.getdata())
    print('arte: %s  %d × %d  (proporção %.2f:1)' % (caminho, W, H, W / H))

    corte = limiar_otsu(dados)
    ms = manchas(dados, W, H, corte)
    pratos, pedras, lim = separar(ms)
    print('\nlimiar de brilho achado por Otsu: %d' % corte)
    print('%d manchas claras, cortadas em saturação %.3f' % (len(ms), lim))

    print('\n%d pedras na trilha:' % len(pedras))
    for m in pedras:
        print('  [%d,%d],' % (m['x'], m['y']))

    print('\n%d pratos de clareira (esperado: 5 por clareira):' % len(pratos))
    for grupo in agrupar(pratos):
        marca = 'ok' if len(grupo) == 5 else '⚠️  NÃO são 5'
        print('  clareira em x≈%d, y≈%d — %d pratos  [%s]'
              % (sum(g['x'] for g in grupo) / len(grupo),
                 sum(g['y'] for g in grupo) / len(grupo), len(grupo), marca))
        for m in grupo:
            print('      [%d,%d],' % (m['x'], m['y']))
    print('  ⚠️ grupo com 1 prato quase sempre é falso positivo (a pipoca do')
    print('     telão já se passou por prato uma vez). Conferir no PNG.')

    # A madeira não fecha em componente (as tábuas têm sulco escuro no meio).
    # Procura nos vãos entre pedras consecutivas que sejam largos demais.
    print('\nmadeira nos vãos largos entre pedras:')
    px = im.load()
    if len(pedras) > 2:
        vaos = [pedras[i + 1]['x'] - pedras[i]['x'] for i in range(len(pedras) - 1)]
        tipico = sorted(vaos)[len(vaos) // 2]
        achou = False
        for i, v in enumerate(vaos):
            if v > tipico * 1.45:
                a, b = pedras[i], pedras[i + 1]
                c = caixa(px, e_madeira, (a['x'] + 25, b['x'] - 25,
                                          max(0, min(a['y'], b['y']) - 90),
                                          min(H, max(a['y'], b['y']) + 90)))
                achou = True
                print('  entre x=%d e x=%d (vão %d, típico %d) → %s'
                      % (a['x'], b['x'], v, tipico,
                         ('[%d,%d]' % c) if c else 'nada marrom: pode ser só uma curva'))
        if not achou:
            print('  nenhum vão fora do padrão')
    print('  ⚠️ conferir no PNG: decidir se cada travessia É um passo ou é cenário.')

    dbg = im.copy()
    d = ImageDraw.Draw(dbg)
    for i, m in enumerate(pedras, 1):
        x, y = m['x'], m['y']
        d.ellipse((x - 26, y - 26, x + 26, y + 26), outline=(255, 0, 0), width=5)
        d.text((x - 6, y - 8), str(i), fill=(255, 0, 0))
    for i, m in enumerate(pratos, 1):
        x, y = m['x'], m['y']
        d.ellipse((x - 20, y - 20, x + 20, y + 20), outline=(0, 80, 255), width=4)
    saida = '_debug-lajes.png'
    dbg.save(saida)
    print('\n→ %s  (vermelho = pedra numerada, azul = prato). OLHAR ANTES DE USAR.' % saida)


if __name__ == '__main__':
    main()
