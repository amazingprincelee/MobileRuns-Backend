import mongoose from "mongoose";

const waitListSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  location: String,
  role: {
    type: String,
    enum: [
      "client",
      "other",
      "house cleaner",
      "house_cleaner",
      "house helper",
      "house_helper",
      "care giver",
      "care_giver",
      "lawyer",
      "plumber",
      "electrician",
      "waste collector",
      "waste_collector",
      "mason man",
      "mason_man",
      "iron bender",
      "iron_bender",
      "capenter",
      "gmp man",
      "gmp_man",
      "solar installer",
      "solar_installer",
      "solar_dealer",
      "solar dealer",
      "dstv_&_gotv_installer",
      "cable_satellite_installer",
      "laborer",
      "mechanic",
      "welder",
    ],
  },
  createdAt: { type: Date, default: Date.now },
});

const WaitList = mongoose.model("WaitList", waitListSchema);

export default WaitList;
