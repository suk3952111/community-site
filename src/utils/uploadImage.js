import { supabase } from "@/main";

export const uploadImage = async (image) => {
  const fileName = `${Date.now()}_${image.name}`;
  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(fileName, image, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError };
  }

  const { data: publicData, error: urlError } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  if (urlError) {
    return { error: urlError };
  }

  return { publicUrl: publicData.publicUrl };
};
