"use client";

import {useState, type FormEvent} from "react";
import Link from "next/link";
import {StoreHeader, StoreFooter} from "@/components/store-chrome";
import {formatBRL, looks, type Look} from "@/lib/catalog";
import {removeDemoLook, saveDemoLook, updateDemoOrderStatus, useDemoLooks, useDemoOrders, type DemoOrder} from "@/lib/demo-management";

const categories: Look["category"][] = ["Calças", "Saias", "Looks"];
const sampleImages = looks.map((look) => ({image: look.image, label: look.title}));
const toPriceInput = (cents: number) => (cents / 100).toFixed(2).replace(".", ",");
const fromPriceInput = (value: string) => {
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const number = Number(normalized);
  return Number.isFinite(number) && number >= 0 ? Math.round(number * 100) : NaN;
};
const detailHref = (look: Look) => look.slug.startsWith("local-") ? `/produto/novo/?id=${encodeURIComponent(look.slug)}` : `/produto/${look.slug}`;

function ProductEditor({look}: {look: Look}) {
  const [price, setPrice] = useState(toPriceInput(look.demoPriceCents));
  const [stock, setStock] = useState(String(look.demoStock));
  const [feedback, setFeedback] = useState("");
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const demoPriceCents = fromPriceInput(price);
    const demoStock = Number(stock);
    if (!Number.isInteger(demoPriceCents) || !Number.isInteger(demoStock) || demoStock < 0) {
      setFeedback("Informe preço e estoque válidos."); return;
    }
    setFeedback(saveDemoLook({...look, demoPriceCents, demoStock}) ? "Produto atualizado neste navegador." : "Não foi possível salvar neste navegador.");
  };
  return <form className="manager-product" onSubmit={save}>
    <img src={look.image} alt=""/>
    <div className="manager-product-name"><strong>{look.title}</strong><small>{look.category} · {look.slug.startsWith("local-") ? "Adicionado aqui" : "Catálogo inicial"}</small><Link href={detailHref(look)}>Ver na vitrine</Link></div>
    <label>Preço fictício (R$)<input inputMode="decimal" value={price} onChange={(event) => {setPrice(event.target.value); setFeedback("");}} required/></label>
    <label>Estoque ilustrativo<input type="number" min="0" max="100000" value={stock} onChange={(event) => {setStock(event.target.value); setFeedback("");}} required/></label>
    <div className="manager-product-actions"><button type="submit">Salvar</button>{look.slug.startsWith("local-") && <button type="button" className="manager-text-button" onClick={() => removeDemoLook(look.slug)}>Remover</button>}{feedback && <small role="status">{feedback}</small>}</div>
  </form>;
}

export default function Gerencia() {
  const catalog = useDemoLooks();
  const orders = useDemoOrders();
  const [tab, setTab] = useState<"pedidos" | "estoque" | "adicionar">("pedidos");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Look["category"]>("Calças");
  const [image, setImage] = useState(sampleImages[0].image);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState("");

  const addProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const demoPriceCents = fromPriceInput(price);
    const demoStock = Number(stock);
    if (!title.trim() || !Number.isInteger(demoPriceCents) || !Number.isInteger(demoStock) || demoStock < 0) {
      setFeedback("Preencha nome, preço e estoque válidos."); return;
    }
    const look: Look = {
      slug: `local-${Date.now().toString(36)}`, title: title.trim(), category, image,
      alt: title.trim(), note: note.trim() || `${title.trim()} no catálogo demonstrativo da Grazzi Modas.`,
      demoPriceCents, demoStock,
    };
    if (!saveDemoLook(look)) {setFeedback("Não foi possível salvar neste navegador."); return;}
    setTitle(""); setPrice(""); setStock(""); setNote(""); setFeedback("Produto adicionado à vitrine neste navegador.");
  };

  return <main><StoreHeader/><section className="manager-page">
    <div className="manager-heading"><div><p className="eyebrow">Grazzi Modas · demonstração</p><h1>Área da <em>gerência.</em></h1></div><Link href="/produtos">Ver vitrine →</Link></div>
    <div className="manager-notice" role="note"><strong>Prévia local</strong><p>Pedidos, estoque e produtos desta área ficam salvos somente neste navegador. Visitantes e outros dispositivos não compartilham estes dados. Não use informações reais de clientes. Para operar a loja de verdade, é necessário conectar um sistema com login e banco de dados.</p></div>
    <div className="manager-tabs" role="tablist" aria-label="Gerência">
      <button type="button" role="tab" aria-selected={tab === "pedidos"} onClick={() => setTab("pedidos")}>Pedidos <span>{orders.length}</span></button>
      <button type="button" role="tab" aria-selected={tab === "estoque"} onClick={() => setTab("estoque")}>Estoque <span>{catalog.length}</span></button>
      <button type="button" role="tab" aria-selected={tab === "adicionar"} onClick={() => setTab("adicionar")}>Adicionar produto</button>
    </div>
    {tab === "pedidos" && <section className="manager-panel"><h2>Pedidos simulados</h2><p>As finalizações do checkout feitas neste navegador aparecem aqui.</p>{orders.length ? <div className="manager-orders">{orders.map((order) => <article className="manager-order" key={order.id}><div className="manager-order-top"><div><strong>#{order.id}</strong><small>{new Date(order.createdAt).toLocaleString("pt-BR")}</small></div><b>{formatBRL(order.totalCents)}</b></div><p>{order.customer} · {order.fulfillment === "retirada" ? "Retirada" : "Entrega"} · {order.payment === "pix" ? "Pix" : order.payment === "debito" ? "Débito" : "Crédito"}</p><ul>{order.items.map((item, index) => <li key={`${item.slug}-${index}`}>{item.quantity} × {item.title} · {item.size}</li>)}</ul><label>Situação <select value={order.status} onChange={(event) => updateDemoOrderStatus(order.id, event.target.value as DemoOrder["status"])}><option>Novo</option><option>Em separação</option><option>Concluído</option><option>Cancelado</option></select></label></article>)}</div> : <div className="manager-empty">Ainda não há pedidos simulados neste navegador.</div>}</section>}
    {tab === "estoque" && <section className="manager-panel"><h2>Preço e estoque</h2><p>Edite os valores demonstrativos. As alterações aparecem na vitrine deste navegador.</p><div className="manager-products">{catalog.map((look) => <ProductEditor key={look.slug} look={look}/>)}</div></section>}
    {tab === "adicionar" && <section className="manager-panel"><h2>Adicionar produto</h2><p>Escolha uma foto da galeria existente para esta demonstração. O novo produto aparece na vitrine deste navegador.</p><form className="manager-new-form" onSubmit={addProduct}>
      <label>Nome do produto<input maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Calça pantalona" required/></label>
      <label>Categoria<select value={category} onChange={(event) => setCategory(event.target.value as Look["category"])}>{categories.map((name) => <option key={name}>{name}</option>)}</select></label>
      <label>Foto disponível<select value={image} onChange={(event) => setImage(event.target.value)}>{sampleImages.map((sample) => <option key={sample.image} value={sample.image}>{sample.label}</option>)}</select></label>
      <div className="manager-image-preview"><img src={image} alt="Prévia da foto selecionada"/></div>
      <label>Preço fictício (R$)<input inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="199,90" required/></label>
      <label>Estoque ilustrativo<input type="number" min="0" max="100000" value={stock} onChange={(event) => setStock(event.target.value)} placeholder="5" required/></label>
      <label className="manager-note">Descrição<textarea maxLength={300} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Descreva o produto"/></label>
      <button className="primary-action" type="submit">Adicionar à vitrine</button>{feedback && <p role="status">{feedback}</p>}
    </form></section>}
  </section><StoreFooter/></main>;
}
