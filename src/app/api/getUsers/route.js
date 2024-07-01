import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import getDatabase from "@/app/lib/mongo/mongoConnection";

export async function GET() {
  noStore();
  try {
    const db = await getDatabase();

    const users = db.collection("users");
    const usersList = await users
      .aggregate([
        {
          $lookup: {
            from: "quizzes",
            pipeline: [
              {
                $group: {
                  _id: null,
                  answers: { $push: "$answer" },
                },
              },
              {
                $unwind: "$answers",
              },
              {
                $group: {
                  _id: null,
                  quizzes_answer: { $push: "$answers" },
                },
              },
              {
                $project: {
                  _id: 0,
                  quizzes_answer: 1,
                },
              },
            ],
            as: "quizzes_answer",
          },
        },
        {
          $unwind: "$quizzes_answer",
        },
        {
          $set: {
            quizzes_answer: "$quizzes_answer.quizzes_answer",
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
            as: "my_answer",
          },
        },
        {
          $set: {
            my_answer: {
              $cond: {
                if: { $gt: [{ $size: "$my_answer" }, 0] },
                then: { $arrayElemAt: ["$my_answer.answer", 0] },
                else: [],
              },
            },
          },
        },
        {
          $addFields: {
            eligible: {
              $cond: [
                { $eq: ["$quizzes_answer", "$my_answer"] }, // Check if array1 is equal to array2
                1, // Set eligible to 1 if arrays are equal
                {
                  $cond: {
                    if: { $gt: [{ $size: "$my_answer" }, 0] },
                    then: 2, // Set eligible to 0 if array is empty
                    else: 0, // Set eligible to 2 if array is not empty
                  },
                },
              ],
            },
          },
        },
      ])
      .toArray();

    return NextResponse.json(
      { data: usersList, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
