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
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import {
  fetchTags,
  getUserByUid,
  updateUser,
  uploadMultipleImages,
} from "@/firebase/auth";
import { RootState } from "@/redux/store";
import { encodeImagePath, hp, wp } from "@/utils";
import getDistanceFromLatLonInMeters from "@/utils/Distance";
import { Ionicons } from "@expo/vector-icons";
import { reverseGeocodeAsync } from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { Formik, FormikProps } from "formik";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  const [galleryVisible, setGalleryVisible] = useState(false);

  const formikRef = useRef<FormikProps<any>>(null);

  useEffect(() => {
    getUserDetails();
  }, []);

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

  const getUserDetails = async () => {
    scrollY.setValue(0);
    setLoading(true);
    const data = await getUserByUid(id as string);
    setProfileData(data);
    setLoading(false);
  };

  const handleEditPress = () => {
    setEditModalVisible(true);
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

  const handleImageUpload = async (
    uri: {
      uri: string;
      path: string;
      type: string;
      name: string;
    }[]
  ) => {
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
    await getUserDetails();
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

      {user.uid !== id && (
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
                onPress={handleSendPress}
              >
                <RoundButton
                  iconName="send"
                  iconSize={24}
                  iconColor={Colors[theme].primary}
                  backgroundColour={Colors[theme].background}
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
                    handleImageUpload(Array.isArray(uri) ? uri : [uri])
                  }
                  visible={galleryVisible}
                  showPicker={() => setGalleryVisible(true)}
                  hidePicker={() => setGalleryVisible(false)}
                  multiple={true}
                >
                  <RnText style={styles.seeAll}>Add</RnText>
                </RnImagePicker>
              )}
            </View>

            <View style={styles.gallery}>
              <View style={styles.galleryRow}>
                {Array.isArray(profileData?.gallery) &&
                  profileData.gallery.length > 0 &&
                  profileData.gallery.map((item: string, index: number) => (
                    <TouchableOpacity
                      key={index}
                      style={
                        index === 0
                          ? styles.largeGalleryItem
                          : styles.smallGalleryItem
                      }
                      onPress={() => {
                        setSelectedIndex(index);
                        setModalVisible(true);
                      }}
                    >
                      <Image
                        source={{ uri: item }}
                        style={styles.galleryImage}
                      />
                      {index === 0 && (
                        <View style={styles.playButton}>
                          <Ionicons
                            name="play"
                            size={20}
                            color={Colors[theme].whiteText}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      <RnModal
        show={modalVisible}
        backDrop={() => setModalVisible(false)}
        backButton={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
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

          <Image
            source={{ uri: profileData?.gallery?.[selectedIndex] }}
            style={styles.modalMainImage}
            resizeMode="contain"
          />

          <FlatList
            data={profileData?.gallery}
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
    </Container>
  );
}
