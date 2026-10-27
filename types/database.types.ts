export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type ProjectRow = {
  id: string; slug: string; title: string; category: string; summary: string; concept: string;
  ai_experience: string; status: "Complete" | "In progress" | "Archived"; image_url: string;
  project_url: string; technologies: string[]; featured: boolean; sort_order: number;
  created_at: string; updated_at: string;
};
type EventRow = {
  id: number; event_type: "page_view" | "cv_click" | "contact_sent"; path: string;
  session_id: string; created_at: string; event_day: string;
};
type MessageRow = {
  id: string; name: string; email: string; subject: string; message: string;
  created_at: string; read_at: string | null;
};
type SettingsRow = { key: string; value: string; updated_at: string };

export type Database = {
  public: {
    Tables: {
      portfolio_projects: { Row: ProjectRow; Insert: Omit<ProjectRow, "id" | "created_at" | "updated_at"> & Partial<Pick<ProjectRow, "id" | "created_at" | "updated_at">>; Update: Partial<ProjectRow>; Relationships: [] };
      portfolio_events: { Row: EventRow; Insert: Omit<EventRow, "id" | "created_at" | "event_day"> & Partial<Pick<EventRow, "id" | "created_at" | "event_day">>; Update: Partial<EventRow>; Relationships: [] };
      contact_messages: { Row: MessageRow; Insert: Omit<MessageRow, "id" | "created_at" | "read_at"> & Partial<Pick<MessageRow, "id" | "created_at" | "read_at">>; Update: Partial<MessageRow>; Relationships: [] };
      portfolio_site_settings: { Row: SettingsRow; Insert: SettingsRow; Update: Partial<SettingsRow>; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: {
      keep_alive: { Args: Record<string, never>; Returns: Json };
      record_portfolio_event: { Args: { p_event_type: string; p_path: string; p_session_id: string }; Returns: undefined };
      submit_portfolio_message: { Args: { p_name: string; p_email: string; p_subject: string; p_message: string }; Returns: string };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
