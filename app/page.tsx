import Link from "next/link";
import { StoreHeader, StoreFooter } from "@/components/store-chrome";

export default function Home() {
  return (
    <main>
      <StoreHeader />

      <section className="campaign" aria-label="Campanha Grazzi Modas">
        <div className="campaign-image campaign-left"><img src="/grazzi-modas/looks/look-preto.png" alt="Look preto da Grazzi Modas" /></div>
        <div className="campaign-image campaign-center"><img src="/grazzi-modas/looks/saia-camadas.png" alt="Saia longa em camadas fotografada na loja Grazzi Modas" /></div>
        <div className="campaign-image campaign-right"><img src="/grazzi-modas/looks/jeans-azul.png" alt="Look com jeans azul fotografado na loja Grazzi Modas" /></div>
        <div className="campaign-copy" data-reveal>
          <p>Grazzi Modas · Lavras</p>
          <h1>Vista o seu<br/><em>próximo momento.</em></h1>
          <Link href="/produtos">Descubra os looks <span aria-hidden="true">→</span></Link>
        </div>
        <span className="campaign-side">MODA FEMININA / LAVRAS</span>
      </section>

      <section className="category-editorial" aria-label="Explore as categorias">
        <div className="category-intro" data-reveal>
          <p className="eyebrow">Escolha por peça</p>
          <h2>Seu estilo, <em>seu jeito.</em></h2>
        </div>
        <div className="category-links">
          <Link data-reveal href="/produtos?categoria=Cal%C3%A7as"><img loading="lazy" src="/grazzi-modas/looks/calca-marrom.png" alt="Calça ampla marrom" /><span>Calças</span></Link>
          <Link data-reveal href="/produtos?categoria=Saias"><img loading="lazy" src="/grazzi-modas/looks/saia-camadas.png" alt="Saia longa em camadas" /><span>Saias</span></Link>
          <Link data-reveal href="/produtos?categoria=Looks"><img loading="lazy" src="/grazzi-modas/looks/look-camisa.png" alt="Look com camisa branca e colete preto" /><span>Looks</span></Link>
        </div>
      </section>

      <section className="store-story" id="sobre">
        <div className="store-story-image" data-reveal><img loading="lazy" src="/grazzi-modas/looks/store-story-enhanced.png" alt="Composição fotografada na Grazzi Modas em Lavras" /></div>
        <div className="store-story-copy" data-reveal>
          <p className="eyebrow">A Grazzi em Lavras</p>
          <h2>Mais de 20 anos vestindo mulheres com estilo.</h2>
          <p>Rua Doutor Francisco Salles, 722<br/>Lavras, Minas Gerais</p>
          <a href="https://www.google.com/maps/search/?api=1&query=Rua+Doutor+Francisco+Salles+722+Lavras+MG" target="_blank" rel="noreferrer">Venha nos visitar</a>
        </div>
      </section>
      <StoreFooter />
    </main>
  );
}
