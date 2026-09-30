"use client";

import {useMemo, useState, type FormEvent} from "react";
import Link from "next/link";
import {StoreHeader, StoreFooter} from "@/components/store-chrome";
import {formatBRL, type Size} from "@/lib/catalog";
import {useBag} from "@/lib/bag";
import {addDemoOrder, useDemoLooks} from "@/lib/demo-management";

type DeliveryMode = "retirada" | "entrega";
type PaymentMethod = "pix" | "debito" | "credito";
const states = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
const digits = (value: string) => value.replace(/\D/g, "");
const phoneMask = (value: string) => {
  const n = digits(value).slice(0, 11);
  if (n.length <= 2) return n ? `(${n}` : "";
  if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, n.length === 11 ? 7 : 6)}-${n.slice(n.length === 11 ? 7 : 6)}`;
};
const cepMask = (value: string) => {
  const n = digits(value).slice(0, 8);
  return n.length > 5 ? `${n.slice(0, 5)}-${n.slice(5)}` : n;
};
const cpfMask = (value: string) => {
  const n = digits(value).slice(0, 11);
  return n.replace(/^(\d{3})(\d)/, "$1.$2").replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1-$2");
};
const paymentLabels: Record<PaymentMethod, string> = {pix: "Pix", debito: "Cartão de débito", credito: "Cartão de crédito"};

export default function Checkout() {
  const items = useBag();
  const catalog = useDemoLooks();
  const [mode, setMode] = useState<DeliveryMode>("retirada");
  const [payment, setPayment] = useState<PaymentMethod>("pix");
  const [installments, setInstallments] = useState("1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [feeMessage, setFeeMessage] = useState("");
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const [orderId, setOrderId] = useState("");

  const selected = useMemo(() => items.map((item) => ({item, look: catalog.find((look) => look.slug === item.slug)})).filter((row) => row.look), [items, catalog]);
  const subtotal = selected.reduce((sum, {item, look}) => sum + (look?.demoPriceCents ?? 0) * item.quantity, 0);
  const total = mode === "retirada" ? subtotal : deliveryFee === null ? null : subtotal + deliveryFee;

  const updateDeliveryAddress = (update: () => void) => {
    update(); setDeliveryFee(null); setFeeMessage("");
  };
  const calculateDelivery = () => {
    setDeliveryFee(null);
    if (digits(cep).length !== 8 || !city.trim() || !state) {
      setFeeMessage("Informe CEP, cidade e estado para calcular a taxa demonstrativa."); return;
    }
    const normalizedCity = city.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const fee = state === "MG" ? normalizedCity === "lavras" ? 1290 : 2990 : 4990;
    setDeliveryFee(fee);
    setFeeMessage(`Taxa fictícia calculada: ${formatBRL(fee)}. A loja deverá confirmar o valor real.`);
    setError("");
  };
  const finishDemo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError("");
    if (!selected.length) { setError("Sua sacola está vazia. Escolha um look para simular o checkout."); return; }
    if (selected.some(({item}) => !item.size)) { setError("Escolha o tamanho de todos os looks na sacola."); return; }
    if (name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || digits(phone).length < 10) {
      setError("Preencha nome, e-mail e telefone válidos."); return;
    }
    if (mode === "entrega") {
      if (digits(cep).length !== 8 || !street.trim() || !number.trim() || !neighborhood.trim() || !city.trim() || !state) {
        setError("Preencha o endereço completo para a entrega."); return;
      }
      if (deliveryFee === null) { setError("Calcule a taxa demonstrativa de entrega antes de continuar."); return; }
    }
    const id = `${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    if (!addDemoOrder({id, createdAt: new Date().toISOString(), customer: name.trim(), items: selected.map(({item, look}) => ({slug: item.slug, title: look!.title, size: item.size as Size, quantity: item.quantity})), fulfillment: mode, payment, totalCents: total ?? subtotal, status: "Novo"})) {
      setError("Não foi possível guardar a simulação neste navegador."); return;
    }
    setOrderId(id);
    setCompleted(true);
    window.scrollTo({top: 0, behavior: "smooth"});
  };

  return <main><StoreHeader/><section className="checkout-page">
    <p className="eyebrow">Checkout demonstrativo</p>
    <h1>Seu próximo look,<br/><em>do seu jeito.</em></h1>
    <p className="checkout-intro">Preencha os dados para simular a finalização. Preços, estoques e taxas são fictícios. A simulação fica apenas neste navegador, sem envio à loja ou pagamento.</p>
    {completed ? <div className="checkout-success" role="status">
      <p className="eyebrow">Simulação concluída</p><h2>Seu look está quase lá.</h2>
      <p>Simulação #{orderId} salva neste navegador para aparecer na área da gerência. Nada foi enviado à Grazzi Modas e você não foi cobrada.</p>
      <div><span>Recebimento</span><strong>{mode === "retirada" ? "Retirada na loja" : "Entrega"}</strong></div>
      <div><span>Pagamento escolhido</span><strong>{paymentLabels[payment]}{payment === "credito" ? ` · ${installments}x` : ""}</strong></div>
      <div><span>Total demonstrativo</span><strong>{formatBRL(total ?? subtotal)}</strong></div>
      <Link className="primary-action" href="/produtos">Voltar aos produtos</Link>
    </div> : <form className="checkout-layout" onSubmit={finishDemo} noValidate>
      <div className="checkout-form">
        <fieldset><legend>Seus dados</legend><div className="form-grid">
          <label>Nome completo<input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" required/></label>
          <label>E-mail<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" required/></label>
          <label>Telefone / WhatsApp<input type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(phoneMask(e.target.value))} placeholder="(35) 99999-9999" required/></label>
          <label>CPF <small>(opcional; use dados fictícios)</small><input inputMode="numeric" autoComplete="off" value={cpf} onChange={(e) => setCpf(cpfMask(e.target.value))} placeholder="000.000.000-00"/></label>
        </div></fieldset>
        <fieldset><legend>Como prefere receber?</legend><div className="delivery-options">
          <label className={mode === "retirada" ? "selected" : ""}><input type="radio" name="mode" checked={mode === "retirada"} onChange={() => {setMode("retirada"); setError("");}}/><strong>Retirar na loja</strong><span>Rua Doutor Francisco Salles, 722 · Lavras, MG</span><small>Sem taxa de entrega</small></label>
          <label className={mode === "entrega" ? "selected" : ""}><input type="radio" name="mode" checked={mode === "entrega"} onChange={() => {setMode("entrega"); setError("");}}/><strong>Receber no endereço</strong><span>Informe o endereço e calcule uma taxa fictícia de entrega.</span></label>
        </div>
        {mode === "entrega" && <div className="delivery-address"><div className="form-grid address-grid">
          <label>CEP<input inputMode="numeric" autoComplete="postal-code" value={cep} onChange={(e) => updateDeliveryAddress(() => setCep(cepMask(e.target.value)))} placeholder="00000-000" required/></label>
          <label>Rua / Avenida<input autoComplete="address-line1" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Nome da via" required/></label>
          <label>Número<input autoComplete="off" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Número" required/></label>
          <label>Complemento <small>(opcional)</small><input autoComplete="address-line2" value={complement} onChange={(e) => setComplement(e.target.value)} placeholder="Apto, bloco..."/></label>
          <label>Bairro<input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Bairro" required/></label>
          <label>Cidade<input autoComplete="address-level2" value={city} onChange={(e) => updateDeliveryAddress(() => setCity(e.target.value))} placeholder="Cidade" required/></label>
          <label>Estado<select autoComplete="address-level1" value={state} onChange={(e) => updateDeliveryAddress(() => setState(e.target.value))} required><option value="">Selecione</option>{states.map((uf) => <option key={uf} value={uf}>{uf}</option>)}</select></label>
        </div><div className="shipping-calculator"><button type="button" onClick={calculateDelivery}>Calcular taxa de entrega</button><p role="status">{feeMessage || "Lavras/MG: R$ 12,90 · outras cidades de MG: R$ 29,90 · demais estados: R$ 49,90. Valores fictícios."}</p></div></div>}
        </fieldset>
        <fieldset><legend>Forma de pagamento</legend><div className="payment-options">
          {(["pix", "debito", "credito"] as const).map((method) => <label key={method} className={payment === method ? "selected" : ""}><input type="radio" name="payment" checked={payment === method} onChange={() => setPayment(method)}/><strong>{paymentLabels[method]}</strong><small>{method === "pix" ? "Simulação sem chave ou QR Code" : "Nenhum dado de cartão é solicitado"}</small></label>)}
        </div>
        {payment === "credito" && <label className="installments-field">Parcelamento demonstrativo<select value={installments} onChange={(e) => setInstallments(e.target.value)}>{[1,2,3].map((count) => <option key={count} value={count}>{count}x de aproximadamente {formatBRL(Math.round((total ?? subtotal) / count))} sem juros</option>)}</select></label>}
        <p className="checkout-help">A forma de pagamento é apenas ilustrativa. Não informe número, validade ou código de segurança de cartão.</p>
        </fieldset>
        <fieldset><legend>Observações</legend><label className="notes-field">Alguma informação para a simulação? <small>(opcional)</small><textarea value={notes} onChange={(e) => setNotes(e.target.value.slice(0, 500))} placeholder="Ex.: preferência de horário ou referência para entrega" maxLength={500}/></label></fieldset>
      </div>
      <aside className="bag-summary checkout-summary"><h2>Resumo do checkout</h2>
        {selected.length ? selected.map(({item, look}) => look && <div className="checkout-item" key={`${item.slug}:${item.size ?? "sem-tamanho"}`}><img src={look.image} alt=""/><span>{look.title}<small>Tamanho: {item.size ?? "a escolher"} · {item.quantity} × {formatBRL(look.demoPriceCents)}</small></span></div>) : <p>Sua sacola está vazia.</p>}
        <div><span>Subtotal demonstrativo</span><strong>{formatBRL(subtotal)}</strong></div>
        <div><span>{mode === "retirada" ? "Retirada" : "Taxa de entrega fictícia"}</span><strong>{mode === "retirada" ? "Grátis" : deliveryFee === null ? "Calcule acima" : formatBRL(deliveryFee)}</strong></div>
        <div className="checkout-total"><span>Total demonstrativo</span><strong>{total === null ? "A calcular" : formatBRL(total)}</strong></div>
        <p>Não há cobrança nem envio à loja. A simulação é guardada somente neste navegador.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-action" type="submit">Finalizar simulação</button>
        <Link className="secondary-action" href="/sacola">Voltar à sacola</Link>
      </aside>
    </form>}
  </section><StoreFooter/></main>;
}
