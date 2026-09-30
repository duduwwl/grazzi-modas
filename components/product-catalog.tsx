"use client";

import {useEffect,useMemo,useState} from "react";
import {useSearchParams} from "next/navigation";
import {Search,SlidersHorizontal} from "lucide-react";
import {StoreHeader,StoreFooter} from "@/components/store-chrome";
import {LookCard} from "@/components/look-card";
import {useDemoLooks} from "@/lib/demo-management";

const categories=["Todos","Calças","Saias","Looks"] as const;
type PriceRange="todos"|"ate200"|"200a250"|"acima250";

export default function Produtos(){
  const looks=useDemoLooks();
  const searchParams=useSearchParams();
  const requestedCategory=searchParams.get("categoria");
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState<string>("Todos");
  const [sort,setSort]=useState("destaque");
  const [priceRange,setPriceRange]=useState<PriceRange>("todos");
  const [filtersOpen,setFiltersOpen]=useState(false);
  useEffect(()=>{setCategory(requestedCategory&&categories.includes(requestedCategory as typeof categories[number])?requestedCategory:"Todos")},[requestedCategory]);
  const filtered=useMemo(()=>{
    const normalized=query.trim().toLocaleLowerCase("pt-BR");
    const rows=looks.filter((look)=>{
      const matchesCategory=category==="Todos"||look.category===category;
      const matchesQuery=!normalized||`${look.title} ${look.category} ${look.note}`.toLocaleLowerCase("pt-BR").includes(normalized);
      const matchesPrice=priceRange==="todos"||(priceRange==="ate200"&&look.demoPriceCents<=20000)||(priceRange==="200a250"&&look.demoPriceCents>20000&&look.demoPriceCents<=25000)||(priceRange==="acima250"&&look.demoPriceCents>25000);
      return matchesCategory&&matchesQuery&&matchesPrice;
    });
    if(sort==="az")rows.sort((a,b)=>a.title.localeCompare(b.title,"pt-BR"));
    if(sort==="za")rows.sort((a,b)=>b.title.localeCompare(a.title,"pt-BR"));
    if(sort==="menor")rows.sort((a,b)=>a.demoPriceCents-b.demoPriceCents);
    if(sort==="maior")rows.sort((a,b)=>b.demoPriceCents-a.demoPriceCents);
    return rows;
  },[looks,query,category,priceRange,sort]);
  const activeFilters=(category==="Todos"?0:1)+(priceRange==="todos"?0:1);
  const clearFilters=()=>{setQuery("");setCategory("Todos");setPriceRange("todos")};
  return <main>
    <StoreHeader/>
    <section className="catalog-heading" data-reveal><p className="eyebrow">Grazzi Modas / Produtos</p><h1>Encontre seu <em>próximo look.</em></h1><p>Explore as composições fotografadas na Grazzi Modas. Os preços e estoques exibidos são fictícios para demonstração; confirme os dados reais com a loja.</p></section>
    <section className="catalog-main">
      <div className="catalog-tools" data-reveal>
        <label className="search-field"><Search size={19}/><span className="sr-only">Buscar looks</span><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar looks" type="search"/></label>
        <div className="catalog-actions"><button className="filter-toggle" type="button" aria-expanded={filtersOpen} aria-controls="catalog-filters" onClick={()=>setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={18}/> Filtrar produtos{activeFilters>0&&<span className="filter-count">{activeFilters}</span>}</button><label className="sort-field">Ordenar <select value={sort} onChange={(e)=>setSort(e.target.value)}><option value="destaque">Destaques</option><option value="menor">Menor preço</option><option value="maior">Maior preço</option><option value="az">Nome A–Z</option><option value="za">Nome Z–A</option></select></label></div>
      </div>
      {filtersOpen&&<div className="filter-panel" id="catalog-filters"><label>Categoria<select value={category} onChange={(e)=>setCategory(e.target.value)}>{categories.map((name)=><option key={name} value={name}>{name}</option>)}</select></label><label>Faixa de preço<select value={priceRange} onChange={(e)=>setPriceRange(e.target.value as PriceRange)}><option value="todos">Todos os preços</option><option value="ate200">Até R$ 200</option><option value="200a250">De R$ 200 a R$ 250</option><option value="acima250">Acima de R$ 250</option></select></label><button type="button" onClick={clearFilters}>Limpar filtros</button><small>Preços demonstrativos.</small></div>}
      <div className="catalog-categories" aria-label="Categorias" data-reveal>{categories.map((name)=><button type="button" aria-pressed={category===name} className={category===name?"active":""} onClick={()=>setCategory(name)} key={name}>{name}</button>)}</div>
      <div className="catalog-result" data-reveal><span>{filtered.length} {filtered.length===1?"look":"looks"}</span><span>Preços e estoques demonstrativos</span></div>
      {filtered.length?<div className="product-grid catalog-grid">{filtered.map((look)=><LookCard look={look} key={look.slug}/>)}</div>:<div className="empty-results" data-reveal><h2>Nenhum look encontrado.</h2><p>Tente outra palavra ou ajuste os filtros.</p><button onClick={clearFilters}>Limpar filtros</button></div>}
    </section>
    <StoreFooter/>
  </main>;
}
