import { SCHEMA_FIELD_TYPE } from "redis";
import redisClient from "../../lib/redis.ts";

export const initializeIndexes = async () => {
  await submissionIndex();
};

const submissionIndex = async () => {
  try {
    await redisClient.ft.dropIndex("idx:submissions");
  } catch (err) {
    console.error(err);
  }

  await redisClient.ft.create(
    "idx:submissions",
    {
      "$.roomId": {
        type: SCHEMA_FIELD_TYPE.TEXT,
        AS: "roomId",
      },
      "$.questionId": {
        type: SCHEMA_FIELD_TYPE.TEXT,
        AS: "questionId",
      },
      "$.userId": {
        type: SCHEMA_FIELD_TYPE.TEXT,
        AS: "userId",
      },
    },
    {
      ON: "JSON",
      PREFIX: "submission:",
    },
  );
};
