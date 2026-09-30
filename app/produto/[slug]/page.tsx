import type {Metadata} from "next";
import {notFound} from "next/navigation";
import Link from "next/link";
import {StoreHeader,StoreFooter} from "@/components/store-chrome";
import {LookCard} from "@/components/look-card";
import {ProductActions} from "@/components/product-actions";
import {looks,getLook} from "@/lib/catalog";

export function generateStaticParams(){return looks.map((look)=>({slug:look.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const look=getLook(slug);if(!look)return{title:"Look não encontrado | Grazzi Modas"};return{title:`${look.title} | Grazzi Modas`,description:`${look.note} Veja a fotografia e consulte disponibilidade com a Grazzi Modas em Lavras.`,openGraph:{title:`${look.title} | Grazzi Modas`,description:look.note,images:[look.image]}}}
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const look=getLook(slug);if(!look)notFound();const related=looks.filter((item)=>item.slug!==look.slug&&item.category===look.category).slice(0,3);return <main><StoreHeader/><div className="breadcrumbs"><Link href="/">Início</Link> / <Link href="/produtos">Produtos</Link> / {look.title}</div><section className="detail-layout"><ProductActions look={look}/></section><section className="related"><div className="section-intro"><div><p className="eyebrow">Para explorar</p><h2>Mais da <em>Grazzi.</em></h2></div><Link href="/produtos">Ver todos</Link></div><div className="product-grid">{related.map((item)=><LookCard look={item} key={item.slug}/>)}</div></section><StoreFooter/></main>}
