import mongoose from "mongoose";
import { getEnvironment } from "../../../src/config/env";
import { Language, Translation } from "../../../src/models/translatorModels";

const { mongoUri } = getEnvironment();

const populateTranslations = async () => {
  await mongoose.connect(mongoUri);
  console.log("Mongoose connection stablished");

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
  ];

  const translations = [
    { key: "hello", translations: new Map([ ["en", "Hello"], ["es", "Hola"], ["fr", "Bonjour"] ]) },
    { key: "welcome", translations: new Map([ ["en", "Welcome"], ["es", "Bienvenido"], ["fr", "Bienvenue"] ]) },
  ];

  await Language.insertMany(languages);
  await Translation.insertMany(translations);
  
  console.log("Database populated successfully");
  mongoose.disconnect();
}

populateTranslations();