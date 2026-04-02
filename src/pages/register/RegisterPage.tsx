import { z } from "zod";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/animate-ui/components/buttons/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { RegisterFooter } from "@/pages/register/components/RegisterFooter";
import { RegisterTopBar } from "@/pages/register/components/RegisterTopBar";

const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long."),
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

type RegisterValues = z.infer<typeof registerSchema>;
const FOREST_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBoA1_0xa93mdmNM0qNJYBKschgHgFcfa3OYVwOU7mA97roaO_V8T_6YvXgejDRJai2KNqAbdJ9lGFQMM5wKpBmHzFLO1pC6-hovGjV3P55Ia37DuN0M0QyaENV7kSSG7oRtjAUPDyTT5_UcW-_-CIucgQkf2CDOk73AxrFvLUvTmqKsZBFyBEQ6GC586sP7yfRqzJrPONsrauJdOEW-pOiStNSQVcE_RAN_Bgz42pfVCsMohOF_hDg8u3z1s__9Pz761wi4aeRNGr8";

function RegisterFields({
  form,
  isPasswordVisible,
  onTogglePassword,
}: {
  form: UseFormReturn<RegisterValues>;
  isPasswordVisible: boolean;
  onTogglePassword: () => void;
}) {
  return (
    <FieldGroup>
      <Field data-invalid={!!form.formState.errors.fullName}>
        <FieldLabel htmlFor="full-name">Name</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="full-name"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            aria-invalid={!!form.formState.errors.fullName}
            {...form.register("fullName")}
          />
        </InputGroup>
        <FieldError errors={[form.formState.errors.fullName]} />
      </Field>

      <Field data-invalid={!!form.formState.errors.email}>
        <FieldLabel htmlFor="email">Email Address</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="email"
            type="email"
            placeholder="example@insightforge.com"
            autoComplete="email"
            aria-invalid={!!form.formState.errors.email}
            {...form.register("email")}
          />
        </InputGroup>
        <FieldError errors={[form.formState.errors.email]} />
      </Field>

      <Field data-invalid={!!form.formState.errors.password}>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            aria-invalid={!!form.formState.errors.password}
            {...form.register("password")}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="ghost"
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              onClick={onTogglePassword}
            >
              {isPasswordVisible ? <EyeOff /> : <Eye />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldError errors={[form.formState.errors.password]} />
      </Field>

      <FieldDescription className="text-xs leading-relaxed text-muted-foreground">
        By joining, you agree to our <Link to="#">Terms of Service</Link> and{" "}
        <Link to="#">Privacy Policy</Link>.
      </FieldDescription>
    </FieldGroup>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    navigate(`/register/verify?email=${encodeURIComponent(values.email)}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted text-muted-foreground">
      <RegisterTopBar activeStep="account" />

      <main className="flex flex-1 items-center justify-center px-4 pt-24 pb-10 sm:px-6 lg:px-8">
        <Card className="w-full max-w-7xl overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[0_4px_20px_rgba(46,50,48,0.06)]">
          <div className="grid min-h-190 grid-cols-1 md:grid-cols-2">
            <section className="relative hidden md:flex">
              <img
                src={FOREST_IMAGE_URL}
                alt="Sunlight streaming through a dense green forest canopy"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-primary/60 to-transparent" />

              <div className="relative z-10 mt-auto flex flex-col gap-4 p-10 lg:p-12">
                <h2 className="font-heading text-5xl leading-tight font-semibold text-primary-foreground drop-shadow-sm">
                  Rooted in Community.
                  <br />
                  Driven by Insight.
                </h2>
                <p className="text-lg leading-relaxed text-primary-foreground/90">
                  Join a global network of creators and analysts shaping the
                  future through collective intelligence.
                </p>
              </div>
            </section>

            <section className="flex items-center justify-center bg-background px-5 py-10 sm:px-8 lg:px-12">
              <div className="w-full max-w-md">
                <CardHeader className="px-0 pt-0 pb-8">
                  <p className="font-heading text-4xl font-bold tracking-tight text-primary">
                    Insight<span className="text-chart-1">Force AI</span>
                  </p>

                  <CardTitle className="mt-7 font-heading text-5xl leading-tight font-semibold text-foreground">
                    Join the Forge
                  </CardTitle>
                  <p className="mt-1 text-base text-muted-foreground">
                    Start turning your community insights into action.
                  </p>
                </CardHeader>

                <CardContent className="px-0 pb-0">
                  <div className="flex flex-col gap-4 lg:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="flex-1 rounded-xl py-2 font-medium"
                    >
                      <GoogleIcon />
                      Continue with Google
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      className="flex-1 rounded-xl bg-black py-2 text-white hover:bg-black/90"
                    >
                      <AppleIcon className="text-white" />
                      Continue with Apple
                    </Button>
                  </div>

                  <FieldSeparator className="mt-8 mb-7">
                    Or sign up with email
                  </FieldSeparator>

                  <form
                    noValidate
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-5"
                  >
                    <RegisterFields
                      form={form}
                      isPasswordVisible={isPasswordVisible}
                      onTogglePassword={() =>
                        setIsPasswordVisible((previous) => !previous)
                      }
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="mt-1 h-14 rounded-2xl text-xl font-semibold"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting
                        ? "Creating Account..."
                        : "Create Account"}
                    </Button>
                  </form>

                  <p className="mt-8 text-center text-base text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      Log in
                    </Link>
                  </p>
                </CardContent>
              </div>
            </section>
          </div>
        </Card>
      </main>

      <RegisterFooter />
    </div>
  );
}
