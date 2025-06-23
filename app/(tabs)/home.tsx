import styles from "@/app/tabStyles/home.styles";
import QuestionCard from "@/components/QuestionCard";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import StoryCircle from "@/components/StoryCircle";
import { Colors } from "@/constants/Colors";
import { setToken } from "@/redux/slices/userSlice";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React, { useState } from "react";
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

const stories: Story[] = [
  {
    id: "1",
    username: "My Story",
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    isOwn: true,
  },
  {
    id: "2",
    username: "Selena",
    image:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150",
    isOwn: false,
  },
  {
    id: "3",
    username: "Clara",
    image:
      "https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=150",
    isOwn: false,
  },
  {
    id: "4",
    username: "Fabian",
    image:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
    isOwn: false,
  },
  {
    id: "5",
    username: "George",
    image:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150",
    isOwn: false,
  },
];

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
  const [activeTab, setActiveTab] = useState<
    "Make Friends" | "Search Partners"
  >("Make Friends");
  const [hasNotification] = useState(true);

  const dispatch = useDispatch();

  const handleStoryPress = (story: Story) => {
    router.push(`/mainScreens/storyView`);

    if (story.isOwn) {
      console.log("Add your own story");
    } else {
      console.log(`Open story of ${story.username}`);
    }
  };

  const handleCardAction = (action: string, questionId: string) => {
    console.log(`${action} on question ${questionId}`);
  };

  return (
    <ScrollContainer>
      <View style={styles.titleContainer}>
        <RnText
          style={styles.titleText}
          onPress={() => {
            router.dismissAll();
            router.replace("/auth/onboarding");
            dispatch(setToken(false));
          }}
        >
          XYZ
        </RnText>
        <TouchableOpacity style={styles.notificationContainer}>
          <MaterialIcons
            name="notifications-none"
            size={24}
            color={Colors.dark.greenText}
            onPress={() => router.push("/mainScreens/matchesList")}
          />
          {hasNotification && <View style={styles.notificationDot} />}
        </TouchableOpacity>
      </View>

      <View style={styles.storiesContainer}>
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StoryCircle
              image={item.image}
              username={item.username}
              isOwn={item.isOwn}
              onPress={() => handleStoryPress(item)}
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

      <View style={styles.questionsContainer}>
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            id={question.id}
            category={question.category}
            question={question.question}
            user={question.user}
            backgroundImage={question.backgroundImage}
            onLike={() => handleCardAction("like", question.id)}
            onComment={() => handleCardAction("comment", question.id)}
            onMore={() => handleCardAction("more", question.id)}
          />
        ))}
      </View>
    </ScrollContainer>
  );
}

