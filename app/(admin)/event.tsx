import createStyles from "@/app/adminStyles/event.styles";
import RnBottomSheet from "@/components/RnBottomSheet";
import RnButton from "@/components/RnButton";
import RnContainer from "@/components/RnContainer";
import RnDateTimePicker from "@/components/RnDateTimePicker";
import RnDropdown from "@/components/RnDropdown";
import RnInput from "@/components/RnInput";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { Borders } from "@/constants/Borders";
import {
  addCreator,
  createEvent,
  fetchCreators,
  fetchEvents,
} from "@/firebase/admin";
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

// Validation schema
const eventValidationSchema = Yup.object().shape({
  eventName: Yup.string().required("Event name is required"),
  eventLocation: Yup.string().required("Event location is required"),
  eventPrice: Yup.number().required("Event price is required"),
  normalTicket: Yup.number().required("Normal ticket is required"),
  vipTicket: Yup.number().required("VIP ticket is required"),
  eventGenre: Yup.string().required("Event genre is required"),
  eventDate: Yup.date().required("Event date is required"),
  eventTime: Yup.date().required("Event time is required"),
  eventCreator: Yup.string().required("Event creator is required"),
  eventImage: Yup.string().required("Event image is required"),
});

const creatorValidationSchema = Yup.object().shape({
  creatorName: Yup.string().required("Creator name is required"),
  creatorImage: Yup.string().required("Creator image is required"),
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
  const [isEventSheetVisible, setIsEventSheetVisible] = useState(false);
  const [isCreatorSheetVisible, setIsCreatorSheetVisible] = useState(false);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [creatorItems, setCreatorItems] = useState<any[]>([]);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [genreItems, setGenreItems] = useState(genreOptions);
  const [creatorLoader, setCreatorLoader] = useState(false);
  const [eventLoader, setEventLoader] = useState(false);

  useEffect(() => {
    const unsubscribeEvents = fetchEvents(eventsData => {
      setEvents(eventsData);
    });

    const unsubscribeCreators = fetchCreators(creatorsData => {
      setCreatorItems(
        creatorsData.map((creator: any) => ({
          id: creator.id,
          label: creator.name,
          value: creator.id,
          image: creator.image,
        }))
      );
    });

    // Cleanup function
    return () => {
      unsubscribeEvents();
      unsubscribeCreators();
    };
  }, []);

  const handleCreateEvent = () => {
    setIsEventSheetVisible(true);
  };

  const handleCreateCreator = () => {
    setIsCreatorSheetVisible(true);
  };

  const handleCloseEventSheet = () => {
    setIsEventSheetVisible(false);
  };

  const handleCloseCreatorSheet = () => {
    setIsCreatorSheetVisible(false);
  };

  const handleSaveNewCreator = async (values?: any) => {
    setCreatorLoader(true);
    let imageUrl = "";
    const creatorName = values?.creatorName;
    const creatorImage = values?.creatorImage;

    if (creatorImage) imageUrl = await uploadImage(creatorImage, "creator");

    await addCreator({ name: creatorName, image: imageUrl });
    setCreatorLoader(false);
    handleCloseCreatorSheet();
  };

  const handleSubmitEvent = async (values: any) => {
    setEventLoader(true);
    const imageUrl = await uploadImage(values.eventImage, "event");
    const creator = creatorItems.find(
      creator => creator.id === values.eventCreator
    );

    await createEvent({
      name: values.eventName,
      venue: values.eventLocation,
      price: parseFloat(values.eventPrice),
      normalTicket: parseInt(values.normalTicket),
      vipTicket: parseInt(values.vipTicket),
      creator,
      genre: values.eventGenre,
      date: values.eventDate,
      time: values.eventTime,
      image: imageUrl,
    });
    handleCloseEventSheet();
    setEventLoader(false);
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
              <RnText style={styles.value}>
                {`${event.normalTicket} + ${event.vipTicket}`}
              </RnText>
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
            logo={{ uri: event.image }}
            logoSize={hp(6)}
            logoBorderRadius={Borders.radius2}
          />
        </View>
      </View>
    );
  };

  return (
    <RnContainer>
      <View style={styles.headerContainer}>
        <RnText style={styles.headerTitle}>Event</RnText>
        <RnButton
          title="Add creator"
          style={[styles.headerButton]}
          onPress={handleCreateCreator}
        />
      </View>

      <FlatList
        data={events}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ maxHeight: hp(65) }}
        renderItem={renderTicketCard}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.formSeparator} />}
        snapToInterval={wp(90) + wp(1)}
        decelerationRate="fast"
        snapToAlignment="start"
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <RnText style={styles.emptyText}>No events found</RnText>
          </View>
        )}
      />
      <RnButton
        title="Create an Event"
        style={[styles.createBtn]}
        onPress={handleCreateEvent}
      />

      <RnBottomSheet
        isVisible={isEventSheetVisible}
        onClose={handleCloseEventSheet}
        // enableDynamicSizing={true}
        scroll={true}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        snapPoints={["75%"]}
      >
        <ScrollContainer customStyle={styles.formContainer}>
          <Formik
            initialValues={{
              eventName: "",
              eventLocation: "",
              eventPrice: "",
              eventGenre: "",
              eventCreator: "",
              eventDate: new Date(),
              eventTime: new Date(),
              eventImage: "",
              normalTicket: "",
              vipTicket: "",
            }}
            validationSchema={eventValidationSchema}
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
                <View style={styles.formRowContainer}>
                  <RnInput
                    placeholder="Normal Ticket"
                    value={values.normalTicket}
                    onChangeText={handleChange("normalTicket")}
                    onBlur={handleBlur("normalTicket")}
                    keyboardType="numeric"
                    error={errors.normalTicket}
                    containerStyle={[
                      styles.formHalfField,
                      styles.formHalfFieldLeft,
                    ]}
                  />
                  <RnInput
                    placeholder="VIP Ticket"
                    value={values.vipTicket}
                    onChangeText={handleChange("vipTicket")}
                    onBlur={handleBlur("vipTicket")}
                    keyboardType="numeric"
                    error={errors.vipTicket}
                    containerStyle={[
                      styles.formHalfField,
                      styles.formHalfFieldRight,
                    ]}
                  />
                </View>

                <RnDropdown
                  open={creatorOpen}
                  value={values.eventCreator}
                  items={creatorItems}
                  setOpen={setCreatorOpen}
                  setValue={value => setFieldValue("eventCreator", value())}
                  setItems={setCreatorItems}
                  placeholder="Select Creator"
                  zIndex={2000}
                  zIndexInverse={1000}
                  emptyText="No creators found"
                />
                <RnText style={styles.errorText}>{errors.eventCreator}</RnText>

                <RnDropdown
                  open={genreOpen}
                  items={genreItems}
                  value={values.eventGenre}
                  setOpen={setGenreOpen}
                  setItems={setGenreItems}
                  setValue={value => setFieldValue("eventGenre", value())}
                  placeholder="Select Genre"
                  zIndex={1000}
                  zIndexInverse={2000}
                />
                <RnText style={styles.errorText}>{errors.eventGenre}</RnText>

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
                      minuteInterval={15}
                      error={errors.eventTime as string}
                    />
                  </View>
                </View>

                <View style={{ alignItems: "center" }}>
                  <RnButton
                    title={
                      values.eventImage
                        ? "Change Event Image"
                        : "Pick Event Image"
                    }
                    onPress={async () => {
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: "images",
                        quality: 0.7,
                      });

                      if (!result.canceled) {
                        setFieldValue("eventImage", result.assets[0].uri);
                      }
                    }}
                    style={[styles.smallBtn]}
                  />

                  {values.eventImage ? (
                    <Image
                      source={{ uri: values.eventImage }}
                      style={styles.modalImage}
                    />
                  ) : null}

                  <RnText style={styles.errorText}>{errors.eventImage}</RnText>
                </View>

                <RnButton
                  title="Create Event"
                  style={[styles.modalCreateBtn]}
                  onPress={handleSubmit}
                  loading={eventLoader}
                />
              </View>
            )}
          </Formik>
        </ScrollContainer>
      </RnBottomSheet>

      <RnBottomSheet
        isVisible={isCreatorSheetVisible}
        onClose={handleCloseCreatorSheet}
        enableDynamicSizing
      >
        <RnContainer customStyle={styles.formScrollView}>
          <View style={styles.formContainer}>
            <Formik
              initialValues={{
                creatorName: "",
                creatorImage: "",
              }}
              validationSchema={creatorValidationSchema}
              onSubmit={async values => {
                await handleSaveNewCreator(values);
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                values,
                errors,
                touched,
              }) => (
                <View>
                  <RnInput
                    placeholder="Creator Name"
                    value={values.creatorName}
                    onChangeText={handleChange("creatorName")}
                    onBlur={handleBlur("creatorName")}
                    error={touched.creatorName ? errors.creatorName : undefined}
                  />

                  <View style={{ alignItems: "center" }}>
                    <RnButton
                      title={
                        values.creatorImage ? "Change Image" : "Pick Image"
                      }
                      onPress={async () => {
                        const result =
                          await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: "images",
                            quality: 0.7,
                          });
                        if (!result.canceled) {
                          setFieldValue("creatorImage", result.assets[0].uri);
                        }
                      }}
                      style={[styles.smallBtn]}
                    />
                    {values.creatorImage ? (
                      <Image
                        source={{ uri: values.creatorImage }}
                        style={styles.modalImage}
                      />
                    ) : null}

                    <RnText style={styles.errorText}>
                      {errors.creatorImage}
                    </RnText>

                    <RnButton
                      title="Save Creator"
                      onPress={handleSubmit}
                      style={[styles.modalCreateBtn]}
                      loading={creatorLoader}
                    />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </RnContainer>
      </RnBottomSheet>
    </RnContainer>
  );
}
