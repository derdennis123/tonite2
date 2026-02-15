-- Seed data for TONITE development

-- Insert test venues
INSERT INTO venues (id, name, slug, description, address, city, lat, lng, contact_name, contact_email, contact_phone, stripe_account_id, commission_rate, google_ads_authorized, contract_signed, status) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'GOP Varieté-Theater Essen', 'gop-essen', 'Weltklasse-Varieté im Herzen von Essen', 'Rottstr. 30, 45127 Essen', 'Essen', 51.4556432, 7.0115552, 'Maria Schmidt', 'events@gop-essen.de', '+49 201 2479393', 'acct_test_gop_essen', 0.15, true, true, 'active'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'GOP Varieté-Theater Bonn', 'gop-bonn', 'Varieté-Kunst in der Bundesstadt', 'Münsterplatz 17, 53111 Bonn', 'Bonn', 50.7343700, 7.0996600, 'Thomas Weber', 'events@gop-bonn.de', '+49 228 4225444', 'acct_test_gop_bonn', 0.15, true, true, 'active');

-- Insert venue value-adds
INSERT INTO venue_value_adds (id, venue_id, name, description, retail_value, vat_rate, vat_category, available_per_event) VALUES
  ('va-001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Welcome Drink', 'Ein Glas Sekt oder Softdrink zur Begrüßung', 8.50, 0.19, 'food_drink_19pct', 30),
  ('va-002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Garderobe gratis', 'Kostenlose Garderobennutzung', 3.00, 0.19, 'service_19pct', NULL),
  ('va-003', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Welcome Drink', 'Ein Glas Sekt zur Begrüßung', 8.00, 0.19, 'food_drink_19pct', 25);

-- Insert event series
INSERT INTO event_series (id, venue_id, name, description, recurrence_days, default_time, start_date, end_date, default_contingent, default_min_price, weekday_overrides, make_offer_enabled, offer_max_discount_pct, offer_min_price, release_days_before, auto_release, status) VALUES
  ('s1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'IGNITE', 'Die spektakuläre Varieté-Show', '{2,3,4,5,6}', '19:30', '2026-01-01', '2026-06-30', 30, 35, '{"5": {"min_price": 42}}', true, 0.30, 35, 5, true, 'active'),
  ('s2', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'STAUNEN', 'Die Zaubershow', '{4,5,6}', '19:00', '2026-01-01', '2026-06-30', 40, 29, '{}', true, 0.30, 29, 5, true, 'active');

-- Insert events
INSERT INTO events (id, venue_id, series_id, name, slug, description, date, time, datetime, contingent_total, contingent_sold, min_price, flash_price, make_offer_enabled, offer_max_discount_pct, offer_min_price, status, published_at) VALUES
  ('e1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 's1', 'IGNITE — Die Varieté-Show', 'ignite-variete-show', 'Eine atemberaubende Varieté-Show mit Weltklasse-Artisten, Magie und Live-Musik.', CURRENT_DATE + 1, '19:30', (CURRENT_DATE + 1 + TIME '19:30')::timestamptz, 30, 18, 35, 49, true, 0.30, 35, 'live', NOW()),
  ('e2', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 's1', 'PASSION — Tanz & Akrobatik', 'passion-tanz-akrobatik', 'Eine leidenschaftliche Show die Tanz, Akrobatik und Emotionen vereint.', CURRENT_DATE + 2, '20:00', (CURRENT_DATE + 2 + TIME '20:00')::timestamptz, 25, 20, 39, 55, true, 0.25, 39, 'live', NOW()),
  ('e3', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 's2', 'STAUNEN — Die Zaubershow', 'staunen-zaubershow', 'Magie hautnah erleben. Eine Show die dich sprachlos macht.', CURRENT_DATE + 3, '19:00', (CURRENT_DATE + 3 + TIME '19:00')::timestamptz, 40, 8, 29, 42, true, 0.30, 29, 'live', NOW()),
  ('e4', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 's1', 'ELECTRA — Die Neon-Show', 'electra-neon-show', 'UV-Licht, Neon-Kostüme und atemberaubende Performances.', CURRENT_DATE + 4, '21:00', (CURRENT_DATE + 4 + TIME '21:00')::timestamptz, 20, 17, 45, 65, true, 0.20, 45, 'live', NOW()),
  ('e5', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 's2', 'COSMOS — Reise durch die Galaxie', 'cosmos-reise-galaxie', 'Eine interstellare Varieté-Reise mit Projektionstechnik und Weltklasse-Artistik.', CURRENT_DATE + 5, '20:00', (CURRENT_DATE + 5 + TIME '20:00')::timestamptz, 35, 2, 32, 45, true, 0.30, 32, 'live', NOW());

-- Insert event value-adds
INSERT INTO event_value_adds (event_id, venue_value_add_id, quantity_available, enabled) VALUES
  ('e1', 'va-001', 20, true),
  ('e1', 'va-002', NULL, true),
  ('e2', 'va-001', 15, true),
  ('e3', 'va-003', 20, true);
