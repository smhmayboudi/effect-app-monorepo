"use client";

import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import {
  BatteryCharging,
  ExternalLink,
  GitPullRequest,
  Layers,
  MenuIcon,
  RadioTower,
  SquareKanban,
  WandSparkles,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Navbar5 = ({ direction }: { direction: "ltr" | "rtl" }) => {
  const features = [
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
  ];

  return (
    <section className="py-4">
      <div className="container">
        <nav className="flex items-center justify-between">
          <a
            className="flex items-center gap-2"
            href="https://www.shadcnblocks.com"
          >
            <img
              alt="Shadcn UI Navbar"
              className="max-h-8"
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
            />
            <span className="text-lg font-semibold tracking-tighter">
              Shadcnblocks.com
            </span>
          </a>
          <NavigationMenu className="hidden lg:block" direction="ltr">
            <NavigationMenuList direction="ltr">
              <NavigationMenuItem>
                <NavigationMenuTrigger direction="ltr">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent direction="ltr">
                  <div className="grid w-[600px] grid-cols-2 p-3">
                    {features.map((feature, index) => (
                      <NavigationMenuLink
                        className="rounded-md p-3 transition-colors hover:bg-muted/70"
                        href={feature.href}
                        key={index}
                      >
                        <div key={feature.title}>
                          <p className="mb-1 font-semibold text-foreground">
                            {feature.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
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
            <Button variant="outline">Sign in</Button>
            <Button>Start for free</Button>
          </div>
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button size="icon" variant="outline">
                <MenuIcon className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="max-h-screen overflow-auto"
              direction="ltr"
              side="top"
            >
              <SheetHeader>
                <SheetTitle>
                  <a
                    className="flex items-center gap-2"
                    href="https://www.shadcnblocks.com"
                  >
                    <img
                      alt="Shadcn UI Navbar"
                      className="max-h-8"
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
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
                    <AccordionTrigger
                      className="text-base hover:no-underline"
                      direction={direction}
                    >
                      Features
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2">
                        {features.map((feature, index) => (
                          <a
                            className="rounded-md p-3 transition-colors hover:bg-muted/70"
                            href={feature.href}
                            key={index}
                          >
                            <div key={feature.title}>
                              <p className="mb-1 font-semibold text-foreground">
                                {feature.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {feature.description}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex flex-col gap-6">
                  <a className="font-medium" href="#">
                    Templates
                  </a>
                  <a className="font-medium" href="#">
                    Blog
                  </a>
                  <a className="font-medium" href="#">
                    Pricing
                  </a>
                </div>
                <div className="mt-6 flex flex-col gap-4">
                  <Button variant="outline">Sign in</Button>
                  <Button>Start for free</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </section>
  );
};

const Hero12 = ({ direction }: { direction: "ltr" | "rtl" }) => {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
        <img
          alt="background"
          className="[mask-image:radial-gradient(75%_75%_at_center,white,transparent)] opacity-90"
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
        />
      </div>
      <div className="relative container">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm">
              <img
                alt="logo"
                className="h-16"
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg"
              />
            </div>
            <div>
              <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
                Build your next project with{" "}
                <span className="text-primary">Blocks</span>
              </h1>
              <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
                doloremque mollitia fugiat omnis! Porro facilis quo animi
                consequatur. Explicabo.
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <Button className="shadow-sm transition-shadow hover:shadow">
                Get Started
              </Button>
              <Button className="group" variant="outline">
                Learn more{" "}
                <ExternalLink
                  className={cn(
                    "h-4 transition-transform",
                    direction === "rtl"
                      ? "mr-2 group-hover:-translate-x-0.5"
                      : "ml-2 group-hover:translate-x-0.5",
                  )}
                />
              </Button>
            </div>
            <div className="mt-20 flex flex-col items-center gap-5">
              <p
                className={cn(
                  "font-medium text-muted-foreground",
                  direction === "rtl" ? "lg:text-right" : "lg:text-left",
                )}
              >
                Built with open-source technologies
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0",
                  )}
                  href="#"
                >
                  <img
                    alt="shadcn/ui logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcn-ui-icon.svg"
                  />
                </a>
                <a
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0",
                  )}
                  href="#"
                >
                  <img
                    alt="TypeScript logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/typescript-icon.svg"
                  />
                </a>

                <a
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0",
                  )}
                  href="#"
                >
                  <img
                    alt="React logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/react-icon.svg"
                  />
                </a>
                <a
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0",
                  )}
                  href="#"
                >
                  <img
                    alt="Tailwind CSS logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/tailwind-icon.svg"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Feature43 = () => {
  const buttonText = "More Features";
  const buttonUrl = "https://shadcnblocks.com";
  const features = [
    {
      description:
        "Built with attention to detail and best practices. Every component is thoroughly tested and follows modern React patterns for reliability and performance.",
      heading: "Quality",
      icon: <GitPullRequest className="size-6" />,
    },
    {
      description:
        "Crafted with user experience in mind. Each component is designed to be intuitive, accessible, and provide smooth interactions across all devices.",
      heading: "Experience",
      icon: <SquareKanban className="size-6" />,
    },
    {
      description:
        "Comprehensive documentation and community support. Get help when you need it with detailed guides, examples, and active community assistance.",
      heading: "Support",
      icon: <RadioTower className="size-6" />,
    },
    {
      description:
        "Cutting-edge design patterns and modern web technologies. Stay ahead with the latest trends in UI/UX design and development practices.",
      heading: "Innovation",
      icon: <WandSparkles className="size-6" />,
    },
    {
      description:
        "Proven track record of successful implementations. These components have been battle-tested in real-world applications and deliver consistent results.",
      heading: "Results",
      icon: <Layers className="size-6" />,
    },
    {
      description:
        "Optimized for performance and developer productivity. Lightweight, fast-loading components that help you build faster without compromising on quality.",
      heading: "Efficiency",
      icon: <BatteryCharging className="size-6" />,
    },
  ];
  const title = "Fully featured components for Shadcn UI & Tailwind";

  return (
    <section className="py-32">
      <div className="container">
        {title && (
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-4xl font-medium text-pretty lg:text-5xl">
              {title}
            </h2>
          </div>
        )}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div className="flex flex-col" key={i}>
              <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-accent">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.heading}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        {buttonUrl && (
          <div className="mt-16 flex justify-center">
            <Button asChild size="lg">
              <a href={buttonUrl}>{buttonText}</a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

const Community1 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center gap-5">
          <img
            alt="logo"
            className="size-10"
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg"
          />
          <h2 className="text-center text-3xl font-semibold">
            Join our community
            <br />
            <span className="text-muted-foreground/80">
              of designers & developers
            </span>
          </h2>
          <div className="flex items-center gap-4">
            <Button asChild size="lg" variant="outline">
              <a
                className="size-10"
                href="https://x.com/shadcnblocks"
                target="_blank"
              >
                <TwitterLogoIcon />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                className="size-10"
                href="https://github.com/shadcnblocks"
                target="_blank"
              >
                <GitHubLogoIcon />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                className="size-10"
                href="https://shadcnblocks.com"
                target="_blank"
              >
                <DiscordLogoIcon />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Faq3 = ({ direction }: { direction: "ltr" | "rtl" }) => {
  const description =
    "Find answers to common questions about our products. Can't find what you're looking for? Contact our support team.";
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
  ];
  const heading = "Frequently asked questions";

  return (
    <section className="py-32">
      <div className="container space-y-16">
        <div
          className={cn(
            "mx-auto flex max-w-3xl flex-col md:text-center",
            direction === "rtl" ? "text-right" : "text-left",
          )}
        >
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
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger
                className="transition-opacity duration-200 hover:no-underline hover:opacity-60"
                direction={direction}
              >
                <div className="font-medium sm:py-1 lg:py-2 lg:text-lg">
                  {item.question}
                </div>
              </AccordionTrigger>
              <AccordionContent className="sm:mb-1 lg:mb-2">
                <div className="text-muted-foreground lg:text-lg">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

const Footer7 = ({ direction }: { direction: "ltr" | "rtl" }) => {
  const copyright = "© 2024 Shadcnblocks.com. All rights reserved.";
  const description =
    "A collection of components for your startup business or side project.";
  const legalLinks = [
    { href: "#", name: "Terms and Conditions" },
    { href: "#", name: "Privacy Policy" },
  ];
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
  ];
  const socialLinks = [
    {
      href: "#",
      icon: <InstagramLogoIcon className="size-5" />,
      label: "Instagram",
    },
    {
      href: "#",
      icon: <TwitterLogoIcon className="size-5" />,
      label: "Twitter",
    },
    {
      href: "#",
      icon: <LinkedInLogoIcon className="size-5" />,
      label: "LinkedIn",
    },
  ];
  const logo = {
    alt: "logo",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    title: "Shadcnblocks.com",
    url: "https://www.shadcnblocks.com",
  };

  return (
    <section className="py-32">
      <div className="container">
        <div
          className={cn(
            "flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start",
            direction === "rtl" ? "lg:text-right" : "lg:text-left",
          )}
        >
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            <div className="flex items-center gap-2 lg:justify-start">
              <a href={logo.url}>
                <img
                  alt={logo.alt}
                  className="h-8"
                  src={logo.src}
                  title={logo.title}
                />
              </a>
              <h2 className="text-xl font-semibold">{logo.title}</h2>
            </div>
            <p className="max-w-[70%] text-sm text-muted-foreground">
              {description}
            </p>
            <ul className="flex items-center space-x-6 text-muted-foreground">
              {socialLinks.map((social, idx) => (
                <li className="font-medium hover:text-primary" key={idx}>
                  <a aria-label={social.label} href={social.href}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      className="font-medium hover:text-primary"
                      key={linkIdx}
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div
          className={cn(
            "mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center",
            direction === "rtl" ? "md:text-right" : "md:text-left",
          )}
        >
          <p className="order-2 lg:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((link, idx) => (
              <li className="hover:text-primary" key={idx}>
                <a href={link.href}> {link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default function Client() {
  return (
    <>
      <Navbar5 direction="ltr" />
      <Hero12 direction="ltr" />
      <Feature43 />
      <Community1 />
      <Faq3 direction="ltr" />
      <Footer7 direction="ltr" />
    </>
  );
}
