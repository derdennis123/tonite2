-- =============================================
-- Complete RLS policies and missing functions
-- =============================================

-- Enable RLS on tables that were missing it
ALTER TABLE crews ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_value_adds ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_value_adds ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_results ENABLE ROW LEVEL SECURITY;

-- CREWS: Public read (to view crew lobbies), own data write
CREATE POLICY "Crews sind öffentlich lesbar" ON crews
  FOR SELECT USING (true);

CREATE POLICY "Eigene Crews erstellen" ON crews
  FOR INSERT WITH CHECK (creator_customer_id = auth.uid());

-- CREW MEMBERS: Public read (to see who is in the crew), own membership write
CREATE POLICY "Crew-Mitglieder sind öffentlich lesbar" ON crew_members
  FOR SELECT USING (true);

CREATE POLICY "Eigene Crew-Mitgliedschaft" ON crew_members
  FOR INSERT WITH CHECK (customer_id = auth.uid());

-- EVENT VALUE ADDS: Public read (shown on event pages)
CREATE POLICY "Event-Value-Adds sind öffentlich lesbar" ON event_value_adds
  FOR SELECT USING (true);

-- VENUE VALUE ADDS: Public read (shown on event pages)
CREATE POLICY "Venue-Value-Adds sind öffentlich lesbar" ON venue_value_adds
  FOR SELECT USING (true);

-- BOOKING VOUCHERS: Own vouchers only
CREATE POLICY "Eigene Gutscheine" ON booking_vouchers
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM bookings WHERE customer_id = auth.uid()
    )
  );

-- CAMPAIGNS: Venue owners can read their campaigns (via service role for now)
CREATE POLICY "Kampagnen über Service-Role" ON campaigns
  FOR SELECT USING (false);

-- CAMPAIGN RESULTS: Venue owners can read their results (via service role for now)
CREATE POLICY "Kampagnen-Ergebnisse über Service-Role" ON campaign_results
  FOR SELECT USING (false);

-- CUSTOMER REWARDS: Own rewards only
CREATE POLICY "Eigene Rewards" ON customer_rewards
  FOR SELECT USING (customer_id = auth.uid());

-- REWARD EVENTS: Own reward events only
CREATE POLICY "Eigene Reward-Events" ON reward_events
  FOR SELECT USING (customer_id = auth.uid());

-- =============================================
-- Atomic increment function for ticket counting
-- =============================================
CREATE OR REPLACE FUNCTION increment_event_sold(p_event_id UUID, p_count INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE events
  SET contingent_sold = contingent_sold + p_count,
      updated_at = NOW()
  WHERE id = p_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Fix release_days_before constraint (change from 3-5 to 1-30)
-- =============================================
ALTER TABLE event_series DROP CONSTRAINT IF EXISTS event_series_release_days_before_check;
ALTER TABLE event_series ADD CONSTRAINT event_series_release_days_before_check
  CHECK (release_days_before >= 1 AND release_days_before <= 30);
