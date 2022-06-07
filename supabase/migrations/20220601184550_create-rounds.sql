create table rounds (
  id integer primary key generated always as identity,
  name text not null,
  description text,
  proposal_start timestamp not null,
  proposal_end timestamp not null,
  voting_start timestamp not null,
  voting_end timestamp not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
