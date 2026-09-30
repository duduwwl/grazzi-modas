"use client";

import {useEffect,useMemo,useState} from "react";
import {useSearchParams} from "next/navigation";
import {Search} from "lucide-react";
import {StoreHeader,StoreFooter} from "@/components/store-chrome";
import {LookCard} from "@/components/look-card";
import {looks} from "@/lib/catalog";

const categories=["Todos","Calças","Saias","Looks"] as const;

export default function Produtos(){
  const searchParams=useSearchParams();
  const requestedCategory=searchParams.get("categoria");
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState<string>("Todos");
  const [sort,setSort]=useState("destaque");
  useEffect(()=>{setCategory(requestedCategory&&categories.includes(requestedCategory as typeof categories[number])?requestedCategory:"Todos")},[requestedCategory]);
  const filtered=useMemo(()=>{
    const normalized=query.trim().toLocaleLowerCase("pt-BR");
    const rows=looks.filter((look)=>(category==="Todos"||look.category===category)&&(!normalized||`${look.title} ${look.category} ${look.note}`.toLocaleLowerCase("pt-BR").includes(normalized)));
    if(sort==="az")rows.sort((a,b)=>a.title.localeCompare(b.title,"pt-BR"));
    if(sort==="za")rows.sort((a,b)=>b.title.localeCompare(a.title,"pt-BR"));
    if(sort==="menor")rows.sort((a,b)=>a.demoPriceCents-b.demoPriceCents);
    if(sort==="maior")rows.sort((a,b)=>b.demoPriceCents-a.demoPriceCents);
    return rows;
  },[query,category,sort]);
  return <main><StoreHeader/><section className="catalog-heading"><p className="eyebrow">Grazzi Modas / Produtos</p><h1>Encontre seu <em>próximo look.</em></h1><p>Explore as composições fotografadas na Grazzi Modas. Os preços e estoques exibidos são fictícios para demonstração; confirme os dados reais com a loja.</p></section><section className="catalog-main"><div className="catalog-tools"><label className="search-field"><Search size={19}/><span className="sr-only">Buscar looks</span><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar looks" type="search"/></label><label className="sort-field">Ordenar <select value={sort} onChange={(e)=>setSort(e.target.value)}><option value="destaque">Destaques</option><option value="menor">Menor preço</option><option value="maior">Maior preço</option><option value="az">Nome A–Z</option><option value="za">Nome Z–A</option></select></label></div><div className="catalog-categories" aria-label="Categorias">{categories.map((name)=><button type="button" aria-pressed={category===name} className={category===name?"active":""} onClick={()=>setCategory(name)} key={name}>{name}</button>)}</div><div className="catalog-result"><span>{filtered.length} {filtered.length===1?"look":"looks"}</span><span>Preços e estoques demonstrativos</span></div>{filtered.length?<div className="product-grid catalog-grid">{filtered.map((look)=><LookCard look={look} key={look.slug}/>)}</div>:<div className="empty-results"><h2>Nenhum look encontrado.</h2><p>Tente outra palavra ou escolha uma categoria diferente.</p><button onClick={()=>{setQuery("");setCategory("Todos")}}>Limpar busca</button></div>}</section><StoreFooter/></main>;
}
