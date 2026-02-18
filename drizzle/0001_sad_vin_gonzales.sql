CREATE TABLE `assessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`domainId` int NOT NULL,
	`influencerId` int NOT NULL,
	`responses` json,
	`scores` json,
	`aiAnalysis` text,
	`strengths` json,
	`weaknesses` json,
	`completedAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coachingPlans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`assessmentId` int NOT NULL,
	`weekNumber` int NOT NULL,
	`shortTermGoals` json,
	`longTermGoals` json,
	`aiInsights` text,
	`difficultyLevel` int NOT NULL DEFAULT 3,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coachingPlans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dailyTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`coachingPlanId` int,
	`title` varchar(500) NOT NULL,
	`description` text,
	`taskDate` timestamp NOT NULL,
	`aiGenerated` boolean NOT NULL DEFAULT false,
	`difficultyLevel` int NOT NULL DEFAULT 3,
	`estimatedMinutes` int,
	`category` varchar(100),
	`completed` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dailyTasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `domains` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`icon` varchar(50),
	`assessmentCategories` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `domains_id` PRIMARY KEY(`id`),
	CONSTRAINT `domains_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `eodReflections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` timestamp NOT NULL,
	`responses` json,
	`aiAnalysis` text,
	`sentiment` varchar(50),
	`keyInsights` json,
	`suggestedAdjustments` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `eodReflections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `influencers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`domainId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`title` varchar(200),
	`bio` text,
	`imageUrl` text,
	`coachingStyle` text,
	`voiceCharacteristics` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `influencers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kpis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` timestamp NOT NULL,
	`metrics` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `kpis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` timestamp NOT NULL,
	`tasksCompleted` int NOT NULL DEFAULT 0,
	`tasksAssigned` int NOT NULL DEFAULT 0,
	`completionRate` float NOT NULL DEFAULT 0,
	`averageCompletionTime` int,
	`reflectionQuality` int,
	`streakDays` int NOT NULL DEFAULT 0,
	`aiAdjustments` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `selectedDomainId` int;--> statement-breakpoint
ALTER TABLE `users` ADD `selectedInfluencerId` int;--> statement-breakpoint
ALTER TABLE `users` ADD `onboardingCompleted` boolean DEFAULT false NOT NULL;