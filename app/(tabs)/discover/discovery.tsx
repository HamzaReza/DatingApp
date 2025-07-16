/* eslint-disable react-hooks/exhaustive-deps */
import createStyles from "@/app/tabStyles/discover.styles";
import InterestTag from "@/components/InterestTag";
import RnButton from "@/components/RnButton";
import RnDropdown from "@/components/RnDropdown";
import RnHeader from "@/components/RnHeader";
import RnModal from "@/components/RnModal";
import ScrollContainer from "@/components/RnScrollContainer";
import RnSlider from "@/components/RnSlider";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import UserCard from "@/components/UserCard";
import { Colors } from "@/constants/Colors";
import {
  alcoholPreferenceOptions,
  casualDatingAndMatrimonyOptions,
  heightOptions,
  hobbiesOptions,
  interestMatchOptions,
  locationOptions,
  maritalStatusOptions,
  relationshipIntentOptions,
  smokingPreferenceOptions,
} from "@/constants/FilterOptions";
import { fetchAllUsers, getNearbyUsers, getUserLocation } from "@/firebase/auth";
import {
  setDeviceLocation,
  setLocationPermissionGranted,
} from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { encodeImagePath, hp } from "@/utils";
import { requestLocationPermission } from "@/utils/Permission";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";

type UsersList = {
  id: string;
  name?: string;
  age?: number;
  distance?: string;
  photo?: string;
  isNew: boolean;
  uid?: string;
  interests?: string;
  location?: {
    _latitude: number;
    _longitude: number;
  };
};

const interests = [
  { id: "reading", label: "Reading", icon: "📚" },
  { id: "photography", label: "Photography", icon: "📸" },
  { id: "gaming", label: "Gaming", icon: "🎮" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "travel", label: "Travel", icon: "✈️" },
  { id: "painting", label: "Painting", icon: "🎨" },
  { id: "politics", label: "Politics", icon: "👥" },
  { id: "charity", label: "Charity", icon: "❤️" },
  { id: "cooking", label: "Cooking", icon: "🍳" },
  { id: "pets", label: "Pets", icon: "🐾" },
  { id: "sports", label: "Sports", icon: "⚽" },
  { id: "fashion", label: "Fashion", icon: "👔" },
];

export default function Discover() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const dispatch = useDispatch();
  const [usersList, setUsersList] = useState(Array<UsersList>);
  const [filteredUsers, setFilteredUsers] = useState<UsersList[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showAllInterests, setShowAllInterests] = useState(false);
  const [currentUserLocation,setCurrentUserLocation] = useState({})
  const displayedInterests = showAllInterests
    ? interests
    : interests.slice(0, 6);
    const [isLocationLoaded, setIsLocationLoaded] = useState(false);


 useEffect(() => {
  const fetchNearby = async () => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) return;

    const currentLoc = await getUserLocation(userId); 
    if (currentLoc) {
      setCurrentUserLocation(currentLoc); 
      const nearby = await getNearbyUsers(currentLoc);
      setUsersList(nearby); 
    }
  };

 
  fetchNearby();

  const interval = setInterval(fetchNearby, 30000);

  return () => clearInterval(interval); 
}, []);

const fetchUserLocation = async () => {
    const userId = getAuth().currentUser?.uid;
    if (userId) {
      const userLocation = await getUserLocation(userId);  
      setCurrentUserLocation(userLocation)
      setIsLocationLoaded(true)
    }
  };


  useEffect(() => {
    getUsers();
  }, [selectedInterests]);

  const getUsers = async () => {
    try {
      const users = (await fetchAllUsers()) as UsersList[];

      setUsersList(users);

      const filtered = users.filter(user =>
        user.interests
          ?.split(",")
          .some((interest: string) => selectedInterests.includes(interest))
      );

      setFilteredUsers(filtered);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };


  const { deviceLocation, locationPermissionGranted } = useSelector(
    (state: RootState) => state.user
  );


  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationDropdownItems, setLocationDropdownItems] =
    useState(locationOptions);
  const [locationDropdownValue, setLocationDropdownValue] = useState("germany");

  const [filterModal, setFilterModal] = useState(false);

  const [age, setAge] = useState<number>(21);
  const [distance, setDistance] = useState<number>(10);

  const [heightOpen, setHeightOpen] = useState(false);
  const [heightItems, setHeightItems] = useState(heightOptions);
  const [heightValue, setHeightValue] = useState("");

  const [maritalStatusOpen, setMaritalStatusOpen] = useState(false);
  const [maritalStatusItems, setMaritalStatusItems] =
    useState(maritalStatusOptions);
  const [maritalStatusValue, setMaritalStatusValue] = useState("");

  const [locationOpen, setLocationOpen] = useState(false);
  const [locationItems, setLocationItems] = useState(locationOptions);
  const [locationValue, setLocationValue] = useState("");

  const [interestMatchOpen, setInterestMatchOpen] = useState(false);
  const [interestMatchItems, setInterestMatchItems] =
    useState(interestMatchOptions);
  const [interestMatchValue, setInterestMatchValue] = useState("");

  const [hobbiesOpen, setHobbiesOpen] = useState(false);
  const [hobbiesItems, setHobbiesItems] = useState(hobbiesOptions);
  const [hobbiesValue, setHobbiesValue] = useState("");

  const [alcoholPreferenceOpen, setAlcoholPreferenceOpen] = useState(false);
  const [alcoholPreferenceItems, setAlcoholPreferenceItems] = useState(
    alcoholPreferenceOptions
  );
  const [alcoholPreferenceValue, setAlcoholPreferenceValue] = useState("");

  const [smokingPreferenceOpen, setSmokingPreferenceOpen] = useState(false);
  const [smokingPreferenceItems, setSmokingPreferenceItems] = useState(
    smokingPreferenceOptions
  );
  const [smokingPreferenceValue, setSmokingPreferenceValue] = useState("");

  const [relationshipIntentOpen, setRelationshipIntentOpen] = useState(false);
  const [relationshipIntentItems, setRelationshipIntentItems] = useState(
    relationshipIntentOptions
  );
  const [relationshipIntentValue, setRelationshipIntentValue] = useState("");

  const [casualDatingAndMatrimonyOpen, setCasualDatingAndMatrimonyOpen] =
    useState(false);
  const [casualDatingAndMatrimonyItems, setCasualDatingAndMatrimonyItems] =
    useState(casualDatingAndMatrimonyOptions);
  const [casualDatingAndMatrimonyValue, setCasualDatingAndMatrimonyValue] =
    useState("");

  const handleInterestPress = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

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


  return (
    <ScrollContainer>
      <View style={styles.header}>
        <View>
          <RnDropdown
            open={locationDropdownOpen}
            items={locationDropdownItems}
            value={locationDropdownValue}
            setOpen={setLocationDropdownOpen}
            setItems={setLocationDropdownItems}
            setValue={setLocationDropdownValue}
            placeholder="Location"
            style={styles.locationDropdown}
            dropdownText={styles.locationDropdownText}
          />
        </View>
        <RnText style={styles.title}>Discover</RnText>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <RoundButton
              iconName="search"
              iconSize={24}
              iconColor={Colors[theme].primary}
              backgroundColour={Colors[theme].whiteText}
              onPress={() => console.log("Pressed")}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <RoundButton
              iconName="tune"
              iconSize={24}
              iconColor={Colors[theme].primary}
              backgroundColour={Colors[theme].whiteText}
              onPress={() => setFilterModal(true)}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* New Users Section */}
      <View style={styles.section}>
        <FlatList
          data={usersList}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <UserCard
              id={item.id}
              name={item.name || ""}
              age={item.age || 0}
              location={
                item.location
                  ? `${item.location._latitude}, ${item.location._longitude}`
                  : ""
              }
              distance={item.distance || ""}
              image={encodeImagePath(item.photo || "")}
              isNew={item.isNew}
              onPress={() => router.push(`/discover/${item.uid || item.id}`)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.usersList}
        />
      </View>

      {/* Interests Section */}
      <View style={styles.section}>
        <View style={styles.subHeadContainer}>
          <RnText style={styles.sectionTitle}>Interests</RnText>
          <RnText
            style={styles.viewAllText}
            onPress={() => setShowAllInterests(!showAllInterests)}
          >
            {showAllInterests ? "Show Less" : "View All"}
          </RnText>
        </View>

        <View style={styles.interestsContainer}>
          {interests.map(interest => (
            <InterestTag
              key={interest.id}
              title={interest.label}
              icon={interest.icon}
              isSelected={selectedInterests.includes(interest.id)}
              onPress={() => handleInterestPress(interest.id)}
            />
          ))}
        </View>
        <View style={styles.interestsContainer}>
          {displayedInterests.map(interest => (
            <InterestTag
              key={interest.id}
              title={interest.label}
              icon={interest.icon}
              isSelected={selectedInterests.includes(interest.id)}
              onPress={() => handleInterestPress(interest.id)}
            />
          ))}
        </View>
      </View>

      {/* Around Me Section */}
      <View style={[styles.section, { marginBottom: hp(12) }]}>
        <View style={styles.subHeadContainer}>
          <RnText style={styles.sectionTitle}>Around me</RnText>
        </View>
        <RnText style={styles.sectionSubtitle}>
          People
          {selectedInterests.length > 0
            ? ` with interest in ${interests
                .filter(item => selectedInterests.includes(item.id))
                .map(item => item.label)
                .join(", ")}`
            : ""}{" "}
          around you
        </RnText>

      {locationPermissionGranted && isLocationLoaded ? (
<MapView
  style={styles.map}
  initialRegion={{
    latitude: currentUserLocation.latitude,
    longitude: currentUserLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }}
  provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
  showsUserLocation={true}
  showsMyLocationButton={true}
>
  {usersList.map((user, index) => {
    const lat = parseFloat(user.location?.latitude || user.location?._latitude);
    const lng = parseFloat(user.location?.longitude || user.location?._longitude);

    if (!lat || !lng || user.uid === getAuth().currentUser?.uid) return null;

    return (
      <Marker
        key={user.id || index}
        coordinate={{ latitude: lat, longitude: lng }}
        title={user.name}
      >
        <Image
          source={{ uri: encodeImagePath(user.photo || "") }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: "#fff",
          }}
          resizeMode="cover"
        />
      </Marker>
    );
  })}
</MapView>

) : (
  <View
    style={[
      styles.map,
      styles.getLocationContainer,
      { justifyContent: "center" },
    ]}
  >
    <RnButton
      title="Get Location"
      onPress={() => getCurrentLocation()}
      style={[styles.getLocationButton, styles.getLocationButtonText]}
    />
  </View>
)}

      </View>

      <RnModal show={filterModal} backButton={() => setFilterModal(false)}>
        <LinearGradient
          colors={["#FECFD2", "#C2FFEA"]}
          style={styles.filterModalContainer}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ maxHeight: hp(80) }}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <RnHeader
              centerText="Filter Options"
              centerTextStyle={styles.filterHeaderText}
              leftComponent={
                <TouchableOpacity onPress={() => setFilterModal(false)}>
                  <Ionicons
                    name="arrow-back"
                    size={28}
                    color={Colors[theme].redText}
                  />
                </TouchableOpacity>
              }
              rightComponent={
                <TouchableOpacity onPress={() => setFilterModal(false)}>
                  <Ionicons
                    name="refresh"
                    size={28}
                    color={Colors[theme].redText}
                  />
                </TouchableOpacity>
              }
              leftContainerStyle={{ marginHorizontal: 0 }}
              rightContainerStyle={{ marginHorizontal: 0 }}
              containerStyle={{ backgroundColor: "transparent" }}
            />

            <RnText style={styles.filterHeaderSubText}>
              Manage and set your preferences to find the best matches for you,
              keep enjoying!
            </RnText>

            <View style={styles.rowContainer}>
              <RnText style={styles.modalOptionText}>Age</RnText>
              <RnText style={styles.modalOptionText}>{`${age} years`}</RnText>
            </View>
            <RnSlider
              value={age}
              onValueChange={setAge}
              minimumValue={16}
              maximumValue={60}
              step={1}
              style={styles.filterSlider}
            />

            <RnText style={styles.modalOptionText}>Height</RnText>
            <RnDropdown
              open={heightOpen}
              items={heightItems}
              value={heightValue}
              setOpen={setHeightOpen}
              setItems={setHeightItems}
              setValue={setHeightValue}
              placeholder="Select height"
              style={styles.filterInput}
              zIndex={8000}
              zIndexInverse={1000}
            />

            <RnText style={styles.modalOptionText}>Marital Status</RnText>
            <RnDropdown
              open={maritalStatusOpen}
              items={maritalStatusItems}
              value={maritalStatusValue}
              setOpen={setMaritalStatusOpen}
              setItems={setMaritalStatusItems}
              setValue={setMaritalStatusValue}
              placeholder="Select marital status"
              style={styles.filterInput}
              zIndex={7000}
              zIndexInverse={2000}
            />

            <RnText style={styles.modalOptionText}>Location</RnText>
            <RnDropdown
              open={locationOpen}
              items={locationItems}
              value={locationValue}
              setOpen={setLocationOpen}
              setItems={setLocationItems}
              setValue={setLocationValue}
              placeholder="Select location"
              style={styles.filterInput}
              zIndex={6000}
              zIndexInverse={3000}
            />

            <View style={styles.rowContainer}>
              <RnText style={styles.modalOptionText}>
                Distance Range (0-10 km)
              </RnText>
              <RnText style={styles.modalOptionText}>{`${distance} km`}</RnText>
            </View>
            <RnSlider
              value={distance}
              onValueChange={setDistance}
              minimumValue={1}
              maximumValue={10}
              step={1}
              style={styles.filterSlider}
            />

            <RnText style={styles.modalOptionText}>Interest Match</RnText>
            <RnDropdown
              open={interestMatchOpen}
              items={interestMatchItems}
              value={interestMatchValue}
              setOpen={setInterestMatchOpen}
              setItems={setInterestMatchItems}
              setValue={setInterestMatchValue}
              placeholder="Select interest match"
              style={styles.filterInput}
              zIndex={5000}
              zIndexInverse={4000}
            />

            <RnText style={styles.modalOptionText}>Hobbies</RnText>
            <RnDropdown
              open={hobbiesOpen}
              items={hobbiesItems}
              value={hobbiesValue}
              setOpen={setHobbiesOpen}
              setItems={setHobbiesItems}
              setValue={setHobbiesValue}
              placeholder="Select hobbies"
              style={styles.filterInput}
              zIndex={4000}
              zIndexInverse={5000}
            />

            <RnText style={styles.modalOptionText}>Alcohol Preference</RnText>
            <RnDropdown
              open={alcoholPreferenceOpen}
              items={alcoholPreferenceItems}
              value={alcoholPreferenceValue}
              setOpen={setAlcoholPreferenceOpen}
              setItems={setAlcoholPreferenceItems}
              setValue={setAlcoholPreferenceValue}
              placeholder="Select alcohol preference"
              style={styles.filterInput}
              zIndex={3000}
              zIndexInverse={6000}
            />

            <RnText style={styles.modalOptionText}>Smoking Preference</RnText>
            <RnDropdown
              open={smokingPreferenceOpen}
              items={smokingPreferenceItems}
              value={smokingPreferenceValue}
              setOpen={setSmokingPreferenceOpen}
              setItems={setSmokingPreferenceItems}
              setValue={setSmokingPreferenceValue}
              placeholder="Select smoking preference"
              style={styles.filterInput}
              zIndex={2000}
              zIndexInverse={7000}
            />

            <RnText style={styles.modalOptionText}>Relationship Intent</RnText>
            <RnDropdown
              open={relationshipIntentOpen}
              items={relationshipIntentItems}
              value={relationshipIntentValue}
              setOpen={setRelationshipIntentOpen}
              setItems={setRelationshipIntentItems}
              setValue={setRelationshipIntentValue}
              placeholder="Select relationship intent"
              style={styles.filterInput}
              zIndex={1000}
              zIndexInverse={8000}
            />

            <RnText style={styles.modalOptionText}>
              Casual Dating And Matrimony
            </RnText>
            <RnDropdown
              open={casualDatingAndMatrimonyOpen}
              items={casualDatingAndMatrimonyItems}
              value={casualDatingAndMatrimonyValue}
              setOpen={setCasualDatingAndMatrimonyOpen}
              setItems={setCasualDatingAndMatrimonyItems}
              setValue={setCasualDatingAndMatrimonyValue}
              placeholder="Select preference"
              style={styles.filterInput}
              zIndex={900}
              zIndexInverse={8100}
            />

            <RnButton
              title="Apply Filter"
              style={[styles.applyFilterButton]}
              onPress={() => setFilterModal(false)}
            />
          </KeyboardAwareScrollView>
        </LinearGradient>
      </RnModal>
    </ScrollContainer>
  );
}
