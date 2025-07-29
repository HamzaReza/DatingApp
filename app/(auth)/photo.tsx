import createStyles from "@/app/authStyles/photo.styles";
import RnAvatar from "@/components/RnAvatar";
import RnButton from "@/components/RnButton";
import RnImagePicker from "@/components/RnImagePicker";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { uploadImage } from "@/firebase/auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { PhotoValues } from "@/types";
import { wp } from "@/utils";
import { FontAwesome6 } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { View } from "react-native";
import * as Yup from "yup";

const photoSchema = Yup.object().shape({
  photo: Yup.string().required("Required"),
});

export default function Photo() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const params = useLocalSearchParams();

  const handlePhotoSubmit = async (values: PhotoValues) => {
    if (!values.photo) return;
    try {
      router.push({
        pathname: "/location",
        params: { ...params, photo: values.photo },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollContainer
      topBar={
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesome6
            name="house"
            size={24}
            color={Colors[theme].primary}
            style={{ marginLeft: wp(5) }}
            onPress={() => router.dismissAll()}
          />
          <RnProgressBar progress={10 / 12} />
        </View>
      }
    >
      <Formik
        initialValues={{
          photo: null,
        }}
        validationSchema={photoSchema}
        onSubmit={handlePhotoSubmit}
      >
        {({ values, setFieldValue, handleSubmit, errors }) => (
          <View style={styles.innerContainer}>
            <RnText style={styles.title}>Upload Your Photo</RnText>
            <RnText style={styles.subtitle}>
              {`We'd love to see you. Upload a photo for your dating journey.`}
            </RnText>

            <RnImagePicker
              visible={showPicker}
              showPicker={() => setShowPicker(true)}
              hidePicker={() => setShowPicker(false)}
              setUri={async image => {
                try {
                  const auth = getAuth();
                  const currentUser = auth.currentUser;

                  if (!currentUser) {
                    console.error("No authenticated user found");
                    return;
                  }

                  // Upload image and get download URL
                  setIsLoading(true);
                  const imageUrl = await uploadImage(
                    (image as { uri: string }).uri,
                    "user",
                    currentUser.uid,
                    "profile"
                  ).finally(() => setIsLoading(false));

                  // Set the download URL in the form
                  setFieldValue("photo", imageUrl);
                } catch (error) {
                  console.error("Error uploading image:", error);
                }
              }}
            >
              <View style={styles.photoContainer}>
                <RnAvatar
                  avatarHeight={styles.photoContainer.height}
                  showAvatarIcon={!values.photo}
                  source={values.photo}
                />
              </View>
            </RnImagePicker>

            {errors.photo && (
              <RnText style={styles.errorText}>{errors.photo}</RnText>
            )}

            <RnButton
              title="Continue"
              style={styles.button}
              onPress={handleSubmit}
              disabled={isLoading}
              loading={isLoading}
            />
          </View>
        )}
      </Formik>
    </ScrollContainer>
  );
}
