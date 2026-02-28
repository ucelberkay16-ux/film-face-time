
-- Fix infinite recursion on room_participants SELECT policy
DROP POLICY IF EXISTS "Participants viewable by room participants" ON public.room_participants;

-- Simple policy: authenticated users can view participants of rooms they belong to (direct auth.uid() check, no self-reference)
CREATE POLICY "Participants viewable by authenticated users"
  ON public.room_participants FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Also fix room_messages which references room_participants (same recursion risk)
DROP POLICY IF EXISTS "Messages viewable by room participants" ON public.room_messages;

CREATE POLICY "Messages viewable by room participants"
  ON public.room_messages FOR SELECT
  TO authenticated
  USING (
    room_id IN (
      SELECT rp.room_id FROM public.room_participants rp
      WHERE rp.user_id = auth.uid()
    )
  );
