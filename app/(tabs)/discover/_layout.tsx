import { Stack } from "expo-router";

export default function DiscoverLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="discovery" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
