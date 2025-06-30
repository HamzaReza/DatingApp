import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        animationDuration: 200,
        headerShown: false,
      }}
    >
      <Stack.Screen name="users" />
    </Stack>
  );
}
