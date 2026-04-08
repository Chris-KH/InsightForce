import { z } from "zod";
import { useState } from "react";
import { Link } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Brain, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";

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

const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const formItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 },
  },
};

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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <motion.div
        className="pointer-events-none absolute -top-24 -left-20 size-96 rounded-full bg-primary/12 blur-[100px]"
        animate={{
          x: [0, 24, 0],
          y: [0, -18, 0],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-0 size-96 rounded-full bg-chart-1/15 blur-[120px]"
        animate={{
          x: [0, -18, 0],
          y: [0, 16, 0],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 14, repeat: Infinity, delay: 1.4 }}
      />

      <motion.main
        className="relative z-10 grid flex-1 md:grid-cols-[minmax(340px,1fr)_minmax(360px,1fr)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.section className="relative hidden overflow-hidden md:flex">
          <motion.img
            src={FOREST_IMAGE_URL}
            alt="Sunlight filtering through a lush green forest canopy"
            className="absolute inset-0 size-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.div
            className="absolute inset-0 bg-linear-to-b from-primary/15 via-background/10 to-background/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          />

          <motion.div
            className="relative z-10 mt-auto flex max-w-lg flex-col gap-4 p-8 lg:p-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <motion.div
              className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/75 px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase backdrop-blur-sm"
              whileHover={{ scale: 1.06, y: -2 }}
            >
              <Brain className="size-3.5" />
              Insight<span className="text-chart-1">Forge AI</span>
            </motion.div>
            <motion.h2
              className="font-heading text-4xl leading-tight text-primary-foreground drop-shadow-sm lg:text-5xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Cultivating clarity in a complex world.
            </motion.h2>
            <motion.p
              className="max-w-md text-base text-primary-foreground/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Rooted in intelligence, designed for growth.
            </motion.p>
          </motion.div>
        </motion.section>

        <motion.section
          className="flex items-center justify-center px-4 py-8 sm:px-6 md:px-10 lg:px-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="w-full max-w-md">
            <motion.div
              className="mb-8 flex flex-col gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-heading text-4xl text-foreground sm:text-[2.5rem]">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Please enter your details to access your dashboard.
              </p>
            </motion.div>

            <motion.form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
              variants={formContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <FieldGroup>
                <motion.div variants={formItemVariants}>
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
                </motion.div>

                <motion.div variants={formItemVariants}>
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
                            isPasswordVisible
                              ? "Hide password"
                              : "Show password"
                          }
                          onClick={() => setIsPasswordVisible((prev) => !prev)}
                        >
                          {isPasswordVisible ? <EyeOff /> : <Eye />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldError errors={[form.formState.errors.password]} />
                  </Field>
                </motion.div>

                <motion.div variants={formItemVariants}>
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
                </motion.div>
              </FieldGroup>

              <motion.div
                variants={formItemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 w-full rounded-xl text-base font-semibold"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </motion.div>

              <motion.div variants={formItemVariants}>
                <FieldSeparator>Or continue with</FieldSeparator>
              </motion.div>

              <motion.div
                className="grid grid-cols-2 gap-3"
                variants={formItemVariants}
              >
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full rounded-xl"
                  >
                    <GoogleIcon />
                    Google
                  </Button>
                </motion.div>
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full rounded-xl"
                  >
                    <AppleIcon />
                    Apple
                  </Button>
                </motion.div>
              </motion.div>
            </motion.form>

            <motion.div
              className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary underline underline-offset-4"
              >
                <motion.span whileHover={{ x: 2 }} className="inline-block">
                  Create an Account
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </motion.main>

      <footer className="border-t border-border/70 px-4 py-5 sm:px-6 md:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 text-sm text-muted-foreground md:flex-row md:justify-between">
          <p className="font-heading text-lg text-primary">
            Insight<span className="text-chart-1">Forge AI</span>
          </p>
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
            &copy; 2024 InsightForge <span className="text-chart-1">AI</span>.
            Rooted in Intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
