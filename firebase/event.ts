import {
  collection,
  doc,
  FirebaseFirestoreTypes,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "@react-native-firebase/firestore";

const formatDate = (timestamp: any) => {
  let date;
  if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else {
    date = new Date(timestamp);
  }

  return date;
};

const fetchNextUpcomingEvent = (callback: (event: any | null) => void) => {
  try {
    const db = getFirestore();
    const eventsRef = collection(db, "events");
    const now = new Date();

    const q = query(eventsRef, orderBy("date", "asc"));

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        if (snapshot.empty) {
          callback(null);
          return;
        }

        let nextEvent = null;
        let earliestDateTime = null;

        for (const doc of snapshot.docs) {
          const data = doc.data();

          const eventDate = formatDate(data.date);
          const eventTime = formatDate(data.time);

          if (!eventDate) {
            continue;
          }

          let eventDateTime = new Date(eventDate);
          if (eventTime) {
            eventDateTime.setHours(
              eventTime.getHours(),
              eventTime.getMinutes(),
              eventTime.getSeconds(),
              eventTime.getMilliseconds()
            );
          }

          if (eventDateTime > now) {
            if (!earliestDateTime || eventDateTime < earliestDateTime) {
              earliestDateTime = eventDateTime;
              nextEvent = {
                id: doc.id,
                name: data.name,
                venue: data.venue,
                image: data.image,
                date: eventDate,
              };
            }
          }
        }

        callback(nextEvent);
      },
      error => {
        console.error("Error in next upcoming event listener:", error);
        callback(null);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up next upcoming event listener:", error);
    throw error;
  }
};

const fetchCreatorsEvent = (callback: (creators: any[]) => void) => {
  try {
    const db = getFirestore();
    const creatorsRef = collection(db, "creator");
    const eventsRef = collection(db, "events");

    const now = new Date();

    const unsubscribeCreators = onSnapshot(creatorsRef, creatorsSnapshot => {
      const unsubscribeEvents = onSnapshot(eventsRef, eventsSnapshot => {
        const events = eventsSnapshot.docs.map(
          (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as any[];

        const upcomingEvents = events.filter(event => {
          const eventDate = formatDate(event.date);
          const eventTime = formatDate(event.time);

          if (!eventDate) return false;

          let eventDateTime = new Date(eventDate);
          if (eventTime) {
            eventDateTime.setHours(
              eventTime.getHours(),
              eventTime.getMinutes(),
              eventTime.getSeconds(),
              eventTime.getMilliseconds()
            );
          }

          return eventDateTime > now;
        });

        const creatorIdsWithUpcomingEvents = new Set(
          upcomingEvents
            .map(event => event.creator?.id || event.creator?.value)
            .filter(Boolean)
        );

        const creatorsWithUpcomingEvents = creatorsSnapshot.docs
          .map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((creator: any) =>
            creatorIdsWithUpcomingEvents.has(creator.id)
          );

        callback(creatorsWithUpcomingEvents);
      });

      return () => {
        unsubscribeEvents();
      };
    });

    return unsubscribeCreators;
  } catch (error) {
    console.error("Error setting up creators listener:", error);
    throw error;
  }
};

const fetchAllFutureEvents = (callback: (events: any[]) => void) => {
  try {
    const db = getFirestore();
    const eventsRef = collection(db, "events");

    const now = new Date();

    const unsubscribe = onSnapshot(
      eventsRef,
      snapshot => {
        const events = snapshot.docs.map(
          (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as any[];

        const futureEvents = events.filter(event => {
          const eventDate = formatDate(event.date);
          const eventTime = formatDate(event.time);

          if (!eventDate) return false;

          let eventDateTime = new Date(eventDate);
          if (eventTime) {
            eventDateTime.setHours(
              eventTime.getHours(),
              eventTime.getMinutes(),
              eventTime.getSeconds(),
              eventTime.getMilliseconds()
            );
          }

          return eventDateTime > now;
        });

        futureEvents.sort((a, b) => {
          const dateA = formatDate(a.date);
          const timeA = formatDate(a.time);
          const dateB = formatDate(b.date);
          const timeB = formatDate(b.time);

          if (!dateA || !dateB) return 0;

          let dateTimeA = new Date(dateA);
          let dateTimeB = new Date(dateB);

          if (timeA) {
            dateTimeA.setHours(
              timeA.getHours(),
              timeA.getMinutes(),
              timeA.getSeconds(),
              timeA.getMilliseconds()
            );
          }

          if (timeB) {
            dateTimeB.setHours(
              timeB.getHours(),
              timeB.getMinutes(),
              timeB.getSeconds(),
              timeB.getMilliseconds()
            );
          }

          return dateTimeA.getTime() - dateTimeB.getTime();
        });

        callback(futureEvents);
      },
      error => {
        console.error("Error in future events listener:", error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up future events listener:", error);
    throw error;
  }
};

const fetchEventsByCreatorId = (
  creatorId: string,
  callback: (events: any[]) => void
) => {
  try {
    const db = getFirestore();
    const eventsRef = collection(db, "events");

    const now = new Date();

    const unsubscribe = onSnapshot(
      eventsRef,
      snapshot => {
        const events = snapshot.docs.map(
          (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as any[];

        const creatorEvents = events.filter(event => {
          // Check if the event belongs to the specified creator
          const eventCreatorId = event.creator?.id || event.creator?.value;
          if (eventCreatorId !== creatorId) return false;

          // Filter to only future events
          const eventDate = formatDate(event.date);
          const eventTime = formatDate(event.time);

          if (!eventDate) return false;

          let eventDateTime = new Date(eventDate);
          if (eventTime) {
            eventDateTime.setHours(
              eventTime.getHours(),
              eventTime.getMinutes(),
              eventTime.getSeconds(),
              eventTime.getMilliseconds()
            );
          }

          return eventDateTime > now;
        });

        // Sort events by date and time (earliest first)
        creatorEvents.sort((a, b) => {
          const dateA = formatDate(a.date);
          const timeA = formatDate(a.time);
          const dateB = formatDate(b.date);
          const timeB = formatDate(b.time);

          if (!dateA || !dateB) return 0;

          let dateTimeA = new Date(dateA);
          let dateTimeB = new Date(dateB);

          if (timeA) {
            dateTimeA.setHours(
              timeA.getHours(),
              timeA.getMinutes(),
              timeA.getSeconds(),
              timeA.getMilliseconds()
            );
          }

          if (timeB) {
            dateTimeB.setHours(
              timeB.getHours(),
              timeB.getMinutes(),
              timeB.getSeconds(),
              timeB.getMilliseconds()
            );
          }

          return dateTimeA.getTime() - dateTimeB.getTime();
        });

        callback(creatorEvents);
      },
      error => {
        console.error("Error in creator events listener:", error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up creator events listener:", error);
    throw error;
  }
};

const fetchEventById = (
  eventId: string,
  callback: (event: any | null) => void
) => {
  try {
    const db = getFirestore();
    const eventsRef = collection(db, "events");

    const unsubscribe = onSnapshot(
      eventsRef,
      snapshot => {
        const event = snapshot.docs
          .map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .find((doc: any) => doc.id === eventId) as any;

        callback(event || null);
      },
      error => {
        console.error("Error in event by ID listener:", error);
        callback(null);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up event by ID listener:", error);
    throw error;
  }
};

const updateEvent = async (eventId: string, updateData: any) => {
  try {
    const db = getFirestore();
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, updateData);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

const fetchEventTicketInfo = (
  eventId: string,
  callback: (
    ticketInfo: {
      normalTicket: number;
      vipTicket: number;
      normalTicketSold: number;
      vipTicketSold: number;
      normalTicketPrice: number;
      vipTicketPrice: number;
    } | null
  ) => void
) => {
  try {
    const db = getFirestore();
    const eventsRef = collection(db, "events");

    const unsubscribe = onSnapshot(
      eventsRef,
      snapshot => {
        const event = snapshot.docs
          .map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .find((doc: any) => doc.id === eventId) as any;

        if (!event) {
          callback(null);
          return;
        }

        const ticketInfo = {
          normalTicket: event.normalTicket || 0,
          vipTicket: event.vipTicket || 0,
          normalTicketSold: event.normalTicketSold || 0,
          vipTicketSold: event.vipTicketSold || 0,
          normalTicketPrice: event.normalPrice || 0,
          vipTicketPrice: event.vipPrice || 0,
        };

        callback(ticketInfo);
      },
      error => {
        console.error("Error in event ticket info listener:", error);
        callback(null);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up event ticket info listener:", error);
    throw error;
  }
};

export {
  fetchAllFutureEvents,
  fetchCreatorsEvent,
  fetchEventById,
  fetchEventsByCreatorId,
  fetchEventTicketInfo,
  fetchNextUpcomingEvent,
  formatDate,
  updateEvent,
};
