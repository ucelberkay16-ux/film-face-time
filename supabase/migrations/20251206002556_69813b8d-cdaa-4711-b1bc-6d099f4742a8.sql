-- Allow room participants to update playback state (is_playing, playback_time)
CREATE POLICY "Participants can update playback state"
ON public.rooms
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.room_participants 
    WHERE room_participants.room_id = rooms.id 
    AND room_participants.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.room_participants 
    WHERE room_participants.room_id = rooms.id 
    AND room_participants.user_id = auth.uid()
  )
);