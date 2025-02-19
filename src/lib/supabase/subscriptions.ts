import { supabase } from "./client";
import { useDashboardStore } from "../store";

export function setupSubscriptions() {
  const currentUser = useDashboardStore.getState().currentUser;
  if (!currentUser) return;

  // Subscribe to chat messages
  const messagesSubscription = supabase
    .channel("messages")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
      },
      (payload) => {
        // Handle new message
        console.log("New message:", payload);
      },
    )
    .subscribe();

  // Subscribe to chat participants
  const participantsSubscription = supabase
    .channel("chat_participants")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "chat_participants",
      },
      (payload) => {
        // Handle participant changes
        console.log("Participant change:", payload);
      },
    )
    .subscribe();

  // Subscribe to profile changes
  const profilesSubscription = supabase
    .channel("profiles")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "profiles",
        filter: `id=eq.${currentUser.id}`,
      },
      (payload) => {
        // Handle profile update
        console.log("Profile updated:", payload);
      },
    )
    .subscribe();

  // Return cleanup function
  return () => {
    messagesSubscription.unsubscribe();
    participantsSubscription.unsubscribe();
    profilesSubscription.unsubscribe();
  };
}
