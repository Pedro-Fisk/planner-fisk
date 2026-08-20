#!/usr/bin/env python3
"""
Escolhe onde cada pílula de rótulo cai, por busca, não a olho.

Na arte v2 isso foi feito à mão e a alternância cega acima/abaixo batia em
seis lugares; achar e empurrar cada um custou caro. Como a arte vai ser
repintada mais duas vezes (universo e deserto), a escolha virou script.

O que ele evita: as outras pílulas, os marcos da trilha, os pratos das
clareiras, os prédios de cada clareira (cabana, telão, fogueira) e a moldura.
O que ele prefere, quando tudo cabe: alternar acima/abaixo e não empurrar.

    python3 posicionar-rotulos.py

Imprime o trecho pronto para colar no `mundo-*.js`.
"""

LARG_CHAR, ALT_PILULA = 7.4, 40

# ── a arte v3 do Essentials 2, detectada por detectar-arte.py ─────────────
ART_W, ART_H = 1800, 873
PASSOS = [(94,436),(200,427),(307,400),(414,396),(530,413),(647,424),(872,428),
          (982,422),(1091,422),(1201,433),(1315,458),(1430,473),(1549,486),(1664,497)]
PASSOS.insert(6, (758,430))          # a ordem certa é por x; ver montagem abaixo
PASSOS = sorted(set(PASSOS))

ETAPAS = [
    ('Intro','Before you start'), ('Lesson 1','Good times'), ('Lesson 2','Having fun'),
    ('Lesson 3','Food talk'), ('Lesson 4','City life'), ('Lesson 5','Looking back'),
    ('Checkpoint 1','Review 1-5'), ('Test 1','Lessons 1-5'), ('Lesson 6','Health'),
    ('Lesson 7','Chores and errands'), ('Lesson 8','Appearances'), ('Lesson 9','Read this'),
    ('Lesson 10','The world we live in'), ('Checkpoint 2','Review 6-10'),
    ('Test 2','Lessons 6-10')]

CLAREIRAS = [
    ('Songs',      [(623,653),(661,697),(718,710),(774,697),(808,653)]),
    ('Video Book', [(748,262),(786,304),(842,317),(899,304),(936,262)]),
    ('Movies',     [(1197,284),(1239,332),(1301,353),(1365,348),(1412,313)]),
]
# o que está pintado no miolo de cada clareira e não pode ser tapado
PREDIOS = [(600,540,840,660),        # fogueira e toras
           (640,80,940,262),         # cabana
           (1150,90,1460,290)]       # telão, caixas de som e projetor


def caixa_rotulo(t, s, x, y):
    w = max(len(t), len(s)) * LARG_CHAR + 22
    x = min(max(x, w / 2 + 8), ART_W - w / 2 - 8)
    return (x - w / 2, y - ALT_PILULA / 2, x + w / 2, y + ALT_PILULA / 2)


def bate(a, b):
    return not (a[2] <= b[0] or b[2] <= a[0] or a[3] <= b[1] or b[3] <= a[1])


def obstaculos_fixos():
    o = [(x - 33, y - 30, x + 33, y + 30) for x, y in PASSOS]
    for _, slots in CLAREIRAS:
        o += [(x - 23, y - 20, x + 23, y + 20) for x, y in slots]
    o += list(PREDIOS)
    return o


def resolver():
    fixos = obstaculos_fixos()
    postos = []          # pílulas já colocadas
    escolhas = []

    # os programas primeiro: têm menos lugar para ir
    prog = []
    for nome, slots in CLAREIRAS:
        xs = [s[0] for s in slots]; ys = [s[1] for s in slots]
        cx = (min(xs) + max(xs)) // 2
        cands = [(cx, min(ys) - 46), (cx, max(ys) + 46), (cx, max(ys) + 70),
                 (cx, min(ys) - 70), (min(xs) - 60, (min(ys)+max(ys))//2)]
        melhor = None
        for x, y in cands:
            if y - 20 < 0 or y + 20 > ART_H:
                continue
            c = caixa_rotulo(nome, '0 of 5', x, y)
            n = sum(bate(c, o) for o in fixos) + sum(bate(c, p) for p in postos)
            if melhor is None or n < melhor[0]:
                melhor = (n, x, y, c)
            if n == 0:
                break
        postos.append(melhor[3])
        prog.append((nome, melhor[1], melhor[2], melhor[0]))

    # depois os 15 passos
    for i, (t, s) in enumerate(ETAPAS):
        px, py = PASSOS[i]
        melhor = None
        preferido = -1 if i % 2 == 0 else 1
        for lado in (preferido, -preferido):
            for dy in (0, 16, 32, 48):
                for dx in (0, -18, 18, -36, 36, -54, 54):
                    x, y = px + dx, py + lado * 56 + lado * dy
                    if y - 20 < 0 or y + 20 > ART_H:
                        continue
                    c = caixa_rotulo(t, s, x, y)
                    n = sum(bate(c, o) for o in fixos) + sum(bate(c, p) for p in postos)
                    custo = n * 100 + abs(dx) + dy + (0 if lado == preferido else 6)
                    if melhor is None or custo < melhor[0]:
                        melhor = (custo, lado, dx, dy, n, c)
                    if n == 0 and dx == 0 and dy == 0 and lado == preferido:
                        break
        postos.append(melhor[5])
        escolhas.append((t, s, melhor[1], melhor[2], melhor[3], melhor[4]))

    return prog, escolhas


if __name__ == '__main__':
    prog, escolhas = resolver()
    ruins = sum(1 for e in escolhas if e[5]) + sum(1 for p in prog if p[3])
    print('  /* posicionado por posicionar-rotulos.py — %d conflito(s) */' % ruins)
    print('  etapas: [')
    ids = ['INTRO'] + ['L%d' % n for n in range(1, 6)] + ['CHP1', 'TEST1'] \
        + ['L%d' % n for n in range(6, 11)] + ['CHP2', 'TEST2']
    for (t, s, lado, dx, dy, n), idd in zip(escolhas, ids):
        extra = ''
        if dx: extra += ', dx:%+d' % dx
        if dy: extra += ', dy:%+d' % (lado * dy)
        marca = ", marco:1" if idd.startswith(('CHP', 'TEST')) else ''
        marca += ", trofeu:1" if idd.startswith('TEST') else ''
        aviso = '   // ⚠️ %d conflito(s)' % n if n else ''
        print("    {id:'%s', rot:'%s', tema:'%s', lado:%+d%s%s},%s"
              % (idd, t, s, lado, extra, marca, aviso))
    print('  ],')
    print('  /* rotXY dos programas */')
    for nome, x, y, n in prog:
        print("    %-12s rotXY:[%d,%d]%s" % (nome + ':', x, y,
              '   // ⚠️ %d conflito(s)' % n if n else ''))
