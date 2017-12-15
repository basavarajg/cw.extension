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
    `user` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`));

    CREATE TABLE `sys`.`email_content_map` (
      `email_id` INT NOT NULL,
      `content_id` INT NOT NULL,
      `user` VARCHAR(100) NULL,
      `cre_time` DATETIME NULL,
      PRIMARY KEY (`email_id`, `content_id`),
      INDEX `content_id_idx` (`content_id` ASC),
      CONSTRAINT `id`
        FOREIGN KEY (`email_id`)
        REFERENCES `sys`.`email_audit` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      CONSTRAINT `content_id`
        FOREIGN KEY (`content_id`)
        REFERENCES `sys`.`select_content` (`content_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE);

--insert into sys.select_content (content, user, cre_time) values('<html><body><div><p>sample test data</p></div></body></html>','zktewfm',current_date());
-- select * from sys.select_content;
