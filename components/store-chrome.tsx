"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, Settings2, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useBag } from "@/lib/bag";

function Wordmark() {
  return <img className="brand-logo" src="/grazzi-modas/brand/grazzi-instagram.jpg" alt="Grazzi Modas · Moda Feminina" />;
}

export function StoreHeader() {
  const items = useBag();
  const [open, setOpen] = useState(false);
  const count = items.reduce((n, item) => n + item.quantity, 0);

  return <>
    <header className="site-header">
      <div className="mobile-menu">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger aria-label="Abrir menu"><Menu size={24}/></SheetTrigger>
          <SheetContent side="left" className="store-menu">
            <SheetTitle className="sr-only">Navegação</SheetTitle>
            <Link onClick={() => setOpen(false)} className="wordmark" href="/"><Wordmark/></Link>
            <nav>
              <Link onClick={() => setOpen(false)} href="/produtos">Produtos</Link>
              <Link onClick={() => setOpen(false)} href="/#sobre">Nossa loja</Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <Link href="/" className="wordmark" aria-label="Grazzi Modas, início"><Wordmark/></Link>
      <nav className="desktop-nav" aria-label="Navegação principal">
        <Link href="/produtos">Produtos</Link>
        <Link href="/#sobre">Nossa loja</Link>
      </nav>
      <div className="header-actions">
        <Link href="/produtos" aria-label="Buscar produtos"><Search size={20}/></Link>
        <Link href="/sacola" aria-label={`Sacola com ${count} ${count === 1 ? "look" : "looks"}`}><ShoppingBag size={20}/>{count > 0 && <span className="bag-count">{count}</span>}</Link>
      </div>
    </header>
  </>;
}

export function StoreFooter() {
  return <footer className="footer" data-reveal>
    <div>
      <Link href="/" className="wordmark"><Wordmark/></Link>
      <p>Moda feminina em Lavras, Minas Gerais.</p>
      <Link className="manager-link" href="/gerencia" aria-label="Área da gerência"><Settings2 size={16} aria-hidden="true"/><span>Gerência</span></Link>
    </div>
    <div>
      <strong>Visite a loja</strong>
      <p><a href="https://www.google.com/maps/search/?api=1&query=Rua+Doutor+Francisco+Salles+722+Lavras+MG" target="_blank" rel="noreferrer">Como chegar</a></p>
    </div>
    <div>
      <strong>Conecte-se</strong>
      <p><a href="https://www.instagram.com/grazzimodas/" target="_blank" rel="noreferrer">Instagram</a></p>
      <p><a href="https://wa.me/553538219394" target="_blank" rel="noreferrer">WhatsApp</a></p>
      <a href="tel:+553538219394">(35) 3821-9394</a>
    </div>
  </footer>;
}
