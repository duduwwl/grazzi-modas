"use client";

import {useMemo,useState} from "react";
import Link from "next/link";
import {StoreHeader,StoreFooter} from "@/components/store-chrome";
import {formatBRL,getLook} from "@/lib/catalog";
import {useBag} from "@/lib/bag";

const digits=(value:string)=>value.replace(/\D/g,"");
const phoneMask=(value:string)=>{const n=digits(value).slice(0,11);if(n.length<=2)return n?`(${n}`:"";if(n.length<=6)return `(${n.slice(0,2)}) ${n.slice(2)}`;return `(${n.slice(0,2)}) ${n.slice(2,n.length===11?7:6)}-${n.slice(n.length===11?7:6)}`};
const cepMask=(value:string)=>{const n=digits(value).slice(0,8);return n.length>5?`${n.slice(0,5)}-${n.slice(5)}`:n};

export default function Checkout(){
  const items=useBag();
  const [mode,setMode]=useState<"retirada"|"entrega">("retirada");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [phone,setPhone]=useState("");
  const [cep,setCep]=useState("");
  const [city,setCity]=useState("");
  const [state,setState]=useState("");
  const [error,setError]=useState("");
  const selected=useMemo(()=>items.map((item)=>({item,look:getLook(item.slug)})).filter((row)=>row.look),[items]);
  const subtotal=selected.reduce((sum,{item,look})=>sum+(look?.demoPriceCents??0)*item.quantity,0);
  const whatsapp=()=>{
    setError("");
    if(!selected.length){setError("Sua sacola está vazia.");return}
    if(name.trim().length<2||!email.includes("@")||digits(phone).length<10){setError("Preencha nome, e-mail e telefone válidos.");return}
    if(mode==="entrega"&&(digits(cep).length!==8||!city.trim()||state.length!==2)){setError("Informe CEP, cidade e estado para consultar a entrega.");return}
    const lines=selected.map(({item,look})=>`${item.quantity}× ${look?.title}`).join("\n");
    const message=`Olá, Grazzi Modas! Gostaria de consultar estes looks:\n${lines}\n\nAtendimento: ${name.trim()}\nOpção: ${mode==="retirada"?"retirada na loja":`entrega para ${city.trim()}/${state}, CEP ${cep}`}.\nVi preços e estoques demonstrativos no site. Podem confirmar os valores reais, tamanhos, disponibilidade e ${mode==="retirada"?"retirada":"frete"}?`;
    window.open(`https://wa.me/553538219394?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
  };
  return <main><StoreHeader/><section className="checkout-page"><p className="eyebrow">Consulta de looks</p><h1>Vamos conversar<br/><em>sobre sua seleção.</em></h1><p className="checkout-intro">Preços e estoques nesta prévia são fictícios. Esta etapa solicita uma cotação à loja; nenhum pedido ou pagamento é criado.</p><div className="checkout-layout"><div className="checkout-form"><fieldset><legend>Seus dados</legend><div className="form-grid"><label>Nome completo<input autoComplete="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Seu nome"/></label><label>E-mail<input type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="voce@exemplo.com"/></label><label>Telefone / WhatsApp<input type="tel" autoComplete="tel" value={phone} onChange={(e)=>setPhone(phoneMask(e.target.value))} placeholder="(35) 99999-9999"/></label></div></fieldset><fieldset><legend>Como prefere receber?</legend><div className="delivery-options"><label className={mode==="retirada"?"selected":""}><input type="radio" name="mode" checked={mode==="retirada"} onChange={()=>setMode("retirada")}/><strong>Retirar na loja</strong><span>Rua Doutor Francisco Salles, 722 · Lavras, MG</span><small>Sem taxa de entrega</small></label><label className={mode==="entrega"?"selected":""}><input type="radio" name="mode" checked={mode==="entrega"} onChange={()=>setMode("entrega")}/><strong>Receber no endereço</strong><span>Disponibilidade e valor do frete serão confirmados pela loja.</span></label></div>{mode==="entrega"&&<div className="form-grid address-grid"><label>CEP<input inputMode="numeric" autoComplete="postal-code" value={cep} onChange={(e)=>setCep(cepMask(e.target.value))} placeholder="00000-000"/></label><label>Cidade<input autoComplete="address-level2" value={city} onChange={(e)=>setCity(e.target.value)}/></label><label>Estado<select value={state} onChange={(e)=>setState(e.target.value)}><option value="">Selecione</option>{["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf)=><option key={uf}>{uf}</option>)}</select></label></div>}</fieldset><div className="payment-note"><h2>Pagamento</h2><p>PIX e cartão serão disponibilizados após a definição do provedor de pagamento e dos preços reais. Este site não coleta dados de cartão.</p></div></div><aside className="bag-summary"><h2>Seus looks</h2>{selected.map(({item,look})=>look&&<div className="checkout-item" key={item.slug}><img src={look.image} alt=""/><span>{look.title}<small>{item.quantity} × {formatBRL(look.demoPriceCents)} (fictício)</small></span></div>)}<div><span>Subtotal demonstrativo</span><strong>{formatBRL(subtotal)}</strong></div><div><span>{mode==="retirada"?"Retirada":"Entrega"}</span><strong>{mode==="retirada"?"Sem taxa":"A confirmar"}</strong></div><div><span>Total demonstrativo</span><strong>{mode==="retirada"?formatBRL(subtotal):"A confirmar"}</strong></div><p>Você confirmará os valores reais com a loja antes de comprar.</p>{error&&<p className="form-error" role="alert">{error}</p>}<button className="primary-action" onClick={whatsapp}>Solicitar cotação via WhatsApp</button><Link className="secondary-action" href="/sacola">Voltar à sacola</Link></aside></div></section><StoreFooter/></main>;
}
