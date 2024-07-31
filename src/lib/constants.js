import moment from "moment";

export const stages = {
  HOMEPAGE: "homepage",
  FIND_A_RIDE: "find_a_ride",
  REQUEST_A_UHAUL: "request_a_uhaul",
  ARRIVAL_DETAILS: "arrival_details",
  ARRIVAL_DETAILS_TIME: "arrival_details_time",
  NUMBER_OF_PASSENGERS: "number_of_passengers",
  NUMBER_OF_BAGS: "number_of_bags",
  REQUEST_DETAILS: "request_details",
  SOURCE_DESTINATION: "source_destination",
  CONTACT_INFO: "contact_info",
  CONFIRMATION: "confirmation",
};

export const navigation = {
  [stages.HOMEPAGE]: {
    next: stages.FIND_A_RIDE,
    prev: stages.HOMEPAGE,
  },
  [stages.FIND_A_RIDE]: {
    next: stages.ARRIVAL_DETAILS,
    prev: stages.HOMEPAGE,
  },
  [stages.REQUEST_A_UHAUL]: {
    next: stages.ARRIVAL_DETAILS,
    prev: stages.HOMEPAGE,
  },
  [stages.ARRIVAL_DETAILS]: {
    next: stages.REQUEST_DETAILS,
    prev: stages.HOMEPAGE,
  },
  //   [stages.ARRIVAL_DETAILS_TIME]: {
  //     next: stages.REQUEST_DETAILS,
  //     prev: stages.ARRIVAL_DETAILS,
  //   },
  //   [stages.LOOKING_FOR]: {
  //     next: stages.REQUEST_DETAILS,
  //     prev: stages.ARRIVAL_DETAILS,
  //   },
  [stages.REQUEST_DETAILS]: {
    next: stages.SOURCE_DESTINATION,
    prev: stages.ARRIVAL_DETAILS,
  },
  [stages.SOURCE_DESTINATION]: {
    next: stages.CONTACT_INFO,
    prev: stages.REQUEST_DETAILS,
  },
  [stages.CONTACT_INFO]: {
    next: stages.CONFIRMATION,
    prev: stages.SOURCE_DESTINATION,
  },
  [stages.CONFIRMATION]: {
    next: null,
    prev: stages.CONTACT_INFO,
  },
};

export const LookingFor = {
  PASSENGERS: "passengers",
  RIDE: "ride",
};

export const P2PServices = {
  FIND_A_RIDE: "find_a_ride",
  REQUEST_A_UHAUL: "request_uhaul",
};

export const sampleNames = [
  "Adriana C. Ocampo Uria",
  "Albert Einstein",
  "Anna K. Behrensmeyer",
  "Blaise Pascal",
  "Caroline Herschel",
  "Cecilia Payne-Gaposchkin",
  "Chien-Shiung Wu",
  "Dorothy Hodgkin",
  "Edmond Halley",
  "Edwin Powell Hubble",
  "Elizabeth Blackburn",
  "Enrico Fermi",
  "Erwin Schroedinger",
];

export const otherSourceLocation = "I'm getting a bus / (Other)";
export const sourceLocations = [
  "Pittsburgh International Airport",
  "Allegheny County Airport",
  "Pittsburgh Union Station",
  "Amtrak Station - PGH",
  otherSourceLocation,
];

export const trolleyCounts = [2, 4, 6, "More than 8"];
export const peopleCounts = [1, 2, 3, 4];

export const peopleLandingInSameTimeSlot = [
  { fullName: "Abhishek Sankar", phone: "+91 9846105644" },
  { fullName: "Maria Curie", phone: "+91 9846105644" },
  { fullName: "Isaac Newton", phone: "+91 9846105644" },
  { fullName: "Galileo Galilei", phone: "+91 9846105644" },
  { fullName: "Nikola Tesla", phone: "+91 9846105644" },
];

export const whatsappTextBaseUrl = "https://api.whatsapp.com/send?text=";
export const createWhatsAppLinkForCarpool = ({
  phone,
  senderName,
  receiverName,
  source,
}) =>
  `https://wa.me/${phone.replace(/\s+/g, "")}?text=Hi ${
    receiverName.split(" ")[0]
  }! I'm ${senderName} and I noticed on P2P that we both arrive in ${source} at about the same time. Would you like to tag along to save money and maybe make new friends?`;

export const createWhatsAppLinkForUhaul = ({
  phone,
  senderName,
  receiverName,
  date,
  receiverDate,
}) =>
  `https://wa.me/${phone.replace(/\s+/g, "")}?text=Hi ${
    receiverName.split(" ")[0]
  }! I'm ${senderName} and I noticed on P2P that we both seem to need a UHaul at about the same time (I was looking to rent it on ${moment(
    date,
    "DD-MM-YYYY"
  ).format("Do MMM")} 
 	${
    date === receiverDate
      ? `and noticed you wanted it on ${moment(
          receiverDate,
          "DD-MM-YYYY"
        ).format("Do MMM")})`
      : `and noticed you wanted it on the same day too!`
  } 
  . Would you like to tag along to save money and maybe make new friends?`;

export const ENDPOINTS = {
  POST_RegistrationSuccess: "/registrationSuccess",
  POST_GenerateToken: "/generateToken",
  POST_UserProfileComplete: "/userProfileComplete",
  POST_UserEligibleForUHaulRequest: "/userEligibleForUHaulRequest",
  POST_CarPoolRequest: "/carPoolRequest",
  POST_UHaulRequest: "/uHaulRequest",
  POST_GetAllCarPoolRequests: "/getAllCarPoolRequests",
  POST_OfferCarPool: "/offerCarPool",
  POST_GetMyCarPoolOffers: "/getMyCarPoolOffers",
  POST_UpdateUserProfile: "/updateUserProfile",
  POST_GetUserProfileDetails: "/getUserProfileDetails",
  POST_GetFlags: "/getFlags",
  POST_GetAllUHaulRequests: "/getAllUHaulRequests",
  POST_GetMyUHaulOffers: "/getMyUHaulOffers",
};

export const areasAroundCarnegieMellonUniversity = [
  "Bedford Dwellings",
  "Bloomfield",
  "Bluff",
  "Central Business District (Downtown)",
  "Central Lawrenceville",
  "Central Oakland",
  "East Hills",
  "East Liberty",
  "Garfield",
  "Greenfield",
  "Highland Park",
  "Homewood North",
  "Homewood South",
  "Lincoln-Lemington-Belmar",
  "Lower Lawrenceville",
  "Middle Hill",
  "North Oakland",
  "Other",
  "Point Breeze",
  "Polish Hill",
  "Shadyside",
  "South Oakland",
  "South Side Flats",
  "Squirrel Hill North",
  "Squirrel Hill South",
  "Stanton Heights",
  "Strip District",
  "Swisshelm Park",
  "Terrace Village",
  "Upper Hill",
  "West Oakland",
];

export const stepNumbers = {
  [stages.ARRIVAL_DETAILS]: 1,
  [stages.REQUEST_DETAILS]: 2,
  [stages.SOURCE_DESTINATION]: 3,
  [stages.CONTACT_INFO]: 4,
};
