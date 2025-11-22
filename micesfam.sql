-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: micesfam
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administradores_administrador`
--

DROP TABLE IF EXISTS `administradores_administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administradores_administrador` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cargo` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `cesfam_id` bigint DEFAULT NULL,
  `usuario_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  KEY `administradores_admi_cesfam_id_70fdf244_fk_pacientes` (`cesfam_id`),
  CONSTRAINT `administradores_admi_cesfam_id_70fdf244_fk_pacientes` FOREIGN KEY (`cesfam_id`) REFERENCES `pacientes_cesfam` (`id`),
  CONSTRAINT `administradores_admi_usuario_id_eb527da2_fk_usuarios_` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administradores_administrador`
--

LOCK TABLES `administradores_administrador` WRITE;
/*!40000 ALTER TABLE `administradores_administrador` DISABLE KEYS */;
INSERT INTO `administradores_administrador` VALUES (1,'Administrador','2025-11-17 00:29:35.889860','2025-11-17 00:29:35.889860',1,1);
/*!40000 ALTER TABLE `administradores_administrador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add Usuario',6,'add_usuario'),(22,'Can change Usuario',6,'change_usuario'),(23,'Can delete Usuario',6,'delete_usuario'),(24,'Can view Usuario',6,'view_usuario'),(25,'Can add CESFAM',7,'add_cesfam'),(26,'Can change CESFAM',7,'change_cesfam'),(27,'Can delete CESFAM',7,'delete_cesfam'),(28,'Can view CESFAM',7,'view_cesfam'),(29,'Can add Paciente',8,'add_paciente'),(30,'Can change Paciente',8,'change_paciente'),(31,'Can delete Paciente',8,'delete_paciente'),(32,'Can view Paciente',8,'view_paciente'),(33,'Can add Disponibilidad Médico',9,'add_disponibilidadmedico'),(34,'Can change Disponibilidad Médico',9,'change_disponibilidadmedico'),(35,'Can delete Disponibilidad Médico',9,'delete_disponibilidadmedico'),(36,'Can view Disponibilidad Médico',9,'view_disponibilidadmedico'),(37,'Can add Médico',10,'add_medico'),(38,'Can change Médico',10,'change_medico'),(39,'Can delete Médico',10,'delete_medico'),(40,'Can view Médico',10,'view_medico'),(41,'Can add Administrador',11,'add_administrador'),(42,'Can change Administrador',11,'change_administrador'),(43,'Can delete Administrador',11,'delete_administrador'),(44,'Can view Administrador',11,'view_administrador'),(45,'Can add Cita',12,'add_cita'),(46,'Can change Cita',12,'change_cita'),(47,'Can delete Cita',12,'delete_cita'),(48,'Can view Cita',12,'view_cita'),(49,'Can add Historial Clínico',13,'add_historialclinico'),(50,'Can change Historial Clínico',13,'change_historialclinico'),(51,'Can delete Historial Clínico',13,'delete_historialclinico'),(52,'Can view Historial Clínico',13,'view_historialclinico'),(53,'Can add Diagnóstico',14,'add_diagnostico'),(54,'Can change Diagnóstico',14,'change_diagnostico'),(55,'Can delete Diagnóstico',14,'delete_diagnostico'),(56,'Can view Diagnóstico',14,'view_diagnostico'),(57,'Can add Licencia Médica',15,'add_licenciamedica'),(58,'Can change Licencia Médica',15,'change_licenciamedica'),(59,'Can delete Licencia Médica',15,'delete_licenciamedica'),(60,'Can view Licencia Médica',15,'view_licenciamedica'),(61,'Can add Receta',16,'add_receta'),(62,'Can change Receta',16,'change_receta'),(63,'Can delete Receta',16,'delete_receta'),(64,'Can view Receta',16,'view_receta'),(65,'Can add Reporte',17,'add_reporte'),(66,'Can change Reporte',17,'change_reporte'),(67,'Can delete Reporte',17,'delete_reporte'),(68,'Can view Reporte',17,'view_reporte'),(69,'Can add Turno',18,'add_turno'),(70,'Can change Turno',18,'change_turno'),(71,'Can delete Turno',18,'delete_turno'),(72,'Can view Turno',18,'view_turno'),(73,'Can add Solicitud de Cambio de Turno',19,'add_solicitudcambioturno'),(74,'Can change Solicitud de Cambio de Turno',19,'change_solicitudcambioturno'),(75,'Can delete Solicitud de Cambio de Turno',19,'delete_solicitudcambioturno'),(76,'Can view Solicitud de Cambio de Turno',19,'view_solicitudcambioturno');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `citas_cita`
--

DROP TABLE IF EXISTS `citas_cita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas_cita` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `hora` time(6) NOT NULL,
  `motivo` longtext NOT NULL,
  `status` varchar(20) NOT NULL,
  `observaciones` longtext,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `medico_id` bigint NOT NULL,
  `paciente_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `citas_cita_medico_id_fecha_hora_c17105fd_uniq` (`medico_id`,`fecha`,`hora`),
  KEY `citas_cita_paciente_id_6494b869_fk_pacientes_paciente_id` (`paciente_id`),
  CONSTRAINT `citas_cita_medico_id_aadcbe06_fk_medicos_medico_id` FOREIGN KEY (`medico_id`) REFERENCES `medicos_medico` (`id`),
  CONSTRAINT `citas_cita_paciente_id_6494b869_fk_pacientes_paciente_id` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes_paciente` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas_cita`
--

LOCK TABLES `citas_cita` WRITE;
/*!40000 ALTER TABLE `citas_cita` DISABLE KEYS */;
/*!40000 ALTER TABLE `citas_cita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `citas_historialclinico`
--

DROP TABLE IF EXISTS `citas_historialclinico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas_historialclinico` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `diagnostico` longtext NOT NULL,
  `codigo_cie10` varchar(10) DEFAULT NULL,
  `tratamiento` longtext NOT NULL,
  `observaciones` longtext,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `cita_id` bigint NOT NULL,
  `medico_id` bigint NOT NULL,
  `paciente_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cita_id` (`cita_id`),
  KEY `citas_historialclinico_medico_id_d3016773_fk_medicos_medico_id` (`medico_id`),
  KEY `citas_historialclini_paciente_id_e8187cf3_fk_pacientes` (`paciente_id`),
  CONSTRAINT `citas_historialclini_paciente_id_e8187cf3_fk_pacientes` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes_paciente` (`id`),
  CONSTRAINT `citas_historialclinico_cita_id_40a8f353_fk_citas_cita_id` FOREIGN KEY (`cita_id`) REFERENCES `citas_cita` (`id`),
  CONSTRAINT `citas_historialclinico_medico_id_d3016773_fk_medicos_medico_id` FOREIGN KEY (`medico_id`) REFERENCES `medicos_medico` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas_historialclinico`
--

LOCK TABLES `citas_historialclinico` WRITE;
/*!40000 ALTER TABLE `citas_historialclinico` DISABLE KEYS */;
/*!40000 ALTER TABLE `citas_historialclinico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_usuarios_usuario_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_usuarios_usuario_id` FOREIGN KEY (`user_id`) REFERENCES `usuarios_usuario` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2025-11-17 00:27:34.316213','1','CESFAM Renca',1,'[{\"added\": {}}]',7,1),(2,'2025-11-17 00:28:26.372186','2','CESFAM Juan Antonio Rios',1,'[{\"added\": {}}]',7,1),(3,'2025-11-17 00:29:25.550234','3','CESFAM Garín',1,'[{\"added\": {}}]',7,1),(4,'2025-11-17 00:29:35.891451','1','Admin: Equipo7 DuocUC',1,'[{\"added\": {}}]',11,1),(5,'2025-11-19 22:14:25.570989','1','Equipo7 DuocUC',2,'[{\"changed\": {\"fields\": [\"Celular\", \"Role\"]}}]',6,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(11,'administradores','administrador'),(3,'auth','group'),(2,'auth','permission'),(12,'citas','cita'),(13,'citas','historialclinico'),(4,'contenttypes','contenttype'),(14,'documentos','diagnostico'),(15,'documentos','licenciamedica'),(16,'documentos','receta'),(17,'documentos','reporte'),(9,'medicos','disponibilidadmedico'),(10,'medicos','medico'),(7,'pacientes','cesfam'),(8,'pacientes','paciente'),(5,'sessions','session'),(19,'turnos','solicitudcambioturno'),(18,'turnos','turno'),(6,'usuarios','usuario');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-11-17 00:14:06.930555'),(2,'contenttypes','0002_remove_content_type_name','2025-11-17 00:14:07.135457'),(3,'auth','0001_initial','2025-11-17 00:14:07.655535'),(4,'auth','0002_alter_permission_name_max_length','2025-11-17 00:14:07.766040'),(5,'auth','0003_alter_user_email_max_length','2025-11-17 00:14:07.776524'),(6,'auth','0004_alter_user_username_opts','2025-11-17 00:14:07.786544'),(7,'auth','0005_alter_user_last_login_null','2025-11-17 00:14:07.797099'),(8,'auth','0006_require_contenttypes_0002','2025-11-17 00:14:07.803937'),(9,'auth','0007_alter_validators_add_error_messages','2025-11-17 00:14:07.813236'),(10,'auth','0008_alter_user_username_max_length','2025-11-17 00:14:07.817316'),(11,'auth','0009_alter_user_last_name_max_length','2025-11-17 00:14:07.833009'),(12,'auth','0010_alter_group_name_max_length','2025-11-17 00:14:07.855485'),(13,'auth','0011_update_proxy_permissions','2025-11-17 00:14:07.869585'),(14,'auth','0012_alter_user_first_name_max_length','2025-11-17 00:14:07.879928'),(15,'usuarios','0001_initial','2025-11-17 00:14:08.465450'),(16,'admin','0001_initial','2025-11-17 00:14:08.730867'),(17,'admin','0002_logentry_remove_auto_add','2025-11-17 00:14:08.745628'),(18,'admin','0003_logentry_add_action_flag_choices','2025-11-17 00:14:08.758159'),(19,'pacientes','0001_initial','2025-11-17 00:14:08.944110'),(20,'administradores','0001_initial','2025-11-17 00:14:08.985705'),(21,'administradores','0002_initial','2025-11-17 00:14:09.106324'),(22,'administradores','0003_initial','2025-11-17 00:14:09.230322'),(23,'medicos','0001_initial','2025-11-17 00:14:09.331240'),(24,'citas','0001_initial','2025-11-17 00:14:09.535433'),(25,'citas','0002_initial','2025-11-17 00:14:09.658801'),(26,'citas','0003_initial','2025-11-17 00:14:10.025576'),(27,'documentos','0001_initial','2025-11-17 00:14:10.178645'),(28,'documentos','0002_initial','2025-11-17 00:14:10.413515'),(29,'documentos','0003_initial','2025-11-17 00:14:10.849298'),(30,'medicos','0002_initial','2025-11-17 00:14:10.930465'),(31,'medicos','0003_initial','2025-11-17 00:14:11.085688'),(32,'pacientes','0002_initial','2025-11-17 00:14:11.190986'),(33,'sessions','0001_initial','2025-11-17 00:14:11.226579'),(34,'turnos','0001_initial','2025-11-17 00:14:11.435392'),(35,'medicos','0004_alter_medico_rut_profesional','2025-11-21 16:57:24.397121');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('njhffsnvcq5yj32ioinhrm4gpibmpx45','.eJxVjEsOAiEQBe_C2hA-zQAu3XsG0t2AjBommc_KeHedZBa6fVX1XiLhtra0LWVOYxZnocXpdyPkR-k7yHfst0ny1Nd5JLkr8qCLvE65PC-H-3fQcGnfmr0rqEzU0VtTOFqnPFmjdOAhm1DBggcYQiTwxAYtQUVVi2IyDI7E-wO9nTdm:1vKn1l:6DJrzyjwtU2VQwGfJfGUM5wsqvbhfTy9M-agyt0AlCA','2025-12-01 00:23:29.016377');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentos_diagnostico`
--

DROP TABLE IF EXISTS `documentos_diagnostico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentos_diagnostico` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `diagnostico` longtext NOT NULL,
  `codigo_cie10` varchar(10) NOT NULL,
  `observaciones` longtext,
  `archivo` varchar(100) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `cita_id` bigint DEFAULT NULL,
  `medico_id` bigint NOT NULL,
  `paciente_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `documentos_diagnostico_cita_id_c848eaab_fk_citas_cita_id` (`cita_id`),
  KEY `documentos_diagnostico_medico_id_b602df49_fk_medicos_medico_id` (`medico_id`),
  KEY `documentos_diagnosti_paciente_id_ebf1023a_fk_pacientes` (`paciente_id`),
  CONSTRAINT `documentos_diagnosti_paciente_id_ebf1023a_fk_pacientes` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes_paciente` (`id`),
  CONSTRAINT `documentos_diagnostico_cita_id_c848eaab_fk_citas_cita_id` FOREIGN KEY (`cita_id`) REFERENCES `citas_cita` (`id`),
  CONSTRAINT `documentos_diagnostico_medico_id_b602df49_fk_medicos_medico_id` FOREIGN KEY (`medico_id`) REFERENCES `medicos_medico` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentos_diagnostico`
--

LOCK TABLES `documentos_diagnostico` WRITE;
/*!40000 ALTER TABLE `documentos_diagnostico` DISABLE KEYS */;
/*!40000 ALTER TABLE `documentos_diagnostico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentos_licenciamedica`
--

DROP TABLE IF EXISTS `documentos_licenciamedica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentos_licenciamedica` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tipo` varchar(20) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `dias_reposo` int NOT NULL,
  `diagnostico` longtext NOT NULL,
  `archivo` varchar(100) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `cita_id` bigint DEFAULT NULL,
  `medico_id` bigint NOT NULL,
  `paciente_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `documentos_licenciamedica_cita_id_6c2b3ddc_fk_citas_cita_id` (`cita_id`),
  KEY `documentos_licenciam_medico_id_dc7b1198_fk_medicos_m` (`medico_id`),
  KEY `documentos_licenciam_paciente_id_d5c71339_fk_pacientes` (`paciente_id`),
  CONSTRAINT `documentos_licenciam_medico_id_dc7b1198_fk_medicos_m` FOREIGN KEY (`medico_id`) REFERENCES `medicos_medico` (`id`),
  CONSTRAINT `documentos_licenciam_paciente_id_d5c71339_fk_pacientes` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes_paciente` (`id`),
  CONSTRAINT `documentos_licenciamedica_cita_id_6c2b3ddc_fk_citas_cita_id` FOREIGN KEY (`cita_id`) REFERENCES `citas_cita` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentos_licenciamedica`
--

LOCK TABLES `documentos_licenciamedica` WRITE;
/*!40000 ALTER TABLE `documentos_licenciamedica` DISABLE KEYS */;
/*!40000 ALTER TABLE `documentos_licenciamedica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentos_receta`
--

DROP TABLE IF EXISTS `documentos_receta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentos_receta` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `medicamento` varchar(200) NOT NULL,
  `dosis` varchar(100) NOT NULL,
  `frecuencia` varchar(100) NOT NULL,
  `duracion` varchar(100) NOT NULL,
  `indicaciones` longtext NOT NULL,
  `archivo` varchar(100) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `cita_id` bigint DEFAULT NULL,
  `medico_id` bigint NOT NULL,
  `paciente_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `documentos_receta_cita_id_b9646646_fk_citas_cita_id` (`cita_id`),
  KEY `documentos_receta_medico_id_e52ad735_fk_medicos_medico_id` (`medico_id`),
  KEY `documentos_receta_paciente_id_6e5ad0e9_fk_pacientes_paciente_id` (`paciente_id`),
  CONSTRAINT `documentos_receta_cita_id_b9646646_fk_citas_cita_id` FOREIGN KEY (`cita_id`) REFERENCES `citas_cita` (`id`),
  CONSTRAINT `documentos_receta_medico_id_e52ad735_fk_medicos_medico_id` FOREIGN KEY (`medico_id`) REFERENCES `medicos_medico` (`id`),
  CONSTRAINT `documentos_receta_paciente_id_6e5ad0e9_fk_pacientes_paciente_id` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes_paciente` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentos_receta`
--

LOCK TABLES `documentos_receta` WRITE;
/*!40000 ALTER TABLE `documentos_receta` DISABLE KEYS */;
/*!40000 ALTER TABLE `documentos_receta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentos_reporte`
--

DROP TABLE IF EXISTS `documentos_reporte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentos_reporte` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) NOT NULL,
  `descripcion` longtext NOT NULL,
  `archivo` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `medico_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `documentos_reporte_medico_id_96e999e3_fk_medicos_medico_id` (`medico_id`),
  CONSTRAINT `documentos_reporte_medico_id_96e999e3_fk_medicos_medico_id` FOREIGN KEY (`medico_id`) REFERENCES `medicos_medico` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentos_reporte`
--

LOCK TABLES `documentos_reporte` WRITE;
/*!40000 ALTER TABLE `documentos_reporte` DISABLE KEYS */;
/*!40000 ALTER TABLE `documentos_reporte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicos_disponibilidadmedico`
--

DROP TABLE IF EXISTS `medicos_disponibilidadmedico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicos_disponibilidadmedico` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `dia_semana` int NOT NULL,
  `hora_inicio` time(6) NOT NULL,
  `hora_fin` time(6) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `medico_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `medicos_disponibilidadme_medico_id_dia_semana_hor_4b39e2e0_uniq` (`medico_id`,`dia_semana`,`hora_inicio`),
  CONSTRAINT `medicos_disponibilid_medico_id_788af39a_fk_medicos_m` FOREIGN KEY (`medico_id`) REFERENCES `medicos_medico` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicos_disponibilidadmedico`
--

LOCK TABLES `medicos_disponibilidadmedico` WRITE;
/*!40000 ALTER TABLE `medicos_disponibilidadmedico` DISABLE KEYS */;
/*!40000 ALTER TABLE `medicos_disponibilidadmedico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicos_medico`
--

DROP TABLE IF EXISTS `medicos_medico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicos_medico` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `especialidad` varchar(50) NOT NULL,
  `rut_profesional` varchar(50) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `cesfam_id` bigint DEFAULT NULL,
  `usuario_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rut_profesional` (`rut_profesional`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  KEY `medicos_medico_cesfam_id_e7807dd1_fk_pacientes_cesfam_id` (`cesfam_id`),
  CONSTRAINT `medicos_medico_cesfam_id_e7807dd1_fk_pacientes_cesfam_id` FOREIGN KEY (`cesfam_id`) REFERENCES `pacientes_cesfam` (`id`),
  CONSTRAINT `medicos_medico_usuario_id_734037a5_fk_usuarios_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicos_medico`
--

LOCK TABLES `medicos_medico` WRITE;
/*!40000 ALTER TABLE `medicos_medico` DISABLE KEYS */;
INSERT INTO `medicos_medico` VALUES (1,'medicina_general','22222222','2025-11-20 00:36:41.414113','2025-11-20 00:36:41.414113',1,5),(2,'medicina_general','21349636-0','2025-11-20 01:08:41.754209','2025-11-20 01:08:41.754209',1,6);
/*!40000 ALTER TABLE `medicos_medico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes_cesfam`
--

DROP TABLE IF EXISTS `pacientes_cesfam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes_cesfam` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `direccion` varchar(300) NOT NULL,
  `comuna` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `latitud` decimal(10,7) DEFAULT NULL,
  `longitud` decimal(10,7) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes_cesfam`
--

LOCK TABLES `pacientes_cesfam` WRITE;
/*!40000 ALTER TABLE `pacientes_cesfam` DISABLE KEYS */;
INSERT INTO `pacientes_cesfam` VALUES (1,'CESFAM Renca','José Manuel Balmaceda 4408 - 4394','Renca','2 2641 9289',NULL,NULL,'2025-11-17 00:27:34.315213'),(2,'CESFAM Juan Antonio Rios','Soberanía 1180','Independencia','2 2737 7185',NULL,NULL,'2025-11-17 00:28:26.372186'),(3,'CESFAM Garín','Janequeo 5662','Quinta Normal','2 2574 4900',NULL,NULL,'2025-11-17 00:29:25.550234');
/*!40000 ALTER TABLE `pacientes_cesfam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes_paciente`
--

DROP TABLE IF EXISTS `pacientes_paciente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes_paciente` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comuna` varchar(100) NOT NULL,
  `direccion` varchar(300) NOT NULL,
  `grupo_sanguineo` varchar(5) DEFAULT NULL,
  `alergias` longtext,
  `enfermedades_cronicas` longtext,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `cesfam_id` bigint DEFAULT NULL,
  `usuario_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  KEY `pacientes_paciente_cesfam_id_f49909b2_fk_pacientes_cesfam_id` (`cesfam_id`),
  CONSTRAINT `pacientes_paciente_cesfam_id_f49909b2_fk_pacientes_cesfam_id` FOREIGN KEY (`cesfam_id`) REFERENCES `pacientes_cesfam` (`id`),
  CONSTRAINT `pacientes_paciente_usuario_id_dff845c0_fk_usuarios_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes_paciente`
--

LOCK TABLES `pacientes_paciente` WRITE;
/*!40000 ALTER TABLE `pacientes_paciente` DISABLE KEYS */;
/*!40000 ALTER TABLE `pacientes_paciente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turnos_solicitudcambioturno`
--

DROP TABLE IF EXISTS `turnos_solicitudcambioturno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnos_solicitudcambioturno` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fecha_nueva` date NOT NULL,
  `hora_inicio_nueva` time(6) NOT NULL,
  `hora_fin_nueva` time(6) NOT NULL,
  `motivo` longtext NOT NULL,
  `status` varchar(20) NOT NULL,
  `respuesta` longtext,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `medico_solicitante_id` bigint NOT NULL,
  `turno_original_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `turnos_solicitudcamb_medico_solicitante_i_253bd924_fk_medicos_m` (`medico_solicitante_id`),
  KEY `turnos_solicitudcamb_turno_original_id_229aaf2f_fk_turnos_tu` (`turno_original_id`),
  CONSTRAINT `turnos_solicitudcamb_medico_solicitante_i_253bd924_fk_medicos_m` FOREIGN KEY (`medico_solicitante_id`) REFERENCES `medicos_medico` (`id`),
  CONSTRAINT `turnos_solicitudcamb_turno_original_id_229aaf2f_fk_turnos_tu` FOREIGN KEY (`turno_original_id`) REFERENCES `turnos_turno` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnos_solicitudcambioturno`
--

LOCK TABLES `turnos_solicitudcambioturno` WRITE;
/*!40000 ALTER TABLE `turnos_solicitudcambioturno` DISABLE KEYS */;
/*!40000 ALTER TABLE `turnos_solicitudcambioturno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turnos_turno`
--

DROP TABLE IF EXISTS `turnos_turno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnos_turno` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `hora_inicio` time(6) NOT NULL,
  `hora_fin` time(6) NOT NULL,
  `tipo_turno` varchar(20) NOT NULL,
  `cargo` varchar(100) NOT NULL,
  `area` varchar(100) NOT NULL,
  `status` varchar(20) NOT NULL,
  `observaciones` longtext,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `medico_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `turnos_turno_medico_id_abaa945a_fk_medicos_medico_id` (`medico_id`),
  CONSTRAINT `turnos_turno_medico_id_abaa945a_fk_medicos_medico_id` FOREIGN KEY (`medico_id`) REFERENCES `medicos_medico` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnos_turno`
--

LOCK TABLES `turnos_turno` WRITE;
/*!40000 ALTER TABLE `turnos_turno` DISABLE KEYS */;
/*!40000 ALTER TABLE `turnos_turno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_usuario`
--

DROP TABLE IF EXISTS `usuarios_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_usuario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `correo` varchar(254) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `tipo_documento` varchar(10) NOT NULL,
  `documento` varchar(50) NOT NULL,
  `celular` varchar(20) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `role` varchar(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `documento` (`documento`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_usuario`
--

LOCK TABLES `usuarios_usuario` WRITE;
/*!40000 ALTER TABLE `usuarios_usuario` DISABLE KEYS */;
INSERT INTO `usuarios_usuario` VALUES (1,'pbkdf2_sha256$600000$DC49q4GIOY8hhLHqr2Pr19$nnZs+A6kGoDDABk3k75vGmdkZDiiOXG1CY9FFcWrOTQ=','2025-11-21 21:54:43.486502',1,'admin@micesfam.cl','Equipo7','DuocUC','rut','2121212-9','99999999999','2000-01-01','admin',1,1,'2025-11-17 00:22:10.763387','2025-11-21 21:49:49.031171'),(2,'pbkdf2_sha256$600000$Hz0qP2RxhQCHaLVOXvm8Lm$dGOSoVvw24uCw2qipPhqUqkes3JlqlvqBnhlmsr2/vE=',NULL,0,'ana.diaz@gmail.com','Ana','Diaz','rut','124663267-7','+569999999','2007-06-07','paciente',1,0,'2025-11-19 21:01:14.143159','2025-11-19 21:01:14.495696'),(3,'pbkdf2_sha256$600000$gmeWcqNOUEdUbdWU5PFY2E$21WgIiST6QsOm5jSCfndPuh/M9ISsMAkUBgs/JknB+g=','2025-11-21 21:48:41.315473',0,'jeannettea.figueroa.diaz@gmail.com','Jeannette','Figueroa','rut','21900370-6','+569999999','2005-07-22','paciente',1,0,'2025-11-19 21:07:24.284259','2025-11-19 21:07:24.632389'),(4,'pbkdf2_sha256$600000$uf7xi27lDRvTLSPkq1OZvS$VbXCe09naxDBZzz6OfwY9onKoBQupWo0A4tjTJyiqgk=','2025-11-20 00:38:40.010170',1,'admin@local.test','Admin','User','rut','00000000','','2000-01-01','paciente',1,1,'2025-11-20 00:27:58.133966','2025-11-20 00:27:58.133966'),(5,'pbkdf2_sha256$600000$hVrunGxIYOrnlZ25LsCKAs$8LmunNgLbPpWvyQDp1zHiO3NQsWw7YhigwAr7CRF3QU=',NULL,0,'pepito.perez.test@example.com','Pepito','Perez','rut','22222222','+56912345678','1985-05-05','medico',1,0,'2025-11-20 00:36:41.398440','2025-11-20 00:36:41.398440'),(6,'pbkdf2_sha256$600000$MuzzT9TpzaGsqUGcWTJd9H$34b5U5SuROoRSfY+gd704ML5bD2c95Id10NhHOoRLLA=','2025-11-20 01:45:09.931800',0,'demis@micesfam.cl','Demis','Pinto','rut','21349636-0','+569333333','2003-07-25','medico',1,0,'2025-11-20 01:08:41.735923','2025-11-20 01:08:41.735923'),(7,'pbkdf2_sha256$600000$WZKqixENUu1Zn12LQ7n5hp$4nwTSIKoCqWBvK6j66/3+0eqP4KD0+qF9Yd3K8oeM98=','2025-11-20 01:48:27.684391',0,'belen_c@gmail.com','Belen','Colina','rut','23238888-5','+56944444444','2000-04-05','paciente',1,0,'2025-11-20 01:47:58.735475','2025-11-20 01:47:58.735475'),(8,'pbkdf2_sha256$600000$0nu83Wzdy2RiYY1MtYfYZb$87ihtTyq5FfMs0ecIpXCyG7YoWKijqIQfdNiTUamQdQ=','2025-11-21 21:52:24.668937',0,'monica@gmail.com','Monica','Figueroa','rut','2065666666-4','+569213123','1997-12-25','paciente',1,0,'2025-11-21 21:27:11.162944','2025-11-21 21:51:40.010138');
/*!40000 ALTER TABLE `usuarios_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_usuario_groups`
--

DROP TABLE IF EXISTS `usuarios_usuario_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_usuario_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuarios_usuario_groups_usuario_id_group_id_4ed5b09e_uniq` (`usuario_id`,`group_id`),
  KEY `usuarios_usuario_groups_group_id_e77f6dcf_fk_auth_group_id` (`group_id`),
  CONSTRAINT `usuarios_usuario_gro_usuario_id_7a34077f_fk_usuarios_` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_usuario` (`id`),
  CONSTRAINT `usuarios_usuario_groups_group_id_e77f6dcf_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_usuario_groups`
--

LOCK TABLES `usuarios_usuario_groups` WRITE;
/*!40000 ALTER TABLE `usuarios_usuario_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios_usuario_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_usuario_user_permissions`
--

DROP TABLE IF EXISTS `usuarios_usuario_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_usuario_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuarios_usuario_user_pe_usuario_id_permission_id_217cadcd_uniq` (`usuario_id`,`permission_id`),
  KEY `usuarios_usuario_use_permission_id_4e5c0f2f_fk_auth_perm` (`permission_id`),
  CONSTRAINT `usuarios_usuario_use_permission_id_4e5c0f2f_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `usuarios_usuario_use_usuario_id_60aeea80_fk_usuarios_` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_usuario_user_permissions`
--

LOCK TABLES `usuarios_usuario_user_permissions` WRITE;
/*!40000 ALTER TABLE `usuarios_usuario_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios_usuario_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-21 19:24:12
