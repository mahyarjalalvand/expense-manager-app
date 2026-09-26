import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSession } from "@/hooks/useSession";
import { authClient } from "@/lib/auth-client";
import { LoginSchema, type LoginFormValues } from "@/schemas/auth";
import { Separator } from "@base-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function LoginForm() {
  const navigate = useNavigate();
  const { refetch } = useSession();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const submitHandler = (data: LoginFormValues) => {
    authClient.signIn.email(data, {
      onSuccess: async () => {
        toast.success("Welcome back!");

        await refetch();

        navigate("/");
      },
      onError: (error) => {
        toast.error(error.error.message);
      },
    });
  };
  return (
    <Card className="w-ful max-w-md border-border/60 shadow-xl">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg font-bold">EM</div>
        <div className="space-y-1">
          <CardTitle className="text-2xl">Welcome back</CardTitle>

          <CardDescription>Sign in to manage your income and expenses</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(submitHandler)}>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input {...field} id={field.name} type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <button type="button" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                    Forget password?
                  </button>
                </div>
                <Input {...field} id={field.name} type="password" placeholder="*********" autoComplete="current-password" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="my-6 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            Create account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
