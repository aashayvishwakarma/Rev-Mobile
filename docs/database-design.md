# Rev — Database Design

**Author:** Kush  
**Date:** April 2026

---

## 1. NoSQL vs PostgreSQL

| | PostgreSQL | NoSQL (MongoDB / Firestore) |
|---|---|---|
| Data shape | Structured, relational ✅ | Flexible, document-based |
| Relationships | Native JOINs (users → reviews → cars) ✅ | Manual references, no real joins |
| Ratings & aggregations | Built-in AVG, COUNT, GROUP BY ✅ | Requires extra logic |
| Consistency | ACID transactions ✅ | Eventually consistent |
| Scaling | Vertical — fine for our scale ✅ | Horizontal — overkill here |

**Decision: PostgreSQL**

The Rev app is fundamentally relational. Users write reviews on cars, cars have aggregate ratings, users have garages and follow each other. All of these are natural JOINs. NoSQL would make queries like "average rating per category" unnecessarily complex.

---

## 2. Table Overview

| Table | Purpose |
|---|---|
| `users` | Everyone with an account |
| `cars` | Master catalog of all cars |
| `reviews` | User reviews + 6-category ratings for a car |
| `garage_entries` | Cars a user owns, wants, or previously owned |
| `posts` | Feed posts (can tag a car) |
| `likes` | Which user liked which post |
| `comments` | Comments on feed posts |
| `listings` | Marketplace — user selling a car |
| `follows` | Who follows who |

---

## 3. How the Tables Link

```
users ──< reviews >── cars
users ──< garage_entries >── cars
users ──< posts >── cars  (optional tag)
users ──< likes >── posts
users ──< comments >── posts
users ──< listings >── cars
users ──< follows >── users
```

Every relationship goes through `users` or `cars` as the two core entities.

---

## 4. Full Schema (PostgreSQL)

```sql
-- =========================================================
-- USERS
-- =========================================================
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username    VARCHAR(30)  UNIQUE NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    TEXT NOT NULL,           -- bcrypt hashed
  avatar_url  TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- CARS  (master catalog)
-- =========================================================
CREATE TABLE cars (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make        VARCHAR(50) NOT NULL,    -- e.g. "Porsche"
  model       VARCHAR(50) NOT NULL,    -- e.g. "911 GT3"
  year        INT NOT NULL,
  category    VARCHAR(30),             -- Sports, Luxury, SUV, Electric...
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- REVIEWS
-- One review per user per car (enforced by UNIQUE constraint)
-- =========================================================
CREATE TABLE reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id       UUID REFERENCES cars(id) ON DELETE CASCADE,
  rating       NUMERIC(3,1) CHECK (rating BETWEEN 0 AND 10),
  comfort      NUMERIC(3,1),
  speed        NUMERIC(3,1),
  handling     NUMERIC(3,1),
  interior     NUMERIC(3,1),
  reliability  NUMERIC(3,1),
  value        NUMERIC(3,1),
  body         TEXT,
  would_buy    BOOLEAN,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, car_id)
);

-- =========================================================
-- GARAGE
-- Tracks cars a user owns, wants, or previously owned
-- =========================================================
CREATE TABLE garage_entries (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id     UUID REFERENCES cars(id) ON DELETE CASCADE,
  status     VARCHAR(20) DEFAULT 'owned', -- owned | wishlist | previously_owned
  added_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, car_id)
);

-- =========================================================
-- POSTS  (social feed)
-- =========================================================
CREATE TABLE posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id     UUID REFERENCES cars(id),  -- optional car tag
  body       TEXT NOT NULL,
  image_url  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- LIKES
-- =========================================================
CREATE TABLE likes (
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id    UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- =========================================================
-- COMMENTS
-- =========================================================
CREATE TABLE comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id    UUID REFERENCES posts(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- MARKETPLACE LISTINGS
-- =========================================================
CREATE TABLE listings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id      UUID REFERENCES cars(id),
  title       TEXT NOT NULL,
  price       NUMERIC(12,2),
  mileage     INT,
  condition   VARCHAR(20),              -- new | used | certified
  description TEXT,
  image_url   TEXT,
  location    TEXT,
  status      VARCHAR(20) DEFAULT 'active', -- active | sold | removed
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- FOLLOWS
-- =========================================================
CREATE TABLE follows (
  follower_id  UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);
```

---

## 5. Example Queries

**Get average rating for a car:**
```sql
SELECT car_id, AVG(rating) AS avg_rating, COUNT(*) AS review_count
FROM reviews
WHERE car_id = '...'
GROUP BY car_id;
```

**Get a user's garage:**
```sql
SELECT c.make, c.model, c.year, g.status
FROM garage_entries g
JOIN cars c ON c.id = g.car_id
WHERE g.user_id = '...';
```

**Get feed posts with author info:**
```sql
SELECT p.body, p.image_url, p.created_at, u.username, u.avatar_url
FROM posts p
JOIN users u ON u.id = p.user_id
ORDER BY p.created_at DESC;
```
