import { z } from "zod";
import { useState } from "react";
import { Link } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Brain, Eye, EyeOff } from "lucide-react";

import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import GoogleIcon from "@/components/icon/GoogleIcon";
import AppleIcon from "@/components/icon/AppleIcon";
import { Button } from "@/components/animate-ui/components/buttons/button";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  remember: z.boolean(),
});

type LoginValues = z.infer<typeof loginSchema>;

const FOREST_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB7fU-ggtCfFmo4Kq7fqHSwMXR2ut1rsJ3UTGjiVUA2C86Cj_4FSgPH89nkylA6ZKshXmN3ZAcAXiPnzhg1OgOF64xjHWVjSVj6E9nlt53h3a2s4FwbchU9cjl4SUv8yt9W16H_Azi0OZpOFo9PqvHjbsomaMZfKA5XExY3tq6Y2KH8b3PdEvaF4pdMQ3E4N3dy8g6FxJCllwv5Nlm8URHAdQwNGJqrDvrwHKLZdBiOw3oKQgK75LjBeto2aM7ET-eMztPNiAY-mINz";

export function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const onSubmit = () => {};

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="grid flex-1 md:grid-cols-[minmax(340px,1fr)_minmax(360px,1fr)]">
        <section className="relative hidden overflow-hidden md:flex">
          <img
            src={FOREST_IMAGE_URL}
            alt="Sunlight filtering through a lush green forest canopy"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-primary/15 via-background/10 to-background/45" />

          <div className="relative z-10 mt-auto flex max-w-lg flex-col gap-4 p-8 lg:p-12">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/75 px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase backdrop-blur-sm">
              <Brain className="size-3.5" />
              InsightForge AI
            </div>
            <h2 className="font-heading text-4xl leading-tight text-primary-foreground drop-shadow-sm lg:text-5xl">
              Cultivating clarity in a complex world.
            </h2>
            <p className="max-w-md text-base text-primary-foreground/90">
              Rooted in intelligence, designed for growth.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-6 md:px-10 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8 flex flex-col gap-2">
              <h1 className="font-heading text-4xl text-foreground sm:text-[2.5rem]">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Please enter your details to access your dashboard.
              </p>
            </div>

            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FieldGroup>
                <Field data-invalid={!!form.formState.errors.email}>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      aria-invalid={!!form.formState.errors.email}
                      {...form.register("email")}
                    />
                  </InputGroup>
                  <FieldError errors={[form.formState.errors.email]} />
                </Field>

                <Field data-invalid={!!form.formState.errors.password}>
                  <div className="flex items-center justify-between gap-2">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Button
                      variant="link"
                      size="sm"
                      type="button"
                      className="h-auto px-0 text-xs font-semibold"
                    >
                      Forgot Password?
                    </Button>
                  </div>
                  <InputGroup>
                    <InputGroupInput
                      id="password"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      aria-invalid={!!form.formState.errors.password}
                      {...form.register("password")}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        variant="ghost"
                        aria-label={
                          isPasswordVisible ? "Hide password" : "Show password"
                        }
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                      >
                        {isPasswordVisible ? <EyeOff /> : <Eye />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError errors={[form.formState.errors.password]} />
                </Field>

                <Controller
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <Field orientation="horizontal">
                      <Checkbox
                        id="remember"
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                      <FieldDescription className="text-sm">
                        <label htmlFor="remember" className="cursor-pointer">
                          Remember me for 30 days
                        </label>
                      </FieldDescription>
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button
                type="submit"
                size="lg"
                className="h-12 rounded-xl text-base font-semibold"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
                <ArrowRight data-icon="inline-end" />
              </Button>

              <FieldSeparator>Or continue with</FieldSeparator>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl"
                >
                  <GoogleIcon />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl"
                >
                  <AppleIcon />
                  Apple
                </Button>
              </div>
            </form>

            <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary underline underline-offset-4"
              >
                Create an Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 px-4 py-5 sm:px-6 md:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 text-sm text-muted-foreground md:flex-row md:justify-between">
          <p className="font-heading text-lg text-primary">InsightForge AI</p>
          <div className="flex items-center gap-5 text-xs sm:text-sm">
            <Link to="#" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link to="#" className="hover:text-foreground">
              Help Center
            </Link>
          </div>
          <p className="text-xs sm:text-sm">
            &copy; 2024 InsightForge AI. Rooted in Intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
