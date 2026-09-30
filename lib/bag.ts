"use client";

import {useEffect,useState} from "react";
import {isSize,type Size} from "@/lib/catalog";
import {getDemoLook} from "@/lib/demo-management";

export type BagItem={slug:string;size:Size|null;quantity:number};
const KEY="grazzi-bag-v1";

// Preserve older selections without assigning a size the visitor did not choose.
const read=():BagItem[]=>{
  try{
    const value=JSON.parse(localStorage.getItem(KEY)||"[]");
    if(!Array.isArray(value))return [];
    const items:BagItem[]=[];
    for(const raw of value){
      if(!raw||typeof raw.slug!=="string"||!Number.isInteger(raw.quantity)||raw.quantity<1)continue;
      const look=getDemoLook(raw.slug);
      if(!look||look.demoStock<1)continue;
      const size:Size|null=isSize(raw.size)?raw.size:null;
      const used=items.filter((item)=>item.slug===raw.slug).reduce((sum,item)=>sum+item.quantity,0);
      const quantity=Math.min(raw.quantity,look.demoStock-used);
      if(quantity<1)continue;
      const existing=items.find((item)=>item.slug===raw.slug&&item.size===size);
      if(existing)existing.quantity+=quantity;
      else items.push({slug:raw.slug,size,quantity});
    }
    return items;
  }catch{return []}
};

const write=(items:BagItem[])=>{localStorage.setItem(KEY,JSON.stringify(items));window.dispatchEvent(new Event("grazzi-bag-change"))};

export function addToBag(slug:string,size:Size){
  const look=getDemoLook(slug);
  if(!look||!isSize(size)||look.demoStock<1)return false;
  const items=read();
  const used=items.filter((item)=>item.slug===slug).reduce((sum,item)=>sum+item.quantity,0);
  if(used>=look.demoStock)return false;
  const existing=items.find((item)=>item.slug===slug&&item.size===size);
  if(existing)existing.quantity+=1;
  else items.push({slug,size,quantity:1});
  write(items);
  return true;
}

export function setBagQuantity(slug:string,size:Size|null,quantity:number){
  const items=read();
  const stock=getDemoLook(slug)?.demoStock??0;
  const others=items.filter((item)=>item.slug===slug&&item.size!==size).reduce((sum,item)=>sum+item.quantity,0);
  const next=Math.max(0,Math.min(stock-others,Math.floor(quantity)));
  write(items.map((item)=>item.slug===slug&&item.size===size?{...item,quantity:next}:item).filter((item)=>item.quantity>0));
}

export function setBagSize(slug:string,oldSize:Size|null,size:Size){
  if(!isSize(size))return;
  const items=read();
  const current=items.find((item)=>item.slug===slug&&item.size===oldSize);
  if(!current)return;
  const existing=items.find((item)=>item.slug===slug&&item.size===size);
  if(existing&&existing!==current){
    existing.quantity+=current.quantity;
    write(items.filter((item)=>item!==current));
  }else{
    current.size=size;
    write(items);
  }
}

export function useBag(){
  const [items,setItems]=useState<BagItem[]>([]);
  useEffect(()=>{const sync=()=>setItems(read());sync();window.addEventListener("grazzi-bag-change",sync);window.addEventListener("storage",sync);return()=>{window.removeEventListener("grazzi-bag-change",sync);window.removeEventListener("storage",sync)}},[]);
  return items;
}
