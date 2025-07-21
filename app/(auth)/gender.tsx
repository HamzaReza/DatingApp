import createStyles from "@/app/authStyles/gender.styles";
import RnButton from "@/components/RnButton";
import Container from "@/components/RnContainer";
import RnProgressBar from "@/components/RnProgressBar";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { fetchGenders } from "@/firebase/auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { wp } from "@/utils";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import * as Yup from "yup";

// Validation schema
const genderSchema = Yup.object().shape({
  gender: Yup.string().required("Gender is required"),
});

interface GenderOption {
  id: string;
  label: string;
}

export default function Gender() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [genders, setGenders] = useState<GenderOption[]>([]);
  const [isFetchingGenders, setIsFetchingGenders] = useState(true);
  const params = useLocalSearchParams();

  useEffect(() => {
    const unsubscribe = fetchGenders(genders => {
      setGenders(genders);
      setIsFetchingGenders(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleGenderSubmit = async (values: { gender: string | "" }) => {
    if (!values.gender) return;
    setIsLoading(true);
    try {
      router.push({
        pathname: "/lookingFor",
        params: { ...params, gender: values.gender },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderGenderOption = (
    label: string,
    selectedGender: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const isSelected = selectedGender === label;
    return (
      <Pressable
        onPress={() => setFieldValue("gender", isSelected ? "" : label)}
        style={[
          styles.genderButton,
          isSelected && styles.selectedGenderButton,
          { marginRight: wp(8) },
        ]}
      >
        <RnText
          style={[styles.genderText, isSelected && styles.selectedGenderText]}
        >
          {label}
        </RnText>
      </Pressable>
    );
  };

  return (
    <Container
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
          <RnProgressBar progress={7 / 12} />
        </View>
      }
    >
      <Formik
        initialValues={{ gender: "" }}
        validationSchema={genderSchema}
        onSubmit={handleGenderSubmit}
      >
        {({ values, setFieldValue, handleSubmit, errors }) => (
          <View style={styles.innerContainer}>
            <RnText style={styles.title}>{`What's Your Gender?`}</RnText>
            <RnText style={styles.subtitle}>Tell us about your gender</RnText>

            {isFetchingGenders ? (
              <View style={styles.genderContainer}>
                <RnText style={styles.subtitle}>Loading genders...</RnText>
              </View>
            ) : (
              <View>
                <FlatList
                  data={genders}
                  renderItem={({ item }) =>
                    renderGenderOption(item.label, values.gender, setFieldValue)
                  }
                  keyExtractor={item => item.id}
                  numColumns={3}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}

            {errors.gender && (
              <RnText style={styles.errorText}>{errors.gender}</RnText>
            )}

            <RnButton
              title="Continue"
              style={styles.button}
              onPress={handleSubmit}
              disabled={isLoading || isFetchingGenders}
              loading={isLoading}
            />
          </View>
        )}
      </Formik>
    </Container>
  );
}
