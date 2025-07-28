/* eslint-disable react-hooks/exhaustive-deps */
import createStyles from "@/app/tabStyles/profile.styles";
import InterestTag from "@/components/InterestTag";
import RnButton from "@/components/RnButton";
import Container from "@/components/RnContainer";
import RnDropdown from "@/components/RnDropdown";
import RnImagePicker from "@/components/RnImagePicker";
import RnInput from "@/components/RnInput";
import RnModal from "@/components/RnModal";
import RnText from "@/components/RnText";
import showToaster from "@/components/RnToast";
import RoundButton from "@/components/RoundButton";
import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import {
  fetchTags,
  getUserByUid,
  recordLike,
  updateUser,
  uploadMultipleImages,
} from "@/firebase/auth";
import { uploadReel } from "@/firebase/reels";
import { RootState } from "@/redux/store";
import { encodeImagePath, hp, wp } from "@/utils";
import getDistanceFromLatLonInMeters from "@/utils/Distance";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, getFirestore } from "@react-native-firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { reverseGeocodeAsync } from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Formik, FormikProps } from "formik";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import * as Yup from "yup";

const IMAGE_HEIGHT = hp(60);

type Tag = {
  label: string;
  iconSvg: string;
  id: string;
};

export default function Profile() {
  const colorScheme = useColorScheme() || "light";
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const { user } = useSelector((state: RootState) => state.user);

  const { id } = useLocalSearchParams();
  const [galleryModalVisible, setGalleryModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const scrollY = useRef(new Animated.Value(0)).current;
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownItems, setDropdownItems] = useState<
    { label: string; value: string }[]
  >([]);
  const [dropdownValue, setDropdownValue] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [reelModalVisible, setReelModalVisible] = useState(false);
  const [selectedReel, setSelectedReel] = useState<string | null>(null);
  const [reelUploadModalVisible, setReelUploadModalVisible] = useState(false);
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | null>(null);
  const [selectedVideoThumbnail, setSelectedVideoThumbnail] = useState<
    string | null
  >(null);
  const reelFormikRef = useRef<FormikProps<any>>(null);
  const formikRef = useRef<FormikProps<any>>(null);

  useEffect(() => {
    getUserDetails();
    if (user?.uid !== id) {
      setShowActionButtons(true);
    }
  }, []);

  // Single useEffect to handle all video player state management
  useEffect(() => {
    if (reelModalVisible && selectedReel) {
      // Modal is open and a reel is selected - play the video
      player.currentTime = 0;
      player.play();
    } else {
      // Modal is closed or no reel selected - pause and cleanup
      player.pause();
      player.currentTime = 0;

      // If modal is closed, clear the selected reel
      if (!reelModalVisible) {
        setSelectedReel(null);
      }
    }
  }, [reelModalVisible, selectedReel]);

  useEffect(() => {
    const getAddress = async () => {
      if (!profileData?.location) return;
      const addressData = await reverseGeocodeAsync({
        latitude: profileData.location.latitude,
        longitude: profileData.location.longitude,
      });
      setAddress(`${addressData[0].city}, ${addressData[0].region}`);
    };

    getAddress();
  }, [profileData?.location?.latitude, profileData?.location?.longitude]);

  useEffect(() => {
    const unsubscribe = fetchTags((tagsArr: Tag[]) => {
      setDropdownItems(
        tagsArr.map((tag: Tag) => ({ label: tag.label, value: tag.label }))
      );
      setTags(tagsArr);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setDropdownValue(
      (profileData?.interests?.split(",") || [])
        .map((i: string) => i.trim())
        .filter(Boolean)
    );
  }, [profileData, dropdownItems]);

  const player = useVideoPlayer(selectedReel, (player: any) => {
    player.loop = true;
    player.play();
  });

  const getUserDetails = async () => {
    scrollY.setValue(0);
    setLoading(true);
    const data = await getUserByUid(id as string);
    setProfileData(data);
    setLoading(false);
  };

  const updateTrustScore = async (userId: string) => {
    try {
      const currentUserData = await getUserByUid(userId);

      if (currentUserData) {
        let newTrustScore: number;

        if (
          currentUserData.trustScore !== undefined &&
          currentUserData.trustScore !== null
        ) {
          // If trustScore exists, add 1 but don't go over 100
          newTrustScore = Math.min(100, currentUserData.trustScore + 1);
        } else {
          // If trustScore doesn't exist, start with 1
          newTrustScore = 1;
        }

        // Update user with new trust score
        await updateUser(userId, { trustScore: newTrustScore });
      }
    } catch (error) {
      console.error("Error updating trust score:", error);
    }
  };

  const handleEditPress = () => {
    setEditModalVisible(true);
  };

  const handleDislikePress = async () => {
    try {
      if (!user?.uid || !profileData?.uid) return;

      setShowActionButtons(false);
    } catch (error) {
      console.error("Error handling dislike:", error);
    }
  };

  const handleLikePress = async () => {
    try {
      if (!user?.uid || !profileData?.uid) return;

      await recordLike(user.uid, profileData.uid);

      await updateTrustScore(user.uid);

      setShowActionButtons(false);
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleSuperLikePress = async () => {
    try {
      if (!user?.uid || !profileData?.uid) return;

      await recordLike(user.uid, profileData.uid);

      await updateTrustScore(user.uid);

      setShowActionButtons(false);
    } catch (error) {
      console.error("Error handling super like:", error);
    }
  };

  const handleSendPress = async (
    currentUserId: string,
    profileViewingUserId: string
  ) => {
    try {
      const db = getFirestore();

      // Check both possible match document ID formats
      const possibleMatchIds = [
        `${currentUserId}_${profileViewingUserId}`,
        `${profileViewingUserId}_${currentUserId}`,
      ];

      // Check if either match document exists
      let matchFound = false;
      let matchId = "";

      for (const id of possibleMatchIds) {
        const matchRef = doc(db, "matches", id);
        const matchDoc = await getDoc(matchRef);

        if (matchDoc.exists()) {
          matchFound = true;
          matchId = id;
          break;
        }
      }

      if (matchFound) {
        // Navigate to chat with the match ID
        router.push({
          pathname: `/(tabs)/messages/chat/[id]`,
          params: {
            matchId: matchId,
            otherUserId: profileViewingUserId,
            chatType: "single",
          },
        });
      } else {
        // Show error that you need to match first
        Alert.alert(
          "No Match Yet",
          "You need to match with this user before chatting"
        );
      }
    } catch (error) {
      console.error("Error checking match:", error);
      Alert.alert("Error", "Could not check match status");
    }
  };

  const handleGalleryUpload = async (
    uri: {
      uri: string;
      path: string;
      type: string;
      name: string;
    }[]
  ) => {
    setGalleryLoading(true);
    let imageUris: string[] = [];
    uri.map(img => imageUris.push(img.uri));
    let galleryUrl = await uploadMultipleImages(
      imageUris,
      "user",
      user.uid,
      "gallery"
    );
    await updateUser(user.uid, {
      gallery: [...(profileData?.gallery || []), ...galleryUrl],
    });
    setGalleryLoading(false);
    await getUserDetails();
  };

  const handleReelUpload = async (uri: string, caption: string) => {
    try {
      setGalleryLoading(true);

      // Generate thumbnail from video
      const thumbnailUri = await generateThumbnail(uri);

      // Use the new uploadReel function
      await uploadReel(uri, thumbnailUri || undefined, caption);

      // Reset form and close modal
      setReelUploadModalVisible(false);
      setSelectedVideoUri(null);
      setSelectedVideoThumbnail(null);

      // Refresh user details to show the new reel
      await getUserDetails();
    } catch (error: any) {
      console.error("Error uploading reel:", error);
      showToaster({
        type: "error",
        heading: "Upload Failed",
        message: error.message || "Failed to upload reel. Please try again.",
      });
    } finally {
      setGalleryLoading(false);
    }
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors[theme].primary} />
      </View>
    );
  }

  const distance = getDistanceFromLatLonInMeters(
    profileData.location.latitude,
    profileData.location.longitude,
    user.location.latitude,
    user.location.longitude
  );

  const formatDistance = (distanceInMeters: number) => {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)} m`;
    } else {
      return `${(distanceInMeters / 1000).toFixed(1)} km`;
    }
  };

  const generateThumbnail = async (reelUrl: string) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(reelUrl, {
        time: 5000,
      });
      return uri;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

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
        {user.uid === id && (
          <RoundButton
            iconName="edit"
            iconSize={22}
            iconColor={Colors[theme].primary}
            backgroundColour={Colors[theme].whiteText}
            onPress={handleEditPress}
          />
        )}
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

      {showActionButtons && (
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
      )}

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{ paddingBottom: hp(8) }}
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
            {user.uid !== id && (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => {
                  handleSendPress(user.uid, id as string);
                }}
              >
                <RoundButton
                  iconName="send"
                  iconSize={24}
                  iconColor={Colors[theme].primary}
                  backgroundColour={Colors[theme].background}
                  onPress={() => {
                    handleSendPress(user.uid, id as string);
                  }}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Bio Section */}
          <View style={styles.section}>
            <RnText style={styles.sectionTitle}>Bio</RnText>
            <RnText style={styles.bio}>{profileData.bio}</RnText>
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <RnText style={styles.sectionTitle}>
              {user.uid === id ? "My Location" : "Distance"}
            </RnText>
            <View style={styles.locationContainer}>
              <Ionicons
                name="location"
                size={16}
                color={Colors[theme].redText}
              />
              <RnText style={styles.distance}>
                {user.uid === id ? address : formatDistance(distance)}
              </RnText>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <RnText style={styles.sectionTitle}>About</RnText>
            <RnText
              style={styles.about}
              numberOfLines={showFullAbout ? undefined : 3}
            >
              {profileData?.aboutMe}
            </RnText>
            {profileData?.aboutMe?.length > 100 && (
              <TouchableOpacity
                onPress={() => setShowFullAbout(!showFullAbout)}
              >
                <RnText style={styles.readMore}>
                  {showFullAbout ? "Read less" : "Read more"}
                </RnText>
              </TouchableOpacity>
            )}
          </View>

          {/* Interests Section */}
          <View style={styles.section}>
            <RnText style={styles.sectionTitle}>Interests</RnText>
            <View style={styles.interestsContainer}>
              {(profileData?.interests?.split(",") || []).map(
                (interest: string, index: number) => (
                  <InterestTag
                    key={index}
                    title={interest.trim()}
                    isSelected={true}
                    icon={tags.find(tag => tag.label === interest)?.iconSvg}
                  />
                )
              )}
            </View>
          </View>

          {/* Gallery Section */}
          <View style={styles.section}>
            <View style={styles.galleryHeader}>
              <RnText style={styles.sectionTitle}>Gallery</RnText>
              {user.uid === id && (
                <RnImagePicker
                  setUri={uri =>
                    handleGalleryUpload(Array.isArray(uri) ? uri : [uri])
                  }
                  visible={imagePickerVisible}
                  showPicker={() => setImagePickerVisible(true)}
                  hidePicker={() => setImagePickerVisible(false)}
                  multiple={true}
                >
                  <RnText style={styles.seeAll}>Add</RnText>
                </RnImagePicker>
              )}
            </View>

            <FlatList
              data={profileData?.gallery || []}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={
                    index === 0
                      ? styles.largeGalleryItem
                      : styles.smallGalleryItem
                  }
                  onPress={() => {
                    setSelectedImage(item);
                    setGalleryModalVisible(true);
                  }}
                >
                  <Image source={{ uri: item }} style={styles.galleryImage} />
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Reels Section */}
          <View style={styles.section}>
            <View style={styles.galleryHeader}>
              <RnText style={styles.sectionTitle}>Reels</RnText>
              {user.uid === id && (
                <RnText
                  style={styles.seeAll}
                  onPress={async () => {
                    const result = await ImagePicker.launchImageLibraryAsync({
                      mediaTypes: "videos",
                      quality: 0.7,
                    });
                    if (!result.canceled) {
                      const videoUri = result.assets[0].uri;
                      setSelectedVideoUri(videoUri);

                      // Generate thumbnail for preview
                      try {
                        const thumbnailUri = await generateThumbnail(videoUri);
                        setSelectedVideoThumbnail(thumbnailUri);
                      } catch (error) {
                        console.warn("Failed to generate thumbnail:", error);
                        setSelectedVideoThumbnail(null);
                      }

                      setReelUploadModalVisible(true);
                    }
                  }}
                >
                  Add
                </RnText>
              )}
            </View>

            <FlatList
              data={profileData?.reels || []}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.reelItem}
                  onPress={() => {
                    // Cleanup any existing player state
                    if (player) {
                      player.pause();
                      player.currentTime = 0;
                    }
                    // Set new reel and open modal
                    setSelectedReel(item.reelUrl);
                    setReelModalVisible(true);
                  }}
                >
                  <Image
                    source={{
                      uri: item.thumbnailUrl,
                    }}
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
              )}
            />
          </View>
        </View>
      </Animated.ScrollView>

      <RnModal
        show={galleryModalVisible}
        backDrop={() => setGalleryModalVisible(false)}
        backButton={() => setGalleryModalVisible(false)}
      >
        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            style={styles.modalMainImage}
            resizeMode="contain"
          />
        )}
      </RnModal>

      <RnModal
        show={editModalVisible}
        backDrop={() => setEditModalVisible(false)}
        backButton={() => setEditModalVisible(false)}
      >
        <View style={styles.editModalContainer}>
          <Formik
            enableReinitialize
            initialValues={{
              bio: profileData?.bio || "",
              aboutMe: profileData?.aboutMe || "",
              interests: dropdownValue,
            }}
            innerRef={formikRef}
            validationSchema={Yup.object({
              bio: Yup.string().required("Bio is required"),
              aboutMe: Yup.string().required("About Me is required"),
              interests: Yup.array()
                .min(1, "Select at least one interest")
                .max(7, "Select at most 7 interests"),
            })}
            onSubmit={async values => {
              setUpdating(true);
              setEditModalVisible(false);
              await updateUser(user.uid, {
                ...values,
                interests: values.interests.join(","),
              });
              await getUserDetails();
              setUpdating(false);
            }}
          >
            {({ handleChange, handleSubmit, values, errors }) => (
              <View>
                <RnText style={[styles.sectionTitle, { textAlign: "center" }]}>
                  Edit Profile
                </RnText>
                <RnText>Bio</RnText>
                <RnInput
                  value={values.bio}
                  onChangeText={handleChange("bio")}
                  error={errors.bio as string}
                  placeholder="Enter your bio"
                />
                <RnText>About Me</RnText>
                <RnInput
                  value={values.aboutMe}
                  onChangeText={handleChange("aboutMe")}
                  error={errors.aboutMe as string}
                  placeholder="Tell us more about yourself"
                  maxLength={500}
                  multiline
                  numberOfLines={5}
                  inputContainerStyle={{ height: hp(10) }}
                  style={{ height: hp(10) }}
                />
                <RnText>Interests</RnText>
                <RnDropdown
                  open={dropdownOpen}
                  setOpen={setDropdownOpen}
                  items={dropdownItems}
                  setItems={setDropdownItems}
                  value={dropdownValue}
                  setValue={setDropdownValue}
                  placeholder="Select your interests"
                  min={0}
                  max={7}
                  zIndex={1000}
                  zIndexInverse={1000}
                  loading={dropdownItems.length === 0}
                  emptyText="No tags found"
                  multiple
                />
                {errors.interests && (
                  <RnText style={{ color: "red", marginBottom: 8 }}>
                    {errors.interests as string}
                  </RnText>
                )}
                <RnButton
                  style={[styles.editProfileButton]}
                  title="Edit Profile"
                  onPress={handleSubmit}
                  loading={updating}
                />
              </View>
            )}
          </Formik>
        </View>
      </RnModal>
      <RnModal show={galleryLoading}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <RnText
            style={{ marginBottom: hp(2), color: Colors[theme].whiteText }}
          >
            Uploading...
          </RnText>
          <ActivityIndicator size="large" color={Colors[theme].primary} />
        </View>
      </RnModal>
      <RnModal
        show={reelModalVisible}
        backDrop={() => {
          setReelModalVisible(false);
          player.pause();
          player.currentTime = 0;
        }}
        backButton={() => {
          setReelModalVisible(false);
          player.pause();
          player.currentTime = 0;
        }}
      >
        {selectedReel && (
          <VideoView
            key={selectedReel}
            style={styles.video}
            player={player}
            allowsFullscreen={false}
            allowsPictureInPicture={false}
          />
        )}
      </RnModal>

      {/* Reel Upload Modal */}
      <RnModal
        show={reelUploadModalVisible}
        backDrop={() => {
          setReelUploadModalVisible(false);
          setSelectedVideoUri(null);
          setSelectedVideoThumbnail(null);
        }}
        backButton={() => {
          setReelUploadModalVisible(false);
          setSelectedVideoUri(null);
          setSelectedVideoThumbnail(null);
        }}
      >
        <View style={styles.reelUploadModal}>
          <Formik
            initialValues={{
              caption: "",
            }}
            innerRef={reelFormikRef}
            validationSchema={Yup.object({
              caption: Yup.string()
                .max(200, "Caption must be less than 200 characters")
                .required("Caption is required"),
            })}
            onSubmit={async values => {
              if (selectedVideoUri) {
                await handleReelUpload(selectedVideoUri, values.caption);
              }
            }}
          >
            {({ handleChange, handleSubmit, values, errors }) => (
              <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1, padding: wp(4) }}
                keyboardShouldPersistTaps="handled"
              >
                <RnText style={styles.sectionTitle}>Upload Reel</RnText>

                {selectedVideoThumbnail && (
                  <Image
                    source={{ uri: selectedVideoThumbnail }}
                    style={{
                      width: "100%",
                      height: hp(20),
                      borderRadius: Borders.radius2,
                    }}
                  />
                )}

                <RnText
                  style={{
                    marginVertical: hp(1),
                    fontFamily: FontFamily.semiBold,
                  }}
                >
                  Caption
                </RnText>
                <RnInput
                  value={values.caption}
                  onChangeText={handleChange("caption")}
                  error={errors.caption as string}
                  placeholder="Write a caption for your reel..."
                  maxLength={200}
                  multiline
                  numberOfLines={3}
                  inputContainerStyle={{ height: hp(10) }}
                  style={{ height: hp(10), textAlignVertical: "top" }}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: hp(3),
                  }}
                >
                  <RnButton
                    title="Cancel"
                    onPress={() => {
                      setReelUploadModalVisible(false);
                      setSelectedVideoUri(null);
                      setSelectedVideoThumbnail(null);
                    }}
                    style={[[styles.reelButton, styles.cancelButton]]}
                    disabled={galleryLoading}
                  />
                  <RnButton
                    title="Upload"
                    onPress={handleSubmit}
                    loading={galleryLoading}
                    style={[styles.reelButton]}
                  />
                </View>
              </KeyboardAwareScrollView>
            )}
          </Formik>
        </View>
      </RnModal>
    </Container>
  );
}
