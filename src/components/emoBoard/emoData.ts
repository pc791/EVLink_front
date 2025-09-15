export interface QnaVO {
  board_id?: number;
  title: string;
  user_id: string;
  content: string;
  hit?: number;
  reg_dt?: string;
  upd_dt?: string;
  emotion?: string;
  score?: number;
}
export interface EmotionVO {
  emo_id?: number;
  title: string;
  user_id: string;
  content: string;
  hit?: number;
  reg_dt?: string;
  upd_dt?: string;
  emotion?: string;
  score?: number;
}
export interface VO {
    count: number;
    results: [{
        pred_index: number,
        pred_label: string,
        probabilities: number[]
    }];
}

export interface EmotionProb {
  label: string;
  prob: number;
}

export interface EmoVO {
  text: string;
  label_index: number;
  label_en: string;
  probs: {
    [key: number]: EmotionProb;
  };
}