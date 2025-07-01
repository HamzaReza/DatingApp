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
import { hp } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { FlatList, TouchableOpacity, useColorScheme, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type User = {
  id: string;
  name: string;
  age: number;
  location: string;
  distance: string;
  image: string;
  isNew: boolean;
};

const newUsers: User[] = [
  {
    id: "1",
    name: "Halime",
    age: 18,
    location: "BERLIN",
    distance: "18 km away",
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300",
    isNew: true,
  },
  {
    id: "2",
    name: "Vanessa",
    age: 18,
    location: "MUNICH",
    distance: "14 km away",
    image:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300",
    isNew: true,
  },
  {
    id: "3",
    name: "James",
    age: 20,
    location: "HANOVER",
    distance: "32 km away",
    image:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300",
    isNew: true,
  },
];

const interests = [
  {
    id: "1",
    title: "Football",
    icon: "football-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "2",
    title: "Nature",
    icon: "leaf-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "3",
    title: "Language",
    icon: "chatbubble-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "4",
    title: "Photography",
    icon: "camera-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "5",
    title: "Music",
    icon: "musical-notes-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "6",
    title: "Writing",
    icon: "pencil-outline" as keyof typeof Ionicons.glyphMap,
  },
];

export default function Discover() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const [selectedLocation, setSelectedLocation] = useState("Germany");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "2",
    "5",
  ]);

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
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  return (
    <ScrollContainer>
      <View style={styles.header}>
        <View>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color={Colors[theme].redText} />
            <TouchableOpacity>
              <RnText style={styles.locationText}>{selectedLocation}</RnText>
            </TouchableOpacity>
            <Ionicons
              name="chevron-down"
              size={16}
              color={Colors[theme].redText}
            />
          </View>

          <RnText style={styles.title}>Discover</RnText>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <RoundButton
              iconName="search"
              iconSize={24}
              iconColor={Colors[theme].redText}
              borderColor={Colors[theme].redText}
              onPress={() => console.log("Pressed")}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <RoundButton
              iconName="tune"
              iconSize={24}
              iconColor={Colors[theme].redText}
              borderColor={Colors[theme].redText}
              onPress={() => setFilterModal(true)}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* New Users Section */}
      <View style={styles.section}>
        <FlatList
          data={newUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserCard
              id={item.id}
              name={item.name}
              age={item.age}
              location={item.location}
              distance={item.distance}
              image={item.image}
              isNew={item.isNew}
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
          <RnText style={styles.viewAllText}>View All</RnText>
        </View>

        <View style={styles.interestsContainer}>
          {interests.map((interest) => (
            <InterestTag
              key={interest.id}
              title={interest.title}
              icon={interest.icon}
              isSelected={selectedInterests.includes(interest.id)}
              onPress={() => handleInterestPress(interest.id)}
            />
          ))}
        </View>
      </View>

      {/* Around Me Section */}
      <View style={styles.section}>
        <RnText style={styles.sectionTitle}>Around me</RnText>
        <RnText style={styles.sectionSubtitle}>
          {`People with ${interests
            .filter((item) => selectedInterests.includes(item.id))
            .map((item) => item.title)
            .join(", ")} interest around you`}
        </RnText>

        <View style={styles.aroundMeContainer}>
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map" size={40} color={Colors[theme].redText} />
              <RnText style={styles.mapText}>Map View</RnText>
            </View>

            <View style={styles.userPins}>
              <View style={[styles.userPin, { top: "30%", left: "20%" }]}>
                <View style={styles.pinImage}>
                  <Ionicons
                    name="person"
                    size={16}
                    color={Colors[theme].background}
                  />
                </View>
              </View>
              <View style={styles.connectButton}>
                <RnText style={styles.connectText}>Connect with Clara</RnText>
              </View>
              <View style={[styles.userPin, { top: "60%", right: "25%" }]}>
                <View style={styles.pinImage}>
                  <Ionicons
                    name="person"
                    size={16}
                    color={Colors[theme].background}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
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
