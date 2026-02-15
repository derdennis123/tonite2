-- =============================================
-- TONITE Database Schema
-- =============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUM Types
CREATE TYPE venue_status AS ENUM ('pending_onboarding', 'active', 'paused', 'deactivated');
CREATE TYPE event_status AS ENUM ('draft', 'scheduled', 'live', 'sold_out', 'past', 'cancelled');
CREATE TYPE series_status AS ENUM ('active', 'paused', 'ended');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'refunded');
CREATE TYPE booking_channel AS ENUM ('flash', 'offer', 'crew');
CREATE TYPE offer_status AS ENUM ('pending', 'countered', 'accepted', 'rejected', 'expired');
CREATE TYPE voucher_status AS ENUM ('issued', 'redeemed', 'expired', 'cancelled');
CREATE TYPE vat_category AS ENUM ('cultural_7pct', 'food_drink_19pct', 'merchandise_19pct', 'service_19pct');
CREATE TYPE campaign_status AS ENUM ('pending_approval', 'approved', 'active', 'paused', 'completed', 'rejected');
CREATE TYPE crew_status AS ENUM ('open', 'locked', 'completed', 'expired');
CREATE TYPE crew_member_status AS ENUM ('joined', 'paid', 'dropped');
CREATE TYPE reward_tier AS ENUM ('explorer', 'regular', 'vip', 'legend');
CREATE TYPE reward_event_type AS ENUM ('booking', 'new_venue', 'weekday_bonus', 'crew_creator', 'referral', 'streak_bonus');

-- VENUES
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  stripe_account_id TEXT,
  commission_rate DECIMAL(4,3) NOT NULL DEFAULT 0.15,
  google_ads_authorized BOOLEAN DEFAULT FALSE,
  google_ads_authorized_at TIMESTAMPTZ,
  contract_signed BOOLEAN DEFAULT FALSE,
  contract_signed_at TIMESTAMPTZ,
  logo_url TEXT,
  cover_image_url TEXT,
  status venue_status NOT NULL DEFAULT 'pending_onboarding',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- VALUE-ADDS (pro Venue definiert)
CREATE TABLE venue_value_adds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  retail_value DECIMAL(8,2) NOT NULL,
  vat_rate DECIMAL(4,3) NOT NULL,
  vat_category vat_category NOT NULL,
  available_per_event INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EVENT-SERIEN
CREATE TABLE event_series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  recurrence_days INTEGER[] NOT NULL,
  default_time TIME NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  excluded_dates DATE[] DEFAULT '{}',
  default_contingent INTEGER NOT NULL,
  default_min_price DECIMAL(8,2) NOT NULL,
  weekday_overrides JSONB DEFAULT '{}',
  make_offer_enabled BOOLEAN DEFAULT TRUE,
  offer_max_discount_pct DECIMAL(4,3) DEFAULT 0.30,
  offer_min_price DECIMAL(8,2),
  release_days_before INTEGER NOT NULL DEFAULT 5 CHECK (release_days_before >= 3 AND release_days_before <= 5),
  ads_days_before INTEGER DEFAULT 3,
  auto_release BOOLEAN DEFAULT TRUE,
  status series_status NOT NULL DEFAULT 'active',
  tixu_series_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EVENTS
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  series_id UUID REFERENCES event_series(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  datetime TIMESTAMPTZ NOT NULL,
  contingent_total INTEGER NOT NULL,
  contingent_sold INTEGER NOT NULL DEFAULT 0,
  min_price DECIMAL(8,2) NOT NULL,
  flash_price DECIMAL(8,2) NOT NULL,
  make_offer_enabled BOOLEAN DEFAULT TRUE,
  offer_max_discount_pct DECIMAL(4,3),
  offer_min_price DECIMAL(8,2),
  cover_image_url TEXT,
  video_url TEXT,
  tixu_event_id TEXT,
  tixu_total_capacity INTEGER,
  tixu_total_sold INTEGER,
  status event_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION event_contingent_remaining(events) RETURNS INTEGER AS $$
  SELECT $1.contingent_total - $1.contingent_sold;
$$ LANGUAGE SQL STABLE;

-- EVENT VALUE-ADDS
CREATE TABLE event_value_adds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  venue_value_add_id UUID NOT NULL REFERENCES venue_value_adds(id) ON DELETE CASCADE,
  quantity_available INTEGER,
  quantity_used INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(event_id, venue_value_add_id)
);

-- CUSTOMERS
CREATE TABLE customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  stripe_customer_id TEXT,
  city TEXT,
  preferred_locale TEXT DEFAULT 'de-DE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOOKINGS
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  event_id UUID NOT NULL REFERENCES events(id),
  ticket_count INTEGER NOT NULL,
  price_per_ticket DECIMAL(8,2) NOT NULL,
  total_price DECIMAL(8,2) NOT NULL,
  commission_amount DECIMAL(8,2) NOT NULL,
  venue_payout_amount DECIMAL(8,2) NOT NULL,
  booking_channel booking_channel NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  status booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TICKETS
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  guest_name TEXT NOT NULL,
  qr_code_data TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  qr_code_url TEXT,
  pdf_url TEXT,
  checked_in BOOLEAN NOT NULL DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- OFFERS
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  event_id UUID NOT NULL REFERENCES events(id),
  ticket_count INTEGER NOT NULL DEFAULT 2,
  offered_price DECIMAL(8,2) NOT NULL,
  counter_price DECIMAL(8,2),
  counter_value_adds JSONB DEFAULT '[]',
  attempt_number INTEGER NOT NULL CHECK (attempt_number >= 1 AND attempt_number <= 3),
  status offer_status NOT NULL DEFAULT 'pending',
  ai_response TEXT,
  booking_id UUID REFERENCES bookings(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BOOKING VOUCHERS
CREATE TABLE booking_vouchers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  venue_value_add_id UUID NOT NULL REFERENCES venue_value_adds(id),
  voucher_code TEXT UNIQUE NOT NULL DEFAULT upper(encode(gen_random_bytes(4), 'hex')),
  retail_value DECIMAL(8,2) NOT NULL,
  vat_rate DECIMAL(4,3) NOT NULL,
  vat_amount DECIMAL(8,2) NOT NULL,
  status voucher_status NOT NULL DEFAULT 'issued',
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CAMPAIGNS
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id),
  venue_id UUID NOT NULL REFERENCES venues(id),
  google_campaign_id TEXT,
  ad_variants JSONB NOT NULL DEFAULT '[]',
  target_radius_km INTEGER DEFAULT 30,
  target_age_min INTEGER DEFAULT 25,
  target_age_max INTEGER DEFAULT 55,
  target_interests JSONB DEFAULT '[]',
  budget_daily DECIMAL(8,2),
  budget_total DECIMAL(8,2),
  budget_spent DECIMAL(8,2) DEFAULT 0,
  weather_context JSONB,
  status campaign_status NOT NULL DEFAULT 'pending_approval',
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  rejection_note TEXT,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CAMPAIGN RESULTS
CREATE TABLE campaign_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id),
  event_id UUID NOT NULL REFERENCES events(id),
  venue_id UUID NOT NULL REFERENCES venues(id),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spend DECIMAL(8,2) DEFAULT 0,
  cpa DECIMAL(8,2),
  roas DECIMAL(8,4),
  best_ad_variant_index INTEGER,
  best_headline TEXT,
  best_audience_segment TEXT,
  weather_conditions TEXT,
  ai_learnings TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CREWS
CREATE TABLE crews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id),
  creator_customer_id UUID NOT NULL REFERENCES customers(id),
  invite_code TEXT UNIQUE NOT NULL DEFAULT lower(encode(gen_random_bytes(4), 'hex')),
  max_discount_pct DECIMAL(4,3) DEFAULT 0.35,
  status crew_status NOT NULL DEFAULT 'open',
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE crew_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crew_id UUID NOT NULL REFERENCES crews(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  status crew_member_status NOT NULL DEFAULT 'joined',
  discount_applied DECIMAL(4,3) DEFAULT 0,
  booking_id UUID REFERENCES bookings(id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- REWARDS
CREATE TABLE customer_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID UNIQUE NOT NULL REFERENCES customers(id),
  total_stars INTEGER NOT NULL DEFAULT 0,
  current_tier reward_tier NOT NULL DEFAULT 'explorer',
  tier_updated_at TIMESTAMPTZ DEFAULT NOW(),
  current_streak_weeks INTEGER NOT NULL DEFAULT 0,
  longest_streak_weeks INTEGER NOT NULL DEFAULT 0,
  last_booking_week DATE,
  unique_venues_visited INTEGER NOT NULL DEFAULT 0,
  referral_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reward_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  event_type reward_event_type NOT NULL,
  stars_earned INTEGER NOT NULL,
  related_booking_id UUID REFERENCES bookings(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_events_venue ON events(venue_id);
CREATE INDEX idx_events_datetime ON events(datetime);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_event ON bookings(event_id);
CREATE INDEX idx_tickets_qr ON tickets(qr_code_data);
CREATE INDEX idx_tickets_booking ON tickets(booking_id);
CREATE INDEX idx_offers_customer_event ON offers(customer_id, event_id);
CREATE INDEX idx_crews_invite ON crews(invite_code);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_vouchers_code ON booking_vouchers(voucher_code);

-- ROW LEVEL SECURITY
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Live events sind öffentlich" ON events
  FOR SELECT USING (status IN ('live', 'sold_out'));

CREATE POLICY "Aktive Venues sind öffentlich" ON venues
  FOR SELECT USING (status = 'active');

CREATE POLICY "Eigene Buchungen" ON bookings
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Eigene Tickets" ON tickets
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Eigenes Profil" ON customers
  FOR ALL USING (id = auth.uid());
