"use client";
import {useEffect,useState} from "react";
import {getLook} from "@/lib/catalog";

export type BagItem={slug:string;quantity:number};
const KEY="grazzi-bag-v1";
const read=():BagItem[]=>{try{const value=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(value)?value.flatMap((x)=>{const look=typeof x.slug==="string"?getLook(x.slug):undefined;return look&&look.demoStock>0&&Number.isInteger(x.quantity)&&x.quantity>0?[{slug:x.slug,quantity:Math.min(x.quantity,look.demoStock)}]:[]}):[]}catch{return []}};
const write=(items:BagItem[])=>{localStorage.setItem(KEY,JSON.stringify(items));window.dispatchEvent(new Event("grazzi-bag-change"))};
export function addToBag(slug:string){const look=getLook(slug);if(!look||look.demoStock<1)return false;const items=read();const existing=items.find((x)=>x.slug===slug);if(existing){if(existing.quantity>=look.demoStock)return false;existing.quantity+=1}else items.push({slug,quantity:1});write(items);return true}
export function setBagQuantity(slug:string,quantity:number){const stock=getLook(slug)?.demoStock??0;write(read().map((x)=>x.slug===slug?{...x,quantity:Math.max(0,Math.min(stock,quantity))}:x).filter((x)=>x.quantity>0))}
export function useBag(){const [items,setItems]=useState<BagItem[]>([]);useEffect(()=>{const sync=()=>setItems(read());sync();window.addEventListener("grazzi-bag-change",sync);window.addEventListener("storage",sync);return()=>{window.removeEventListener("grazzi-bag-change",sync);window.removeEventListener("storage",sync)}},[]);return items}
