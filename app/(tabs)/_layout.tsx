import showToaster from "@/components/RnToast";
import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { hp, wp } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import { router, Tabs, usePathname } from "expo-router";
import { useCallback, useEffect } from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { OneSignal } from "react-native-onesignal";
import Toast from "react-native-toast-message";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const pathname = usePathname();

  const styles = StyleSheet.create({
    iconContainer: {
      width: wp(10),
      height: wp(10),
      borderRadius: Borders.circle,
      justifyContent: "center",
      alignItems: "center",
    },
    tabBarStyle: {
      borderWidth: 0,
      borderTopWidth: 0,
      backgroundColor: Colors[theme].bottomTab,
      height: hp(8),
      marginHorizontal: wp(4),
      marginBottom: hp(2),
      borderRadius: Borders.radius4,
      position: "absolute",
    },
  });

  // Notification handling functions (same as in notification.tsx)
  const handleReelNotificationPress = useCallback((userId: string) => {
    router.push({
      pathname: "/(tabs)/discover/[id]",
      params: {
        id: userId,
        isFriend: "false",
      },
    });
  }, []);

  const handleLikeNotificationPress = useCallback((userId: string) => {
    router.push({
      pathname: "/(tabs)/discover/[id]",
      params: {
        id: userId,
        isFriend: "false",
      },
    });
  }, []);

  const handleMatchNotificationPress = useCallback((userId: string) => {
    router.push({
      pathname: "/(tabs)/discover/[id]",
      params: {
        id: userId,
        isFriend: "true",
      },
    });
  }, []);

  const handleMessageNotificationPress = useCallback((messageId: string) => {
    router.push({
      pathname: "/messages/chat/[id]",
      params: { id: messageId },
    });
  }, []);

  const handleGroupNotificationPress = useCallback((groupId: string) => {
    router.push(`/mainScreens/hangoutDetails?groupId=${groupId}`);
  }, []);

  // Unified notification handler
  const handleNotificationPress = useCallback(
    (data: any) => {
      switch (data.type) {
        case "reel":
          handleReelNotificationPress(data.id);
          break;
        case "like":
          handleLikeNotificationPress(data.id);
          break;
        case "match":
          handleMatchNotificationPress(data.id);
          break;
        case "message":
          handleMessageNotificationPress(data.chatId || data.id);
          break;
        case "groupMessage":
          handleGroupNotificationPress(data.groupId);
          break;
        default:
          console.log("Unknown notification type:", data.type);
          break;
      }
    },
    [
      handleReelNotificationPress,
      handleLikeNotificationPress,
      handleMatchNotificationPress,
      handleMessageNotificationPress,
      handleGroupNotificationPress,
    ]
  );

  useEffect(() => {
    OneSignal.Notifications.addEventListener("click", (event: any) => {
      const data = event.notification?.additionalData;
      if (!data) return;
      handleNotificationPress(data);
    });

    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      (event: any) => {
        event.preventDefault();

        const notification = event.notification;
        const data = notification?.additionalData;

        showToaster({
          type: "info",
          heading: notification?.title || "New Notification",
          message: notification?.body || "You have a new notification",
          position: "top",
          onPress: () => {
            Toast.hide();
            if (data) {
              handleNotificationPress(data);
            }
          },
        });
      }
    );
  }, [handleNotificationPress]);

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
          tabBarButton: props => {
            const { ref, ...rest } = props;
            return (
              <Pressable
                {...rest}
                android_ripple={null}
                style={props.style}
                onPress={() => {
                  if (pathname !== "/main/home") {
                    router.replace("/main/home");
                  }
                }}
              >
                {props.children}
              </Pressable>
            );
          },
          tabBarIcon: ({ focused }) => (
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
          popToTopOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarButton: props => {
            const { ref, ...rest } = props;
            return (
              <Pressable
                {...rest}
                android_ripple={null}
                style={props.style}
                onPress={() => {
                  if (pathname !== "/discover/discovery") {
                    router.replace("/discover/discovery");
                  }
                }}
              >
                {props.children}
              </Pressable>
            );
          },
          tabBarIcon: ({ focused }) => (
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
          popToTopOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="swipeProfile"
        options={{
          title: "swipeProfile",
          tabBarButton: props => {
            const { ref, ...rest } = props;
            return (
              <Pressable
                {...rest}
                android_ripple={null}
                style={props.style}
                onPress={() => {
                  if (pathname !== "/swipeProfile") {
                    router.replace("/swipeProfile");
                  }
                }}
              >
                {props.children}
              </Pressable>
            );
          },
          tabBarIcon: ({ focused }) => (
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
          popToTopOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: "Matches",
          tabBarButton: props => {
            const { ref, ...rest } = props;
            return (
              <Pressable
                {...rest}
                android_ripple={null}
                style={props.style}
                onPress={() => {
                  if (pathname !== "/matches") {
                    router.replace("/matches");
                  }
                }}
              >
                {props.children}
              </Pressable>
            );
          },
          tabBarIcon: ({ focused }) => (
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
          popToTopOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarButton: props => {
            const { ref, ...rest } = props;
            return (
              <Pressable
                {...rest}
                android_ripple={null}
                style={props.style}
                onPress={() => {
                  if (pathname !== "/messages") {
                    router.replace("/messages");
                  }
                }}
              >
                {props.children}
              </Pressable>
            );
          },
          tabBarIcon: ({ focused }) => (
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
          popToTopOnBlur: true,
        }}
      />
    </Tabs>
  );
}
