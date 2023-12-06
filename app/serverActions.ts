"use server";
import UserModel from "@/models/User";
import Messages from "@/models/Message";
import { User } from "@/types/User";
import dbConnect from "@/utils/db";
import { hash, compare } from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { protector } from "@/utils/protetion";
import { ObjectId } from "mongodb";
export const createUser = async (prevState: any, form: FormData) => {
  const data = Object.fromEntries(form.entries()) as unknown as {
    [key: string]: string;
  };
  delete data.confirmPassword;
  delete data.avatar;
  data.password = await hash(data.password, 12);
  await dbConnect();
  const newUser = new UserModel({
    ...data,
    avatar: data.avatarBase64,
  });
  try {
    const result = await newUser.save();
    return { message: "success" };
  } catch (err) {
    console.log(err);
    return { message: err };
  }
};

export const login = async (prevState: any, form: FormData) => {
  const data = Object.fromEntries(form.entries()) as unknown as {
    [key: string]: string;
  };
  await dbConnect();
  const result = (await UserModel.findOne(
    { login: data.login },
    { password: 1, _id: 1 }
  )) as unknown as User;
  if (!result) {
    return { message: "Invalid credentials" };
  }
  const isMatch = await compare(data.password, result.password);
  if (!isMatch) {
    return { message: "Invalid credentials" };
  }
  const token = jwt.sign({ userId: result._id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  cookies().set("_tppr", token, { maxAge: 60 * 60 * 3 });
  return { message: "success" };
};

export async function fetchUser() {
  const user = await protector(cookies().get("_tppr")?.value!);
  if (user.hasOwnProperty("message")) {
    return { message: "Invalid credentials" };
  } else {
    const { userId } = user as { userId: string };
    await dbConnect();
    const res = await UserModel.findOne({ _id: userId }, { password: 0 });
    return res;
  }
}

export async function fetchUsers(page = 0, limit = 10) {
  const user = await protector(cookies().get("_tppr")?.value!);
  if (user.hasOwnProperty("message")) {
    await dbConnect();
    const skip = page * limit;
    return await UserModel.find({}).skip(skip).limit(limit);
  } else {
    const { userId } = user as { userId: string };
    await dbConnect();
    const skip = page * limit;
    return await UserModel.find({ _id: { $ne: userId } })
      .skip(skip)
      .limit(limit);
  }
}

export async function searchUsers(query: string) {
  await dbConnect();
  return await UserModel.find({
    $or: [
      { firstName: { $regex: query, $options: "i" } },
      { lastName: { $regex: query, $options: "i" } },
    ],
  });
}

export async function fetchChatsList() {
  const user = await protector(cookies().get("_tppr")?.value!);
  if (user.hasOwnProperty("message")) {
    return { message: "Invalid credentials" };
  } else {
    const { userId } = user as { userId: string };
    await dbConnect();
    const objectIdUserId = new ObjectId(userId);
    const result = await Messages.aggregate([
      {
        $match: {
          $or: [
            { fromUser: objectIdUserId },
            { toUser: objectIdUserId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $gt: ["$fromUser", "$toUser"] },
              { fromUser: "$fromUser", toUser: "$toUser" },
              { fromUser: "$toUser", toUser: "$fromUser" }
            ]
          },
          lastMessage: { $first: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.fromUser',
          foreignField: '_id',
          as: 'fromUserInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.toUser',
          foreignField: '_id',
          as: 'toUserInfo'
        }
      },
      {
        $project: {
          _id: "$lastMessage._id",
          createdAt: "$lastMessage.createdAt",
          text: "$lastMessage.text",
          read: "$lastMessage.read",
          fromUser: {
            $concat: [
              { $arrayElemAt: ["$fromUserInfo.firstName", 0] },
              " ",
              { $arrayElemAt: ["$fromUserInfo.lastName", 0] }
            ]
          },
          toUser: {
            $concat: [
              { $arrayElemAt: ["$toUserInfo.firstName", 0] },
              " ",
              { $arrayElemAt: ["$toUserInfo.lastName", 0] }
            ]
          },
          otherUserName: {
            $cond: {
              if: { $eq: ["$lastMessage.fromUser", objectIdUserId] },
              then: {
                $concat: [
                  { $arrayElemAt: ["$toUserInfo.firstName", 0] },
                  " ",
                  { $arrayElemAt: ["$toUserInfo.lastName", 0] }
                ]
              },
              else: {
                $concat: [
                  { $arrayElemAt: ["$fromUserInfo.firstName", 0] },
                  " ",
                  { $arrayElemAt: ["$fromUserInfo.lastName", 0] }
                ]
              }
            }
          },
          otherUserAvatar: {
            $cond: {
              if: { $eq: ["$lastMessage.fromUser", objectIdUserId] },
              then: { $arrayElemAt: ["$toUserInfo.avatar", 0] },
              else: { $arrayElemAt: ["$fromUserInfo.avatar", 0] }
            }
          },
          otherUserLogin: {
            $cond: {
              if: { $eq: ["$lastMessage.fromUser", objectIdUserId] },
              then: { $arrayElemAt: ["$toUserInfo.login", 0] },
              else: { $arrayElemAt: ["$fromUserInfo.login", 0] }
            }
          }
        }
      }
    ]);
    return result;
  }
}

export async function sendMessage(data:{toUser: string, text: string, createdAt: Date, read: boolean}) {
  const user = await protector(cookies().get("_tppr")?.value!);
  if (user.hasOwnProperty("message")) {
    return { message: "Invalid credentials" };
  } else {
    const { userId } = user as { userId: string };
    await dbConnect();
    const toUser = await UserModel.findOne({ login: data.toUser }, { _id: 1 });
    const newMessage = new Messages({
      fromUser: userId,
      toUser: toUser?._id,
      text: data.text,
      read: false,
      createdAt: data.createdAt
    });
    const result = await newMessage.save();
    return result;
  }
}

export async function fetchChat(page = 0, limit = 10, withUser: string) {
  const user = await protector(cookies().get("_tppr")?.value!);
  await dbConnect();
  const skip = page * limit;

  if (user.hasOwnProperty("message")) {
    return Promise.reject(new Error("User not authenticated"));
  } else {
    const { userId } = user as { userId: string };
    const withUserId = await UserModel.findOne({ login: withUser }, { _id: 1 });

    if (!withUserId) {
      return Promise.reject(new Error("Other user not found"));
    }

    const messages = await Messages.find({
      $or: [
        { fromUser: new ObjectId(userId), toUser: new ObjectId(withUserId._id) },
        { fromUser: new ObjectId(withUserId._id), toUser: new ObjectId(userId) }
      ]
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    return messages.map(message => ({
      fromSelf: message.fromUser.toString() === userId,
      text: message.text,
      timestamp: message.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      lastRead: message.read
    })).reverse();
  }
}