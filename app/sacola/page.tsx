"use client";

import Link from "next/link";
import {StoreHeader,StoreFooter} from "@/components/store-chrome";
import {formatBRL,getLook,sizes,type Size} from "@/lib/catalog";
import {setBagQuantity,setBagSize,useBag} from "@/lib/bag";

export default function Sacola(){
  const items=useBag();
  const visible=items.map((item)=>({item,look:getLook(item.slug)})).filter((row)=>row.look);
  const subtotal=visible.reduce((sum,{item,look})=>sum+(look?.demoPriceCents??0)*item.quantity,0);
  const count=items.reduce((sum,item)=>sum+item.quantity,0);
  const missingSize=visible.some(({item})=>!item.size);
  return <main><StoreHeader/><section className="bag-page"><p className="eyebrow">Sua seleção</p><h1>Sacola de <em>interesse.</em></h1>{visible.length?<div className="bag-layout"><div className="bag-list">{visible.map(({item,look})=>{
    if(!look)return null;
    const otherQuantity=items.filter((other)=>other.slug===item.slug&&other.size!==item.size).reduce((sum,other)=>sum+other.quantity,0);
    const sizeLabel=item.size?` tamanho ${item.size}`:" sem tamanho";
    return <article className="bag-row" key={`${item.slug}:${item.size??"sem-tamanho"}`}><Link href={`/produto/${look.slug}`}><img src={look.image} alt={look.alt}/></Link><div><p className="eyebrow">{look.category}</p><h2><Link href={`/produto/${look.slug}`}>{look.title}</Link></h2><p><strong>{formatBRL(look.demoPriceCents)}</strong> por unidade · preço fictício</p><p>Estoque ilustrativo: {look.demoStock} {look.demoStock===1?"unidade":"unidades"}</p><label className="bag-size">Tamanho<select aria-label={`Tamanho de ${look.title}`} value={item.size??""} onChange={(event)=>setBagSize(item.slug,item.size,event.target.value as Size)}><option value="" disabled>Escolha</option>{sizes.map((size)=><option key={size} value={size}>{size}</option>)}</select></label>{!item.size&&<p className="bag-size-notice">Escolha um tamanho para consultar este look.</p>}<div className="quantity-control"><button aria-label={`Diminuir quantidade de ${look.title}${sizeLabel}`} onClick={()=>setBagQuantity(item.slug,item.size,item.quantity-1)}>−</button><span>{item.quantity}</span><button aria-label={`Aumentar quantidade de ${look.title}${sizeLabel}`} disabled={item.quantity+otherQuantity>=look.demoStock} onClick={()=>setBagQuantity(item.slug,item.size,item.quantity+1)}>+</button></div><button className="text-action" onClick={()=>setBagQuantity(item.slug,item.size,0)}>Remover</button></div></article>;
  })}</div><aside className="bag-summary"><h2>Resumo da seleção</h2><p>{count} {count===1?"referência":"referências"}</p><div><span>Subtotal demonstrativo</span><strong>{formatBRL(subtotal)}</strong></div><div><span>Entrega</span><strong>A confirmar</strong></div><p>Preços e estoques são fictícios. A loja confirmará valores e disponibilidade antes de qualquer pedido ou cobrança.</p>{missingSize?<><p className="bag-size-notice" role="status">Escolha o tamanho dos looks para continuar.</p><button className="primary-action" disabled>Consultar com a loja</button></>:<Link className="primary-action" href="/checkout">Consultar com a loja</Link>}<Link className="secondary-action" href="/produtos">Continuar explorando</Link></aside></div>:<div className="empty-results"><h2>Sua sacola está vazia.</h2><p>Escolha os looks que gostaria de consultar.</p><Link className="primary-action" href="/produtos">Explorar a loja</Link></div>}</section><StoreFooter/></main>;
}
