-- ============================================================
-- 꿈그림 DreamGrim — Database Schema
-- ============================================================

-- Utility: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 1. users
-- ============================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  phone TEXT,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  subscription_status TEXT NOT NULL DEFAULT 'free'
    CHECK (subscription_status IN ('free', 'active', 'cancelled', 'past_due')),
  subscription_started_at TIMESTAMPTZ,
  subscription_expires_at TIMESTAMPTZ,
  subscription_billing_key TEXT,
  free_credits INT NOT NULL DEFAULT 2,
  credits_reset_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_dreams INT NOT NULL DEFAULT 0,
  total_paid_amount INT NOT NULL DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.users(id),
  alimtalk_consent BOOLEAN NOT NULL DEFAULT false,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  alimtalk_consent_at TIMESTAMPTZ,
  marketing_consent_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_subscription ON public.users(subscription_status);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 2. dreams
-- ============================================================
CREATE TABLE public.dreams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  dream_text TEXT NOT NULL CHECK (char_length(dream_text) >= 10),
  dream_keywords TEXT[] NOT NULL DEFAULT '{}',
  dream_mood TEXT,
  is_tae_mong BOOLEAN NOT NULL DEFAULT false,
  tae_name TEXT,
  interpretation TEXT NOT NULL,
  keywords_extracted TEXT[] NOT NULL DEFAULT '{}',
  image_prompt TEXT NOT NULL,
  detailed_report JSONB,
  artwork_url TEXT,
  artwork_thumbnail_url TEXT,
  artwork_style TEXT NOT NULL DEFAULT 'watercolor',
  is_public BOOLEAN NOT NULL DEFAULT false,
  shared_count INT NOT NULL DEFAULT 0,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  share_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  taemong_package TEXT CHECK (taemong_package IN ('basic', 'premium'))
);

CREATE INDEX idx_dreams_user_created ON public.dreams(user_id, created_at DESC);
CREATE INDEX idx_dreams_keywords ON public.dreams USING GIN(keywords_extracted);
CREATE INDEX idx_dreams_public ON public.dreams(is_public, created_at DESC) WHERE is_public = true;
CREATE INDEX idx_dreams_share_token ON public.dreams(share_token);

-- Increment user's total_dreams
CREATE OR REPLACE FUNCTION increment_user_dreams()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users SET total_dreams = total_dreams + 1 WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_dream_created
  AFTER INSERT ON public.dreams
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION increment_user_dreams();

-- ============================================================
-- 3. orders
-- ============================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  dream_id UUID REFERENCES public.dreams(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  order_type TEXT NOT NULL,
  amount INT NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'completed', 'refunded', 'cancelled')),
  payment_method TEXT CHECK (payment_method IN ('kakaopay', 'tosspayments')),
  payment_key TEXT,
  payment_approved_at TIMESTAMPTZ,
  tid TEXT,
  shipping_name TEXT,
  shipping_phone TEXT,
  shipping_address TEXT,
  shipping_zip TEXT,
  shipping_memo TEXT,
  tracking_number TEXT,
  shipped_at TIMESTAMPTZ,
  refund_reason TEXT,
  refunded_at TIMESTAMPTZ,
  refund_amount INT
);

CREATE INDEX idx_orders_user ON public.orders(user_id, created_at DESC);
CREATE INDEX idx_orders_status ON public.orders(status);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 4. seo_pages
-- ============================================================
CREATE TABLE public.seo_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  slug TEXT UNIQUE NOT NULL,
  keyword_ko TEXT NOT NULL,
  tier INT NOT NULL DEFAULT 2 CHECK (tier IN (1, 2, 3)),
  title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  h1_title TEXT NOT NULL,
  hero_artwork_url TEXT,
  intro_text TEXT NOT NULL,
  situations JSONB NOT NULL DEFAULT '[]',
  faq JSONB NOT NULL DEFAULT '[]',
  related_slugs TEXT[] NOT NULL DEFAULT '{}',
  monthly_search_volume INT,
  current_rank INT,
  is_published BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_seo_pages_slug ON public.seo_pages(slug);

CREATE TRIGGER seo_pages_updated_at
  BEFORE UPDATE ON public.seo_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 5. weekly_fortune
-- ============================================================
CREATE TABLE public.weekly_fortune (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  week_start DATE NOT NULL,
  lucky_numbers INT[] NOT NULL CHECK (array_length(lucky_numbers, 1) = 6),
  week_fortune_summary TEXT NOT NULL,
  week_keywords TEXT[] NOT NULL DEFAULT '{}',
  fortune_scores JSONB,
  UNIQUE(user_id, week_start)
);

CREATE INDEX idx_weekly_fortune_user ON public.weekly_fortune(user_id, week_start DESC);

-- ============================================================
-- 6. consult_sessions
-- ============================================================
CREATE TABLE public.consult_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  dream_id UUID NOT NULL REFERENCES public.dreams(id),
  order_id UUID REFERENCES public.orders(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  messages JSONB NOT NULL DEFAULT '[]',
  message_count INT NOT NULL DEFAULT 0,
  max_messages INT NOT NULL DEFAULT 20,
  summary TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_consult_user ON public.consult_sessions(user_id, created_at DESC);

-- ============================================================
-- 7. Row Level Security
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_fortune ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consult_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;

-- users
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- dreams
CREATE POLICY "dreams_select" ON public.dreams FOR SELECT USING (
  user_id = auth.uid() OR is_public = true OR share_token IS NOT NULL
);
CREATE POLICY "dreams_insert" ON public.dreams FOR INSERT WITH CHECK (
  user_id = auth.uid() OR user_id IS NULL
);
CREATE POLICY "dreams_update" ON public.dreams FOR UPDATE USING (user_id = auth.uid());

-- orders
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid());

-- weekly_fortune
CREATE POLICY "fortune_select_own" ON public.weekly_fortune FOR SELECT USING (user_id = auth.uid());

-- consult_sessions
CREATE POLICY "consult_select_own" ON public.consult_sessions FOR SELECT USING (user_id = auth.uid());

-- seo_pages: public read
CREATE POLICY "seo_pages_read" ON public.seo_pages FOR SELECT USING (is_published = true);
