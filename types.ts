export type CurrentState = {
  guiche: number;
  number: number;
};

export type QueueResponse = {
  currentStates: CurrentState[];
  queue: number[];
  finalized: string[];
};
