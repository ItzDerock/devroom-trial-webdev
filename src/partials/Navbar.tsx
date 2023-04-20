import Link from "next/link";
import NavbarProfile from "./NavbarProfile";
import { useRouter } from "next/router";

const NavElement = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const selected = router.pathname === href;

  return (
    <Link href={href} className="my-auto">
      <span className={selected ? "text-white" : "text-slate-300"}>
        {children}
      </span>
    </Link>
  );
};

export default function Navbar() {
  return (
    <nav className="w-full border-b-2 border-b-slate-900 bg-slate-800 px-8 py-2">
      <div className="mx-auto flex w-full max-w-5xl flex-row">
        {/* left div */}
        <div className="flex w-1/2 flex-row gap-4 align-middle">
          <NavElement href="/">Home</NavElement>
          <NavElement href="/create">Create Post</NavElement>
        </div>

        {/* right div */}
        <div className="flex w-1/2 flex-row justify-end">
          <NavbarProfile />
        </div>
      </div>
    </nav>
  );
}
