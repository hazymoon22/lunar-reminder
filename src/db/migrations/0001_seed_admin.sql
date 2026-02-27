INSERT INTO "user" ("id", "name", "email", "role")
VALUES (
  'cf6c3ce4-b387-4e60-b105-0ecd1f7ffc27',
  'Huy Bui',
  'huybui150396@gmail.com',
  'admin'
)
ON CONFLICT ("email")
DO UPDATE SET
  "name" = EXCLUDED."name",
  "email" = EXCLUDED."email",
  "role" = EXCLUDED."role";
