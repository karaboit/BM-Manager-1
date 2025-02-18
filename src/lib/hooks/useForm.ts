import { useState } from "react";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";

export function useForm<T extends z.ZodType<any, any>>(
  schema: T,
  onSubmit: (data: z.infer<T>) => void | Promise<void>,
) {
  const [errors, setErrors] = useState<Record<string, string[]>>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: unknown) => {
    try {
      setIsSubmitting(true);
      setErrors(undefined);

      const validatedData = schema.parse(data);
      await onSubmit(validatedData);

      toast({
        title: "Success",
        description: "Form submitted successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string[]> = {};
        error.errors.forEach((err) => {
          const field = err.path.join(".");
          if (!fieldErrors[field]) fieldErrors[field] = [];
          fieldErrors[field].push(err.message);
        });
        setErrors(fieldErrors);

        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please check the form for errors",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, errors, isSubmitting };
}
