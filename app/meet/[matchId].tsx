import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { encodeImagePath } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import createStyles from "./styles";

// Custom hooks
import { useMeetingData } from "@/hooks/useMeetData";
import { useMeetingPreferences } from "@/hooks/useMeetPreference";
import { useRejectModal } from "@/hooks/useRejectModal";

// Utility functions
import {
  checkFixedMeetDetails,
  checkIsFirstEntry,
  createFinalMeet,
  handleMutualSelection,
  handleReject,
  saveUserMeetingPreferences,
} from "@/firebase/meet";
import {
  districtPlaces,
  formatDate,
  mockUsers,
  timeSlots,
  validateMeetingForm,
} from "@/helpers/meetHelpers";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function MeetSetupScreen() {
  const { matchId } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "light" ? "light" : "dark";
  const styles = createStyles(theme);
  const { user } = useSelector((state: RootState) => state.user);

  // Custom hooks
  const {
    userData,
    otherUserData,
    otherUserMeet,
    otherUid,
    fixedDetails,
    rejectionStatus,
    loading: dataLoading,
    refreshData,
  } = useMeetingData(matchId as string);

  const {
    selectedPlaces,
    selectedDates,
    selectedTimes,
    showDatePicker,
    togglePlace,
    toggleTimeSlot,
    handleDateSelect,
    setShowDatePicker,
    removeDate,
  } = useMeetingPreferences();

  const { rejectModal, openRejectModal, closeRejectModal, updateReason } =
    useRejectModal();

  // Local state
  const [loading, setLoading] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleConfirm = async () => {
    const validation = validateMeetingForm(
      selectedPlaces,
      selectedDates,
      selectedTimes,
      fixedDetails,
      rejectionStatus
    );

    if (!validation.isValid) {
      Alert.alert("Missing Information", validation.missingFields.join("\n"));
      return;
    }

    if (!user?.uid) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setLoading(true);
    try {
      // Save current user's preferences
      await saveUserMeetingPreferences(
        matchId as string,
        user.uid,
        selectedPlaces,
        selectedDates,
        selectedTimes
      );

      const isFirstEntry = await checkIsFirstEntry(
        matchId as string,
        user.uid,
        otherUid
      );

      if (isFirstEntry) {
        Alert.alert(
          "Preferences Saved",
          "Your preferences have been saved. Please wait for the other person to respond."
        );
        router.back();
        return;
      }

      // Check for mutual selections
      const hasMutual = await handleMutualSelection(
        matchId as string,
        user.uid,
        selectedPlaces,
        selectedDates,
        selectedTimes
      );

      if (hasMutual) {
        const updatedFixedDetails = await checkFixedMeetDetails(
          matchId as string
        );

        if (
          updatedFixedDetails.placeFixed &&
          updatedFixedDetails.dateFixed &&
          updatedFixedDetails.timeFixed
        ) {
          await createFinalMeet(matchId as string);
          Alert.alert("Confirmed", "Mutual match found for all preferences.");
        } else {
          Alert.alert(
            "Saved",
            "Your preferences saved. Waiting for mutual match."
          );
          router.back();
        }
      } else {
        Alert.alert(
          "No Mutual Found",
          "Waiting for the other user to match your preferences.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSubmission = async () => {
    if (!rejectModal.reason.trim()) {
      Alert.alert("Required", "Please enter a reason");
      return;
    }

    if (!user?.uid) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      await handleReject({
        matchId: matchId as string,
        currentUserId: user.uid,
        unavailable: [rejectModal.category],
        reason: rejectModal.reason,
      });

      closeRejectModal();
      await refreshData(); // Refresh the data to update rejection status

      Alert.alert(
        "Preferences Rejected",
        `Marked ${rejectModal.category} as unavailable`
      );
    } catch (error) {
      console.error("Rejection failed:", error);
      Alert.alert("Error", "Failed to save rejection");
    }
  };

  const renderPlace = ({ item }: { item: (typeof districtPlaces)[0] }) => {
    const isSelected = selectedPlaces?.includes(item.name);
    const isMutual = otherUserMeet?.places?.includes(item.name);

    return (
      <TouchableOpacity
        onPress={() => togglePlace(item.name)}
        style={[
          styles.placeCard,
          isSelected && styles.placeCardSelected,
          isMutual && styles.placeCardMutual,
        ]}
      >
        <View
          style={[
            styles.placeIconContainer,
            isSelected && styles.placeIconSelected,
            isMutual && styles.placeIconMutual,
          ]}
        >
          <Ionicons
            name={item.icon as any}
            size={24}
            color={isSelected ? Colors.light.whiteText : Colors.light.primary}
          />
        </View>
        <RnText
          style={[styles.placeText, isSelected && styles.placeTextSelected]}
        >
          {item.name}
        </RnText>
        {isMutual && (
          <View style={styles.mutualBadge}>
            <Ionicons name="heart" size={12} color={Colors.light.whiteText} />
          </View>
        )}
        {isMutual && isSelected && (
          <View style={styles.mutualBadge2}>
            <Ionicons name="heart" size={12} color={Colors.light.whiteText} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderTimeSlot = ({ item }: { item: string }) => {
    const isSelected = selectedTimes?.includes(item);
    const isMutual = otherUserMeet?.times?.includes(item);

    return (
      <TouchableOpacity
        onPress={() => toggleTimeSlot(item)}
        style={[
          styles.timeSlot,
          isSelected && styles.timeSlotSelected,
          isMutual && styles.timeSlotMutual,
        ]}
      >
        <RnText
          style={[styles.timeText, isSelected && styles.timeTextSelected]}
        >
          {item}
        </RnText>
        {isMutual && (
          <View style={styles.mutualIndicator}>
            <Ionicons name="heart" size={10} color={Colors.light.pink} />
          </View>
        )}
        {isMutual && isSelected && (
          <View style={styles.mutualIndicator2}>
            <Ionicons name="heart" size={10} color={Colors.light.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (dataLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <RnText>Loading...</RnText>
        <ActivityIndicator color={Colors[theme].primary} size={"small"} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={Colors.light.blackText}
          />
        </TouchableOpacity>
        <RnText style={styles.headerTitle}>Plan Your Meet</RnText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollContainer customStyle={styles.scrollContent}>
        {/* User Profiles Section */}
        <View style={styles.usersSection}>
          <View style={styles.userProfile}>
            <Image
              source={{ uri: encodeImagePath(userData.photo) }}
              style={styles.userAvatar}
            />
            <RnText style={styles.userName}>
              {mockUsers.currentUser.name}
            </RnText>
          </View>

          <View style={styles.connectLine}>
            <View style={styles.heartIcon}>
              <Ionicons name="heart" size={16} color={Colors.light.pink} />
            </View>
          </View>

          <View style={styles.userProfile}>
            <Image
              source={{ uri: encodeImagePath(otherUserData.photo) }}
              style={styles.userAvatar}
            />
            <RnText style={styles.userName}>{otherUserData.name}</RnText>
          </View>
        </View>

        {/* Other User's Preferences */}
        {otherUserMeet && (
          <View style={styles.preferencesCard}>
            <View style={styles.preferencesHeader}>
              <Ionicons
                name="eye-outline"
                size={20}
                color={Colors.light.primary}
              />
              <RnText style={styles.preferencesTitle}>
                {`${otherUserData.name}'s Preferences`}
              </RnText>
            </View>

            {/* Places Section with Reject Button */}
            {!fixedDetails.placeFixed && (
              <View style={styles.preferenceCategory}>
                <View style={styles.preferenceRow}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={Colors.light.tabIconDefault}
                  />
                  <RnText style={styles.preferenceText}>
                    Places: {otherUserMeet.places?.join(", ")}
                  </RnText>
                </View>
                <TouchableOpacity
                  onPress={() => openRejectModal("places")}
                  style={styles.categoryRejectButton}
                  disabled={rejectionStatus.place}
                >
                  <RnText style={styles.categoryRejectText}>
                    {rejectionStatus.place ? `Rejected` : `Reject All Places`}
                  </RnText>
                </TouchableOpacity>
              </View>
            )}

            {/* Dates Section with Reject Button */}
            {!fixedDetails.dateFixed && (
              <View style={styles.preferenceCategory}>
                <View style={styles.preferenceRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={Colors.light.tabIconDefault}
                  />
                  <RnText style={styles.preferenceText}>
                    Dates: {otherUserMeet.dates?.map(formatDate)?.join(", ")}
                  </RnText>
                </View>
                <TouchableOpacity
                  onPress={() => openRejectModal("dates")}
                  style={styles.categoryRejectButton}
                  disabled={rejectionStatus.date}
                >
                  <RnText style={styles.categoryRejectText}>
                    {rejectionStatus.date ? `Rejected` : `Reject All Dates`}
                  </RnText>
                </TouchableOpacity>
              </View>
            )}

            {/* Times Section with Reject Button */}
            {!fixedDetails.timeFixed && (
              <View style={styles.preferenceCategory}>
                <View style={styles.preferenceRow}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={Colors.light.tabIconDefault}
                  />
                  <RnText style={styles.preferenceText}>
                    Times: {otherUserMeet.times?.join(", ")}
                  </RnText>
                </View>
                <TouchableOpacity
                  onPress={() => openRejectModal("times")}
                  style={styles.categoryRejectButton}
                  disabled={rejectionStatus.time}
                >
                  <RnText style={styles.categoryRejectText}>
                    {rejectionStatus.time ? `Rejected` : `Reject All Times`}
                  </RnText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Places Section */}
        {!fixedDetails.placeFixed && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="location"
                size={20}
                color={Colors.light.primary}
              />
              <RnText style={styles.sectionTitle}>Choose Places</RnText>
            </View>
            <RnText style={styles.sectionSubtitle}>
              {`Select places you'd like to meet. Hearts show mutual interests!`}
            </RnText>

            <FlatList
              data={districtPlaces}
              renderItem={renderPlace}
              keyExtractor={item => item.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.placesGrid}
            />
          </View>
        )}

        {/* Dates Section */}
        {!fixedDetails.dateFixed && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="calendar"
                size={20}
                color={Colors.light.primary}
              />
              <RnText style={styles.sectionTitle}>Available Dates</RnText>
            </View>

            <TouchableOpacity
              style={styles.addDateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={Colors.light.primary}
              />
              <RnText style={styles.addDateText}>Add Available Date</RnText>
            </TouchableOpacity>

            {otherUserMeet?.dates && otherUserMeet?.dates?.length > 0 && (
              <View style={styles.selectedDatesContainer}>
                {otherUserMeet.dates.map((date: string) => (
                  <View
                    key={date}
                    style={[
                      styles.dateChip,
                      { backgroundColor: Colors.light.pink },
                    ]}
                  >
                    <RnText style={styles.dateChipText}>
                      {formatDate(date)}
                    </RnText>
                  </View>
                ))}
              </View>
            )}

            {selectedDates.length > 0 && (
              <View style={styles.selectedDatesContainer}>
                {selectedDates?.map(date => (
                  <View key={date} style={styles.dateChip}>
                    <RnText style={styles.dateChipText}>
                      {formatDate(date)}
                    </RnText>
                    <TouchableOpacity onPress={() => removeDate(date)}>
                      <Ionicons
                        name="close-circle"
                        size={16}
                        color={Colors.light.tabIconDefault}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Time Slots Section */}
        {!fixedDetails.timeFixed && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={20} color={Colors.light.primary} />
              <RnText style={styles.sectionTitle}>Preferred Times</RnText>
            </View>
            <RnText style={styles.sectionSubtitle}>
              Select your available time slots
            </RnText>

            <FlatList
              data={timeSlots}
              renderItem={renderTimeSlot}
              keyExtractor={item => item}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.timeSlotsGrid}
            />
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="sync" size={20} color={Colors.light.whiteText} />
              <RnText style={styles.submitButtonText}>Submitting...</RnText>
            </View>
          ) : (
            <>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={Colors.light.whiteText}
              />
              <RnText style={styles.submitButtonText}>
                Submit Preferences
              </RnText>
            </>
          )}
        </TouchableOpacity>
      </ScrollContainer>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateSelect}
          minimumDate={new Date()}
        />
      )}

      {/* Reject Modal */}
      {rejectModal.visible && (
        <View style={styles.rejectModalContainer}>
          <View style={styles.rejectModalContent}>
            <RnText style={styles.rejectModalTitle}>
              Reject{" "}
              {rejectModal.category.charAt(0).toUpperCase() +
                rejectModal.category.slice(1)}
            </RnText>

            <RnText style={styles.rejectModalSubtitle}>
              Please specify the reason for rejection:
            </RnText>

            <TextInput
              style={styles.reasonInput}
              placeholder="e.g. Not available, too far, etc."
              value={rejectModal.reason}
              onChangeText={updateReason}
              multiline
            />

            <View style={styles.rejectModalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeRejectModal}
              >
                <RnText style={styles.cancelButtonText}>Cancel</RnText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitRejectButton}
                onPress={handleRejectSubmission}
              >
                <RnText style={styles.submitRejectButtonText}>
                  Submit Rejection
                </RnText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
