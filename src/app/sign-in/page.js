"use client";

import CommonFormElement from "@/components/ui/form-element/page";
import { initialLoginFormData, userLoginFormControls } from "../utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUserAction } from "@/actions";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function SignIn() {
  const [signInFormData, setSignInFormData] = useState(initialLoginFormData);

  const router = useRouter();

  async function handleSignIn() {
    const result = await loginUserAction(signInFormData);
    console.log(result);
    if (result?.success) router.push("/");
  }

  return (
    <>
      <h1>Login</h1>
      <form action={handleSignIn}>
        {userLoginFormControls.map((controlItem) => (
          <div key={controlItem.name}>
            <Label>{controlItem.label}</Label>
            <CommonFormElement
              currentItem={controlItem}
              value={setSignInFormData[controlItem.name]}
              onChange={(event) =>
                setSignInFormData({
                  ...signInFormData,
                  [event.target.name]: event.target.value,
                })
              }
            />
          </div>
        ))}
        <Button type="submit">Sign In</Button>
      </form>
    </>
  );
}

export default SignIn;
