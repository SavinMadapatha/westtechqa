-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 17, 2024 at 12:22 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `WestTechQA`
--

-- --------------------------------------------------------

--
-- Table structure for table `Answer`
--

CREATE TABLE `Answer` (
  `answer_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `votes` int(11) DEFAULT 0,
  `posted_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `accepted` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Indicates if the answer is accepted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Answer`
--

INSERT INTO `Answer` (`answer_id`, `question_id`, `user_id`, `content`, `votes`, `posted_date`, `accepted`) VALUES
(82, 3, 4, 'you can use a bubble sort algorithm', 2, '2024-05-14 11:51:30', 0),
(83, 3, 4, 'by using a merge sort algorithm', 1, '2024-05-14 11:51:49', 0),
(85, 3, 4, 'you can use selection sort algorithm', 0, '2024-05-14 12:16:25', 1),
(86, 3, 4, 'there are many algorithms', 0, '2024-05-14 12:25:08', 0),
(90, 9, 4, 'react is my choice, as it is easy to learn for beginners', 3, '2024-05-14 12:49:43', 1),
(91, 9, 5, 'as someone who has been in the industry for over 20 years, I can firmly suggest that learning react will be the best choice if you are a beginner.', 0, '2024-05-14 14:15:40', 0),
(93, 9, 5, 'I would also suggest, Angular offers a great set of libraries and a career path for who likes it', 0, '2024-05-15 14:46:46', 0),
(94, 3, 5, 'there are also built in functions available to sort arrays in the ArrayList class', 0, '2024-05-15 14:47:29', 0),
(98, 9, 2, 'React is way more easier than Angular', 0, '2024-05-16 18:19:35', 0),
(103, 21, 2, 'I would suggest you to start with simple html,css, js web app development', 1, '2024-05-16 21:56:12', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Comment`
--

CREATE TABLE `Comment` (
  `comment_id` int(11) NOT NULL,
  `answer_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `posted_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Comment`
--

INSERT INTO `Comment` (`comment_id`, `answer_id`, `user_id`, `content`, `posted_date`) VALUES
(10, 90, 4, 'this is definitely true. It was for me!', '2024-05-15 14:15:55'),
(13, 91, 5, 'I heard there\'s a huge demand for react developers in the new job market, is it true?', '2024-05-15 14:25:44'),
(14, 90, 5, 'I also agree as someone who has been learning react for few months.', '2024-05-15 14:26:13'),
(18, 90, 1, 'I cant agree more, I love react', '2024-05-16 21:50:15'),
(19, 103, 1, 'thank you for your suggestion, I will try', '2024-05-16 21:56:45');

-- --------------------------------------------------------

--
-- Table structure for table `Question`
--

CREATE TABLE `Question` (
  `question_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `posted_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Question`
--

INSERT INTO `Question` (`question_id`, `user_id`, `title`, `content`, `posted_date`) VALUES
(3, 4, 'How to sort an array in Java?', 'Sorting is a fundamental operation in computer science, and Java provides several built-in methods to achieve this efficiently. By sorting an array, you arrange its elements in a particular order, such as ascending or descending. This can be crucial for tasks like organizing data for efficient searching or displaying results in a meaningful way. In Java, you can use methods like Arrays.sort() for arrays of primitive types or Collections.sort() for collections like ArrayLists. These methods implement efficient sorting algorithms like quicksort or mergesort behind the scenes, ensuring optimal performance for different data sizes and types. Understanding how to sort arrays in Java is essential for any developer working with data manipulation or algorithmic problem-solving tasks.', '2024-05-13 12:52:21'),
(9, 4, 'What are the key differences between Angular and React?', 'Angular and React are both popular frontend JavaScript frameworks used for building user interfaces, but they differ in several aspects. Angular is a comprehensive framework developed and maintained by Google, offering a complete solution with features like dependency injection, two-way data binding, and a built-in router. React, developed by Facebook, is a JavaScript library focused on building UI components and managing their state efficiently. One of the significant differences is their approach to handling the DOM. Angular utilizes a template-based approach with declarative syntax, while React uses a virtual DOM and JSX (JavaScript XML) for rendering components. Additionally, Angular follows a more opinionated architecture with concepts like modules and services, whereas React provides greater flexibility and allows developers to choose additional libraries and tools based on project requirements. Understanding these differences can help developers make informed decisions when selecting a framework for frontend development projects.', '2024-05-13 16:16:50'),
(21, 1, 'What is the best programming language to start with?', 'I\'m a beginner, please suggest me', '2024-05-16 21:55:15');

-- --------------------------------------------------------

--
-- Table structure for table `QuestionTag`
--

CREATE TABLE `QuestionTag` (
  `question_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `QuestionTag`
--

INSERT INTO `QuestionTag` (`question_id`, `tag_id`) VALUES
(3, 1),
(3, 2),
(9, 4),
(9, 7),
(21, 1),
(21, 2),
(21, 8),
(21, 9),
(21, 10),
(21, 12);

-- --------------------------------------------------------

--
-- Table structure for table `Tag`
--

CREATE TABLE `Tag` (
  `tag_id` int(11) NOT NULL,
  `tag_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Tag`
--

INSERT INTO `Tag` (`tag_id`, `tag_name`) VALUES
(1, 'Python'),
(2, 'Java'),
(3, 'Machine Learning'),
(4, 'React'),
(5, 'ML'),
(6, 'AI'),
(7, 'Angular'),
(8, 'HTML'),
(9, 'CSS'),
(10, 'JS'),
(11, 'DSA'),
(12, 'PHP');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `user_id` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `registered_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`user_id`, `username`, `email`, `password`, `registered_date`) VALUES
(1, 'savin', 'savin@gmail.com', '$2y$10$3b6aZ3kphH/L.YZ4R30GaeGMOqU4da.fqNUiTiPKzrQ8bEz7hGQ4W', '2024-04-24 11:16:48'),
(2, 'tharani', 'tharani@yahoo.com', '$2y$10$DKXWEgPNelxHu9JnH5/w/uG.e708JXUG7bNzV9O1taKupkFWew6nW', '2024-04-24 11:16:48'),
(3, 'savinr', 'randinu@gmail.com', '$2y$10$Vo7ReHD7IxDcnxHQewotIupuHITuoU6TNg8VpPb5Y/pVy8EOc9Zga', '2024-04-26 10:13:26'),
(4, 'chiran', 'chiran@gmail.com', '$2y$10$PK0DIz4D.dSSIYgESxb52eQHjqLkO0YOb1faJURHZgGV5KsZchMwe', '2024-04-26 10:22:59'),
(5, 'champi', 'champika@gmail.com', '$2y$10$i6eTWC9.bYnEQjc7TshEeeJ/2jjtlspDdjDg.lg920GEUUWP1u8g.', '2024-05-13 12:49:09'),
(6, 'brown', 'brown@gmail.com', '$2y$10$fyTZUCda82Bca79QVNP/Z.qhQW.9C1YRPCUxpr4Ee3i5FvEeebtHW', '2024-05-15 13:00:06'),
(7, 'hasindu', 'hasindu@gmail.com', '$2y$10$.V7zJipmlzaHonauOB1u9.3l1fwaMRIoqf1iXcj9HckgcPUSIirNW', '2024-05-15 13:05:34'),
(8, 'made1', 'made@gmail.com', '$2y$10$LlAgqT8JyjCzfxsXigdxluYSkvkhAkkcCzdNyNpZk/qcvUfJOwSBC', '2024-05-15 13:25:53'),
(9, 'adam2', 'adam@gmail.com', '$2y$10$YeK0iasuQE6zSidVWC3CP.fI7W/b/ajUO3WAH1.LPdi5RD7hqponm', '2024-05-15 13:27:13'),
(10, 'testuser', 'testuser@gmail.com', '$2y$10$8Xb6.jaO47urLcS4eIy.c.cRYn9qdn/aYJwHgvJuqSaCb9WcLCziu', '2024-05-16 13:43:41');

-- --------------------------------------------------------

--
-- Table structure for table `VoteControl`
--

CREATE TABLE `VoteControl` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `answer_id` int(11) NOT NULL,
  `vote_type` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `VoteControl`
--

INSERT INTO `VoteControl` (`id`, `user_id`, `answer_id`, `vote_type`) VALUES
(1, 4, 83, 1),
(2, 4, 82, 1),
(6, 5, 90, 1),
(8, 4, 90, 1),
(16, 10, 90, 1),
(17, 10, 83, -1),
(21, 1, 103, 1),
(22, 1, 83, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Answer`
--
ALTER TABLE `Answer`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `answer_ibfk_1` (`question_id`);

--
-- Indexes for table `Comment`
--
ALTER TABLE `Comment`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `answer_id` (`answer_id`) USING BTREE;

--
-- Indexes for table `Question`
--
ALTER TABLE `Question`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `QuestionTag`
--
ALTER TABLE `QuestionTag`
  ADD PRIMARY KEY (`question_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `Tag`
--
ALTER TABLE `Tag`
  ADD PRIMARY KEY (`tag_id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `VoteControl`
--
ALTER TABLE `VoteControl`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`answer_id`),
  ADD KEY `fk_answer` (`answer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Answer`
--
ALTER TABLE `Answer`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `Comment`
--
ALTER TABLE `Comment`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `Question`
--
ALTER TABLE `Question`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `Tag`
--
ALTER TABLE `Tag`
  MODIFY `tag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `VoteControl`
--
ALTER TABLE `VoteControl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Answer`
--
ALTER TABLE `Answer`
  ADD CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `Question` (`question_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `answer_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `Comment`
--
ALTER TABLE `Comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`answer_id`) REFERENCES `Answer` (`answer_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `Question`
--
ALTER TABLE `Question`
  ADD CONSTRAINT `question_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `QuestionTag`
--
ALTER TABLE `QuestionTag`
  ADD CONSTRAINT `questiontag_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `Question` (`question_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `questiontag_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `Tag` (`tag_id`) ON DELETE CASCADE;

--
-- Constraints for table `VoteControl`
--
ALTER TABLE `VoteControl`
  ADD CONSTRAINT `fk_answer` FOREIGN KEY (`answer_id`) REFERENCES `Answer` (`answer_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
