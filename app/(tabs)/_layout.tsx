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
      marginBottom: hp(1),
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
        name="main"
        options={{
          title: "Home",
          tabBarButton: (props) => {
            const { ref, ...rest } = props;
            return (
              <Pressable {...rest} android_ripple={null} style={props.style}>
                {props.children}
              </Pressable>
            );
          },
          tabBarIcon: ({ focused, size }) => (
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
                name="home"
                size={focused ? 24 : 28}
                color={Colors[theme].whiteText}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarButton: (props) => {
            const { ref, ...rest } = props;
            return (
              <Pressable {...rest} android_ripple={null} style={props.style}>
                {props.children}
              </Pressable>
            );
          },
          tabBarIcon: ({ focused, size }) => (
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
                name="explore"
                size={focused ? 24 : 28}
                color={Colors[theme].whiteText}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarButton: (props) => {
            const { ref, ...rest } = props;
            return (
              <Pressable {...rest} android_ripple={null} style={props.style}>
                {props.children}
              </Pressable>
            );
          },
          tabBarIcon: ({ focused, size }) => (
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
                name="add"
                size={focused ? 24 : 32}
                color={Colors[theme].whiteText}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: "Matches",
          tabBarButton: (props) => {
            const { ref, ...rest } = props;
            return (
              <Pressable {...rest} android_ripple={null} style={props.style}>
                {props.children}
              </Pressable>
            );
          },
          tabBarIcon: ({ focused, size }) => (
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
                size={focused ? 24 : 22}
                color={Colors[theme].whiteText}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarButton: (props) => {
            const { ref, ...rest } = props;
            return (
              <Pressable {...rest} android_ripple={null} style={props.style}>
                {props.children}
              </Pressable>
            );
          },
          tabBarIcon: ({ focused, size }) => (
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
                name="chat"
                size={focused ? 24 : 22}
                color={Colors[theme].whiteText}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: "Tickets",
          tabBarButton: (props) => {
            const { ref, ...rest } = props;
            return (
              <Pressable {...rest} android_ripple={null} style={props.style}>
                {props.children}
              </Pressable>
            );
          },
          tabBarIcon: ({ focused, size }) => (
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
                name="local-activity"
                size={focused ? 24 : 22}
                color={Colors[theme].whiteText}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
