import Link from "next/link";
import {formatBRL,type Look} from "@/lib/catalog";
export function LookCard({look}:{look:Look}){return <Link className="product-tile" href={`/produto/${look.slug}`}><div className="product-image"><img loading="lazy" src={look.image} alt={look.alt}/></div><div className="product-meta"><span>{look.category}</span><strong>{look.title}</strong><b className="demo-price">{formatBRL(look.demoPriceCents)}</b><small>Estoque ilustrativo: {look.demoStock} {look.demoStock===1?"unidade":"unidades"}</small></div></Link>}
