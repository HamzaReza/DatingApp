import {
  addDoc,
  collection,
  FirebaseFirestoreTypes,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "@react-native-firebase/firestore";

const createEvent = async (event: {
  name: string;
  venue: string;
  normalPrice: number;
  vipPrice: number;
  normalTicket: number;
  vipTicket: number;
  genre: string;
  date: string;
  time: string;
  creator: { id: string; label: string; image: string };
  image: string;
}) => {
  try {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "events"), {
      name: event.name,
      venue: event.venue,
      normalPrice: event.normalPrice,
      vipPrice: event.vipPrice,
      normalTicket: event.normalTicket,
      vipTicket: event.vipTicket,
      normalTicketSold: 0,
      vipTicketSold: 0,
      creator: event.creator,
      genre: event.genre,
      date: event.date,
      time: event.time,
      createdAt: Timestamp.now(),
      image: event.image,
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

const fetchEvents = (callback: (events: any[]) => void) => {
  try {
    const db = getFirestore();
    const eventsRef = collection(db, "events");

    const unsubscribe = onSnapshot(
      eventsRef,
      snapshot => {
        const events = snapshot.docs.map(
          (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              venue: data.venue,
              normalPrice: data.normalPrice,
              vipPrice: data.vipPrice,
              genre: data.genre,
              normalTicket: data.normalTicket,
              vipTicket: data.vipTicket,
              creator: {
                id: data.creator.id,
                label: data.creator.label,
                image: data.creator.image,
              },
              image: data.image,
              date: data.date?.toDate?.()?.toLocaleDateString() || data.date,
              time: data.time?.toDate?.()?.toLocaleTimeString() || data.time,
            };
          }
        );

        callback(events);
      },
      error => {
        console.error("Error in events listener:", error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up events listener:", error);
    throw error;
  }
};

const createPricingPlan = async (plan: {
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
}) => {
  try {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "pricingPlans"), {
      ...plan,
      createdAt: new Date(),
    });

    return docRef.id;
  } catch (error) {
    throw error;
  }
};

const fetchPricingPlans = (callback: (plans: any[]) => void) => {
  try {
    const db = getFirestore();

    const unsubscribe = onSnapshot(
      collection(db, "pricingPlans"),
      snapshot => {
        const plans = snapshot.docs.map(
          (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

        callback(plans);
      },
      error => {
        console.error("Error in pricing plans listener:", error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up pricing plans listener:", error);
    throw error;
  }
};

const addCreator = async (creator: { name: string; image: string }) => {
  const db = getFirestore();
  const docRef = await addDoc(collection(db, "creator"), {
    ...creator,
    createdAt: new Date(),
  });

  return docRef.id;
};

const fetchCreators = (callback: (creators: any[]) => void) => {
  try {
    const db = getFirestore();

    const unsubscribe = onSnapshot(
      collection(db, "creator"),
      snapshot => {
        const creators = snapshot.docs.map(
          (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

        callback(creators);
      },
      error => {
        console.error("Error in creators listener:", error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up creators listener:", error);
    throw error;
  }
};

const fetchUsers = (callback: (users: any[]) => void) => {
  try {
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const usersQuery = query(usersRef, where("isProfileComplete", "==", true));

    const unsubscribe = onSnapshot(
      usersQuery,
      snapshot => {
        const usersData = snapshot.docs.map(
          (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              status: data.status || "pending",
            };
          }
        );

        callback(usersData);
      },
      error => {
        console.error("Error in users listener:", error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up users listener:", error);
    throw error;
  }
};

// const fetchEarningsLast30Days = async () => {
//   const db = getFirestore();
//   const today = new Date();
//   const startDate = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000); // rolling 30 days

//   const dailyEarnings: Record<string, number> = {};

//   // Init all 30 days with 0
//   for (let i = 0; i < 30; i++) {
//     const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
//     const key = d.toISOString().split("T")[0];
//     dailyEarnings[key] = 0;
//   }

//   // ---- payments ----
//   const paymentsSnap = await getDocs(collection(db, "payments"));
//   paymentsSnap.forEach(doc => {
//     const data = doc.data();
//     if (["paid", "completed"].includes(data.status)) {
//       const date = data.createdAt?.toDate?.() || new Date(data.createdAt);
//       const key = date.toISOString().split("T")[0];
//       if (dailyEarnings[key] !== undefined) {
//         dailyEarnings[key] += data.amount / 100;
//       }
//     }
//   });

//   // ---- eventTickets ----
//   const ticketsSnap = await getDocs(collection(db, "eventTickets"));
//   ticketsSnap.forEach(doc => {
//     const purchases = doc.data().purchases || [];
//     purchases.forEach((purchase: any) => {
//       if (["paid", "completed"].includes(purchase.status)) {
//         const date =
//           purchase.createdAt?.toDate?.() || new Date(purchase.createdAt);
//         const key = date.toISOString().split("T")[0];
//         if (dailyEarnings[key] !== undefined) {
//           dailyEarnings[key] += purchase.amount / 100;
//         }
//       }
//     });
//   });

//   // Chart data for 30 days
//   const chartData = Object.entries(dailyEarnings).map(([date, value]) => ({
//     label: date.slice(5), // "MM-DD"
//     value: Number(value.toFixed(2)),
//   }));

//   return chartData;
// };

const fetchAllEarnings = async (): Promise<any[]> => {
  const db = getFirestore();
  const earnings: Earning[] = [];

  // ---- payments ----
  const paymentsSnap = await getDocs(collection(db, "payments"));
  paymentsSnap.forEach(doc => {
    const data = doc.data();
    if (["paid", "completed"].includes(data.status)) {
      const date = data.createdAt?.toDate?.() || new Date(data.createdAt);
      earnings.push({ date, amount: data.amount / 100 }); // convert cents to currency
    }
  });

  // ---- eventTickets ----
  const ticketsSnap = await getDocs(collection(db, "eventTickets"));
  ticketsSnap.forEach(doc => {
    const purchases = doc.data().purchases || [];
    purchases.forEach((purchase: any) => {
      if (["paid", "completed"].includes(purchase.status)) {
        const date =
          purchase.createdAt?.toDate?.() || new Date(purchase.createdAt);
        earnings.push({ date, amount: purchase.amount / 100 }); // convert cents to currency
      }
    });
  });

  return earnings;
};

const buildChartsFromEarnings = (
  earnings: any[],
  period: "monthly" | "yearly"
): { last30DaysChart: any[]; progressChart: any[] } => {
  const today = new Date();

  // ---- Chart 1: Last 30 days ----
  const startDate = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
  const dailyEarnings: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    dailyEarnings[d.toISOString().split("T")[0]] = 0;
  }

  earnings.forEach(({ date, amount }) => {
    const key = date.toISOString().split("T")[0];
    if (dailyEarnings[key] !== undefined) {
      dailyEarnings[key] += amount;
    }
  });

  const last30DaysChart: any[] = Object.entries(dailyEarnings).map(
    ([date, value]) => ({
      label: date.slice(5), // "MM-DD"
      value: Number(value.toFixed(2)),
    })
  );

  // ---- Chart 2: Progress ----
  let progressChart: any[] = [];

  if (period === "monthly") {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    const daily: Record<string, number> = {};
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), i);
      daily[d.toISOString().split("T")[0]] = 0;
    }

    earnings.forEach(({ date, amount }) => {
      if (date >= startOfMonth) {
        const key = date.toISOString().split("T")[0];
        if (daily[key] !== undefined) daily[key] += amount;
      }
    });

    progressChart = Object.entries(daily).map(([date, value]) => ({
      label: date.split("-")[2], // DD
      value: Number(value.toFixed(2)),
    }));
  } else if (period === "yearly") {
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const monthly: Record<number, number> = {};
    for (let m = 0; m < 12; m++) monthly[m] = 0;

    earnings.forEach(({ date, amount }) => {
      const d = new Date(date); // force conversion
      if (d >= startOfYear) {
        monthly[d.getMonth()] += amount;
      }
    });

    progressChart = Object.entries(monthly).map(([month, value]) => ({
      label: new Date(today.getFullYear(), Number(month), 1).toLocaleString(
        "default",
        { month: "short" }
      ),
      value: Number(value.toFixed(2)),
    }));
  }

  return { last30DaysChart, progressChart };
};
export {
  addCreator,
  createEvent,
  createPricingPlan,
  fetchCreators,
  fetchEvents,
  fetchPricingPlans,
  fetchUsers,
  fetchAllEarnings,
  buildChartsFromEarnings,
  // fetchEarningsLast30Days,
};
