// app/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    }
    return [];
  });
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (nome: string, preco: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.nome === nome);
      if (existing) {
        return prev.map((item) =>
          item.nome === nome ? { ...item, qtd: item.qtd + 1 } : item
        );
      }
      return [...prev, { nome, preco, qtd: 1 }];
    });
  };

  const changeQtd = (index: number, change: number) => {
    setCart((prev) => {
      const newCart = [...prev];
      newCart[index].qtd += change;
      if (newCart[index].qtd <= 0) newCart.splice(index, 1);
      return newCart;
    });
  };

  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Gallery / Lightbox functions
  const openGallery = (images: string[], index: number) => {
    setGalleryImages(images);
    setCurrentIndex(index);
    document.getElementById("gallery")?.classList.add("show");
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const closeGallery = (e: any) => {
    if (e.target.id === "gallery") {
      document.getElementById("gallery")?.classList.remove("show");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.preco * item.qtd, 0);

  return (
    <>
      <style>{`
        ${`/* Cole todo o CSS que você tinha no <style> aqui */`}
      `}</style>

      <div id="lightbox" onClick={() => document.getElementById("lightbox")?.classList.remove("show")}>
        <img id="lightbox-img" />
      </div>

      <div id="gallery" onClick={closeGallery}>
        <span className="close">✕</span>
        <img id="gallery-img" src={galleryImages[currentIndex]} />
        <div className="nav prev" onClick={prevImage}>‹</div>
        <div className="nav next" onClick={nextImage}>›</div>
        <div id="thumbs">
          {galleryImages.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setCurrentIndex(i)}
              className={i === currentIndex ? "active" : ""}
            />
          ))}
        </div>
      </div>

      <header>
        <input type="checkbox" id="sidemenu-drawer" />
        <label htmlFor="sidemenu-drawer" className="menu-toggle">
          <span className="hamburger"></span>
          <svg strokeWidth="1" className="close-icon">
            <path d="M6 6L18 18M18 6L6 18" stroke="black" />
          </svg>
        </label>

        <div className="side-menu">
          <a href="#">Vestidos Longos</a>
          <a href="#">Vestidos Curtos</a>
          <a href="#">Macacão</a>
          <a href="#">Macaquinho</a>
          <a href="#">Acessórios</a>
          <a href="#">Chapéus</a>
          <a href="#">Bolsas</a>
        </div>

        <div className="logo">MAREVA</div>
        <div className="menu">
          <a href="#colecao">Coleção</a>
          <a href="#historia">Sobre a MAREVA</a>
          <a href="https://instagram.com/mareva.rio" target="_blank" className="insta-link">IG</a>
          <div className="cart-icon" onClick={() => document.getElementById("cart")?.classList.add("open")}>
            🛒 <span id="count">{cart.reduce((sum, item) => sum + item.qtd, 0)}</span>
          </div>
        </div>
      </header>

      <div id="overlay" onClick={() => document.getElementById("cart")?.classList.remove("open")}></div>

      <section className="hero">
        <div>
          <h1>Feita de sal, sol e mar</h1>
          <p>Elegância natural para dias inesquecíveis</p>
          <a href="#colecao" className="buy-btn">Ver Coleção</a>
        </div>
      </section>

      <section className="section" id="colecao">
        <h2>Coleção Verão</h2>
        <div className="products">
          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80"
              style={{ cursor: "zoom-in" }}
              onClick={() =>
                openGallery(
                  [
                    "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
                  ],
                  0
                )
              }
            />
            <h3>Vestido Brisa Tropical</h3>
            <p>R$ 189.90</p>
            <div className="buy-btn" onClick={() => addToCart("Vestido Brisa Tropical", 189.9)}>
              Adicionar ao carrinho
            </div>
          </div>
        </div>
      </section>

      <section className="section story" id="historia">
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e" />
        <div className="story-text">
          <h2>Nossa Essência</h2>
          <p>
            A Mareva nasce do encontro entre o mar, o sol e a liberdade.
            Cada peça é pensada para mulheres que querem se sentir leves,
            elegantes e conectadas com a natureza.
          </p>
        </div>
      </section>

      <footer>© 2026 Mareva — Todos os direitos reservados</footer>

      <div id="cart">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Carrinho</h3>
          <span onClick={() => document.getElementById("cart")?.classList.remove("open")} style={{ cursor: "pointer", fontSize: 20 }}>✕</span>
        </div>
        <div id="items">
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <p>{item.nome}</p>
              <p>R$ {item.preco}</p>
              <div className="qtd-control">
                <button onClick={() => changeQtd(index, -1)}>-</button>
                <span>{item.qtd}</span>
                <button onClick={() => changeQtd(index, 1)}>+</button>
              </div>
              <button className="remove-btn" onClick={() => removeItem(index)}>Remover</button>
            </div>
          ))}
        </div>
        <p>Total: R$ <span id="total">{total.toFixed(2)}</span></p>
        <a href="/checkout" className="buy-btn">Finalizar</a>
      </div>
    </>
  );
}import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
