import { Stack } from "expo-router";

export default function MessagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "transparent", // ✅ key line to make background see-through
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="chat/[id]"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
          headerShown: false,
          contentStyle: {
            backgroundColor: "transparent",
          },
          animationDuration: 300,
          gestureEnabled: true,
          tabBarStyle: { display: "none" }, // ✅ use this directly here
        }}
      />

      <Stack.Screen
        name="connection/[id]"
        options={{
          tabBarStyle: { display: "none" }, // Hide tab bar in this screen
        }}
      />
    </Stack>
  );
}
