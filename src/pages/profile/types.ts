export type ProfileTimelineEvent = {
  id: string;
  timestamp: string;
  kind: "system" | "edit" | "save" | "reset" | "avatar";
  title: string;
  detail: string;
};
