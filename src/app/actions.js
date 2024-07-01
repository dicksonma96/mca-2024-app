"use server";

import getDatabase from "@/app/lib/mongo/mongoConnection";
import { ObjectId } from "mongodb";

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

export async function CreateUser(formdata) {
  try {
    const db = await getDatabase();

    const collection = await db.collection("users");
    let data = await collection.insertOne({
      name: formdata.get("name"),
      brand: formdata.get("brand"),
      title: formdata.get("title"),
      seat: formdata.get("seat"),
      rsvp: formdata.get("rsvp"),
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
        seat: formdata.get("seat"),
      },
      {
        $set: {
          name: formdata.get("name"),
          brand: formdata.get("brand"),
          title: formdata.get("title"),
          seat: formdata.get("seat"),
          rsvp: formdata.get("rsvp"),
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

export async function UpdateQuizStatus(formdata) {
  try {
    const db = await getDatabase();
    const collection = await db.collection("event_config");
    let data = await collection.updateOne(
      {},
      {
        $set: { "quizzes.status": formdata.get("status") },
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
        _id: new ObjectId(formdata.get("_id")),
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
