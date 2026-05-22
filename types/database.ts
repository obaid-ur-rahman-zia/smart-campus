export type UserRole = "student" | "teacher" | "staff" | "admin";
export type RequestType = "complaint" | "document";
export type RequestStatus = "pending" | "in_review" | "approved" | "rejected" | "resolved";

export type ServiceRequest = {
  id: string;
  user_id: string;
  request_type: RequestType;
  title: string;
  description: string;
  category: string;
  status: RequestStatus;
  priority: "low" | "medium" | "high";
  admin_note: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  full_name: string;
  roll_number: string | null;
  department: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
};
