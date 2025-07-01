import { Colors } from "@/constants/Colors";
import { hp, wp } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  const styles = StyleSheet.create({
    iconContainer: {
      width: wp(10),
      height: wp(10),
      borderRadius: wp(5),
      justifyContent: "center",
      alignItems: "center",
    },
    tabBarStyle: {
      borderWidth: 0,
      borderTopWidth: 0,
      backgroundColor: Colors[theme].pink,
      height: hp(8),
      marginHorizontal: wp(4),
      marginBottom: hp(2),
      borderRadius: wp(12),
      position: "absolute",
    },
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: false,
        tabBarIconStyle: {
          marginTop: hp(2),
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarButton: (props) => {
            const { ref, ...rest } = props;
            return (
              <Pressable {...rest} android_ripple={null} style={props.style}>
                {props.children}
              </Pressable>
            );
          },
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
              <MaterialIcons
                name="dashboard"
                size={focused ? 24 : 28}
                color={Colors[theme].whiteText}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "Users",
          tabBarButton: (props) => {
            const { ref, ...rest } = props;
            return (
              <Pressable {...rest} android_ripple={null} style={props.style}>
                {props.children}
              </Pressable>
            );
          },
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
              <MaterialIcons
                name="people"
                size={focused ? 24 : 28}
                color={Colors[theme].whiteText}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="event"
        options={{
          title: "Event",
          tabBarButton: (props) => {
            const { ref, ...rest } = props;
            return (
              <Pressable {...rest} android_ripple={null} style={props.style}>
                {props.children}
              </Pressable>
            );
          },
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
              <MaterialIcons
                name="calendar-month"
                size={focused ? 24 : 28}
                color={Colors[theme].whiteText}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="pricing"
        options={{
          title: "Pricing",
          tabBarButton: (props) => {
            const { ref, ...rest } = props;
            return (
              <Pressable {...rest} android_ripple={null} style={props.style}>
                {props.children}
              </Pressable>
            );
          },
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
              <MaterialIcons
                name="currency-exchange"
                size={focused ? 24 : 28}
                color={Colors[theme].whiteText}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
