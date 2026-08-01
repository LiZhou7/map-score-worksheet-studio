"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Topic = "Weather" | "Forces in motion" | "Animals" | "American Revolution" | "Random";
type GoalStatus = "Develop" | "Reinforce" | "Introduce";
type Cluster = "Foundational" | "Core Practice" | "Extension";
type QuestionFormat = "Short answer" | "Multiple choice";
type OutputMode = "Worksheet" | "Google Form draft";
type BuildMode = "Customize" | "Default";
type DefaultTarget = "Lowest target skill" | "All target skills in lowest domain";

type Student = {
  name: string;
  grade: number;
  readingRit?: number;
  focusArea?: string;
  focusScore?: number;
  verified: boolean;
  skills: Skill[];
};

type Skill = {
  id: string;
  status: GoalStatus;
  area: string;
  category: string;
  text: string;
};

const topics: Topic[] = ["Weather", "Forces in motion", "Animals", "American Revolution", "Random"];
const statuses: GoalStatus[] = ["Develop", "Reinforce", "Introduce"];
const clusters: Cluster[] = ["Foundational", "Core Practice", "Extension"];

const rosterNames = [
  "Aldworth, Fletcher J.",
  "Belley, Sanissa",
  "Brito Neta, Talia A.",
  "Chamberlin, Vance H.",
  "Chebanenko, Marharyta",
  "Chen, Mason K.",
  "Dawoodzai, Raihana",
  "Elazar Betker, Zohar",
  "Fujiwara, Kotaro",
  "Garzon Salcedo, Jose J.",
  "Glick, Libby",
  "Hawks, Peter K.",
  "Husain, Kamil Mumtaz",
  "Kramer, Inbar",
  "Lau, Elyse",
  "Majawa, Zikomo Mercy",
  "Marquardt, Emma G.",
  "Meyers, Claire E.",
  "Mkrtchyan, Erik K.",
  "Page, Eva M.",
  "Patil, Mihika H.",
  "Prabowo, Daviandra K.",
  "Stapleton, Bridget E.",
  "Stillwell, Samuel B.",
  "Suriaputri, Kenes K.",
  "Susanto, Muhammad A.",
  "Tiwari, Ramya",
  "Tzafir, Shilo",
  "Wali, Hosna",
];

const commonReadingSkills: Skill[] = [
  { id: "context", status: "Develop", area: "Vocabulary", category: "Unknown and Multiple-Meaning Words", text: "Uses context to determine the meaning of words in the 2-5 grade band" },
  { id: "academic-vocab", status: "Develop", area: "Vocabulary", category: "Academic and Content Vocabulary", text: "Determines the meaning of academic words or phrases in context" },
  { id: "central-idea", status: "Develop", area: "Informational Text", category: "Main or Central Idea, Topic", text: "Determines main/central idea in informational text" },
  { id: "support-main", status: "Develop", area: "Informational Text", category: "Supporting Details", text: "Determines details that support main/central idea in informational text" },
  { id: "infer-info", status: "Develop", area: "Informational Text", category: "Inferences, Conclusions", text: "Makes inferences from informational text" },
  { id: "cause-effect", status: "Develop", area: "Informational Text", category: "Cause and Effect", text: "Determines the cause or effect of a situation or event in informational text" },
  { id: "summarize-info", status: "Develop", area: "Informational Text", category: "Summarizing, Paraphrasing", text: "Summarizes informational text" },
  { id: "narrator-view", status: "Develop", area: "Literary Text", category: "Point of View", text: "Understands how a character's point of view affects the story" },
  { id: "character-plot", status: "Develop", area: "Literary Text", category: "Characterization", text: "Analyzes how characters' traits, feelings, or actions contribute to plot" },
  { id: "theme", status: "Develop", area: "Literary Text", category: "Theme, Moral, Central Idea", text: "Determines theme in literary text" },
  { id: "setting-mood", status: "Develop", area: "Literary Text", category: "Setting", text: "Analyzes how setting affects mood" },
  { id: "plot-resolution", status: "Develop", area: "Literary Text", category: "Plot", text: "Identifies events that lead to resolution of problem/conflict" },
];

const verified: Record<string, Partial<Student>> = {
  "Aldworth, Fletcher J.": {
    name: "Fletcher J. Aldworth",
    readingRit: 221,
    focusArea: "Vocabulary",
    focusScore: 215,
    verified: true,
    skills: commonReadingSkills,
  },
  "Elazar Betker, Zohar": {
    name: "Zohar Elazar Betker",
    readingRit: 214,
    focusArea: "Literary Text",
    focusScore: 210,
    verified: true,
    skills: commonReadingSkills.filter((s) => s.area === "Literary Text"),
  },
};

const students: Student[] = rosterNames.map((rosterName) => {
  const known = verified[rosterName];
  return {
    name: known?.name ?? rosterName,
    grade: 4,
    readingRit: known?.readingRit,
    focusArea: known?.focusArea,
    focusScore: known?.focusScore,
    verified: known?.verified ?? false,
    skills: known?.skills ?? commonReadingSkills,
  };
});

const passages: Record<Exclude<Topic, "Random">, Record<Cluster, { title: string; body: string[] }>> = {
  Weather: {
    Foundational: {
      title: "The Rain Garden Plan",
      body: [
        "Maya's class wanted to stop puddles from covering the sidewalk after storms. The principal gave them one sunny afternoon to study the problem.",
        "Maya noticed that water rushed from the roof and spread across the path. Leo thought they should build a tall wall, but Maya wondered where the water would go after it hit the wall.",
        "Their teacher showed them a rain garden near the library. It had deep soil, smooth stones, and plants with strong roots. The garden did not block the water. It slowed the water and gave it a place to sink.",
        "The class drew a plan with arrows, labels, and a short explanation. When Maya presented, she said, \"A good solution works with the water, not against it.\"",
      ],
    },
    "Core Practice": {
      title: "The Rain Garden Debate",
      body: [
        "After three spring storms flooded the sidewalk, Maya's class investigated why water kept collecting near the library doors. They measured the slope of the path, sketched the roofline, and noticed that rainwater rushed from one drain before spreading across the concrete.",
        "Leo suggested a low brick wall, but Maya questioned whether blocking the water would simply move the puddle somewhere else. Their teacher asked the group to compare two solutions: a barrier that redirected water and a rain garden that absorbed it.",
        "At the town park, students observed a shallow garden filled with native plants, smooth stones, and loose soil. During a storm, the garden slowed the runoff and allowed much of it to sink underground instead of racing toward the street.",
        "Maya revised the class plan to include arrows showing cause and effect. She concluded that the strongest design did not fight the rain; it used the rain's path to protect the sidewalk.",
      ],
    },
    Extension: {
      title: "The Rain Garden Proposal",
      body: [
        "When repeated storms left a wide sheet of water across the library sidewalk, Maya's class treated the puddle like a real engineering problem. They measured the pavement, traced the roof drain, and discovered that runoff from one corner of the building gathered speed before spreading across the entrance.",
        "Several students favored a short brick wall because it seemed like the quickest solution. Maya disagreed. If the wall only redirected the water, she argued, it might protect one doorway while creating a new problem near the wheelchair ramp. Her question shifted the discussion from stopping water to managing where it traveled.",
        "The class visited a rain garden at the town park and recorded how its design worked. Native plants held the soil in place, gravel slowed the runoff, and a shallow basin gave the water time to soak underground. The garden did not erase the storm; it reduced the storm's impact by changing the water's speed and direction.",
        "In the final proposal, Maya included a labeled diagram and a paragraph explaining the trade-off. A brick wall might look simpler, but the rain garden solved the cause of the puddle more directly. By the end of the project, Maya understood that careful evidence can turn an ordinary complaint into a stronger solution.",
      ],
    },
  },
  "Forces in motion": {
    Foundational: {
      title: "The Ramp Test",
      body: [
        "Nadia and Ben built a small cart in science. Their challenge was to make it roll down a ramp and stop before a strip of blue tape.",
        "At first, Ben made the ramp steep. The cart flew forward and bumped a box. Nadia wrote that a stronger push from gravity made the cart harder to stop.",
        "Next, they lowered the ramp and placed felt near the tape. The cart slowed as it crossed the felt and stopped just in time.",
        "Nadia smiled because the test showed two ideas at once: force can start motion, and friction can change motion.",
      ],
    },
    "Core Practice": {
      title: "The Ramp Test Revision",
      body: [
        "Nadia and Ben designed a cart test with one clear goal: the cart had to roll down a ramp and stop before crossing a strip of blue tape. Their first trial failed because the steep ramp gave the cart too much speed.",
        "Instead of guessing, Nadia changed one variable at a time. She lowered the ramp, while Ben kept the cart, starting point, and tape in the same places. The cart moved more slowly, but it still rolled past the target.",
        "For the third trial, they added a strip of felt near the tape. The rougher surface created friction, and the cart stopped just before the line.",
        "Their notes showed a pattern. Gravity pulled the cart down the ramp, but friction opposed the motion and helped control where the cart stopped.",
      ],
    },
    Extension: {
      title: "The Ramp Test Revision",
      body: [
        "Nadia and Ben's first ramp design looked successful for less than a second. The cart shot down the steep board, crossed the blue stopping line, and struck a cardboard box at the edge of the table. Ben laughed, but Nadia wrote the result in their data table: high ramp, high speed, poor control.",
        "Their teacher reminded them that a fair test changes one variable at a time. On the next trial, Nadia lowered the ramp while Ben kept the cart, starting point, and stopping line unchanged. The adjustment reduced the cart's speed, yet it still rolled too far.",
        "For the final trial, they added felt near the stopping line. The rough surface increased friction, which opposed the cart's motion and changed the outcome without changing the ramp height. This time the cart stopped with its front wheels just before the tape.",
        "Nadia's conclusion connected the evidence to the science concept. A force can start or speed up motion, but another force can slow that motion. Their best design did not depend on luck; it balanced gravity and friction.",
      ],
    },
  },
  Animals: {
    Foundational: {
      title: "The Quiet Corner",
      body: [
        "Amara helped at the animal shelter every Saturday. Most visitors hurried to the playful puppies, but Amara watched an older cat named Pickle.",
        "Pickle did not jump or meow loudly. He blinked slowly and waited. Some people passed him by because they wanted a pet that seemed exciting.",
        "A nervous boy named Ellis stepped away whenever a dog barked. Amara led him to Pickle's blanket and told him to hold out one calm hand.",
        "Pickle rested his chin on Ellis's wrist. Amara learned that quiet attention can help others find exactly what they need.",
      ],
    },
    "Core Practice": {
      title: "The Quiet Corner",
      body: [
        "Every Saturday, Amara helped visitors at the animal shelter. Most families hurried toward the puppy room, where tails thumped against the walls and water bowls slid across the floor.",
        "Amara often watched an older cat named Pickle. He did not perform for attention. Instead, he blinked slowly from a folded blanket, as if waiting for the right person to notice him.",
        "When a nervous boy named Ellis flinched at every bark, Amara understood that the puppy room was not the best place to begin. She led him to Pickle's corner and told him to offer one calm hand.",
        "Pickle rested his chin on Ellis's wrist. By paying attention to both the animal and the visitor, Amara helped Ellis discover a pet whose quiet nature matched his own.",
      ],
    },
    Extension: {
      title: "The Quiet Corner",
      body: [
        "On Saturday mornings, the animal shelter sounded like a hallway before a school assembly: excited, crowded, and slightly out of control. Most visitors rushed toward the puppy room, where paws scraped the floor and metal bowls clattered against the walls.",
        "Amara liked the energy, but she had learned that excitement did not help every visitor choose well. In the far corner, an older cat named Pickle watched without demanding attention. He blinked slowly from his blanket while younger animals competed to be noticed.",
        "Ellis arrived with his grandmother and stopped moving whenever a dog barked. His shoulders tightened, and he stepped behind the front desk. Instead of pushing him toward the most popular pets, Amara asked what kind of animal made him feel safe.",
        "She guided Ellis to Pickle and told him to hold out one calm hand. Pickle leaned forward and rested his chin on Ellis's wrist. Amara realized that careful attention can reveal what a person needs, even when everyone else is distracted by what seems exciting.",
      ],
    },
  },
  "American Revolution": {
    Foundational: {
      title: "The Message Under the Loaf",
      body: [
        "In 1776, Ruth helped her father in their bakery before sunrise. Outside, people whispered about soldiers, taxes, and independence.",
        "Father hid a folded note under a loaf of rye bread. A rider would ask for the loaf and carry the message to the next town.",
        "When soldiers entered the bakery, Ruth swept flour across the floor to keep their eyes away from the window. Her hands shook, but she kept sweeping.",
        "After the soldiers left, the rider took the loaf. Ruth had not carried a musket, but she understood that courage could be quiet and still matter.",
      ],
    },
    "Core Practice": {
      title: "The Message Under the Loaf",
      body: [
        "Before sunrise in 1776, Ruth helped her father shape loaves of bread while neighbors whispered about taxes, soldiers, and independence. The bakery looked ordinary, but it sometimes carried more than food.",
        "Father slid a folded message under a loaf of rye. A rider would ask for that exact loaf and carry the note to leaders in the next town.",
        "When soldiers entered the bakery, Ruth noticed one of them glancing toward the cooling rack. She swept flour across the floor and asked loudly whether the men wanted fresh rolls, giving the rider time to arrive at the side window.",
        "The plan worked because Ruth stayed calm under pressure. She did not fight in a battle, yet her quick thinking helped protect a message that mattered.",
      ],
    },
    Extension: {
      title: "The Message Under the Loaf",
      body: [
        "Before sunrise in 1776, Ruth's father's bakery looked like any other shop: flour on the table, smoke in the chimney, and rows of bread cooling beside the window. Yet the bakery had become part of a quiet network that carried news between towns arguing over independence.",
        "That morning, Father folded a message so tightly it looked like a scrap of wrapper and hid it beneath a loaf of rye. A rider would request that exact loaf, then deliver the note before British soldiers searched the road.",
        "When two soldiers entered unexpectedly, Ruth noticed one studying the cooling rack. Her fear rose quickly, but she forced herself to act ordinary. She swept flour across the floor, asked whether the men wanted rolls, and shifted their attention away from the window where the rider waited.",
        "After the soldiers left, the rider carried the loaf into the gray morning. Ruth had not signed a declaration or carried a musket, but she understood that independence depended on many forms of courage, including the kind that stayed quiet.",
      ],
    },
  },
};

function displayTopic(topic: Topic) {
  if (topic !== "Random") return topic;
  return topics[new Date().getDate() % 4] as Exclude<Topic, "Random">;
}

function clusterFor(student: Student): Cluster {
  if (!student.readingRit) return "Core Practice";
  if (student.readingRit < 205) return "Foundational";
  if (student.readingRit < 215) return "Core Practice";
  return "Extension";
}

function clusterDescription(cluster: Cluster) {
  if (cluster === "Foundational") return "Build confidence with vocabulary, central idea, and direct text evidence.";
  if (cluster === "Core Practice") return "Practice grade-level comprehension with inference, evidence, and summary.";
  return "Extend thinking with author's craft, theme, point of view, and multi-step evidence.";
}

function questionsFor(skills: Skill[], cluster: Cluster, format: QuestionFormat, topic: Exclude<Topic, "Random">) {
  const questionCount = 8;
  const chosen = skills.length
    ? Array.from({ length: questionCount }, (_, index) => skills[index % skills.length])
    : [];
  return chosen.map((skill, index) => ({
    skill,
    prompt: format === "Multiple choice" ? multipleChoiceForSkill(skill, index, topic) : promptForSkill(skill, index, topic),
  }));
}

function promptForSkill(skill: Skill, index: number, topic: Exclude<Topic, "Random">) {
  const words = vocabularyTargets(topic);
  if (skill.area === "Vocabulary") {
    if (skill.id === "context") {
      return `What does the word "${words[0]}" mean in the passage? Write one context clue that helped you.`;
    }
    if (skill.id === "academic-vocab") {
      return `What does "${words[4]}" mean in the last paragraph? Explain how the sentence helps you understand it.`;
    }
    return `Explain the meaning of "${words[index % words.length]}" using context from the passage.`;
  }
  if (skill.category.includes("Main or Central")) return "What is the central idea of the passage? Use one detail as support.";
  if (skill.category.includes("Supporting")) return "Which two details support the central idea? Write both pieces of evidence.";
  if (skill.category.includes("Inferences")) return "Make one inference from the passage. What text evidence supports it?";
  if (skill.category.includes("Cause")) return "What caused an important event in the passage, and what was the effect?";
  if (skill.category.includes("Summarizing")) return "Summarize the passage in 2-3 sentences without adding extra opinions.";
  if (skill.category.includes("Theme")) return "What lesson or theme does the passage suggest? Use evidence.";
  if (skill.category.includes("Plot")) return "What problem is solved, and which event helps solve it?";
  if (skill.category.includes("Setting")) return "How does the setting affect the events or mood?";
  return index === 0
    ? "Answer using a complete sentence and evidence from the passage."
    : "Use text evidence to answer this question.";
}

function vocabularyTargets(topic: Exclude<Topic, "Random">) {
  if (topic === "Weather") return ["solution", "study", "rushed", "explanation", "presented"];
  if (topic === "Forces in motion") return ["challenge", "steep", "gravity", "friction", "motion"];
  if (topic === "Animals") return ["shelter", "visitors", "nervous", "calm", "attention"];
  return ["independence", "message", "entered", "courage", "matter"];
}

function multipleChoiceForSkill(skill: Skill, index: number, topic: Exclude<Topic, "Random">) {
  const vocab = {
    Weather: {
      solution: ["a way to fix a problem", "a kind of storm", "a place to play", "a tall wall"],
      rushed: ["moved quickly", "sat quietly", "dried slowly", "grew roots"],
      explanation: ["a statement that makes an idea clear", "a stone path", "a kind of plant", "a puddle"],
    },
    "Forces in motion": {
      challenge: ["a task that takes effort", "a wheel on a cart", "a strip of tape", "a soft material"],
      steep: ["rising sharply", "perfectly flat", "made of felt", "very quiet"],
      friction: ["a force that slows motion", "a kind of ramp", "a fast push", "a blue line"],
    },
    Animals: {
      shelter: ["a place that cares for animals", "a loud sound", "a kind of blanket", "a playful puppy"],
      nervous: ["worried or uneasy", "very hungry", "loud and playful", "sleepy"],
      attention: ["careful notice or focus", "a pet's blanket", "a visitor's ticket", "a loud bark"],
    },
    "American Revolution": {
      independence: ["freedom to govern yourself", "a bakery tool", "a kind of bread", "a soldier's coat"],
      message: ["information sent to someone", "a sweep of flour", "a bakery window", "a coin"],
      courage: ["bravery when something is difficult", "a loaf of rye", "a quiet room", "a wagon wheel"],
    },
  } as const;
  const topicWords = vocab[topic];
  if (skill.area === "Vocabulary") {
    const entries = Object.entries(topicWords);
    const [word, choices] = entries[index % entries.length];
    return `In the passage, what does "${word}" mean?\nA. ${choices[0]}\nB. ${choices[1]}\nC. ${choices[2]}\nD. ${choices[3]}`;
  }
  if (skill.category.includes("Main or Central")) {
    return centralIdeaQuestion(topic);
  }
  if (skill.category.includes("Supporting")) {
    return evidenceQuestion(topic);
  }
  if (skill.category.includes("Cause")) {
    return causeEffectQuestion(topic);
  }
  if (skill.category.includes("Theme")) {
    return themeQuestion(topic);
  }
  return index === 0
    ? evidenceQuestion(topic)
    : centralIdeaQuestion(topic);
}

function centralIdeaQuestion(topic: Exclude<Topic, "Random">) {
  if (topic === "Animals") return "What is the passage mostly about?\nA. Amara helps Ellis find a calm pet by noticing what he needs.\nB. Pickle wants to play with the puppies.\nC. Ellis teaches Amara how to run an animal shelter.\nD. Visitors should always choose puppies first.";
  if (topic === "Weather") return "What is the passage mostly about?\nA. A class studies puddles and plans a rain garden solution.\nB. Maya tries to stop all storms from happening.\nC. The principal closes the sidewalk forever.\nD. Leo builds a wall around the school.";
  if (topic === "Forces in motion") return "What is the passage mostly about?\nA. Students test how ramp height and friction affect a cart.\nB. Nadia and Ben paint a cart blue.\nC. The cart breaks before the test begins.\nD. Friction makes objects move faster.";
  return "What is the passage mostly about?\nA. Ruth quietly helps protect an important message.\nB. Soldiers learn to bake bread.\nC. Father closes the bakery.\nD. The rider loses the rye loaf.";
}

function evidenceQuestion(topic: Exclude<Topic, "Random">) {
  if (topic === "Animals") return "Which detail best shows that Ellis feels nervous?\nA. He stepped away whenever a dog barked.\nB. He hurried toward the puppies.\nC. He worked at the shelter every Saturday.\nD. He named the old cat Pickle.";
  if (topic === "Weather") return "Which detail best supports the idea that the rain garden helps with water?\nA. It slowed the water and gave it a place to sink.\nB. The principal gave one sunny afternoon.\nC. Leo wanted to build a tall wall.\nD. The class drew arrows.";
  if (topic === "Forces in motion") return "Which detail best shows that friction changed the cart's motion?\nA. The cart slowed as it crossed the felt.\nB. Ben made the ramp steep.\nC. The cart had bottle caps.\nD. Nadia wrote notes.";
  return "Which detail best shows Ruth is trying to protect the message?\nA. She swept flour to keep the soldiers' eyes away from the window.\nB. She helped before sunrise.\nC. People whispered outside.\nD. The soldier took a roll.";
}

function causeEffectQuestion(topic: Exclude<Topic, "Random">) {
  if (topic === "Animals") return "Why does Amara lead Ellis to Pickle?\nA. Ellis seems nervous around barking dogs.\nB. Pickle is the loudest animal.\nC. Ellis asks for a puppy first.\nD. The shelter is closing.";
  if (topic === "Weather") return "Why does the class consider a rain garden?\nA. Water rushes from the roof and covers the path.\nB. The library needs more books.\nC. The principal dislikes plants.\nD. Leo already built a wall.";
  if (topic === "Forces in motion") return "What causes the cart to stop before the tape?\nA. The felt creates friction that slows it down.\nB. The ramp gets steeper.\nC. Ben pushes it harder.\nD. The box blocks the tape.";
  return "Why does Ruth sweep flour across the floor?\nA. To distract the soldiers from the hidden message.\nB. To bake another loaf.\nC. To clean up after the rider leaves.\nD. To show the soldiers where the note is.";
}

function themeQuestion(topic: Exclude<Topic, "Random">) {
  if (topic === "Animals") return "Which lesson best fits the passage?\nA. Paying careful attention can help people and animals.\nB. Loud animals are always better pets.\nC. Shelters should not have cats.\nD. Visitors should make quick choices.";
  if (topic === "American Revolution") return "Which lesson best fits the passage?\nA. Courage can be quiet and still important.\nB. Baking is more important than freedom.\nC. Soldiers always help messengers.\nD. Messages should be easy to find.";
  return "Which lesson best fits the passage?\nA. Careful thinking helps solve problems.\nB. The fastest idea is always best.\nC. Good plans never need evidence.\nD. Problems solve themselves.";
}

export default function Home() {
  const [view, setView] = useState<"student" | "class">("student");
  const [query, setQuery] = useState("");
  const [studentName, setStudentName] = useState(students[0].name);
  const [topic, setTopic] = useState<Topic>("Weather");
  const [status, setStatus] = useState<GoalStatus>("Develop");
  const [cluster, setCluster] = useState<Cluster>("Core Practice");
  const [questionFormat, setQuestionFormat] = useState<QuestionFormat>("Short answer");
  const [outputMode, setOutputMode] = useState<OutputMode>("Worksheet");
  const [buildMode, setBuildMode] = useState<BuildMode>("Customize");
  const [defaultQuestionFormat, setDefaultQuestionFormat] = useState<QuestionFormat>("Multiple choice");
  const [defaultOutputMode, setDefaultOutputMode] = useState<OutputMode>("Worksheet");
  const [defaultTopic, setDefaultTopic] = useState<Topic>("Random");
  const [defaultTarget, setDefaultTarget] = useState<DefaultTarget>("All target skills in lowest domain");
  const [defaultsSaved, setDefaultsSaved] = useState(false);
  const [createdFormUrl, setCreatedFormUrl] = useState("");
  const [isPreparingForm, setIsPreparingForm] = useState(false);
  const [formCreationError, setFormCreationError] = useState("");
  const formCacheRef = useRef(new Map<string, string>());
  const formRequestRef = useRef<{ key: string; promise: Promise<string> } | null>(null);
  const activeFormKeyRef = useRef("");
  const [selectedArea, setSelectedArea] = useState<string>("Mixed");
  const [createdCount, setCreatedCount] = useState(0);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(
    commonReadingSkills.slice(0, 4).map((skill) => skill.id),
  );

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("map-worksheet-defaults");
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<{ questionFormat: QuestionFormat; outputMode: OutputMode; topic: Topic; target: DefaultTarget }>;
        if (parsed.questionFormat) setDefaultQuestionFormat(parsed.questionFormat);
        if (parsed.outputMode) setDefaultOutputMode(parsed.outputMode);
        if (parsed.topic) setDefaultTopic(parsed.topic);
        if (parsed.target) setDefaultTarget(parsed.target);
        setDefaultsSaved(true);
      }
      const savedFormCache = window.localStorage.getItem("map-google-form-cache");
      if (savedFormCache) {
        const entries = Object.entries(JSON.parse(savedFormCache) as Record<string, string>);
        formCacheRef.current = new Map(entries);
      }
    } catch {
      // Keep the built-in defaults if saved preferences are unavailable.
    }
  }, []);

  const selectedStudent = students.find((student) => student.name === studentName) ?? students[0];
  const visibleStudents = students.filter((student) => student.name.toLowerCase().includes(query.toLowerCase()));
  const classStudents = students.filter((student) => clusterFor(student) === cluster);
  const selectedTopic = displayTopic(topic);
  const activeCluster = view === "student" ? clusterFor(selectedStudent) : cluster;
  const passage = passages[selectedTopic][activeCluster];
  const vocabWords = vocabularyTargets(selectedTopic);
  const availableStudentSkills = selectedStudent.skills.filter((skill) => skill.status === status);
  const classSkills = commonReadingSkills.filter((skill) => skill.status === status);
  const availableSkills = view === "student" ? availableStudentSkills : classSkills;
  const worksheetSkills = availableSkills.filter((skill) => selectedSkillIds.includes(skill.id));
  const worksheetQuestions = questionsFor(worksheetSkills, activeCluster, questionFormat, selectedTopic);
  const formPayloadJson = JSON.stringify({
    title: view === "student" ? `${selectedStudent.name} - Reading Quiz` : `${cluster} Reading Quiz`,
    passage,
    questions: worksheetQuestions,
    questionFormat,
  });
  const formRequestKey = formPayloadJson;
  activeFormKeyRef.current = formRequestKey;
  const formDraftText = [
    `Title: ${view === "student" ? `${selectedStudent.name} - Reading Practice` : `${cluster} Reading Practice`}`,
    "Question 1: Student name (Short answer, required)",
    "",
    `Section: Reading Passage - ${passage.title}`,
    ...passage.body,
    "",
    "Section: Questions",
    ...worksheetQuestions.map((item, index) => `${index + 2}. ${item.prompt}\nQuestion type: ${questionFormat === "Multiple choice" ? "Multiple choice" : "Paragraph"}\nSkill: ${item.skill.text}`),
    `${worksheetQuestions.length + 2}. What is one skill you practiced today, and what evidence did you use?\nQuestion type: Paragraph`,
  ].join("\n\n");
  const verifiedCount = students.filter((student) => student.verified).length;
  const pendingCount = students.length - verifiedCount;
  const groupedSkills = useMemo(() => {
    return availableSkills.reduce<Record<string, Skill[]>>((groups, skill) => {
      const key = `${skill.area} - ${skill.category}`;
      groups[key] = groups[key] ?? [];
      groups[key].push(skill);
      return groups;
    }, {});
  }, [availableSkills]);

  const requestGoogleForm = useCallback(async (key: string, payloadJson: string) => {
    const cachedUrl = formCacheRef.current.get(key);
    if (cachedUrl) return cachedUrl;
    if (formRequestRef.current?.key === key) return formRequestRef.current.promise;

    setIsPreparingForm(true);
    setFormCreationError("");
    const promise = fetch("/api/create-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payloadJson,
    }).then(async (response) => {
      const result = await response.json() as { editUrl?: string; error?: string };
      if (!response.ok || !result.editUrl) throw new Error(result.error || "Google Form creation failed.");
      return result.editUrl;
    });
    formRequestRef.current = { key, promise };

    try {
      const url = await promise;
      formCacheRef.current.set(key, url);
      const recentEntries = Array.from(formCacheRef.current.entries()).slice(-20);
      window.localStorage.setItem("map-google-form-cache", JSON.stringify(Object.fromEntries(recentEntries)));
      return url;
    } catch (error) {
      setFormCreationError(error instanceof Error ? error.message : "Google Form creation failed.");
      throw error;
    } finally {
      if (formRequestRef.current?.key === key) formRequestRef.current = null;
      setIsPreparingForm(false);
    }
  }, []);

  useEffect(() => {
    if (outputMode !== "Google Form draft" || worksheetQuestions.length === 0) return;
    const cachedUrl = formCacheRef.current.get(formRequestKey);
    if (cachedUrl) {
      setCreatedFormUrl(cachedUrl);
      return;
    }
    setCreatedFormUrl("");
    const timer = window.setTimeout(() => {
      void requestGoogleForm(formRequestKey, formPayloadJson).then((url) => {
        if (activeFormKeyRef.current === formRequestKey) setCreatedFormUrl(url);
      }).catch(() => undefined);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [formPayloadJson, formRequestKey, outputMode, requestGoogleForm, worksheetQuestions.length]);

  function toggleSkill(skillId: string) {
    setSelectedSkillIds((current) =>
      current.includes(skillId)
        ? current.filter((id) => id !== skillId)
        : [...current, skillId],
    );
    setSelectedArea("Custom");
  }

  function selectArea(area: string) {
    setSelectedSkillIds(availableSkills.filter((skill) => skill.area === area).map((skill) => skill.id));
    setSelectedArea(area);
  }

  async function giveMeWorksheet() {
    if (worksheetSkills.length === 0) {
      const pool = availableSkills.length ? availableSkills : commonReadingSkills;
      const byArea = pool.reduce<Record<string, Skill[]>>((groups, skill) => {
        groups[skill.area] = groups[skill.area] ?? [];
        groups[skill.area].push(skill);
        return groups;
      }, {});
      const preferredArea =
        selectedStudent.focusArea && byArea[selectedStudent.focusArea]
          ? selectedStudent.focusArea
          : Object.entries(byArea).sort((a, b) => b[1].length - a[1].length)[0]?.[0];
      const coherentSet = (preferredArea ? byArea[preferredArea] : pool).slice(0, 5);
      setSelectedSkillIds(coherentSet.map((skill) => skill.id));
      setSelectedArea(preferredArea ?? "Mixed");
    }
    setCreatedCount((current) => current + 1);
    window.setTimeout(() => {
      document.querySelector(".worksheet")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
    if (outputMode === "Google Form draft") {
      const url = await requestGoogleForm(formRequestKey, formPayloadJson);
      setCreatedFormUrl(url);
    }
  }

  function useDefaultSettings() {
    setQuestionFormat(defaultQuestionFormat);
    setOutputMode(defaultOutputMode);
    setTopic(defaultTopic);
    const focus = selectedStudent.focusArea;
    const pool = availableSkills.length ? availableSkills : commonReadingSkills;
    const targetSkills = focus ? pool.filter((skill) => skill.area === focus) : pool;
    const selectedTargets = defaultTarget === "Lowest target skill"
      ? (targetSkills.length ? targetSkills : pool).slice(0, 1)
      : (targetSkills.length ? targetSkills : pool);
    setSelectedSkillIds(selectedTargets.map((skill) => skill.id));
    setSelectedArea(focus ?? "All");
    setCreatedCount((current) => current + 1);
    window.setTimeout(() => document.querySelector(".worksheet")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  function saveDefaults() {
    window.localStorage.setItem("map-worksheet-defaults", JSON.stringify({
      questionFormat,
      outputMode,
      topic,
      target: defaultTarget,
    }));
    setDefaultQuestionFormat(questionFormat);
    setDefaultOutputMode(outputMode);
    setDefaultTopic(topic);
    setDefaultTarget(defaultTarget);
    setDefaultsSaved(true);
  }

  function copyFormDraft() {
    navigator.clipboard?.writeText(formDraftText);
  }

  function printCurrentWorksheet() {
    window.print();
  }

  return (
    <main className="min-h-screen bg-[#f4f6f2] text-[#202724]">
      <header className="no-print border-b border-[#dbe2dc] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-[#2a6858]">2024-2025 Reading Worksheet Studio</p>
            <h1 className="text-2xl font-semibold">Class worksheets from MAP Student Profiles</h1>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-5 lg:grid-cols-[380px_1fr]">
        <aside className="no-print grid content-start gap-4">
          <section className="rounded-lg border border-[#dbe2dc] bg-white p-4">
            <div className="grid grid-cols-2 gap-2">
              <button className={`h-10 rounded-md border text-sm font-semibold ${view === "student" ? "border-[#2a6858] bg-[#2a6858] text-white" : "border-[#cbd5ce]"}`} onClick={() => setView("student")}>Student page</button>
              <button className={`h-10 rounded-md border text-sm font-semibold ${view === "class" ? "border-[#2a6858] bg-[#2a6858] text-white" : "border-[#cbd5ce]"}`} onClick={() => setView("class")}>Class reading page</button>
            </div>
          </section>

          <section className="rounded-lg border border-[#dbe2dc] bg-white p-4">
            <h2 className="text-sm font-semibold text-[#2a6858]">Find a student</h2>
            <input className="mt-3 h-11 w-full rounded-md border border-[#cbd5ce] px-3" placeholder="Search by name" value={query} onChange={(event) => setQuery(event.target.value)} />
            <select className="mt-3 h-11 w-full rounded-md border border-[#cbd5ce] px-3" value={studentName} onChange={(event) => setStudentName(event.target.value)}>
              {visibleStudents.map((student) => (
                <option key={student.name}>{student.name}</option>
              ))}
            </select>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-[#eef5f2] px-2.5 py-1 font-semibold text-[#2a6858]">{students.length} students</span>
              <span className="rounded-full bg-[#eef5f2] px-2.5 py-1 font-semibold text-[#2a6858]">{verifiedCount} verified</span>
              <span className="rounded-full bg-[#e6f1ec] px-2.5 py-1 font-semibold text-[#2f6655]">{pendingCount} need profiles</span>
            </div>
            {view === "student" && !selectedStudent.verified && (
              <p className="mt-2 text-xs leading-5 text-[#62706a]">
                Using the class template until this student's MAP profile is added.
              </p>
            )}
          </section>

          <section className="rounded-lg border border-[#dbe2dc] bg-white p-4">
            <h2 className="text-sm font-semibold text-[#2a6858]">What would you like?</h2>
            <div className="mt-3 grid grid-cols-[1fr_1fr_auto] gap-2 rounded-md bg-[#f4f7f4] p-1">
              {(["Customize", "Default"] as BuildMode[]).map((mode) => (
                <button
                  className={`h-10 rounded-md text-sm font-semibold ${buildMode === mode ? "bg-[#2a6858] text-white" : "text-[#2a6858]"}`}
                  key={mode}
                  onClick={() => mode === "Default" ? (setBuildMode(mode), useDefaultSettings()) : setBuildMode(mode)}
                  type="button"
                >
                  {mode}
                </button>
              ))}
              <button className={`h-10 rounded-md border px-3 text-xs font-semibold ${defaultsSaved ? "border-[#2a6858] bg-[#2a6858] text-white" : "border-[#2a6858] bg-white text-[#2a6858]"}`} onClick={saveDefaults} type="button">
                {defaultsSaved ? "Default saved" : "Set current choices as default"}
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#62706a]">
              {buildMode === "Default" ? "Uses the saved setup and all available target skills in the student's reported focus area." : "Choose the topic, question type, and target skills below."}
            </p>
            {buildMode === "Customize" && (
              <>
            <label className="mt-3 grid gap-2 text-sm font-semibold">
              Passage topic
              <select className="h-11 rounded-md border border-[#cbd5ce] px-3" value={topic} onChange={(event) => setTopic(event.target.value as Topic)}>
                {topics.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="mt-3 grid gap-2 text-sm font-semibold">
              Learning statements
              <select className="h-11 rounded-md border border-[#cbd5ce] px-3" value={status} onChange={(event) => setStatus(event.target.value as GoalStatus)}>
                {statuses.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="mt-3 grid gap-2 text-sm font-semibold">
              Output type
              <select className="h-11 rounded-md border border-[#cbd5ce] px-3" value={outputMode} onChange={(event) => setOutputMode(event.target.value as OutputMode)}>
                <option>Worksheet</option>
                <option>Google Form draft</option>
              </select>
            </label>
            <label className="mt-3 grid gap-2 text-sm font-semibold">
              Question format
              <select className="h-11 rounded-md border border-[#cbd5ce] px-3" value={questionFormat} onChange={(event) => setQuestionFormat(event.target.value as QuestionFormat)}>
                <option>Short answer</option>
                <option>Multiple choice</option>
              </select>
            </label>
            {view === "class" && (
              <label className="mt-3 grid gap-2 text-sm font-semibold">
                Reading group
                <select className="h-11 rounded-md border border-[#cbd5ce] px-3" value={cluster} onChange={(event) => setCluster(event.target.value as Cluster)}>
                  {clusters.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            )}
            <label className="mt-3 grid gap-2 text-sm font-semibold">
              Default target skills
              <select className="h-11 rounded-md border border-[#cbd5ce] px-3" value={defaultTarget} onChange={(event) => setDefaultTarget(event.target.value as DefaultTarget)}>
                <option>All target skills in lowest domain</option>
                <option>Lowest target skill</option>
              </select>
              <span className="text-xs font-normal leading-5 text-[#62706a]">The profile reports domain focus, not individual skill scores. The single-skill option uses one available target skill when skill-level scores are not present.</span>
            </label>
              </>
            )}
          </section>

          <section className="rounded-lg border border-[#dbe2dc] bg-white p-4">
            {buildMode === "Customize" && <>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-[#2a6858]">Choose target skills</h2>
              <div className="flex gap-3 text-sm font-semibold text-[#2a6858]">
                <button type="button" onClick={() => {
                  setSelectedSkillIds(availableSkills.map((skill) => skill.id));
                  setSelectedArea("All");
                }}>
                  All
                </button>
                <button type="button" onClick={() => {
                  setSelectedSkillIds([]);
                  setSelectedArea("None");
                }}>
                  None
                </button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {["Vocabulary", "Informational Text", "Literary Text"].map((area) => (
                <button
                  className={`min-h-10 rounded-md border px-2 py-2 text-xs font-semibold ${
                    selectedArea === area
                      ? "border-[#2a6858] bg-[#2a6858] text-white"
                      : "border-[#cbd5ce] text-[#2a6858]"
                  }`}
                  key={area}
                  onClick={() => selectArea(area)}
                  type="button"
                >
                  All {area.replace(" Text", "")}
                </button>
              ))}
            </div>
            </>}
            <div className="action-bar no-print">
              <button
                className="h-11 w-full rounded-md bg-[#2a6858] px-3 text-sm font-semibold text-white disabled:cursor-wait disabled:bg-[#8aa89f]"
                disabled={outputMode === "Google Form draft" && isPreparingForm && !createdFormUrl}
                onClick={giveMeWorksheet}
                type="button"
              >
                {outputMode === "Google Form draft" && isPreparingForm && !createdFormUrl ? "Preparing Google Form..." : "Create it"}
              </button>
              <button
                className="h-11 w-full rounded-md border border-[#2a6858] bg-white px-3 text-sm font-semibold text-[#2a6858]"
                onClick={printCurrentWorksheet}
                type="button"
              >
                Print it
              </button>
            </div>
            <div className="mt-3 grid max-h-[42vh] gap-3 overflow-auto pr-1">
              {Object.entries(groupedSkills).map(([group, groupSkills]) => (
                <div className="rounded-md border border-[#e1e7e2] p-3" key={group}>
                  <p className="text-xs font-semibold uppercase text-[#66736d]">{group}</p>
                  <div className="mt-2 grid gap-2">
                    {groupSkills.map((skill) => (
                      <label className="grid cursor-pointer grid-cols-[18px_1fr] gap-2 text-sm" key={skill.id}>
                        <input
                          checked={selectedSkillIds.includes(skill.id)}
                          onChange={() => toggleSkill(skill.id)}
                          type="checkbox"
                        />
                        <span>{skill.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </aside>

        <section className="rounded-lg border border-[#dbe2dc] bg-white p-6 shadow-sm">
          <div className="worksheet mx-auto max-w-[8in]">
            <div className="border-b border-[#dbe2dc] pb-4">
              <p className="text-sm font-semibold text-[#2a6858]">{outputMode === "Worksheet" ? (view === "student" ? "Individual Reading Worksheet" : `${cluster} Reading Group Worksheet`) : "Google Form Draft"}</p>
              <h2 className="mt-1 text-3xl font-semibold">{passage.title}</h2>
              {outputMode === "Worksheet" ? (
                <p className="mt-2 text-sm text-[#5d6964]">
                  Name: {view === "student" ? selectedStudent.name : "____________________________"} &nbsp;&nbsp; Date: ______________
                </p>
              ) : (
                <p className="mt-2 text-sm text-[#5d6964]">
                  Form title: {view === "student" ? `${selectedStudent.name} - Reading Practice` : `${cluster} Reading Practice`} | Student name question: Short answer, required
                </p>
              )}
            </div>

            {outputMode === "Google Form draft" && createdCount > 0 && (
              <div className="no-print mt-4 rounded-md border border-[#c7dbd2] bg-[#eef7f2] p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <b>Google Form draft is ready.</b>
                    <p className="mt-1 text-[#4f5f58]">This quiz has 10 questions total: 1 required student-name question, 8 skill questions, and 1 exit question. The draft below is ready for the authorized Google Forms quiz creator.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="h-10 rounded-md bg-[#2a6858] px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#8aa89f]"
                      disabled={!createdFormUrl}
                      onClick={() => createdFormUrl && window.open(createdFormUrl, "_blank", "noopener,noreferrer")}
                      type="button"
                    >
                      {createdFormUrl ? "Open populated Google Form" : "Creating Google Form..."}
                    </button>
                    <button
                      className="h-10 rounded-md border border-[#2a6858] bg-white px-3 text-sm font-semibold text-[#2a6858]"
                      onClick={copyFormDraft}
                      type="button"
                    >
                      Copy Draft
                    </button>
                  </div>
                </div>
              </div>
            )}

            {outputMode === "Google Form draft" && createdFormUrl && (
              <p className="no-print mt-3 rounded-md border border-[#c7dbd2] bg-[#eef7f2] p-3 text-sm">
                Quiz created successfully. Use <b>Open populated Google Form</b> above.
              </p>
            )}

            {outputMode === "Google Form draft" && formCreationError && (
              <p className="no-print mt-3 rounded-md border border-[#d9b8b8] bg-[#fff4f4] p-3 text-sm text-[#7b2f2f]">
                {formCreationError} Change a worksheet choice to retry.
              </p>
            )}

            {outputMode === "Google Form draft" && createdCount > 0 && (
              <textarea
                aria-label="Generated Google Form draft"
                className="no-print mt-3 min-h-64 w-full rounded-md border border-[#cbd5ce] bg-[#fbfdfb] p-3 text-sm leading-6"
                readOnly
                value={formDraftText}
              />
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-[#eef5f2] p-3 text-sm"><b>Term</b><br />Spring 2024-2025</div>
              <div className="rounded-md bg-[#eef5f2] p-3 text-sm"><b>Level</b><br />{activeCluster}</div>
              <div className="rounded-md bg-[#eef5f2] p-3 text-sm"><b>Reading RIT</b><br />{view === "student" ? selectedStudent.readingRit ?? "Not extracted" : "Grouped packet"}</div>
            </div>

            {view === "student" && selectedStudent.focusArea && (
              <p className="mt-3 text-sm text-[#5d6964]">
                Reported focus area: {selectedStudent.focusArea}{selectedStudent.focusScore ? ` (${selectedStudent.focusScore})` : ""}
              </p>
            )}

            {view === "class" && (
              <div className="mt-4 rounded-md border border-[#dbe2dc] p-3 text-sm">
                <b>{cluster} group:</b> {clusterDescription(cluster)}
                <br />
                <b>Students:</b> {classStudents.map((student) => student.name).join("; ") || "No students with verified scores in this group yet."}
              </div>
            )}

            {view === "student" && !selectedStudent.verified && (
              <div className="mt-4 rounded-md border border-[#c7dbd2] bg-[#eef7f2] p-3 text-sm">
                This student is on the 2024-2025 Reading roster, but their detailed profile has not been extracted yet. The worksheet below uses the class reading practice template, not invented individual scores.
              </div>
            )}

            <div className="mt-4 rounded-md bg-[#f6f8f6] p-3 text-sm">
              <b>Selected skills ({worksheetSkills.length}):</b>
              {worksheetSkills.length ? (
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {worksheetSkills.map((skill) => (
                    <li key={skill.id}>{skill.text}</li>
                  ))}
                </ul>
              ) : (
                <span> Choose at least one skill from the checklist.</span>
              )}
            </div>

            <article className="mt-5">
              <h3 className="text-xl font-semibold">{outputMode === "Worksheet" ? "Reading Passage" : "Form Section 1: Reading Passage"}</h3>
              {outputMode === "Google Form draft" && (
                <div className="mt-2 rounded-md border border-[#dbe2dc] bg-[#f8faf8] p-3 text-sm">
                  <b>Google Form setup:</b> Add the passage below as a section description. Then add each item in the question section. Use Multiple choice for choice questions and Paragraph for short-answer questions.
                </div>
              )}
              {worksheetSkills.some((skill) => skill.area === "Vocabulary") && (
                <div className="mt-2 rounded-md border border-[#dbe2dc] bg-[#f8faf8] p-3 text-sm">
                  <b>Vocabulary targets:</b> {vocabWords.join(", ")}
                </div>
              )}
              <div className="mt-2 grid gap-3 text-[15px] leading-7">
                {passage.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>

            <article className="mt-5">
              <h3 className="text-xl font-semibold">{outputMode === "Worksheet" ? "Questions" : "Form Section 2: Questions"}</h3>
              {worksheetQuestions.length === 0 ? (
                <p className="mt-3 rounded-md border border-[#c7dbd2] bg-[#eef7f2] p-3 text-sm">
                  No questions generated yet. Choose one or more target skills from the checklist.
                </p>
              ) : (
              <div className="mt-3 grid gap-4">
                {outputMode === "Google Form draft" && (
                  <p><b>0.</b> Student name <span className="text-xs text-[#5d6964]">(Short answer, required)</span></p>
                )}
                {outputMode === "Worksheet" && worksheetSkills.every((skill) => skill.area === "Vocabulary") ? (
                  <>
                    <p><b>Warm-up 1.</b> Circle two words that seem important or challenging.</p>
                    <p><b>Warm-up 2.</b> Underline the context clue near one circled word.</p>
                  </>
                ) : outputMode === "Worksheet" ? (
                  <>
                    <p><b>Warm-up 1.</b> What topic or problem does the passage introduce?</p>
                    <p><b>Warm-up 2.</b> Underline one sentence that gives an important detail.</p>
                  </>
                ) : null}
                {worksheetQuestions.map((item, index) => (
                  <div key={`${item.skill.id}-${index}`}>
                    <p className="whitespace-pre-line"><b>{index + 1}.</b> {item.prompt}</p>
                    {outputMode === "Google Form draft" && (
                      <p className="mt-1 text-xs font-semibold text-[#2a6858]">
                        Google Form question type: {questionFormat === "Multiple choice" ? "Multiple choice" : "Paragraph"}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-[#5d6964]">Skill: {item.skill.text}</p>
                    {outputMode === "Worksheet" && <div className="print-answer-space mt-3 h-12 border-b border-[#87928e]" />}
                  </div>
                ))}
                {outputMode === "Worksheet" ? (
                  <div>
                    <p><b>Exit question.</b> What is one skill you practiced today, and what evidence did you use?</p>
                    <div className="print-answer-space mt-3 h-12 border-b border-[#87928e]" />
                  </div>
                ) : (
                  <div>
                    <p><b>Final form question.</b> What is one skill you practiced today, and what evidence did you use?</p>
                    <p className="mt-1 text-xs font-semibold text-[#2a6858]">Google Form question type: Paragraph</p>
                  </div>
                )}
              </div>
              )}
            </article>

            <article className="teacher-key mt-8 border-t border-[#dbe2dc] pt-5">
              <h3 className="text-xl font-semibold">Teacher Answer Key</h3>
              <p className="mt-2 text-sm leading-6">Accept responses that accurately identify the passage's problem, cite relevant details, and connect answers to the selected skill. Reteach by rereading one paragraph at a time and charting: text detail, inference, answer.</p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
