import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import getDatabase from "@/app/lib/mongo/mongoConnection";
import { ObjectId } from "mongodb";

export async function GET(request) {
  noStore();
  let role = request.nextUrl.searchParams.get("role");
  console.log(role);
  try {
    const db = await getDatabase();
    const collection = db.collection("event_config");
    // const data = await collection.find({}, { _id: 0 }).toArray();

    const quizPipeline =
      role == "admin"
        ? []
        : [
            {
              $project: {
                answer: 0,
              },
            },
          ];

    const data = await collection
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "best_dress.nominee.female",
            foreignField: "seat",
            as: "best_dress.nominee.female",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "best_dress.nominee.male",
            foreignField: "seat",
            as: "best_dress.nominee.male",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "best_dress.winner.female",
            foreignField: "seat",
            as: "best_dress.winner.female",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "best_dress.winner.male",
            foreignField: "seat",
            as: "best_dress.winner.male",
          },
        },
        {
          $lookup: {
            from: "quizzes",
            let: {
              quiz_id: {
                $map: {
                  input: "$quizId",
                  in: { $toObjectId: "$$this" },
                },
              },
            },

            pipeline: [
              {
                $match: {
                  $expr: [
                    {
                      _id: "$$quiz_id",
                    },
                  ],
                },
              },
              ...quizPipeline,
            ],
            as: "quizzes.quiz",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "quizzes.winner",
            foreignField: "seat",
            as: "quizzes.winner",
          },
        },
      ])
      .toArray();

    return NextResponse.json({ data: data[0], success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
