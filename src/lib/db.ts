import { toast } from "sonner";
import { supabase } from "./supabase";
import type { FeedbackRow, FileRow } from "./types";

// Create file row
const uploadFileRow = async (
  data: Omit<FileRow, "id" | "created_at">
): Promise<FileRow> => {
  const { data: row, error } = await supabase
    .from("files")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return row;
};

// Fetch all files for workspace
const getWorkspaceFiles = async (): Promise<FileRow[]> => {
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Get feedback for one file
const getFeedbackForFile = async (fileId: string): Promise<FeedbackRow[]> => {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("file_id", fileId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

async function deleteAllFiles(password: string) {
  if (password !== import.meta.env.VITE_MY_CUSTOM_PWD) {
    throw new Error("Invalid admin password");
  }

  const { error } = await supabase
    .from("files")
    .delete()
    .gt("created_at", "0001-01-01");

  if (error) throw error;

  toast.success("All files deleted");
}

async function getSingleFile(id: string): Promise<FileRow> {
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// Feedback
const addFeedback = async (
  data: Omit<FeedbackRow, "id" | "created_at">
): Promise<FeedbackRow> => {
  const { data: row, error } = await supabase
    .from("feedback")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return row;
};

const updateFeedbackComment = async (params: {
  id: string;
  comment: string | null;
}): Promise<FeedbackRow> => {
  const { data, error } = await supabase
    .from("feedback")
    .update({ comment: params.comment })
    .eq("id", params.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
const deleteFeedback = async (id: string): Promise<void> => {
  const { error } = await supabase.from("feedback").delete().eq("id", id);

  if (error) throw error;
};

export {
  addFeedback,
  deleteAllFiles,
  deleteFeedback,
  getFeedbackForFile,
  getSingleFile,
  getWorkspaceFiles,
  updateFeedbackComment,
  uploadFileRow,
};
