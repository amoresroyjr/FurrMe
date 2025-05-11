/**DROP TABLE IF EXISTS pet_img;
DROP TABLE IF EXISTS adoptreq;
DROP TABLE IF EXISTS community;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS accounts;*/

CREATE TABLE IF NOT EXISTS accounts (
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    pass VARCHAR(255),
    role ENUM('Admin', 'User') DEFAULT 'User',
    image VARCHAR(2000),
	PRIMARY KEY(email)
);

CREATE TABLE IF NOT EXISTS pets (
	pet_id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(500),
	category VARCHAR(500),
	address VARCHAR(500),
	description TEXT,
	color VARCHAR(500),
	gender ENUM('Male', 'Female', 'Unknown'),
	image VARCHAR(5000),
	breed VARCHAR(500),
	age VARCHAR(500),
	behavior VARCHAR(500),
	health VARCHAR(500),
	status ENUM('Available', 'Adopted') DEFAULT 'Available',
	createdBy VARCHAR(255),
	adoptedBy VARCHAR(255),
	FOREIGN KEY (createdBy) REFERENCES accounts(email),
	FOREIGN KEY (adoptedBy) REFERENCES accounts(email)
);

CREATE TABLE IF NOT EXISTS pet_img (
	pet_id INT PRIMARY KEY,
	img1 VARCHAR(2000),
	img2 VARCHAR(2000),
	img3 VARCHAR(2000),
	img4 VARCHAR(2000),
	img5 VARCHAR(2000),
	FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS adoptreq (
	request_id INT AUTO_INCREMENT PRIMARY KEY,
	pet_id INT,
	email VARCHAR(200),
	valid_id VARCHAR(2000),
	address VARCHAR(500),
	contact VARCHAR(100),
	household TEXT,
	employment TEXT,
	pet_exp TEXT,
	requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	status ENUM('Approved', 'Rejected', 'Pending') DEFAULT 'Pending', 
	reason VARCHAR(500),
	FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS community (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(320),
    description TEXT,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    post_image VARCHAR(1000),
    FOREIGN KEY (email) REFERENCES accounts(email) ON DELETE CASCADE
);

/**INSERT INTO accounts (fname, lname, email, pass, role, image) VALUES
('pop', 'pop', 'liezlqt@gmail.com', '$2b$10$IsAlaJtWp62YcFYnVjr30.VY3swRd9waA9VTIh73ntBqgyTh5ed7K', 'User', 'https://res.cloudinary.com/dmquudoki/image/upload/v1746499718/i7iji9xbvp9bqpwbzy3e.jpg'),
('Papa', 'Roy', 'paparoygwapo@gmail.com', '$2b$10$CmwPj9uqVSka3SlHy0GLUOmbiCql.jGhFA2ADJUtaSjwa5LD6bmxC', 'User', 'https://res.cloudinary.com/dmquudoki/image/upload/v1746458876/fvqsla62ybyo5ntcbump.jpg');

INSERT INTO pets (pet_id, name, category, address, description, color, gender, image, breed, age, behavior, health, status, createdBy, adoptedBy) 
VALUES 
(65, 'Myggssss', 'Cats', 'Maria, Siquijor', 'Likes to sleep beside owner, poops everywhere', 'Orange', 'Male', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491167/CATS/65/651_sh5ku3.jpg', 'Domestic Short Hair', '2 years old', 'Energetic', 'has frequent diarrhea', 'Available', NULL, NULL),
(66, 'Mikmik', 'Cats', 'Maria, Siquijor', 'Likes to roam around, playful and likes to climb on your bodys', 'White Grey', 'Female', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491211/CATS/66/663_lmo4ua.jpg', 'Mixed-breed', '2 years old', 'Playful', 'does not have any vaccinations', 'Available', NULL, NULL),
(67, 'Makmak', 'Cats', 'Maria, Siquijor', 'Roams around a lot', 'Black', 'Male', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491236/CATS/67/674_xxoad4.jpg', 'Mixed-breed', '5 years old', 'Aggresive', 'have not been vaccinated', 'Available', NULL, NULL),
(68, 'Shangs', 'Cats', 'Maria, Siquijor', 'Likes to eat and runs a lot', 'Black Brown', 'Male', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491254/CATS/68/686_pyprwn.jpg', 'Shih-poo', '3 years old', 'Energetic', 'complete vaccination and deworming', 'Available', NULL, NULL),
(69, 'Sasa', 'Cats', 'San Juan, Siquijor', 'Likes to go for walks', 'White', 'Female', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491290/CATS/69/694_stgfsn.jpg', 'Mixed-breed', '4 years old', 'Energetic', 'healthy', 'Available', NULL, NULL),
(70, 'Quandale Dingle', 'Cats', 'Ohio, USA', 'Likes to climb on people', 'White', 'Male', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491303/CATS/70/703_ohwztk.jpg', 'Persian', '4 years old', 'Aggressive', 'complete vaccination and deworming', 'Available', NULL, NULL),
(71, 'Sad Boy', 'Cats', 'Arizona, USA', 'Likes to sit on the roof', 'White', 'Male', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491316/CATS/71/714_wp8bl9.jpg', 'Siamese', '9 years old', 'Grumpy', 'fully vaccinated and dewormed, neutered', 'Available', NULL, NULL),
(72, 'Lola', 'Cats', 'Arizona, USA', 'Likes to watch the sunrise', 'White Black Orange', 'Female', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491351/CATS/72/722_qvmctv.jpg', 'Domestic Short Hair', '4 years old', 'Aloof', 'fully vaccinated and spayed', 'Available', NULL, NULL),
(73, 'Francois', 'Dogs', 'Arizona, USA', 'Likes to hide under the chair, Likes to be kissed on the head', 'Brown Black', 'Male', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491363/Dogs/Bob/Bob1_uzy6bu.jpg', 'Siamese', '4 years old', 'Shy', 'fully vaccinated', 'Available', NULL, NULL),
(74, 'Spencer', 'Dogs', 'Maria, Siquijor', 'Likes to walk in the forest', 'Brown White', 'Male', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491383/Dogs/Brodie/Brodie1_cu9v1r.jpg', 'Mixed-breed', '10 years old', 'Behaved', 'fully vaccinated', 'Available', NULL, NULL);

INSERT INTO pet_img (pet_id, img1, img2, img3, img4, img5) VALUES
(65, 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491168/CATS/65/654_nuiist.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491160/CATS/65/653_u4h5jq.jpg', NULL, NULL, NULL),
(66, 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491215/CATS/66/665_sbn5yz.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491212/CATS/66/664_x5izsu.webp', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491211/CATS/66/666_c6foat.webp', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491210/CATS/66/662_sp0cmb.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491209/CATS/66/661_bpqscm.jpg'),
(67, 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491239/CATS/67/675_rzaiyc.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491238/CATS/67/676_r5t6w1.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491235/CATS/67/673_r9qbna.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491235/CATS/67/672_s4szoc.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491234/CATS/67/671_fhuv8d.jpg'),
(68, 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491253/CATS/68/685_ozcis3.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491252/CATS/68/684_g4hfer.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491252/CATS/68/682_xsbxdh.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491251/CATS/68/683_p5vgws.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491250/CATS/68/681_nrodyc.jpg'),
(69, 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491291/CATS/69/695_sxkwwx.webp', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491289/CATS/69/693_vfaubb.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491288/CATS/69/692_vntudp.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491287/CATS/69/691_qmdh17.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491287/CATS/69/691_qmdh17.jpg'),
(70, 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491307/CATS/70/706_okwgce.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491305/CATS/70/705_fh6u7h.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491304/CATS/70/704_sv0ykk.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491302/CATS/70/702_qd3yhr.jpg', NULL),
(71, 'https://res.cloudinary.com/dmquudoki/image/upload/v1724512685/t53hn1jyiw4gqpgkbw8g.gif', NULL, NULL, NULL, NULL),
(72, 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491360/CATS/72/725_ogpbpj.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491356/CATS/72/726_r5xhzk.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491354/CATS/72/723_hqfyqh.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491353/CATS/72/724_bvcfni.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491352/CATS/72/721_zhpfkg.jpg'),
(73, 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491369/Dogs/Bob/bob5_o7carc.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491367/Dogs/Bob/Bob6_ubjl4l.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491366/Dogs/Bob/Bob3_inz9bv.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491365/Dogs/Bob/Bob4_jlj9kv.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491364/Dogs/Bob/Bob2_maotmx.jpg'),
(74, 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491389/Dogs/Brodie/Brodie6_bilao4.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491386/Dogs/Brodie/Brodie5_s6bbyx.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491385/Dogs/Brodie/Brodie3_x25plo.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491384/Dogs/Brodie/Brodie4_l2hdp7.jpg', 'https://res.cloudinary.com/dmquudoki/image/upload/v1715491383/Dogs/Brodie/Brodie2_irskcc.jpg');


/**DROP TABLE IF EXISTS pet_img;
DROP TABLE IF EXISTS adoptreq;
DROP TABLE IF EXISTS community;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS accounts;*/