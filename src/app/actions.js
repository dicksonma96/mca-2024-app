"use server";

import getDatabase from "@/app/lib/mongo/mongoConnection";
import { ObjectId } from "mongodb";
import readCsv from "./lib/utils/readCsv";

export async function updateConfig(customData, formdata) {
  try {
    const db = await getDatabase();
    const collection = db.collection("event_config");
    const data = await collection.updateOne(
      {},
      {
        $set: {
          "best_dress.status": customData.status,
          "best_dress.nominee.female": customData.nominee.female,
          "best_dress.nominee.male": customData.nominee.male,
          "best_dress.winner.female": customData.winner.female,
          "best_dress.winner.male": customData.winner.male,
        },
      }
    );

    return { data: "test", success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
}

export async function resetConfig() {
  try {
    const db = await getDatabase();
    const collection = await db.collection("event_config");
    await collection.updateMany(
      {},
      {
        $set: {
          "best_dress.status": "0",
          "best_dress.nominee.female": [],
          "best_dress.nominee.male": [],
          "best_dress.winner.female": [],
          "best_dress.winner.male": [],
          "quizzes.status": "0",
          "quizzes.winner": "",
        },
      }
    );

    if (data.modifiedCount == 0) throw { message: "Update failed" };

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function SignIn(formdata) {
  try {
    const db = await getDatabase();
    const collection = await db.collection("users");
    let data = await collection
      .aggregate([
        {
          $match: { seat: formdata.get("seat").toUpperCase() },
        },
        {
          $lookup: {
            from: "best_dress_vote",
            localField: "seat",
            foreignField: "seat",
            as: "bestDressVote",
          },
        },
        {
          $lookup: {
            from: "quizzes_answer",
            let: {
              submit_id: "$seat",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$seat", "$$submit_id"],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  answer: 1,
                },
              },
            ],
            as: "quiz_answer",
          },
        },
      ])
      .toArray();
    console.log(data);

    if (!data.length)
      return { success: false, message: "Seat number not found!" };

    data = JSON.parse(JSON.stringify(data[0]));
    return { data: data, success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
}

export async function SubmitVote(formdata) {
  try {
    const db = await getDatabase();
    const collection = await db.collection("best_dress_vote");
    let checkExistedVote = await collection.findOne({
      seat: formdata.get("seat").toUpperCase(),
    });
    if (checkExistedVote)
      return { success: false, message: "You've already Voted" };

    let data = await collection.insertOne({
      seat: formdata.get("seat").toUpperCase(),
      male: formdata.get("male"),
      female: formdata.get("female"),
    });

    return { data: data, success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function ResetVote() {
  try {
    const db = await getDatabase();
    const collection = await db.collection("best_dress_vote");
    await collection.deleteMany({});

    if (data.modifiedCount == 0) throw { message: "Update failed" };

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function CreateUser(formdata) {
  try {
    const db = await getDatabase();

    const collection = await db.collection("users");
    let data = await collection.insertOne({
      name: formdata.get("name"),
      brand: formdata.get("brand"),
      title: formdata.get("title"),
      seat: formdata.get("seat"),
    });
    if (data.modifiedCount == 0) throw { message: "Update failed" };

    return { data: data, success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
}

export async function UpdateUser(formdata) {
  try {
    const db = await getDatabase();
    const collection = await db.collection("users");
    let data = await collection.updateOne(
      {
        _id:ObjectId.createFromHexString(formdata.get("_id")),
      },
      {
        $set: {
          seat:formdata.get("seat"),
          name: formdata.get("name"),
          brand: formdata.get("brand"),
          title: formdata.get("title"),
          seat: formdata.get("seat"),
        },
      }
    );
    if (data.modifiedCount == 0) throw { message: "Update failed" };

    return { data: data, success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
}

export async function DeleteUser(formdata) {
  try {
    const db = await getDatabase();
    const collection = await db.collection("users");
    let data = await collection.deleteOne({
      seat: formdata.get("seat"),
    });
    if (data.modifiedCount == 0) throw { message: "Delete failed" };

    return { data: data, success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
}

export async function UploadUser(formdata) {
  try {
    const db = await getDatabase();
    const collection = await db.collection("users");
    let file = formdata.get("file");
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let dataArray = await readCsv(buffer);
    const fields = ["name", "brand", "title", "seat"];
    if (Object.keys(dataArray[0]).some((f) => !fields.includes(f)))
      return { success: false, message: "Invalid field format" };

    await collection.deleteMany({});

    let data = await collection.insertMany(dataArray);
    await resetConfig();
    if (data.modifiedCount == 0) throw { message: "Update failed" };

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
}

export async function UpdateQuizStatus(formdata) {
  try {
    const db = await getDatabase();
    const collection = await db.collection("event_config");
    let data = await collection.updateOne(
      {},
      {
        $set: {
          "quizzes.status": formdata.get("status"),
          "quizzes.winner": formdata.get("winner"),
        },
      }
    );
    if (data.modifiedCount == 0) throw { message: "Update failed" };

    return { data: data, success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
}

export async function UpdateQuiz(formdata) {
  try {
    const db = await getDatabase();
    const collection = await db.collection("quizzes");
    let data = await collection.updateOne(
      {
        _id: ObjectId.createFromHexString(formdata.get("_id")) ,
      },
      {
        $set: {
          question: formdata.get("question"),
          options: JSON.parse(formdata.get("options")),
          answer: parseInt(formdata.get("answer")),
        },
      }
    );
    if (data.modifiedCount == 0) throw { message: "Update failed" };

    return { data: data, success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
}

export async function SubmitAnswer(formdata) {
  try {
    const db = await getDatabase();
    const collection = await db.collection("quizzes_answer");
    let checkExistedVote = await collection.findOne({
      seat: formdata.get("seat").toUpperCase(),
    });
    if (checkExistedVote)
      return { success: false, message: "You've already answered before" };

    let data = await collection.insertOne({
      seat: formdata.get("seat").toUpperCase(),
      answer: JSON.parse(formdata.get("answer")),
    });

    return { data: data, success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function ResetQuizAnswer() {
  try {
    const db = await getDatabase();
    const collection = await db.collection("quizzes_answer");
    await collection.deleteMany({});

    if (data.modifiedCount == 0) throw { message: "Update failed" };

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
