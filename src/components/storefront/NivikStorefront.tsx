import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Facebook,
  Feather,
  Flower2,
  Heart,
  Instagram,
  Leaf,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  Youtube,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import communityImpact from "@/assets/community-impact.jpg";
import gheeProduct from "@/assets/ghee-product.jpg";
import herbalTea from "@/assets/herbal-tea.jpg";
import herbsBotanicals from "@/assets/herbs-botanicals.jpg";
import heroStillLife from "@/assets/hero-still-life.jpg";
import himalayanSpices from "@/assets/himalayan-spices.jpg";
import honeyOatBiscuits from "@/assets/honey-oat-biscuits.jpg";
import honeyProduct from "@/assets/honey-product.jpg";
import homeLifestyle from "@/assets/home-lifestyle.jpg";
import mustardOil from "@/assets/mustard-oil.jpg";
import botanicalFaceOil from "@/assets/botanical-face-oil.jpg";
import picklePantry from "@/assets/pickle-pantry.jpg";
import womenCrafting from "@/assets/women-crafting.jpg";
import {
  addCartItem,
  getCartItemCount,
  getCartSubtotal,
  removeCartItem,
  setCartQuantity,
  type CartLineItem,
  type CartProduct,
} from "@/lib/storefront-cart";

type CategoryFilter = "All products" | "Ghee & Dairy" | "Honey" | "Herbal teas" | "Spices" | "Wellness";

interface ProductInfo extends CartProduct {
  category: string;
  description: string;
}

interface StoryInfo {
  category: string;
  title: string;
  readingTime: string;
  body: string;
}

const announcements = [
  "Pure village goodness, delivered to your doorstep.",
  "Traditionally crafted · Naturally sourced.",
  "Every purchase supports rural women.",
];

const categoryFilters: CategoryFilter[] = [
  "All products",
  "Ghee & Dairy",
  "Honey",
  "Herbal teas",
  "Spices",
  "Wellness",
];

const searchableProducts: ProductInfo[] = [
  {
    productId: "badri-ghee",
    title: "Badri Cow Desi Ghee",
    category: "Ghee & Dairy",
    price: 1450,
    description: "Slowly cultured and made in small batches.",
  },
  {
    productId: "organic-honey",
    title: "Organic Honey",
    category: "Honey",
    price: 240,
    description: "Raw forest honey with a delicate floral finish.",
  },
  {
    productId: "blue-tea",
    title: "Blue Tea",
    category: "Herbal teas",
    price: 340,
    description: "A naturally vivid infusion of butterfly pea flowers.",
  },
  {
    productId: "chamomile-tea",
    title: "Chamomile Tea",
    category: "Herbal teas",
    price: 280,
    description: "Whole chamomile flowers for a gentle evening cup.",
  },
  {
    productId: "garam-masala",
    title: "Garam Masala",
    category: "Spices",
    price: 220,
    description: "A fragrant blend of carefully sourced whole spices.",
  },
  {
    productId: "pahadi-haldi",
    title: "Organic Pahadi Haldi",
    category: "Spices",
    price: 195,
    description: "Bright Himalayan turmeric, gently stone-ground.",
  },
  {
    productId: "kumkumadi-oil",
    title: "Kumkumadi Oil",
    category: "Wellness",
    price: 950,
    description: "A botanical facial oil inspired by traditional care.",
  },
  {
    productId: "mustard-oil",
    title: "Wood Pressed Mustard Oil",
    category: "Oils",
    price: 225,
    description: "Wood-pressed slowly to preserve its warming aroma.",
  },
  {
    productId: "honey-oat-biscuits",
    title: "Honey Oat Biscuits",
    category: "Snacks",
    price: 340,
    description: "A wholesome little bake with oats and honey.",
  },
  {
    productId: "black-salt",
    title: "Black Salt",
    category: "Spices",
    price: 180,
    description: "Mineral-rich salt for a bright, savoury finish.",
  },
];

const testimonials = [
  {
    name: "Ananya M.",
    location: "Pune",
    quote: "The ghee tastes like something my grandmother would have made. I love knowing who is behind it.",
  },
  {
    name: "Rhea S.",
    location: "Bengaluru",
    quote: "The honey is beautifully delicate, and the care in the packaging feels just as thoughtful.",
  },
  {
    name: "Mira K.",
    location: "Mumbai",
    quote: "I came for the tea and stayed for the stories. The little details make every order feel special.",
  },
  {
    name: "Devika P.",
    location: "Delhi",
    quote: "A lovely way to bring genuinely good ingredients into my everyday kitchen.",
  },
];

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatPrice(amount: number) {
  return rupees.format(amount);
}

function isStoredCart(value: unknown): value is CartLineItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "productId" in item &&
        typeof item.productId === "string" &&
        "title" in item &&
        typeof item.title === "string" &&
        "price" in item &&
        typeof item.price === "number" &&
        "quantity" in item &&
        typeof item.quantity === "number",
    )
  );
}

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <a
      className={`inline-flex items-center gap-2.5 ${inverse ? "text-warm-ivory" : "text-forest-green"}`}
      href="#home"
      aria-label="NIVIK Natural home"
    >
      <span className="grid size-10 place-items-center rounded-full border border-current/30">
        <Leaf aria-hidden="true" className="size-5" strokeWidth={1.5} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-3xl font-semibold">NIVIK</span>
        <span className="mt-1 text-[0.6rem] uppercase">Natural</span>
      </span>
    </a>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase text-terracotta">{children}</p>;
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-display text-4xl leading-tight text-forest-green sm:text-5xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-base leading-7 text-deep-olive">{description}</p> : null}
    </div>
  );
}

function ProductCard({
  product,
  image,
  badge,
  isFavorite,
  onFavorite,
  onAdd,
  onToast,
}: {
  product: ProductInfo;
  image: string;
  badge?: string;
  isFavorite: boolean;
  onFavorite: () => void;
  onAdd: (product: CartProduct, quantity?: number) => void;
  onToast: (message: string) => void;
}) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  return (
    <motion.article
      layout
      className="group min-w-0"
      whileHover={useReducedMotion() ? undefined : { y: -4 }}
      transition={{ duration: 0.22 }}
    >
      <div className="relative overflow-hidden bg-cream">
        <Button
          variant="ghost"
          className="h-auto w-full rounded-none p-0"
          onClick={() => setQuickViewOpen(true)}
          aria-label={`Quick view ${product.title}`}
        >
          <span className="block aspect-[4/5] w-full overflow-hidden">
            <img
              className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              src={image}
              alt={product.title}
              loading="lazy"
            />
          </span>
        </Button>
        {badge ? (
          <span className="absolute left-3 top-3 bg-soft-white/90 px-3 py-1 text-[0.65rem] font-semibold uppercase text-forest-green">
            {badge}
          </span>
        ) : null}
        <Button
          variant="outline"
          size="icon"
          className="absolute right-3 top-3 rounded-full border-soft-white/70 bg-soft-white/90 text-forest-green hover:bg-soft-white"
          onClick={() => {
            onFavorite();
            onToast(isFavorite ? "Removed from your saved list." : "Added to your saved list.");
          }}
          aria-label={isFavorite ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          title={isFavorite ? "Remove from saved list" : "Save for later"}
        >
          <Heart aria-hidden="true" className={isFavorite ? "fill-terracotta text-terracotta" : ""} />
        </Button>
      </div>
      <div className="pt-4">
        <p className="text-xs uppercase text-deep-olive">{product.category}</p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl leading-tight text-charcoal">{product.title}</h3>
          <span className="shrink-0 pt-1 text-sm font-semibold text-forest-green">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="mt-2 min-h-10 text-sm leading-5 text-deep-olive">{product.description}</p>
        <Button
          variant="outline"
          className="mt-4 w-full border-forest-green/30 text-forest-green hover:bg-forest-green hover:text-soft-white"
          onClick={() => onAdd(product)}
        >
          <ShoppingBag aria-hidden="true" /> Add to bag
        </Button>
      </div>
      <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
        <DialogContent className="max-h-[92vh] w-[min(94vw,900px)] max-w-[900px] overflow-y-auto border-cream bg-warm-ivory p-0 sm:rounded-sm">
          <div className="grid md:grid-cols-2">
            <div className="aspect-[4/5] bg-cream md:aspect-auto">
              <img className="size-full object-cover" src={image} alt={product.title} />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <DialogHeader>
                <Eyebrow>{product.category}</Eyebrow>
                <DialogTitle className="mt-3 font-display text-4xl font-medium text-forest-green">
                  {product.title}
                </DialogTitle>
                <DialogDescription className="pt-2 text-base leading-7 text-deep-olive">
                  {product.description} Thoughtfully sourced and made in considered small batches.
                </DialogDescription>
              </DialogHeader>
              <p className="mt-6 font-display text-3xl text-forest-green">{formatPrice(product.price)}</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="text-sm font-medium text-charcoal">Quantity</span>
                <div className="flex items-center border border-forest-green/20">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  >
                    <Minus aria-hidden="true" />
                  </Button>
                  <span className="min-w-8 text-center text-sm" aria-live="polite">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((current) => current + 1)}
                  >
                    <Plus aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <Button
                className="mt-6 w-full"
                onClick={() => {
                  onAdd(product, quantity);
                  setQuickViewOpen(false);
                }}
              >
                Add {quantity} to bag · {formatPrice(product.price * quantity)}
              </Button>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                Small-batch goodness, packed with care.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.article>
  );
}

function CategoryCard({
  title,
  image,
  onExplore,
}: {
  title: string;
  image: string;
  onExplore: () => void;
}) {
  return (
    <a
      className="group block min-w-0"
      href="#shop"
      onClick={(event) => {
        event.preventDefault();
        onExplore();
      }}
    >
      <span className="block aspect-[4/5] overflow-hidden bg-cream">
        <img
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          src={image}
          alt={title}
          loading="lazy"
        />
      </span>
      <span className="mt-3 flex items-center justify-between gap-2">
        <span className="font-display text-xl text-forest-green sm:text-2xl">{title}</span>
        <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-terracotta" />
      </span>
    </a>
  );
}

function CartLine({
  item,
  onQuantity,
  onRemove,
}: {
  item: CartLineItem;
  onQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}) {
  return (
    <div className="border-b border-forest-green/10 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-tight text-forest-green">{item.title}</h3>
          <p className="mt-1 text-sm text-deep-olive">{formatPrice(item.price)} each</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-deep-olive"
          aria-label={`Remove ${item.title}`}
          title="Remove item"
          onClick={() => onRemove(item.productId)}
        >
          <span className="text-lg leading-none" aria-hidden="true">×</span>
        </Button>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center border border-forest-green/20">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={`Decrease ${item.title} quantity`}
            onClick={() => onQuantity(item.productId, item.quantity - 1)}
          >
            <Minus aria-hidden="true" />
          </Button>
          <span className="min-w-8 text-center text-sm" aria-live="polite">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={`Increase ${item.title} quantity`}
            onClick={() => onQuantity(item.productId, item.quantity + 1)}
          >
            <Plus aria-hidden="true" />
          </Button>
        </div>
        <span className="font-semibold text-forest-green">{formatPrice(item.price * item.quantity)}</span>
      </div>
    </div>
  );
}

export default function NivikStorefront() {
  const shouldReduceMotion = useReducedMotion();
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [footerInfo, setFooterInfo] = useState<{ title: string; body: string } | null>(null);
  const [cart, setCart] = useState<CartLineItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All products");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountMessage, setAccountMessage] = useState("");
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [story, setStory] = useState<StoryInfo | null>(null);

  useEffect(() => {
    const announcementTimer = window.setInterval(() => {
      setAnnouncementIndex((current) => (current + 1) % announcements.length);
    }, 4600);
    const onScroll = () => setScrolled(window.scrollY > 18);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearInterval(announcementTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem("nivik-cart-v1");
      const savedWishlist = window.localStorage.getItem("nivik-wishlist-v1");
      if (savedCart) {
        const parsed: unknown = JSON.parse(savedCart);
        if (isStoredCart(parsed)) setCart(parsed);
      }
      if (savedWishlist) {
        const parsed: unknown = JSON.parse(savedWishlist);
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
          setWishlist(parsed);
        }
      }
    } catch {
      window.localStorage.removeItem("nivik-cart-v1");
      window.localStorage.removeItem("nivik-wishlist-v1");
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem("nivik-cart-v1", JSON.stringify(cart));
    window.localStorage.setItem("nivik-wishlist-v1", JSON.stringify(wishlist));
  }, [cart, wishlist, storageReady]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const filteredSearchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return [];
    return searchableProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query),
    );
  }, [searchTerm]);

  const showCategory = (category: string) =>
    selectedCategory === "All products" || category === selectedCategory;

  const showToast = (message: string) => setToastMessage(message);

  const addToCart = (product: CartProduct, quantity = 1) => {
    setCart((current) => {
      let next = current;
      for (let index = 0; index < quantity; index += 1) {
        next = addCartItem(next, product);
      }
      return next;
    });
    showToast(`${product.title} added to your bag.`);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((savedId) => savedId !== productId)
        : [...current, productId],
    );
  };

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    setShopMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const openSearchResult = (product: ProductInfo) => {
    if (categoryFilters.includes(product.category as CategoryFilter)) {
      setSelectedCategory(product.category as CategoryFilter);
    } else {
      setSelectedCategory("All products");
    }
    setSearchOpen(false);
    setSearchTerm("");
    window.setTimeout(() => scrollToSection("shop"), 120);
  };

  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.trim())) {
      setNewsletterMessage("Please enter a valid email address.");
      return;
    }
    setNewsletterMessage("You’re on the list. Look out for a little village goodness in your inbox.");
    setNewsletterEmail("");
  };

  const submitAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountEmail.trim())) {
      setAccountMessage("Please enter a valid email address.");
      return;
    }
    setAccountMessage("Account sign-in is not connected in this preview.");
  };

  const submitCheckout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!checkoutName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutEmail.trim())) {
      setCheckoutMessage("Please add your name and a valid email address.");
      return;
    }
    setCheckoutMessage("This is a demo checkout. No payment is taken and no order is placed.");
  };

  const openArticle = (article: StoryInfo) => setStory(article);
  const activeTestimonial = testimonials[testimonialIndex] ?? testimonials[0];

  return (
    <div className="min-h-screen overflow-x-clip bg-warm-ivory text-charcoal">
      <div className="flex min-h-8 items-center justify-center bg-forest-green px-4 py-2 text-center text-[0.7rem] text-warm-ivory sm:text-xs">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={announcementIndex}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -5 }}
            transition={{ duration: 0.22 }}
            aria-live="polite"
          >
            {announcements[announcementIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <header
        className={`sticky top-0 z-40 border-b border-forest-green/10 transition-colors ${scrolled ? "bg-warm-ivory/95 shadow-sm backdrop-blur" : "bg-warm-ivory"}`}
      >
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
          <BrandMark />
          <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm text-charcoal lg:flex">
            <a className="transition-colors hover:text-terracotta" href="#home">Home</a>
            <div className="relative">
              <Button
                variant="ghost"
                className="h-auto gap-1 px-0 py-2 text-sm font-normal text-charcoal hover:bg-transparent hover:text-terracotta"
                aria-expanded={shopMenuOpen}
                onClick={() => setShopMenuOpen((open) => !open)}
              >
                Shop <ChevronDown aria-hidden="true" className="size-3" />
              </Button>
              {shopMenuOpen ? (
                <div className="absolute left-0 top-full z-50 mt-3 w-64 border border-cream bg-soft-white p-3 shadow-lg">
                  <p className="px-3 pb-2 text-xs uppercase text-deep-olive">Explore our shelves</p>
                  <a className="block px-3 py-2 text-sm hover:bg-cream" href="#categories" onClick={() => setShopMenuOpen(false)}>Shop all categories</a>
                  <a className="block px-3 py-2 text-sm hover:bg-cream" href="#shop" onClick={() => { setSelectedCategory("Ghee & Dairy"); setShopMenuOpen(false); }}>Ghee & dairy</a>
                  <a className="block px-3 py-2 text-sm hover:bg-cream" href="#shop" onClick={() => { setSelectedCategory("Honey"); setShopMenuOpen(false); }}>Raw honey</a>
                  <a className="block px-3 py-2 text-sm hover:bg-cream" href="#shop" onClick={() => { setSelectedCategory("Herbal teas"); setShopMenuOpen(false); }}>Herbal teas</a>
                  <a className="block px-3 py-2 text-sm hover:bg-cream" href="#shop" onClick={() => { setSelectedCategory("Spices"); setShopMenuOpen(false); }}>Spices & masalas</a>
                </div>
              ) : null}
            </div>
            <a className="transition-colors hover:text-terracotta" href="#story">Our Story</a>
            <a className="transition-colors hover:text-terracotta" href="#women">Women Behind NIVIK</a>
            <a className="transition-colors hover:text-terracotta" href="#journal">Journal</a>
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" aria-label="Search products" title="Search" onClick={() => setSearchOpen(true)}>
              <Search aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Account" title="Account" onClick={() => setAccountOpen(true)}>
              <CircleUserRound aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label={`Shopping bag, ${getCartItemCount(cart)} items`}
              title="Shopping bag"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag aria-hidden="true" />
              <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-terracotta text-[0.6rem] text-soft-white">
                {getCartItemCount(cart)}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
              title="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[min(88vw,380px)] border-cream bg-warm-ivory px-6 pt-12">
          <SheetHeader className="items-start border-b border-forest-green/10 pb-6">
            <BrandMark />
            <SheetDescription className="pt-3 text-left text-deep-olive">Pure from the source. Powerful by nature.</SheetDescription>
          </SheetHeader>
          <nav aria-label="Mobile navigation" className="mt-5 flex flex-col">
            <a className="border-b border-forest-green/10 py-4 font-display text-2xl text-forest-green" href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a className="border-b border-forest-green/10 py-4 font-display text-2xl text-forest-green" href="#categories" onClick={() => setMobileMenuOpen(false)}>Shop categories</a>
            <a className="border-b border-forest-green/10 py-4 font-display text-2xl text-forest-green" href="#shop" onClick={() => setMobileMenuOpen(false)}>Our products</a>
            <a className="border-b border-forest-green/10 py-4 font-display text-2xl text-forest-green" href="#story" onClick={() => setMobileMenuOpen(false)}>Our story</a>
            <a className="border-b border-forest-green/10 py-4 font-display text-2xl text-forest-green" href="#women" onClick={() => setMobileMenuOpen(false)}>Women behind NIVIK</a>
            <a className="border-b border-forest-green/10 py-4 font-display text-2xl text-forest-green" href="#journal" onClick={() => setMobileMenuOpen(false)}>Journal</a>
          </nav>
          <Button className="mt-7 w-full" onClick={() => { setMobileMenuOpen(false); setCartOpen(true); }}>
            <ShoppingBag aria-hidden="true" /> Open your bag
          </Button>
        </SheetContent>
      </Sheet>

      <main>
        <section id="home" className="overflow-hidden bg-warm-ivory">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 md:pb-20 md:pt-16 lg:grid-cols-[0.93fr_1.07fr] lg:gap-14 lg:px-10 lg:py-20">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="relative z-10"
            >
              <Eyebrow>From farm to table · with purpose</Eyebrow>
              <h1 className="mt-5 max-w-2xl font-display text-5xl leading-[0.98] text-forest-green sm:text-6xl lg:text-7xl">
                Pure from the source.
                <span className="mt-1 block italic text-terracotta">Powerful by nature.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-deep-olive sm:text-lg sm:leading-8">
                Discover traditionally crafted ghee, raw honey, Himalayan spices and natural wellness essentials, thoughtfully made with care by rural women across India.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-12 rounded-sm px-6">
                  <a href="#shop">Explore our collection <ArrowDownRight aria-hidden="true" /></a>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 rounded-sm border-forest-green/30 px-6 text-forest-green">
                  <a href="#story">Discover our story</a>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-deep-olive">
                <span className="inline-flex items-center gap-2"><BadgeCheck aria-hidden="true" className="size-4 text-terracotta" /> Small batch crafted</span>
                <span className="inline-flex items-center gap-2"><Leaf aria-hidden="true" className="size-4 text-terracotta" /> Honest ingredients</span>
                <span className="inline-flex items-center gap-2"><Flower2 aria-hidden="true" className="size-4 text-terracotta" /> Women powered</span>
              </div>
            </motion.div>
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.12, ease: "easeOut" }}
              className="relative"
            >
              <div className="overflow-hidden bg-cream">
                <img
                  className="aspect-[1.32/1] w-full object-cover sm:aspect-[1.42/1]"
                  src={heroStillLife}
                  alt="Raw honey, golden ghee, Himalayan spices and fresh leaves in warm morning light"
                  fetchPriority="high"
                />
              </div>
              <div className="absolute -bottom-5 left-4 flex items-center gap-3 border border-cream bg-soft-white px-4 py-3 shadow-md sm:bottom-6 sm:left-6">
                <span className="grid size-10 place-items-center rounded-full bg-cream text-forest-green">
                  <Feather aria-hidden="true" className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-lg text-forest-green">Every jar has a story</span>
                  <span className="block text-xs text-deep-olive">Made with care, close to the source</span>
                </span>
              </div>
              <span className="absolute -right-2 -top-4 hidden size-20 items-center justify-center rounded-full border border-forest-green/30 bg-warm-ivory text-center text-[0.65rem] uppercase leading-4 text-forest-green sm:flex">
                100%<br />natural<br />goodness
              </span>
            </motion.div>
          </div>
        </section>

        <section aria-label="Our values" className="overflow-hidden border-y border-cream bg-cream py-4">
          <div className="nivik-marquee-track flex w-max items-center gap-8 whitespace-nowrap text-xs font-medium uppercase text-forest-green" aria-hidden="true">
            {[0, 1].map((copy) => (
              <span className="flex items-center gap-8" key={copy}>
                <span>Village sourced</span><Leaf className="size-3 text-terracotta" />
                <span>Traditionally crafted</span><Leaf className="size-3 text-terracotta" />
                <span>Women empowered</span><Leaf className="size-3 text-terracotta" />
                <span>Natural goodness</span><Leaf className="size-3 text-terracotta" />
                <span>Small-batch production</span><Leaf className="size-3 text-terracotta" />
              </span>
            ))}
          </div>
        </section>

        <section id="categories" className="bg-soft-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <SectionHeading
              eyebrow="Shop the goodness"
              title="Nature, in every form."
              description="Explore our thoughtfully curated collection of natural goodness."
              centered
            />
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.55, staggerChildren: 0.06 }}
              className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-10"
            >
              <CategoryCard title="Ghee & dairy" image={gheeProduct} onExplore={() => { setSelectedCategory("Ghee & Dairy"); scrollToSection("shop"); }} />
              <CategoryCard title="Herbal teas" image={herbalTea} onExplore={() => { setSelectedCategory("Herbal teas"); scrollToSection("shop"); }} />
              <CategoryCard title="Spices & masalas" image={himalayanSpices} onExplore={() => { setSelectedCategory("Spices"); scrollToSection("shop"); }} />
              <CategoryCard title="Raw honey" image={honeyProduct} onExplore={() => { setSelectedCategory("Honey"); scrollToSection("shop"); }} />
              <CategoryCard title="Wood-pressed oils" image={mustardOil} onExplore={() => { setSelectedCategory("All products"); scrollToSection("shop"); }} />
              <CategoryCard title="Healthy snacks" image={honeyOatBiscuits} onExplore={() => { setSelectedCategory("All products"); scrollToSection("shop"); }} />
              <CategoryCard title="Beauty & wellness" image={botanicalFaceOil} onExplore={() => { setSelectedCategory("Wellness"); scrollToSection("shop"); }} />
              <CategoryCard title="Pickles & pantry" image={picklePantry} onExplore={() => { setSelectedCategory("All products"); scrollToSection("shop"); }} />
              <CategoryCard title="Herbs & botanicals" image={herbsBotanicals} onExplore={() => { setSelectedCategory("Herbal teas"); scrollToSection("shop"); }} />
              <CategoryCard title="Home & lifestyle" image={homeLifestyle} onExplore={() => { setSelectedCategory("All products"); scrollToSection("shop"); }} />
            </motion.div>
          </div>
        </section>

        <section id="shop" className="bg-warm-ivory py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                eyebrow="Our products"
                title="Explore our natural collection."
                description="Goodness sourced with care, crafted with tradition and delivered with love."
              />
              <Button variant="outline" className="w-fit shrink-0 border-forest-green/30 text-forest-green" onClick={() => setSelectedCategory("All products")}>
                View all products <ArrowRight aria-hidden="true" />
              </Button>
            </div>
            <div className="mt-8 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Filter products by category">
              {categoryFilters.map((category) => (
                <Button
                  key={category}
                  role="tab"
                  aria-selected={selectedCategory === category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="shrink-0 rounded-full px-4"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            <motion.div layout className="mt-7 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-12">
              {showCategory("Ghee & Dairy") ? <ProductCard product={searchableProducts[0] ?? { productId: "badri-ghee", title: "Badri Cow Desi Ghee", category: "Ghee & Dairy", price: 1450, description: "Slowly cultured and made in small batches." }} image={gheeProduct} badge="Bestseller" isFavorite={wishlist.includes("badri-ghee")} onFavorite={() => toggleWishlist("badri-ghee")} onAdd={addToCart} onToast={showToast} /> : null}
              {showCategory("Honey") ? <ProductCard product={searchableProducts[1] ?? { productId: "organic-honey", title: "Organic Honey", category: "Honey", price: 240, description: "Raw forest honey with a delicate floral finish." }} image={honeyProduct} badge="Small batch" isFavorite={wishlist.includes("organic-honey")} onFavorite={() => toggleWishlist("organic-honey")} onAdd={addToCart} onToast={showToast} /> : null}
              {showCategory("Herbal teas") ? <ProductCard product={searchableProducts[2] ?? { productId: "blue-tea", title: "Blue Tea", category: "Herbal teas", price: 340, description: "A naturally vivid infusion of butterfly pea flowers." }} image={herbalTea} isFavorite={wishlist.includes("blue-tea")} onFavorite={() => toggleWishlist("blue-tea")} onAdd={addToCart} onToast={showToast} /> : null}
              {showCategory("Herbal teas") ? <ProductCard product={searchableProducts[3] ?? { productId: "chamomile-tea", title: "Chamomile Tea", category: "Herbal teas", price: 280, description: "Whole chamomile flowers for a gentle evening cup." }} image={herbalTea} isFavorite={wishlist.includes("chamomile-tea")} onFavorite={() => toggleWishlist("chamomile-tea")} onAdd={addToCart} onToast={showToast} /> : null}
              {showCategory("Spices") ? <ProductCard product={searchableProducts[4] ?? { productId: "garam-masala", title: "Garam Masala", category: "Spices", price: 220, description: "A fragrant blend of carefully sourced whole spices." }} image={himalayanSpices} isFavorite={wishlist.includes("garam-masala")} onFavorite={() => toggleWishlist("garam-masala")} onAdd={addToCart} onToast={showToast} /> : null}
              {showCategory("Spices") ? <ProductCard product={searchableProducts[5] ?? { productId: "pahadi-haldi", title: "Organic Pahadi Haldi", category: "Spices", price: 195, description: "Bright Himalayan turmeric, gently stone-ground." }} image={himalayanSpices} badge="From the hills" isFavorite={wishlist.includes("pahadi-haldi")} onFavorite={() => toggleWishlist("pahadi-haldi")} onAdd={addToCart} onToast={showToast} /> : null}
              {showCategory("Wellness") ? <ProductCard product={searchableProducts[6] ?? { productId: "kumkumadi-oil", title: "Kumkumadi Oil", category: "Wellness", price: 950, description: "A botanical facial oil inspired by traditional care." }} image={botanicalFaceOil} isFavorite={wishlist.includes("kumkumadi-oil")} onFavorite={() => toggleWishlist("kumkumadi-oil")} onAdd={addToCart} onToast={showToast} /> : null}
              {showCategory("Oils") ? <ProductCard product={searchableProducts[7] ?? { productId: "mustard-oil", title: "Wood Pressed Mustard Oil", category: "Oils", price: 225, description: "Wood-pressed slowly to preserve its warming aroma." }} image={mustardOil} isFavorite={wishlist.includes("mustard-oil")} onFavorite={() => toggleWishlist("mustard-oil")} onAdd={addToCart} onToast={showToast} /> : null}
              {showCategory("Snacks") ? <ProductCard product={searchableProducts[8] ?? { productId: "honey-oat-biscuits", title: "Honey Oat Biscuits", category: "Snacks", price: 340, description: "A wholesome little bake with oats and honey." }} image={honeyOatBiscuits} isFavorite={wishlist.includes("honey-oat-biscuits")} onFavorite={() => toggleWishlist("honey-oat-biscuits")} onAdd={addToCart} onToast={showToast} /> : null}
              {showCategory("Spices") ? <ProductCard product={searchableProducts[9] ?? { productId: "black-salt", title: "Black Salt", category: "Spices", price: 180, description: "Mineral-rich salt for a bright, savoury finish." }} image={himalayanSpices} isFavorite={wishlist.includes("black-salt")} onFavorite={() => toggleWishlist("black-salt")} onAdd={addToCart} onToast={showToast} /> : null}
            </motion.div>
            {!searchableProducts.some((product) => showCategory(product.category)) ? (
              <p className="mt-8 text-sm text-deep-olive">No products in this collection just yet.</p>
            ) : null}
          </div>
        </section>

        <section id="story" className="bg-soft-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-[1.02fr_0.98fr] md:items-center lg:gap-16 lg:px-10">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden bg-cream"
            >
              <img
                className="aspect-[1.02/1] w-full object-cover md:aspect-[0.9/1]"
                src={womenCrafting}
                alt="Women preparing herbs and traditional foods by hand in a bright village kitchen"
                loading="lazy"
              />
            </motion.div>
            <div className="py-3 md:py-8">
              <SectionHeading
                eyebrow="The NIVIK story"
                title="Rooted in tradition. Raised by women."
                description="NIVIK Natural celebrates the strength, resilience and traditional knowledge of rural women across India. Every product reflects generations of craftsmanship, natural living and meaningful connections with village communities."
              />
              <div className="mt-8 space-y-5">
                <div className="flex gap-4 border-t border-forest-green/15 pt-4">
                  <span className="font-display text-2xl text-terracotta">01</span>
                  <p className="text-sm leading-6 text-deep-olive"><strong className="mr-2 text-forest-green">Source</strong>From trusted villages and Himalayan communities.</p>
                </div>
                <div className="flex gap-4 border-t border-forest-green/15 pt-4">
                  <span className="font-display text-2xl text-terracotta">02</span>
                  <p className="text-sm leading-6 text-deep-olive"><strong className="mr-2 text-forest-green">Craft</strong>Time-honoured methods, with care and attention.</p>
                </div>
                <div className="flex gap-4 border-t border-forest-green/15 pt-4">
                  <span className="font-display text-2xl text-terracotta">03</span>
                  <p className="text-sm leading-6 text-deep-olive"><strong className="mr-2 text-forest-green">Empower</strong>Fair livelihoods and financial independence.</p>
                </div>
              </div>
              <Button asChild variant="link" className="mt-6 h-auto px-0 text-forest-green">
                <a href="#women">Meet the women behind NIVIK <ArrowUpRight aria-hidden="true" /></a>
              </Button>
            </div>
          </div>
        </section>

        <section id="women" className="bg-cream py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="grid gap-7 md:grid-cols-[0.72fr_1.28fr] md:items-end">
              <SectionHeading eyebrow="The people behind every jar" title="When she thrives, tradition lives on." />
              <p className="max-w-xl pb-1 text-base leading-7 text-deep-olive">
                From sourcing and preparation to careful packing, women lead every step — turning generations of knowledge into meaningful livelihoods.
              </p>
            </div>
            <div className="mt-9 overflow-hidden bg-sage-green">
              <img
                className="aspect-[1.55/1] w-full object-cover md:aspect-[2.3/1]"
                src={communityImpact}
                alt="Women gathering herbs and preparing small-batch goods in a Himalayan village garden"
                loading="lazy"
              />
            </div>
            <div className="mt-5 grid gap-4 text-sm text-forest-green sm:grid-cols-3">
              <p className="flex items-center gap-2"><Sparkles aria-hidden="true" className="size-4 text-terracotta" /> Made with intention</p>
              <p className="flex items-center gap-2"><PackageCheck aria-hidden="true" className="size-4 text-terracotta" /> Thoughtful small batches</p>
              <p className="flex items-center gap-2"><Flower2 aria-hidden="true" className="size-4 text-terracotta" /> Direct village partnerships</p>
            </div>
          </div>
        </section>

        <section className="bg-forest-green py-14 text-warm-ivory sm:py-16">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 md:grid-cols-[0.9fr_1.1fr] lg:px-10">
            <div className="max-w-xl">
              <Eyebrow>From our hills to your home</Eyebrow>
              <h2 className="mt-3 font-display text-4xl leading-tight text-warm-ivory sm:text-5xl">
                A little golden goodness, made the old-fashioned way.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-warm-ivory/80">
                Our Badri cow ghee is slowly cultured, carefully clarified and made in small batches — a familiar comfort, returned to its roots.
              </p>
              <p className="mt-5 font-display text-2xl text-warm-ivory">{formatPrice(1450)}</p>
              <Button
                variant="secondary"
                className="mt-5 rounded-sm bg-warm-ivory text-forest-green hover:bg-cream"
                onClick={() => addToCart(searchableProducts[0] ?? { productId: "badri-ghee", title: "Badri Cow Desi Ghee", price: 1450 })}
              >
                Add ghee to bag <ArrowRight aria-hidden="true" />
              </Button>
            </div>
            <div className="overflow-hidden bg-warm-ivory">
              <img className="aspect-[4/3] w-full object-cover" src={gheeProduct} alt="Small-batch golden ghee in a glass jar" loading="lazy" />
            </div>
          </div>
        </section>

        <section id="journal" className="bg-soft-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <SectionHeading eyebrow="From our journal" title="Stories from the source." description="A closer look at the hands, harvests and traditions behind the good things we make." />
              <Button variant="outline" className="w-fit border-forest-green/30 text-forest-green" onClick={() => openArticle({ category: "Journal", title: "A note from the source", readingTime: "3 min read", body: "The best things begin with a place, a season, and the knowledge passed from one pair of hands to another. Our journal keeps those quiet, important details close — from harvest notes to kitchen traditions and the women who carry them forward." })}>
                Visit the journal <ArrowUpRight aria-hidden="true" />
              </Button>
            </div>
            <div className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              <article className="group">
                <div className="overflow-hidden bg-cream"><img className="aspect-[1.35/1] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" src={womenCrafting} alt="A maker at work in a village kitchen" loading="lazy" /></div>
                <p className="mt-4 text-xs uppercase text-terracotta">Community · 4 min read</p>
                <h3 className="mt-2 font-display text-2xl leading-tight text-forest-green">Empowering rural women through NIVIK</h3>
                <Button variant="link" className="mt-2 h-auto px-0 text-forest-green" onClick={() => openArticle({ category: "Community", title: "Empowering rural women through NIVIK", readingTime: "4 min read", body: "At the heart of NIVIK are women whose skill and knowledge have shaped the foodways of their communities for generations. By creating direct partnerships and thoughtful small-batch work, the aim is to make that knowledge visible — and its value shared." })}>Read story <ArrowRight aria-hidden="true" /></Button>
              </article>
              <article className="group">
                <div className="overflow-hidden bg-cream"><img className="aspect-[1.35/1] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" src={heroStillLife} alt="Honey, ghee and spices prepared on a sunlit table" loading="lazy" /></div>
                <p className="mt-4 text-xs uppercase text-terracotta">Tradition · 5 min read</p>
                <h3 className="mt-2 font-display text-2xl leading-tight text-forest-green">From village kitchens to handcrafted goodness</h3>
                <Button variant="link" className="mt-2 h-auto px-0 text-forest-green" onClick={() => openArticle({ category: "Tradition", title: "From village kitchens to handcrafted goodness", readingTime: "5 min read", body: "A patient hand, a well-used brass pot and a recipe learned by watching: many of the most meaningful pantry traditions cannot be rushed. Our small batches take their cue from those kitchens, with care at every step." })}>Read story <ArrowRight aria-hidden="true" /></Button>
              </article>
              <article className="group sm:col-span-2 lg:col-span-1">
                <div className="overflow-hidden bg-cream"><img className="aspect-[1.35/1] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" src={herbsBotanicals} alt="Fresh herbs and botanicals in a woven basket" loading="lazy" /></div>
                <p className="mt-4 text-xs uppercase text-terracotta">Ingredients · 3 min read</p>
                <h3 className="mt-2 font-display text-2xl leading-tight text-forest-green">The tradition behind Himalayan ingredients</h3>
                <Button variant="link" className="mt-2 h-auto px-0 text-forest-green" onClick={() => openArticle({ category: "Ingredients", title: "The tradition behind Himalayan ingredients", readingTime: "3 min read", body: "From bright turmeric to fragrant leaves, Himalayan ingredients carry a sense of place. Seasonal gathering and close attention help keep their natural character at the centre of every batch." })}>Read story <ArrowRight aria-hidden="true" /></Button>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-warm-ivory py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <Eyebrow>Goodness loved by our community</Eyebrow>
            <h2 className="mt-3 font-display text-4xl text-forest-green sm:text-5xl">A little love, shared.</h2>
            <div className="mx-auto mt-9 max-w-3xl border-y border-forest-green/15 px-5 py-9 sm:px-12 sm:py-12">
              <div className="flex justify-center gap-1 text-terracotta" aria-label="5 out of 5 stars">
                {[0, 1, 2, 3, 4].map((star) => <span key={star} aria-hidden="true">★</span>)}
              </div>
              <blockquote className="mt-5 font-display text-2xl leading-relaxed text-forest-green sm:text-3xl">
                “{activeTestimonial?.quote ?? "Goodness, made with care and shared with love."}”
              </blockquote>
              <p className="mt-5 text-sm text-deep-olive">
                <span className="font-semibold text-forest-green">{activeTestimonial?.name ?? "A NIVIK customer"}</span>
                <span className="mx-2" aria-hidden="true">·</span>{activeTestimonial?.location ?? "India"}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">Demo testimonials for preview only; not verified customer reviews.</p>
            </div>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Button variant="outline" size="icon" className="rounded-full border-forest-green/30 text-forest-green" aria-label="Previous testimonial" onClick={() => setTestimonialIndex((current) => (current + testimonials.length - 1) % testimonials.length)}>
                <ChevronLeft aria-hidden="true" />
              </Button>
              <span className="min-w-12 text-sm text-deep-olive" aria-live="polite">{testimonialIndex + 1} / {testimonials.length}</span>
              <Button variant="outline" size="icon" className="rounded-full border-forest-green/30 text-forest-green" aria-label="Next testimonial" onClick={() => setTestimonialIndex((current) => (current + 1) % testimonials.length)}>
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-cream py-14 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-[1fr_0.9fr] md:items-center lg:px-10">
            <div>
              <Eyebrow>A note from the source</Eyebrow>
              <h2 className="mt-3 max-w-xl font-display text-4xl leading-tight text-forest-green sm:text-5xl">Bring village goodness home.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-deep-olive">Discover new harvests, recipes and stories from the women behind every product.</p>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row" onSubmit={submitNewsletter} noValidate>
              <label className="sr-only" htmlFor="newsletter-email">Email address</label>
              <Input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(event) => { setNewsletterEmail(event.target.value); setNewsletterMessage(""); }}
                className="h-12 border-forest-green/20 bg-soft-white"
                aria-describedby={newsletterMessage ? "newsletter-feedback" : undefined}
              />
              <Button type="submit" size="lg" className="h-12 shrink-0 rounded-sm px-6">Subscribe <ArrowRight aria-hidden="true" /></Button>
              {newsletterMessage ? <p id="newsletter-feedback" className="text-sm text-forest-green sm:absolute sm:mt-14" role="status">{newsletterMessage}</p> : null}
            </form>
          </div>
        </section>
      </main>

      <footer id="footer" className="bg-forest-green text-warm-ivory">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1fr] lg:px-10 lg:py-16">
          <div className="max-w-sm">
            <BrandMark inverse />
            <p className="mt-5 text-sm leading-7 text-warm-ivory/75">Goodness from the source — traditionally crafted by rural women and thoughtfully brought to your table.</p>
            <div className="mt-5 flex gap-2">
              <Button variant="ghost" size="icon" className="text-warm-ivory hover:bg-warm-ivory/10 hover:text-warm-ivory" aria-label="Instagram preview" title="Instagram" onClick={() => showToast("Social links are shown as a preview.")}><Instagram aria-hidden="true" /></Button>
              <Button variant="ghost" size="icon" className="text-warm-ivory hover:bg-warm-ivory/10 hover:text-warm-ivory" aria-label="Facebook preview" title="Facebook" onClick={() => showToast("Social links are shown as a preview.")}><Facebook aria-hidden="true" /></Button>
              <Button variant="ghost" size="icon" className="text-warm-ivory hover:bg-warm-ivory/10 hover:text-warm-ivory" aria-label="YouTube preview" title="YouTube" onClick={() => showToast("Social links are shown as a preview.")}><Youtube aria-hidden="true" /></Button>
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl">Explore</h2>
            <nav aria-label="Footer navigation" className="mt-4 flex flex-col gap-3 text-sm text-warm-ivory/75">
              <a className="hover:text-warm-ivory" href="#categories">Shop categories</a>
              <a className="hover:text-warm-ivory" href="#story">Our story</a>
              <a className="hover:text-warm-ivory" href="#women">Women behind NIVIK</a>
              <a className="hover:text-warm-ivory" href="#journal">Journal</a>
            </nav>
          </div>
          <div>
            <h2 className="font-display text-2xl">Customer care</h2>
            <div className="mt-4 flex flex-col items-start gap-3 text-sm text-warm-ivory/75">
              <Button variant="link" className="h-auto p-0 text-warm-ivory/75 hover:text-warm-ivory" onClick={() => setFooterInfo({ title: "Shipping & delivery", body: "Shipping details are part of this storefront preview. No deliveries or orders are processed here." })}>Shipping & delivery</Button>
              <Button variant="link" className="h-auto p-0 text-warm-ivory/75 hover:text-warm-ivory" onClick={() => setFooterInfo({ title: "Returns & refunds", body: "This demo storefront does not take payments or fulfil orders. For a live shop, return and refund terms should be confirmed by NIVIK Natural." })}>Returns & refunds</Button>
              <Button variant="link" className="h-auto p-0 text-warm-ivory/75 hover:text-warm-ivory" onClick={() => setFooterInfo({ title: "Privacy policy", body: "This preview does not send or store newsletter, account, or checkout form submissions. A live storefront should publish its full privacy policy." })}>Privacy policy</Button>
              <Button variant="link" className="h-auto p-0 text-warm-ivory/75 hover:text-warm-ivory" onClick={() => setFooterInfo({ title: "Terms & conditions", body: "This is a demo storefront. Sample prices and product details are illustrative; no purchase, payment, or order is created." })}>Terms & conditions</Button>
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl">Say hello</h2>
            <a className="mt-4 inline-block text-sm text-warm-ivory/75 underline underline-offset-4 hover:text-warm-ivory" href="mailto:hello@niviknatural.com">hello@niviknatural.com</a>
            <p className="mt-5 flex items-center gap-2 text-xs text-warm-ivory/70"><Truck aria-hidden="true" className="size-4" /> Thoughtfully packed, with care.</p>
          </div>
        </div>
        <div className="border-t border-warm-ivory/15 px-4 py-5 text-center text-xs text-warm-ivory/65">
          © {new Date().getFullYear()} NIVIK Natural. Pure from the source.
        </div>
      </footer>

      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="flex w-[min(92vw,460px)] flex-col border-cream bg-warm-ivory px-5 pt-12 sm:px-7">
          <SheetHeader className="items-start border-b border-forest-green/10 pb-5">
            <SheetTitle className="font-display text-3xl font-medium text-forest-green">Your bag <span className="font-sans text-sm">({getCartItemCount(cart)})</span></SheetTitle>
            <SheetDescription className="text-left text-deep-olive">A little goodness, gathered for you.</SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {cart.length ? cart.map((item) => (
              <CartLine key={item.productId} item={item} onQuantity={(productId, quantity) => setCart((current) => setCartQuantity(current, productId, quantity))} onRemove={(productId) => setCart((current) => removeCartItem(current, productId))} />
            )) : (
              <div className="flex h-full min-h-52 flex-col items-center justify-center text-center">
                <span className="grid size-14 place-items-center rounded-full bg-cream text-forest-green"><ShoppingBag aria-hidden="true" /></span>
                <h3 className="mt-4 font-display text-2xl text-forest-green">Your bag is taking a breather.</h3>
                <p className="mt-2 max-w-xs text-sm text-deep-olive">Find something lovely to bring home.</p>
                <Button className="mt-5" onClick={() => { setCartOpen(false); scrollToSection("shop"); }}>Explore the collection</Button>
              </div>
            )}
          </div>
          {cart.length ? (
            <div className="border-t border-forest-green/15 pt-5">
              <div className="flex items-center justify-between text-base font-semibold text-forest-green"><span>Subtotal</span><span>{formatPrice(getCartSubtotal(cart))}</span></div>
              <p className="mt-2 text-xs leading-5 text-deep-olive">Shipping and any applicable charges are confirmed by the live shop. This preview does not process orders.</p>
              <Button className="mt-5 w-full" onClick={() => { setCartOpen(false); setCheckoutMessage(""); setCheckoutOpen(true); }}>Continue to demo checkout <ArrowRight aria-hidden="true" /></Button>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto border-cream bg-warm-ivory p-5 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-medium text-forest-green">Find something good.</DialogTitle>
            <DialogDescription className="text-deep-olive">Search the NIVIK collection by name, ingredient or category.</DialogDescription>
          </DialogHeader>
          <div className="relative mt-3">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-deep-olive" />
            <label className="sr-only" htmlFor="product-search">Search products</label>
            <Input id="product-search" autoFocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Try honey, tea or spices" className="h-12 border-forest-green/20 bg-soft-white pl-10" />
          </div>
          {searchTerm.trim() ? (
            <div className="mt-3">
              {filteredSearchResults.length ? filteredSearchResults.map((product) => (
                <div key={product.productId} className="flex items-center justify-between gap-3 border-b border-forest-green/10 py-4">
                  <div className="min-w-0">
                    <p className="font-display text-xl text-forest-green">{product.title}</p>
                    <p className="mt-1 text-xs text-deep-olive">{product.category} <span className="mx-1">·</span>{formatPrice(product.price)}</p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 border-forest-green/30 text-forest-green" onClick={() => openSearchResult(product)}>View product</Button>
                </div>
              )) : <p className="py-8 text-center text-sm text-deep-olive">No matches yet. Try another ingredient or category.</p>}
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {(["Ghee", "Honey", "Herbal teas", "Spices"] as const).map((term) => <Button key={term} variant="outline" size="sm" className="border-forest-green/20 text-forest-green" onClick={() => setSearchTerm(term)}>{term}</Button>)}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={accountOpen} onOpenChange={setAccountOpen}>
        <DialogContent className="max-w-md border-cream bg-warm-ivory p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-medium text-forest-green">Welcome to NIVIK.</DialogTitle>
            <DialogDescription className="text-deep-olive">Keep your favourite things close.</DialogDescription>
          </DialogHeader>
          <form className="mt-3 space-y-4" onSubmit={submitAccount} noValidate>
            <label className="block text-sm font-medium text-charcoal" htmlFor="account-email">Email address</label>
            <Input id="account-email" type="email" autoComplete="email" value={accountEmail} onChange={(event) => { setAccountEmail(event.target.value); setAccountMessage(""); }} placeholder="you@example.com" className="h-11 bg-soft-white" />
            <Button type="submit" className="w-full">Continue with email <ArrowRight aria-hidden="true" /></Button>
            {accountMessage ? <p className="text-sm text-deep-olive" role="status">{accountMessage}</p> : null}
          </form>
          <p className="text-xs leading-5 text-muted-foreground">Account access is not connected in this storefront preview.</p>
        </DialogContent>
      </Dialog>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-lg border-cream bg-warm-ivory p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-medium text-forest-green">A checkout preview.</DialogTitle>
            <DialogDescription className="text-deep-olive">Review the demo flow without placing a real order.</DialogDescription>
          </DialogHeader>
          <div className="mt-3 border-y border-forest-green/15 py-4 text-sm text-deep-olive">
            <div className="flex justify-between gap-4"><span>{getCartItemCount(cart)} items</span><span className="font-semibold text-forest-green">{formatPrice(getCartSubtotal(cart))}</span></div>
          </div>
          <form className="mt-4 space-y-4" onSubmit={submitCheckout} noValidate>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal" htmlFor="checkout-name">Name</label>
              <Input id="checkout-name" autoComplete="name" value={checkoutName} onChange={(event) => { setCheckoutName(event.target.value); setCheckoutMessage(""); }} placeholder="Your name" className="bg-soft-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal" htmlFor="checkout-email">Email address</label>
              <Input id="checkout-email" type="email" autoComplete="email" value={checkoutEmail} onChange={(event) => { setCheckoutEmail(event.target.value); setCheckoutMessage(""); }} placeholder="you@example.com" className="bg-soft-white" />
            </div>
            <Button type="submit" className="w-full">Review demo order <ArrowRight aria-hidden="true" /></Button>
            {checkoutMessage ? <p className="text-sm leading-6 text-deep-olive" role="status">{checkoutMessage}</p> : null}
          </form>
          <p className="text-xs leading-5 text-muted-foreground">No payment is taken and no order is placed.</p>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(story)} onOpenChange={(open) => { if (!open) setStory(null); }}>
        <DialogContent className="max-w-xl border-cream bg-warm-ivory p-6 sm:p-9">
          <DialogHeader>
            <Eyebrow>{story?.category ?? "From our journal"} <span className="mx-1">·</span> {story?.readingTime ?? ""}</Eyebrow>
            <DialogTitle className="font-display text-3xl font-medium leading-tight text-forest-green sm:text-4xl">{story?.title ?? "Stories from the source"}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-base leading-7 text-deep-olive">{story?.body ?? "A closer look at the people, places and practices behind the collection."}</DialogDescription>
          <Button variant="outline" className="mt-2 w-fit border-forest-green/30 text-forest-green" onClick={() => { setStory(null); scrollToSection("women"); }}>Meet the makers <ArrowRight aria-hidden="true" /></Button>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(footerInfo)} onOpenChange={(open) => { if (!open) setFooterInfo(null); }}>
        <DialogContent className="max-w-md border-cream bg-warm-ivory p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-medium text-forest-green">{footerInfo?.title ?? "NIVIK Natural"}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-base leading-7 text-deep-olive">{footerInfo?.body ?? "This storefront is a demonstration."}</DialogDescription>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            key="store-toast"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
            className="fixed bottom-5 left-1/2 z-[80] max-w-[calc(100vw-2rem)] -translate-x-1/2 border border-cream bg-soft-white px-5 py-3 text-sm text-forest-green shadow-lg"
            role="status"
            aria-live="polite"
          >
            {toastMessage}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {scrolled ? (
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-5 right-4 z-30 rounded-full shadow-md sm:right-6"
          aria-label="Back to top"
          title="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowLeft aria-hidden="true" className="rotate-90" />
        </Button>
      ) : null}
    </div>
  );
}