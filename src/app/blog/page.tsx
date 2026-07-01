"use client";

import { useState } from "react";
import { ArrowRight, Clock3, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: "/images/hero-3-final.png" | "/images/hero-3.png" | "/images/maid-3.png";
  alt: string;
};

const featuredArticle: Article = {
  slug: "room-by-room-reset-for-a-calmer-home",
  title: "A room-by-room reset for a calmer home",
  excerpt:
    "A simple weekend routine to refresh the spaces you use most, without turning your day off into a cleaning marathon.",
  category: "Home routines",
  readTime: "6 min read",
  image: "/images/hero-3-final.png",
  alt: "Bright, clean living room prepared for a home reset",
};

const articles: Article[] = [
  {
    slug: "how-often-should-you-really-deep-clean",
    title: "How often should you really deep clean?",
    excerpt:
      "Use this seasonal checklist to keep the less-visible areas of your home in good shape.",
    category: "Deep cleaning",
    readTime: "5 min read",
    image: "/images/hero-3.png",
    alt: "Modern living room with a freshly cleaned floor and tidy furnishings",
  },
  {
    slug: "the-kitchen-cleaning-order-that-saves-time",
    title: "The kitchen cleaning order that saves time",
    excerpt:
      "Work from high-touch surfaces to the floor for a kitchen that feels clean from every angle.",
    category: "Kitchen care",
    readTime: "4 min read",
    image: "/images/maid-3.png",
    alt: "Professional cleaner wiping a kitchen counter",
  },
  {
    slug: "a-practical-guide-to-move-out-cleaning",
    title: "A practical guide to move-out cleaning",
    excerpt:
      "Plan your final clean around the details landlords and new residents notice first.",
    category: "Moving",
    readTime: "7 min read",
    image: "/images/hero-3-final.png",
    alt: "Well-kept apartment living area ready for a move-out inspection",
  },
  {
    slug: "small-habits-that-keep-bathrooms-fresh",
    title: "Small habits that keep bathrooms fresh",
    excerpt:
      "Five quick actions that make the weekly bathroom clean much easier to manage.",
    category: "Home routines",
    readTime: "3 min read",
    image: "/images/maid-3.png",
    alt: "Cleaner maintaining a polished home interior",
  },
  {
    slug: "what-a-professional-deep-clean-includes",
    title: "What a professional deep clean includes",
    excerpt:
      "Understand the difference between routine upkeep and a detailed cleaning service.",
    category: "Deep cleaning",
    readTime: "5 min read",
    image: "/images/hero-3.png",
    alt: "Sunlit apartment interior after a professional clean",
  },
  {
    slug: "preparing-your-home-before-guests-arrive",
    title: "Preparing your home before guests arrive",
    excerpt:
      "Focus on the few areas that create an immediately comfortable welcome for visitors.",
    category: "Hosting",
    readTime: "4 min read",
    image: "/images/hero-3-final.png",
    alt: "Inviting tidy living room set up for guests",
  },
];

const categories = ["All", "Home routines", "Deep cleaning", "Kitchen care", "Moving", "Hosting"];

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/#about" },
  { label: "Subscriptions", href: "/#subscriptions" },
  { label: "Blog", href: "/blog" },
];

function ArticleMeta({ category, readTime }: Pick<Article, "category" | "readTime">) {
  return (
    <div className="flex items-center gap-3 text-sm text-text-secondary">
      <span className="font-semibold text-primary">{category}</span>
      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-border" />
      <span className="inline-flex items-center gap-1.5">
        <Clock3 aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
        {readTime}
      </span>
    </div>
  );
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles = activeCategory === "All"
    ? articles
    : articles.filter(article => article.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navigation />

      <main>
        {/* Intro Section with background ambient mesh */}
        <section className="relative overflow-hidden mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 sm:pb-16 sm:pt-24 lg:px-10">
          <div className="absolute top-0 right-0 -z-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl opacity-60" />
          <div className="absolute top-12 left-1/3 -z-10 h-72 w-72 rounded-full bg-accent-soft/20 blur-3xl opacity-40" />

          <p className="mb-4 text-sm font-semibold text-primary tracking-wide uppercase">ApartmentMaid journal</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            A cleaner home starts with a clearer routine.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
            Practical home care guides from our cleaning experts, made for apartments, busy schedules, and homes that deserve to feel good.
          </p>
        </section>

        {/* Featured Guide Section (Only visible on "All" or if it matches the active category) */}
        {(activeCategory === "All" || activeCategory === featuredArticle.category) && (
          <section aria-labelledby="featured-guide" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
            <div className="grid overflow-hidden rounded-xl border border-border bg-surface shadow-[0_18px_45px_rgba(21,94,99,0.06)] transition-all duration-300 hover:shadow-[0_24px_55px_rgba(21,94,99,0.1)] md:grid-cols-2">
              <Link href={`/blog/${featuredArticle.slug}`} className="relative min-h-[320px] md:min-h-full block overflow-hidden group">
                <Image
                  alt={featuredArticle.alt}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  fill
                  preload
                  sizes="(max-width: 767px) 100vw, (max-width: 1280px) 50vw, 640px"
                  src={featuredArticle.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
              <div className="flex flex-col items-start justify-center p-8 sm:p-10 lg:p-14">
                <ArticleMeta category={featuredArticle.category} readTime={featuredArticle.readTime} />
                <h2 id="featured-guide" className="mt-5 text-3xl font-semibold text-text-primary sm:text-4xl leading-tight hover:text-primary transition-colors">
                  <Link href={`/blog/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </Link>
                </h2>
                <p className="mt-5 max-w-xl leading-7 text-text-secondary">{featuredArticle.excerpt}</p>
                <div className="mt-8 flex flex-wrap gap-4 items-center">
                  <Link
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground outline-none transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 active:translate-y-px"
                    href="/#booking"
                  >
                    Book a home refresh
                    <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                  </Link>
                  <Link
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold text-text-primary outline-none transition-colors hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 active:translate-y-px"
                    href={`/blog/${featuredArticle.slug}`}
                  >
                    Read the guide
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Guides Grid & Category Filter */}
        <section aria-labelledby="all-guides" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 border-t border-border pt-12 sm:pt-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 id="all-guides" className="text-3xl font-semibold text-text-primary sm:text-4xl">
                  Browse all guides
                </h2>
                <p className="mt-3 max-w-xl leading-7 text-text-secondary">
                  Save time on the essentials, then leave the bigger jobs to a professional when you need a hand.
                </p>
              </div>
            </div>
            
            {/* Functional Category Filter Chips */}
            <ul className="flex flex-wrap gap-2 mt-2">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => setActiveCategory(category)}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      activeCategory === category
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-surface text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Article grid */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 transition-all duration-300">
            {filteredArticles.map((article) => (
              <article
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent-warm hover:shadow-[0_18px_36px_rgba(21,94,99,0.08)]"
                key={article.title}
              >
                <Link href={`/blog/${article.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-surface-muted">
                  <Image
                    alt={article.alt}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 405px"
                    src={article.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
                <div className="flex flex-col flex-1 p-6">
                  <ArticleMeta category={article.category} readTime={article.readTime} />
                  <h3 className="mt-4 text-xl font-semibold text-text-primary leading-snug hover:text-primary transition-colors flex-1">
                    <Link href={`/blog/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-text-secondary line-clamp-2">{article.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-4">
                    <Link
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary outline-none transition-colors hover:text-primary-hover focus-visible:underline"
                      href={`/blog/${article.slug}`}
                    >
                      Read guide
                      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
                    </Link>
                    <Link
                      className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary outline-none transition-colors hover:text-primary focus-visible:underline"
                      href="/#booking"
                    >
                      Book clean
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="mt-12 text-center py-16 rounded-xl border border-dashed border-border bg-surface">
              <p className="text-text-secondary font-medium">No guides found in this category yet.</p>
            </div>
          )}
        </section>

        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-14 sm:px-8 sm:py-16 md:flex-row md:items-center lg:px-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary-foreground/80">
                <Sparkles aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
                A home that feels reset
              </div>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                Let ApartmentMaid take care of the clean.
              </h2>
              <p className="mt-4 leading-7 text-primary-foreground/80">
                Book a trusted professional for the routine clean or deep refresh your home needs.
              </p>
            </div>
            <Link
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-semibold text-primary outline-none transition-colors hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-primary active:translate-y-px"
              href="/#booking"
            >
              Check availability
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 text-sm text-text-secondary sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>© 2026 ApartmentMaid. Professional home cleaning made simple.</p>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="outline-none hover:text-primary focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary" href="/services">
              Services
            </Link>
            <Link className="outline-none hover:text-primary focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary" href="/blog">
              Blog
            </Link>
            <Link className="outline-none hover:text-primary focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary" href="/#booking">
              Book now
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
