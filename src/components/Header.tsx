import { shadow } from "@/styles/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import LogoutButton from "./LogoutButton";
import { getUser } from "@/auth/server";
import { SidebarTrigger } from "./ui/sidebar";

async function Header() {
  const user = await getUser();
  return (
    <header
      className="bg-popover relative flex h-24 items-center justify-between px-3 sm:px-8"
      style={{ boxShadow: shadow }}
    >
      <SidebarTrigger className="absolute left-1 top-1"/>
      <Link href="/" className="flex items-end gap-2">
        <Image
          src="/goatius.png"
          alt="logo"
          height={60}
          width={60}
          className="rounded-full"
          priority
        />

        <h1 className="flex flex-col pb-1 text-2xl semi-bold leading-6">
          Goat <span>Notes</span>
        </h1>
      </Link>

      <div className="flex gap-4">
        {user ? (
          <>
            <LogoutButton />
            <DarkModeToggle />
          </>
        ) : (
          <>
            <Button asChild className="hidden sm:block">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">login</Link>
            </Button>
            <DarkModeToggle />
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
