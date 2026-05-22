// backend/seedQuestions.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Question from "./models/Question.js";

dotenv.config();

const ALL = [
  {
    category: "anxiety",
    questions: [
      "I often feel tense, nervous, or on edge — even when there's no clear reason.",
      "I worry a lot about different things, even small ones that others might not think about.",
      "I find it hard to control or stop my worrying once it starts.",
      "I often feel restless, like I can't sit still or relax fully.",
      "I get tired easily because my mind is constantly racing with worries.",
      "I notice physical tension in my body, such as tight shoulders or jaw clenching.",
      "I sometimes experience a pounding heart, sweating, or trembling when I feel anxious.",
      "I often overthink past situations or replay conversations in my head.",
      "I have trouble falling asleep or staying asleep because my thoughts keep me awake.",
      "I feel easily startled or jumpy when something unexpected happens.",
      "I find it difficult to concentrate when I'm worried about something else.",
      "I tend to imagine the worst possible outcomes, even in ordinary situations.",
      "I feel like I have to be constantly prepared for something bad to happen.",
      "I sometimes feel lightheaded, dizzy, or short of breath when I'm anxious.",
      "I get irritable or snappy when I'm feeling tense or under stress.",
      "I worry that I might lose control or embarrass myself in front of others.",
      "I find it hard to enjoy life because I'm always thinking about what could go wrong.",
      "I sometimes feel detached or spaced out when I'm overwhelmed by anxiety.",
      "I notice that my anxiety gets in the way of work, relationships, or daily tasks.",
      "Even on calm days, I feel a sense of unease, like something bad could happen soon.",
    ],
  },
  {
    category: "depression",
    questions: [
      "I often feel sad or down, even when things are going okay.",
      "I don't enjoy my usual hobbies or activities as much as I used to.",
      "It feels hard to get started on new tasks or projects.",
      "Things that used to make me happy don't feel the same anymore.",
      "I sometimes get headaches, stomachaches, or other pains for no clear reason.",
      "I get irritated or upset more easily than before.",
      "I feel left out or disconnected from other people.",
      "It's hard to feel hopeful about the future.",
      "I cry more easily than I used to, or feel like I could cry for no reason.",
      "I have trouble falling asleep, staying asleep, or I sleep much longer than usual.",
      "I often think I'm not doing as well in life as I should be.",
      "It's hard to focus on school, work, or everyday tasks.",
      "I tend to be very hard on myself when I make mistakes.",
      "I often feel tired or low on energy, even after resting.",
      "I lose interest in things like reading, shows, or games halfway through.",
      "Making simple decisions feels more stressful than it used to.",
      "When I feel low, it's hard for others to cheer me up.",
      "I sometimes feel like I don't matter or that people wouldn't miss me if I weren't around.",
      "My appetite has changed — I'm eating much more or much less than usual.",
      "I don't feel as affectionate or close to others as I used to.",
    ],
  },
  {
    category: "adhd",
    questions: [
      "Do you find it hard to stay focused, even on things that interest you?",
      "Do you often start projects but lose motivation before finishing?",
      "Is it hard for you to keep your things organized — like your room, bag, or notes?",
      "Do you find yourself forgetting appointments or where you placed important items?",
      "Do you often feel restless or like you always have to be moving?",
      "Do you talk a lot or interrupt people before they finish speaking?",
      "Do you get distracted easily by your surroundings or your own thoughts?",
      "Do you struggle to sit still for long periods, like in meetings or classes?",
      "Do you sometimes do things impulsively, without thinking them through?",
      "Do you often put things off until the last minute?",
      "Do you get frustrated when things take longer than you expected?",
      "Do you find it hard to follow long conversations or instructions?",
      "Do you sometimes take on too many things and end up feeling overwhelmed?",
      "Do you lose track of time when doing something interesting?",
      "Do you find it hard to relax, even when you want to?",
      "Do you have trouble sleeping because your mind won't slow down?",
      "Do you often switch from one task to another before finishing?",
      "Do you forget small details even when you try to be careful?",
      "Do you feel like your energy level is always changing — either too high or too low?",
      "Do you sometimes say or do things you regret right after?",
    ],
  },
  {
    category: "autism",
    questions: [
      "I often notice patterns or details that other people don't see.",
      "I prefer to follow familiar routines and can get stressed when they change unexpectedly.",
      "I sometimes struggle to understand social cues, like tone of voice or body language.",
      "People have told me that I sound blunt or rude, even when I don't mean to be.",
      "I have specific interests or hobbies that I can focus on for long periods of time.",
      "I'm very sensitive to physical sensations, such as certain fabrics, lights, or textures.",
      "Making or maintaining eye contact can feel uncomfortable for me.",
      "I find casual small talk or social chitchat difficult or tiring.",
      "I tend to interpret things very literally and sometimes miss hidden meanings or jokes.",
      "In group conversations, I'm often unsure when it's my turn to speak.",
      "Repetitive movements or routines, like pacing or tapping, help me stay calm when I'm stressed.",
      "When my usual schedule or environment changes, I can feel anxious or upset.",
      "I enjoy collecting or memorizing information about specific topics or categories.",
      "I sometimes copy other people's behavior or expressions to fit in socially.",
      "It can be difficult for me to guess what others are thinking or feeling unless they say it directly.",
      "I can talk about my favorite interests or topics for a very long time.",
      "I sometimes miss when people use sarcasm, irony, or subtle humor.",
      "Certain everyday sounds, lights, or textures that don't bother others can feel overwhelming to me.",
      "It can be hard to follow conversations when several people are talking at once.",
      "I find it challenging to imagine situations or experiences that I haven't personally encountered.",
    ],
  },
  {
    category: "bipolar",
    questions: [
      "I often experience bursts of energy or excitement that feel much stronger than my usual mood.",
      "There are times when I talk more rapidly or feel an unusual pressure to keep talking.",
      "I sometimes sleep far less than usual but still feel full of energy or alert.",
      "My thoughts can race so quickly that it becomes difficult to focus or stay organized.",
      "I occasionally feel unusually confident or capable, almost as if nothing could go wrong.",
      "I've made impulsive or risky decisions during periods of high energy (such as overspending or taking big chances).",
      "At times, I've felt easily irritated or short-tempered, even over small issues.",
      "I experience phases of extreme productivity or creativity that are hard to sustain.",
      "People close to me have commented on noticeable changes in my mood or behavior.",
      "I have felt unusually cheerful, talkative, or excitable for no clear reason.",
      "My mood can shift quickly — from feeling very good or energetic to feeling sad or hopeless.",
      "There are periods when I start big projects or plans but lose motivation shortly after.",
      "I've noticed physical restlessness, such as pacing or being unable to sit still.",
      "My eating habits or appetite change significantly depending on how I'm feeling.",
      "Sometimes I feel more outgoing or sexually confident than usual for me.",
      "I've had stretches of time where I felt deeply sad, hopeless, or uninterested in daily activities.",
      "When I feel down, I tend to withdraw from others or avoid social contact.",
      "My emotional ups and downs have affected my performance at school, work, or in relationships.",
      "A close family member has been diagnosed with bipolar disorder or another mood disorder.",
      "These changes in mood and energy have interfered with my daily life or responsibilities.",
    ],
  },
  {
    category: "eq",
    questions: [
      "I can recognize and understand my emotions as they happen.",
      "I notice and interpret other people's body language and tone of voice.",
      "I sometimes lose my temper more quickly than I'd like.",
      "I learn and grow from emotional experiences, even difficult ones.",
      "When making an important decision, I consider both my current feelings and how I might feel later.",
      "I recover well from emotional setbacks or disappointments.",
      "I'm comfortable expressing a wide range of emotions in healthy ways.",
      "I can stay calm and respectful during disagreements or conflict.",
      "I try to understand and accept other people's emotions without judging them.",
      "I can stay grounded and steady in challenging or stressful situations.",
      "I'm able to stay composed and think clearly when things get tough.",
      "I sometimes speak or react impulsively before thinking about how it affects others.",
      "I often feel and express gratitude toward others.",
      "I accept my emotions, even when they're uncomfortable or unpleasant.",
      "I adjust my behavior when situations or people require something different from me.",
      "I'm open to feedback and willing to try new approaches when things don't work.",
      "I try to validate and acknowledge other people's feelings.",
      "I can adapt easily to changing circumstances or environments.",
      "I sometimes find it hard to understand what others are feeling.",
      "I occasionally struggle to identify exactly what I'm feeling inside.",
    ],
  },
  {
    category: "mentalhealth",
    questions: [
      "I often feel overwhelmed by my emotions.",
      "I can usually handle the amount of stress in my life.",
      "I sometimes notice physical signs of anxiety, such as tense muscles or sweaty palms.",
      "I have close, supportive relationships with people I care about.",
      "I regret some of my past decisions and think about them often.",
      "I tend to be very self-critical or hard on myself.",
      "I still struggle with painful experiences or losses from the past.",
      "I can recognize and express my emotions in a healthy way.",
      "I believe the people close to me will support me if I open up to them.",
      "I sometimes engage in habits that make it harder to function at my best.",
      "When I feel strong emotions, I usually understand what triggered them.",
      "My mood stays fairly steady from day to day.",
      "I often avoid or put off important tasks, even when I know I shouldn't.",
      "I feel sad or down more often than I'd like to.",
      "I have a sense of meaning or purpose in my life.",
      "I sometimes feel lonely or disconnected from others.",
      "I get frustrated, upset, or angry easily.",
      "My sleep or appetite has changed compared to when I felt at my best.",
      "I can recover from challenges or setbacks without too much difficulty.",
      "Most days, I manage my time and responsibilities fairly well.",
    ],
  },
  {
    category: "personality",
    questions: [
      "I can be very persuasive when I want something.",
      "When I know someone is struggling, I genuinely hope they're doing okay.",
      "I often notice when others make mistakes and feel I could do better.",
      "I sometimes bend the truth to get what I need.",
      "If I hurt someone's feelings, I usually feel sorry afterward.",
      "I get impatient when people don't think as quickly as I do.",
      "I feel that others sometimes blame me unfairly for things that go wrong.",
      "I believe following rules too strictly can hold people back.",
      "When I see someone crying, I feel concerned and want to help.",
      "I occasionally tease or provoke people just to see their reaction.",
      "The idea of breaking the law makes me uneasy.",
      "I'm good at reading people and knowing how to influence them.",
      "I enjoy excitement and taking risks.",
      "I believe in keeping my promises and financial commitments.",
      "I tend to stay calm when others get emotional.",
      "I think helping others is important, even when there's nothing in it for me.",
      "I don't get frightened easily, even in stressful situations.",
      "Everyone deserves a fair chance to succeed, regardless of background.",
      "I'm open about my feelings and show them easily.",
      "If a rule seems unfair, I think it's okay to question or challenge it.",
    ],
  },
  {
    category: "neuro",
    questions: [
      "I get stressed or overwhelmed easily.",
      "It takes a lot for me to feel embarrassed or self-conscious.",
      "My mood tends to change quickly and often.",
      "I stay calm and steady when things go wrong.",
      "I generally feel positive and relaxed most of the time.",
      "I'm easily startled or on edge in unexpected situations.",
      "It's easy for other people's emotions to affect my own mood.",
      "When I worry, it can feel hard to stop thinking about it.",
      "There aren't many things that make me feel afraid.",
      "Once I start feeling anxious or sad, it takes time for me to calm down.",
      "I feel down or low more often than I'd like to.",
      "I often imagine worst-case scenarios or focus on what might go wrong.",
      "Small problems rarely upset me for long.",
      "I can be very self-critical, even over small mistakes.",
      "I get irritated or frustrated more easily than others.",
      "I sometimes doubt my ability to handle difficult situations.",
      "I usually feel secure and not easily threatened by others.",
      "I tend to overthink or exaggerate small issues.",
      "When I face major obstacles, I sometimes feel like giving up.",
      "I can usually keep my emotions steady, even under stress.",
    ],
  },
];

async function run() {
  await connectDB();
  console.log("📦 Connected to MongoDB — starting seed...");

  for (const { category, questions } of ALL) {
    // Remove existing active questions for this category
    await Question.deleteMany({ category, active: true });
    console.log(`  🗑  Cleared old questions for "${category}"`);

    // Insert fresh active questions
    const docs = questions.map((text, idx) => ({
      category,
      text,
      order: idx,
      active: true,
    }));
    const result = await Question.insertMany(docs);
    console.log(`  ✅  Inserted ${result.length} questions for "${category}"`);
  }

  console.log("\n🎉 Seed complete. All categories populated.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
