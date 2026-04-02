import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MailCheck } from "lucide-react";

import { Button } from "@/components/animate-ui/components/buttons/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { RegisterFooter } from "@/pages/register/components/RegisterFooter";
import { RegisterTopBar } from "@/pages/register/components/RegisterTopBar";

const otpSchema = z.object({
  code: z
    .string()
    .length(6, "Please enter the 6-digit verification code.")
    .regex(/^\d+$/, "The verification code must contain only numbers."),
});

type OtpValues = z.infer<typeof otpSchema>;

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);

  const email = searchParams.get("email") ?? "elena.vfx@example.com";

  const form = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async () => {
    navigate("/register/success");
  };

  const onResendCode = async () => {
    setIsResending(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsResending(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <RegisterTopBar activeStep="verification" />

      <main className="flex flex-1 items-center justify-center px-4 pt-24 pb-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <Card className="rounded-3xl border border-border/70 bg-card shadow-[0_4px_20px_rgba(46,50,48,0.06)]">
            <CardContent className="flex flex-col items-center px-6 pt-10 pb-9 text-center sm:px-10 sm:pt-12 sm:pb-11">
              <div className="mb-8 flex size-24 items-center justify-center rounded-full bg-primary/20 text-primary">
                <MailCheck className="size-12" />
              </div>

              <h1 className="font-heading text-5xl font-semibold tracking-tight text-foreground">
                Verify Your Email
              </h1>
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
                We&apos;ve sent a 6-digit code to{" "}
                <strong className="text-foreground">{email}</strong>. Please
                enter it below to continue.
              </p>

              <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-9 flex w-full max-w-md flex-col gap-6"
              >
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <Field data-invalid={!!form.formState.errors.code}>
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={(value) =>
                            form.setValue("code", value, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            })
                          }
                          containerClassName="justify-center"
                        >
                          <InputOTPGroup className="gap-3 rounded-none border-none">
                            <InputOTPSlot
                              index={0}
                              className="size-16 rounded-xl border text-3xl first:rounded-xl first:border"
                            />
                            <InputOTPSlot
                              index={1}
                              className="size-16 rounded-xl border text-3xl first:rounded-xl first:border"
                            />
                            <InputOTPSlot
                              index={2}
                              className="size-16 rounded-xl border text-3xl first:rounded-xl first:border"
                            />
                            <InputOTPSlot
                              index={3}
                              className="size-16 rounded-xl border text-3xl first:rounded-xl first:border"
                            />
                            <InputOTPSlot
                              index={4}
                              className="size-16 rounded-xl border text-3xl first:rounded-xl first:border"
                            />
                            <InputOTPSlot
                              index={5}
                              className="size-16 rounded-xl border text-3xl first:rounded-xl first:border"
                            />
                          </InputOTPGroup>
                        </InputOTP>
                        <FieldError
                          errors={[form.formState.errors.code]}
                          className="mt-2 text-center"
                        />
                      </Field>
                    )}
                  />
                </FieldGroup>

                <Button
                  type="submit"
                  size="lg"
                  className="h-14 rounded-2xl text-xl font-semibold"
                >
                  Verify & Continue
                </Button>

                <p className="text-sm text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto px-0 font-semibold"
                    onClick={onResendCode}
                    disabled={isResending}
                  >
                    {isResending ? "Resending..." : "Resend Code"}
                  </Button>
                  .
                </p>

                <FieldSeparator>Or</FieldSeparator>

                <p className="text-sm text-muted-foreground">
                  You can also{" "}
                  <span className="font-semibold text-primary">
                    click the link
                  </span>{" "}
                  in the email we just sent to automatically verify your
                  account.
                </p>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-base font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-4" />
              Back to registration
            </Link>
          </div>
        </div>
      </main>

      <RegisterFooter />
    </div>
  );
}
