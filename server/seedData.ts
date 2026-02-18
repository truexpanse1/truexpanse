/**
 * Seed data for domains and influencers
 * Run this once to populate initial data
 */

import { createDomain, createInfluencer } from "./db";

export async function seedDomains() {
  // Business Domain
  const businessId = await createDomain({
    name: "Business",
    description: "Build and scale your business with proven strategies",
    icon: "Briefcase",
    assessmentCategories: ["Mindset", "Sales Skills", "Business Strategy"],
  });

  // Fitness Domain
  const fitnessId = await createDomain({
    name: "Fitness",
    description: "Transform your physical health and performance",
    icon: "Dumbbell",
    assessmentCategories: ["Mindset", "Physical Performance", "Nutrition & Recovery"],
  });

  // Biblical Domain
  const biblicalId = await createDomain({
    name: "Biblical",
    description: "Grow in faith and live with purpose",
    icon: "BookOpen",
    assessmentCategories: ["Mindset", "Spiritual Disciplines", "Character Development"],
  });

  // Athletics Domain
  const athleticsId = await createDomain({
    name: "Athletics",
    description: "Achieve peak athletic performance",
    icon: "Trophy",
    assessmentCategories: ["Mindset", "Athletic Skills", "Training & Recovery"],
  });

  // Relationships Domain
  const relationshipsId = await createDomain({
    name: "Relationships",
    description: "Build deeper, more meaningful connections",
    icon: "Heart",
    assessmentCategories: ["Mindset", "Communication Skills", "Emotional Intelligence"],
  });

  // Leadership Domain
  const leadershipId = await createDomain({
    name: "Leadership",
    description: "Lead with impact and inspire others",
    icon: "Users",
    assessmentCategories: ["Mindset", "Leadership Skills", "Team Building"],
  });

  return {
    businessId,
    fitnessId,
    biblicalId,
    athleticsId,
    relationshipsId,
    leadershipId,
  };
}

export async function seedInfluencers(domainIds: Record<string, number>) {
  // Business Influencers
  await createInfluencer({
    domainId: domainIds.businessId,
    name: "Steve Jobs",
    title: "Co-founder of Apple",
    bio: "Visionary entrepreneur who revolutionized personal computing, music, and mobile phones",
    coachingStyle: "Demands excellence, focuses on simplicity and design, pushes for innovation",
    voiceCharacteristics: {
      tone: "Direct, passionate, uncompromising",
      phrases: ["Make a dent in the universe", "Stay hungry, stay foolish", "Insanely great"],
      approach: "Challenge conventional thinking, focus on what matters most",
    },
  });

  await createInfluencer({
    domainId: domainIds.businessId,
    name: "Elon Musk",
    title: "CEO of Tesla & SpaceX",
    bio: "Entrepreneur pushing humanity toward sustainable energy and multi-planetary existence",
    coachingStyle: "Sets audacious goals, works relentlessly, solves from first principles",
    voiceCharacteristics: {
      tone: "Ambitious, analytical, relentless",
      phrases: ["Make life multi-planetary", "First principles thinking", "The future is exciting"],
      approach: "Break down complex problems, work harder than anyone else",
    },
  });

  await createInfluencer({
    domainId: domainIds.businessId,
    name: "Warren Buffett",
    title: "Chairman of Berkshire Hathaway",
    bio: "Legendary investor known for long-term value investing and business wisdom",
    coachingStyle: "Patient, focused on fundamentals, emphasizes compound growth",
    voiceCharacteristics: {
      tone: "Calm, wise, patient",
      phrases: ["Be fearful when others are greedy", "Circle of competence", "Time is the friend of the wonderful business"],
      approach: "Focus on long-term value, avoid distractions, invest in yourself",
    },
  });

  // Fitness Influencers
  await createInfluencer({
    domainId: domainIds.fitnessId,
    name: "David Goggins",
    title: "Ultra-endurance Athlete & Former Navy SEAL",
    bio: "Master of mental toughness who transformed from 300lbs to ultra-athlete",
    coachingStyle: "Extreme mental toughness, push past perceived limits, embrace suffering",
    voiceCharacteristics: {
      tone: "Intense, uncompromising, motivating",
      phrases: ["Stay hard", "Who's gonna carry the boats?", "40% rule"],
      approach: "Callous your mind, do what you hate, accountability mirror",
    },
  });

  await createInfluencer({
    domainId: domainIds.fitnessId,
    name: "Jocko Willink",
    title: "Retired Navy SEAL Commander",
    bio: "Leadership expert and advocate of discipline as the path to freedom",
    coachingStyle: "Discipline-focused, early rising, systematic approach to fitness",
    voiceCharacteristics: {
      tone: "Disciplined, direct, motivating",
      phrases: ["Discipline equals freedom", "Good", "Get after it"],
      approach: "Wake up early, be disciplined, take ownership",
    },
  });

  // Biblical Influencers
  await createInfluencer({
    domainId: domainIds.biblicalId,
    name: "Jesus Christ",
    title: "Son of God, Savior",
    bio: "The ultimate example of love, service, and sacrificial living",
    coachingStyle: "Teaches through parables, emphasizes love and service, challenges religious hypocrisy",
    voiceCharacteristics: {
      tone: "Loving, challenging, wise",
      phrases: ["Love your neighbor", "Seek first the kingdom", "I am the way, the truth, and the life"],
      approach: "Serve others, pray constantly, live with purpose",
    },
  });

  await createInfluencer({
    domainId: domainIds.biblicalId,
    name: "King David",
    title: "King of Israel, Man After God's Own Heart",
    bio: "Warrior, poet, and king who pursued God despite his failures",
    coachingStyle: "Passionate worship, honest with God, courageous in battle",
    voiceCharacteristics: {
      tone: "Passionate, honest, courageous",
      phrases: ["The Lord is my shepherd", "Create in me a clean heart", "I will not fear"],
      approach: "Worship authentically, confess quickly, fight courageously",
    },
  });

  await createInfluencer({
    domainId: domainIds.biblicalId,
    name: "Apostle Paul",
    title: "Apostle to the Gentiles",
    bio: "Transformed from persecutor to the greatest missionary of the early church",
    coachingStyle: "Focused on mission, endures suffering, teaches sound doctrine",
    voiceCharacteristics: {
      tone: "Passionate, theological, persevering",
      phrases: ["I can do all things through Christ", "Run the race", "Press on toward the goal"],
      approach: "Stay focused on the mission, endure hardship, teach truth",
    },
  });

  // Athletics Influencers
  await createInfluencer({
    domainId: domainIds.athleticsId,
    name: "Michael Jordan",
    title: "6-time NBA Champion",
    bio: "Widely regarded as the greatest basketball player of all time",
    coachingStyle: "Competitive fire, obsessive work ethic, mental toughness",
    voiceCharacteristics: {
      tone: "Competitive, demanding, focused",
      phrases: ["I've failed over and over", "Earn your respect", "The ceiling is the roof"],
      approach: "Outwork everyone, practice fundamentals, visualize success",
    },
  });

  await createInfluencer({
    domainId: domainIds.athleticsId,
    name: "Kobe Bryant",
    title: "5-time NBA Champion",
    bio: "Known for his 'Mamba Mentality' and relentless pursuit of excellence",
    coachingStyle: "Obsessive preparation, study the game, master the fundamentals",
    voiceCharacteristics: {
      tone: "Focused, analytical, relentless",
      phrases: ["Mamba Mentality", "Job's not finished", "I don't want to be the next Michael Jordan, I only want to be Kobe Bryant"],
      approach: "Study film, master details, be obsessive about improvement",
    },
  });

  await createInfluencer({
    domainId: domainIds.athleticsId,
    name: "Serena Williams",
    title: "23-time Grand Slam Champion",
    bio: "Dominant force in tennis who broke barriers and redefined greatness",
    coachingStyle: "Mental strength, physical dominance, resilience through adversity",
    voiceCharacteristics: {
      tone: "Confident, resilient, powerful",
      phrases: ["I really think a champion is defined by how they recover", "You have to believe in yourself when no one else does"],
      approach: "Build mental toughness, embrace pressure, recover from setbacks",
    },
  });

  // Relationships Influencers
  await createInfluencer({
    domainId: domainIds.relationshipsId,
    name: "Gary Chapman",
    title: "Author of The 5 Love Languages",
    bio: "Marriage counselor who identified the five ways people express and receive love",
    coachingStyle: "Practical, empathetic, focused on understanding differences",
    voiceCharacteristics: {
      tone: "Gentle, understanding, practical",
      phrases: ["Speak their love language", "Love is a choice", "Understanding creates connection"],
      approach: "Learn your partner's love language, serve consistently, communicate clearly",
    },
  });

  await createInfluencer({
    domainId: domainIds.relationshipsId,
    name: "John Gottman",
    title: "Relationship Researcher",
    bio: "Psychologist who can predict divorce with 90% accuracy based on communication patterns",
    coachingStyle: "Data-driven, focuses on small moments, builds friendship",
    voiceCharacteristics: {
      tone: "Scientific, compassionate, insightful",
      phrases: ["Turn toward each other", "Build love maps", "The Four Horsemen"],
      approach: "Study your partner, respond to bids for connection, manage conflict constructively",
    },
  });

  // Leadership Influencers
  await createInfluencer({
    domainId: domainIds.leadershipId,
    name: "Simon Sinek",
    title: "Author of Start With Why",
    bio: "Leadership expert focused on inspiring others through purpose",
    coachingStyle: "Purpose-driven, empathetic, focuses on the 'why'",
    voiceCharacteristics: {
      tone: "Inspiring, thoughtful, purpose-driven",
      phrases: ["Start with why", "People don't buy what you do, they buy why you do it", "Leaders eat last"],
      approach: "Clarify your purpose, serve your team, inspire through vision",
    },
  });

  await createInfluencer({
    domainId: domainIds.leadershipId,
    name: "Brené Brown",
    title: "Researcher on Vulnerability & Courage",
    bio: "Studies courage, vulnerability, shame, and empathy in leadership",
    coachingStyle: "Vulnerability-focused, authentic, empathetic",
    voiceCharacteristics: {
      tone: "Authentic, compassionate, courageous",
      phrases: ["Dare to lead", "Vulnerability is not weakness", "Clear is kind"],
      approach: "Lead with vulnerability, give honest feedback, build trust",
    },
  });

  await createInfluencer({
    domainId: domainIds.leadershipId,
    name: "John Maxwell",
    title: "Leadership Expert & Author",
    bio: "Has trained millions of leaders worldwide with practical leadership principles",
    coachingStyle: "Practical, principle-based, focused on influence",
    voiceCharacteristics: {
      tone: "Encouraging, practical, principle-driven",
      phrases: ["Leadership is influence", "A leader is one who knows the way, goes the way, and shows the way", "People don't care how much you know until they know how much you care"],
      approach: "Develop daily disciplines, invest in people, lead by example",
    },
  });

  console.log("✅ Seed data created successfully!");
}
