import { Colors } from "@/constants/Colors";
import { hp, wp } from "@/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, useColorScheme, View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  const styles = StyleSheet.create({
    tabBarStyle: {
      borderWidth: 0,
      borderTopWidth: 0,
      backgroundColor: Colors[theme].background,
      height: hp(8),
      marginHorizontal: wp(4),
      marginBottom: hp(2),
      borderRadius: wp(12),
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    },
    iconContainer: {
      width: wp(10),
      height: wp(10),
      borderRadius: wp(5),
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: Colors[theme].whiteText,
        tabBarInactiveTintColor: "#FFB3BA",
        tabBarShowLabel: false,
        tabBarIconStyle: {
          marginTop: hp(1.5),
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }: { focused: boolean; size: number }) => (
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: focused
                    ? Colors[theme].primary
                    : "transparent",
                },
              ]}
            >
              <MaterialCommunityIcons
                name="view-dashboard"
                size={focused ? 24 : 28}
                color={focused ? Colors[theme].whiteText : Colors[theme].pink}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "Users",
          tabBarIcon: ({ focused }: { focused: boolean; size: number }) => (
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: focused
                    ? Colors[theme].primary
                    : "transparent",
                },
              ]}
            >
              <MaterialCommunityIcons
                name="account-group"
                size={focused ? 24 : 28}
                color={focused ? Colors[theme].whiteText : Colors[theme].pink}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
