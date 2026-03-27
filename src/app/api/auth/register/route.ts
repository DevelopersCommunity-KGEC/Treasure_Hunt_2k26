import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../_config/connectDb";
import Team from "../../_model/team.model";
import { z } from "zod";

const teamReqBodySchema = z.object({
  teamId: z.string(),
  teamName: z.string(),
  teamMembers: z.array(z.string()),
});

// const availableSpotArrays: string[][] = [["lgwfnuye","bepvjpib","bxzjjauk","eqxnavaw","pdzreluo"],["lgwfnuye","oucmephl","lidcvrim","vzbsvtzx","uvhtxtsy"],["lgwfnuye","wuighkph","zlhxfvkh","ndatjykr","poumczad"],["lgwfnuye","ybniepsb","bxzjjauk","nkdsdhcg","pdzreluo"],["lpwdgkkh","bepvjpib","lidcvrim","eqxnavaw","uvhtxtsy"],["lpwdgkkh","oucmephl","zlhxfvkh","vzbsvtzx","poumczad"],["lpwdgkkh","wuighkph","bxzjjauk","ndatjykr","pdzreluo"],["lpwdgkkh","ybniepsb","lidcvrim","nkdsdhcg","uvhtxtsy"],["ygogwhvu","vzbsvtzx","zlhxfvkh","ybniepsb","poumczad"],["ygogwhvu","eqxnavaw","bxzjjauk","wuighkph","pdzreluo"],["ygogwhvu","nkdsdhcg","lidcvrim","bepvjpib","uvhtxtsy"],["ygogwhvu","ndatjykr","zlhxfvkh","oucmephl","poumczad"],["gfpltyls","vzbsvtzx","bxzjjauk","ybniepsb","pdzreluo"],["gfpltyls","eqxnavaw","lidcvrim","wuighkph","uvhtxtsy"],["gfpltyls","nkdsdhcg","zlhxfvkh","bepvjpib","poumczad"],["gfpltyls","ndatjykr","bxzjjauk","oucmephl","pdzreluo"],["oucmephl","zlhxfvkh","uvhtxtsy","eqxnavaw","lgwfnuye"],["bepvjpib","lidcvrim","poumczad","vzbsvtzx","gfpltyls"],["wuighkph","bxzjjauk","poumczad","ndatjykr","lpwdgkkh"],["ybniepsb","bxzjjauk","pdzreluo","nkdsdhcg","ygogwhvu"],["oucmephl","zlhxfvkh","uvhtxtsy","eqxnavaw","lgwfnuye"],["bepvjpib","lidcvrim","pdzreluo","nkdsdhcg","gfpltyls"],["wuighkph","bxzjjauk","poumczad","vzbsvtzx","lpwdgkkh"],["ybniepsb","lidcvrim","uvhtxtsy","ndatjykr","ygogwhvu"],["nkdsdhcg","zlhxfvkh","uvhtxtsy","ybniepsb","lgwfnuye"],["ndatjykr","lidcvrim","poumczad","wuighkph","gfpltyls"],["vzbsvtzx","bxzjjauk","uvhtxtsy","bepvjpib","lpwdgkkh"],["eqxnavaw","lidcvrim","pdzreluo","oucmephl","lgwfnuye"],["nkdsdhcg","zlhxfvkh","uvhtxtsy","ybniepsb","ygogwhvu"],["ndatjykr","lidcvrim","pdzreluo","oucmephl","gfpltyls"],["vzbsvtzx","zlhxfvkh","poumczad","bepvjpib","ygogwhvu"],["eqxnavaw","bxzjjauk","uvhtxtsy","wuighkph","lpwdgkkh"],["lgwfnuye","pdzreluo","ndatjykr","lidcvrim","ybniepsb"],["lpwdgkkh","pdzreluo","nkdsdhcg","bxzjjauk","wuighkph"],["ygogwhvu","pdzreluo","vzbsvtzx","zlhxfvkh","bepvjpib"],["gfpltyls","poumczad","eqxnavaw","lidcvrim","oucmephl"],["lgwfnuye","poumczad","ndatjykr","bxzjjauk","ybniepsb"],["lpwdgkkh","poumczad","nkdsdhcg","zlhxfvkh","wuighkph"],["ygogwhvu","uvhtxtsy","vzbsvtzx","lidcvrim","bepvjpib"],["gfpltyls","uvhtxtsy","eqxnavaw","bxzjjauk","oucmephl"],["lgwfnuye","uvhtxtsy","bepvjpib","zlhxfvkh","eqxnavaw"],["lpwdgkkh","poumczad","oucmephl","lidcvrim","vzbsvtzx"],["ygogwhvu","poumczad","wuighkph","bxzjjauk","ndatjykr"],["gfpltyls","uvhtxtsy","ybniepsb","zlhxfvkh","nkdsdhcg"],["lgwfnuye","pdzreluo","bepvjpib","lidcvrim","eqxnavaw"],["lpwdgkkh","pdzreluo","oucmephl","bxzjjauk","vzbsvtzx"],["ygogwhvu","uvhtxtsy","wuighkph","zlhxfvkh","ndatjykr"],["gfpltyls","pdzreluo","ybniepsb","lidcvrim","nkdsdhcg"],["pdzreluo","eqxnavaw","bxzjjauk","bepvjpib","lgwfnuye"],["uvhtxtsy","vzbsvtzx","lidcvrim","oucmephl","lgwfnuye"],["poumczad","ndatjykr","zlhxfvkh","wuighkph","lgwfnuye"],["pdzreluo","nkdsdhcg","bxzjjauk","ybniepsb","lgwfnuye"],["uvhtxtsy","eqxnavaw","lidcvrim","bepvjpib","lpwdgkkh"],["poumczad","vzbsvtzx","zlhxfvkh","oucmephl","lpwdgkkh"],["pdzreluo","ndatjykr","bxzjjauk","wuighkph","lpwdgkkh"],["uvhtxtsy","nkdsdhcg","lidcvrim","ybniepsb","lpwdgkkh"],["poumczad","ybniepsb","zlhxfvkh","vzbsvtzx","ygogwhvu"],["pdzreluo","wuighkph","bxzjjauk","eqxnavaw","ygogwhvu"],["uvhtxtsy","bepvjpib","lidcvrim","nkdsdhcg","ygogwhvu"],["poumczad","oucmephl","zlhxfvkh","ndatjykr","ygogwhvu"],["pdzreluo","ybniepsb","bxzjjauk","vzbsvtzx","gfpltyls"],["uvhtxtsy","wuighkph","lidcvrim","eqxnavaw","gfpltyls"],["poumczad","bepvjpib","zlhxfvkh","nkdsdhcg","gfpltyls"],["pdzreluo","oucmephl","bxzjjauk","ndatjykr","gfpltyls"],["lgwfnuye","eqxnavaw","uvhtxtsy","zlhxfvkh","oucmephl"],["gfpltyls","vzbsvtzx","poumczad","lidcvrim","bepvjpib"],["lpwdgkkh","ndatjykr","poumczad","bxzjjauk","wuighkph"],["ygogwhvu","nkdsdhcg","pdzreluo","bxzjjauk","ybniepsb"],["lgwfnuye","eqxnavaw","uvhtxtsy","zlhxfvkh","oucmephl"],["gfpltyls","nkdsdhcg","pdzreluo","lidcvrim","bepvjpib"],["lpwdgkkh","vzbsvtzx","poumczad","bxzjjauk","wuighkph"],["ygogwhvu","ndatjykr","uvhtxtsy","lidcvrim","ybniepsb"],["lgwfnuye","ybniepsb","uvhtxtsy","zlhxfvkh","nkdsdhcg"],["gfpltyls","wuighkph","poumczad","lidcvrim","ndatjykr"],["lpwdgkkh","bepvjpib","uvhtxtsy","bxzjjauk","vzbsvtzx"],["lgwfnuye","oucmephl","pdzreluo","lidcvrim","eqxnavaw"],["ygogwhvu","ybniepsb","uvhtxtsy","zlhxfvkh","nkdsdhcg"],["gfpltyls","oucmephl","pdzreluo","lidcvrim","ndatjykr"],["ygogwhvu","bepvjpib","poumczad","zlhxfvkh","vzbsvtzx"],["lpwdgkkh","wuighkph","uvhtxtsy","bxzjjauk","eqxnavaw"],["wuighkph","lidcvrim","ndatjykr","pdzreluo","lgwfnuye"],["ybniepsb","bxzjjauk","nkdsdhcg","pdzreluo","lpwdgkkh"],["bepvjpib","zlhxfvkh","vzbsvtzx","pdzreluo","ygogwhvu"],["oucmephl","lidcvrim","eqxnavaw","poumczad","gfpltyls"],["wuighkph","bxzjjauk","ndatjykr","poumczad","lgwfnuye"],["ybniepsb","zlhxfvkh","nkdsdhcg","poumczad","lpwdgkkh"],["bepvjpib","lidcvrim","vzbsvtzx","uvhtxtsy","ygogwhvu"],["oucmephl","bxzjjauk","eqxnavaw","uvhtxtsy","gfpltyls"],["vzbsvtzx","zlhxfvkh","bepvjpib","uvhtxtsy","lgwfnuye"],["eqxnavaw","lidcvrim","oucmephl","poumczad","lpwdgkkh"],["ndatjykr","bxzjjauk","wuighkph","poumczad","ygogwhvu"],["nkdsdhcg","zlhxfvkh","ybniepsb","uvhtxtsy","gfpltyls"],["vzbsvtzx","lidcvrim","bepvjpib","pdzreluo","lgwfnuye"],["eqxnavaw","bxzjjauk","oucmephl","pdzreluo","lpwdgkkh"],["ndatjykr","zlhxfvkh","wuighkph","uvhtxtsy","ygogwhvu"],["nkdsdhcg","lidcvrim","ybniepsb","pdzreluo","gfpltyls"]]

const availableSpotArrays: string[][] = [
  [
    "dssdb",
    "afbfr",
    "tyfvj",
    "fdjbj",
    "aasvc",
    "idbsd",
    "wooww",
    "gollp",
    "aggvd",
    "faaah",
  ],
  [
    "aggvd",
    "jaoik",
    "afgdd",
    "jsoobd",
    "adsvb",
    "aasvc",
    "bvjjj",
    "wooww",
    "dssdb",
    "faaah",
  ],
  [
    "wooww",
    "bjfhd",
    "hfiie",
    "gollp",
    "dssdb",
    "afbfr",
    "jaoik",
    "fdjbj",
    "bvjjj",
    "faaah",
  ],
  [
    "idbsd",
    "afgdd",
    "tyfvj",
    "jsoobd",
    "aasvc",
    "wooww",
    "bjfhd",
    "aggvd",
    "dssdb",
    "faaah",
  ],
  [
    "afbfr",
    "fdjbj",
    "bvjjj",
    "hfiie",
    "aggvd",
    "jaoik",
    "adsvb",
    "gollp",
    "bjfhd",
    "faaah",
  ],
  [
    "aggvd",
    "idbsd",
    "gollp",
    "afgdd",
    "bvjjj",
    "jsoobd",
    "adsvb",
    "afbfr",
    "aasvc",
    "faaah",
  ],
  [
    "wooww",
    "aasvc",
    "bjfhd",
    "hfiie",
    "afbfr",
    "jaoik",
    "jsoobd",
    "idbsd",
    "dssdb",
    "faaah",
  ],
  [
    "adsvb",
    "fdjbj",
    "afgdd",
    "tyfvj",
    "aggvd",
    "gollp",
    "hfiie",
    "afbfr",
    "aasvc",
    "faaah",
  ],
  [
    "idbsd",
    "jaoik",
    "bjfhd",
    "jsoobd",
    "afbfr",
    "aasvc",
    "dssdb",
    "fdjbj",
    "bvjjj",
    "faaah",
  ],
  [
    "afbfr",
    "gollp",
    "afgdd",
    "bvjjj",
    "hfiie",
    "aggvd",
    "bjfhd",
    "wooww",
    "dssdb",
    "faaah",
  ],
  [
    "wooww",
    "adsvb",
    "aasvc",
    "dssdb",
    "tyfvj",
    "jsoobd",
    "jaoik",
    "afbfr",
    "bjfhd",
    "faaah",
  ],
  [
    "aggvd",
    "idbsd",
    "afgdd",
    "bjfhd",
    "hfiie",
    "afbfr",
    "gollp",
    "fdjbj",
    "dssdb",
    "faaah",
  ],
];

export async function POST(req: NextRequest) {
  const body = await req.json();

  const teamVerified = teamReqBodySchema.safeParse(body);

  if (!teamVerified.success) {
    return NextResponse.json(
      {},
      {
        status: 400,
        statusText: "Invalid team data provided",
      },
    );
  }

  try {
    await connectDB();

    const teamData = teamVerified.data;

    const randomIndex = Math.floor(Math.random() * availableSpotArrays.length);
    const assignedValue = availableSpotArrays[randomIndex];

    const team = await Team.create({
      teamName: teamData.teamName,
      teamId: teamData.teamId,
      teamMembers: teamData.teamMembers,
      hasPaid: true,
      spotArray: [...assignedValue, "hfiie"], //need to put last question here
    });

    return NextResponse.json(
      {
        message: "Team created successfully",
        data: {
          teamName: team.teamName,
          teamId: team.teamId,
          // currentQuestionStage : Number(team.currentQuestionStage),
          // numberOfLives : Number(team.numberOfLives),
          // hasPaid : team.hasPaid
        },
      },
      {
        status: 200,
        statusText: "CREATED",
      },
    );
  } catch (error) {
    console.log("Error in /api/auth/register ===> ", error);
    return NextResponse.json(
      {
        message: "An error occurred while processing your request.",
      },
      {
        status: 500,
      },
    );
  }
}
