// =============================================================================
// TONITE Marketplace — TypeScript Type Definitions
// =============================================================================
// All types derived from the PostgreSQL/Supabase database schema.
// Enums are represented as string literal union types.
// =============================================================================

// -----------------------------------------------------------------------------
// Enum Types (string literal unions mirroring PostgreSQL ENUMs)
// -----------------------------------------------------------------------------

export type VenueStatus =
  | 'pending_onboarding'
  | 'active'
  | 'paused'
  | 'deactivated';

export type EventStatus =
  | 'draft'
  | 'scheduled'
  | 'live'
  | 'sold_out'
  | 'past'
  | 'cancelled';

export type SeriesStatus =
  | 'active'
  | 'paused'
  | 'ended';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'refunded';

export type BookingChannel =
  | 'flash'
  | 'offer'
  | 'crew';

export type OfferStatus =
  | 'pending'
  | 'countered'
  | 'accepted'
  | 'rejected'
  | 'expired';

export type VoucherStatus =
  | 'issued'
  | 'redeemed'
  | 'expired'
  | 'cancelled';

export type VatCategory =
  | 'cultural_7pct'
  | 'food_drink_19pct'
  | 'merchandise_19pct'
  | 'service_19pct';

export type CampaignStatus =
  | 'pending_approval'
  | 'approved'
  | 'active'
  | 'paused'
  | 'completed'
  | 'rejected';

export type CrewStatus =
  | 'open'
  | 'locked'
  | 'completed'
  | 'expired';

export type CrewMemberStatus =
  | 'joined'
  | 'paid'
  | 'dropped';

export type RewardTier =
  | 'explorer'
  | 'regular'
  | 'vip'
  | 'legend';

export type RewardEventType =
  | 'booking'
  | 'new_venue'
  | 'weekday_bonus'
  | 'crew_creator'
  | 'referral'
  | 'streak_bonus';

// -----------------------------------------------------------------------------
// Scarcity & Crew Discount Types
// -----------------------------------------------------------------------------

/** Scarcity level derived from remaining ticket count */
export type ScarcityLevel =
  | 'available'   // 20+ tickets remaining
  | 'selling'     // 10-20 tickets remaining
  | 'few'         // 5-10 tickets remaining
  | 'last';       // <5 tickets remaining

/** Crew discount tier thresholds */
export interface CrewDiscountTier {
  /** Minimum crew size (inclusive) */
  minSize: number;
  /** Maximum crew size (inclusive, null means unlimited) */
  maxSize: number | null;
  /** Discount percentage as a decimal (e.g. 0.10 for 10%) */
  discountPct: number;
  /** Human-readable label for the tier */
  label: string;
}

/** The standard crew discount tiers used across the platform */
export const CREW_DISCOUNT_TIERS: readonly CrewDiscountTier[] = [
  { minSize: 1, maxSize: 1, discountPct: 0, label: '0%' },
  { minSize: 2, maxSize: 2, discountPct: 0.10, label: '10%' },
  { minSize: 3, maxSize: 4, discountPct: 0.20, label: '20%' },
  { minSize: 5, maxSize: 6, discountPct: 0.30, label: '30%' },
  { minSize: 7, maxSize: null, discountPct: 0.35, label: '35%' },
] as const;

// -----------------------------------------------------------------------------
// JSONB Sub-Types (typed objects for JSONB columns)
// -----------------------------------------------------------------------------

/** Single ad variant stored in campaigns.ad_variants JSONB array */
export interface AdVariant {
  headline: string;
  description: string;
  cta: string;
  displayUrl: string;
}

/** Weather context stored in campaigns.weather_context JSONB */
export interface WeatherContext {
  temperature?: number;
  condition?: string;
  humidity?: number;
  windSpeed?: number;
  description?: string;
  fetchedAt?: string;
}

/**
 * Weekday override stored in event_series.weekday_overrides JSONB.
 * Keys are weekday indices (0=Mon, 6=Sun) as strings.
 */
export interface WeekdayOverrides {
  [weekday: string]: {
    contingent?: number;
    minPrice?: number;
    flashPrice?: number;
  };
}

/** Value-add reference in an offer counter */
export interface CounterValueAdd {
  venueValueAddId: string;
  name: string;
  retailValue: number;
}

// -----------------------------------------------------------------------------
// Database Entity Interfaces
// -----------------------------------------------------------------------------

/** venues table */
export interface Venue {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  city: string;
  lat: number | null;
  lng: number | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  stripeAccountId: string | null;
  commissionRate: number;
  googleAdsAuthorized: boolean;
  googleAdsAuthorizedAt: string | null;
  contractSigned: boolean;
  contractSignedAt: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  status: VenueStatus;
  createdAt: string;
  updatedAt: string;
}

/** venue_value_adds table */
export interface VenueValueAdd {
  id: string;
  venueId: string;
  name: string;
  description: string | null;
  retailValue: number;
  vatRate: number;
  vatCategory: VatCategory;
  availablePerEvent: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/** event_series table */
export interface EventSeries {
  id: string;
  venueId: string;
  name: string;
  description: string | null;
  recurrenceDays: number[];
  defaultTime: string;
  startDate: string;
  endDate: string;
  excludedDates: string[];
  defaultContingent: number;
  defaultMinPrice: number;
  weekdayOverrides: WeekdayOverrides;
  makeOfferEnabled: boolean;
  offerMaxDiscountPct: number;
  offerMinPrice: number | null;
  releaseDaysBefore: number;
  adsDaysBefore: number;
  autoRelease: boolean;
  status: SeriesStatus;
  tixuSeriesId: string | null;
  createdAt: string;
  updatedAt: string;
}

/** events table */
export interface Event {
  id: string;
  venueId: string;
  seriesId: string | null;
  name: string;
  slug: string;
  description: string | null;
  date: string;
  time: string;
  datetime: string;
  contingentTotal: number;
  contingentSold: number;
  /** Computed: contingentTotal - contingentSold */
  contingentRemaining: number;
  minPrice: number;
  flashPrice: number;
  makeOfferEnabled: boolean;
  offerMaxDiscountPct: number | null;
  offerMinPrice: number | null;
  coverImageUrl: string | null;
  videoUrl: string | null;
  tixuEventId: string | null;
  tixuTotalCapacity: number | null;
  tixuTotalSold: number | null;
  status: EventStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** event_value_adds junction table */
export interface EventValueAdd {
  id: string;
  eventId: string;
  venueValueAddId: string;
  quantityAvailable: number | null;
  quantityUsed: number;
  enabled: boolean;
}

/** customers table */
export interface Customer {
  id: string;
  email: string;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  stripeCustomerId: string | null;
  city: string | null;
  preferredLocale: string;
  createdAt: string;
  lastActiveAt: string | null;
}

/** bookings table */
export interface Booking {
  id: string;
  customerId: string;
  eventId: string;
  ticketCount: number;
  pricePerTicket: number;
  totalPrice: number;
  commissionAmount: number;
  venuePayoutAmount: number;
  bookingChannel: BookingChannel;
  stripePaymentIntentId: string | null;
  stripeCheckoutSessionId: string | null;
  status: BookingStatus;
  createdAt: string;
}

/** tickets table */
export interface Ticket {
  id: string;
  bookingId: string;
  eventId: string;
  customerId: string;
  guestName: string;
  qrCodeData: string;
  qrCodeUrl: string | null;
  pdfUrl: string | null;
  checkedIn: boolean;
  checkedInAt: string | null;
  createdAt: string;
}

/** offers table */
export interface Offer {
  id: string;
  customerId: string;
  eventId: string;
  ticketCount: number;
  offeredPrice: number;
  counterPrice: number | null;
  counterValueAdds: CounterValueAdd[];
  attemptNumber: number;
  status: OfferStatus;
  aiResponse: string | null;
  bookingId: string | null;
  expiresAt: string | null;
  createdAt: string;
}

/** booking_vouchers table */
export interface BookingVoucher {
  id: string;
  bookingId: string;
  venueValueAddId: string;
  voucherCode: string;
  retailValue: number;
  vatRate: number;
  vatAmount: number;
  status: VoucherStatus;
  redeemedAt: string | null;
  createdAt: string;
}

/** campaigns table */
export interface Campaign {
  id: string;
  eventId: string;
  venueId: string;
  googleCampaignId: string | null;
  adVariants: AdVariant[];
  targetRadiusKm: number;
  targetAgeMin: number;
  targetAgeMax: number;
  targetInterests: string[];
  budgetDaily: number | null;
  budgetTotal: number | null;
  budgetSpent: number;
  weatherContext: WeatherContext | null;
  status: CampaignStatus;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionNote: string | null;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** campaign_results table */
export interface CampaignResult {
  id: string;
  campaignId: string;
  eventId: string;
  venueId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  cpa: number | null;
  roas: number | null;
  bestAdVariantIndex: number | null;
  bestHeadline: string | null;
  bestAudienceSegment: string | null;
  weatherConditions: string | null;
  aiLearnings: string | null;
  createdAt: string;
}

/** crews table */
export interface Crew {
  id: string;
  eventId: string;
  creatorCustomerId: string;
  inviteCode: string;
  maxDiscountPct: number;
  status: CrewStatus;
  lockedAt: string | null;
  createdAt: string;
}

/** crew_members table */
export interface CrewMember {
  id: string;
  crewId: string;
  customerId: string;
  status: CrewMemberStatus;
  discountApplied: number;
  bookingId: string | null;
  joinedAt: string;
  paidAt: string | null;
}

/** customer_rewards table */
export interface CustomerReward {
  id: string;
  customerId: string;
  totalStars: number;
  currentTier: RewardTier;
  tierUpdatedAt: string | null;
  currentStreakWeeks: number;
  longestStreakWeeks: number;
  lastBookingWeek: string | null;
  uniqueVenuesVisited: number;
  referralCount: number;
  createdAt: string;
  updatedAt: string;
}

/** reward_events table */
export interface RewardEvent {
  id: string;
  customerId: string;
  eventType: RewardEventType;
  starsEarned: number;
  relatedBookingId: string | null;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Extended / Joined Types (for API responses with relations)
// -----------------------------------------------------------------------------

/** Event with related venue data, used on consumer-facing pages */
export interface EventWithVenue extends Event {
  venue: Pick<Venue, 'id' | 'name' | 'slug' | 'city' | 'address' | 'lat' | 'lng' | 'logoUrl' | 'coverImageUrl'>;
}

/** Event with all related data for the event detail page */
export interface EventDetail extends EventWithVenue {
  series: Pick<EventSeries, 'id' | 'name'> | null;
  valueAdds: (EventValueAdd & {
    venueValueAdd: Pick<VenueValueAdd, 'id' | 'name' | 'description' | 'retailValue' | 'vatCategory'>;
  })[];
}

/** Booking with nested event and ticket data, used on the "My Tickets" page */
export interface BookingWithDetails extends Booking {
  event: Pick<Event, 'id' | 'name' | 'slug' | 'date' | 'time' | 'datetime' | 'coverImageUrl' | 'status'>;
  venue: Pick<Venue, 'id' | 'name' | 'slug' | 'address' | 'city'>;
  tickets: Ticket[];
  vouchers: BookingVoucher[];
}

/** Crew with members and event info, used on the crew lobby page */
export interface CrewWithDetails extends Crew {
  event: Pick<Event, 'id' | 'name' | 'slug' | 'datetime' | 'flashPrice' | 'coverImageUrl'>;
  members: (CrewMember & {
    customer: Pick<Customer, 'id' | 'firstName' | 'lastName'>;
  })[];
  currentDiscountPct: number;
  nextTierThreshold: number | null;
  nextTierDiscountPct: number | null;
}

/** Customer profile with rewards data */
export interface CustomerProfile extends Customer {
  rewards: CustomerReward | null;
}

/** Campaign with event and venue context, used on admin approval screen */
export interface CampaignWithContext extends Campaign {
  event: Pick<Event, 'id' | 'name' | 'slug' | 'datetime' | 'contingentTotal' | 'contingentSold' | 'flashPrice'>;
  venue: Pick<Venue, 'id' | 'name' | 'slug' | 'city'>;
}

// -----------------------------------------------------------------------------
// API Request Types
// -----------------------------------------------------------------------------

/** POST /api/checkout — Create Stripe Checkout Session */
export interface CheckoutRequest {
  eventId: string;
  ticketCount: number;
  guestNames: string[];
  pricePerTicket: number;
  valueAddIds?: string[];
  crewId?: string;
}

/** POST /api/offer/submit — Submit a Make-an-Offer bid */
export interface OfferSubmitRequest {
  eventId: string;
  ticketCount: number;
  offeredPrice: number;
}

/** POST /api/offer/accept — Accept a countered offer */
export interface OfferAcceptRequest {
  offerId: string;
}

/** POST /api/voucher/redeem — Redeem a value-add voucher */
export interface VoucherRedeemRequest {
  voucherCode: string;
}

/** GET /api/ticket/validate — QR code validation query */
export interface TicketValidateQuery {
  code: string;
}

/** POST /api/crew/create — Create a new crew */
export interface CrewCreateRequest {
  eventId: string;
}

/** POST /api/crew/join — Join an existing crew */
export interface CrewJoinRequest {
  inviteCode: string;
}

/** POST /api/tixu/report-sale — Report a sale to tixu */
export interface TixuReportSaleRequest {
  bookingId: string;
  tixuEventId: string;
  ticketCount: number;
}

/** Venue event creation (single event) */
export interface EventCreateRequest {
  venueId: string;
  seriesId?: string;
  name: string;
  description?: string;
  date: string;
  time: string;
  contingentTotal: number;
  minPrice: number;
  flashPrice: number;
  makeOfferEnabled: boolean;
  offerMaxDiscountPct?: number;
  offerMinPrice?: number;
  coverImageUrl?: string;
  videoUrl?: string;
  valueAddIds?: string[];
}

/** Venue event series creation */
export interface EventSeriesCreateRequest {
  venueId: string;
  name: string;
  description?: string;
  recurrenceDays: number[];
  defaultTime: string;
  startDate: string;
  endDate: string;
  excludedDates?: string[];
  defaultContingent: number;
  defaultMinPrice: number;
  weekdayOverrides?: WeekdayOverrides;
  makeOfferEnabled?: boolean;
  offerMaxDiscountPct?: number;
  offerMinPrice?: number;
  releaseDaysBefore?: number;
  adsDaysBefore?: number;
  autoRelease?: boolean;
  valueAddIds?: string[];
}

/** Admin campaign approval/rejection */
export interface CampaignReviewRequest {
  campaignId: string;
  action: 'approve' | 'reject';
  rejectionNote?: string;
  /** Optional edits to ad variants before approval */
  editedAdVariants?: AdVariant[];
}

// -----------------------------------------------------------------------------
// API Response Types
// -----------------------------------------------------------------------------

/** Generic API success response wrapper */
export interface ApiResponse<T> {
  data: T;
  error: null;
}

/** Generic API error response wrapper */
export interface ApiErrorResponse {
  data: null;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

/** Union type for all API responses */
export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

/** POST /api/checkout response */
export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

/** POST /api/offer/submit response */
export interface OfferSubmitResponse {
  offer: Offer;
  aiMessage: string;
  status: OfferStatus;
}

/** POST /api/offer/accept response */
export interface OfferAcceptResponse {
  checkoutUrl: string;
  sessionId: string;
  expiresAt: string;
}

/** GET /api/ticket/validate response */
export interface TicketValidateResponse {
  valid: boolean;
  ticket: Pick<Ticket, 'id' | 'guestName' | 'checkedIn' | 'checkedInAt'> | null;
  event: Pick<Event, 'id' | 'name' | 'datetime'> | null;
  alreadyCheckedIn: boolean;
}

/** POST /api/voucher/redeem response */
export interface VoucherRedeemResponse {
  voucher: BookingVoucher;
  valueAdd: Pick<VenueValueAdd, 'name' | 'description'>;
}

/** POST /api/crew/create response */
export interface CrewCreateResponse {
  crew: Crew;
  inviteUrl: string;
}

/** POST /api/crew/join response */
export interface CrewJoinResponse {
  crew: CrewWithDetails;
}

// -----------------------------------------------------------------------------
// Pagination & Filtering Helpers
// -----------------------------------------------------------------------------

/** Standard pagination parameters */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/** Event listing filter parameters */
export interface EventFilterParams extends PaginationParams {
  city?: string;
  venueId?: string;
  status?: EventStatus;
  dateFrom?: string;
  dateTo?: string;
}

/** Booking listing filter parameters */
export interface BookingFilterParams extends PaginationParams {
  customerId?: string;
  eventId?: string;
  venueId?: string;
  status?: BookingStatus;
  channel?: BookingChannel;
  dateFrom?: string;
  dateTo?: string;
}

/** Campaign listing filter parameters */
export interface CampaignFilterParams extends PaginationParams {
  venueId?: string;
  eventId?: string;
  status?: CampaignStatus;
}

// -----------------------------------------------------------------------------
// Utility / Helper Types
// -----------------------------------------------------------------------------

/** Database row types use snake_case; this maps to camelCase for the app layer */
export type CamelCase<S extends string> =
  S extends `${infer P}_${infer R}`
    ? `${P}${Capitalize<CamelCase<R>>}`
    : S;

/** Convert all keys of an object from snake_case to camelCase */
export type CamelCaseKeys<T> = {
  [K in keyof T as K extends string ? CamelCase<K> : K]: T[K];
};

/** Make specific fields of a type optional */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Make specific fields of a type required */
export type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Extract only the ID from an entity */
export type EntityId<T extends { id: string }> = Pick<T, 'id'>;

/** Supabase database insert type — omits auto-generated fields */
export type InsertRow<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

/** Supabase database update type — all fields optional except id */
export type UpdateRow<T extends { id: string }> = Pick<T, 'id'> & Partial<Omit<T, 'id'>>;
