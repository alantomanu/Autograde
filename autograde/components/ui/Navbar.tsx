"use client"
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/react";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export function App() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        <Link href="/" className="flex items-center">
          <AcmeLogo />
          <p className="font-bold text-inherit">AutoGrade</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/features">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === '/'}>
          <Link aria-current="page" href="/">
            Evaluator
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/analytics">
            Analytics
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {status === "authenticated" && session?.user?.teacherId ? (
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light">
                  {session.user.teacherId}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User actions">
                <DropdownItem key="logout" onClick={handleLogout}>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/signup" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
        <NavbarItem>
          <ModeToggle />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default App;
