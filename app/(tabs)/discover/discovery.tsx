import createStyles from "@/app/tabStyles/discover.styles";
import InterestTag from "@/components/InterestTag";
import RnBottomSheet from "@/components/RnBottomSheet";
import RnButton from "@/components/RnButton";
import RnDropdown from "@/components/RnDropdown";
import RnHeader from "@/components/RnHeader";
import ScrollContainer from "@/components/RnScrollContainer";
import RnSlider from "@/components/RnSlider";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import UserCard from "@/components/UserCard";
import { Colors } from "@/constants/Colors";
import {
  alcoholPreferenceOptions,
  heightOptions,
  interestMatchOptions,
  locationOptions,
  maritalStatusOptions,
  relationshipIntentOptions,
  smokingPreferenceOptions,
} from "@/constants/FilterOptions";
import { fetchAllUsers, fetchTags } from "@/firebase/auth";
import {
  setDeviceLocation,
  setLocationPermissionGranted,
} from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { encodeImagePath, hp } from "@/utils";
import getDistanceFromLatLonInMeters from "@/utils/Distance";
import { filterUsers } from "@/utils/Filter";
import { requestLocationPermission } from "@/utils/Permission";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
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
    latitude: number;
    longitude: number;
  };
};

type Tag = {
  id: string;
  label: string;
  iconSvg: string;
};

export default function Discover() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const dispatch = useDispatch();
  const [usersList, setUsersList] = useState<UsersList[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UsersList[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showAllInterests, setShowAllInterests] = useState(false);
  const [interests, setInterests] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  const {
    deviceLocation,
    locationPermissionGranted,
    user: currentUser,
  } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const unsubscribe = fetchTags(tagsArray => {
      setInterests(tagsArray);
      setIsLoadingTags(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = fetchAllUsers((users: UsersList[]) => {
      const usersWithoutCurrentUser = users.filter(
        user => user.id !== currentUser?.uid
      );

      setUsersList(usersWithoutCurrentUser);
      setFilteredUsers(usersWithoutCurrentUser);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser?.uid]);

  const displayedInterests = showAllInterests
    ? interests
    : interests.slice(0, 6);

  // Filter users based on selected interests
  useEffect(() => {
    if (usersList.length === 0) return;

    if (selectedInterests.length === 0) {
      setFilteredUsers(usersList);
      return;
    }

    const filtered = usersList.filter(user => {
      const userInterests =
        user.interests?.split(",").map(i => i.trim().toLowerCase()) || [];

      const hasAllSelectedInterests = selectedInterests.every(
        (selectedInterest: string) =>
          userInterests.includes(selectedInterest.toLowerCase())
      );

      return hasAllSelectedInterests;
    });

    setFilteredUsers(filtered);
  }, [selectedInterests, usersList]);

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

  const handleInterestPress = (label: string) => {
    setSelectedInterests(prev => {
      const newSelection = prev.includes(label)
        ? prev.filter(id => id !== label)
        : [...prev, label];
      return newSelection;
    });
  };

  const getCurrentLocation = async () => {
    try {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted) {
        dispatch(setLocationPermissionGranted(true));
        const location = await Location.getCurrentPositionAsync({});
        dispatch(setDeviceLocation(location));
      } else {
        dispatch(setLocationPermissionGranted(false));
      }
    } catch (error) {
      console.error("Error getting location:", error);
      dispatch(setLocationPermissionGranted(false));
    }
  };

  const applyFilters = () => {
    const filtered = filterUsers({
      currentUser,
      users: usersList,
      age,
      height: heightValue,
      maritalStatus: maritalStatusValue,
      location: locationValue,
      distance,
      interests: interestMatchValue, // This should be a range string like "0-100"
      alcoholPreference: alcoholPreferenceValue,
      smokingPreference: smokingPreferenceValue,
      relationshipIntent: relationshipIntentValue,
      deviceLocation: deviceLocation?.coords && {
        latitude: deviceLocation.coords.latitude,
        longitude: deviceLocation.coords.longitude,
      },
    });

    setFilteredUsers(filtered);
    setFilterModal(false);
  };

  return (
    <ScrollContainer>
      <View style={styles.header}>
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

      <View style={styles.section}>
        <FlatList
          data={filteredUsers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            let calculatedDistance: number | undefined;
            if (
              deviceLocation?.coords &&
              item.location?.latitude &&
              item.location?.longitude
            ) {
              calculatedDistance = getDistanceFromLatLonInMeters(
                deviceLocation.coords.latitude,
                deviceLocation.coords.longitude,
                item.location.latitude,
                item.location.longitude
              );
            }

            return (
              <UserCard
                id={item.id}
                name={item.name || ""}
                age={item.age || 0}
                image={encodeImagePath(item.photo || "")}
                isNew={item.isNew}
                distance={calculatedDistance}
                onPress={() =>
                  router.push({
                    pathname: "/discover/[id]",
                    params: { id: item.uid as string, isFriend: "false" },
                  })
                }
              />
            );
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.usersList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <RnText style={styles.emptyText}>No users found</RnText>
            </View>
          }
        />
      </View>

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
          {isLoadingTags ? (
            <RnText style={styles.sectionSubtitle}>Loading interests...</RnText>
          ) : (
            displayedInterests.map(interest => (
              <InterestTag
                key={interest.id}
                title={interest.label}
                icon={interest.iconSvg}
                isSelected={selectedInterests.includes(
                  interest.label.toLowerCase()
                )}
                onPress={() =>
                  handleInterestPress(interest.label.toLowerCase())
                }
              />
            ))
          )}
        </View>
      </View>

      <View style={[styles.section, { marginBottom: hp(12) }]}>
        <View style={styles.subHeadContainer}>
          <RnText style={styles.sectionTitle}>Around me</RnText>
        </View>
        <RnText style={styles.sectionSubtitle}>
          People
          {selectedInterests.length > 0
            ? ` with interest in ${interests
                .filter(item =>
                  selectedInterests.includes(item.label.toLowerCase())
                )
                .map(item => item.label)
                .join(", ")}`
            : ""}{" "}
          around you
        </RnText>

        {locationPermissionGranted ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: deviceLocation?.coords.latitude || 37.7749,
              longitude: deviceLocation?.coords.longitude || -122.4194,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={locationPermissionGranted}
            showsMyLocationButton={locationPermissionGranted}
          >
            {usersList.map((user, index) => {
              const lat = user.location?.latitude;
              const lng = user.location?.longitude;

              if (!lat || !lng) return null;

              return (
                <Marker
                  key={user.id || index}
                  coordinate={{ latitude: lat, longitude: lng }}
                  title={user.name}
                >
                  <Image
                    source={{ uri: encodeImagePath(user.photo || "") }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
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

      <RnBottomSheet
        isVisible={filterModal}
        onClose={() => setFilterModal(false)}
        scroll={true}
        snapPoints={["85%"]}
        backgroundStyle={{
          backgroundColor: "transparent",
        }}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        pressBehavior={"none"}
      >
        <LinearGradient
          colors={["#FECFD2", "#C2FFEA"]}
          style={styles.filterModalContainer}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <RnHeader
              centerText="Filter Options"
              centerTextStyle={styles.filterHeaderText}
              leftComponent={
                <TouchableOpacity onPress={() => setFilterModal(false)}>
                  <Ionicons
                    name="close"
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

            <RnButton
              title="Apply Filter"
              style={[styles.applyFilterButton]}
              onPress={applyFilters}
            />
          </KeyboardAwareScrollView>
        </LinearGradient>
      </RnBottomSheet>
    </ScrollContainer>
  );
}
