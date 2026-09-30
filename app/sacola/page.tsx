"use client";

import Link from "next/link";
import {StoreHeader,StoreFooter} from "@/components/store-chrome";
import {formatBRL,getLook} from "@/lib/catalog";
import {setBagQuantity,useBag} from "@/lib/bag";

export default function Sacola(){
  const items=useBag();
  const visible=items.map((item)=>({item,look:getLook(item.slug)})).filter((row)=>row.look);
  const subtotal=visible.reduce((sum,{item,look})=>sum+(look?.demoPriceCents??0)*item.quantity,0);
  return <main><StoreHeader/><section className="bag-page"><p className="eyebrow">Sua seleção</p><h1>Sacola de <em>interesse.</em></h1>{visible.length?<div className="bag-layout"><div className="bag-list">{visible.map(({item,look})=>look&&<article className="bag-row" key={item.slug}><Link href={`/produto/${look.slug}`}><img src={look.image} alt={look.alt}/></Link><div><p className="eyebrow">{look.category}</p><h2><Link href={`/produto/${look.slug}`}>{look.title}</Link></h2><p><strong>{formatBRL(look.demoPriceCents)}</strong> por unidade · preço fictício</p><p>Estoque ilustrativo: {look.demoStock} {look.demoStock===1?"unidade":"unidades"}</p><div className="quantity-control"><button aria-label={`Diminuir quantidade de ${look.title}`} onClick={()=>setBagQuantity(item.slug,item.quantity-1)}>−</button><span>{item.quantity}</span><button aria-label={`Aumentar quantidade de ${look.title}`} disabled={item.quantity>=look.demoStock} onClick={()=>setBagQuantity(item.slug,item.quantity+1)}>+</button></div><button className="text-action" onClick={()=>setBagQuantity(item.slug,0)}>Remover</button></div></article>)}</div><aside className="bag-summary"><h2>Resumo da seleção</h2><p>{items.reduce((n,x)=>n+x.quantity,0)} {items.reduce((n,x)=>n+x.quantity,0)===1?"referência":"referências"}</p><div><span>Subtotal demonstrativo</span><strong>{formatBRL(subtotal)}</strong></div><div><span>Entrega</span><strong>A confirmar</strong></div><p>Preços e estoques são fictícios. A loja confirmará valores e disponibilidade antes de qualquer pedido ou cobrança.</p><Link className="primary-action" href="/checkout">Consultar com a loja</Link><Link className="secondary-action" href="/produtos">Continuar explorando</Link></aside></div>:<div className="empty-results"><h2>Sua sacola está vazia.</h2><p>Escolha os looks que gostaria de consultar.</p><Link className="primary-action" href="/produtos">Explorar a loja</Link></div>}</section><StoreFooter/></main>;
}
