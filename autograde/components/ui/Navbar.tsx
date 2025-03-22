"use client"
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/react";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from 'next/image';
import { useTheme } from 'next-themes';

export function App() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { theme } = useTheme();

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        <Link href="/" className="flex items-center">
          <Image
            src={theme === 'dark' ? '/logowhite.png' : '/logoblack.png'}
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
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
