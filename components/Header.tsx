import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import UserProfile from "./UserProfile";
import Image from "next/image";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="fixed w-full z-50 top-0 left-0 bg-gray-900">
      <nav className="px-2 sm:px-4 py-2.5">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <Link href="/" className="flex items-center">
            <Image src="/logo.svg" alt="Rubik's Cube" width={80} height={80} />
          </Link>
          <div className="flex items-center gap-4">
            {user && <UserProfile name={user.name!} image={user.image!} />}
          </div>
        </div>
      </nav>
    </header>
  );
}
