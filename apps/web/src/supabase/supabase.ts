export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      decisions: {
        Row: {
          event_id: string;
          trajectory_id: string;
          session_id: string;
          agent_id: string;
          action_type: string;
          tool: string | null;
          decision: string;
          reason: string | null;
          stability_score: number | null;
          created_at: string;
        };
        Insert: {
          event_id: string;
          trajectory_id: string;
          session_id: string;
          agent_id: string;
          action_type: string;
          tool?: string | null;
          decision: string;
          reason?: string | null;
          stability_score?: number | null;
          created_at: string;
        };
        Update: {
          event_id?: string;
          trajectory_id?: string;
          session_id?: string;
          agent_id?: string;
          action_type?: string;
          tool?: string | null;
          decision?: string;
          reason?: string | null;
          stability_score?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      approvals: {
        Row: {
          event_id: string;
          trajectory_id: string;
          tool: string;
          approver_id: string;
          created_at: string;
        };
        Insert: {
          event_id: string;
          trajectory_id: string;
          tool: string;
          approver_id: string;
          created_at: string;
        };
        Update: {
          event_id?: string;
          trajectory_id?: string;
          tool?: string;
          approver_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      pending_challenges: {
        Row: {
          event_id: string;
          trajectory_id: string;
          session_id: string;
          agent_id: string;
          action_type: string;
          tool: string | null;
          decision: string;
          reason: string | null;
          stability_score: number | null;
          created_at: string;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
