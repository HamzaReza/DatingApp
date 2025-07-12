/* eslint-disable react-hooks/exhaustive-deps */
import createStyles from "@/app/tabStyles/profile.styles";
import InterestTag from "@/components/InterestTag";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { getUserByUid } from "@/firebase/auth";
import { encodeImagePath, hp, wp } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Modal,
  Pressable,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const IMAGE_HEIGHT = hp(60);

// const profileData = {
//   name: "Jessica Parker",
//   age: 23,
//   profession: "Professional model",
//   bio: "lorem ipsum lorem ipsum lorem ipsum",
//   location: "Chicago, IL United States",
//   distance: "1 km",
//   about:
//     "My name is Jessica Parker and I enjoy meeting new people and finding ways to help them have an uplifting experience. I enjoy reading...",
//   interests: [
//     { title: "Travelling", isSelected: true },
//     { title: "Books", isSelected: true },
//     { title: "Music", isSelected: false },
//     { title: "Dancing", isSelected: false },
//     { title: "Modeling", isSelected: false },
//   ],
//   gallery: [
//     "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300",
//     "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300",
//     "https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=300",
//     "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=300",
//   ],
//   mainImage:
//     "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
// };

export default function Profile() {
  const colorScheme = useColorScheme() || "light";
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const { id } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [profileData, setProfileData] = useState(Object);
  const scrollY = useRef(new Animated.Value(0)).current;

  console.log(profileData?.interests);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    const data = await getUserByUid(id as string);
    setProfileData(data);
  };

  const handleEditPress = () => {
    console.log("Edit profile");
  };

  const handleDislikePress = () => {
    console.log("Dislike profile");
  };

  const handleLikePress = () => {
    console.log("Like profile");
  };

  const handleSuperLikePress = () => {
    console.log("Super like profile");
  };

  const handleSendPress = () => {
    console.log("Send message");
  };

  // Image transform animations
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT],
    outputRange: [0, -IMAGE_HEIGHT / 2],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT / 2, IMAGE_HEIGHT],
    outputRange: [1, 0.8, 0.3],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT],
    outputRange: [1, 1.2],
    extrapolate: "clamp",
  });

  // Action buttons animation
  const actionButtonsTranslateY = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT / 5],
    outputRange: [0, -hp(8)],
    extrapolate: "clamp",
  });

  const actionButtonsOpacity = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT / 3, IMAGE_HEIGHT / 2],
    outputRange: [1, 1, 0],
    extrapolate: "clamp",
  });

  return (
    <Container>
      <View style={styles.header}>
        <RoundButton
          iconName="chevron-left"
          iconSize={22}
          iconColor={Colors[theme].primary}
          backgroundColour={Colors[theme].whiteText}
          onPress={() => router.back()}
        />
        <View />
        <RoundButton
          iconName="edit"
          iconSize={22}
          iconColor={Colors[theme].primary}
          backgroundColour={Colors[theme].whiteText}
          onPress={handleEditPress}
        />
      </View>

      {/* Animated Profile Image */}
      <Animated.View
        style={[
          styles.imageContainer,
          {
            transform: [{ translateY: imageTranslateY }, { scale: imageScale }],
            opacity: imageOpacity,
          },
        ]}
      >
        <Image
          source={{ uri: encodeImagePath(profileData.photo) }}
          style={styles.mainImage}
        />
      </Animated.View>

      {/* Floating Action Buttons */}
      <Animated.View
        style={[
          styles.floatingActionButtons,
          {
            transform: [{ translateY: actionButtonsTranslateY }],
            opacity: actionButtonsOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDislikePress}
        >
          <Ionicons name="close" size={28} color={Colors[theme].greenText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleLikePress}
        >
          <Ionicons name="heart" size={32} color={Colors[theme].whiteText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSuperLikePress}
        >
          <Ionicons name="star" size={28} color={Colors[theme].greenText} />
        </TouchableOpacity>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Spacer to account for image */}
        <View style={styles.imageSpacer} />

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <RnText style={styles.name}>
                {profileData.name}, {profileData.age}
              </RnText>
              <RnText style={styles.profession}>
                {profileData.profession}
              </RnText>
            </View>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendPress}
            >
              <RoundButton
                iconName="send"
                iconSize={24}
                iconColor={Colors[theme].primary}
                backgroundColour={Colors[theme].background}
              />
            </TouchableOpacity>
          </View>

          {/* Bio Section */}
          <View style={styles.section}>
            <RnText style={styles.sectionTitle}>Bio</RnText>
            <RnText style={styles.bio}>{profileData.bio}</RnText>
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <RnText style={styles.sectionTitle}>Location</RnText>
            <View style={styles.locationContainer}>
              <Ionicons
                name="location"
                size={16}
                color={Colors[theme].redText}
              />
              <RnText style={styles.distance}>{profileData?.distance}</RnText>
            </View>
            {/* <RnText style={styles.location}>{profileData?.location}</RnText> */}
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <RnText style={styles.sectionTitle}>About</RnText>
            <RnText
              style={styles.about}
              numberOfLines={showFullAbout ? undefined : 3}
            >
              {profileData?.about}
            </RnText>
            <TouchableOpacity onPress={() => setShowFullAbout(!showFullAbout)}>
              <RnText style={styles.readMore}>
                {showFullAbout ? "Read less" : "Read more"}
              </RnText>
            </TouchableOpacity>
          </View>

          {/* Interests Section */}
          <View style={styles.section}>
            <RnText style={styles.sectionTitle}>Interests</RnText>
            <View style={styles.interestsContainer}>
              {(profileData?.interests?.split(",") || []).map(
                (interest: string, index: number) => (
                  <InterestTag
                    key={index}
                    title={interest.trim()} // trims any space
                    isSelected={true} // or use any logic you want
                  />
                )
              )}
            </View>
          </View>

          {/* Gallery Section */}
          <View style={styles.section}>
            <View style={styles.galleryHeader}>
              <RnText style={styles.sectionTitle}>Gallery</RnText>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <RnText style={styles.seeAll}>See all</RnText>
              </TouchableOpacity>
            </View>

            <View style={styles.gallery}>
              <View style={styles.galleryRow}>
                <TouchableOpacity
                  style={styles.largeGalleryItem}
                  onPress={() => setModalVisible(true)}
                >
                  <Image
                    source={{ uri: profileData?.gallery?.gallery[0] }}
                    style={styles.galleryImage}
                  />
                  <View style={styles.playButton}>
                    <Ionicons
                      name="play"
                      size={20}
                      color={Colors[theme].whiteText}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.galleryRow}>
                {profileData?.gallery
                  ?.slice(1)
                  .map((item: string, index: number) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.smallGalleryItem}
                    >
                      <Image
                        source={{ uri: item }}
                        style={styles.galleryImage}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          {/* Close Button */}
          <View style={{ height: hp(10), width: wp(10) }}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons
                name="arrow-back"
                size={25}
                color={Colors[theme].pink}
              />
            </TouchableOpacity>
          </View>

          {/* Main Image */}
          <View style={styles.modalImageContainer}>
            <Image
              source={{ uri: profileData.gallery?.gallery[selectedIndex] }}
              style={styles.modalMainImage}
              resizeMode="contain"
            />
          </View>

          {/* Thumbnails */}
          <FlatList
            data={profileData.gallery}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailList}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => setSelectedIndex(index)}>
                <Image
                  source={{ uri: item }}
                  style={[
                    styles.thumbnail,
                    index === selectedIndex && styles.selectedThumbnail,
                  ]}
                />
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </Container>
  );
}
