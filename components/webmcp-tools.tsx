"use client";
import {useEffect} from "react";
import {addToBag} from "@/lib/bag";
import {getLook} from "@/lib/catalog";

type Context={registerTool:(tool:{name:string;title:string;description:string;inputSchema:object;annotations:{readOnlyHint:boolean;untrustedContentHint:boolean};execute:(input:unknown)=>unknown},options:{signal:AbortSignal})=>void|Promise<void>};

export function WebMcpTools(){useEffect(()=>{const context=(document as Document&{modelContext?:Context}).modelContext;if(!context?.registerTool)return;const lifecycle=new AbortController();try{void Promise.resolve(context.registerTool({name:"add_look_to_selection",title:"Adicionar look à seleção",description:"Adiciona à sacola de interesse um look já identificado no catálogo da Grazzi Modas. Não cria pedido nem pagamento.",inputSchema:{type:"object",properties:{slug:{type:"string",description:"Identificador do look no catálogo"}},required:["slug"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||typeof input!=="object"||typeof (input as {slug?:unknown}).slug!=="string")throw new Error("Informe um slug válido.");const slug=(input as {slug:string}).slug;const look=getLook(slug);if(!look)throw new Error("Look não encontrado.");if(!addToBag(slug))throw new Error("Limite do estoque ilustrativo atingido.");return{status:"added",look:look.title}}},{signal:lifecycle.signal})).catch(()=>{})}catch{}return()=>lifecycle.abort()},[]);return null}
