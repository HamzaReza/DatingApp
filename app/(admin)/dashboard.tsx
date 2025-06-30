import createStyles from "@/app/adminStyles/dashboard.styles";
import RnDropdown from "@/components/RnDropdown";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import {
  dashboardStats,
  earningOverviewData,
  monthlyProgressData,
} from "@/constants/dashboardData";
import { FontSize } from "@/constants/FontSize";
import { useColorScheme } from "@/hooks/useColorScheme";
import { hp, wp } from "@/utils";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";

export default function Dashboard() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [dropdownItems, setDropdownItems] = useState([
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ]);

  // Dynamic data based on selected period
  const progressData = useMemo(() => {
    if (selectedPeriod === "monthly") {
      return monthlyProgressData;
    } else {
      // Yearly data from 2025 to current year
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let year = 2025; year <= currentYear; year++) {
        years.push({
          value: Math.floor(Math.random() * 100) + 20, // Random value between 20-120
          label: year.toString(),
        });
      }
      return years;
    }
  }, [selectedPeriod]);

  const statIcons = [
    <FontAwesome5
      name="users"
      size={20}
      color={Colors[theme].primary}
      key="users"
    />,
    <FontAwesome5
      name="user-friends"
      size={20}
      color={Colors[theme].primary}
      key="friends"
    />,
    <MaterialCommunityIcons
      name="ticket"
      size={20}
      color={Colors[theme].primary}
      key="ticket"
    />,
    <Ionicons
      name="time-outline"
      size={20}
      color={Colors[theme].primary}
      key="time"
    />,
  ];

  return (
    <ScrollContainer>
      <RnText style={styles.headerTitle}>Dashboard</RnText>
      <FlatList
        data={dashboardStats}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.label}
        renderItem={({ item, index }) => (
          <View key={item.label} style={styles.statCard}>
            <View style={styles.topStat}>
              {statIcons[index]}
              <RnText style={styles.statValue}>{item.value}</RnText>
              <RnText style={styles.statLabel}>{item.label}</RnText>
            </View>
            <RnText
              style={[
                styles.statChange,
                {
                  color:
                    item.change > 0
                      ? Colors[theme].greenText
                      : Colors[theme].redText,
                },
              ]}
            >
              {item.change > 0
                ? `▲ ${item.change}% Up`
                : `▼ ${Math.abs(item.change)}% Down`}{" "}
              {item.period}
            </RnText>
          </View>
        )}
        columnWrapperStyle={styles.flatlistColumnWrapper}
        style={styles.flatlist}
        scrollEnabled={false}
      />
      <View style={styles.chartCard}>
        <RnText style={styles.sectionTitle}>Earning Overview</RnText>
        <LineChart
          data={earningOverviewData}
          areaChart
          curved
          hideDataPoints={false}
          color={Colors[theme].primary}
          thickness={1}
          startFillColor={Colors[theme].primary}
          endFillColor={Colors[theme].background}
          yAxisColor={Colors[theme].gray}
          xAxisColor={Colors[theme].gray}
          xAxisLabelTextStyle={{ fontSize: FontSize.extraSmall }}
          yAxisTextStyle={{ fontSize: FontSize.extraSmall }}
          noOfSections={5}
          height={hp(20)}
          width={wp(75)}
          hideRules
        />
      </View>
      <View style={styles.chartCard}>
        <View style={styles.progressHeader}>
          <RnText style={styles.sectionTitle}>
            {selectedPeriod === "monthly"
              ? "Monthly Progress"
              : "Yearly Progress"}
          </RnText>
          <RnDropdown
            open={dropdownOpen}
            setOpen={setDropdownOpen}
            value={selectedPeriod}
            setValue={setSelectedPeriod}
            items={dropdownItems}
            setItems={setDropdownItems}
            placeholder="Select period"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={1000}
            zIndexInverse={1000}
          />
        </View>
        <BarChart
          data={progressData}
          barWidth={wp(6)}
          frontColor={Colors[theme].primary}
          yAxisColor={Colors[theme].gray}
          xAxisColor={Colors[theme].gray}
          xAxisLabelTextStyle={{ fontSize: FontSize.extraSmall }}
          yAxisTextStyle={{ fontSize: FontSize.extraSmall }}
          noOfSections={6}
          maxValue={120}
          height={hp(20)}
          width={wp(75)}
          hideRules
        />
      </View>
      <View style={styles.bottomSpacer} />
    </ScrollContainer>
  );
}
