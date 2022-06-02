USE emptracker_db;

INSERT INTO department (dep_name)
VALUES 
('Customer Service'),
('Finance & Accounting'),
('Sales & Marketing'),
('Operations');

INSERT INTO role (title, salary, department_id)
VALUES
('Full Stack Cuddle Developer', 80000, 1),
('Cuddle Engineer', 120000, 1),
('Meowccountant', 10000, 2), 
('Finanical Analyst', 150000, 2),
('Marketing Coordindator', 70000, 3), 
('Sales Lead', 90000, 3),
('Project Moewnager', 100000, 4),
('Operations Meownager', 90000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Marianne', 'Dashfloof', 2, null),
('Primose', 'Everfloof', 1, 1),
('Tom', 'Branson', 4, null),
('Floofy', 'McFluffykins', 3, 3),
('Charles', 'Bingley', 6, null),
('Elizabeth', 'Bennett', 5, 5),
('Princess', 'Carolyn', 7, null),
('BoJack', 'Horseman', 8, 7);

