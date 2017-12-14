CREATE TABLE `sys`.`select_content` (
  `content_id` INT NOT NULL AUTO_INCREMENT,
  `content` LONGTEXT NOT NULL,
  `user` VARCHAR(100) NOT NULL,
  `cre_time` DATETIME NOT NULL,
  PRIMARY KEY (`content_id`));

CREATE TABLE `sys`.`email_audit` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `email_message` LONGTEXT NOT NULL,
     `email_subject` VARCHAR(100) NOT NULL,
    `email_from` VARCHAR(100) NOT NULL,
    `email_to` LONGTEXT NOT NULL,
    `cre_time` DATETIME NOT NULL,
    PRIMARY KEY (`id`));

--insert into sys.select_content (content, user, cre_time) values('<html><body><div><p>sample test data</p></div></body></html>','zktewfm',current_date());
-- select * from sys.select_content;
