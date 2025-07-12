/* eslint-disable react-hooks/exhaustive-deps */
import createStyles from "@/app/adminStyles/dashboard.styles";
import RnDropdown from "@/components/RnDropdown";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import {
  dashboardStats,
  earningOverviewData,
  monthlyProgressData,
} from "@/constants/dashboardData";
import { FontSize } from "@/constants/FontSize";
import { fetchEvents, fetchUsers } from "@/firebase/admin";
import { useColorScheme } from "@/hooks/useColorScheme";
import { setToken, setUser } from "@/redux/slices/userSlice";
import { hp, wp } from "@/utils";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { useDispatch } from "react-redux";

export default function Dashboard() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [dropdownItems, setDropdownItems] = useState([
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ]);

  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    todayUsers: 0,
    yesterdayUsers: 0,
    userGrowthPercentage: 0,
    placeholder: null,
    totalEvents: 0,
    todayEvents: 0,
    yesterdayEvents: 0,
    eventGrowthPercentage: 0,
    totalPendingUsers: 0,
    todayPendingUsers: 0,
    yesterdayPendingUsers: 0,
    pendingUserGrowthPercentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeUsers = fetchUsers(usersData => {
      setUsers(usersData);
    });

    const unsubscribeEvents = fetchEvents(eventsData => {
      setEvents(eventsData);
    });

    // Cleanup function
    return () => {
      unsubscribeUsers();
      unsubscribeEvents();
    };
  }, []);

  useEffect(() => {
    if (users.length > 0 || events.length > 0) {
      calculateStats();
    }
  }, [users, events]);

  const calculateStats = () => {
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfYesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1
    );

    // User statistics
    const todayUsers = users.filter(user => {
      const createdAt =
        (user as any).createdAt?.toDate?.() ||
        new Date((user as any).createdAt || Date.now());
      return createdAt >= startOfToday;
    });

    const yesterdayUsers = users.filter(user => {
      const createdAt =
        (user as any).createdAt?.toDate?.() ||
        new Date((user as any).createdAt || Date.now());
      return createdAt >= startOfYesterday && createdAt < startOfToday;
    });

    // Pending user statistics
    const pendingUsers = users.filter(
      user => (user as any).status === "pending"
    );
    const todayPendingUsers = pendingUsers.filter(user => {
      const createdAt =
        (user as any).createdAt?.toDate?.() ||
        new Date((user as any).createdAt || Date.now());
      return createdAt >= startOfToday;
    });

    const yesterdayPendingUsers = pendingUsers.filter(user => {
      const createdAt =
        (user as any).createdAt?.toDate?.() ||
        new Date((user as any).createdAt || Date.now());
      return createdAt >= startOfYesterday && createdAt < startOfToday;
    });

    // Event statistics
    const todayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfToday;
    });

    const yesterdayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfYesterday && eventDate < startOfToday;
    });

    // Calculate growth percentages
    const userGrowthPercentage = calculateGrowthPercentage(
      todayUsers.length,
      yesterdayUsers.length
    );
    const eventGrowthPercentage = calculateGrowthPercentage(
      todayEvents.length,
      yesterdayEvents.length
    );
    const pendingUserGrowthPercentage = calculateGrowthPercentage(
      todayPendingUsers.length,
      yesterdayPendingUsers.length
    );

    setStats({
      totalUsers: users.length,
      todayUsers: todayUsers.length,
      yesterdayUsers: yesterdayUsers.length,
      userGrowthPercentage,
      placeholder: null,
      totalEvents: events.length,
      todayEvents: todayEvents.length,
      yesterdayEvents: yesterdayEvents.length,
      eventGrowthPercentage,
      totalPendingUsers: pendingUsers.length,
      todayPendingUsers: todayPendingUsers.length,
      yesterdayPendingUsers: yesterdayPendingUsers.length,
      pendingUserGrowthPercentage,
    });
    setLoading(false);
  };

  const calculateGrowthPercentage = (today: number, yesterday: number) => {
    if (yesterday > 0) {
      return Number((((today - yesterday) / yesterday) * 100).toFixed(2));
    } else if (today > 0) {
      return 100;
    }
    return 0;
  };

  const progressData = useMemo(() => {
    if (selectedPeriod === "monthly") {
      return monthlyProgressData;
    } else {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let year = 2025; year <= currentYear; year++) {
        years.push({
          value: Math.floor(Math.random() * 100) + 20,
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors[theme].primary} />
      </View>
    );
  }

  return (
    <ScrollContainer>
      <View style={styles.headerContainer}>
        <RoundButton noShadow />
        <RnText style={styles.headerTitle}>Dashboard</RnText>
        <RoundButton
          iconName="logout"
          iconSize={22}
          iconColor={Colors[theme].primary}
          backgroundColour={Colors[theme].whiteText}
          onPress={() => {
            router.replace("/onboarding");
            dispatch(setUser(null));
            dispatch(setToken(null));
          }}
        />
      </View>
      <FlatList
        data={dashboardStats}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.flatlistColumnWrapper}
        style={styles.flatlist}
        scrollEnabled={false}
        keyExtractor={item => item.label}
        renderItem={({ item, index }) => {
          let statValue, growthPercentage;

          switch (index) {
            case 0: // Total Users
              statValue = stats.totalUsers;
              growthPercentage = stats.userGrowthPercentage;
              break;
            case 1: // Placeholder (null)
              statValue = "-";
              growthPercentage = 0;
              break;
            case 2: // Total Events
              statValue = stats.totalEvents;
              growthPercentage = stats.eventGrowthPercentage;
              break;
            case 3: // Total Pending Users
              statValue = stats.totalPendingUsers;
              growthPercentage = stats.pendingUserGrowthPercentage;
              break;
            default:
              statValue = 0;
              growthPercentage = 0;
          }

          return (
            <View key={item.label} style={styles.statCard}>
              <View style={styles.topStat}>
                {statIcons[index]}
                <RnText style={styles.statValue}>{statValue}</RnText>
                <RnText style={styles.statLabel}>{item.label}</RnText>
              </View>
              <RnText
                style={[
                  styles.statChange,
                  {
                    color:
                      growthPercentage === 0
                        ? Colors[theme].placeholderText
                        : growthPercentage > 0
                        ? Colors[theme].greenText
                        : Colors[theme].redText,
                  },
                ]}
              >
                {growthPercentage === 0
                  ? `No Change`
                  : growthPercentage > 0
                  ? `▲ ${growthPercentage}% Up`
                  : `▼ ${growthPercentage}% Down`}{" "}
                {item.period}
              </RnText>
            </View>
          );
        }}
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
