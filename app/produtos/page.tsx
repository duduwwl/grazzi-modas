import { Suspense } from "react";
import ProductCatalog from "@/components/product-catalog";
import { StoreHeader, StoreFooter } from "@/components/store-chrome";
import { LookCard } from "@/components/look-card";
import { looks } from "@/lib/catalog";

function CatalogPreview() {
  return <main>
    <StoreHeader />
    <section className="catalog-heading">
      <p className="eyebrow">Grazzi Modas / Produtos</p>
      <h1>Encontre seu <em>próximo look.</em></h1>
      <p>Explore as composições fotografadas na Grazzi Modas. Os preços e estoques exibidos são fictícios para demonstração; confirme os dados reais com a loja.</p>
    </section>
    <section className="catalog-main">
      <div className="product-grid catalog-grid">{looks.map((look) => <LookCard look={look} key={look.slug} />)}</div>
    </section>
    <StoreFooter />
  </main>;
}

export default function ProductsPage() {
  return <Suspense fallback={<CatalogPreview />}><ProductCatalog /></Suspense>;
}
