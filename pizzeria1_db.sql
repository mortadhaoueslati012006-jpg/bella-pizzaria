-- phpMyAdmin SQL Dump
-- Compatible with older MySQL versions (EasyPHP 5.3.5.0)
-- Database: pizzeria1_db

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `pizzeria1_db`
--

CREATE DATABASE IF NOT EXISTS pizzeria1_db;
USE pizzeria1_db;

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'admin', 'admin123', '2025-12-18 09:09:32');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `tel` varchar(20) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `address` text DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`tel`, `nom`, `prenom`, `address`, `password`, `created_at`) VALUES
('123456789', 'Demo', 'Client', '123 Pizza St', 'client123', '2025-12-18 09:09:32'),
('123654789', 'nighaoui', 'melek', 'dd', 'melek', '2025-12-19 19:20:11'),
('22100200', 'benamara', 'myriam', 'soukra', 'mimi', '2025-12-19 18:09:15'),
('28838686', 'nighaoui', 'sarra', 'marsa', 'sarra', '2025-12-19 09:54:07'),
('55123456', 'Ben Salah', 'Ahmed', 'Avenue Habib Bourguiba, Tunis', 'ahmed123', '2025-10-27 07:30:00'),
('55234567', 'Trabelsi', 'Fatma', 'Rue de la Liberte, Ariana', 'fatma123', '2025-10-28 13:20:00'),
('55345678', 'Jebali', 'Mohamed', 'Avenue Mohammed V, La Marsa', 'mohamed123', '2025-11-02 09:15:00'),
('55456789', 'Hadj Ali', 'Leila', 'Rue du Lac, Tunis', 'leila123', '2025-11-05 15:45:00'),
('55567890', 'Karim', 'Youssef', 'Boulevard de France, Carthage', 'youssef123', '2025-11-10 08:30:00'),
('55678901', 'Bouaziz', 'Amira', 'Rue Ibn Khaldoun, Manouba', 'amira123', '2025-11-15 12:20:00'),
('55789012', 'Chakroun', 'Rami', 'Avenue de Carthage, Gammarth', 'rami123', '2025-11-18 10:00:00'),
('55890123', 'Mejri', 'Sonia', 'Rue du Bardo, Tunis', 'sonia123', '2025-11-22 14:30:00'),
('55901234', 'Hamouda', 'Karim', 'Avenue Taieb Mhiri, Soukra', 'karim123', '2025-11-28 09:45:00'),
('56012345', 'Sassi', 'Nadia', 'Rue de Palestine, Ariana', 'nadia123', '2025-12-01 13:15:00'),
('56123456', 'Ferchichi', 'Omar', 'Boulevard 7 Novembre, La Marsa', 'omar123', '2025-12-05 11:30:00'),
('56234567', 'Mansour', 'Hiba', 'Avenue Habib Thameur, Tunis', 'hiba123', '2025-12-10 15:00:00'),
('6594815', 'oueslati', 'mortadha', 'marsa', 'morta', '2025-12-19 17:14:42');

-- --------------------------------------------------------

--
-- Table structure for table `pizzas`
--

CREATE TABLE `pizzas` (
  `id` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(50) DEFAULT 'pizza',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `pizzas`
--

INSERT INTO `pizzas` (`id`, `name`, `price`, `image`, `description`, `category`, `created_at`) VALUES
('15', 'cheesecake', 9.00, 'https://www.oliveandmango.com/new-york-style-cheesecake/', 'Cheesecake New York style', 'dessert', '2025-12-19 09:58:57'),
('Brow', 'Brownie', 6.00, 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400', 'Brownie au chocolat', 'dessert', '2025-12-18 09:09:32'),
('Eau', 'Eau Minerale', 1.25, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400', 'Eau minerale 50cl', 'boisson', '2025-12-18 09:09:32'),
('Fanta', 'Fanta Orange', 3.00, 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400', 'Fanta Orange 33cl', 'boisson', '2025-12-18 09:09:32'),
('Fmr', 'Fruit de Mer', 35.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', 'Fruits de mer delicieux avec crevettes et moules', 'pizza', '2025-12-18 09:09:32'),
('Gela', 'Glace Italienne', 5.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', 'Glace artisanale italienne', 'dessert', '2025-12-18 09:09:32'),
('Jus', 'Jus Orange', 4.00, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', 'Jus orange frais 25cl', 'boisson', '2025-12-18 09:09:32'),
('Mgh', 'Margherita', 22.00, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 'Classique tomate, mozzarella et basilic', 'pizza', '2025-12-18 09:09:32'),
('Nap', 'Napolitaine', 26.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', 'Style italien traditionnel', 'pizza', '2025-12-18 09:09:32'),
('Nep', 'Neptune', 38.00, 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400', 'Tresors de ocean avec garnitures premium', 'pizza', '2025-12-18 09:09:32'),
('PanC', 'Panna Cotta', 7.00, 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400', 'Panna cotta maison', 'dessert', '2025-12-18 09:09:32'),
('Pep', 'Pepperoni', 28.00, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', 'Pizza classique au pepperoni', 'pizza', '2025-12-18 09:09:32'),
('Roy', 'Royale', 30.00, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', 'Jambon, champignons et fromage premium', 'pizza', '2025-12-18 09:09:32'),
('Sprite', 'Sprite', 3.00, 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400', 'Sprite 33cl', 'boisson', '2025-12-18 09:09:32'),
('Tira', 'Tiramisu', 8.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', 'Tiramisu italien authentique', 'dessert', '2025-12-18 09:09:32'),
('Veg', 'Vegetarienne', 24.00, 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=400', 'Legumes frais de saison', 'pizza', '2025-12-18 09:09:32');

-- --------------------------------------------------------

--
-- Table structure for table `promo_codes`
--

CREATE TABLE `promo_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `discount_percentage` int(11) NOT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `promo_codes`
--

INSERT INTO `promo_codes` (`id`, `code`, `discount_percentage`, `active`, `created_at`) VALUES
(1, '1564', 15, 1, '2025-12-18 09:09:32'),
(2, '7681', 10, 1, '2025-12-18 09:09:32'),
(3, '9543', 20, 1, '2025-12-18 09:09:32'),
(4, '6820', 25, 1, '2025-12-18 09:09:32'),
(5, 'WEEKEND20', 20, 1, '2025-12-19 20:17:48');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tel` varchar(20) DEFAULT NULL,
  `items` longtext DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) DEFAULT 'pending',
  `delivery_type` varchar(20) DEFAULT 'pickup',
  `delivery_address` text DEFAULT NULL,
  `promo_code` varchar(10) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `tel` (`tel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `orders`
-- Note: Items column contains JSON data
--

INSERT INTO `orders` (`id`, `tel`, `items`, `total`, `order_date`, `status`, `delivery_type`, `delivery_address`, `promo_code`, `discount_amount`) VALUES
(8, '55123456', 'Margherita x2, Sprite x2', 50.00, '2025-10-27 11:30:00', 'delivered', 'delivery', 'Avenue Habib Bourguiba, Tunis', '', 0.00),
(9, '55234567', 'Pepperoni, Eau Minerale', 29.25, '2025-10-27 17:45:00', 'delivered', 'pickup', '', '', 0.00),
(10, '55123456', 'Royale, Fanta Orange, Tiramisu', 41.00, '2025-10-28 12:15:00', 'delivered', 'delivery', 'Rue de la Liberte, Ariana', '', 0.00),
(11, '55234567', 'Napolitaine x2', 52.00, '2025-10-28 18:30:00', 'delivered', 'pickup', '', '', 0.00),
(12, '55345678', 'Vegetarienne, Jus Orange x2', 32.00, '2025-10-29 11:00:00', 'delivered', 'delivery', 'Avenue Mohammed V, La Marsa', '', 0.00),
(13, '55123456', 'Fruit de Mer, Sprite', 38.00, '2025-10-29 19:15:00', 'delivered', 'pickup', '', '', 0.00),
(14, '55234567', 'Margherita, Pepperoni, Eau Minerale x2', 52.50, '2025-10-30 13:30:00', 'delivered', 'delivery', 'Rue de la Liberte, Ariana', '', 0.00),
(15, '55345678', 'Napolitaine, Brownie', 32.00, '2025-10-30 18:45:00', 'delivered', 'pickup', '', '', 0.00),
(16, '55456789', 'Royale x2, Fanta Orange x2, Glace Italienne x2', 76.00, '2025-10-31 12:00:00', 'delivered', 'delivery', 'Rue du Lac, Tunis', '', 0.00),
(17, '55345678', 'Pepperoni', 28.00, '2025-11-01 11:30:00', 'delivered', 'pickup', '', '', 0.00),
(18, '55456789', 'Margherita x2', 44.00, '2025-11-02 17:15:00', 'delivered', 'delivery', 'Rue du Lac, Tunis', '', 0.00),
(19, '55567890', 'Napolitaine, Sprite', 29.00, '2025-11-03 12:45:00', 'delivered', 'pickup', '', '', 0.00),
(20, '55234567', 'Royale, Tiramisu', 38.00, '2025-11-04 18:30:00', 'delivered', 'delivery', 'Rue de la Liberte, Ariana', '', 0.00),
(21, '55345678', 'Vegetarienne', 24.00, '2025-11-05 11:00:00', 'delivered', 'pickup', '', '', 0.00),
(22, '55456789', 'Fruit de Mer, Eau Minerale x2', 37.50, '2025-11-06 19:15:00', 'delivered', 'delivery', 'Rue du Lac, Tunis', '', 0.00),
(23, '55678901', 'Pepperoni x2', 56.00, '2025-11-07 13:30:00', 'delivered', 'pickup', '', '', 0.00),
(24, '55123456', 'Margherita, Jus Orange', 26.00, '2025-11-08 12:00:00', 'delivered', 'delivery', 'Avenue Habib Bourguiba, Tunis', '', 0.00),
(25, '55567890', 'Napolitaine, Brownie', 32.00, '2025-11-09 17:45:00', 'delivered', 'pickup', '', '', 0.00),
(26, '55234567', 'Royale', 25.50, '2025-11-10 11:30:00', 'delivered', 'delivery', 'Rue de la Liberte, Ariana', '1564', 4.50),
(27, '55678901', 'Pepperoni, Fanta Orange', 31.00, '2025-11-11 18:15:00', 'delivered', 'pickup', '', '', 0.00),
(28, '55345678', 'Vegetarienne x2', 48.00, '2025-11-12 12:00:00', 'delivered', 'delivery', 'Avenue Mohammed V, La Marsa', '', 0.00),
(29, '55456789', 'Napolitaine, Sprite', 29.00, '2025-11-13 19:30:00', 'delivered', 'pickup', '', '', 0.00),
(30, '55789012', 'Margherita, Glace Italienne', 27.00, '2025-11-14 13:45:00', 'delivered', 'delivery', 'Avenue de Carthage, Gammarth', '', 0.00),
(31, '55567890', 'Royale', 27.00, '2025-11-15 11:15:00', 'delivered', 'pickup', '', '7681', 3.00),
(32, '55123456', 'Pepperoni x2', 56.00, '2025-11-16 17:00:00', 'delivered', 'delivery', 'Avenue Habib Bourguiba, Tunis', '', 0.00),
(33, '55678901', 'Napolitaine, Eau Minerale', 27.25, '2025-11-17 12:30:00', 'delivered', 'pickup', '', '', 0.00),
(34, '55890123', 'Fruit de Mer, Tiramisu', 43.00, '2025-11-18 18:45:00', 'delivered', 'delivery', 'Rue du Bardo, Tunis', '', 0.00),
(35, '55234567', 'Margherita', 22.00, '2025-11-19 11:00:00', 'delivered', 'pickup', '', '', 0.00),
(36, '55345678', 'Vegetarienne, Jus Orange', 28.00, '2025-11-20 19:15:00', 'delivered', 'delivery', 'Avenue Mohammed V, La Marsa', '', 0.00),
(37, '55789012', 'Royale, Fanta Orange', 33.00, '2025-11-21 13:30:00', 'delivered', 'pickup', '', '', 0.00),
(38, '55456789', 'Pepperoni', 22.40, '2025-11-22 12:00:00', 'delivered', 'delivery', 'Rue du Lac, Tunis', '9543', 5.60),
(39, '55567890', 'Napolitaine x2', 52.00, '2025-11-23 17:45:00', 'delivered', 'pickup', '', '', 0.00),
(40, '55890123', 'Margherita, Brownie', 28.00, '2025-11-24 11:30:00', 'delivered', 'delivery', 'Rue du Bardo, Tunis', '', 0.00),
(41, '55678901', 'Royale', 30.00, '2025-11-25 18:15:00', 'delivered', 'pickup', '', '', 0.00),
(42, '55123456', 'Vegetarienne, Sprite', 27.00, '2025-11-26 12:00:00', 'delivered', 'delivery', 'Avenue Habib Bourguiba, Tunis', '', 0.00),
(43, '55234567', 'Napolitaine, Glace Italienne', 31.00, '2025-11-27 19:30:00', 'delivered', 'pickup', '', '', 0.00),
(44, '55901234', 'Pepperoni x2, Eau Minerale x2', 58.50, '2025-11-28 13:45:00', 'delivered', 'delivery', 'Avenue Taieb Mhiri, Soukra', '', 0.00),
(45, '55345678', 'Margherita', 22.00, '2025-11-29 11:15:00', 'delivered', 'pickup', '', '', 0.00),
(46, '55456789', 'Royale, Tiramisu', 38.00, '2025-11-30 17:30:00', 'delivered', 'delivery', 'Rue du Lac, Tunis', '', 0.00);

--
-- Add foreign key constraint
--
ALTER TABLE `orders`
ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`tel`) REFERENCES `clients` (`tel`);