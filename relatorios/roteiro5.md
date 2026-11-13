# Laboratório de Sistemas Digitais — Experimento 05

## Objetivos

- Construir um somador de palavras binárias usando somadores completos em cascata.
- Familiarizar-se com o pacote `STD_LOGIC_ARITH`.
- Desenvolver um *testbench* para simulação e teste de circuitos em VHDL.

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

Escrever em VHDL e simular no ModelSim um somador de palavras de 4 bits, construído utilizando somente somadores completos (entidade desenvolvida no visto 1 do experimento 2, utilizada aqui como “component”). A nova entidade deve ter como entrada dois vetores A e B (com 4 bits cada) e, como saída, um vetor S (com 5 bits).

## Questão 02

Escrever em VHDL e simular no ModelSim um somador de palavras de 4 bits, construído utilizando o operador `+` do pacote `STD_LOGIC_ARITH`. A nova entidade deve ter como entrada dois vetores A e B (com 4 bits cada) e, como saída, um vetor S (com 5 bits).

**Dica:** declare as entradas A e B como sendo do tipo `STD_LOGIC_VECTOR` (como feito no visto 1) e, na arquitetura, faça a conversão para o tipo `UNSIGNED` usando o comando `unsigned(.)` de modo a poder usar o operador `+`.

## Questão 03

Escrever em VHDL e simular no ModelSim um um *testbench* para simular e testar o somador de palavras de 4 bits desenvolvido no visto 1. Esse *testbench* deve gerar todas as 256 combinações possíveis de valores para A e B, aguardando 500 ns entre combinações e, para cada combinação, comparar a saída do somador do visto 1 (utilizado aqui como *device under test* ou DUT) com a saída do somador do visto 2 (utilizado aqui como *golden model*), imprimindo uma mensagem de erro se as saídas não concordarem.
