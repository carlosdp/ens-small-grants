create table grants (
  id integer primary key generated always as identity,
  title text not null,
  description text not null,
  full_text text not null
);
