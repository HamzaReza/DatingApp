import createStyles from "@/app/authStyles/interests.styles";
import RnButton from "@/components/RnButton";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import { fetchTags } from "@/firebase/auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { InterestsValues } from "@/types";
import { wp } from "@/utils";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import * as Yup from "yup";

const interestsSchema = Yup.object().shape({
  interests: Yup.array()
    .min(1, "Please select at least one interest")
    .max(7, "You can select up to 7 interests")
    .required("Please select at least one interest"),
});

type Tag = {
  id: string;
  label: string;
  iconSvg: string;
};

export default function Interests() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [interests, setInterests] = useState<Tag[] | []>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const params = useLocalSearchParams();

  useEffect(() => {
    const unsubscribe = fetchTags(tagsArray => {
      setInterests(tagsArray);
      setIsLoadingTags(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleInterestsSubmit = async (values: InterestsValues) => {
    if (!values.interests.length) return;
    setIsLoading(true);
    try {
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

  const filteredInterests = interests.filter(interest =>
    interest.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderIcon = (icon: string, isSelected: boolean) => {
    if (!icon) return null;

    return (
      <SvgIcon
        svgString={icon}
        width={16}
        height={16}
        color={isSelected ? Colors[theme].background : Colors[theme].redText}
      />
    );
  };

  const renderInterestTag = (
    interest: Tag,
    selectedInterests: string[],
    setFieldValue: (field: string, value: any) => void
  ) => {
    const isSelected = selectedInterests.includes(interest.id);
    const canSelect = selectedInterests.length < 7 || isSelected;

    const handlePress = () => {
      if (isSelected) {
        setFieldValue(
          "interests",
          selectedInterests.filter(id => id !== interest.id)
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
        {renderIcon(interest.iconSvg, isSelected)}
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
          <RnProgressBar progress={9 / 12} />
        </View>
      }
    >
      <Formik
        initialValues={{ interests: [] }}
        validationSchema={interestsSchema}
        onSubmit={handleInterestsSubmit}
      >
        {({ values, setFieldValue, handleSubmit, errors }) => (
          <View style={styles.innerContainer}>
            <RnText style={styles.title}>Select Up To 7 Interest</RnText>
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
              {isLoadingTags ? (
                <RnText style={styles.subtitle}>Loading interests...</RnText>
              ) : (
                filteredInterests.map(interest =>
                  renderInterestTag(interest, values.interests, setFieldValue)
                )
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
