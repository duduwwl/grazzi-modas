"use client";

import {Suspense, useEffect, useState} from "react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {StoreHeader, StoreFooter} from "@/components/store-chrome";
import {ProductActions} from "@/components/product-actions";
import {useDemoLooks} from "@/lib/demo-management";

function NewProductDetail() {
  const params = useSearchParams();
  const catalog = useDemoLooks();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);
  const look = catalog.find((item) => item.slug.startsWith("local-") && item.slug === params.get("id"));
  return <main><StoreHeader/>{!loaded ? <section className="bag-page"><p>Carregando produto demonstrativo...</p></section> : look ? <><div className="breadcrumbs"><Link href="/">Início</Link> / <Link href="/produtos">Produtos</Link> / {look.title}</div><section className="detail-layout"><ProductActions look={look}/></section></> : <section className="bag-page"><h1>Produto indisponível.</h1><p>Este produto demonstrativo existe apenas no navegador onde foi cadastrado.</p><Link className="primary-action" href="/produtos">Voltar aos produtos</Link></section>}<StoreFooter/></main>;
}

export default function NewProductPage() {
  return <Suspense fallback={<main><StoreHeader/><section className="bag-page"><p>Carregando produto demonstrativo...</p></section><StoreFooter/></main>}><NewProductDetail/></Suspense>;
}
