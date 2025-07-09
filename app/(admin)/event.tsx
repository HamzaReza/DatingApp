import createStyles from "@/app/adminStyles/event.styles";
import RnBottomSheet from "@/components/RnBottomSheet";
import RnButton from "@/components/RnButton";
import RnContainer from "@/components/RnContainer";
import RnDateTimePicker from "@/components/RnDateTimePicker";
import RnDropdown from "@/components/RnDropdown";
import RnInput from "@/components/RnInput";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { uploadImage } from "@/firebase/auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AdminEvent } from "@/types/Admin";
import { hp, wp } from "@/utils";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { FlatList, Image, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Yup from "yup";
import {
  addCreator,
  createEvent,
  fetchCreators,
  fetchEvents,
} from "../../firebase/adminFunctions";

// Validation schema
const EventSchema = Yup.object().shape({
  eventName: Yup.string().required("Event name is required"),
  eventLocation: Yup.string().required("Event location is required"),
  eventPrice: Yup.number()
    .positive("Price must be positive")
    .required("Event price is required"),
  eventGenre: Yup.string().required("Event genre is required"),
  eventDate: Yup.date().required("Event date is required"),
  eventTime: Yup.date().required("Event time is required"),
});

// Genre options
const genreOptions = [
  { label: "Music", value: "music" },
  { label: "Sports", value: "sports" },
  { label: "Theater", value: "theater" },
  { label: "Comedy", value: "comedy" },
  { label: "Technology", value: "technology" },
  { label: "Business", value: "business" },
  { label: "Education", value: "education" },
  { label: "Other", value: "other" },
];

export default function AdminEventTicketScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [creatorDropdownItems, setCreatorDropdownItems] = useState<any[]>([]);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState("");
  const [isNewCreator, setIsNewCreator] = useState(false);
  const [newCreatorName, setNewCreatorName] = useState("");
  const [newCreatorImage, setNewCreatorImage] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [genreOpen, setGenreOpen] = useState(false);
  const [genreItems, setGenreItems] = useState(genreOptions);

   useEffect(() => {
    loadEvents();
    loadCreators();
  }, []);

  const loadEvents = async () => {
    const fetched = await fetchEvents();
    setEvents(fetched);
  };

  const loadCreators = async () => {
    const fetched = await fetchCreators();
    setCreators(fetched);
    setCreatorDropdownItems(
      fetched.map((c: any) => ({ label: c.name, value: c.id, key: c.id }))
    );
  };

 const handleSaveNewCreator = async () => {
    let imageUrl = "";
    if (newCreatorImage) imageUrl = await uploadImage(newCreatorImage, "creator", "profile");

    const id = await addCreator({ name: newCreatorName, image: imageUrl });
    const updated = [...creators, { id, name: newCreatorName, image: imageUrl }];

    setCreators(updated);
    setCreatorDropdownItems(updated.map((c) => ({ label: c.name, value: c.id, key: c.id })));
    setSelectedCreatorId(id);
    setIsNewCreator(false);
    setNewCreatorName("");
    setNewCreatorImage("");
  };

  
  const renderTicketCard = ({ item: event }: { item: AdminEvent }) => {
    return (
      <View style={styles.ticketCardWrapper}>
        <View style={styles.ticketCard}>
          <RnText style={styles.eventTitle}>{event.name}</RnText>
          <View style={styles.rowWrap}>
            <View>
              <RnText style={styles.label}>Date</RnText>
              <RnText style={styles.value}>{event.date}</RnText>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <RnText style={styles.label}>Time</RnText>
              <RnText style={styles.value}>{event.time}</RnText>
            </View>
          </View>
          <View style={styles.rowWrap}>
            <View>
              <RnText style={styles.label}>Genre</RnText>
              <RnText style={styles.value}>
                {event.genre.charAt(0).toUpperCase() + event.genre.slice(1)}
              </RnText>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <RnText style={styles.label}>Seat</RnText>
              <RnText style={styles.value}>{event.seat}</RnText>
            </View>
          </View>
          <View>
            <RnText style={styles.label}>Venue</RnText>
            <RnText style={styles.value}>{event.venue}</RnText>
          </View>
          <View style={styles.dashedLine} />
          <View style={styles.priceContainer}>
            <RnText style={styles.priceText}>Price: ₹{event.price}</RnText>
          </View>
          <QRCode
            value={event.id + "-" + event.name}
            size={hp(20)}
            logo={require("@/assets/images/react-logo.png")}
          />
        </View>
      </View>
    );
  };

  const handleCreateEvent = () => {
    setIsBottomSheetVisible(true);
    setIsNewCreator(false);
    setSelectedCreatorId("");
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };

 const handleSubmitEvent = async (values: any) => {
    const imageUrl = eventImage ? await uploadImage(eventImage, "event", "gallery") : "";
    const creator = creators.find((c) => c.id === selectedCreatorId);

    await createEvent({
      name: values.eventName,
      venue: values.eventLocation,
      price: parseFloat(values.eventPrice),
      creatorName: creator?.name || "Unknown",
      genre: values.eventGenre,
      date: values.eventDate,
      time: values.eventTime,
      image: imageUrl,
    });

    loadEvents();
    handleCloseBottomSheet();
  };



  const pickImage = async (setter: (uri: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled) setter(result.assets[0].uri);
  };

  return (
    <RnContainer>
      <RnText style={styles.headerTitle}>Event</RnText>
      <View>
        <FlatList
          data={events}
          renderItem={renderTicketCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.formSeparator} />}
          snapToInterval={wp(90) + wp(1)}
          decelerationRate="fast"
          snapToAlignment="start"
        />
      </View>
      <RnButton
        title="Create an Event"
        style={styles.createBtn}
        onPress={handleCreateEvent}
      />

      <RnBottomSheet
        isVisible={isBottomSheetVisible}
        onClose={handleCloseBottomSheet}
        enableDynamicSizing
      >
        <ScrollContainer customStyle={styles.formScrollView}>
          <View style={styles.formContainer}>
            <RnText style={styles.formTitle}>Create New Event</RnText>
            <RnButton
  title={eventImage ? "Change Event Image" : "Pick Event Image"}
  onPress={async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setEventImage(result.assets[0].uri);
    }
  }}
  style={styles.smallBtn}
/>

{eventImage ? (
  <Image source={{ uri: eventImage }} style={{ width: 100, height: 100, marginVertical: 10 }} />
) : null}

            <Formik
              initialValues={{
                eventName: "",
                eventLocation: "",
                eventPrice: "",
                eventGenre: "",
                eventDate: new Date(),
                eventTime: new Date(),
              }}
              validationSchema={EventSchema}
              onSubmit={handleSubmitEvent}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                setFieldValue,
              }) => (
                <View>
                  <RnInput
                    placeholder="Event Name"
                    value={values.eventName}
                    onChangeText={handleChange("eventName")}
                    onBlur={handleBlur("eventName")}
                    error={errors.eventName}
                  />
                  <RnInput
                    placeholder="Location"
                    value={values.eventLocation}
                    onChangeText={handleChange("eventLocation")}
                    onBlur={handleBlur("eventLocation")}
                    error={errors.eventLocation}
                  />
                  <RnInput
                    placeholder="Price"
                    value={values.eventPrice}
                    onChangeText={handleChange("eventPrice")}
                    onBlur={handleBlur("eventPrice")}
                    keyboardType="numeric"
                    error={errors.eventPrice}
                  />

                  {!isNewCreator ? (
                    <>
                      <RnDropdown
                        open={creatorOpen}
                        value={selectedCreatorId}
                        items={creatorDropdownItems}
                        setOpen={setCreatorOpen}
                        setValue={setSelectedCreatorId}
                        setItems={setCreatorDropdownItems}
                        placeholder="Select Creator"
                      />
                      <RnButton
                        title="Add New Creator"
                        onPress={() => setIsNewCreator(true)}
                        style={styles.smallBtn}
                      />
                    </>
                  ) : (
                    <>
                      <RnInput
                        placeholder="Creator Name"
                        value={newCreatorName}
                        onChangeText={setNewCreatorName}
                      />
                      <RnButton
                        title={newCreatorImage ? "Change Image" : "Pick Image"}
                        onPress={pickImage}
                        style={styles.smallBtn}
                      />
                      {newCreatorImage ? (
                        <Image
                          source={{ uri: newCreatorImage }}
                          style={{
                            width: 100,
                            height: 100,
                            marginVertical: 10,
                          }}
                        />
                      ) : null}

                      <RnButton
                        title="Save Creator"
                        onPress={handleSaveNewCreator}
                        style={styles.smallBtn}
                      />
                      <RnButton
                        title="Cancel"
                        onPress={() => setIsNewCreator(false)}
                        style={styles.secondaryButton}
                      />
                    </>
                  )}

                  <RnDropdown
                    open={genreOpen}
                    items={genreItems}
                    value={values.eventGenre}
                    setOpen={setGenreOpen}
                    setItems={setGenreItems}
                    setValue={(value) => setFieldValue("eventGenre", value())}
                    placeholder="Select Genre"
                  />

                  <View style={styles.formRowContainer}>
                    <View
                      style={[styles.formHalfField, styles.formHalfFieldLeft]}
                    >
                      <RnDateTimePicker
                        value={values.eventDate}
                        onChange={(e, date) =>
                          date && setFieldValue("eventDate", date)
                        }
                        mode="date"
                        placeholder="Select Date"
                        error={errors.eventDate as string}
                      />
                    </View>
                    <View
                      style={[styles.formHalfField, styles.formHalfFieldRight]}
                    >
                      <RnDateTimePicker
                        value={values.eventTime}
                        onChange={(e, time) =>
                          time && setFieldValue("eventTime", time)
                        }
                        mode="time"
                        placeholder="Select Time"
                        error={errors.eventTime as string}
                      />
                    </View>
                  </View>

                  <RnButton
                    title="Create Event"
                    style={styles.modalCreateBtn}
                    onPress={handleSubmit}
                  />
                </View>
              )}
            </Formik>
          </View>
        </ScrollContainer>
      </RnBottomSheet>
    </RnContainer>
  );
}
