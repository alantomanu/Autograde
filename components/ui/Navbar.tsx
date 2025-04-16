"use client"
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from 'next/image';

export function App() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <Navbar shouldHideOnScroll>
                  <NavbarBrand className="ml-1 lg:ml-[-80px]">
        <Link href="/" className="flex items-center">
          <Image
            src="/logoblack.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
          <p className="font-normal text-xl">AutoGrade</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" className=" font-light text-lg" href="/features">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === '/'}>
          <Link aria-current="page"   className=" font-normal text-lg" href="/">
            Evaluator
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" className=" font-light text-lg" href="/analytics">
            Analytics
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end" className="mr-1 lg:mr-[-80px]">
        {status === "authenticated" && session?.user?.teacherId ? (
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light" className=" font-light text-lg"  >
                  {session.user.teacherId}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User actions">
                <DropdownItem key="logout" onClick={handleLogout} >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/login" className=" font-light text-lg" >Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/signup" variant="flat" className=" font-light text-lg" >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}

export default App;
