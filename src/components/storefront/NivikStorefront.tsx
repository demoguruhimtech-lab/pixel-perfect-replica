import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Eye,
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
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
  Youtube,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Direct image imports from src/assets
import blackSalt from "@/assets/black-salt.jpg";
import blueTea from "@/assets/blue-tea.jpg";
import botanicalFaceOil from "@/assets/botanical-face-oil.jpg";
import communityImpact from "@/assets/community-impact.jpg";
import gheeProduct from "@/assets/ghee-product.jpg";
import herbalTea from "@/assets/herbal-tea.jpg";
import herbsBotanicals from "@/assets/herbs-botanicals.jpg";
import heroStillLife from "@/assets/hero-still-life.jpg";
import himalayanSpices from "@/assets/himalayan-spices.jpg";
import homeLifestyle from "@/assets/home-lifestyle.jpg";
import honeyOatBiscuits from "@/assets/honey-oat-biscuits.jpg";
import honeyProduct from "@/assets/honey-product.jpg";
import mustardOil from "@/assets/mustard-oil.jpg";
import pahadiHaldi from "@/assets/pahadi-haldi.jpg";
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

export type CategoryFilter =
  | "All products"
  | "Ghee & Dairy"
  | "Honey"
  | "Herbal teas"
  | "Spices"
  | "Wellness";

export interface DetailedProductInfo extends CartProduct {
  category: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  description: string;
  origin: string;
  ingredients: string;
  servingNote: string;
  weight: string;
}

export interface StoryInfo {
  category: string;
  title: string;
  readingTime: string;
  image: string;
  subtitle: string;
  body: string[];
}

const announcements = [
  "Pure Village Goodness, Delivered to Your Doorstep.",
  "Traditionally Crafted • Naturally Sourced.",
  "Every Purchase Supports Rural Women Across India.",
];

const categoryFilters: CategoryFilter[] = [
  "All products",
  "Ghee & Dairy",
  "Honey",
  "Herbal teas",
  "Spices",
  "Wellness",
];

const productsData: DetailedProductInfo[] = [
  {
    productId: "badri-ghee",
    title: "Badri Cow Desi Ghee",
    category: "Ghee & Dairy",
    badge: "Bestseller",
    price: 1450,
    rating: 4.9,
    reviewCount: 128,
    weight: "500 ml",
    origin: "High Himalayan Valleys, Garhwal, Uttarakhand",
    ingredients: "100% Cultured A2 Badri Cow Milk Fat (Hand-churned Bilona method)",
    servingNote: "Drizzle over steaming rotis, warm rice, or take a spoonful in warm milk before sleep.",
    description: "Slowly bilona-churned from cultured curd of indigenous free-grazing Badri cows. Gently clarified over slow firewood flame for an authentic granular texture and deep nutty aroma.",
  },
  {
    productId: "organic-honey",
    title: "Organic Honey",
    category: "Honey",
    badge: "Raw & Pure",
    price: 240,
    rating: 4.8,
    reviewCount: 94,
    weight: "350 g",
    origin: "Sub-Himalayan Foothills, Uttarakhand",
    ingredients: "100% Raw Multi-Flora Forest Honey (Cold-filtered, unpasteurized)",
    servingNote: "Stir into herbal teas or warm lemon water; never boil raw honey.",
    description: "Cold-filtered raw honey harvested gently by village beekeeping collectives from wild mountain blooms. Naturally rich in natural enzymes, pollen, and subtle botanical undertones.",
  },
  {
    productId: "blue-tea",
    title: "Blue Tea",
    category: "Herbal teas",
    badge: "Floral",
    price: 340,
    rating: 4.7,
    reviewCount: 56,
    weight: "50 g (Approx. 40 cups)",
    origin: "Sunlit Mountain Terraces, Assam & Bengal",
    ingredients: "100% Whole Sun-Dried Butterfly Pea Flowers (Clitoria ternatea)",
    servingNote: "Brew 4-5 flowers in hot water for 3 minutes. Add a squeeze of lemon to watch it turn brilliant purple!",
    description: "Whole handpicked butterfly pea flowers that steep into a vibrant royal blue infusion. Naturally caffeine-free and cherished in Ayurveda for clarity and deep relaxation.",
  },
  {
    productId: "chamomile-tea",
    title: "Chamomile Tea",
    category: "Herbal teas",
    badge: "Calming",
    price: 280,
    rating: 4.8,
    reviewCount: 82,
    weight: "50 g",
    origin: "Kullu Valley, Himachal Pradesh",
    ingredients: "100% Whole Matricaria Chamomilla Flower Heads",
    servingNote: "Steep 1 tablespoon in freshly boiled water for 4-5 minutes before bedtime.",
    description: "Intact sunny chamomile blooms dried under shade to preserve their natural essential oils. Delivers a delicate apple-honey fragrance that soothes the nervous system.",
  },
  {
    productId: "garam-masala",
    title: "Garam Masala",
    category: "Spices",
    badge: "Aromatic",
    price: 220,
    rating: 4.9,
    reviewCount: 110,
    weight: "100 g",
    origin: "Kerala Spice Hills & Himalayan Foothills",
    ingredients: "Whole Cardamom, Mace, Nutmeg, Cinnamon Bark, Cloves, Star Anise, Black Cumin",
    servingNote: "Sprinkle a pinch at the very end of cooking to preserve its exquisite volatile aromatics.",
    description: "Heirloom family recipe roasted gently on cast iron before slow stone-grinding. Fragrant, complex, and free from fillers or starch.",
  },
  {
    productId: "pahadi-haldi",
    title: "Organic Pahadi Haldi",
    category: "Spices",
    badge: "From the Hills",
    price: 195,
    rating: 5.0,
    reviewCount: 142,
    weight: "200 g",
    origin: "Ranikhet Highlands, Uttarakhand",
    ingredients: "100% Organic High-Curcumin Pahadi Turmeric (Curcuma longa)",
    servingNote: "Whisk 1/2 teaspoon into warm milk with black pepper and honey for golden milk.",
    description: "Renowned high-altitude turmeric naturally endowed with up to 6.5% natural curcumin. Grown without chemical fertilisers and stone-ground by village self-help groups.",
  },
  {
    productId: "kumkumadi-oil",
    title: "Kumkumadi Oil",
    category: "Wellness",
    badge: "Ayurvedic",
    price: 950,
    rating: 4.9,
    reviewCount: 78,
    weight: "30 ml",
    origin: "Classical Preparation, Kashmir & Kerala",
    ingredients: "Kashmiri Saffron Stigmas, Sandalwood, Manjistha, Blue Lotus, Sesame Seed Oil, Goat Milk",
    servingNote: "Massage 2-3 drops onto cleansed damp facial skin nightly with gentle upward strokes.",
    description: "Traditional botanical facial oil slow-cooked over three days using real Kashmiri saffron and 16 therapeutic herbs. Nourishes skin, refines texture, and restores natural radiance.",
  },
  {
    productId: "mustard-oil",
    title: "Wood Pressed Mustard Oil",
    category: "Oils",
    badge: "Cold-Pressed",
    price: 225,
    rating: 4.8,
    reviewCount: 65,
    weight: "1000 ml",
    origin: "Village Farms, Rajasthan",
    ingredients: "100% Pure First-Press Yellow Mustard Seeds (Wood-pressed Kohlu)",
    servingNote: "Ideal for traditional Indian curries, pickle curing, and invigorating winter body massages.",
    description: "Crushed slowly in traditional wooden mortars (Kachi Ghani) at ambient temperature. Retains all natural pungency, heart-healthy monounsaturated fats, and warm aroma.",
  },
  {
    productId: "honey-oat-biscuits",
    title: "Honey Oat Biscuits",
    category: "Snacks",
    badge: "Freshly Baked",
    price: 340,
    rating: 4.7,
    reviewCount: 43,
    weight: "250 g (12 pieces)",
    origin: "Village Bakery, Dehradun",
    ingredients: "Rolled Oats, Pure Mountain Honey, A2 Desi Ghee, Stone-ground Whole Wheat, Cardamom",
    servingNote: "Pair with morning masala chai or a comforting evening cup of herbal blue tea.",
    description: "Crisp artisanal cookies baked in small batches without refined flour, palm oil, or white sugar. Wholesome sweetness brought solely by raw honey and pure desi ghee.",
  },
  {
    productId: "black-salt",
    title: "Black Salt",
    category: "Spices",
    badge: "Mineral-Rich",
    price: 180,
    rating: 4.8,
    reviewCount: 89,
    weight: "250 g",
    origin: "Himalayan Mineral Belt",
    ingredients: "100% Traditional Himalayan Kala Namak (Kiln-fired with Harad & Baheda)",
    servingNote: "Perfect on fresh salads, chaats, lemonades, chutneys, and roasted seeds.",
    description: "Volcanic mineral salt kiln-fired inside clay pots with Ayurvedic herbs. Known for its distinct savoury umami punch and therapeutic digestive properties.",
  },
];

const testimonials = [
  {
    name: "Ananya Mukherjee",
    location: "Pune, Maharashtra",
    verified: "Village Community Supporter",
    rating: 5,
    quote:
      "The Badri Cow Ghee is unlike anything from commercial shelves — it has the exact golden aroma and grainy texture of the ghee my grandmother hand-churned in our village.",
  },
  {
    name: "Rhea Singhania",
    location: "Bengaluru, Karnataka",
    verified: "Verified Buyer",
    rating: 5,
    quote:
      "The raw honey is delicately floral and clearly unadulterated. Knowing every order directly sustains rural women artisans makes enjoying it even more meaningful.",
  },
  {
    name: "Mira Kulkarni",
    location: "Mumbai, Maharashtra",
    verified: "Verified Buyer",
    rating: 5,
    quote:
      "The blue tea and chamomile tea have become our nightly ritual. The packaging is eco-conscious, aesthetic, and the ingredients are fresh from the mountains.",
  },
  {
    name: "Devika Pant",
    location: "New Delhi",
    verified: "Pahadi Heritage Patron",
    rating: 5,
    quote:
      "The Pahadi Haldi is so vibrant and aromatic that even a quarter teaspoon transforms everyday dal. You can immediately sense the purity and care behind it.",
  },
];

const journalArticles: StoryInfo[] = [
  {
    category: "Community",
    readingTime: "4 min read",
    title: "Empowering Rural Women Through NIVIK",
    subtitle: "How traditional knowledge is transforming into sustainable financial independence.",
    image: womenCrafting,
    body: [
      "At the heart of NIVIK Natural are women whose knowledge and craftsmanship have nurtured Indian village kitchens for centuries. Sourcing directly through women-led cooperatives ensures fair living wages and true self-reliance.",
      "From selecting native seeds and sun-drying mountain herbs to operating cold wooden presses, rural women lead every stage of production. When women control the value chain, entire rural communities flourish with dignity.",
    ],
  },
  {
    category: "Tradition",
    readingTime: "5 min read",
    title: "From Village Kitchens to Handcrafted Goodness",
    subtitle: "The ancient bilona method: why slow, cultured ghee matters for body and soul.",
    image: heroStillLife,
    body: [
      "Unlike modern industrial butter oils made by centrifuge, true desi ghee begins with cultured whole A2 curd, slow bilona hand-churning, and gentle flame clarifying. This retains fat-soluble vitamins A, D, E, K and beneficial short-chain fatty acids like butyrate.",
      "By preserving these ancient techniques, NIVIK ensures that you receive not merely food, but authentic living nutrition made exactly as described in ancient Ayurvedic treatises.",
    ],
  },
  {
    category: "Ingredients",
    readingTime: "3 min read",
    title: "The Tradition Behind Natural Himalayan Ingredients",
    subtitle: "High altitudes, clean glacial runoff, and untamed soil produce unparalleled vitality.",
    image: herbsBotanicals,
    body: [
      "The extreme diurnal temperature shifts of the Himalayan valleys force native botanicals, turmeric, and wild herbs to concentrate their defensive antioxidants and essential volatile oils.",
      "Harvested in harmony with seasonal rhythms by local foraging collectives, every jar holds the pristine essence of mountain air, pure soil, and centuries of native Himalayan stewardship.",
    ],
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
      className={`group inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 ${
        inverse ? "text-warm-ivory" : "text-forest-green"
      }`}
      href="#home"
      aria-label="NIVIK Natural home"
    >
      <span
        className={`grid size-10 place-items-center rounded-full border transition-transform duration-300 group-hover:rotate-12 ${
          inverse
            ? "border-warm-ivory/30 bg-warm-ivory/10 text-warm-ivory"
            : "border-forest-green/30 bg-cream/70 text-forest-green"
        }`}
      >
        <Leaf aria-hidden="true" className="size-5" strokeWidth={1.75} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl font-semibold tracking-wide sm:text-3xl">
          NIVIK
        </span>
        <span className="mt-0.5 text-[0.62rem] font-medium tracking-[0.22em] uppercase opacity-90">
          Natural
        </span>
      </span>
    </a>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-terracotta sm:text-xs">
      {children}
    </p>
  );
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
      <h2 className="mt-3 font-display text-3xl leading-[1.12] text-forest-green sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3.5 text-sm leading-relaxed text-deep-olive sm:text-base sm:leading-7">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function ProductCard({
  product,
  image,
  isFavorite,
  onFavorite,
  onAdd,
  onQuickView,
}: {
  product: DetailedProductInfo;
  image: string;
  isFavorite: boolean;
  onFavorite: () => void;
  onAdd: (product: CartProduct, quantity?: number) => void;
  onQuickView: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      layout
      className="group flex flex-col justify-between rounded-sm border border-forest-green/10 bg-soft-white p-3 transition-shadow duration-300 hover:shadow-lg sm:p-4"
      {...(shouldReduceMotion ? {} : { whileHover: { y: -4 } })}
      transition={{ duration: 0.25 }}
    >
      <div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-cream">
          <img
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            src={image}
            alt={product.title}
            loading="lazy"
          />

          {product.badge ? (
            <span className="absolute left-3 top-3 rounded-full bg-soft-white/95 px-2.5 py-1 text-[0.62rem] font-semibold tracking-wider uppercase text-forest-green shadow-sm backdrop-blur-sm">
              {product.badge}
            </span>
          ) : null}

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 size-8 rounded-full border border-forest-green/10 bg-soft-white/90 text-forest-green shadow-sm backdrop-blur-sm transition-transform hover:scale-110 hover:bg-soft-white"
            onClick={onFavorite}
            aria-label={
              isFavorite
                ? `Remove ${product.title} from wishlist`
                : `Add ${product.title} to wishlist`
            }
            title={isFavorite ? "Remove from wishlist" : "Save for later"}
          >
            <Heart
              aria-hidden="true"
              className={`size-4 transition-colors ${
                isFavorite ? "fill-terracotta text-terracotta" : "text-forest-green"
              }`}
            />
          </Button>

          <Button
            variant="ghost"
            className="absolute inset-x-3 bottom-3 hidden h-9 items-center justify-center gap-1.5 rounded-sm border border-forest-green/20 bg-soft-white/90 text-xs font-medium text-forest-green opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 sm:flex hover:bg-soft-white"
            onClick={onQuickView}
            aria-label={`Quick view ${product.title}`}
          >
            <Eye className="size-3.5" /> Quick View
          </Button>
        </div>

        <div className="pt-3.5">
          <div className="flex items-center justify-between text-xs text-deep-olive">
            <span className="font-medium tracking-wide uppercase">{product.category}</span>
            <span className="flex items-center gap-1 text-[0.75rem] font-semibold text-terracotta">
              <Star className="size-3 fill-terracotta text-terracotta" />
              {product.rating}
              <span className="text-[0.68rem] font-normal text-deep-olive/70">
                ({product.reviewCount})
              </span>
            </span>
          </div>

          <h3 className="mt-1.5 font-display text-xl leading-snug text-charcoal sm:text-2xl">
            {product.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-deep-olive">
            {product.description}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-forest-green/10 pt-3">
        <div className="flex items-baseline justify-between">
          <span className="font-display text-xl font-medium text-forest-green sm:text-2xl">
            {formatPrice(product.price)}
          </span>
          <span className="text-[0.7rem] text-deep-olive">{product.weight}</span>
        </div>

        <div className="mt-2.5 grid grid-cols-1 gap-1.5 sm:grid-cols-4">
          <Button
            variant="outline"
            className="col-span-1 h-9 rounded-sm border-forest-green/25 px-0 text-xs text-forest-green sm:hidden"
            onClick={onQuickView}
          >
            <Eye className="size-3.5" /> View
          </Button>
          <Button
            variant="default"
            className="col-span-1 h-9 rounded-sm bg-forest-green px-3 text-xs font-medium text-warm-ivory shadow-none transition-all hover:bg-deep-olive sm:col-span-4"
            onClick={() => onAdd(product, 1)}
          >
            <ShoppingBag aria-hidden="true" className="mr-1.5 size-3.5" /> Add to Bag
          </Button>
        </div>
      </div>
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
      className="group block overflow-hidden rounded-sm border border-forest-green/10 bg-soft-white p-2.5 transition-all duration-300 hover:border-forest-green/30 hover:shadow-md"
      href="#shop"
      onClick={(event) => {
        event.preventDefault();
        onExplore();
      }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-cream">
        <img
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          src={image}
          alt={title}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
        <div className="absolute inset-x-3 bottom-3 text-warm-ivory">
          <p className="font-display text-lg font-medium leading-tight sm:text-xl">{title}</p>
          <span className="mt-1 inline-flex items-center gap-1 text-[0.7rem] font-medium tracking-wider text-warm-ivory/80 group-hover:text-warm-ivory">
            Explore Collection <ArrowUpRight className="size-3 text-terracotta" />
          </span>
        </div>
      </div>
    </a>
  );
}

function CartLine({
  item,
  image,
  onQuantity,
  onRemove,
}: {
  item: CartLineItem;
  image?: string;
  onQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}) {
  return (
    <div className="flex gap-3 border-b border-forest-green/10 py-4">
      {image ? (
        <div className="size-16 shrink-0 overflow-hidden rounded-sm bg-cream">
          <img src={image} alt={item.title} className="size-full object-cover" />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-display text-lg font-medium leading-tight text-forest-green">
            {item.title}
          </h4>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 shrink-0 text-deep-olive hover:text-charcoal"
            aria-label={`Remove ${item.title}`}
            title="Remove item"
            onClick={() => onRemove(item.productId)}
          >
            <X className="size-3.5" />
          </Button>
        </div>
        <p className="mt-0.5 text-xs text-deep-olive">{formatPrice(item.price)} each</p>
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center rounded-sm border border-forest-green/20">
            <Button
              variant="ghost"
              size="icon"
              className="size-7 rounded-none"
              aria-label={`Decrease ${item.title} quantity`}
              onClick={() => onQuantity(item.productId, item.quantity - 1)}
            >
              <Minus className="size-3" />
            </Button>
            <span className="min-w-6 text-center text-xs font-semibold" aria-live="polite">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 rounded-none"
              aria-label={`Increase ${item.title} quantity`}
              onClick={() => onQuantity(item.productId, item.quantity + 1)}
            >
              <Plus className="size-3" />
            </Button>
          </div>
          <span className="font-display text-base font-semibold text-forest-green">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
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
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedQuickView, setSelectedQuickView] = useState<DetailedProductInfo | null>(null);
  const [quickViewQuantity, setQuickViewQuantity] = useState(1);
  const [activeStory, setActiveStory] = useState<StoryInfo | null>(null);
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
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [checkoutSuccessOrderId, setCheckoutSuccessOrderId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const announcementTimer = window.setInterval(() => {
      setAnnouncementIndex((current) => (current + 1) % announcements.length);
    }, 4500);

    const onScroll = () => setScrolled(window.scrollY > 20);
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
    const timer = window.setTimeout(() => setToastMessage(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (message: string) => setToastMessage(message);

  const addToCart = (product: CartProduct, quantity = 1) => {
    setCart((current) => {
      let next = current;
      for (let i = 0; i < quantity; i += 1) {
        next = addCartItem(next, product);
      }
      return next;
    });
    showToast(
      quantity > 1
        ? `${quantity} × ${product.title} added to your bag.`
        : `${product.title} added to your bag.`,
    );
  };

  const toggleWishlist = (productId: string, productTitle: string) => {
    setWishlist((current) => {
      const exists = current.includes(productId);
      showToast(
        exists
          ? `${productTitle} removed from wishlist.`
          : `${productTitle} saved to your wishlist.`,
      );
      return exists ? current.filter((id) => id !== productId) : [...current, productId];
    });
  };

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    setShopMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getProductImage = (productId: string) => {
    switch (productId) {
      case "badri-ghee":
        return gheeProduct;
      case "organic-honey":
        return honeyProduct;
      case "blue-tea":
        return blueTea;
      case "chamomile-tea":
        return herbalTea;
      case "garam-masala":
        return himalayanSpices;
      case "pahadi-haldi":
        return pahadiHaldi;
      case "kumkumadi-oil":
        return botanicalFaceOil;
      case "mustard-oil":
        return mustardOil;
      case "honey-oat-biscuits":
        return honeyOatBiscuits;
      case "black-salt":
        return blackSalt;
      default:
        return heroStillLife;
    }
  };

  const visibleProducts = useMemo(() => {
    if (selectedCategory === "All products") return productsData;
    return productsData.filter((p) => {
      if (selectedCategory === "Ghee & Dairy") return p.category === "Ghee & Dairy";
      if (selectedCategory === "Honey") return p.category === "Honey";
      if (selectedCategory === "Herbal teas") return p.category === "Herbal teas";
      if (selectedCategory === "Spices") return p.category === "Spices";
      if (selectedCategory === "Wellness") return p.category === "Wellness";
      return true;
    });
  }, [selectedCategory]);

  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return [];
    return productsData.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.ingredients.toLowerCase().includes(query),
    );
  }, [searchTerm]);

  const activeTestimonial = testimonials[testimonialIndex] ?? testimonials[0];

  const handleNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.trim())) {
      setNewsletterMessage("Please provide a valid email address.");
      return;
    }
    setNewsletterMessage("Welcome to the NIVIK family! Thank you for supporting village craft.");
    showToast("Subscribed to the NIVIK Journal.");
    setNewsletterEmail("");
  };

  const handleAccountSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountEmail.trim())) {
      setAccountMessage("Please enter a valid email address.");
      return;
    }
    setAccountMessage("Demo login simulation. No live database connection required.");
  };

  const handleCheckoutSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!checkoutForm.name.trim() || !checkoutForm.email.trim() || !checkoutForm.city.trim()) {
      setCheckoutError("Please provide your name, email, and city.");
      return;
    }
    const demoOrderId = `NIVIK-${Math.floor(100000 + Math.random() * 900000)}`;
    setCheckoutSuccessOrderId(demoOrderId);
    setCart([]);
    showToast(`Demo order #${demoOrderId} received!`);
  };

  const freeDeliveryThreshold = 1000;
  const currentSubtotal = getCartSubtotal(cart);
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - currentSubtotal);

  return (
    <div className="min-h-screen overflow-x-clip bg-warm-ivory text-charcoal selection:bg-sage-green/40 selection:text-forest-green">
      {/* 3. TOP ANNOUNCEMENT BAR */}
      <div className="relative flex min-h-9 items-center justify-between bg-forest-green px-4 py-1.5 text-center text-xs text-warm-ivory sm:px-8">
        <Button
          variant="ghost"
          size="icon"
          className="size-6 text-warm-ivory/70 hover:bg-forest-green/80 hover:text-warm-ivory"
          onClick={() =>
            setAnnouncementIndex(
              (current) => (current + announcements.length - 1) % announcements.length,
            )
          }
          aria-label="Previous announcement"
        >
          <ChevronLeft className="size-3.5" />
        </Button>

        <div className="flex-1 overflow-hidden px-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={announcementIndex}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              {...(shouldReduceMotion ? {} : { exit: { opacity: 0, y: -5 } })}
              transition={{ duration: 0.28 }}
              className="text-[0.68rem] font-medium tracking-wide sm:text-xs"
              aria-live="polite"
            >
              {announcements[announcementIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-6 text-warm-ivory/70 hover:bg-forest-green/80 hover:text-warm-ivory"
          onClick={() => setAnnouncementIndex((current) => (current + 1) % announcements.length)}
          aria-label="Next announcement"
        >
          <ChevronRight className="size-3.5" />
        </Button>
      </div>

      {/* 4. PREMIUM HEADER & NAVIGATION */}
      <header
        className={`sticky top-0 z-40 border-b border-forest-green/10 transition-all duration-300 ${
          scrolled ? "bg-warm-ivory/95 shadow-sm backdrop-blur-md" : "bg-warm-ivory"
        }`}
      >
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <BrandMark />

          {/* Center navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 text-sm font-medium text-charcoal lg:flex"
          >
            <a
              className="transition-colors hover:text-terracotta"
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home");
              }}
            >
              Home
            </a>

            {/* Shop Categories dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                className="h-auto gap-1 px-0 py-2 text-sm font-medium text-charcoal hover:bg-transparent hover:text-terracotta"
                aria-expanded={shopMenuOpen}
                onClick={() => setShopMenuOpen((open) => !open)}
              >
                Shop <ChevronDown aria-hidden="true" className="size-3.5 opacity-70" />
              </Button>

              <AnimatePresence>
                {shopMenuOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full z-50 mt-2 w-72 rounded-sm border border-cream bg-soft-white p-3.5 shadow-xl"
                  >
                    <p className="px-3 pb-2 text-[0.68rem] font-semibold tracking-wider uppercase text-deep-olive">
                      Shop By Category
                    </p>
                    <div className="space-y-0.5">
                      <a
                        className="block rounded-sm px-3 py-2 text-xs font-medium text-forest-green hover:bg-cream"
                        href="#categories"
                        onClick={(e) => {
                          e.preventDefault();
                          setShopMenuOpen(false);
                          scrollToSection("categories");
                        }}
                      >
                        All 10 Handcrafted Categories
                      </a>
                      <a
                        className="block rounded-sm px-3 py-2 text-xs text-charcoal hover:bg-cream"
                        href="#shop"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory("Ghee & Dairy");
                          setShopMenuOpen(false);
                          scrollToSection("shop");
                        }}
                      >
                        Badri Cow Ghee & Dairy
                      </a>
                      <a
                        className="block rounded-sm px-3 py-2 text-xs text-charcoal hover:bg-cream"
                        href="#shop"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory("Honey");
                          setShopMenuOpen(false);
                          scrollToSection("shop");
                        }}
                      >
                        Raw Wild Forest Honey
                      </a>
                      <a
                        className="block rounded-sm px-3 py-2 text-xs text-charcoal hover:bg-cream"
                        href="#shop"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory("Herbal teas");
                          setShopMenuOpen(false);
                          scrollToSection("shop");
                        }}
                      >
                        Himalayan Herbal & Blue Teas
                      </a>
                      <a
                        className="block rounded-sm px-3 py-2 text-xs text-charcoal hover:bg-cream"
                        href="#shop"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory("Spices");
                          setShopMenuOpen(false);
                          scrollToSection("shop");
                        }}
                      >
                        Stone-ground Spices & Haldi
                      </a>
                      <a
                        className="block rounded-sm px-3 py-2 text-xs text-charcoal hover:bg-cream"
                        href="#shop"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory("Wellness");
                          setShopMenuOpen(false);
                          scrollToSection("shop");
                        }}
                      >
                        Ayurvedic Beauty & Wellness
                      </a>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <a
              className="transition-colors hover:text-terracotta"
              href="#story"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("story");
              }}
            >
              Our Story
            </a>

            <a
              className="transition-colors hover:text-terracotta"
              href="#women"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("women");
              }}
            >
              Women Behind NIVIK
            </a>

            <a
              className="transition-colors hover:text-terracotta"
              href="#journal"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("journal");
              }}
            >
              Journal
            </a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-forest-green hover:bg-cream"
              aria-label="Search products"
              title="Search collection"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full text-forest-green hover:bg-cream"
              aria-label={`Wishlist, ${wishlist.length} saved`}
              title="Wishlist"
              onClick={() => setWishlistOpen(true)}
            >
              <Heart className="size-4" />
              {wishlist.length > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-deep-olive text-[0.6rem] font-semibold text-soft-white">
                  {wishlist.length}
                </span>
              ) : null}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-forest-green hover:bg-cream"
              aria-label="User Account"
              title="Account"
              onClick={() => setAccountOpen(true)}
            >
              <CircleUserRound className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full text-forest-green hover:bg-cream"
              aria-label={`Shopping bag, ${getCartItemCount(cart)} items`}
              title="Shopping bag"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="size-4" />
              {getCartItemCount(cart) > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-terracotta text-[0.6rem] font-semibold text-soft-white">
                  {getCartItemCount(cart)}
                </span>
              ) : null}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-forest-green hover:bg-cream lg:hidden"
              aria-label="Open navigation menu"
              title="Menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[min(88vw,380px)] border-cream bg-warm-ivory px-6 pt-10">
          <SheetHeader className="items-start border-b border-forest-green/10 pb-5">
            <BrandMark />
            <SheetDescription className="pt-2 text-left text-xs text-deep-olive">
              Pure from the source. Powerful by nature.
            </SheetDescription>
          </SheetHeader>
          <nav aria-label="Mobile navigation" className="mt-6 flex flex-col space-y-1">
            <a
              className="border-b border-forest-green/10 py-3.5 font-display text-2xl text-forest-green"
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home");
              }}
            >
              Home
            </a>
            <a
              className="border-b border-forest-green/10 py-3.5 font-display text-2xl text-forest-green"
              href="#categories"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("categories");
              }}
            >
              Shop Categories
            </a>
            <a
              className="border-b border-forest-green/10 py-3.5 font-display text-2xl text-forest-green"
              href="#shop"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("shop");
              }}
            >
              Our Products
            </a>
            <a
              className="border-b border-forest-green/10 py-3.5 font-display text-2xl text-forest-green"
              href="#story"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("story");
              }}
            >
              Our Story
            </a>
            <a
              className="border-b border-forest-green/10 py-3.5 font-display text-2xl text-forest-green"
              href="#women"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("women");
              }}
            >
              Women Behind NIVIK
            </a>
            <a
              className="border-b border-forest-green/10 py-3.5 font-display text-2xl text-forest-green"
              href="#journal"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("journal");
              }}
            >
              Journal
            </a>
          </nav>
          <div className="mt-8 space-y-3">
            <Button
              className="w-full bg-forest-green text-warm-ivory"
              onClick={() => {
                setMobileMenuOpen(false);
                setCartOpen(true);
              }}
            >
              <ShoppingBag className="mr-2 size-4" /> Open Your Bag ({getCartItemCount(cart)})
            </Button>
            <Button
              variant="outline"
              className="w-full border-forest-green/20 text-forest-green"
              onClick={() => {
                setMobileMenuOpen(false);
                setWishlistOpen(true);
              }}
            >
              <Heart className="mr-2 size-4" /> View Wishlist ({wishlist.length})
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <main>
        {/* 5. HERO SECTION – Asymmetric Two-Column Editorial */}
        <section id="home" className="overflow-hidden bg-warm-ivory">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 md:pb-20 md:pt-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-10 lg:py-20">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="relative z-10"
            >
              <Eyebrow>FROM FARM TO TABLE • WITH PURPOSE</Eyebrow>
              <h1 className="mt-4 font-display text-4xl leading-[1.08] text-forest-green sm:text-6xl lg:text-7xl">
                Pure from the source.
                <span className="mt-1 block italic text-terracotta">Powerful by nature.</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-deep-olive sm:text-base sm:leading-8">
                Discover traditionally crafted ghee, raw honey, Himalayan spices and natural wellness essentials, thoughtfully made with care by rural women across India.
              </p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Button
                  size="lg"
                  className="h-12 rounded-sm bg-forest-green px-7 text-sm font-medium text-warm-ivory shadow-sm transition-all hover:bg-deep-olive"
                  onClick={() => scrollToSection("shop")}
                >
                  Explore Our Collection <ArrowDownRight className="ml-1.5 size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-sm border-forest-green/30 bg-transparent px-7 text-sm font-medium text-forest-green hover:bg-cream"
                  onClick={() => scrollToSection("story")}
                >
                  Discover Our Story
                </Button>
              </div>

              {/* Three trust indicators */}
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-forest-green/15 pt-6 text-xs font-medium text-forest-green">
                <span className="inline-flex items-center gap-2">
                  <BadgeCheck aria-hidden="true" className="size-4 text-terracotta" /> Small Batch Crafted
                </span>
                <span className="inline-flex items-center gap-2">
                  <Leaf aria-hidden="true" className="size-4 text-terracotta" /> Honest Ingredients
                </span>
                <span className="inline-flex items-center gap-2">
                  <Flower2 aria-hidden="true" className="size-4 text-terracotta" /> Women Powered
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
              className="relative"
            >
              <div className="overflow-hidden rounded-sm border border-forest-green/10 bg-cream shadow-xl">
                <img
                  className="aspect-[4/3] w-full object-cover sm:aspect-[1.38/1]"
                  src={heroStillLife}
                  alt="Traditionally crafted ghee jar, pure raw honey and Himalayan herbs bathed in warm sunlight"
                  fetchPriority="high"
                />
              </div>

              <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-sm border border-cream bg-soft-white px-4 py-3 shadow-lg sm:bottom-6 sm:left-6">
                <span className="grid size-10 place-items-center rounded-full bg-cream text-forest-green">
                  <Feather aria-hidden="true" className="size-5 text-terracotta" />
                </span>
                <div>
                  <span className="block font-display text-lg font-medium text-forest-green">
                    Every jar has a story
                  </span>
                  <span className="block text-[0.7rem] text-deep-olive">
                    Handcrafted in village clusters
                  </span>
                </div>
              </div>

              <div className="absolute -right-3 -top-3 hidden size-24 items-center justify-center rounded-full border border-forest-green/20 bg-warm-ivory text-center text-[0.62rem] font-semibold uppercase leading-4 tracking-wider text-forest-green shadow-md sm:flex">
                100%<br />Natural<br />Goodness
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. BRAND TRUST STRIP – Horizontal Marquee */}
        <section aria-label="Brand trust highlights" className="overflow-hidden border-y border-forest-green/10 bg-cream py-3.5">
          <div className="nivik-marquee-track flex w-max items-center gap-10 whitespace-nowrap text-xs font-semibold tracking-wider uppercase text-forest-green" aria-hidden="true">
            {[0, 1, 2].map((copy) => (
              <span className="flex items-center gap-10" key={copy}>
                <span>Village Sourced</span>
                <Leaf className="size-3 text-terracotta" />
                <span>Traditionally Crafted</span>
                <Leaf className="size-3 text-terracotta" />
                <span>Women Empowered</span>
                <Leaf className="size-3 text-terracotta" />
                <span>Natural Goodness</span>
                <Leaf className="size-3 text-terracotta" />
                <span>Small Batch Production</span>
                <Leaf className="size-3 text-terracotta" />
              </span>
            ))}
          </div>
        </section>

        {/* 7. CATEGORY EXPLORATION SECTION */}
        <section id="categories" className="bg-soft-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <SectionHeading
              eyebrow="SHOP THE GOODNESS"
              title="Nature, in every form."
              description="Explore our thoughtfully curated collection of natural goodness."
              centered
            />

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
              className="mt-12 grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6"
            >
              <CategoryCard
                title="Ghee & Dairy"
                image={gheeProduct}
                onExplore={() => {
                  setSelectedCategory("Ghee & Dairy");
                  scrollToSection("shop");
                }}
              />
              <CategoryCard
                title="Herbal Teas"
                image={herbalTea}
                onExplore={() => {
                  setSelectedCategory("Herbal teas");
                  scrollToSection("shop");
                }}
              />
              <CategoryCard
                title="Spices & Masalas"
                image={himalayanSpices}
                onExplore={() => {
                  setSelectedCategory("Spices");
                  scrollToSection("shop");
                }}
              />
              <CategoryCard
                title="Raw Honey"
                image={honeyProduct}
                onExplore={() => {
                  setSelectedCategory("Honey");
                  scrollToSection("shop");
                }}
              />
              <CategoryCard
                title="Wood-Pressed Oils"
                image={mustardOil}
                onExplore={() => {
                  setSelectedCategory("All products");
                  scrollToSection("shop");
                }}
              />
              <CategoryCard
                title="Healthy Snacks"
                image={honeyOatBiscuits}
                onExplore={() => {
                  setSelectedCategory("All products");
                  scrollToSection("shop");
                }}
              />
              <CategoryCard
                title="Ayurvedic Beauty & Wellness"
                image={botanicalFaceOil}
                onExplore={() => {
                  setSelectedCategory("Wellness");
                  scrollToSection("shop");
                }}
              />
              <CategoryCard
                title="Pickles & Pantry"
                image={picklePantry}
                onExplore={() => {
                  setSelectedCategory("All products");
                  scrollToSection("shop");
                }}
              />
              <CategoryCard
                title="Herbs & Botanicals"
                image={herbsBotanicals}
                onExplore={() => {
                  setSelectedCategory("Herbal teas");
                  scrollToSection("shop");
                }}
              />
              <CategoryCard
                title="Home & Lifestyle"
                image={homeLifestyle}
                onExplore={() => {
                  setSelectedCategory("All products");
                  scrollToSection("shop");
                }}
              />
            </motion.div>
          </div>
        </section>

        {/* 8. FEATURED PRODUCT COLLECTION */}
        <section id="shop" className="bg-warm-ivory py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                eyebrow="OUR PRODUCTS"
                title="Explore our natural collection."
                description="Goodness sourced with care, crafted with tradition and delivered with love."
              />
              <Button
                variant="outline"
                className="w-fit shrink-0 border-forest-green/30 text-xs font-semibold text-forest-green hover:bg-cream"
                onClick={() => setSelectedCategory("All products")}
              >
                View All Products <ArrowRight className="ml-1.5 size-3.5" />
              </Button>
            </div>

            {/* Category Filter Tabs */}
            <div
              className="mt-8 flex gap-2 overflow-x-auto pb-2"
              role="tablist"
              aria-label="Filter products by category"
            >
              {categoryFilters.map((category) => (
                <Button
                  key={category}
                  role="tab"
                  aria-selected={selectedCategory === category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className={`shrink-0 rounded-full px-5 text-xs font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-forest-green text-warm-ivory shadow-sm hover:bg-deep-olive"
                      : "border-forest-green/20 text-forest-green hover:bg-cream"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Product Cards Grid: 2 columns mobile, 3 tablet, 4 desktop */}
            <motion.div
              layout
              className="mt-8 grid grid-cols-2 gap-3.5 sm:gap-6 lg:grid-cols-4 lg:gap-7"
            >
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  image={getProductImage(product.productId)}
                  isFavorite={wishlist.includes(product.productId)}
                  onFavorite={() => toggleWishlist(product.productId, product.title)}
                  onAdd={addToCart}
                  onQuickView={() => {
                    setSelectedQuickView(product);
                    setQuickViewQuantity(1);
                  }}
                />
              ))}
            </motion.div>

            {visibleProducts.length === 0 ? (
              <div className="py-12 text-center text-sm text-deep-olive">
                No products found in this category. Click &quot;View All Products&quot; to reset.
              </div>
            ) : null}
          </div>
        </section>

        {/* 9. EDITORIAL BRAND STORY SECTION */}
        <section id="story" className="bg-soft-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-[1fr_1fr] lg:gap-16 lg:px-10">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65 }}
              className="relative overflow-hidden rounded-sm border border-forest-green/10 bg-cream shadow-lg"
            >
              <img
                className="aspect-[4/3] w-full object-cover md:aspect-[0.94/1]"
                src={womenCrafting}
                alt="Rural women crafting small-batch food products using traditional techniques in a sunlit village workspace"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 rounded-sm bg-soft-white/95 px-4 py-2.5 text-xs text-forest-green shadow-md backdrop-blur-sm">
                <span className="font-display text-base font-semibold">Generations of Craft</span>
                <p className="text-[0.68rem] text-deep-olive">Living heritage from Indian villages</p>
              </div>
            </motion.div>

            <div>
              <SectionHeading
                eyebrow="THE NIVIK STORY"
                title="Rooted in tradition. Raised by women."
                description="NIVIK Natural celebrates the strength, resilience and traditional knowledge of rural women across India. Every product reflects generations of craftsmanship, natural living and meaningful connections with village communities."
              />

              <div className="mt-8 space-y-5">
                <div className="flex gap-4 border-t border-forest-green/15 pt-4">
                  <span className="font-display text-2xl font-semibold text-terracotta">01</span>
                  <div>
                    <h3 className="text-sm font-semibold text-forest-green">SOURCE</h3>
                    <p className="mt-0.5 text-xs leading-5 text-deep-olive">
                      From trusted villages and Himalayan communities with pristine air, living soil, and clean mountain water.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 border-t border-forest-green/15 pt-4">
                  <span className="font-display text-2xl font-semibold text-terracotta">02</span>
                  <div>
                    <h3 className="text-sm font-semibold text-forest-green">CRAFT</h3>
                    <p className="mt-0.5 text-xs leading-5 text-deep-olive">
                      Time-honoured methods, with care and attention — wood-pressing, bilona curd churning, and sun drying.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 border-t border-forest-green/15 pt-4">
                  <span className="font-display text-2xl font-semibold text-terracotta">03</span>
                  <div>
                    <h3 className="text-sm font-semibold text-forest-green">EMPOWER</h3>
                    <p className="mt-0.5 text-xs leading-5 text-deep-olive">
                      Fair livelihoods and financial independence for rural women artisans and their families.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="link"
                className="mt-6 h-auto p-0 font-medium text-forest-green hover:text-terracotta"
                onClick={() => scrollToSection("women")}
              >
                Meet the Women Behind NIVIK <ArrowUpRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* 10. IMAGE-LED BRAND IMPACT SECTION */}
        <section id="women" className="bg-cream py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="grid gap-6 md:grid-cols-[0.75fr_1.25fr] md:items-end">
              <div>
                <Eyebrow>COMMUNITY & IMPACT</Eyebrow>
                <h2 className="mt-3 font-display text-3xl leading-tight text-forest-green sm:text-4xl lg:text-5xl">
                  When she thrives, tradition lives on.
                </h2>
              </div>
              <p className="max-w-xl pb-1 text-sm leading-relaxed text-deep-olive sm:text-base sm:leading-7">
                From sourcing and preparation to careful packing, women lead every step — turning generations of knowledge into meaningful livelihoods.
              </p>
            </div>

            <div className="mt-10 overflow-hidden rounded-sm border border-forest-green/10 bg-sage-green shadow-xl">
              <img
                className="aspect-[1.5/1] w-full object-cover md:aspect-[2.3/1]"
                src={communityImpact}
                alt="Women gathering herbs and collaborating in a Himalayan village garden"
                loading="lazy"
              />
            </div>

            <div className="mt-8 grid gap-4 rounded-sm border border-forest-green/10 bg-soft-white p-5 text-sm text-forest-green sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-cream text-terracotta">
                  <Sparkles className="size-4" />
                </span>
                <div>
                  <h3 className="font-semibold text-forest-green">Made with Intention</h3>
                  <p className="text-xs text-deep-olive">Honouring nature&apos;s natural rhythms</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-cream text-terracotta">
                  <PackageCheck className="size-4" />
                </span>
                <div>
                  <h3 className="font-semibold text-forest-green">Thoughtful Small Batches</h3>
                  <p className="text-xs text-deep-olive">Freshly crafted, never warehouse aged</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-cream text-terracotta">
                  <Flower2 className="size-4" />
                </span>
                <div>
                  <h3 className="font-semibold text-forest-green">Direct Village Partnerships</h3>
                  <p className="text-xs text-deep-olive">Transparent, fair-trade earnings</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. BESTSELLER / FEATURED PRODUCT BANNER */}
        <section className="bg-forest-green py-16 text-warm-ivory sm:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[1fr_1fr] lg:gap-14 lg:px-10">
            <div className="max-w-xl">
              <Eyebrow>FEATURED HARVEST SPOTLIGHT</Eyebrow>
              <h2 className="mt-3 font-display text-3xl leading-tight text-warm-ivory sm:text-4xl lg:text-5xl">
                A little golden goodness, made the old-fashioned way.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-warm-ivory/80 sm:text-base sm:leading-7">
                Our Badri cow ghee is slowly bilona-churned from cultured A2 curd, carefully clarified over slow flame, and packed in small batches — a familiar comfort, returned to its roots.
              </p>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-3xl font-semibold text-warm-ivory">
                  {formatPrice(1450)}
                </span>
                <span className="text-xs text-warm-ivory/70">500 ml • Glass Jar</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="rounded-sm bg-warm-ivory px-7 text-sm font-semibold text-forest-green hover:bg-cream"
                  onClick={() => addToCart(productsData[0], 1)}
                >
                  <ShoppingBag className="mr-2 size-4" /> Shop Badri Ghee Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-sm border-warm-ivory/30 bg-transparent px-6 text-sm text-warm-ivory hover:bg-warm-ivory/10 hover:text-warm-ivory"
                  onClick={() => {
                    setSelectedQuickView(productsData[0]);
                    setQuickViewQuantity(1);
                  }}
                >
                  <Eye className="mr-2 size-4" /> View Details
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-sm border border-warm-ivory/20 bg-warm-ivory shadow-2xl">
              <img
                className="aspect-[4/3] w-full object-cover sm:aspect-[1.25/1]"
                src={gheeProduct}
                alt="Golden Badri Cow Desi Ghee in clear glass jar"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* 12. JOURNAL / STORIES SECTION */}
        <section id="journal" className="bg-soft-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="FROM OUR JOURNAL"
                title="Stories from the source."
                description="A closer look at the hands, harvests and traditions behind the good things we make."
              />
              <Button
                variant="outline"
                className="w-fit border-forest-green/30 text-xs font-semibold text-forest-green hover:bg-cream"
                onClick={() => setActiveStory(journalArticles[0])}
              >
                Read Featured Story <ArrowUpRight className="ml-1 size-3.5" />
              </Button>
            </div>

            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {journalArticles.map((article, idx) => (
                <article
                  key={idx}
                  className="group flex flex-col justify-between rounded-sm border border-forest-green/10 bg-warm-ivory/40 p-4 transition-all duration-300 hover:shadow-md"
                >
                  <div>
                    <div className="aspect-[1.38/1] overflow-hidden rounded-sm bg-cream">
                      <img
                        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        src={article.image}
                        alt={article.title}
                        loading="lazy"
                      />
                    </div>
                    <p className="mt-4 text-[0.68rem] font-semibold tracking-wider uppercase text-terracotta">
                      {article.category} • {article.readingTime}
                    </p>
                    <h3 className="mt-2 font-display text-xl leading-snug text-forest-green sm:text-2xl">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-deep-olive">
                      {article.subtitle}
                    </p>
                  </div>
                  <Button
                    variant="link"
                    className="mt-4 h-auto justify-start p-0 text-xs font-semibold text-forest-green hover:text-terracotta"
                    onClick={() => setActiveStory(article)}
                  >
                    Read Story <ArrowRight className="ml-1.5 size-3" />
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 13. TESTIMONIAL SECTION */}
        <section className="bg-warm-ivory py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <Eyebrow>CUSTOMER REFLECTIONS</Eyebrow>
            <h2 className="mt-3 font-display text-3xl text-forest-green sm:text-4xl lg:text-5xl">
              Goodness Loved by Our Community.
            </h2>

            <div className="mx-auto mt-8 rounded-sm border border-forest-green/15 bg-soft-white p-7 shadow-sm sm:p-12">
              <div className="flex justify-center gap-1 text-terracotta" aria-label="5 out of 5 stars">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} className="size-4 fill-terracotta text-terracotta" />
                ))}
              </div>

              <blockquote className="mt-5 font-display text-xl leading-relaxed text-forest-green sm:text-2xl md:text-3xl">
                &ldquo;{activeTestimonial.quote}&rdquo;
              </blockquote>

              <div className="mt-6 flex flex-col items-center">
                <span className="font-display text-lg font-semibold text-forest-green">
                  {activeTestimonial.name}
                </span>
                <span className="text-xs text-deep-olive">
                  {activeTestimonial.location} •{" "}
                  <span className="text-terracotta">{activeTestimonial.verified}</span>
                </span>
              </div>

              <p className="mt-5 text-[0.65rem] italic text-deep-olive/70">
                Demo testimonials for preview only; not verified customer reviews.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-full border-forest-green/30 text-forest-green hover:bg-cream"
                aria-label="Previous testimonial"
                onClick={() =>
                  setTestimonialIndex(
                    (current) => (current + testimonials.length - 1) % testimonials.length,
                  )
                }
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="min-w-14 text-xs font-medium text-deep-olive" aria-live="polite">
                {testimonialIndex + 1} / {testimonials.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-full border-forest-green/30 text-forest-green hover:bg-cream"
                aria-label="Next testimonial"
                onClick={() =>
                  setTestimonialIndex((current) => (current + 1) % testimonials.length)
                }
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* 14. NEWSLETTER SECTION */}
        <section className="bg-cream py-14 sm:py-18">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 md:grid-cols-[1.1fr_0.9fr] lg:px-10">
            <div>
              <Eyebrow>FROM THE VILLAGE ROOTS</Eyebrow>
              <h2 className="mt-2 font-display text-3xl leading-tight text-forest-green sm:text-4xl lg:text-5xl">
                Bring village goodness home.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-deep-olive">
                Discover new harvests, recipes and stories from the women behind every product.
              </p>
            </div>

            <div>
              <form className="flex flex-col gap-2.5 sm:flex-row" onSubmit={handleNewsletterSubmit} noValidate>
                <label className="sr-only" htmlFor="newsletter-email">
                  Email address
                </label>
                <Input
                  id="newsletter-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    setNewsletterMessage("");
                  }}
                  className="h-12 border-forest-green/20 bg-soft-white text-sm"
                  aria-describedby={newsletterMessage ? "newsletter-feedback" : undefined}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 shrink-0 rounded-sm bg-forest-green px-6 text-sm font-semibold text-warm-ivory hover:bg-deep-olive"
                >
                  Subscribe <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </form>
              {newsletterMessage ? (
                <p
                  id="newsletter-feedback"
                  className="mt-2 text-xs font-medium text-forest-green"
                  role="status"
                >
                  {newsletterMessage}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      {/* 15. PREMIUM FOOTER */}
      <footer id="footer" className="bg-forest-green text-warm-ivory">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_0.9fr_1fr_1fr] lg:px-10 lg:py-18">
          <div className="max-w-sm">
            <BrandMark inverse />
            <p className="mt-5 text-sm leading-relaxed text-warm-ivory/75">
              Goodness from the source — traditionally crafted by rural women and thoughtfully brought to your table across India.
            </p>
            <div className="mt-6 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full text-warm-ivory/80 hover:bg-warm-ivory/10 hover:text-warm-ivory"
                aria-label="Instagram"
                onClick={() => showToast("Social profiles preview.")}
              >
                <Instagram className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full text-warm-ivory/80 hover:bg-warm-ivory/10 hover:text-warm-ivory"
                aria-label="Facebook"
                onClick={() => showToast("Social profiles preview.")}
              >
                <Facebook className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full text-warm-ivory/80 hover:bg-warm-ivory/10 hover:text-warm-ivory"
                aria-label="YouTube"
                onClick={() => showToast("Social profiles preview.")}
              >
                <Youtube className="size-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl text-warm-ivory">Quick Links</h3>
            <nav aria-label="Footer navigation" className="mt-4 flex flex-col space-y-2.5 text-xs text-warm-ivory/75">
              <a
                className="hover:text-warm-ivory"
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("home");
                }}
              >
                Home
              </a>
              <a
                className="hover:text-warm-ivory"
                href="#categories"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("categories");
                }}
              >
                Shop Categories
              </a>
              <a
                className="hover:text-warm-ivory"
                href="#shop"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("shop");
                }}
              >
                Featured Products
              </a>
              <a
                className="hover:text-warm-ivory"
                href="#story"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("story");
                }}
              >
                Our Story
              </a>
              <a
                className="hover:text-warm-ivory"
                href="#women"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("women");
                }}
              >
                Women Behind NIVIK
              </a>
              <a
                className="hover:text-warm-ivory"
                href="#journal"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("journal");
                }}
              >
                Journal Stories
              </a>
            </nav>
          </div>

          <div>
            <h3 className="font-display text-xl text-warm-ivory">Customer Care</h3>
            <div className="mt-4 flex flex-col items-start space-y-2.5 text-xs text-warm-ivory/75">
              <Button
                variant="link"
                className="h-auto p-0 text-xs text-warm-ivory/75 hover:text-warm-ivory"
                onClick={() =>
                  setFooterInfo({
                    title: "Shipping & Delivery",
                    body: "All orders are carefully packed in recyclable, plastic-free materials. We dispatch orders via express courier services across all PIN codes in India. Free delivery applies on all orders above ₹1,000.",
                  })
                }
              >
                Shipping & Delivery
              </Button>
              <Button
                variant="link"
                className="h-auto p-0 text-xs text-warm-ivory/75 hover:text-warm-ivory"
                onClick={() =>
                  setFooterInfo({
                    title: "Returns & Refunds",
                    body: "Due to the artisanal, natural food grade nature of our products, returns are accepted if items arrive damaged or defective. Simply contact us within 48 hours with order details.",
                  })
                }
              >
                Returns & Refunds
              </Button>
              <Button
                variant="link"
                className="h-auto p-0 text-xs text-warm-ivory/75 hover:text-warm-ivory"
                onClick={() =>
                  setFooterInfo({
                    title: "Privacy Policy",
                    body: "NIVIK Natural respects your personal privacy. We do not sell or rent customer data. This demo storefront runs locally and does not transmit personal data to third parties.",
                  })
                }
              >
                Privacy Policy
              </Button>
              <Button
                variant="link"
                className="h-auto p-0 text-xs text-warm-ivory/75 hover:text-warm-ivory"
                onClick={() =>
                  setFooterInfo({
                    title: "Terms & Conditions",
                    body: "This is a demonstration SPA inspired by NIVIK Natural. All product descriptions, pricing in INR, and weights are sample content for demonstration purposes.",
                  })
                }
              >
                Terms & Conditions
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl text-warm-ivory">Contact & Care</h3>
            <p className="mt-4 text-xs text-warm-ivory/75">
              Have questions or want to partner with village self-help groups?
            </p>
            <a
              className="mt-2 inline-block text-xs font-medium text-warm-ivory underline underline-offset-4 hover:text-warm-ivory/80"
              href="mailto:hello@niviknatural.com"
            >
              hello@niviknatural.com
            </a>
            <div className="mt-5 space-y-2 border-t border-warm-ivory/15 pt-4 text-[0.7rem] text-warm-ivory/70">
              <p className="flex items-center gap-1.5">
                <Truck className="size-3.5 text-terracotta" /> Eco-friendly plastic-free packaging
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-terracotta" /> 100% Honest, unadulterated food
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-warm-ivory/15 px-4 py-5 text-center text-[0.7rem] text-warm-ivory/65">
          © {new Date().getFullYear()} NIVIK Natural. All rights reserved. Sourced with care, crafted with tradition.
        </div>
      </footer>

      {/* 16. FUNCTIONAL MODALS & DRAWERS */}

      {/* Shopping Bag Drawer */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="flex w-[min(94vw,460px)] flex-col border-cream bg-warm-ivory px-5 pt-10 sm:px-7">
          <SheetHeader className="items-start border-b border-forest-green/10 pb-4">
            <SheetTitle className="font-display text-3xl font-medium text-forest-green">
              Your Bag <span className="font-sans text-xs">({getCartItemCount(cart)} items)</span>
            </SheetTitle>
            <SheetDescription className="text-left text-xs text-deep-olive">
              Artisanal goodness, freshly packed for your home.
            </SheetDescription>
          </SheetHeader>

          {/* Free Shipping Indicator */}
          {cart.length > 0 ? (
            <div className="mt-3 rounded-sm border border-forest-green/15 bg-cream/70 p-3 text-xs">
              <div className="flex items-center justify-between text-forest-green">
                <span className="font-medium">
                  {amountNeededForFreeDelivery === 0
                    ? "🎉 You have unlocked Free Village Delivery!"
                    : `Add ${formatPrice(amountNeededForFreeDelivery)} more for Free Delivery`}
                </span>
                <span className="text-[0.68rem] text-deep-olive font-semibold">
                  {Math.min(100, Math.round((currentSubtotal / freeDeliveryThreshold) * 100))}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-forest-green/15">
                <div
                  className="h-full bg-terracotta transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (currentSubtotal / freeDeliveryThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : null}

          {/* Cart Item List */}
          <div className="min-h-0 flex-1 overflow-y-auto py-2">
            {cart.length > 0 ? (
              cart.map((item) => (
                <CartLine
                  key={item.productId}
                  item={item}
                  image={getProductImage(item.productId)}
                  onQuantity={(id, q) => setCart((curr) => setCartQuantity(curr, id, q))}
                  onRemove={(id) => setCart((curr) => removeCartItem(curr, id))}
                />
              ))
            ) : (
              <div className="flex h-full min-h-60 flex-col items-center justify-center text-center">
                <span className="grid size-14 place-items-center rounded-full bg-cream text-forest-green">
                  <ShoppingBag className="size-6 text-deep-olive" />
                </span>
                <h3 className="mt-4 font-display text-2xl text-forest-green">
                  Your bag is currently empty.
                </h3>
                <p className="mt-1 max-w-xs text-xs text-deep-olive">
                  Explore our handcrafted ghee, raw honey, and Himalayan spices.
                </p>
                <Button
                  className="mt-5 bg-forest-green text-xs text-warm-ivory hover:bg-deep-olive"
                  onClick={() => {
                    setCartOpen(false);
                    scrollToSection("shop");
                  }}
                >
                  Explore Collection
                </Button>
              </div>
            )}
          </div>

          {/* Cart Footer Subtotal & Checkout */}
          {cart.length > 0 ? (
            <div className="border-t border-forest-green/15 pt-4">
              <div className="flex items-center justify-between text-base font-semibold text-forest-green">
                <span>Subtotal</span>
                <span className="font-display text-2xl">{formatPrice(currentSubtotal)}</span>
              </div>
              <p className="mt-1 text-[0.7rem] text-deep-olive">
                Taxes included. Delivery calculated at checkout preview.
              </p>
              <Button
                className="mt-4 w-full bg-forest-green py-5 text-sm font-semibold text-warm-ivory hover:bg-deep-olive"
                onClick={() => {
                  setCartOpen(false);
                  setCheckoutError("");
                  setCheckoutSuccessOrderId(null);
                  setCheckoutOpen(true);
                }}
              >
                Proceed to Demo Checkout <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* Wishlist Drawer */}
      <Sheet open={wishlistOpen} onOpenChange={setWishlistOpen}>
        <SheetContent side="right" className="flex w-[min(94vw,440px)] flex-col border-cream bg-warm-ivory px-5 pt-10 sm:px-7">
          <SheetHeader className="items-start border-b border-forest-green/10 pb-4">
            <SheetTitle className="font-display text-3xl font-medium text-forest-green">
              Saved For Later <span className="font-sans text-xs">({wishlist.length})</span>
            </SheetTitle>
            <SheetDescription className="text-left text-xs text-deep-olive">
              Keep your favourite natural items handy for your next order.
            </SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto py-3">
            {wishlist.length > 0 ? (
              <div className="space-y-3">
                {productsData
                  .filter((p) => wishlist.includes(p.productId))
                  .map((product) => (
                    <div
                      key={product.productId}
                      className="flex items-center justify-between gap-3 rounded-sm border border-forest-green/10 bg-soft-white p-3"
                    >
                      <div className="size-14 shrink-0 overflow-hidden rounded-sm bg-cream">
                        <img
                          src={getProductImage(product.productId)}
                          alt={product.title}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display text-base font-medium leading-snug text-forest-green">
                          {product.title}
                        </h4>
                        <p className="text-xs font-semibold text-terracotta">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <Button
                          size="sm"
                          className="h-7 bg-forest-green px-2.5 text-[0.68rem] text-warm-ivory hover:bg-deep-olive"
                          onClick={() => {
                            addToCart(product, 1);
                          }}
                        >
                          Add to Bag
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 p-0 text-[0.65rem] text-deep-olive hover:text-charcoal"
                          onClick={() => toggleWishlist(product.productId, product.title)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex h-full min-h-60 flex-col items-center justify-center text-center">
                <span className="grid size-14 place-items-center rounded-full bg-cream text-forest-green">
                  <Heart className="size-6 text-deep-olive" />
                </span>
                <h3 className="mt-4 font-display text-2xl text-forest-green">
                  No saved products yet.
                </h3>
                <p className="mt-1 max-w-xs text-xs text-deep-olive">
                  Click the heart icon on any product card to save it here.
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Product Quick-View Modal */}
      <Dialog
        open={Boolean(selectedQuickView)}
        onOpenChange={(open) => {
          if (!open) setSelectedQuickView(null);
        }}
      >
        <DialogContent className="max-h-[92vh] w-[min(94vw,900px)] max-w-[900px] overflow-y-auto border-cream bg-warm-ivory p-0 sm:rounded-sm">
          {selectedQuickView ? (
            <div className="grid md:grid-cols-2">
              <div className="aspect-[4/5] bg-cream md:aspect-auto">
                <img
                  className="size-full object-cover"
                  src={getProductImage(selectedQuickView.productId)}
                  alt={selectedQuickView.title}
                />
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-9">
                <div>
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <Eyebrow>{selectedQuickView.category}</Eyebrow>
                      {selectedQuickView.badge ? (
                        <span className="rounded-full bg-forest-green/10 px-2.5 py-0.5 text-[0.65rem] font-semibold text-forest-green">
                          {selectedQuickView.badge}
                        </span>
                      ) : null}
                    </div>
                    <DialogTitle className="mt-2 font-display text-3xl font-medium leading-tight text-forest-green sm:text-4xl">
                      {selectedQuickView.title}
                    </DialogTitle>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-terracotta">
                      <div className="flex">
                        {[0, 1, 2, 3, 4].map((s) => (
                          <Star key={s} className="size-3.5 fill-terracotta text-terracotta" />
                        ))}
                      </div>
                      <span className="font-semibold">{selectedQuickView.rating}</span>
                      <span className="text-deep-olive">({selectedQuickView.reviewCount} customer reviews)</span>
                    </div>
                  </DialogHeader>

                  <p className="mt-4 text-sm leading-relaxed text-deep-olive">
                    {selectedQuickView.description}
                  </p>

                  <div className="mt-5 space-y-2 rounded-sm border border-forest-green/10 bg-cream/50 p-3.5 text-xs">
                    <p>
                      <strong className="text-forest-green">Origin:</strong> {selectedQuickView.origin}
                    </p>
                    <p>
                      <strong className="text-forest-green">Ingredients:</strong> {selectedQuickView.ingredients}
                    </p>
                    <p>
                      <strong className="text-forest-green">Serving Suggestion:</strong> {selectedQuickView.servingNote}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-forest-green/15 pt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-3xl font-semibold text-forest-green">
                      {formatPrice(selectedQuickView.price * quickViewQuantity)}
                    </span>
                    <span className="text-xs text-deep-olive">
                      {selectedQuickView.weight} • Small batch harvest
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex items-center rounded-sm border border-forest-green/20 bg-soft-white">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9"
                        aria-label="Decrease quantity"
                        onClick={() => setQuickViewQuantity((q) => Math.max(1, q - 1))}
                      >
                        <Minus className="size-3.5" />
                      </Button>
                      <span className="min-w-8 text-center text-sm font-semibold">
                        {quickViewQuantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9"
                        aria-label="Increase quantity"
                        onClick={() => setQuickViewQuantity((q) => q + 1)}
                      >
                        <Plus className="size-3.5" />
                      </Button>
                    </div>

                    <Button
                      className="flex-1 bg-forest-green py-5 text-xs font-semibold text-warm-ivory hover:bg-deep-olive"
                      onClick={() => {
                        addToCart(selectedQuickView, quickViewQuantity);
                        setSelectedQuickView(null);
                      }}
                    >
                      <ShoppingBag className="mr-2 size-4" /> Add {quickViewQuantity} to Bag
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Live Search Modal */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto border-cream bg-warm-ivory p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-medium text-forest-green">
              Find Pure Goodness.
            </DialogTitle>
            <DialogDescription className="text-xs text-deep-olive">
              Search by product name, natural ingredient, or category.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mt-4">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-deep-olive" />
            <Input
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Try 'ghee', 'blue tea', 'turmeric' or 'honey'..."
              className="h-12 border-forest-green/20 bg-soft-white pl-10 text-sm"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="py-1 text-deep-olive">Quick suggestions:</span>
            {["Badri Ghee", "Honey", "Blue Tea", "Pahadi Haldi", "Kumkumadi", "Mustard Oil"].map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                className="h-7 border-forest-green/20 text-xs text-forest-green hover:bg-cream"
                onClick={() => setSearchTerm(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>

          <div className="mt-4 divide-y divide-forest-green/10">
            {searchTerm.trim() ? (
              searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between gap-3 py-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-12 shrink-0 overflow-hidden rounded-sm bg-cream">
                        <img
                          src={getProductImage(product.productId)}
                          alt={product.title}
                          className="size-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-display text-lg font-medium text-forest-green">
                          {product.title}
                        </h4>
                        <p className="text-xs text-deep-olive">
                          {product.category} • {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-forest-green/30 text-xs text-forest-green"
                        onClick={() => {
                          setSearchOpen(false);
                          setSelectedQuickView(product);
                          setQuickViewQuantity(1);
                        }}
                      >
                        Quick View
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 bg-forest-green text-xs text-warm-ivory hover:bg-deep-olive"
                        onClick={() => {
                          addToCart(product, 1);
                        }}
                      >
                        Add to Bag
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-xs text-deep-olive">
                  No matching products found. Try another ingredient or category term.
                </p>
              )
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* Demo Checkout Modal */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border-cream bg-warm-ivory p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-medium text-forest-green">
              {checkoutSuccessOrderId ? "Order Confirmed" : "Storefront Demo Checkout"}
            </DialogTitle>
            <DialogDescription className="text-xs text-deep-olive">
              {checkoutSuccessOrderId
                ? "Thank you for supporting Indian village cooperatives!"
                : "Experience the checkout flow. No payment or real order is processed."}
            </DialogDescription>
          </DialogHeader>

          {checkoutSuccessOrderId ? (
            <div className="mt-4 rounded-sm border border-forest-green/20 bg-soft-white p-6 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-cream text-forest-green">
                <CheckCircle2 className="size-7 text-forest-green" />
              </span>
              <h3 className="mt-3 font-display text-2xl font-semibold text-forest-green">
                Demo Order Placed!
              </h3>
              <p className="mt-1 font-mono text-xs text-terracotta">
                Order Reference: {checkoutSuccessOrderId}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-deep-olive">
                In a live store, your natural items would be freshly packed by village artisans and dispatched via insured courier.
              </p>
              <Button
                className="mt-5 w-full bg-forest-green text-xs text-warm-ivory hover:bg-deep-olive"
                onClick={() => setCheckoutOpen(false)}
              >
                Return to Storefront
              </Button>
            </div>
          ) : (
            <div>
              <div className="mt-4 rounded-sm border border-forest-green/15 bg-cream/70 p-3.5 text-xs">
                <div className="flex justify-between font-semibold text-forest-green">
                  <span>Cart Items ({getCartItemCount(cart)})</span>
                  <span>{formatPrice(currentSubtotal)}</span>
                </div>
                <div className="mt-1 flex justify-between text-deep-olive">
                  <span>Estimated Delivery</span>
                  <span>{amountNeededForFreeDelivery === 0 ? "FREE" : "₹70"}</span>
                </div>
              </div>

              <form className="mt-5 space-y-3" onSubmit={handleCheckoutSubmit} noValidate>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-charcoal" htmlFor="checkout-name">
                    Full Name *
                  </label>
                  <Input
                    id="checkout-name"
                    required
                    value={checkoutForm.name}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                    placeholder="E.g. Priya Sharma"
                    className="h-10 bg-soft-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-charcoal" htmlFor="checkout-email">
                      Email Address *
                    </label>
                    <Input
                      id="checkout-email"
                      type="email"
                      required
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="h-10 bg-soft-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-charcoal" htmlFor="checkout-phone">
                      Contact Phone
                    </label>
                    <Input
                      id="checkout-phone"
                      type="tel"
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="h-10 bg-soft-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-charcoal" htmlFor="checkout-city">
                      Delivery City *
                    </label>
                    <Input
                      id="checkout-city"
                      required
                      value={checkoutForm.city}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                      placeholder="E.g. Dehradun / Mumbai"
                      className="h-10 bg-soft-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-charcoal" htmlFor="checkout-pincode">
                      PIN Code
                    </label>
                    <Input
                      id="checkout-pincode"
                      value={checkoutForm.pincode}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, pincode: e.target.value })}
                      placeholder="248001"
                      className="h-10 bg-soft-white text-xs"
                    />
                  </div>
                </div>

                {checkoutError ? (
                  <p className="text-xs font-medium text-destructive">{checkoutError}</p>
                ) : null}

                <Button
                  type="submit"
                  className="mt-4 w-full bg-forest-green py-5 text-xs font-semibold text-warm-ivory hover:bg-deep-olive"
                >
                  Confirm Demo Order ({formatPrice(currentSubtotal)})
                </Button>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Account Login Preview Modal */}
      <Dialog open={accountOpen} onOpenChange={setAccountOpen}>
        <DialogContent className="max-w-md border-cream bg-warm-ivory p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-medium text-forest-green">
              Welcome to NIVIK.
            </DialogTitle>
            <DialogDescription className="text-xs text-deep-olive">
              Keep your favourite pantry essentials and order history together.
            </DialogDescription>
          </DialogHeader>

          <form className="mt-4 space-y-3.5" onSubmit={handleAccountSubmit} noValidate>
            <div>
              <label className="mb-1 block text-xs font-semibold text-charcoal" htmlFor="account-email">
                Email Address
              </label>
              <Input
                id="account-email"
                type="email"
                autoComplete="email"
                value={accountEmail}
                onChange={(e) => {
                  setAccountEmail(e.target.value);
                  setAccountMessage("");
                }}
                placeholder="you@domain.com"
                className="h-11 bg-soft-white text-xs"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-forest-green text-xs font-semibold text-warm-ivory hover:bg-deep-olive"
            >
              Continue With Email <ArrowRight className="ml-1.5 size-3.5" />
            </Button>
            {accountMessage ? (
              <p className="text-xs text-forest-green font-medium" role="status">
                {accountMessage}
              </p>
            ) : null}
          </form>
          <p className="text-[0.68rem] text-deep-olive/70">
            Account authentication is part of this storefront preview.
          </p>
        </DialogContent>
      </Dialog>

      {/* Journal Article Reader Modal */}
      <Dialog
        open={Boolean(activeStory)}
        onOpenChange={(open) => {
          if (!open) setActiveStory(null);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-cream bg-warm-ivory p-6 sm:p-9">
          {activeStory ? (
            <div>
              <div className="aspect-[16/9] w-full overflow-hidden rounded-sm bg-cream">
                <img
                  src={activeStory.image}
                  alt={activeStory.title}
                  className="size-full object-cover"
                />
              </div>
              <DialogHeader className="mt-5">
                <Eyebrow>
                  {activeStory.category} • {activeStory.readingTime}
                </Eyebrow>
                <DialogTitle className="mt-1 font-display text-3xl font-medium leading-snug text-forest-green sm:text-4xl">
                  {activeStory.title}
                </DialogTitle>
                <DialogDescription className="text-xs font-medium text-terracotta">
                  {activeStory.subtitle}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-5 space-y-4 text-xs leading-relaxed text-deep-olive sm:text-sm sm:leading-7">
                {activeStory.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <div className="mt-6 flex justify-between border-t border-forest-green/10 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-forest-green/30 text-xs text-forest-green"
                  onClick={() => {
                    setActiveStory(null);
                    scrollToSection("women");
                  }}
                >
                  Meet the Artisans <ArrowRight className="ml-1 size-3" />
                </Button>
                <Button
                  size="sm"
                  className="bg-forest-green text-xs text-warm-ivory hover:bg-deep-olive"
                  onClick={() => setActiveStory(null)}
                >
                  Close Article
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Footer Care Info Dialog */}
      <Dialog
        open={Boolean(footerInfo)}
        onOpenChange={(open) => {
          if (!open) setFooterInfo(null);
        }}
      >
        <DialogContent className="max-w-md border-cream bg-warm-ivory p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-medium text-forest-green">
              {footerInfo?.title}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="mt-3 text-xs leading-relaxed text-deep-olive sm:text-sm">
            {footerInfo?.body}
          </DialogDescription>
          <Button
            className="mt-5 w-full bg-forest-green text-xs text-warm-ivory hover:bg-deep-olive"
            onClick={() => setFooterInfo(null)}
          >
            Understood
          </Button>
        </DialogContent>
      </Dialog>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            key="toast"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            {...(shouldReduceMotion ? {} : { exit: { opacity: 0, y: 12 } })}
            className="fixed bottom-6 left-1/2 z-[80] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-sm border border-cream bg-soft-white px-5 py-3 text-xs font-medium text-forest-green shadow-xl backdrop-blur-sm sm:text-sm"
            role="status"
            aria-live="polite"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="size-4 text-terracotta" />
              {toastMessage}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Back to Top Floating Button */}
      {scrolled ? (
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-5 z-30 size-10 rounded-full bg-forest-green text-warm-ivory shadow-lg transition-transform hover:scale-105 hover:bg-deep-olive sm:bottom-8 sm:right-8"
          aria-label="Back to top"
          title="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowLeft className="size-4 rotate-90" />
        </Button>
      ) : null}
    </div>
  );
}
