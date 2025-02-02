import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";

const userUpdateSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email" })
    .nonempty({ message: "Email is required" })
    .describe("user email"),
  first_name: z
    .string()
    .regex(/^[a-zA-Z]+$/, { message: "First name must only contain letters" })
    .nonempty({ message: "First name is required" })
    .describe("user first name"),
  last_name: z
    .string()
    .regex(/^[a-zA-Z]+$/, { message: "Last name must only contain letters" })
    .nonempty({ message: "Last name is required" })
    .describe("user last name"),
  gender: z
    .enum(["Male", "Female", "Non-Binary", "Preferred not to say"])
    .describe("user gender"),
  profile_image_url: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .describe("user profile image URL"),
  user_id: z
    .string()
    .nonempty({ message: "User ID is required" })
    .describe("user ID"),
});

type userCreateProps = z.infer<typeof userCreateSchema>;

export const userCreate = async ({
  email,
  first_name,
  last_name,
  gender,
  profile_image_url,
  user_id,
}: userCreateProps) => {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { data, error } = await supabase
      .from("User")
      .insert([
        {
          email,
          first_name,
          last_name,
          gender,
          profile_image_url,
          user_id,
        },
      ])
      .select();

    if (data) return data;

    if (error) return error;
  } catch (error: any) {
    throw new Error(error.message)
  }
};
