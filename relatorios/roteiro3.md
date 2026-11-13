# Laboratório de Sistemas Digitais — Experimento 03

## Objetivos

- Implementar circuitos combinacionais simples baseados em FPGA, utilizando atribuições condicionais e atribuições seletivas da linguagem de descrição de hardware VHDL.
- Desenvolver módulos básicos — um decodificador e um multiplexador — que poderão ser usados posteriormente para construir sistemas mais complexos.

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

Utilizando atribuições condicionais (*when-else*), escrever em VHDL e simular uma entidade que descreva um multiplexador 8 para 1 (8x1). Essa entidade deve ter dois vetores de entrada (S com 3 bits e D com 8 bits) e um bit de saída (Y). A tabela verdade do multiplexador é apresentada abaixo.

| Entradas (S) | Saída (Y) |
|:---:|:---:|
| `000` | D0 |
| `001` | D1 |
| `010` | D2 |
| `011` | D3 |
| `100` | D4 |
| `101` | D5 |
| `110` | D6 |
| `111` | D7 |

## Questão 02

Utilizando atribuições seletivas (*with-select*), escrever em VHDL e simular uma entidade que descreva um decodificador de 4 para 16. Essa entidade deve ter como entrada um vetor A de 4 bits e, como saída, um vetor Y de 16 bits. A tabela verdade do decodificador é apresentada abaixo.

| Entradas (A) | Saída (Y) |
|:---:|:---:|
| `0000` | `0000 0000 0000 0001` |
| `0001` | `0000 0000 0000 0010` |
| `0010` | `0000 0000 0000 0100` |
| `0011` | `0000 0000 0000 1000` |
| `0100` | `0000 0000 0001 0000` |
| `0101` | `0000 0000 0010 0000` |
| `0110` | `0000 0000 0100 0000` |
| `0111` | `0000 0000 1000 0000` |
| `1000` | `0000 0001 0000 0000` |
| `1001` | `0000 0010 0000 0000` |
| `1010` | `0000 0100 0000 0000` |
| `1011` | `0000 1000 0000 0000` |
| `1100` | `0001 0000 0000 0000` |
| `1101` | `0010 0000 0000 0000` |
| `1110` | `0100 0000 0000 0000` |
| `1111` | `1000 0000 0000 0000` |
