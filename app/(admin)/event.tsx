import createStyles from "@/app/adminStyles/event.styles";
import RnBottomSheet from "@/components/RnBottomSheet";
import RnButton from "@/components/RnButton";
import RnContainer from "@/components/RnContainer";
import RnDateTimePicker from "@/components/RnDateTimePicker";
import RnDropdown from "@/components/RnDropdown";
import RnInput from "@/components/RnInput";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { adminEvents } from "@/constants/adminEvents";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AdminEvent } from "@/types/Admin";
import { hp, wp } from "@/utils";
import { Formik } from "formik";
import React, { useState } from "react";
import { FlatList, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Yup from "yup";

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
  const [genreOpen, setGenreOpen] = useState(false);
  const [genreItems, setGenreItems] = useState(genreOptions);

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
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };

  const handleSubmitEvent = (values: any) => {
    handleCloseBottomSheet();
  };

  return (
    <RnContainer>
      <RnText style={styles.headerTitle}>Event</RnText>
      <View>
        <FlatList
          data={adminEvents}
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
        title="Create a event"
        style={[styles.createBtn]}
        onPress={handleCreateEvent}
      />

      <RnBottomSheet
        isVisible={isBottomSheetVisible}
        onClose={handleCloseBottomSheet}
        enableDynamicSizing={true}
      >
        <ScrollContainer customStyle={styles.formScrollView}>
          <View style={styles.formContainer}>
            <RnText style={styles.formTitle}>Create New Event</RnText>

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
                  <View>
                    <RnInput
                      placeholder="Enter event name"
                      value={values.eventName}
                      onChangeText={handleChange("eventName")}
                      onBlur={handleBlur("eventName")}
                      error={errors.eventName}
                    />
                  </View>

                  <View>
                    <RnInput
                      placeholder="Enter event location"
                      value={values.eventLocation}
                      onChangeText={handleChange("eventLocation")}
                      onBlur={handleBlur("eventLocation")}
                      error={errors.eventLocation}
                    />
                  </View>

                  <View>
                    <RnInput
                      placeholder="Enter event price"
                      value={values.eventPrice}
                      onChangeText={handleChange("eventPrice")}
                      onBlur={handleBlur("eventPrice")}
                      keyboardType="numeric"
                      error={errors.eventPrice}
                    />
                  </View>

                  <View>
                    <RnDropdown
                      open={genreOpen}
                      items={genreItems}
                      value={values.eventGenre}
                      setOpen={setGenreOpen}
                      setItems={setGenreItems}
                      setValue={(value) => {
                        setFieldValue("eventGenre", value());
                      }}
                      placeholder="Select event genre"
                    />
                    <RnText style={styles.formErrorText}>
                      {errors.eventGenre}
                    </RnText>
                  </View>

                  <View style={styles.formRowContainer}>
                    <View
                      style={[styles.formHalfField, styles.formHalfFieldLeft]}
                    >
                      <RnDateTimePicker
                        value={values.eventDate}
                        onChange={(event, selectedDate) => {
                          if (selectedDate) {
                            setFieldValue("eventDate", selectedDate);
                          }
                        }}
                        mode="date"
                        placeholder="Select date"
                        error={errors.eventDate as string}
                      />
                    </View>
                    <View
                      style={[styles.formHalfField, styles.formHalfFieldRight]}
                    >
                      <RnDateTimePicker
                        value={values.eventTime}
                        onChange={(event, selectedDate) => {
                          if (selectedDate) {
                            setFieldValue("eventTime", selectedDate);
                          }
                        }}
                        mode="time"
                        placeholder="Select time"
                        error={errors.eventTime as string}
                      />
                    </View>
                  </View>

                  <RnButton
                    title="Create Event"
                    style={[styles.modalCreateBtn]}
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
