# Laboratório de Sistemas Digitais — Experimento 04

## Objetivos

- Aprender como utilizar multiplexadores e decodificadores para implementar circuitos lógicos combinacionais.
- Estudar técnicas de projeto modular em VHDL, desenvolvendo grandes sistemas construídos utilizando outros sistemas menores, interligados entre si.

## Instruções

- O experimento deve ser realizado utilizando o ModelSim;
- Cada experimento será avaliado por meio do relatório técnico e dos códigos submetidos pelo aluno, por meio da plataforma Aprender. Os códigos devem ser submetidos comprimidos em um único arquivo.
- A sua simulação deve incluir o arquivo vhdl contendo a entidade (*entity*), a arquitetura (*architecture*) do circuito e o arquivo vhdl do *test bench* desenvolvido para simulá-los Conforme descrito no guia de uso, o seu relatório deve conter os códigos, as telas de compilação e simulação do ModelSim e as formas de ondas obtidas com a simulação.
- O relatório é individual e receberá uma nota de 0 a 10, considerando os seguintes aspectos:
  - Documentação do código, contida no relatorio (pdf) e no codigo vhdl- 20% da nota do projeto;
  - Compilação do código, apresentada no relatorio do projeto econfirmado pelo codigo vhd -10% da nota do projeto;
  - Simulação do código, apresentada no relatório do projeto econfirmado pelo codigo vhd - 70% da nota do projeto.
- Os códigos VHDL das entidades e arquiteturas desenvolvidas neste experimento e no experimento anterior serão utilizadas em experimentos futuros para construir sistemas mais complexos.

## Questão 01

Escrever em VHDL e simular no ModelSim uma entidade com 3 bits de entrada (A, B e C) e 2 bits de saída (X e Y), que implemente as funções Booleanas abaixo. Para isso, sua arquitetura deve usar somente dois multiplexadores de 4 entradas (entidade desenvolvida na Questão 02 do Experimento 2, utilizada aqui como “component”) e uma porta inversora.

$$
X = \overline{A}\cdot B\cdot C + A\cdot\overline{B}\cdot\overline{C} + A\cdot B
$$

$$
Y = \overline{A}\cdot\overline{B} + \overline{A}\cdot B\cdot\overline{C} + A\cdot B\cdot C
$$

## Questão 02

Escrever em VHDL e simular no ModelSim uma entidade com 7 bits de entrada (A, B, C, D, E, F e G) e 1 bit de saída (S), que implemente a função Booleana abaixo. Para isso, sua arquitetura deve usar somente um decodificador de 4 para 16 (entidade desenvolvida na Questão 2 do Experimento 3, utilizada aqui como “component”), um multiplexador de 8 entradas (entidade desenvolvida no Questão 1 do Experimento 3, também utilizada aqui como “component”) e três portas OU.

**Dica:** use as variáveis E, F e G como entradas de seleção do multiplexador.

$$
\begin{aligned}
S ={}& F\cdot G
  + A\cdot B\cdot C\cdot D\cdot\overline{E}\cdot\overline{F}\cdot G \\
 &+ \overline{A}\cdot\overline{B}\cdot\overline{C}\cdot\overline{D}\cdot\overline{E}\cdot\overline{F}\cdot G
  + A\cdot\overline{B}\cdot C\cdot E\cdot F\cdot\overline{G} \\
 &+ \overline{A}\cdot B\cdot C\cdot D\cdot\overline{E}\cdot F\cdot\overline{G}
  + A\cdot B\cdot C\cdot D\cdot E\cdot\overline{F}\cdot\overline{G} \\
 &+ A\cdot\overline{B}\cdot\overline{C}\cdot D\cdot E\cdot\overline{F}\cdot\overline{G}
\end{aligned}
$$
