# Laboratório de Sistemas Digitais — Experimento 02

## Objetivos

- Implementar circuitos combinacionais simples baseados em FPGA, utilizando a linguagem de descrição de hardware VHDL.
- Desenvolver módulos básicos — um somador completo e um multiplexador — que poderão ser usados posteriormente para construir sistemas mais complexos.

## Instruções

- O experimento deve ser realizado utilizando o ModelSim;
- Cada experimento será avaliado por meio do relatório técnico e dos códigos submetidos pelo aluno, por meio da plataforma Aprender. Os códigos devem ser submetidos comprimidos em um único arquivo.
- A sua simulação deve incluir o arquivo vhdl contendo a entidade (*entity*) e a arquitetura (*architecture*) do somador completo e o arquivo vhdl do *test bench* desenvolvido para simular o circuito. Conforme descrito no guia de uso, o seu relatório deve conter os códigos, as telas de compilação e simulação do ModelSim e as formas de ondas obtidas com a simulação.
- O relatório é individual e receberá uma nota de 0 a 10, considerando os seguintes aspectos:
  - Documentação do código, contida no relatorio (pdf) e no codigo vhdl- 20% da nota do projeto;
  - Compilação do código, apresentada no relatorio do projeto econfirmado pelo codigo vhd -10% da nota do projeto;
  - Simulação do código, apresentada no relatório do projeto econfirmado pelo codigo vhd - 70% da nota do projeto.

## Questão 01

Descrever em VHDL e simular no ModelSim uma entidade com três bits de entrada (A, B e Cin) e dois bits de saída (S e Cout) que implemente um somador completo, descrito pelas seguintes funções lógicas.

$$
S = A \oplus B \oplus Cin
$$

$$
Cout = A \cdot B + A \cdot Cin + B \cdot Cin
$$

A função lógica do “somador completo” é mesmo circuito que foi simulado no Experimento 1. A saída S é o resultado da soma binária dos bits de entrada, enquanto que a saída Cout representa o chamado “vai-um”.

## Questão 02

Descrever em VHDL e simular no ModelSim uma entidade com dois vetores de entrada (S com 2 bits e D com 4 bits) e um bit de saída (Y) e sua arquitetura, que implemente um multiplexador de 4 para 1, descrito pela função lógica abaixo.

$$
Y = D_0 \cdot \overline{S_1} \cdot \overline{S_0}
  + D_1 \cdot \overline{S_1} \cdot S_0
  + D_2 \cdot S_1 \cdot \overline{S_0}
  + D_3 \cdot S_1 \cdot S_0
$$

Já a função lógica do multiplexador 4 x 1 tem 4 entradas de dados (D0, D1, D2, D3), uma saída Y e um seletor S de 2 bits (S0 e S1). As entradas de seleção (So e S1) determinam qual dessas entradas de dados será observada na saída Y.
