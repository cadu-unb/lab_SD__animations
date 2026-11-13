# Experimento 1. Simulação de circuitos digitais

## Objetivos

- Familiarização com as operações lógicas elementares.
- Simular circuitos digitais.

## Pré-relatório

- Desenhe à mão os esquemáticos dos circuitos do item 1. Utilizando o teorema de De Morgan, justifique sua resposta.
- Desenhe à mão os esquemáticos dos circuitos do item 2. Analisando as equações lógicas, preencha a tabela verdade abaixo. Explique seu raciocínio.
- Desenhe à mão os esquemáticos dos circuitos do item 3. Explique sua abordagem.
- Desenhe à mão o esquemático do circuito do item 4.

**Tabela verdade do item 2** (preencha as saídas):

| A | B | C | T | S |
|---|---|---|---|---|
| 0 | 0 | 0 |   |   |
| 0 | 0 | 1 |   |   |
| 0 | 1 | 0 |   |   |
| 0 | 1 | 1 |   |   |
| 1 | 0 | 0 |   |   |
| 1 | 0 | 1 |   |   |
| 1 | 1 | 0 |   |   |
| 1 | 1 | 1 |   |   |

## Vistos

1. Implementar e simular no Logisim:
   1. Uma porta E usando somente portas OU e INVERSORAS;
   2. Uma porta OU usando somente portas E e INVERSORAS.
2. Implementar e simular no Logisim as seguintes funções lógicas de três variáveis:
   1. $T = AB + AC + BC$, utilizando somente portas E e OU;
   2. $S = \overline{A}\,\overline{B}C + \overline{A}B\overline{C} + A\overline{B}\,\overline{C} + ABC$, utilizando portas E, OU e INVERSORA.
3. Implementar e simular no Logisim as funções lógicas do item 2, desta vez utilizando somente portas NÃO-E (NAND).
4. Implementar e simular no Logisim a função lógica

   $$
   Y = D_0\overline{S_1}\,\overline{S_0} + D_1\overline{S_1}S_0 + D_2S_1\overline{S_0} + D_3S_1S_0
   $$

   utilizando somente portas NÃO-E (NAND).

**Obs.:** As funções lógicas do item 2 implementam um circuito muito comum, chamado “somador completo”. A saída S é o resultado da soma binária dos bits de entrada A, B e C, enquanto que a saída T representa o chamado “vai-um”. Já a função lógica do item 4 implementa um circuito chamado “multiplexador”, com 4 entradas de dados (D₀, D₁, D₂ e D₃). As entradas de seleção (S₀ e S₁) determinam qual dessas entradas de dados será observada na saída Y. Você irá estudar o funcionamento dos circuitos somador e multiplexador em detalhe mais adiante no curso de Sistemas Digitais.
