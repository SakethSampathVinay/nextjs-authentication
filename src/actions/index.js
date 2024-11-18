"use server";

import connectToDB from "@/database";
import User from "@/models";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function registerUserAction(formData) {
  await connectToDB();

  try {
    const { userName, email, password } = formData;
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return {
        success: false,
        message: "User already exists! Please try with another email",
      };
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newlyCreatedUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newlyCreatedUser.save();

    if (savedUser) {
      return {
        success: true,
        data: JSON.parse(JSON.stringify(savedUser)),
      };
    } else {
      return {
        success: false,
        message: "Something went wrong! Please try again later",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something Error Occured",
    };
  }
}

export async function loginUserAction(formData) {
  await connectToDB();

  try {
    const { email, password } = formData;

    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return {
        success: false,
        message: "User not found! Please try with another email",
      };
    }

    const checkedPassword = await bcryptjs.compare(
      password,
      checkUser.password
    );
    if (!checkedPassword) {
      return {
        success: false,
        message: "Password is incorrect. Please try again later",
      };
    }

    const createTokenData = {
      id: checkUser._id,
      userName: checkUser.userName,
      email: checkUser.email,
    };

    const token = jwt.sign(createTokenData, "Default Key", { expiresIn: "1d" });

    const getCookies = cookies();
    getCookies.set("token", token);

    return {
      success: true,
      message: "Login Successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something Error Occured! Please try again later",
    };
  }
}

export async function fetchAuthUserAction() {
  await connectToDB();
  try{
    const getCookies = await cookies();
    const token = getCookies.get("token")?.value || "";
    if(token === "") {
      return {
        success: false,
        message: "Token is invalid",
      }
    }

    const decodedToken = jwt.verify(token, "Default Key");
    const getUserInfo = await User.findOne({_id: decodedToken.id});

    if (getUserInfo) {
      return {
        success: true,
        data: JSON.parse(JSON.stringify(getUserInfo)),
      }
    } else {
      return {
        success: false,
        message: "Some Error Occurred. Please try again.",
      }
    }

  } catch(error) {
    console.log(error);
    return {
      success: false,
      message: "Something Error Occured! Please try again later",
    }
  }
}

  export async function logoutAction() {
    const getCookies = cookies();
    getCookies.set("token", "");
  }
  