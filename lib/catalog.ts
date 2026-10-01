export const productCategories = ["Calças", "Saias", "Vestidos", "Blusas", "Looks"] as const;
export type ProductCategory = (typeof productCategories)[number];

export type Look = {
  slug: string;
  title: string;
  category: ProductCategory;
  image: string;
  alt: string;
  note: string;
  demoPriceCents: number;
  demoStock: number;
};

export const sizes = ["P", "M", "G", "GG"] as const;
export type Size = (typeof sizes)[number];
export const isSize = (value: unknown): value is Size => sizes.some((size) => size === value);

// Valores e quantidades fictícios, apenas para demonstrar a experiência da loja.
// Substituir pelo cadastro real antes de habilitar pedidos ou pagamentos.
export const looks: Look[] = [
  { slug: "look-marrom-corset-saia", title: "Corset e saia curta marrom", category: "Looks", image: "/grazzi-modas/looks/look-marrom-corset-saia.png", alt: "Modelo com corset marrom e saia curta drapeada na Grazzi Modas", note: "Composição marrom com corset estruturado e saia curta drapeada, fotografada na loja.", demoPriceCents: 27990, demoStock: 5 },
  { slug: "vestido-preto-curto", title: "Vestido preto curto", category: "Vestidos", image: "/grazzi-modas/looks/vestido-preto-curto.png", alt: "Modelo com vestido preto curto de alças finas", note: "Vestido preto curto de alças finas, fotografado na Grazzi Modas.", demoPriceCents: 18990, demoStock: 6 },
  { slug: "vestido-marrom-assimetrico", title: "Vestido marrom assimétrico", category: "Vestidos", image: "/grazzi-modas/looks/vestido-marrom-assimetrico.png", alt: "Modelo com vestido marrom de um ombro só e barra assimétrica", note: "Vestido marrom de um ombro só com barra assimétrica.", demoPriceCents: 22990, demoStock: 5 },
  { slug: "blusa-renda-marrom", title: "Blusa de renda marrom", category: "Blusas", image: "/grazzi-modas/looks/blusa-renda-marrom.png", alt: "Modelo com blusa longa de renda marrom sobre jeans azul", note: "Blusa marrom de renda, fotografada com jeans azul.", demoPriceCents: 14990, demoStock: 7 },
  { slug: "blusa-bege-babados", title: "Blusa bege com babados", category: "Blusas", image: "/grazzi-modas/looks/blusa-bege-babados.png", alt: "Modelo com blusa bege de babados frontais e jeans azul", note: "Blusa bege com babados frontais, fotografada com jeans azul.", demoPriceCents: 13990, demoStock: 7 },
  { slug: "vestido-longo-animal-print", title: "Vestido longo animal print", category: "Vestidos", image: "/grazzi-modas/looks/vestido-longo-animal-print.png", alt: "Modelo com vestido longo de estampa animal print", note: "Vestido longo com estampa animal print e cintura marcada.", demoPriceCents: 24990, demoStock: 5 },
  { slug: "look-marrom-corset-saia-longa", title: "Corset e saia longa marrom", category: "Looks", image: "/grazzi-modas/looks/look-marrom-corset-saia-longa.png", alt: "Modelo com corset marrom e saia longa fluida na Grazzi Modas", note: "Composição marrom com corset e saia longa leve, fotografada na loja.", demoPriceCents: 29990, demoStock: 5 },
  { slug: "calca-ampla-marrom", title: "Calça ampla marrom", category: "Calças", image: "/grazzi-modas/looks/calca-marrom.png", alt: "Modelo com calça ampla marrom, top branco e blazer claro na Grazzi Modas", note: "Calça ampla marrom apresentada com top branco e blazer claro.", demoPriceCents: 18990, demoStock: 8 },
  { slug: "saia-longa-camadas", title: "Saia longa em camadas", category: "Saias", image: "/grazzi-modas/looks/saia-camadas.png", alt: "Modelo com saia longa de camadas em tom dourado na Grazzi Modas", note: "Saia longa em camadas, fotografada com top branco e blazer claro.", demoPriceCents: 24990, demoStock: 5 },
  { slug: "jeans-aplicacoes", title: "Jeans com aplicações", category: "Calças", image: "/grazzi-modas/looks/jeans-aplicacoes.png", alt: "Modelo com jeans amplo escuro com aplicações e blusa marrom", note: "Jeans amplo escuro com aplicações, apresentado com blusa marrom.", demoPriceCents: 21990, demoStock: 6 },
  { slug: "look-preto", title: "Look preto", category: "Looks", image: "/grazzi-modas/looks/look-preto.png", alt: "Modelo com look preto e óculos na loja Grazzi Modas", note: "Composição em preto, fotografada na loja.", demoPriceCents: 29990, demoStock: 4 },
  { slug: "look-camisa-colete", title: "Camisa branca e colete preto", category: "Looks", image: "/grazzi-modas/looks/look-camisa.png", alt: "Modelo com camisa branca, colete preto e saia preta", note: "Camisa branca, colete preto e saia curta preta em uma composição da loja.", demoPriceCents: 27990, demoStock: 3 },
  { slug: "saia-poas", title: "Saia branca de poás", category: "Saias", image: "/grazzi-modas/looks/saia-poas.png", alt: "Modelo com saia branca de poás pretos e camisa branca", note: "Saia branca de poás pretos, apresentada com camisa branca.", demoPriceCents: 16990, demoStock: 7 },
  { slug: "jeans-azul", title: "Jeans azul e corset claro", category: "Looks", image: "/grazzi-modas/looks/jeans-azul.png", alt: "Modelo com jeans azul amplo e corset claro", note: "Jeans azul amplo e corset claro, fotografados na Grazzi Modas.", demoPriceCents: 25990, demoStock: 5 },
];

export const getLook = (slug: string) => looks.find((look) => look.slug === slug);
export const formatBRL = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
