export type FeedbackMarkerId = string;

export interface FeedbackMarker {
  id: FeedbackMarkerId;
  xPercent: number;
  yPercent: number;
  comment: string;
  createdAt: string;
}

export interface FeedbackState {
  markers: FeedbackMarker[];
  activeMarkerId: FeedbackMarkerId | null;
}
