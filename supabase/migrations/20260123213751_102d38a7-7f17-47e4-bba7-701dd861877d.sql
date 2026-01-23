-- Drop existing permissive policies that expose data
DROP POLICY IF EXISTS "Messages viewable by everyone" ON public.room_messages;
DROP POLICY IF EXISTS "Participants viewable by room members" ON public.room_participants;
DROP POLICY IF EXISTS "Rooms are viewable by everyone" ON public.rooms;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create secure RLS policy for room_messages: only room participants can view messages
CREATE POLICY "Messages viewable by room participants"
ON public.room_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM room_participants
    WHERE room_participants.room_id = room_messages.room_id
    AND room_participants.user_id = auth.uid()
  )
);

-- Create secure RLS policy for room_participants: only room participants can view other participants
CREATE POLICY "Participants viewable by room participants"
ON public.room_participants
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM room_participants rp
    WHERE rp.room_id = room_participants.room_id
    AND rp.user_id = auth.uid()
  )
);

-- Create secure RLS policy for rooms: only authenticated users can view rooms
CREATE POLICY "Rooms viewable by authenticated users"
ON public.rooms
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Create secure RLS policy for profiles: authenticated users can view profiles
CREATE POLICY "Profiles viewable by authenticated users"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);