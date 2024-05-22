export const DATABASES = {
  GOVERNMENT: "government",
  LOGS: "logs",
  CENSUS: "census",
  EQUIPMENTS: "equipments",
  API_KEY: "API_Key",
  NEWSLETTER: {
    DATABASE: "newsletter",
    NEWS: "News",
    SENDER: "Sender",
    SUBSCRIBER: "Subscriber",
    NEWS_JOBS: "NewsJob",
  },
  BACKGROUND_JOBS: {
    DATABASE: "postgres",
    SCHEMA: "pgboss",
    TABLES: {
      SCHEDULE: "pgboss.schedule",
      JOB: "pgboss.job",
    },
  },
  MANAGEMENT: {
    DATABASE: "management",
    SCHEMA: "public",
    TABLES: {
      STUDIES: "Studies",
      WEIGHTS: "Weights",
      PHYSICS_CHARACTERISTICS: "Physics_Characteristics",
      CHEMICAL_CHARACTERISTICS: "Chemical_Characteristics",
      CROP_CYCLE: "Crop_Cycle",
      SOIL: "Soil",
      CROP: "Crop",
    },
  },
};
