CREATE TABLE `sys`.`select_content` (
  `content_id` INT NOT NULL AUTO_INCREMENT,
  `content` LONGTEXT NOT NULL,
  `user` VARCHAR(100) NOT NULL,
  `cre_time` DATETIME NOT NULL,
  PRIMARY KEY (`content_id`));

--insert into sys.select_content (content, user, cre_time) values('<html><body><div><p>sample test data</p></div></body></html>','zktewfm',current_date());
-- select * from sys.select_content;
