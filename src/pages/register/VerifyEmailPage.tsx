import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MailCheck } from "lucide-react";
import { motion } from "motion/react";
import { useBilingual } from "@/hooks/use-bilingual";

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

const verifyFormVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const verifyItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export function VerifyEmailPage() {
  const copy = useBilingual();
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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <motion.div
        className="pointer-events-none absolute -top-20 -left-20 size-80 rounded-full bg-primary/12 blur-[110px]"
        animate={{
          x: [0, 20, 0],
          y: [0, -14, 0],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 11, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-chart-1/12 blur-[110px]"
        animate={{
          x: [0, -16, 0],
          y: [0, 12, 0],
          opacity: [0.12, 0.24, 0.12],
        }}
        transition={{ duration: 13, repeat: Infinity, delay: 1.2 }}
      />

      <RegisterTopBar activeStep="verification" />

      <motion.main
        className="relative z-10 flex flex-1 items-center justify-center px-4 pt-24 pb-10 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Card className="rounded-3xl border border-border/70 bg-card shadow-[0_4px_20px_rgba(46,50,48,0.06)]">
            <CardContent className="flex flex-col items-center px-6 pt-10 pb-9 text-center sm:px-10 sm:pt-12 sm:pb-11">
              <motion.div
                className="mb-8 flex size-24 items-center justify-center rounded-full bg-primary/20 text-primary"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotate: -6 }}
              >
                <MailCheck className="size-12" />
              </motion.div>

              <motion.h1
                className="font-heading text-5xl font-semibold tracking-tight text-foreground"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {copy("Verify Your Email", "Xác minh email")}
              </motion.h1>
              <motion.p
                className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {copy(
                  "We've sent a 6-digit code to",
                  "Chúng tôi đã gửi mã 6 chữ số tới",
                )}{" "}
                <strong className="text-foreground">{email}</strong>. Please{" "}
                {copy(
                  "Please enter it below to continue.",
                  "Vui lòng nhập bên dưới để tiếp tục.",
                )}
              </motion.p>

              <motion.form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-9 flex w-full max-w-md flex-col gap-6"
                variants={verifyFormVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={verifyItemVariants}>
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
                </motion.div>

                <motion.div
                  variants={verifyItemVariants}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="h-14 rounded-2xl text-xl font-semibold"
                  >
                    {copy("Verify & Continue", "Xác minh & Tiếp tục")}
                  </Button>
                </motion.div>

                <motion.p
                  className="text-sm text-muted-foreground"
                  variants={verifyItemVariants}
                >
                  {copy(
                    "Didn't receive the email? Check your spam folder or",
                    "Không nhận được email? Hãy kiểm tra thư rác hoặc",
                  )}{" "}
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto px-0 font-semibold"
                    onClick={onResendCode}
                    disabled={isResending}
                  >
                    {copy(
                      isResending ? "Resending..." : "Resend Code",
                      isResending ? "Đang gửi lại..." : "Gửi lại mã",
                    )}
                  </Button>
                  .
                </motion.p>

                <motion.div variants={verifyItemVariants}>
                  <FieldSeparator>{copy("Or", "Hoặc")}</FieldSeparator>
                </motion.div>

                <motion.p
                  className="text-sm text-muted-foreground"
                  variants={verifyItemVariants}
                >
                  {copy("You can also", "Bạn cũng có thể")}{" "}
                  <span className="font-semibold text-primary">
                    {copy("click the link", "nhấn vào liên kết")}
                  </span>{" "}
                  {copy(
                    "in the email we just sent to automatically verify your account.",
                    "trong email vừa gửi để tự động xác minh tài khoản.",
                  )}
                </motion.p>
              </motion.form>
            </CardContent>
          </Card>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-base font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-4" />
              {copy("Back to registration", "Quay lại đăng ký")}
            </Link>
          </motion.div>
        </motion.div>
      </motion.main>

      <RegisterFooter />
    </div>
  );
}
