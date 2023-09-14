CREATE TABLE bin (
  id serial PRIMARY KEY,
  bin_path varchar(15) UNIQUE NOT NULL,
  created_at timestamp DEFAULT NOW()
);

CREATE TABLE requests (
  id serial PRIMARY KEY,
  bin_id integer NOT NULL REFERENCES bin (id) ON DELETE CASCADE,
  mongo_id varchar,
  mongo_path varchar(15) UNIQUE NOT NULL,
  recieved_at timestamp DEFAULT NOW(),
  http_method varchar,
  http_path varchar
);

INSERT INTO bin (bin_path, created_at)
VALUES
('aabioueriow9343', DEFAULT),
('vu7mefbd7kn6aay', DEFAULT),
('0tzd3dl2v8jj7j6', DEFAULT);

INSERT INTO requests (bin_id, mongo_id, mongo_path, recieved_at, http_method, http_path)
VALUES
(1, 'aaa', '0aa4ph1vlo2j7em', DEFAULT, 'GET', '/webhook/aabioueriow9343/request_number'),
(1, 'bbb', 'dc9jngb3s539tdw', DEFAULT, 'GET', '/webhook/aabioueriow9343/request_number'),
(2, 'ccc', 'o6j69vfnkt4oc4e', DEFAULT, 'GET', '/webhook/vu7mefbd7kn6aay/request_number'),
(2, 'eee', 'glb7q71guh7xki2', DEFAULT, 'POST', '/webhook/vu7mefbd7kn6aay/request_number'),
(3, 'ddd', 'ijgmx7pmt5zf87g', DEFAULT, 'DELETE', '/webhook/0tzd3dl2v8jj7j6/request_number'),
(3, 'fff', 'mxm99mymzx4tbcq', DEFAULT, 'PATCH', '/webhook/0tzd3dl2v8jj7j6/request_number');

