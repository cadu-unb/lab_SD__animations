# Diagramas de estados — simulação de semáforos

`t` = tempo dentro do ciclo. O ciclo reinicia sozinho (`t mod 20`).

```mermaid
stateDiagram-v2
    direction LR
    [*] --> F1

    F1 : F1 · 0 a 8 s
    F1 : A e E verde
    F1 : B vermelho · D vermelho
    F1 : P vermelho

    F2 : F2 · 8 a 10 s
    F2 : A e E amarelo
    F2 : B vermelho · D vermelho
    F2 : P vermelho

    F3 : F3 · 10 a 11 s
    F3 : A e E vermelho
    F3 : B vermelho · D verde
    F3 : P verde

    F4 : F4 · 11 a 16 s
    F4 : A e E vermelho
    F4 : B verde · D verde
    F4 : P verde

    F5 : F5 · 16 a 18 s
    F5 : A e E vermelho
    F5 : B verde · D verde
    F5 : P piscando

    F6 : F6 · 18 a 20 s
    F6 : A e E vermelho
    F6 : B verde · D vermelho
    F6 : P vermelho

    F1 --> F2 : t = 8
    F2 --> F3 : t = 10
    F3 --> F4 : t = 11
    F4 --> F5 : t = 16
    F5 --> F6 : t = 18
    F6 --> F1 : t = 20 reinicia
```

Invariantes (testados em 1 h simulada):
- **B nunca verde junto com A** (B é o oposto de A, com 1 s de folga em F3).
- **D abre quando E fecha** (F3) e **não depende de C**.
- Pedestre só entra na faixa em **P verde**; em **P piscando** só termina quem já está dentro.

> Vide [simulação](desafio/8p1/index.html) com mais detalhes do que realmente precisa;