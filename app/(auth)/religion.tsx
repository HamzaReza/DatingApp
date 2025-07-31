import createStyles from "@/app/authStyles/religion.styles";
import RnButton from "@/components/RnButton";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { getCurrentAuth, updateUser } from "@/firebase/auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ReligionValues } from "@/types";
import { wp } from "@/utils";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { Pressable, View } from "react-native";
import * as Yup from "yup";

const religionSchema = Yup.object().shape({
  religion: Yup.string()
    .oneOf(
      ["hinduism", "islam", "christianity", "judaism"],
      "Please select a valid option"
    )
    .required("Please select an option"),
});

const RELIGIONS = [
  { value: "hinduism", label: "Hinduism" },
  { value: "islam", label: "Islam" },
  { value: "christianity", label: "Christianity" },
  { value: "judaism", label: "Judaism" },
] as const;

export default function Religion() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const params = useLocalSearchParams();

  const handleReligionSubmit = async (values: ReligionValues) => {
    if (!values.religion) return;
    setIsLoading(true);
    try {
      const auth = await getCurrentAuth();
      const currentUser = auth.currentUser;
      console.log(
        "🚀 ~ religion.tsx:47 ~ handleReligionSubmit ~ currentUser:",
        currentUser.uid
      );

      if (!currentUser) {
        throw new Error("No authenticated user found");
      }

      const updatedUserData = {
        ...params,
        location: JSON.parse(params.location as string),
        religion: values.religion,
        role: "user",
        status: "pending",
        trustScore: 100,
        isProfileComplete: true,
      };

      await updateUser(currentUser.uid, updatedUserData);

      router.dismissTo("/getStarted");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOption = (
    option: (typeof RELIGIONS)[number],
    selectedOption: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const isSelected = selectedOption === option.value;
    return (
      <Pressable
        key={option.value}
        onPress={() =>
          setFieldValue("religion", isSelected ? "" : option.value)
        }
        style={[styles.option, isSelected && styles.optionSelected]}
      >
        <RnText
          style={[styles.optionText, isSelected && styles.optionTextSelected]}
        >
          {option.label}
        </RnText>
      </Pressable>
    );
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
            onPress={() => router.back()}
          />
          <RnProgressBar progress={15 / 15} />
        </View>
      }
    >
      <Formik
        initialValues={{ religion: "" }}
        validationSchema={religionSchema}
        onSubmit={handleReligionSubmit}
      >
        {({ values, setFieldValue, handleSubmit, errors }) => (
          <View style={styles.innerContainer}>
            <RnText style={styles.title}>{`What's Your Religion?`}</RnText>
            <RnText style={styles.subtitle}>
              Share your faith and beliefs with others
            </RnText>

            <View style={styles.optionsContainer}>
              {RELIGIONS.map(option =>
                renderOption(option, values.religion, setFieldValue)
              )}
            </View>

            {errors.religion && (
              <RnText style={styles.errorText}>{errors.religion}</RnText>
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
