/* eslint-disable react-hooks/exhaustive-deps */
import createStyles from "@/app/tabStyles/home.styles";
import QuestionCard from "@/components/QuestionCard";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import StoryCircle from "@/components/StoryCircle";
import { Colors } from "@/constants/Colors";
import {
  fetchAllUserStories,
  fetchStoriesForUser,
  uploadMultipleImages
} from "@/firebase/auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  setDeviceLocation,
  setLocationPermissionGranted,
  setToken,
} from "@/redux/slices/userSlice";
import { hp } from "@/utils";
import { requestLocationPermission } from "@/utils/Permission";
import { getAuth } from "@react-native-firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "@react-native-firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

type Story = {
  id: string;
  username: string;
  image: string;
  isOwn: boolean;
};

type Question = {
  id: string;
  category: string;
  question: string;
  user: {
    name: string;
    location: string;
    avatar: string;
  };
  backgroundImage: string;
};

const questions: Question[] = [
  {
    id: "1",
    category: "Travel",
    question: "If you could live anywhere in the world, where would you pick?",
    user: {
      name: "Miranda Kehlani",
      location: "STUTTGART",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    backgroundImage:
      "https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "2",
    category: "Football",
    question: "What's your favorite football team and why?",
    user: {
      name: "Alex Johnson",
      location: "MUNICH",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    backgroundImage:
      "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "3",
    category: "Food",
    question: "What's the most adventurous dish you've ever tried?",
    user: {
      name: "Sofia Martinez",
      location: "BARCELONA",
      avatar:
        "https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    backgroundImage:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

export default function Home() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const [activeTab, setActiveTab] = useState<
    "Make Friends" | "Search Partners"
  >("Make Friends");
  const [hasNotification] = useState(true);

  const dispatch = useDispatch();
  const [userId, setUserId] = useState("");
  const [allStories, setAllStories] = useState<UserStory[]>([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        console.log("✅ Logged-in user ID:", user.uid);
        setUserId(user.uid);
      } else {
        console.log("❌ No user is logged in");
      }
    });

    return () => unsubscribe(); 
  }, []);

  // Get user's current location
  const getCurrentLocation = async () => {
    try {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted) {
        dispatch(setLocationPermissionGranted(true));
        const location = await Location.getCurrentPositionAsync({});
        dispatch(setDeviceLocation(location));
      } else {
        console.log("Location permission denied");
        dispatch(setLocationPermissionGranted(false));
      }
    } catch (error) {
      console.error("Error getting location:", error);
      dispatch(setLocationPermissionGranted(false));
    }
  };

  useEffect(() => {
    getCurrentLocation();
    getStories();
  }, []);

  const getStories = async () => {
    try {
      const stories = await fetchAllUserStories();

      setAllStories(stories);
    } catch (error) {
      console.log("error when fetch stories", error);
    }
  };

  const handleStoryPress = async (userStory) => {
  const currentUserStories = await fetchStoriesForUser(userStory.id);

  router.push({
    pathname: "/mainScreens/storyView",
    params: {
      userId: userStory.id,
      username: userStory.username,
      profilePic: userStory.profilePic,
      stories: JSON.stringify(currentUserStories),
      initialStoryIndex: 0,
    }
  });
};


  const handleCardAction = (action: string, questionId: string) => {
    console.log(`${action} on question ${questionId}`);
  };

  const handleStoryUpload = async (story: Story) => {
    console.log("hi");
    const result = await pickStory();

    if (!result || result.length === 0) return;

    const uploadedUrls = await uploadMultipleImages(
      result,
      "user",
      userId,
      "story"
    );

    const now = new Date();

    const newStoryItems = uploadedUrls.map(url => ({
      url,
      createdAt: now,
    }));

    const db = getFirestore();
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("User not found");
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "users", userDoc.id);
    const userData = userDoc.data();

    const existingStories = userData?.stories || [];

    const updatedStories = [...existingStories, ...newStoryItems];

    await updateDoc(userRef, {
      stories: updatedStories,
      updatedAt: new Date(),
    });

    const storyRef = doc(db, "stories", userId);
    const storyDoc = await getDoc(storyRef);

    const newStoryItem = {
      date: now,
      storyUrls: uploadedUrls,
    };

    if (storyDoc.exists()) {
      const existingData = storyDoc.data();
      const existingStories = existingData?.storyItems || [];

      const updatedStories = [...existingStories, newStoryItem];

      await setDoc(storyRef, {
        storyItems: updatedStories,
      });
    } else {
      await setDoc(storyRef, {
        storyItems: [newStoryItem],
      });
    }

    console.log("✅ Story added");
  };

  const pickStory = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, 
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets.map(asset => asset.uri);
    }

    return [];
  };

  return (
    <Container>
      <View style={styles.titleContainer}>
        <RnText
          style={styles.titleText}
          onPress={() => {
            router.dismissAll();
            router.replace("/onboarding");
            dispatch(setToken(false));
          }}
        >
          XYZ
        </RnText>
        <View style={styles.headerIconContainer}>
          <RoundButton
            iconName="notifications-none"
            iconSize={24}
            iconColor={Colors[theme].primary}
            backgroundColour={Colors[theme].whiteText}
            onPress={() => router.push("/main/notification")}
            showDot={hasNotification}
          />
          <RoundButton
            iconName="tv"
            iconSize={24}
            iconColor={Colors[theme].primary}
            backgroundColour={Colors[theme].whiteText}
            onPress={() => router.push("/eventScreens/explore")}
          />
        </View>
      </View>

      <View style={styles.storiesContainer}>
        <FlatList
          data={allStories}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <StoryCircle
              image={item.image}
              username={item.username || "user"}
              isOwn={item.isOwn}
              onPress={() => handleStoryPress(item)}
              ownUploadOnPress={() => handleStoryUpload(item)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesList}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Make Friends" && styles.activeTab]}
          onPress={() => setActiveTab("Make Friends")}
        >
          <RnText
            style={[
              styles.tabText,
              activeTab === "Make Friends" && styles.activeTabText,
            ]}
          >
            Make Friends
          </RnText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "Search Partners" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("Search Partners")}
        >
          <RnText
            style={[
              styles.tabText,
              activeTab === "Search Partners" && styles.activeTabText,
            ]}
          >
            Search Partners
          </RnText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={questions}
        keyExtractor={item => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: hp(10) }}
        renderItem={({ item }: { item: Question }) => (
          <QuestionCard
            id={item.id}
            category={item.category}
            question={item.question}
            user={item.user}
            backgroundImage={item.backgroundImage}
            onLike={() => handleCardAction("like", item.id)}
            onComment={() => handleCardAction("comment", item.id)}
            onMore={() => handleCardAction("more", item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}
