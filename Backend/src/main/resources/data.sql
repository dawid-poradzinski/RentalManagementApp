INSERT INTO person VALUES (1, 'user0', 'Dawid', '555666000', 'USER', 'NOWAK'),
(2, 'user1', 'Tomek', '555777000', 'USER', 'NOWAK'),
(3, 'admin0', 'Admin', '555888000', 'ADMIN', 'NOWAK'),
(4, 'worker0', 'Worker', '555999000', 'WORKER', 'NOWAK');

-- aaa password

INSERT INTO person_private VALUES
(1, '$2a$10$.E6HmCKnv9XJbBIZdm.Nk.sSLdzXbfhgY1jEvbtFTk5t4Ehf2pCNK', 1),
(2, '$2a$10$.E6HmCKnv9XJbBIZdm.Nk.sSLdzXbfhgY1jEvbtFTk5t4Ehf2pCNK', 2),
(3, '$2a$10$.E6HmCKnv9XJbBIZdm.Nk.sSLdzXbfhgY1jEvbtFTk5t4Ehf2pCNK', 3),
(4, '$2a$10$.E6HmCKnv9XJbBIZdm.Nk.sSLdzXbfhgY1jEvbtFTk5t4Ehf2pCNK', 4);

INSERT INTO item_category VALUES
(1, 'SKI'),
(2, 'Helm'),
(3, 'Jacket'),
(4, 'Pants'),
(5, 'Boots');

INSERT INTO item ( id, add_date, damaged, last_maintenance, name, price_amount, price_currency, size, image, place, category_id ) VALUES
(1, NOW(), false, NOW(), 'Pink helm', 3.99, 'PLN', 2, '/Placeholder.png', 0, 1),
(2, NOW(), false, NOW(), 'Pink helm', 3.99, 'PLN', 2, '/Placeholder.png', 3, 1),
(3, NOW(), false, NOW(), 'Pink helm', 3.99, 'PLN', 2, '/Placeholder.png', 2, 1),
(4, NOW(), false, NOW(), 'Pink helm', 3.99, 'PLN', 2, '/Placeholder.png', 1, 1),
(5, NOW(), false, NOW(), 'Black pants', 3.99, 'PLN', 4, '/Black_pants.png', 3, 1),
(6, NOW(), false, NOW(), 'Red pants', 2.99, 'PLN', 4, '/Red_pants.png', 3, 3),
(7, NOW(), false, NOW(), 'White pants', 2.59, 'PLN', 4, '/White_pants.png', 3, 1),
(8, NOW(), false, NOW(), 'Blue pants', 3.99, 'PLN', 4, '/Blue_pants.png', 3, 2),
(9, NOW(), false, NOW(), 'Pink Helmet', 2.99, 'PLN', 4, '/Pink_helmet_2.png', 3, 3);