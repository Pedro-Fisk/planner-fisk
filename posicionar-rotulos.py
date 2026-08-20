#!/usr/bin/env python3
"""
Escolhe onde cada pílula de rótulo cai, por busca, não a olho.

Na arte v2 do Essentials 2 isso foi feito à mão e a alternância cega
acima/abaixo batia em seis lugares; achar e empurrar cada um custou caro.
Como cada mundo novo repete o problema, a escolha virou script.

    python3 posicionar-rotulos.py mundo-essentials-1.js

Lê a geometria do próprio mundo (que veio do `detectar-arte.py`) e imprime o
bloco `etapas` pronto para colar de volta, com `lado`, `dx` e `dy` resolvidos.

O que ele evita: as outras pílulas, os marcos da trilha, os pratos das
clareiras, o que estiver listado em `predios` (o que está pintado no miolo de
cada clareira e não pode ser tapado) e a moldura.
O que ele prefere, quando tudo cabe: alternar acima/abaixo e não empurrar.
"""
import json, re, sys

LARG_CHAR, ALT_PILULA = 7.4, 40


def ler(caminho):
    s = open(caminho, encoding='utf-8').read()
    def nums(b):
        b = re.sub(r'/\*.*?\*/', '', b, flags=re.S)      # tira comentário inline
        return json.loads('[' + b.replace('\n', '').replace(' ', '') + ']')
    m = dict(
        W=int(re.search(r'larg:\s*(\d+)', s).group(1)),
        H=int(re.search(r'alt:\s*(\d+)', s).group(1)),
        passos=nums(re.search(r'passos:\s*\[(.*?)\n  \]', s, re.S).group(1)),
        slots=[nums(b) for b in re.findall(r'slots:\s*\[(.*?)\]\}', s, re.S)],
        nomes=re.findall(r"nome:\s*'([^']+)'", s),
        predios=nums(re.search(r'predios:\s*\[(.*?)\n  \]', s, re.S).group(1))
                 if 'predios:' in s else [],
    )
    # o resto da linha é capturado inteiro e testado com `in`: quantificador
    # preguiçoso com grupo opcional casa vazio e engolia marco/trofeu calado
    m['etapas'] = [(i, r, t, 'marco:1' in resto, 'trofeu:1' in resto)
                   for i, r, t, resto in
                   re.findall(r"id:\s*'([^']+)',\s*rot:\s*'([^']+)',"
                              r"\s*tema:\s*'([^']+)'([^\n]*)", s)]
    return m


def bate(a, b):
    return not (a[2] <= b[0] or b[2] <= a[0] or a[3] <= b[1] or b[3] <= a[1])


def caixa(t, sub, x, y, W):
    w = max(len(t), len(sub)) * LARG_CHAR + 22
    x = min(max(x, w / 2 + 8), W - w / 2 - 8)
    return (x - w / 2, y - ALT_PILULA / 2, x + w / 2, y + ALT_PILULA / 2)


def resolver(m):
    W, H = m['W'], m['H']
    fixos = [(x - 33, y - 30, x + 33, y + 30) for x, y in m['passos']]
    for sl in m['slots']:
        fixos += [(x - 23, y - 20, x + 23, y + 20) for x, y in sl]
    fixos += [tuple(p) for p in m['predios']]

    postos, prog = [], []
    # os programas primeiro: têm menos lugar para ir
    for nome, sl in zip(m['nomes'], m['slots']):
        xs = [s[0] for s in sl]; ys = [s[1] for s in sl]
        cx = (min(xs) + max(xs)) // 2
        cands = [(cx, min(ys) - 46), (cx, max(ys) + 46), (cx, max(ys) + 72),
                 (cx, min(ys) - 72), (min(xs) - 66, (min(ys) + max(ys)) // 2),
                 (max(xs) + 66, (min(ys) + max(ys)) // 2)]
        melhor = None
        for x, y in cands:
            if y - 20 < 0 or y + 20 > H:
                continue
            c = caixa(nome, '0 of 5', x, y, W)
            n = sum(bate(c, o) for o in fixos) + sum(bate(c, p) for p in postos)
            if melhor is None or n < melhor[0]:
                melhor = (n, x, y, c)
            if n == 0:
                break
        postos.append(melhor[3]); prog.append((nome, melhor[1], melhor[2], melhor[0]))

    escolhas = []
    for i, (idd, rot, tema, marco, trofeu) in enumerate(m['etapas']):
        px, py = m['passos'][i]
        pref = -1 if i % 2 == 0 else 1
        melhor = None
        for lado in (pref, -pref):
            for dy in (0, 16, 32, 48, 64):
                for dx in (0, -18, 18, -36, 36, -54, 54, -72, 72):
                    x, y = px + dx, py + lado * (56 + dy)
                    if y - 20 < 0 or y + 20 > H:
                        continue
                    c = caixa(rot, tema, x, y, W)
                    n = sum(bate(c, o) for o in fixos) + sum(bate(c, p) for p in postos)
                    custo = n * 1000 + abs(dx) + dy + (0 if lado == pref else 6)
                    if melhor is None or custo < melhor[0]:
                        melhor = (custo, lado, dx, dy, n, c)
                    if n == 0 and dx == 0 and dy == 0 and lado == pref:
                        break
        postos.append(melhor[5])
        escolhas.append((idd, rot, tema, marco, trofeu, melhor[1], melhor[2], melhor[3], melhor[4]))
    return prog, escolhas


if __name__ == '__main__':
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    m = ler(sys.argv[1])
    prog, escolhas = resolver(m)
    ruins = sum(1 for e in escolhas if e[8]) + sum(1 for p in prog if p[3])
    print('  /* posicionado por posicionar-rotulos.py — %d conflito(s) */' % ruins)
    print('  etapas: [')
    for idd, rot, tema, marco, trofeu, lado, dx, dy, n in escolhas:
        extra = (', dx:%+d' % dx if dx else '') + (', dy:%+d' % (lado * dy) if dy else '')
        extra += ', marco:1' if marco else ''
        extra += ', trofeu:1' if trofeu else ''
        print("    {id:'%s', rot:'%s', tema:'%s', lado:%+d%s},%s"
              % (idd, rot, tema, lado, extra, '   // ⚠️ %d conflito(s)' % n if n else ''))
    print('  ],')
    print('  /* rotXY dos programas */')
    for nome, x, y, n in prog:
        print('    %-13s [%d,%d]%s' % (nome + ':', x, y,
              '   // ⚠️ %d conflito(s)' % n if n else ''))
