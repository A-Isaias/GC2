-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-01-2024 a las 17:22:29
-- Versión del servidor: 8.0.31
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gamecity`
--
CREATE DATABASE IF NOT EXISTS `gamecity` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE `gamecity`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colecciones`
--

CREATE TABLE `colecciones` (
  `id` int NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `colecciones`
--

INSERT INTO `colecciones` (`id`, `nombre`) VALUES
(2, 'Anderson'),
(6, 'Argentina'),
(10, 'Ariel en Moto'),
(11, 'choto'),
(3, 'ISAIAS'),
(7, 'Justice League of America'),
(9, 'Majes'),
(12, 'minotauro'),
(4, 'Pelado'),
(8, 'Super Javillo'),
(1, 'Superman'),
(5, 'The Amazing Spiderman');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comics`
--

CREATE TABLE `comics` (
  `id` int NOT NULL,
  `portada` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `numero` int NOT NULL,
  `editorial` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `coleccion` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `fecha_ingreso` date NOT NULL,
  `novedad` enum('si','no') COLLATE utf8mb4_spanish_ci NOT NULL DEFAULT 'si',
  `costo` decimal(10,2) NOT NULL,
  `observaciones` text COLLATE utf8mb4_spanish_ci,
  `coleccion_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `comics`
--

INSERT INTO `comics` (`id`, `portada`, `nombre`, `numero`, `editorial`, `coleccion`, `fecha_ingreso`, `novedad`, `costo`, `observaciones`, `coleccion_id`) VALUES
(4, 'imagen10.jpg', 'Superman Vs Flash', 2, 'Magenta', 'Superman', '2024-05-01', 'si', 1200.00, 'peql', 1),
(5, 'imagen03.jpg', 'Anderson vs los pozos mendocinenses', 145, 'Magenta', 'Anderson', '2024-01-05', 'si', 1200.00, 'asdasd', 2),
(6, 'imagen18.jpg', 'Anderson Vs Batman', 54, 'Magenta y Cyan', 'Anderson', '2024-01-06', 'si', 1200.00, 'peql', 2),
(7, 'imagen19.jpg', 'Anderson Vs Flash', 22, 'Magenta y Cyan', 'Anderson', '2024-06-01', 'si', 1200.00, 'peql', 2),
(8, 'imagen15.jpg', 'Isaias Chot Raid Vs Superman', 354, 'Cyan', 'ISAIAS', '2024-01-06', 'si', 1200.00, 'peql', 3),
(9, '1704654793689-imagen11.jpg', 'La fuga del pelado con trenzas', 54, 'Cyan', 'Pelado', '2024-01-07', 'si', 3500.00, 'Ultimo Episodio del pelado con trenzas', 4),
(10, '1704657973008-1704543427665-imagen23.jpg', 'Justice League of America', 1, 'Ivrea', 'Justice League of America', '2024-07-01', 'si', 2800.00, 'Numero 1 de la JLA', 7),
(11, '1704658487784-imagen21.jpg', 'The Amazing Spiderman', 58, 'Ivrea', 'The Amazing Spiderman', '2024-01-07', 'si', 4000.00, 'Podra Peter detener a Miss Sue', 5),
(12, '1704659997090-imagen01.jpg', 'Mingo y Anibal contra los fantasmas', 1, 'Ivrea', 'Argentina', '2024-01-07', 'si', 3000.00, 'La primera aventura de nuestros heroes Nacionales', 6),
(13, '1704660364881-imagen06.jpg', 'Super Javillo en Cucarai ', 2, 'Cyan', 'Super Javillo', '2024-01-07', 'si', 1800.00, 'Javillo en su cucarai se enfrenta a los bolivianos por el dominio del Vodka Nicolai con jugo tang', 8),
(14, '1704661736906-imagen03.jpg', 'Majes en Moto', 1, 'Buenaventura', 'Majes', '2024-01-07', 'si', 3500.00, 'Epasdlñasdñlasasslñd añldkañdkñlaksdñld asdñl asd', 9),
(24, '1704926686780-1704543427665-imagen23.jpg', 'Ariel en Moto Vs La Ruta 40', 1, 'Cyan', 'Ariel en Moto', '2024-01-10', 'si', 3000.00, 'indifijaijasd', 10),
(25, '1704926825408-1704509903716-1704498089857-imagen12.jpg', 'choto', 1, 'choto', 'choto', '2024-01-10', 'si', 3000.00, 'choto', 11),
(26, '1704988387259-1704543375280-imagen05.jpg', 'asdasdasd', 1, 'pocho', 'minotauro', '2024-01-11', 'si', 2000.00, 'asda', 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `mail` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `apellido` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `fecha_nac` date DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `ciudad` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `tipo` enum('user','admin') COLLATE utf8mb4_spanish_ci DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `mail`, `password`, `nombre`, `apellido`, `fecha_nac`, `telefono`, `direccion`, `ciudad`, `tipo`) VALUES
(1, 'ariel.r.isaias@gmail.com', '$2a$10$mdp/oEh9ONQHUSj.yY0pyuKlD8gT00uevICSOWVGkAE99s8c6KHqi', 'Ariel Reinaldo', 'Isaias', '1975-03-17', '3364338670', 'Menendez 572', 'San Nicolás', 'admin'),
(30, 'ariel@ariel.com', '$2a$08$gsqcy4T1GY5gU49uvmN4Z.sLYAFH4NBBoUpqDZDAyzVSZY6ITR15e', 'Ariel ', 'Isaias', '2001-01-01', '1234', 'de la rua', 'San Nicolás', 'user'),
(31, 'isaias@isaias.com', '$2a$08$4/5sF8eO3QURG/k.7ri.PeRgHjphSy5WfFnBl3/Nfy9HPjZOgnLB.', 'Isaias', 'Isaias', '2011-01-01', '1234', '1234', 'menem', 'user'),
(32, 'octaviosalbador@gmail.com', '$2a$08$AbEF5ei.RizcmlScA.e4Mu13UeEdSGlv6kuOVCr/POLqZeTN8k7I2', 'Octavio', 'Salbador', '1972-02-19', '1234', '1234', 'Menem', 'user'),
(33, 'Rabanito@rabanito.com', '$2a$08$XpprojfPxQslzd9uvKTn2.OAA9fQuMTE.Bh1IueczBC8I1J.EXV2q', 'Rabanito', 'Isaias', '2001-01-01', '1234', '1234', '1234', 'user');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_collections`
--

CREATE TABLE `user_collections` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `collection` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `user_collections`
--

INSERT INTO `user_collections` (`id`, `user_id`, `collection`) VALUES
(3, 1, 'Anderson'),
(7, 1, 'choto'),
(4, 1, 'Pelado'),
(2, 1, 'Superman'),
(5, 31, 'Anderson');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `colecciones`
--
ALTER TABLE `colecciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `comics`
--
ALTER TABLE `comics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_coleccion` (`coleccion_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- Indices de la tabla `user_collections`
--
ALTER TABLE `user_collections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_collection` (`user_id`,`collection`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `colecciones`
--
ALTER TABLE `colecciones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `comics`
--
ALTER TABLE `comics`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `user_collections`
--
ALTER TABLE `user_collections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `user_collections`
--
ALTER TABLE `user_collections`
  ADD CONSTRAINT `user_collections_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
