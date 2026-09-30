"use client";

import {useEffect} from "react";

export function ScrollReveal(){
  useEffect(()=>{
    if(typeof IntersectionObserver==="undefined"||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;

    const seen=new WeakSet<Element>();
    const observer=new IntersectionObserver((entries)=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        entry.target.classList.remove("reveal-pending");
        observer.unobserve(entry.target);
      }
    },{threshold:0.08,rootMargin:"0px 0px -32px 0px"});

    const register=()=>{
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element)=>{
        if(seen.has(element))return;
        seen.add(element);
        const rect=element.getBoundingClientRect();
        if(rect.top>window.innerHeight-32){
          element.classList.add("reveal-pending");
          observer.observe(element);
        }
      });
    };

    register();
    const mutations=new MutationObserver(register);
    mutations.observe(document.body,{subtree:true,childList:true});
    return()=>{mutations.disconnect();observer.disconnect()};
  },[]);
  return null;
}
