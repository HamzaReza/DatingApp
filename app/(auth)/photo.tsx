import createStyles from "@/app/authStyles/photo.styles";
import RnAvatar from "@/components/RnAvatar";
import RnButton from "@/components/RnButton";
import RnImagePicker from "@/components/RnImagePicker";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { PhotoValues } from "@/types";
import { router } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { View } from "react-native";
import * as Yup from "yup";

const photoSchema = Yup.object().shape({
  photo: Yup.mixed().required("Required"),
});

export default function Photo() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handlePhotoSubmit = async (values: PhotoValues) => {
    if (!values.photo) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/location");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollContainer topBar={<RnProgressBar progress={9 / 11} />}>
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
              setUri={(image) => setFieldValue("photo", image)}
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
