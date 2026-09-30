export type Look = {
  slug: string;
  title: string;
  category: "Calças" | "Saias" | "Looks";
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
