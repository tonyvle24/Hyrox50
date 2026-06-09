import { validateTrainingPlan } from './schemas';
import { buildTrainingPlan } from './buildPlan';

export const trainingPlan = validateTrainingPlan(buildTrainingPlan());
