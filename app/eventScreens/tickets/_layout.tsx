import { Stack } from "expo-router";

export default function TicketLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        animationDuration: 200,
        headerShown: false,
      }}
    >
      <Stack.Screen name="cardScan" />
      <Stack.Screen name="paymentCard" />
      <Stack.Screen name="paymentScreen" />
      <Stack.Screen name="ticket" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
