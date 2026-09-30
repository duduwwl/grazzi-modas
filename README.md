# Grazzi Modas

Site demonstrativo da Grazzi Modas em Lavras, publicado em [GitHub Pages](https://duduwwl.github.io/grazzi-modas/).

## Páginas

- Página inicial
- Catálogo com busca, filtros e ordenação
- Páginas dos sete looks
- Sacola de interesse
- Consulta de looks via WhatsApp

Os preços e estoques são fictícios. A sacola não cria pedidos nem cobra pagamentos; a loja confirma os dados reais no atendimento.

## Desenvolvimento

Requer Node.js 22.13 ou superior e pnpm.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm build` gera as páginas estáticas em `out/`. O GitHub Pages publica a cópia versionada em `docs/` na branch `main`. Após alterar o site, gere uma nova versão e atualize `docs/` com o conteúdo de `out/`, preservando `docs/.nojekyll`.
