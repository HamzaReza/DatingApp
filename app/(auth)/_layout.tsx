import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        animationDuration: 200,
      }}
    >
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="getStarted"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="otp"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="name"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="email"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="age"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="gender"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="lookingFor"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="interests"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="photo"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="location"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profession"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="religion"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
