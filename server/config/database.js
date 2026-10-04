const {
  MongoClient,
} = require("mongodb");

const seedWorkflows =
  require("../data/workflows");

let client;
let db;

async function connectDatabase() {
  if (db) {
    return db;
  }

  const uri =
    process.env.MONGODB_URI;

  const dbName =
    process.env.MONGODB_DB_NAME ||
    "flowguard";

  if (!uri) {
    throw new Error(
      "MONGODB_URI is missing from .env"
    );
  }

  client = new MongoClient(uri);

  await client.connect();

  db = client.db(dbName);

  await initializeCollections();

  console.log(
    `MongoDB connected: ${dbName}`
  );

  return db;
}

async function initializeCollections() {
  const workflowsCollection =
    db.collection("workflows");

  const executionsCollection =
    db.collection("executions");

  await workflowsCollection.createIndex({
    id: 1,
  }, {
    unique: true,
  });

  await executionsCollection.createIndex({
    executionId: 1,
  }, {
    unique: true,
  });

  await executionsCollection.createIndex({
    workflowId: 1,
    startedAt: -1,
  });

  const workflowCount =
    await workflowsCollection.countDocuments();

  if (workflowCount === 0) {
    const preparedWorkflows =
      seedWorkflows.map(
        (workflow) => {
          const executions =
            Number(
              workflow.executions || 0
            );

          const successRate =
            Number(
              workflow.successRate || 0
            );

          const successfulExecutions =
            Math.round(
              executions *
                (successRate / 100)
            );

          const failedExecutions =
            Math.max(
              executions -
                successfulExecutions,
              0
            );

          return {
            ...workflow,

            successfulExecutions,

            failedExecutions,

            createdAt:
              new Date(),

            updatedAt:
              new Date(),
          };
        }
      );

    await workflowsCollection.insertMany(
      preparedWorkflows
    );

    console.log(
      `Seeded ${preparedWorkflows.length} workflows into MongoDB.`
    );
  }
}

function getDatabase() {
  if (!db) {
    throw new Error(
      "Database is not connected."
    );
  }

  return db;
}

function getWorkflowsCollection() {
  return getDatabase().collection(
    "workflows"
  );
}

function getExecutionsCollection() {
  return getDatabase().collection(
    "executions"
  );
}

async function closeDatabase() {
  if (client) {
    await client.close();

    client = null;
    db = null;
  }
}

module.exports = {
  connectDatabase,
  getDatabase,
  getWorkflowsCollection,
  getExecutionsCollection,
  closeDatabase,
};