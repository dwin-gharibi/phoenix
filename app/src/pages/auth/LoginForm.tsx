import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { css } from "@emotion/react";

import {
  Alert,
  Button,
  Flex,
  Form,
  Icon,
  Icons,
  Input,
  Label,
  Link,
  TextField,
  View,
} from "@phoenix/components";
import { getReturnUrl, prependBasename } from "@phoenix/utils/routingUtils";

type LoginFormParams = {
  email: string;
  password: string;
};

type LoginFormProps = {
  initialError: string | null;
  /**
   * Callback function called when the form is submitted
   */
  onSubmit?: () => void;
};
export function LoginForm(props: LoginFormProps) {
  const navigate = useNavigate();
  const { initialError, onSubmit: propsOnSubmit } = props;
  const [error, setError] = useState<string | null>(initialError);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onSubmit = useCallback(
    async (params: LoginFormParams) => {
      propsOnSubmit?.();
      setError(null);
      setIsLoading(true);

      // Sanitize email by trimming whitespace and converting to lowercase
      const sanitizedParams = {
        ...params,
        email: params.email.trim().toLowerCase(),
      };

      try {
        const response = await fetch(prependBasename("/auth/login"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sanitizedParams),
        });
        if (!response.ok) {
          const errorMessage =
            response.status === 429
              ? "Too many requests. Please try again later."
              : "Invalid login";
          setError(errorMessage);
          return;
        }
      } catch (error) {
        setError("Invalid login");
        return;
      } finally {
        setIsLoading(() => false);
      }
      const returnUrl = getReturnUrl();
      navigate(returnUrl);
    },
    [navigate, propsOnSubmit, setError]
  );
  const { control, handleSubmit } = useForm<LoginFormParams>({
    defaultValues: { email: "", password: "" },
  });
  return (
    <>
      {error ? (
        <View paddingBottom="size-100">
          <Alert variant="danger">{error}</Alert>{" "}
        </View>
      ) : null}
      <Form>
        <Flex direction="column" gap="size-100">
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
                autoComplete="email"
              >
                <Label>ایمیل</Label>
                <Input placeholder="ایمیل خود را وارد کنید" />
              </TextField>
            )}
          />
          <div
            css={css`
              position: relative;
              a {
                position: absolute;
                float: left;
                left: 0;
                top: var(--ac-global-dimension-size-50);
                font-size: 12px;
              }
            `}
          >
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  name="password"
                  type="password"
                  isRequired
                  onChange={onChange}
                  value={value}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(onSubmit)();
                    }
                  }}
                  autoComplete="password"
                >
                  <Label>رمز عبور</Label>
                  <Input placeholder="رمز عبور خود را وارد کنید" />
                </TextField>
              )}
            />
            <Link to="/forgot-password">رمز عبور را فراموش کردید؟</Link>
          </div>
          <Button
            variant="primary"
            isDisabled={isLoading}
            leadingVisual={
              isLoading ? <Icon svg={<Icons.LoadingOutline />} /> : undefined
            }
            onPress={() => handleSubmit(onSubmit)()}
          >
            {isLoading ? "در حال ورود" : "ورود"}
          </Button>
        </Flex>
      </Form>
    </>
  );
}
