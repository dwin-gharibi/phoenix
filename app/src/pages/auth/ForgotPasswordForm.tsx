import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { css } from "@emotion/react";

import {
  Alert,
  Button,
  Form,
  Input,
  Label,
  Text,
  TextField,
  View,
} from "@phoenix/components";
import { prependBasename } from "@phoenix/utils/routingUtils";

type ForgotPasswordFormParams = {
  email: string;
};

export function ForgotPasswordForm({
  onResetSent,
}: {
  onResetSent: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onSubmit = useCallback(
    async (params: ForgotPasswordFormParams) => {
      setError(null);
      setIsLoading(true);

      // Sanitize email by trimming whitespace and converting to lowercase
      const sanitizedParams = {
        ...params,
        email: params.email.trim().toLowerCase(),
      };

      try {
        const response = await fetch(
          prependBasename("/auth/password-reset-email"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sanitizedParams),
          }
        );
        if (!response.ok) {
          const message = await response.text();
          setError(message);
          return;
        }
        onResetSent();
      } finally {
        setIsLoading(() => false);
      }
    },
    [onResetSent, setError]
  );
  const { control, handleSubmit } = useForm<ForgotPasswordFormParams>({
    defaultValues: { email: "" },
  });
  return (
    <>
      {error ? (
        <View paddingBottom="size-100">
          <Alert variant="danger">{error}</Alert>
        </View>
      ) : null}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextField
              name="email"
              isRequired
              type="email"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            >
              <Label>ایمیل</Label>
              <Input placeholder="ایمیل خود را وارد کنید" />
              <Text slot="description">
                ایمیل مرتبط با حساب کاربری خود را وارد کنید
              </Text>
            </TextField>
          )}
        />
        <div
          css={css`
            margin-top: var(--ac-global-dimension-size-200);
            margin-bottom: var(--ac-global-dimension-size-50);
            button {
              width: 100%;
            }
          `}
        >
          <Button variant="primary" type={"submit"} isDisabled={isLoading}>
            {isLoading ? "در حال بازیابی رمز عبور..." : "بازیابی رمز عبور"}
          </Button>
        </div>
      </Form>
    </>
  );
}
