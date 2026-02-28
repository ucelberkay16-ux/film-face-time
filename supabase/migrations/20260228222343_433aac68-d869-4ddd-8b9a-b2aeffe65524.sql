
-- Fix 1: profiles table - restrict to authenticated users only
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Fix 2: room_messages - already correct (participants only), but ensure policy is not using 'true'
-- The existing policy looks correct from the schema, but let's verify and recreate to be safe
DROP POLICY IF EXISTS "Messages viewable by room participants" ON public.room_messages;
CREATE POLICY "Messages viewable by room participants"
  ON public.room_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_participants
      WHERE room_participants.room_id = room_messages.room_id
        AND room_participants.user_id = auth.uid()
    )
  );
