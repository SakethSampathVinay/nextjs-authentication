"use client";

import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

function Logout() {

  async function handleLogout() {
    await logoutAction();
  }
  return <Button onClick={handleLogout}>Logout</Button>;
}


export default Logout;