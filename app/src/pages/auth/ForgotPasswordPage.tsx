import { useState } from "react";
import { css } from "@emotion/react";

import { Flex, Heading, Link } from "@phoenix/components";

import { AuthLayout } from "./AuthLayout";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export function ForgotPasswordPage() {
  const [resetSent, setResetSent] = useState<boolean>(false);
  const content = resetSent ? (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap="size-100"
    >
      <Heading level={1}>بررسی ایمیل وارد شده</Heading>
      <p>
        {`از شما ممنونیم! اگر این ایمیل متعلق به حساب کاربری معتبری در سامانه باشد، به زودی لینک بازیابی رمز عبور برای شما ارسال خواهد شد`}
      </p>
    </Flex>
  ) : (
    <>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap="size-100"
      >
        <Heading level={1}>فراموشی رمز عبور</Heading>
        <p>
          {`ایمیل مرتبط با حساب کاربری خود را وارد کنید. برای بازیابی حساب‌ کاربری برای شما لینک بازنشانی رمز عبور ارسال خواهد شد`}
        </p>
      </Flex>
      <ForgotPasswordForm onResetSent={() => setResetSent(true)} />
    </>
  );
  return (
    <AuthLayout>
      <div
        css={css`
          & a {
            text-align: center;
            width: 100%;
            display: block;
            text-align: center;
            padding-top: var(--ac-global-dimension-size-200);
          }
        `}
      >
        {content}
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap="size-200"
        >
          <Link to="/login">برگشت به صفحه ورود</Link>
        </Flex>
      </div>
    </AuthLayout>
  );
}
