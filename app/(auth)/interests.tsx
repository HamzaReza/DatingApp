import createStyles from "@/app/authStyles/interests.styles";
import RnButton from "@/components/RnButton";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { InterestsValues } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import * as Yup from "yup";

const interestsSchema = Yup.object().shape({
  interests: Yup.array()
    .min(1, "Please select at least one interest")
    .max(3, "You can select up to 3 interests")
    .required("Please select at least one interest"),
});

const INTERESTS = [
  { id: "reading", label: "Reading", icon: "📚" },
  { id: "photography", label: "Photography", icon: "📸" },
  { id: "gaming", label: "Gaming", icon: "🎮" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "travel", label: "Travel", icon: "✈️" },
  { id: "painting", label: "Painting", icon: "🎨" },
  { id: "politics", label: "Politics", icon: "👥" },
  { id: "charity", label: "Charity", icon: "❤️" },
  { id: "cooking", label: "Cooking", icon: "🍳" },
  { id: "pets", label: "Pets", icon: "🐾" },
  { id: "sports", label: "Sports", icon: "⚽" },
  { id: "fashion", label: "Fashion", icon: "👔" },
];

export default function Interests() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const params = useLocalSearchParams();

  const handleInterestsSubmit = async (values: InterestsValues) => {
    if (!values.interests.length) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push({
        pathname: "/photo",
        params: { ...params, interests: values.interests },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInterests = INTERESTS.filter((interest) =>
    interest.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderInterestTag = (
    interest: (typeof INTERESTS)[0],
    selectedInterests: string[],
    setFieldValue: (field: string, value: any) => void
  ) => {
    const isSelected = selectedInterests.includes(interest.id);
    const canSelect = selectedInterests.length < 3 || isSelected;

    const handlePress = () => {
      if (isSelected) {
        setFieldValue(
          "interests",
          selectedInterests.filter((id) => id !== interest.id)
        );
      } else if (canSelect) {
        setFieldValue("interests", [...selectedInterests, interest.id]);
      }
    };

    return (
      <Pressable
        key={interest.id}
        onPress={handlePress}
        style={[
          styles.interestTag,
          isSelected ? styles.selectedTag : styles.unselectedTag,
        ]}
        disabled={!canSelect && !isSelected}
      >
        <RnText>{interest.icon}</RnText>
        <RnText
          style={[
            styles.tagText,
            isSelected ? styles.selectedTagText : styles.unselectedTagText,
          ]}
        >
          {interest.label}
        </RnText>
      </Pressable>
    );
  };

  return (
    <ScrollContainer topBar={<RnProgressBar progress={8 / 11} />}>
      <Formik
        initialValues={{ interests: [] }}
        validationSchema={interestsSchema}
        onSubmit={handleInterestsSubmit}
      >
        {({ values, setFieldValue, handleSubmit, errors }) => (
          <View style={styles.innerContainer}>
            <RnText style={styles.title}>Select Up To 3 Interest</RnText>
            <RnText style={styles.subtitle}>
              Tell us what piques your curiosity and passions
            </RnText>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Type Here"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={styles.interestsContainer}>
              {filteredInterests.map((interest) =>
                renderInterestTag(interest, values.interests, setFieldValue)
              )}
            </View>

            {errors.interests && (
              <RnText style={styles.errorText}>{errors.interests}</RnText>
            )}

            <RnButton
              title="Continue"
              style={[styles.button]}
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
