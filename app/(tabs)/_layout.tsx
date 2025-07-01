import { Colors } from "@/constants/Colors";
import { hp, wp } from "@/utils";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";


export default function TabLayout() {

const colorScheme = useColorScheme();
const theme = colorScheme === "dark" ? "dark" : "light";

  return (
    <Tabs
      screenOptions={{
        
        headerShown: false,
        tabBarStyle: {
          borderWidth: 0,
          borderTopWidth: 0,
          backgroundColor: Colors[theme].background,
          height: hp(8),
          marginHorizontal: wp(4),
          marginBottom: hp(2),
          borderRadius: wp(12),
          position: "absolute",
          alignItems: "center", // Align content inside tabBar
          justifyContent: "center", // Center vertically
        },

        tabBarActiveTintColor: Colors[theme].whiteText,
        tabBarInactiveTintColor: "#FFB3BA",
        tabBarShowLabel: false,
        tabBarIconStyle: {
          marginTop: hp(1.5),
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
    tabBarButton: (props) => {
      // Omit the 'ref' property to avoid type incompatibility
      const { ref, ...rest } = props;
      return (
        <Pressable
          {...rest}
          android_ripple={null} // disables ripple on Android
          style={props.style}
        >
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
              <Octicons
                name="home"
                size={focused ? 24 : 28}
                color={
                  focused ? Colors[theme].whiteText : "rgba(255, 88, 98, 0.8)"
                }
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
      // Omit the 'ref' property to avoid type incompatibility
      const { ref, ...rest } = props;
      return (
        <Pressable
          {...rest}
          android_ripple={null} // disables ripple on Android
          style={props.style}
        >
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
              <FontAwesome5
                name="compass"
                size={focused ? 24 : 28}
                color={
                  focused ? Colors[theme].whiteText : "rgba(255, 88, 98, 0.8)"
                }
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
        <Pressable
          {...rest}
          android_ripple={null} // disables ripple on Android
          style={props.style}
        >
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
              <Ionicons
                name="add"
                size={focused ? 24 : 32}
                color={
                  focused ? Colors[theme].whiteText : "rgba(255, 88, 98, 0.8)"
                }
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
        <Pressable
          {...rest}
          android_ripple={null} // disables ripple on Android
          style={props.style}
        >
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
              <FontAwesome5
                name="user-friends"
                size={focused ? 24 : 22}
                color={
                  focused ? Colors[theme].whiteText : "rgba(255, 88, 98, 0.8)"
                }
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
        <Pressable
          {...rest}
          android_ripple={null} // disables ripple on Android
          style={props.style}
        >
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
              <Ionicons
                name="chatbubble-sharp"
                size={focused ? 24 : 22}
                color={
                  focused ? Colors[theme].whiteText : "rgba(255, 88, 98, 0.8)"
                }
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
        <Pressable
          {...rest}
          android_ripple={null} // disables ripple on Android
          style={props.style}
        >
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
              <MaterialCommunityIcons
                name="ticket"
                size={focused ? 24 : 22}
                color={
                  focused ? Colors[theme].whiteText : "rgba(255, 88, 98, 0.8)"
                }
              />
            </View>
          ),
        }}
      />

      
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: wp(10), // reduced size
    height: wp(10),
    borderRadius: wp(5),
    justifyContent: "center",
    alignItems: "center",
  },
});
