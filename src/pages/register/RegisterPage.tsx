import { z } from "zod";
import { Link } from "react-router";
import { useMemo, useState } from "react";
import { Controller, type UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";

import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  CADENCE_OPTIONS,
  GOAL_OPTIONS,
  NICHE_OPTIONS,
  PLATFORM_OPTIONS,
  STRATEGY_FOCUS_OPTIONS,
} from "@/pages/register/data";
import { RegisterFooter } from "@/pages/register/components/RegisterFooter";
import { RegisterSidebar } from "@/pages/register/components/RegisterSidebar";
import { RegisterTopBar } from "@/pages/register/components/RegisterTopBar";

const registerSchema = z
  .object({
    channelName: z
      .string()
      .trim()
      .min(2, "Channel name must be at least 2 characters."),
    platform: z.enum(PLATFORM_OPTIONS, {
      error: "Please choose your primary platform.",
    }),
    niche: z.enum(NICHE_OPTIONS, {
      error: "Please choose a content niche.",
    }),
    audienceSize: z
      .number()
      .min(0, "Audience size cannot be negative.")
      .max(1_000_000, "Audience size is out of range."),
    goals: z
      .array(z.enum(GOAL_OPTIONS))
      .min(1, "Select at least one growth goal."),
    postingCadence: z.enum(CADENCE_OPTIONS, {
      error: "Please choose your publishing cadence.",
    }),
    strategyFocus: z.enum(STRATEGY_FOCUS_OPTIONS, {
      error: "Please select your strategy focus.",
    }),
    email: z.string().trim().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string().min(8, "Please confirm your password."),
    acceptTerms: z
      .boolean()
      .refine((accepted) => accepted, "You must accept terms to continue."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match.",
  });

type RegisterValues = z.infer<typeof registerSchema>;
type RegisterForm = UseFormReturn<RegisterValues, unknown, RegisterValues>;

type StepIndex = 0 | 1 | 2;

const STEP_META = [
  {
    title: "Tell us about your channel",
    description: "Set your baseline so we can tailor strategy recommendations.",
    fields: ["channelName", "platform", "niche", "audienceSize"] as const,
  },
  {
    title: "Define your growth plan",
    description: "Choose the optimization priorities for your next 90 days.",
    fields: ["goals", "postingCadence", "strategyFocus"] as const,
  },
  {
    title: "Secure your workspace",
    description: "Finish account setup and launch your personalized dashboard.",
    fields: ["email", "password", "confirmPassword", "acceptTerms"] as const,
  },
] as const;

function getAudienceLabel(value: number) {
  if (value >= 1_000_000) {
    return "1M+";
  }

  if (value >= 1_000) {
    return `${Math.floor(value / 1_000)}k`;
  }

  return `${value}`;
}

function toggleGoal(
  goal: (typeof GOAL_OPTIONS)[number],
  goals: RegisterValues["goals"],
) {
  if (goals.includes(goal)) {
    return goals.filter((item) => item !== goal);
  }

  return [...goals, goal];
}

function StepProgress({ currentStep }: { currentStep: StepIndex }) {
  return (
    <div className="flex items-center gap-3">
      {STEP_META.map((step, index) => {
        const isActive = index <= currentStep;

        return (
          <div
            key={step.title}
            className={
              isActive
                ? "h-2 w-full rounded-full bg-primary"
                : "h-2 w-full rounded-full bg-muted"
            }
          />
        );
      })}
      <span className="min-w-max text-sm font-semibold text-primary">
        Step {currentStep + 1} of 3
      </span>
    </div>
  );
}

function StepOneFields({ form }: { form: RegisterForm }) {
  return (
    <FieldGroup>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field data-invalid={!!form.formState.errors.channelName}>
          <FieldLabel htmlFor="channel-name">Channel Name</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="channel-name"
              placeholder="e.g. Minimalist Tech"
              aria-invalid={!!form.formState.errors.channelName}
              {...form.register("channelName")}
            />
          </InputGroup>
          <FieldError errors={[form.formState.errors.channelName]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.platform}>
          <FieldLabel htmlFor="platform">Primary Platform</FieldLabel>
          <select
            id="platform"
            className="h-11 rounded-md border border-input bg-background px-3 text-sm shadow-xs transition-[box-shadow,border-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-invalid={!!form.formState.errors.platform}
            {...form.register("platform")}
          >
            {PLATFORM_OPTIONS.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
          <FieldError errors={[form.formState.errors.platform]} />
        </Field>
      </div>

      <Controller
        control={form.control}
        name="niche"
        render={({ field }) => (
          <Field data-invalid={!!form.formState.errors.niche}>
            <FieldLabel>Content Niche</FieldLabel>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {NICHE_OPTIONS.map((option) => {
                const isActive = field.value === option;

                return (
                  <Button
                    key={option}
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    className={
                      isActive
                        ? "h-10 rounded-full border border-primary/40 bg-primary/20 text-foreground hover:bg-primary/30"
                        : "h-10 rounded-full"
                    }
                    onClick={() => field.onChange(option)}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>
            <FieldError errors={[form.formState.errors.niche]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="audienceSize"
        render={({ field }) => (
          <Field data-invalid={!!form.formState.errors.audienceSize}>
            <FieldLabel htmlFor="audience-size">
              Current Audience Size
            </FieldLabel>
            <input
              id="audience-size"
              type="range"
              min={0}
              max={1_000_000}
              step={10_000}
              value={field.value}
              onChange={(event) => field.onChange(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
            />
            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              <span>0</span>
              <span>{getAudienceLabel(field.value)}</span>
              <span>1M+</span>
            </div>
            <FieldError errors={[form.formState.errors.audienceSize]} />
          </Field>
        )}
      />
    </FieldGroup>
  );
}

function StepTwoFields({ form }: { form: RegisterForm }) {
  return (
    <FieldGroup>
      <Controller
        control={form.control}
        name="goals"
        render={({ field }) => (
          <Field data-invalid={!!form.formState.errors.goals}>
            <FieldLabel>Growth Goals</FieldLabel>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {GOAL_OPTIONS.map((goal) => {
                const isActive = field.value.includes(goal);

                return (
                  <Button
                    key={goal}
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    className={
                      isActive
                        ? "h-10 justify-start rounded-full border border-primary/40 bg-primary/20 px-4 text-foreground hover:bg-primary/30"
                        : "h-10 justify-start rounded-full px-4"
                    }
                    onClick={() =>
                      field.onChange(toggleGoal(goal, field.value))
                    }
                  >
                    {goal}
                  </Button>
                );
              })}
            </div>
            <FieldError errors={[form.formState.errors.goals]} />
          </Field>
        )}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field data-invalid={!!form.formState.errors.postingCadence}>
          <FieldLabel htmlFor="posting-cadence">Posting Cadence</FieldLabel>
          <select
            id="posting-cadence"
            className="h-11 rounded-md border border-input bg-background px-3 text-sm shadow-xs transition-[box-shadow,border-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-invalid={!!form.formState.errors.postingCadence}
            {...form.register("postingCadence")}
          >
            {CADENCE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError errors={[form.formState.errors.postingCadence]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.strategyFocus}>
          <FieldLabel htmlFor="strategy-focus">
            Primary Strategy Focus
          </FieldLabel>
          <select
            id="strategy-focus"
            className="h-11 rounded-md border border-input bg-background px-3 text-sm shadow-xs transition-[box-shadow,border-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-invalid={!!form.formState.errors.strategyFocus}
            {...form.register("strategyFocus")}
          >
            {STRATEGY_FOCUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError errors={[form.formState.errors.strategyFocus]} />
        </Field>
      </div>
    </FieldGroup>
  );
}

function StepThreeFields({
  form,
  isPasswordVisible,
  setIsPasswordVisible,
  isConfirmVisible,
  setIsConfirmVisible,
}: {
  form: RegisterForm;
  isPasswordVisible: boolean;
  setIsPasswordVisible: (next: boolean) => void;
  isConfirmVisible: boolean;
  setIsConfirmVisible: (next: boolean) => void;
}) {
  return (
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
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            aria-invalid={!!form.formState.errors.password}
            {...form.register("password")}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="ghost"
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <EyeOff /> : <Eye />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldError errors={[form.formState.errors.password]} />
      </Field>

      <Field data-invalid={!!form.formState.errors.confirmPassword}>
        <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="confirm-password"
            type={isConfirmVisible ? "text" : "password"}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            aria-invalid={!!form.formState.errors.confirmPassword}
            {...form.register("confirmPassword")}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="ghost"
              aria-label={isConfirmVisible ? "Hide password" : "Show password"}
              onClick={() => setIsConfirmVisible(!isConfirmVisible)}
            >
              {isConfirmVisible ? <EyeOff /> : <Eye />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldError errors={[form.formState.errors.confirmPassword]} />
      </Field>

      <Controller
        control={form.control}
        name="acceptTerms"
        render={({ field }) => (
          <Field
            data-invalid={!!form.formState.errors.acceptTerms}
            orientation="horizontal"
          >
            <Checkbox
              id="accept-terms"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            <FieldDescription className="text-sm leading-relaxed">
              <label htmlFor="accept-terms" className="cursor-pointer">
                I agree to the Terms of Service and Privacy Policy.
              </label>
            </FieldDescription>
          </Field>
        )}
      />
      <FieldError errors={[form.formState.errors.acceptTerms]} />
    </FieldGroup>
  );
}

export function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<StepIndex>(0);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const form = useForm<RegisterValues, unknown, RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      channelName: "",
      platform: "YouTube",
      niche: "Technology",
      audienceSize: 500_000,
      goals: ["Grow subscribers"],
      postingCadence: "Weekly",
      strategyFocus: "Audience growth",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const stepConfig = STEP_META[currentStep];

  const canGoBack = currentStep > 0;
  const isLastStep = currentStep === 2;

  const submitLabel = useMemo(() => {
    if (form.formState.isSubmitting) {
      return "Creating Workspace...";
    }

    return "Create Account";
  }, [form.formState.isSubmitting]);

  const nextStep = async () => {
    const valid = await form.trigger(stepConfig.fields, { shouldFocus: true });
    if (!valid) {
      return;
    }

    if (currentStep < 2) {
      setCurrentStep((currentStep + 1) as StepIndex);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((currentStep - 1) as StepIndex);
    }
  };

  const onSubmit = async () => {
    return;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <RegisterTopBar />

      <main className="flex-1 px-4 pt-24 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-7 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <Card className="rounded-3xl border border-border/70 bg-card shadow-sm">
              <CardContent className="flex flex-col gap-9 px-6 pt-8 pb-10 md:px-10 md:pt-10 md:pb-12">
                <header className="flex flex-col gap-2">
                  <h1 className="font-heading text-5xl leading-none font-semibold tracking-tight">
                    Begin Your Evolution
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Connect your creative vision with predictive intelligence.
                  </p>
                </header>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 flex-1 rounded-xl text-base font-semibold"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </Button>
                  <Button
                    type="button"
                    className="h-12 flex-1 rounded-xl bg-black text-base font-semibold text-white hover:bg-black/90"
                  >
                    <AppleIcon className="text-white" />
                    Continue with Apple
                  </Button>
                </div>

                <FieldSeparator>Or register manually</FieldSeparator>

                <StepProgress currentStep={currentStep} />

                <form
                  noValidate
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-7"
                >
                  <div className="flex flex-col gap-2">
                    <h2 className="font-heading text-4xl leading-none font-semibold">
                      {stepConfig.title}
                    </h2>
                    <p className="text-base text-muted-foreground">
                      {stepConfig.description}
                    </p>
                  </div>

                  {currentStep === 0 && <StepOneFields form={form} />}
                  {currentStep === 1 && <StepTwoFields form={form} />}
                  {currentStep === 2 && (
                    <StepThreeFields
                      form={form}
                      isPasswordVisible={isPasswordVisible}
                      setIsPasswordVisible={setIsPasswordVisible}
                      isConfirmVisible={isConfirmVisible}
                      setIsConfirmVisible={setIsConfirmVisible}
                    />
                  )}

                  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    {canGoBack ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 rounded-xl px-7 text-base"
                        onClick={previousStep}
                      >
                        <ArrowLeft data-icon="inline-start" />
                        Back
                      </Button>
                    ) : (
                      <span />
                    )}

                    {isLastStep ? (
                      <Button
                        type="submit"
                        className="h-12 rounded-xl px-8 text-lg font-semibold"
                        disabled={form.formState.isSubmitting}
                      >
                        {submitLabel}
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="h-12 rounded-xl px-8 text-lg font-semibold"
                        onClick={nextStep}
                      >
                        Continue to{" "}
                        {currentStep === 0 ? "Preferences" : "Security"}
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                    )}
                  </div>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-primary underline underline-offset-4"
                  >
                    Sign in here
                  </Link>
                </p>
              </CardContent>
            </Card>
          </section>

          <RegisterSidebar />
        </div>
      </main>

      <RegisterFooter />
    </div>
  );
}
