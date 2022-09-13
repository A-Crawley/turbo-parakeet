import { Job } from "./classes/Job";
import { Skill } from "./classes/Skill";
import Item from "./classes/Item";

const helperJob = new Job(1, "Helper", 1, 0.01, () => true, 2);
const assistantJob = new Job(
  2,
  "Assistant",
  1 / 2,
  0.05,
  () => helperJob.getLevel() >= 2,
  2
);
const apprenticeJob = new Job(
  3,
  "Apprentice Baker",
  1 / 3,
  0.1,
  () => assistantJob.getLevel() >= 10,
  2
);
const juniorJob = new Job(
  4,
  "Junior Baker",
  1 / 4,
  0.5,
  () => apprenticeJob.getLevel() >= 10,
  2
);
const breadBakerJob = new Job(
  5,
  "Bread Baker",
  1 / 5,
  1,
  () => juniorJob.getLevel() >= 10,
  2
);
const bakerJob = new Job(
  6,
  "Baker",
  1 / 6,
  2,
  () => breadBakerJob.getLevel() >= 10,
  2
);
const headBakerJob = new Job(
  7,
  "Head Baker",
  1 / 7,
  3,
  () => bakerJob.getLevel() >= 10,
  2
);
const bakeryOwnerJob = new Job(
  8,
  "Bakery Owner",
  1 / 8,
  4,
  () => headBakerJob.getLevel() >= 10,
  2
);

export const familyBakery = [
  helperJob,
  assistantJob,
  apprenticeJob,
  juniorJob,
  breadBakerJob,
  bakerJob,
  headBakerJob,
  bakeryOwnerJob,
];

////////////////////////////////////////////////////////////////////

const consentration = new Skill(
  1,
  "Consentration",
  2,
  () => true,
  () => {
    familyBakery.forEach((job: Job) => {
      job.increaseMultiplier(0.5);
    });

    selfImprovmentSkills.forEach((skill: Skill) => {
      skill.increaseMultiplier(0.5);
    });
  }
);

export const selfImprovmentSkills = [consentration];

const bed = new Item(1, "Bed", 10, () => {
  familyBakery.forEach((job: Job) => {
    job.increaseMultiplier(0.5);
  });

  selfImprovmentSkills.forEach((skill: Skill) => {
    skill.increaseMultiplier(0.5);
  });
});

export const purchaseableItems = [bed];
