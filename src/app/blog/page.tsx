"use client";

import { ArrowRight, Clock3, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";

type Article = {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: "/images/hero-3-final.png" | "/images/hero-3.png" | "/images/maid-3.png";
  alt: string;
};

const featuredArticle: Article = {
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
    title: "How often should you really deep clean?",
    excerpt:
      "Use this seasonal checklist to keep the less-visible areas of your home in good shape.",
    category: "Deep cleaning",
    readTime: "5 min read",
    image: "/images/hero-3.png",
    alt: "Modern living room with a freshly cleaned floor and tidy furnishings",
  },
  {
    title: "The kitchen cleaning order that saves time",
    excerpt:
      "Work from high-touch surfaces to the floor for a kitchen that feels clean from every angle.",
    category: "Kitchen care",
    readTime: "4 min read",
    image: "/images/maid-3.png",
    alt: "Professional cleaner wiping a kitchen counter",
  },
  {
    title: "A practical guide to move-out cleaning",
    excerpt:
      "Plan your final clean around the details landlords and new residents notice first.",
    category: "Moving",
    readTime: "7 min read",
    image: "/images/hero-3-final.png",
    alt: "Well-kept apartment living area ready for a move-out inspection",
  },
  {
    title: "Small habits that keep bathrooms fresh",
    excerpt:
      "Five quick actions that make the weekly bathroom clean much easier to manage.",
    category: "Home routines",
    readTime: "3 min read",
    image: "/images/maid-3.png",
    alt: "Cleaner maintaining a polished home interior",
  },
  {
    title: "What a professional deep clean includes",
    excerpt:
      "Understand the difference between routine upkeep and a detailed cleaning service.",
    category: "Deep cleaning",
    readTime: "5 min read",
    image: "/images/hero-3.png",
    alt: "Sunlit apartment interior after a professional clean",
  },
  {
    title: "Preparing your home before guests arrive",
    excerpt:
      "Focus on the few areas that create an immediately comfortable welcome for visitors.",
    category: "Hosting",
    readTime: "4 min read",
    image: "/images/hero-3-final.png",
    alt: "Inviting tidy living room set up for guests",
  },
];

const categories = ["Cleaning routines", "Apartment living", "Deep cleaning", "Moving"];

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
      <span className="font-medium text-primary">{category}</span>
      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-border" />
      <span className="inline-flex items-center gap-1.5">
        <Clock3 aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
        {readTime}
      </span>
    </div>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navigation />

      <main>
        <section className="mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 sm:pb-16 sm:pt-24 lg:px-10">
          <p className="mb-4 text-sm font-semibold text-primary">ApartmentMaid journal</p>
          <h1 className="max-w-3xl text-4xl font-semibold text-text-primary sm:text-5xl lg:text-6xl">
            A cleaner home starts with a clearer routine.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
            Practical home care guides from our cleaning experts, made for apartments, busy schedules, and homes that deserve to feel good.
          </p>
        </section>

        <section aria-labelledby="featured-guide" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
          <div className="grid overflow-hidden rounded-xl border border-border bg-surface shadow-[0_18px_45px_rgba(21,94,99,0.07)] md:grid-cols-2">
            <div className="relative min-h-[280px] md:min-h-full">
              <Image
                alt={featuredArticle.alt}
                className="object-cover"
                fill
                preload
                sizes="(max-width: 767px) 100vw, (max-width: 1280px) 50vw, 640px"
                src={featuredArticle.image}
              />
            </div>
            <div className="flex flex-col items-start justify-center p-7 sm:p-10 lg:p-14">
              <ArticleMeta category={featuredArticle.category} readTime={featuredArticle.readTime} />
              <h2 id="featured-guide" className="mt-5 text-3xl font-semibold text-text-primary sm:text-4xl">
                {featuredArticle.title}
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-text-secondary">{featuredArticle.excerpt}</p>
              <Link
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground outline-none transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 active:translate-y-px"
                href="/#booking"
              >
                Book a home refresh
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="all-guides" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 border-t border-border pt-12 sm:pt-16">
            <div>
              <h2 id="all-guides" className="text-3xl font-semibold text-text-primary sm:text-4xl">
                Browse all guides
              </h2>
              <p className="mt-3 max-w-xl leading-7 text-text-secondary">
                Save time on the essentials, then leave the bigger jobs to a professional when you need a hand.
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <li key={category}>
                  <span
                    className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary"
                  >
                    {category}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <article
                className="group overflow-hidden rounded-xl border border-border bg-surface transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-accent-warm hover:shadow-[0_18px_36px_rgba(21,94,99,0.09)]"
                key={article.title}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
                  <Image
                    alt={article.alt}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 405px"
                    src={article.image}
                  />
                </div>
                <div className="p-6">
                  <ArticleMeta category={article.category} readTime={article.readTime} />
                  <h3 className="mt-4 text-xl font-semibold text-text-primary">{article.title}</h3>
                  <p className="mt-3 leading-6 text-text-secondary">{article.excerpt}</p>
                  <Link
                    aria-label={`Book a cleaning with ApartmentMaid after reading ${article.title}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-primary outline-none transition-colors hover:text-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                    href="/#booking"
                  >
                    Book a cleaning
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
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
