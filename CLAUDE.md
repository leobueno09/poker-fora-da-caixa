# CLAUDE.md — Poker Fora da Caixa Website

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.
- **Read this file entirely** before starting any task — brand rules are non-negotiable.

---

## Project Context
- **O que é:** Consultoria de palestras e treinamentos corporativos que aplica conceitos de poker (decisão sob incerteza, gestão de risco, leitura de pessoas, controle emocional) a executivos e times de liderança.
- **Fundador:** Leonardo Bueno — palestrante, ex-parceiro QG Akkari Team.
- **Público-alvo:** C-level, diretores, gestores, RH corporativo de empresas de médio e grande porte.
- **Slogan oficial:** "Transforme suas decisões, jogue para ganhar!"
- **Contato:** contato@pokerforadacaixa.com.br | (11) 9 7530-1170

---

## Brand Identity

### Paleta de Cores — usar CSS variables abaixo, sem exceção
```css
:root {
  --color-bg: #0F0F0F;
  --color-surface: #1C1C1C;
  --color-border: #2A2A2A;
  --color-divider: #3A3A3A;
  --color-primary: #B8E600;
  --color-primary-dark: #8FB300;
  --color-text: #FFFFFF;
  --color-text-secondary: #B0B0B0;
  --color-accent: #C8102E;
  --color-navy: #1E2D3D;
  --color-cream: #F0EDE8;
  --font-primary: 'Poppins', sans-serif;
}
```

### Tipografia
- **Fonte única:** Poppins (Google Fonts) — Bold para títulos e CTAs, Medium para subtítulos e nav, Regular para corpo, Light para captions.
- Tracking apertado (`-0.03em`) em headings grandes.
- Line-height generoso (`1.7`) no corpo de texto.

### Hierarquia de cores
| Elemento | Cor | Peso |
|---|---|---|
| Títulos | #FFFFFF | Poppins Bold |
| Corpo | #B0B0B0 | Poppins Regular |
| Destaques / links | #B8E600 | Poppins Bold |
| Botão primário | bg #B8E600, text #0F0F0F | — |
| Botão hover | bg #8FB300, text #0F0F0F | — |

### Espaçamento
- Border radius: 8px (elementos pequenos) a 16px (cards)
- Padding interno: 24px–40px
- Gap entre seções: 48px–80px

### Logo
- Sempre sobre fundo escuro (#0F0F0F ou similar).
- Área de respiro mínima: 20% do tamanho do logo.
- Não distorcer, não adicionar sombras ou efeitos, não alterar cores internas.
- Composição: símbolo + "POKER" (branco bold) + "FORA DA CAIXA" (verde limão #B8E600).
- Tamanho mínimo do símbolo: 32px.
- O logo foi atualizado — usar sempre o arquivo mais recente em `brand_assets/`.

---

## Tom & Voz
- **Personalidade:** estratégica, desafiadora, profissional sofisticada, dinâmica, acessível.
- **Tom em textos:** executivo e direto — sem ser engessado. Provoca reflexão, tira da zona de conforto.
- **Nunca usar:** jargões óbvios de poker ("apostar no sucesso", "blefar no mercado"), linguagem genérica de IA ("mergulhar", "navegar", "robusto", "transformador", "ecossistema").
- **Sempre usar:** exemplos concretos antes de conceitos abstratos. CTA claro ao final de cada seção.

---

## Reference Images
- Se uma imagem de referência for fornecida: replicar layout, espaçamento, tipografia e cor exatamente. Trocar por placeholder content. Não melhorar nem adicionar ao design.
- Se não houver referência: criar com alto nível de craft seguindo os guardrails abaixo.
- Screenshot do output, comparar com referência, corrigir divergências, re-screenshot. Mínimo 2 rodadas. Parar só quando não houver diferenças visíveis ou o usuário indicar.

---

## Local Server
- **Sempre servir em localhost** — nunca screenshot de URL `file:///`.
- Iniciar o servidor: `node serve.mjs` (serve o root do projeto em `http://localhost:3000`)
- `serve.mjs` está na raiz do projeto. Iniciar em background antes de qualquer screenshot.
- Se o servidor já estiver rodando, não iniciar uma segunda instância.

---

## Screenshot Workflow
- Puppeteer instalado em `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache em `C:/Users/nateh/.cache/puppeteer/`.
- **Sempre screenshot de localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots salvos em `./temporary screenshots/screenshot-N.png` (auto-incrementado, nunca sobrescrito).
- Sufixo opcional: `node screenshot.mjs http://localhost:3000 label` → salva como `screenshot-N-label.png`
- `screenshot.mjs` está na raiz. Usar como está.
- Após screenshot, ler o PNG de `temporary screenshots/` com a ferramenta Read — Claude consegue ver e analisar a imagem diretamente.
- Na comparação, ser específico: "heading está em 32px mas referência mostra ~24px", "gap do card é 16px mas deveria ser 24px"
- Verificar: espaçamento/padding, tamanho/peso/line-height da fonte, cores (hex exato), alinhamento, border-radius, sombras, tamanho de imagens.

---

## Output Defaults
- Arquivo único `index.html`, todos os estilos inline, exceto se o usuário pedir diferente.
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Imagens placeholder: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsivo.

---

## Brand Assets
- Verificar sempre a pasta `brand_assets/` antes de criar qualquer coisa. Pode conter logo, fotos e vídeos do site.
- Se o logo estiver presente, usar. Se a paleta de cores estiver definida (está, acima), usar os valores exatos — não inventar cores.
- Não usar placeholders onde assets reais estão disponíveis.

---

## Anti-Generic Guardrails
- **Cores:** Nunca usar a paleta padrão do Tailwind (indigo-500, blue-600, etc.). Usar sempre as CSS variables da marca definidas acima.
- **Sombras:** Nunca usar `shadow-md` flat. Usar sombras em camadas, com tint de cor e baixa opacidade.
- **Tipografia:** Apenas Poppins — variar o peso conforme hierarquia definida acima.
- **Gradientes:** Camadas de gradientes radiais. Adicionar grain/textura via SVG noise filter para profundidade.
- **Animações:** Animar apenas `transform` e `opacity`. Nunca `transition-all`. Usar easing estilo spring.
- **Estados interativos:** Todo elemento clicável precisa de estados hover, focus-visible e active. Sem exceções.
- **Imagens:** Adicionar overlay de gradiente (`bg-gradient-to-t from-black/60`) e camada de tratamento de cor com `mix-blend-multiply`.
- **Espaçamento:** Usar os tokens definidos acima — não usar steps aleatórios do Tailwind.
- **Profundidade:** Superfícies devem ter sistema de camadas (base → elevated → floating), não todas no mesmo z-plane.

---

## Hard Rules
- Não adicionar seções, features ou conteúdo que não estejam na referência ou solicitados explicitamente.
- Não "melhorar" um design de referência — replicar.
- Não parar após uma rodada de screenshot.
- Não usar `transition-all`.
- Não usar azul/indigo padrão do Tailwind como cor primária.
- Não distorcer o logo nem aplicar efeitos sobre ele.
- Todo texto do site em PT-BR.
