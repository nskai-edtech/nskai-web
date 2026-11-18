/**
 * This month's Paper Talk topics and project demos, shown on every chapter's
 * "Session Guides" tab. Updated monthly by editing this file and deploying.
 */

export interface Paper {
  title: string;
  authors: string;
  year: number;
  url: string;
  /** What to argue about in the session. */
  discuss: string;
}

export interface PaperTopic {
  topic: string;
  why: string;
  papers: Paper[];
}

export interface ProjectDemo {
  title: string;
  summary: string;
  steps: string[];
}

export const MONTH_LABEL = "November 2026";

export const PAPER_TOPICS: PaperTopic[] = [
  {
    topic: "Self-Recursive Learning",
    why: "Models and agents that improve themselves using their own outputs, and where that loop breaks.",
    papers: [
      {
        title: "STaR: Bootstrapping Reasoning With Reasoning",
        authors: "Zelikman, Wu, Mu, Goodman",
        year: 2022,
        url: "https://arxiv.org/abs/2203.14465",
        discuss: "A model trains on its own correct reasoning. Does that teach it to reason, or only to repeat what already worked?",
      },
      {
        title: "Self-Rewarding Language Models",
        authors: "Yuan et al.",
        year: 2024,
        url: "https://arxiv.org/abs/2401.10020",
        discuss: "The model judges its own answers to make training data. What stops it from rewarding its own mistakes?",
      },
      {
        title: "Gödel Agent: A Self-Referential Agent Framework for Recursive Self-Improvement",
        authors: "Yin et al.",
        year: 2024,
        url: "https://arxiv.org/abs/2410.04444",
        discuss: "An agent that rewrites its own code. What should it never be allowed to change?",
      },
      {
        title: "Darwin Gödel Machine: Open-Ended Evolution of Self-Improving Agents",
        authors: "Zhang, Hu, Lu, Lange, Clune",
        year: 2025,
        url: "https://arxiv.org/abs/2505.22954",
        discuss: "Self-improvement checked against benchmarks instead of proofs. What did the agents learn to game?",
      },
    ],
  },
  {
    topic: "World Models",
    why: "Systems that learn how the world behaves, so they can predict and plan before they act.",
    papers: [
      {
        title: "World Models",
        authors: "Ha, Schmidhuber",
        year: 2018,
        url: "https://arxiv.org/abs/1803.10122",
        discuss: "An agent learns inside its own dream of a game. When does a learned simulator stop being trustworthy?",
      },
      {
        title: "Mastering Diverse Domains through World Models (DreamerV3)",
        authors: "Hafner, Pasukonis, Ba, Lillicrap",
        year: 2023,
        url: "https://arxiv.org/abs/2301.04104",
        discuss: "One set of settings works across many tasks, including diamonds in Minecraft. What makes it so general?",
      },
      {
        title: "Genie: Generative Interactive Environments",
        authors: "Bruce et al.",
        year: 2024,
        url: "https://arxiv.org/abs/2402.15391",
        discuss: "Playable worlds learned from unlabelled video. Is this a world model or a very good video generator?",
      },
      {
        title: "V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning",
        authors: "Assran et al.",
        year: 2025,
        url: "https://arxiv.org/abs/2506.09985",
        discuss: "Predicting in a learned representation instead of pixels. Why might that matter for robots?",
      },
    ],
  },
  {
    topic: "AI Agents and Tool Use",
    why: "How language models act: calling tools, using computers and learning skills. This is the background for this month's demos.",
    papers: [
      {
        title: "ReAct: Synergizing Reasoning and Acting in Language Models",
        authors: "Yao et al.",
        year: 2022,
        url: "https://arxiv.org/abs/2210.03629",
        discuss: "The think, act, observe loop that most agent harnesses still use. Why does mixing the two help?",
      },
      {
        title: "Toolformer: Language Models Can Teach Themselves to Use Tools",
        authors: "Schick et al.",
        year: 2023,
        url: "https://arxiv.org/abs/2302.04761",
        discuss: "The model decides by itself when a calculator or search would help. Compare with tools wired in by hand.",
      },
      {
        title: "Voyager: An Open-Ended Embodied Agent with Large Language Models",
        authors: "Wang et al.",
        year: 2023,
        url: "https://arxiv.org/abs/2305.16291",
        discuss: "An agent that writes and saves its own skills as code. How is that like the skills in OpenClaw?",
      },
      {
        title: "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering",
        authors: "Yang et al.",
        year: 2024,
        url: "https://arxiv.org/abs/2405.15793",
        discuss: "Designing the tools changed results as much as changing the model. What makes a good tool for an agent?",
      },
    ],
  },
  {
    topic: "Reasoning and Test-Time Compute",
    why: "Why letting a model think longer can beat making it bigger.",
    papers: [
      {
        title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
        authors: "Wei et al.",
        year: 2022,
        url: "https://arxiv.org/abs/2201.11903",
        discuss: "Asking for step-by-step working improves answers. Is the written reasoning what the model actually does?",
      },
      {
        title: "Let's Verify Step by Step",
        authors: "Lightman et al.",
        year: 2023,
        url: "https://arxiv.org/abs/2305.20050",
        discuss: "Checking each step versus only the final answer. Which is better, and what does it cost to label?",
      },
      {
        title: "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters",
        authors: "Snell, Lee, Xu, Kumar",
        year: 2024,
        url: "https://arxiv.org/abs/2408.03314",
        discuss: "When is it cheaper to think longer than to train bigger? Look at how the answer changes with question difficulty.",
      },
      {
        title: "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning",
        authors: "DeepSeek-AI",
        year: 2025,
        url: "https://arxiv.org/abs/2501.12948",
        discuss: "Reasoning learned from rewards alone, with no worked examples. What appeared without being taught?",
      },
    ],
  },
];

export const PROJECT_DEMOS: ProjectDemo[] = [
  {
    title: "Build an Agent Harness",
    summary:
      "A harness is the program wrapped around a model. It sends the task, runs the tools the model asks for, feeds the results back and decides when to stop. Members build a small one live, so agents stop being a black box.",
    steps: [
      "Write the loop: send the task, read the reply, and run any tool call it contains.",
      "Add two or three tools, such as reading a file, searching the web and running a calculation.",
      "Return each tool's result to the model and repeat until it gives a final answer or reaches a step limit.",
      "Print every step so the room can watch what the model decided and why.",
      "Use a free model: a small local one through Ollama, or a free API tier.",
    ],
  },
  {
    title: "OpenClaw: A Personal AI Agent",
    summary:
      "OpenClaw is an open-source personal assistant agent that runs on your own machine and can be connected to chat apps. Demo it end to end, then open it up to see the harness inside.",
    steps: [
      "Install OpenClaw and connect it to a model. A local Ollama model keeps it free.",
      "Give it a real task from campus life, such as summarising a document or drafting a schedule.",
      "Add one skill and show how the agent finds and uses it.",
      "Look at its permissions: what can it touch on the machine, and what should it ask before doing?",
      "Compare it with the harness built in the first demo. What does OpenClaw add?",
    ],
  },
];
