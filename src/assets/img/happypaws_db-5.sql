-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2023 at 07:14 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `happypaws_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `token_expiration` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `fname`, `lname`, `email`, `password`, `token`, `token_expiration`) VALUES
(1, 'harvey', 'agrabio', 'agrabioharvey@gmail.com', '$2y$10$NmM5MDNhMzFjYWYxZTc1NO6s1/Q9XLLl5MWv2IQaoqtir/WXJd7zi', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.WhwDib_q8hHNgSiKmMx0E7FfRKd_y997VOYu7ozVvo8', '2023-12-02 11:01:23');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` int(11) DEFAULT NULL,
  `pet_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `date`, `time`, `status`, `created_at`, `user_id`, `pet_id`) VALUES
(215, '2023-12-30', '07:00:00', 'accepted', '2023-11-30 16:52:41', 26, 15),
(217, '2023-12-10', '12:00:00', 'accepted', '2023-12-01 04:20:17', 26, 14),
(220, '2023-12-10', '10:00:00', 'pending', '2023-11-30 17:10:17', 26, 16);

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` int(11) NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1 = "published" 0 = "unpublished"',
  `date_created` date DEFAULT NULL,
  `date_modified` date DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `thumbnail`, `title`, `content`, `status`, `date_created`, `date_modified`, `admin_id`) VALUES
(1, 'thumbnail1.jpg', 'Blog Post 1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.', 0, '2023-11-24', '2023-11-24', NULL),
(2, 'thumbnail1.jpg', 'Blog Post 2', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 1, '2023-11-25', '2023-11-25', NULL),
(3, 'thumbnail1.jpg', 'Blog Post 3', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 1, '2023-11-26', '2023-11-26', NULL),
(4, 'thumbnail1.jpg', 'Blog Post 4', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 1, '2023-11-27', '2023-11-27', NULL),
(5, 'thumbnail1.jpg', 'Blog Post 5', 'Suspendisse potenti. Vivamus vehicula vestibulum mauris, nec commodo libero pharetra eu.', 0, '2023-11-28', '2023-11-28', NULL),
(6, 'thumbnail1.jpg', 'Blog 6', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 1, '2023-11-24', '2023-11-24', NULL),
(7, 'thumbnail1.jpg', 'Blog 7', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 1, '2023-11-25', '2023-11-25', NULL),
(8, 'thumbnail1.jpg', 'Blog 8', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 0, '2023-11-26', '2023-11-26', NULL),
(9, 'thumbnail1.jpg', 'Blog 9', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 0, '2023-11-27', '2023-11-27', NULL),
(10, 'thumbnail1.jpg', 'Blog 10', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 0, '2023-11-28', '2023-11-28', NULL),
(11, 'thumbnail1.jpg', 'Blog 11', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 0, '2023-11-29', '2023-11-29', NULL),
(12, 'thumbnail1.jpg', 'Blog 12', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 0, '2023-11-30', '2023-11-30', NULL),
(13, 'thumbnail1.jpg', 'Blog 13', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 0, '2023-12-01', '2023-12-01', NULL),
(14, 'thumbnail1.jpg', 'Blog 14', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 0, '2023-12-02', '2023-12-02', NULL),
(15, 'thumbnail1.jpg', 'Blog 15', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 0, '2023-12-03', '2023-12-03', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `upload_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `image`, `description`, `upload_date`, `admin_id`) VALUES
(1, 'image1.jpg', 'Description for image 1', '2023-11-24 12:42:26', NULL),
(2, 'image1.jpg', 'Description for image 2', '2023-11-24 12:42:26', NULL),
(3, 'image1.jpg', 'Description for image 3', '2023-11-24 12:42:26', NULL),
(4, 'image1.jpg', 'Description for image 4', '2023-11-24 12:42:26', NULL),
(5, 'image1.jpg', 'Description for image 5', '2023-11-24 12:42:26', NULL),
(6, 'image1.jpg', 'Description for image 6', '2023-11-24 12:42:26', NULL),
(7, 'image1.jpg', 'Description for image 7', '2023-11-24 12:42:26', NULL),
(8, 'image1.jpg', 'Description for image 8', '2023-11-24 12:42:26', NULL),
(9, 'image1.jpg', 'Description for image 9', '2023-11-24 12:42:26', NULL),
(10, 'image1.jpg', 'Description for image 10', '2023-11-24 12:42:26', NULL),
(11, 'image1.jpg', 'Description for image 11', '2023-11-24 12:42:26', NULL),
(12, 'image1.jpg', 'Description for image 12', '2023-11-24 12:42:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pets`
--

CREATE TABLE `pets` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `breed` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'pet_thumbnail.jpg',
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pets`
--

INSERT INTO `pets` (`id`, `name`, `type`, `breed`, `age`, `image`, `user_id`) VALUES
(14, 'Boogie', 'Dog', 'German Shepherd', 1, 'pet_thumbnail.jpg', 26),
(15, 'Lukrie', 'Dog', 'Mini Pincher', 6, 'pet_thumbnail.jpg', 26),
(16, 'Maki', 'Dog', 'aso', 2, 'pet_thumbnail.jpg', 26);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `contact_no` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(4) DEFAULT 0,
  `token_expiration` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fname`, `lname`, `contact_no`, `address`, `email`, `password`, `token`, `is_verified`, `token_expiration`) VALUES
(26, 'John Harvey', 'Agrabio', '09133144464132', 'aasdasdsadsa', 'agrabioharvey4@gmail.com', '$2y$10$MjgyYmU5ZTFmNzcyMTRmZOdSRitwt0MoK9bJOt4F2G1IfpFqODJ2i', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyNn0.4MoiPfRIVB-sroN9IWl2j9c4leagPA9xM1l8NN2sRLE', 1, '2023-12-01 10:40:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `pet_id` (`pet_id`);

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=221;

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `pets`
--
ALTER TABLE `pets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`);

--
-- Constraints for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD CONSTRAINT `blog_posts_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`);

--
-- Constraints for table `gallery`
--
ALTER TABLE `gallery`
  ADD CONSTRAINT `gallery_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`);

--
-- Constraints for table `pets`
--
ALTER TABLE `pets`
  ADD CONSTRAINT `pets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
