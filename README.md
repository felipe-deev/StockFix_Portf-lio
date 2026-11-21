# StockFix — Portfólio

Apresentação interativa do **StockFix**, um sistema em desenvolvimento para pequenas empresas que compram em caixas e revendem em unidades ou pacotinhos.

O portfólio explica o fluxo de compras, estoque e vendas, apresenta uma prévia ilustrativa do painel e permite experimentar uma operação com dados fictícios. Este repositório contém a apresentação; não é o sistema de gestão e não acessa dados de empresas.

## Como abrir

1. Baixe o projeto pelo botão **Code → Download ZIP** e extraia o arquivo.
2. Abra **Portfolio.html** no navegador.
3. Mantenha as pastas **css**, **js** e **img** junto do HTML.

Não é necessário instalar dependências, configurar banco de dados ou iniciar um servidor. As fontes são carregadas pelo Google Fonts; sem internet, o navegador utiliza fontes do sistema.

## O que você encontra

- **Prévia do painel:** exemplo visual da tela de saldo de estoque, com dados ilustrativos.
- **Como funciona:** caminho da mercadoria, do cadastro e recebimento até a preparação e venda.
- **Demonstração interativa:** recebimento, montagem de pacotinhos e venda com atualização dos saldos.
- **Recursos:** organização dos produtos, movimentações, compras, pedidos e acesso da equipe.
- **Detalhes técnicos e evolução:** painéis expansíveis com as tecnologias e as etapas entregues ou planejadas.
- **Contato:** cartões que abrem uma mensagem no aplicativo de e-mail do visitante ou o perfil profissional no LinkedIn. Nenhuma mensagem é enviada automaticamente.

O guia **Como explorar este portfólio**, logo abaixo da abertura, também explica a navegação.

## Como usar a demonstração

1. Clique em **Receber uma caixa**: entram 500 unidades no estoque do exemplo.
2. Clique em **Montar 10 pacotinhos**: 200 unidades ficam embaladas em pacotes de 20, e 300 continuam soltas. O total permanece 500.
3. Clique em **Vender 5 pacotinhos**: saem 100 unidades. Restam 400, sendo 300 soltas e 100 embaladas.

O controle deslizante permite ajustar a quantidade de pacotinhos respeitando o saldo disponível. **Recomeçar demonstração** volta ao início. Todos esses movimentos são locais e fictícios; não alteram estoque real.

## Aparência e acessibilidade

O fundo é branco por padrão. O botão de tema ao lado de **O painel** alterna entre claro e escuro e salva a preferência quando o navegador permite armazenamento local.

Ao rolar a página, textos e cartões se reconstroem por partículas. Os efeitos usam máscaras SVG e canvas, sem bibliotecas adicionais. Com a opção **reduzir movimento** ativada no dispositivo, o conteúdo aparece diretamente. O layout se adapta a computadores, tablets e celulares.

## Estrutura do projeto

```text
Portfolio.html   Conteúdo, navegação e contatos
css/style.css    Layout responsivo, temas e estilos
js/main.js       Demonstração, troca de tema e partículas
img/icon.svg    Ícone do projeto
```

As pastas de backup e arquivos ZIP ficam fora do versionamento.

## Tecnologias desta apresentação

HTML, CSS e JavaScript, sem etapa de build. As tecnologias do sistema StockFix são descritas na área de detalhes técnicos da página e não são dependências deste portfólio.

## Status

Portfólio de um projeto em desenvolvimento. A prévia e a demonstração usam dados de exemplo; os recursos planejados são identificados separadamente. O envio deste código ao GitHub não publica automaticamente um site acessível pelo navegador.
