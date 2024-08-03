import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import getDatabase from "@/app/lib/mongo/mongoConnection";

export async function GET() {
  noStore();
  try {
    const db = await getDatabase();
    const eventConfig = db.collection("event_config");
    const voteCount = await eventConfig
      .aggregate([
        {
          $addFields: {
            "best_dress.nominee.all": {
              $concatArrays: [
                "$best_dress.nominee.female",
                "$best_dress.nominee.male",
              ],
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "best_dress.nominee.all",
            foreignField: "seat",
            as: "nominee",
          },
        },
        {
          $project: {
            nominee: 1,
          },
        },
        {
          $unwind: "$nominee",
        },
        {
          $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT", "$nominee"] } },
        },
        {
          $lookup: {
            from: "best_dress_vote",
            let: { seat: "$seat" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ["$female", "$$seat"] },
                      { $eq: ["$male", "$$seat"] },
                    ],
                  },
                },
              },
            ],
            as: "my_vote",
          },
        },
        {
          $addFields: {
            vote: { $size: "$my_vote" },
          },
        },
        {
          $project: {
            nominee: 0, // Exclude the nominee field
            my_vote: 0,
          },
        },
      ])
      .toArray();
    return NextResponse.json(
      {
        data: {
          female: voteCount.filter(
            (item) => item.title != "Mr" || item.title != "Dr_M"
          ),
          male: voteCount.filter((item) => item.title == "Mr"),
        },
        success: true,
      },
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
