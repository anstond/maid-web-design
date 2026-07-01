import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock3, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";

type ArticleSection = {
  id: string;
  title: string;
  body: string[];
};

type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  publishedAt: string;
  publishedLabel: string;
  author: string;
  image: "/images/hero-3-final.png" | "/images/hero-3.png" | "/images/maid-3.png" | string;
  imageAlt: string;
  intro: string;
  sections: ArticleSection[];
  checklist: string[];
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

const articles: Article[] = [
  {
    slug: "room-by-room-reset-for-a-calmer-home",
    title: "A room-by-room reset for a calmer home",
    description:
      "A practical weekend cleaning routine for refreshing the rooms you use most without turning your day off into a marathon.",
    category: "Home routines",
    readTime: "6 min read",
    publishedAt: "2026-06-25",
    publishedLabel: "June 25, 2026",
    author: "ApartmentMaid editorial team",
    image: "/images/hero-3-final.png",
    imageAlt: "Bright, clean living room prepared for a calm home reset",
    intro:
      "A calmer home does not usually come from one heroic deep clean. It comes from a small, repeatable reset that puts the most visible rooms back in order before clutter spreads into the rest of the week.",
    sections: [
      {
        id: "start-with-surfaces",
        title: "Start with the surfaces you touch first",
        body: [
          "Begin in the entry, living room, and kitchen counter zones. These are the places that shape how the home feels when you walk in, set down groceries, or start the next meal.",
          "Clear loose items into a single basket before wiping anything down. Sorting first and cleaning second keeps the reset moving instead of turning every object into a decision.",
        ],
      },
      {
        id: "work-high-to-low",
        title: "Work from high to low",
        body: [
          "Dust shelves, ledges, mirrors, and counters before floors. This order prevents you from cleaning the same area twice and makes each room feel finished as you move through it.",
          "In kitchens and bathrooms, save sinks and floors for the end. They collect the most residue during the reset and give you a clear final checkpoint.",
        ],
      },
      {
        id: "protect-the-routine",
        title: "Protect the routine from becoming a deep clean",
        body: [
          "A reset should improve the rooms you see and use every day. If you discover an oven detail, baseboard buildup, or closet project, write it down and keep going.",
          "That boundary matters. Routine cleaning keeps the home livable; deep cleaning is a separate job with a different pace, different supplies, and more time.",
        ],
      },
    ],
    checklist: [
      "Collect loose items into one basket before wiping surfaces.",
      "Dust shelves, ledges, and mirrors before counters.",
      "Clean kitchen counters, stovetop, sink, and cabinet handles.",
      "Refresh bathroom sink, mirror, toilet exterior, and floor edge.",
      "Vacuum or mop the most-used walking paths last.",
    ],
  },
  {
    slug: "how-often-should-you-really-deep-clean",
    title: "How often should you really deep clean?",
    description:
      "Use this seasonal checklist to keep the less-visible areas of your home in good shape.",
    category: "Deep cleaning",
    readTime: "5 min read",
    publishedAt: "2026-06-26",
    publishedLabel: "June 26, 2026",
    author: "ApartmentMaid editorial team",
    image: "/images/hero-3.png",
    imageAlt: "Modern living room with a freshly cleaned floor and tidy furnishings",
    intro:
      "While weekly cleaning handles the surface dust, deep cleaning targets the dirt, grime, and allergens that accumulate in less-obvious areas. Here is how to map out a stress-free schedule.",
    sections: [
      {
        id: "seasonal-cadence",
        title: "The seasonal strategy",
        body: [
          "Most homes benefit from a thorough deep clean every three to four months. This aligns perfectly with the changing seasons, allowing you to prep your home for the weather ahead.",
          "Focus on one heavy zone at a time rather than trying to complete the entire checklist in a single afternoon.",
        ],
      },
      {
        id: "kitchen-appliances",
        title: "Appliances and high-use fixtures",
        body: [
          "A deep clean means getting behind and inside appliances. Pull out refrigerator shelves, run a descaling cycle on the dishwasher, and clear oven grease.",
          "These tasks maintain appliance efficiency and prevent unwanted odors from building up over time.",
        ],
      },
    ],
    checklist: [
      "Deep clean oven interior, stove grates, and range hood filter.",
      "Pull out refrigerator drawers and sanitize the door seals.",
      "Wash window glass inside and out, plus wipe down tracks.",
      "Vacuum baseboards, door frames, and window trims.",
      "Sanitize and descale all bathroom showerheads and faucets.",
    ],
  },
  {
    slug: "the-kitchen-cleaning-order-that-saves-time",
    title: "The kitchen cleaning order that saves time",
    description:
      "Work from high-touch surfaces to the floor for a kitchen that feels clean from every angle.",
    category: "Kitchen care",
    readTime: "4 min read",
    publishedAt: "2026-06-27",
    publishedLabel: "June 27, 2026",
    author: "ApartmentMaid editorial team",
    image: "/images/maid-3.png",
    imageAlt: "Professional cleaner wiping a kitchen counter",
    intro:
      "If you clean your kitchen in the wrong order, you end up re-cleaning surfaces as dust and crumbs fall from above. Following a logical flow saves both time and energy.",
    sections: [
      {
        id: "top-down-approach",
        title: "The top-down golden rule",
        body: [
          "Always start with lighting, the tops of the cabinets, and the refrigerator cover. Any dust disturbed there will settle onto the counters below.",
          "Next, clean the microwave and stove before wiping down countertops.",
        ],
      },
      {
        id: "floors-last",
        title: "Sinks and floors are the finale",
        body: [
          "Your sink is the workhorse of the clean. Only wash it down after all other countertops have been wiped into the trash.",
          "Finally, sweep and mop your way out of the room so you never step on a wet floor.",
        ],
      },
    ],
    checklist: [
      "Dust ceiling corners, light fixtures, and cabinet tops.",
      "Wipe down upper cabinet doors and refrigerator exterior.",
      "Clean microwave interior, stovetop, and backsplash.",
      "Wipe down countertops, working from back to front.",
      "Sanitize the sink basin, faucet, and disposal rim last.",
    ],
  },
  {
    slug: "a-practical-guide-to-move-out-cleaning",
    title: "A practical guide to move-out cleaning",
    description:
      "Plan your final clean around the details landlords and new residents notice first.",
    category: "Moving",
    readTime: "7 min read",
    publishedAt: "2026-06-28",
    publishedLabel: "June 28, 2026",
    author: "ApartmentMaid editorial team",
    image: "/images/hero-3-final.png",
    imageAlt: "Well-kept apartment living area ready for a move-out inspection",
    intro:
      "Securing your full security deposit requires attention to the details that inspectors and landlords check first. A systematic approach ensures nothing gets missed.",
    sections: [
      {
        id: "high-inspection-zones",
        title: "Focus on the high-inspection zones",
        body: [
          "Landlords look for grease buildup inside ovens and soap scum on bathroom glass. Spending extra time on these areas yields the highest return.",
          "Wipe down the inside of all drawers and cabinets to ensure no crumbs or dust are left behind.",
        ],
      },
      {
        id: "walls-and-trim",
        title: "Scuffs, walls, and trim",
        body: [
          "Use a melamine foam sponge to gently remove scuff marks from baseboards and doors.",
          "Ensure light switches and door frames are wiped clean of fingerprints.",
        ],
      },
    ],
    checklist: [
      "Empty and clean all kitchen cabinets and drawers.",
      "Thoroughly degrease the oven, stove, and range hood.",
      "Remove all calcium build-up from shower screens and tubs.",
      "Wipe down all baseboards, window sills, and door frames.",
      "Patch small nail holes and vacuum/mop every floor surface.",
    ],
  },
  {
    slug: "small-habits-that-keep-bathrooms-fresh",
    title: "Small habits that keep bathrooms fresh",
    description:
      "Five quick actions that make the weekly bathroom clean much easier to manage.",
    category: "Home routines",
    readTime: "3 min read",
    publishedAt: "2026-06-29",
    publishedLabel: "June 29, 2026",
    author: "ApartmentMaid editorial team",
    image: "/images/maid-3.png",
    imageAlt: "Cleaner maintaining a polished home interior",
    intro:
      "A fresh bathroom doesn't require daily scrubbing. Incorporating minor habits into your post-shower or morning routine keeps grime at bay.",
    sections: [
      {
        id: "daily-habits",
        title: "Daily micro-habits",
        body: [
          "Squeegee the shower glass immediately after use to prevent water spots and lime scale from drying on the surface.",
          "Keep a microfiber cloth nearby to wipe down the faucet after brushing your teeth.",
        ],
      },
      {
        id: "ventilation",
        title: "Keep it dry",
        body: [
          "Run the bathroom exhaust fan for at least 15 minutes after a hot shower to keep moisture levels down and prevent mold growth.",
        ],
      },
    ],
    checklist: [
      "Squeegee glass doors or wipe down tub walls after every shower.",
      "Run the exhaust fan to keep humidity and mildew at bay.",
      "Wipe the sink faucet and handles daily with a soft cloth.",
      "Keep countertops free of puddles and toothpaste residue.",
      "Shake out bath mats and hang damp towels immediately.",
    ],
  },
  {
    slug: "what-a-professional-deep-clean-includes",
    title: "What a professional deep clean includes",
    description:
      "Understand the difference between routine upkeep and a detailed cleaning service.",
    category: "Deep cleaning",
    readTime: "5 min read",
    publishedAt: "2026-06-30",
    publishedLabel: "June 30, 2026",
    author: "ApartmentMaid editorial team",
    image: "/images/hero-3.png",
    imageAlt: "Sunlit apartment interior after a professional clean",
    intro:
      "Knowing what to expect from a deep cleaning service helps you choose the right care for your space. Let's look at what our teams focus on during a deep refresh.",
    sections: [
      {
        id: "routine-vs-deep",
        title: "Routine care vs. deep refresh",
        body: [
          "Routine cleaning keeps dust and surface grime under control. Deep cleaning goes further, reaching the built-up dirt under furniture, inside ovens, and on high ledges.",
          "It's about restoring a home to its baseline condition, making daily upkeep much easier afterward.",
        ],
      },
    ],
    checklist: [
      "Detailed scrubbing of grout lines in showers and tile floors.",
      "Wiping baseboards, window tracks, blinds, and light fixtures.",
      "Inside-appliance detailing (oven, microwave, and fridge).",
      "Dusting hard-to-reach vents, ceiling fans, and high cabinet tops.",
      "Deodorizing and sanitizing high-touch surfaces thoroughly.",
    ],
  },
  {
    slug: "preparing-your-home-before-guests-arrive",
    title: "Preparing your home before guests arrive",
    description:
      "Focus on the few areas that create an immediately comfortable welcome for visitors.",
    category: "Hosting",
    readTime: "4 min read",
    publishedAt: "2026-07-01",
    publishedLabel: "July 1, 2026",
    author: "ApartmentMaid editorial team",
    image: "/images/hero-3-final.png",
    imageAlt: "Inviting tidy living room set up for guests",
    intro:
      "Hosting should be about connection, not cleaning exhaustion. Prioritize the rooms your guests will occupy first to create a welcoming, clean home.",
    sections: [
      {
        id: "first-impressions",
        title: "The entryway and living space",
        body: [
          "Ensure your entryway is free of shoes and clutter. A clean welcome sets a relaxed tone for the entire visit.",
          "Fluff the sofa cushions and clear the coffee table to make room for guests to relax.",
        ],
      },
      {
        id: "guest-bathroom",
        title: "The guest bathroom checklist",
        body: [
          "A spotless toilet, fresh hand towels, and a clear counter space show guest hospitality and ensure comfort.",
        ],
      },
    ],
    checklist: [
      "Clear clutter from the entryway and coat rack.",
      "Tidy up the living area, fluff cushions, and dust tables.",
      "Sanitize the bathroom sink, mirror, and toilet bowl.",
      "Put out fresh hand towels and hand soap.",
      "Empty trash bins in the kitchen and bathroom.",
    ],
  },
  {
    slug: "5-smart-cleaning-hacks-for-busy-renters",
    title: "5 Smart Cleaning Hacks For Busy Renters",
    description:
      "Discover time-saving tricks that make your daily routine easier and more effective.",
    category: "Cleaning Tips",
    readTime: "4 min read",
    publishedAt: "2026-06-24",
    publishedLabel: "June 24, 2026",
    author: "ApartmentMaid editorial team",
    image: "/images/hero-3.png",
    imageAlt: "Bright apartment interior showcasing modern renter living",
    intro:
      "Renting an apartment comes with its own unique cleaning challenges. These five smart hacks help you maintain a clean space without dedicating your weekends to chores.",
    sections: [
      {
        id: "renter-hacks",
        title: "Easy, surface-friendly methods",
        body: [
          "Use tension rods to double your cleaning spray storage under the sink.",
          "Line kitchen cabinets with removable shelf liners to protect surfaces and make spills easy to wipe up.",
        ],
      },
    ],
    checklist: [
      "Use removable liners for kitchen cabinets and fridge shelves.",
      "Hang spray bottles on a tension rod under the sink.",
      "Wipe down high-touch switches and handles with alcohol wipes.",
      "Keep a shower cleaning brush handy in the tub.",
      "Adopt the 10-minute nightly tidy habit.",
    ],
  },
  {
    slug: "choosing-the-right-service",
    title: "Choosing The Right Service",
    description:
      "Not all cleaning services are the same. Here's what to look for when hiring professionals.",
    category: "Guides",
    readTime: "5 min read",
    publishedAt: "2026-06-23",
    publishedLabel: "June 23, 2026",
    author: "ApartmentMaid editorial team",
    image: "/images/maid-3.png",
    imageAlt: "Professional cleaners discussing service details",
    intro:
      "Selecting the perfect cleaning service depends on your home layout, schedule, and expectations. Here is how to find the right fit for your home.",
    sections: [
      {
        id: "checklist-selection",
        title: "Know what is included",
        body: [
          "Always review the provider's standard checklist. Look for transparency in booking, clear pricing, and satisfaction guarantees.",
        ],
      },
    ],
    checklist: [
      "Verify the service is fully insured and bonded.",
      "Check if cleaning supplies are provided or if you need to supply them.",
      "Review the cancellation and rescheduling policies.",
      "Ensure clear pricing is provided upfront with no hidden fees.",
      "Look for verified customer reviews and ratings.",
    ],
  },
  {
    slug: "how-to-get-your-full-deposit-back",
    title: "How To Get Your Full Deposit Back",
    description:
      "A complete checklist to ensure your landlord is impressed, not disappointed.",
    category: "Move-In / Out",
    readTime: "8 min read",
    publishedAt: "2026-06-22",
    publishedLabel: "June 22, 2026",
    author: "ApartmentMaid editorial team",
    image: "/images/hero-3-final.png",
    imageAlt: "Clean, empty apartment ready for final landlord walkthrough",
    intro:
      "Moving is stressful enough without worrying about your security deposit. Follow our professional move-out clean guide to leave your apartment in rent-ready condition.",
    sections: [
      {
        id: "deposit-checklist",
        title: "The move-out cleaning deep dive",
        body: [
          "Clean baseboards, light switches, and inside all appliances. Pay special attention to the stovetop and oven, which landlords inspect closely.",
        ],
      },
    ],
    checklist: [
      "Defrost and thoroughly clean the refrigerator and freezer.",
      "Wipe down all door frames, baseboards, and window trim.",
      "Clean out all cabinets, drawers, and closet shelves.",
      "Sanitize the bath, shower, toilet, and sink basin.",
      "Vacuum all carpets and mop all hard flooring.",
    ],
  },
];

const relatedGuides = [
  "How often should you really deep clean?",
  "The kitchen cleaning order that saves time",
  "Small habits that keep bathrooms fresh",
];

function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return {
      title: "Article not found | ApartmentMaid",
    };
  }

  return {
    title: `${article.title} | ApartmentMaid`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: [
        {
          url: article.image,
          alt: article.imageAlt,
        },
      ],
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navigation />

      <main>
        <article>
          <header className="mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-8 sm:pb-14 sm:pt-16 lg:px-10">
            <Link
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface-muted px-4 text-sm font-semibold text-text-primary outline-none transition-colors hover:bg-accent-soft focus-visible:ring-3 focus-visible:ring-primary/30"
              href="/blog"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
              Back to blog
            </Link>

            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)] lg:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                  <span className="rounded-full bg-surface-muted px-4 py-2 font-semibold text-primary">
                    {article.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
                    {article.readTime}
                  </span>
                  <time dateTime={article.publishedAt}>{article.publishedLabel}</time>
                </div>
                <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.12] text-text-primary sm:text-5xl lg:text-[52px] lg:leading-[64px]">
                  {article.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-text-secondary">
                  {article.description}
                </p>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-surface-muted">
                <Image
                  alt={article.imageAlt}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 520px"
                  src={article.image}
                />
              </div>
            </div>
          </header>

          <div className="border-y border-border bg-surface-muted/55">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,720px)_320px] lg:px-10">
              <div className="max-w-[70ch]">
                <p className="text-xl font-medium leading-9 text-text-primary">{article.intro}</p>

                <div className="mt-10 space-y-10">
                  {article.sections.map((section) => (
                    <section aria-labelledby={section.id} id={section.id} key={section.id} className="scroll-mt-24">
                      <h2 id={section.id} className="text-2xl font-bold leading-8 text-text-primary sm:text-3xl">
                        {section.title}
                      </h2>
                      <div className="mt-4 space-y-5 text-base leading-8 text-text-secondary">
                        {section.body.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                <section className="mt-12 rounded-[16px] border border-border bg-background p-6 sm:p-8" aria-labelledby="reset-checklist">
                  <h2 id="reset-checklist" className="text-2xl font-bold text-text-primary">
                    Weekend reset checklist
                  </h2>
                  <ul className="mt-5 space-y-4">
                    {article.checklist.map((item) => (
                      <li className="flex gap-3 text-text-secondary" key={item}>
                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.4} />
                        </span>
                        <span className="leading-7">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mt-10 rounded-[16px] bg-primary p-6 text-primary-foreground sm:p-8" aria-labelledby="article-booking-cta">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary-foreground/80">
                    <Sparkles aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
                    Ready for a deeper reset
                  </div>
                  <h2 id="article-booking-cta" className="mt-4 text-2xl font-bold sm:text-3xl">
                    Book a home refresh with ApartmentMaid.
                  </h2>
                  <p className="mt-3 max-w-xl leading-7 text-primary-foreground/80">
                    Choose a routine clean or a detailed deep clean, then pick the time that works for your home.
                  </p>
                  <Link
                    className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-background px-5 text-sm font-semibold text-primary outline-none transition-colors hover:bg-surface-muted focus-visible:ring-3 focus-visible:ring-primary-foreground/50"
                    href="/booking"
                  >
                    Book a home refresh
                    <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                  </Link>
                </section>
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-4">
                  <nav aria-label="Table of contents" className="rounded-[16px] border border-border bg-background p-5">
                    <h2 className="text-sm font-bold text-text-primary">Table of contents</h2>
                    <ol className="mt-4 space-y-3 text-sm text-text-secondary">
                      {article.sections.map((section) => (
                        <li key={section.id}>
                          <Link className="outline-none hover:text-primary focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary" href={`#${section.id}`}>
                            {section.title}
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </nav>

                  <section className="rounded-[16px] border border-border bg-background p-5" aria-labelledby="related-guides">
                    <h2 id="related-guides" className="text-sm font-bold text-text-primary">
                      Related guides
                    </h2>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-text-secondary">
                      {relatedGuides.map((guide) => (
                        <li key={guide}>{guide}</li>
                      ))}
                    </ul>
                  </section>
                </div>
              </aside>
            </div>
          </div>
        </article>

        <section className="bg-background">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-14 sm:px-8 sm:py-16 md:flex-row md:items-center lg:px-10">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-primary">ApartmentMaid cleaning</p>
              <h2 className="mt-3 text-3xl font-bold text-text-primary sm:text-4xl">
                Keep the reset going without losing your weekend.
              </h2>
            </div>
            <Link
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground outline-none transition-colors hover:bg-primary-hover focus-visible:ring-3 focus-visible:ring-primary/30"
              href="/booking"
            >
              Check availability
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
