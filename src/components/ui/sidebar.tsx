"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge"
import {
  Blocks,
  ChevronsUpDown,
  FileClock,
  GraduationCap,
  Layout,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  MessagesSquare,
  Plus,
  Settings,
  UserCircle,
  UserCog,
  UserSearch,
} from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton"

const sidebarVariants = {
  open: {
    width: "15rem",
  },
  closed: {
    width: "3.05rem",
  },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
};

const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};


export function SessionNavBar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();
  return (
    <motion.div
      className={cn(
        "sidebar fixed left-0 z-40 h-full shrink-0 border-r fixed",
      )}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className={`relative z-40 flex text-muted-foreground h-full shrink-0 flex-col bg-white dark:bg-black transition-all`}
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">
            <div className=" flex h-full w-full flex-col">
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className={cn("flex w-full flex-col gap-1")}>
                  <Link
                      href="/"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5   transition hover:bg-muted hover:text-primary",
                        pathname?.includes("dashboard") &&
                          "bg-muted text-blue-600",
                      )}
                    >
                      <LayoutDashboard className="h-4 w-4" />{" "}
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <p className="ml-2 text-sm font-medium">Home </p>
                        )}
                      </motion.li>
                    </Link>
                    <Link
                      href="/stocks"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5   transition hover:bg-muted hover:text-primary",
                        pathname?.includes("dashboard") &&
                          "bg-muted text-blue-600",
                      )}
                    >
                      <LayoutDashboard className="h-4 w-4" />{" "}
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <p className="ml-2 text-sm font-medium">Generate Bill </p>
                        )}
                      </motion.li>
                    </Link>
                    <Link
                      href="/stocks/addStock"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",

                        pathname?.includes("reports") &&
                          "bg-muted text-blue-600",
                      )}
                    >
                      <FileClock className="h-4 w-4" />{" "}
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <div className="flex items-center gap-2">
                            <p className="ml-2 text-sm font-medium">Manage Stock</p>
                          </div>
                        )}
                      </motion.li>
                    </Link>
                    <Link
                      href="/stocks/transferStock"
                      className={cn(
                        "flex h-8 flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                        pathname?.includes("chat") && "bg-muted text-blue-600",
                      )}
                    >
                      <MessagesSquare className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <div className="ml-2 flex items-center  gap-2">
                            <p className="text-sm font-medium">Transfer Stock</p>
                          </div>
                        )}
                      </motion.li>
                    </Link>
                    <Separator className="w-full" />
                    <Link
                      href="/billhistory"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5   transition hover:bg-muted hover:text-primary",

                        pathname?.includes("deals") && "bg-muted text-blue-600",
                      )}
                    >
                      <Layout className="h-4 w-4" />{" "}
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <p className="ml-2 text-sm font-medium">Bill Book </p>
                        )}
                      </motion.li>
                    </Link>
                    <Link
                      href="/records"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5   transition hover:bg-muted hover:text-primary",

                        pathname?.includes("accounts") &&
                          "bg-muted text-blue-600",
                      )}
                    >
                      <UserCircle className="h-4 w-4" />{" "}
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <p className="ml-2 text-sm font-medium">Records</p>
                        )}
                      </motion.li>
                    </Link>
                    <Link
                      href="/records/banktransaction"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5   transition hover:bg-muted hover:text-primary",

                        pathname?.includes("competitors") &&
                          "bg-muted text-blue-600",
                      )}
                    >
                      <UserSearch className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <p className="ml-2 text-sm font-medium">
                            Bank Transactions
                          </p>
                        )}
                      </motion.li>
                    </Link>
                    <Separator className="w-full" />
                  </div>
                </ScrollArea>
              </div>
              
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}
