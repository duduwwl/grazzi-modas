"use client";
import {useState} from "react";
import Link from "next/link";
import {addToBag} from "@/lib/bag";
import {Dialog,DialogContent,DialogTitle,DialogTrigger} from "@/components/ui/dialog";
import {formatBRL,sizes,type Look,type Size} from "@/lib/catalog";

export function ProductActions({look}:{look:Look}){
  const [size,setSize]=useState<Size|null>(null);
  const [feedback,setFeedback]=useState("");
  const add=()=>{
    if(!size){setFeedback("Escolha um tamanho antes de adicionar à sacola.");return}
    setFeedback(addToBag(look.slug,size)?`Tamanho ${size} adicionado à seleção ✓`:"Limite do estoque ilustrativo atingido.");
  };
  return <>
    <div className="detail-image"><Dialog><DialogTrigger aria-label="Ampliar fotografia"><img src={look.image} alt={look.alt}/><span>Ampliar foto ⤢</span></DialogTrigger><DialogContent className="zoom-dialog"><DialogTitle className="sr-only">Fotografia ampliada de {look.title}</DialogTitle><img src={look.image} alt={look.alt}/></DialogContent></Dialog></div>
    <div className="detail-info">
      <p className="eyebrow">{look.category} / Grazzi Modas</p><h1>{look.title}</h1><p className="detail-note">{look.note}</p>
      <p className="detail-price">{formatBRL(look.demoPriceCents)} <span>Preço fictício</span></p>
      <div className="detail-availability"><strong>Estoque ilustrativo</strong><span>{look.demoStock} {look.demoStock===1?"unidade":"unidades"} para demonstração</span></div>
      <fieldset className="size-picker"><legend>Escolha o tamanho</legend><div className="size-options">{sizes.map((option)=><button type="button" key={option} aria-pressed={size===option} onClick={()=>{setSize(option);setFeedback("")}}>{option}</button>)}</div><p>Disponibilidade por tamanho a confirmar com a loja.</p></fieldset>
      <button className="primary-action" disabled={look.demoStock===0} onClick={add}>{look.demoStock===0?"Indisponível na demonstração":"Adicionar à sacola de interesse"}</button>
      {feedback&&<p className="action-feedback" role="status">{feedback}</p>}
      <Link className="secondary-action" href="/sacola">Ver minha seleção</Link>
      <p className="detail-disclaimer">Preço e estoque são fictícios. A sacola reúne referências para consulta, sem cobrança nesta etapa.</p>
    </div>
  </>;
}
