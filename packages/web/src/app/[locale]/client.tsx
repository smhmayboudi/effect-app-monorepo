"use client"

import {
  BatteryCharging,
  GitPullRequest,
  Layers,
  MenuIcon,
  RadioTower,
  SquareKanban,
  WandSparkles,
} from "lucide-react"
import Image from "next/image"

import { LocaleSwitcher } from "@/components/locale-switcher"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "@/components/ui/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Discord } from "@/components/ui/svgs/discord"
import { EffectDark } from "@/components/ui/svgs/effectDark"
import { EffectLight } from "@/components/ui/svgs/effectLight"
import { GithubDark } from "@/components/ui/svgs/githubDark"
import { GithubLight } from "@/components/ui/svgs/githubLight"
import { Linkedin } from "@/components/ui/svgs/linkedin"
import { NextjsLogoDark } from "@/components/ui/svgs/nextjsLogoDark"
import { NextjsLogoLight } from "@/components/ui/svgs/nextjsLogoLight"
import { ReactDark } from "@/components/ui/svgs/reactDark"
import { ReactLight } from "@/components/ui/svgs/reactLight"
import { ShadcnUi } from "@/components/ui/svgs/shadcnUi"
import { ShadcnUiDark } from "@/components/ui/svgs/shadcnUiDark"
import { Tailwindcss } from "@/components/ui/svgs/tailwindcss"
import { Typescript } from "@/components/ui/svgs/typescript"
import { useTheme } from "@/context/theme-provider"
import { cn } from "@/lib/utils"

const Navbar5 = () => {
  const navbars = [
    {
      description: "Overview of your activity",
      href: "#",
      title: "Dashboard",
    },
    {
      description: "Track your performance",
      href: "#",
      title: "Analytics",
    },
    {
      description: "Configure your preferences",
      href: "#",
      title: "Settings",
    },
    {
      description: "Connect with other tools",
      href: "#",
      title: "Integrations",
    },
    {
      description: "Manage your files",
      href: "#",
      title: "Storage",
    },
    {
      description: "Get help when needed",
      href: "#",
      title: "Support",
    },
  ]

  return (
    <section className="p-4">
      <div className="container mx-auto">
        <nav className="flex items-center justify-between">
          <a
            className="flex items-center gap-2"
            href="https://www.shadcnblocks.com"
            target="_blank"
          >
            <Image
              alt="Shadcnblocks.com"
              className="max-h-8"
              height="28"
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
              width="28"
            />
            <span className="text-lg font-semibold tracking-tighter">
              Shadcnblocks.com
            </span>
          </a>
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-3">
                    {navbars.map((value, index) => (
                      <NavigationMenuLink
                        className="rounded-md p-3 transition-colors hover:bg-muted/70"
                        href={value.href}
                        key={index}
                      >
                        <p className="mb-1 font-semibold text-foreground">
                          {value.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {value.description}
                        </p>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  href="#"
                >
                  Products
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  href="#"
                >
                  Resources
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  href="#"
                >
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="hidden items-center gap-4 lg:flex">
            <LocaleSwitcher />
            <ModeToggle />
          </div>
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button size="icon" variant="outline">
                <MenuIcon className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="max-h-screen overflow-auto" side="top">
              <SheetHeader>
                <SheetTitle>
                  <a
                    className="flex items-center gap-2"
                    href="https://www.shadcnblocks.com"
                    target="_blank"
                  >
                    <Image
                      alt="Shadcnblocks.com"
                      className="max-h-8"
                      height="28"
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
                      width="28"
                    />
                    <span className="text-lg font-semibold tracking-tighter">
                      Shadcnblocks.com
                    </span>
                  </a>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-4">
                <Accordion className="mt-4 mb-2" collapsible type="single">
                  <AccordionItem className="border-none" value="solutions">
                    <AccordionTrigger className="text-base hover:no-underline">
                      Features
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2">
                        {navbars.map((value, index) => (
                          <a
                            className="rounded-md p-3 transition-colors hover:bg-muted/70"
                            href={value.href}
                            key={index}
                            target="_blank"
                          >
                            <p className="mb-1 font-semibold text-foreground">
                              {value.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {value.description}
                            </p>
                          </a>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex flex-col gap-6">
                  <a className="font-medium" href="#" target="_blank">
                    Templates
                  </a>
                  <a className="font-medium" href="#" target="_blank">
                    Blog
                  </a>
                  <a className="font-medium" href="#" target="_blank">
                    Pricing
                  </a>
                </div>
                <div className="mt-6 flex flex-col gap-4">
                  <Button variant="outline">Sign in</Button>
                  <Button>Sign up</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </section>
  )
}

const Hero12 = () => {
  const { theme } = useTheme()
  const heros = [
    {
      href: "https://effect.website/",
      icon: theme === "light" ? <EffectLight /> : <EffectDark />,
      title: "effect",
    },
    {
      href: "https://nextjs.org/",
      icon: theme === "light" ? <NextjsLogoLight /> : <NextjsLogoDark />,
      title: "nextjs",
    },
    {
      href: "https://react.dev/",
      icon: theme === "light" ? <ReactLight /> : <ReactDark />,
      title: "react",
    },
    {
      href: "https://ui.shadcn.com/",
      icon: theme === "light" ? <ShadcnUi /> : <ShadcnUiDark />,
      title: "shadcn ui",
    },
    {
      href: "https://tailwindcss.com/",
      icon: <Tailwindcss />,
      title: "tailwind css",
    },
    {
      href: "https://www.typescriptlang.org/",
      icon: <Typescript />,
      title: "typescript",
    },
  ]

  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
        <Image
          alt="Shadcnblocks.com"
          className="[mask-image:radial-gradient(75%_75%_at_center,white,transparent)] opacity-90"
          height="958"
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
          width="1347"
        />
      </div>
      <div className="relative container mx-auto">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm">
              <Image
                alt="Shadcnblocks.com"
                className="h-16"
                height="64"
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg"
                width="64"
              />
            </div>
            <div>
              <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
                Build fast, Scale easy, We’ll handle the{" "}
                <span className="text-primary">auth</span>
              </h1>
              <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                Our Auth API takes care of users, tokens, and sessions—so you
                can focus on building great products.
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                asChild
                className="shadow-sm transition-shadow hover:shadow"
              >
                <Link href="/sign-up">Get Started</Link>
              </Button>
              {/* <Button className="group" variant="outline">
                Learn more{" "}
                <ExternalLink
                  className={cn(
                    "ms-2 h-4 transition-transform",
                    dir === "rtl"
                      ? "group-hover:-translate-x-0.5"
                      : "group-hover:translate-x-0.5",
                  )}
                />
              </Button> */}
            </div>
            <div className="mt-20 flex flex-col items-center gap-5">
              <p className="font-medium text-muted-foreground lg:text-start">
                Built with open-source technologies
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {heros.map((value, index) => (
                  <a
                    aria-label={value.title}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "group flex aspect-square h-12 items-center justify-center p-0",
                    )}
                    href={value.href}
                    key={index}
                    target="_blank"
                  >
                    {value.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const Feature43 = () => {
  const features = [
    {
      description:
        "Easily integrate with popular frameworks like Next.js, React, Vue, and Laravel using ready-to-use SDKs and snippets.",
      heading: "Support for Popular Frameworks",
      icon: <GitPullRequest className="size-6" />,
    },
    {
      description:
        "Enable classic sign-up and sign-in with secure email and password management.",
      heading: "Email & Password Authentication",
      icon: <SquareKanban className="size-6" />,
    },
    {
      description:
        "Connect with Google, Apple, GitHub, or any major OAuth provider for quick and secure social login.",
      heading: "Support Multiple OAuth Providers",
      icon: <RadioTower className="size-6" />,
    },
    {
      description:
        "Add an extra layer of protection with codes, authenticator apps, or device-based verification.",
      heading: "Multi-Factor Authentication (MFA)",
      icon: <WandSparkles className="size-6" />,
    },
    {
      description:
        "Manage teams and organizations effortlessly — invite members, set roles, and control access in one place.",
      heading: "Organization Members and Invitations",
      icon: <Layers className="size-6" />,
    },
    {
      description:
        "Extend functionality with powerful plugins for analytics, notifications, billing, and beyond.",
      heading: "A Lot More Features with Plugins",
      icon: <BatteryCharging className="size-6" />,
    },
    {
      description:
        "Securely handle user sessions with automatic token refresh, inactivity timeouts, and session revocation.",
      heading: "Session Management",
      icon: <GitPullRequest className="size-6" />,
    },
    {
      description:
        "Allow users to log in instantly with one-time passcodes sent to their email or phone number.",
      heading: "Email and SMS One-Time Passcodes (OTP)",
      icon: <SquareKanban className="size-6" />,
    },
    {
      description:
        "Detect and block suspicious logins, brute-force attacks, and fake accounts in real-time.",
      heading: "Fraud and Abuse Prevention",
      icon: <RadioTower className="size-6" />,
    },
    {
      description: "Users click a secure link and are instantly authenticated.",
      heading: "Magic Links",
      icon: <WandSparkles className="size-6" />,
    },
    {
      description:
        "Let users sign in with their favorite social networks for a faster, frictionless experience.",
      heading: "Social Sign-On",
      icon: <Layers className="size-6" />,
    },
    {
      description:
        "Protect your app with encryption, token rotation, rate limiting, and audit logging.",
      heading: "Advanced Security",
      icon: <BatteryCharging className="size-6" />,
    },
    {
      description:
        "Keep your system clean by automatically identifying and blocking malicious bots.",
      heading: "Bot Detection",
      icon: <GitPullRequest className="size-6" />,
    },
    {
      description:
        "Offer advanced password management — hashing, breach detection, and password strength validation.",
      heading: "Passwords",
      icon: <SquareKanban className="size-6" />,
    },
    {
      description:
        "Provide passwordless authentication using biometrics or device-based verification (Face ID, Touch ID).",
      heading: "WebAuthn / Passkeys Support",
      icon: <RadioTower className="size-6" />,
    },
    {
      description:
        "Track all authentication and access events for compliance and visibility.",
      heading: "Audit Logs",
      icon: <WandSparkles className="size-6" />,
    },
    {
      description:
        "Issue and manage API keys for secure integration between services.",
      heading: "API Keys Management",
      icon: <Layers className="size-6" />,
    },
    {
      description:
        "Personalize login pages, emails, and flows with your brand’s identity.",
      heading: "Custom Branding",
      icon: <BatteryCharging className="size-6" />,
    },
    {
      description:
        "Protect your authentication endpoints from overuse or abuse.",
      heading: "Rate Limiting and Throttling",
      icon: <GitPullRequest className="size-6" />,
    },
    {
      description:
        "Monitor traffic, success rate, and error logs — all in a clean, developer-friendly dashboard.",
      heading: "Developer Dashboard",
      icon: <SquareKanban className="size-6" />,
    },
  ]

  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-4xl font-medium text-pretty lg:text-5xl">
            Feature List
          </h2>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((value, index) => (
            <div className="flex flex-col" key={index}>
              <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-accent">
                {value.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{value.heading}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Community1 = () => {
  const { theme } = useTheme()
  const communitys = [
    {
      href: "https://github.com/smhmayboudi/effect-app-monorepo/",
      icon: theme === "light" ? <GithubLight /> : <GithubDark />,
      title: "github",
    },
    {
      href: "#",
      icon: <Discord />,
      title: "discord",
    },
  ]

  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-5">
          <Image
            alt="Shadcnblocks.com"
            className="size-10"
            height="40"
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg"
            width="40"
          />
          <h2 className="text-center text-3xl font-semibold">
            Join our community
            <br />
            <span className="text-muted-foreground/80">of developers</span>
          </h2>
          <div className="flex items-center gap-4">
            {communitys.map((value, index) => (
              <Button asChild key={index} size="lg" variant="outline">
                <a
                  aria-label={value.title}
                  className="size-10"
                  href={value.href}
                  target="_blank"
                >
                  {value.icon}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const Faq3 = () => {
  const description =
    "Find answers to common questions about our products. Can't find what you're looking for? Contact our support team."
  const faqItems = [
    {
      answer:
        "A FAQ is a list of frequently asked questions and answers on a particular topic.",
      id: "faq-1",
      question: "What is a FAQ?",
    },
    {
      answer:
        "The purpose of a FAQ is to provide answers to common questions and help users find the information they need quickly and easily.",
      id: "faq-2",
      question: "What is the purpose of a FAQ?",
    },
    {
      answer:
        "To create a FAQ, you need to compile a list of common questions and answers on a particular topic and organize them in a clear and easy-to-navigate format.",
      id: "faq-3",
      question: "How do I create a FAQ?",
    },
    {
      answer:
        "The benefits of a FAQ include providing quick and easy access to information, reducing the number of support requests, and improving the overall user experience.",
      id: "faq-4",
      question: "What are the benefits of a FAQ?",
    },
    {
      answer:
        "You should organize your FAQ in a logical manner, grouping related questions together and ordering them from most basic to more advanced topics.",
      id: "faq-5",
      question: "How should I organize my FAQ?",
    },
    {
      answer:
        "FAQ answers should be concise and to the point, typically a few sentences or a short paragraph is sufficient for most questions.",
      id: "faq-6",
      question: "How long should FAQ answers be?",
    },
    {
      answer:
        "Yes, including links to more detailed information or related resources can be very helpful for users who want to learn more about a particular topic.",
      id: "faq-7",
      question: "Should I include links in my FAQ?",
    },
  ]
  const heading = "Frequently asked questions"

  return (
    <section className="py-32">
      <div className="container mx-auto space-y-16">
        <div className="mx-auto flex max-w-3xl flex-col text-start md:text-center">
          <h2 className="mb-3 text-3xl font-semibold md:mb-4 lg:mb-6 lg:text-4xl">
            {heading}
          </h2>
          <p className="text-muted-foreground lg:text-lg">{description}</p>
        </div>
        <Accordion
          className="mx-auto w-full lg:max-w-3xl"
          collapsible
          type="single"
        >
          {faqItems.map((value, index) => (
            <AccordionItem key={index} value={value.id}>
              <AccordionTrigger className="transition-opacity duration-200 hover:no-underline hover:opacity-60">
                <div className="font-medium sm:py-1 lg:py-2 lg:text-lg">
                  {value.question}
                </div>
              </AccordionTrigger>
              <AccordionContent className="sm:mb-1 lg:mb-2">
                <div className="text-muted-foreground lg:text-lg">
                  {value.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

const Footer7 = () => {
  const legalLinks = [
    { href: "#", name: "Terms and Conditions" },
    { href: "#", name: "Privacy Policy" },
  ]
  const sections = [
    {
      links: [
        { href: "#", name: "Overview" },
        { href: "#", name: "Pricing" },
        { href: "#", name: "Marketplace" },
        { href: "#", name: "Features" },
      ],
      title: "Product",
    },
    {
      links: [
        { href: "#", name: "About" },
        { href: "#", name: "Team" },
        { href: "#", name: "Blog" },
        { href: "#", name: "Careers" },
      ],
      title: "Company",
    },
    {
      links: [
        { href: "#", name: "Help" },
        { href: "#", name: "Sales" },
        { href: "#", name: "Advertise" },
        { href: "#", name: "Privacy" },
      ],
      title: "Resources",
    },
  ]
  const socialLinks = [
    {
      href: "https://www.linkedin.com/in/smhmayboudi/",
      icon: <Linkedin className="size-5" />,
      label: "LinkedIn",
    },
  ]

  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-start">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            <div className="flex items-center gap-2 lg:justify-start">
              <a href="https://www.shadcnblocks.com" target="_blank">
                <Image
                  alt="Shadcnblocks.com"
                  className="h-8"
                  height="28"
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
                  width="28"
                />
              </a>
              <h2 className="text-xl font-semibold">Shadcnblocks.com</h2>
            </div>
            <p className="max-w-[70%] text-sm text-muted-foreground">
              A collection of components for your startup business or side
              project.
            </p>
            <ul className="flex items-center space-x-6 text-muted-foreground">
              {socialLinks.map((value, index) => (
                <li className="font-medium hover:text-primary" key={index}>
                  <a aria-label={value.label} href={value.href} target="_blank">
                    {value.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
            {sections.map((value, index) => (
              <div key={index}>
                <h3 className="mb-4 font-bold">{value.title}</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {value.links.map((value2, index2) => (
                    <li className="font-medium hover:text-primary" key={index2}>
                      <a href={value2.href}>{value2.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center md:text-start">
          <p className="order-2 lg:order-1">
            &copy; 2024 Shadcnblocks.com. All rights reserved.
          </p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((value, index) => (
              <li className="hover:text-primary" key={index}>
                <a href={value.href}>{value.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default function Client() {
  return (
    <>
      <Navbar5 />
      <Hero12 />
      <Feature43 />
      <Community1 />
      <Faq3 />
      <Footer7 />
    </>
  )
}
