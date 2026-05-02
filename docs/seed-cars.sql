-- =========================================================
-- Step 1: Extend the cars table with app-specific columns
-- =========================================================
ALTER TABLE cars
  ADD COLUMN IF NOT EXISTS avg_rating      NUMERIC(3,1),
  ADD COLUMN IF NOT EXISTS review_count    INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS would_buy_pct   INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS trending_rank   INT,
  ADD COLUMN IF NOT EXISTS categories      TEXT[],
  ADD COLUMN IF NOT EXISTS rating_breakdown JSONB,
  ADD COLUMN IF NOT EXISTS most_loved      JSONB,
  ADD COLUMN IF NOT EXISTS least_loved     JSONB,
  ADD COLUMN IF NOT EXISTS recent_reviews  JSONB;

-- =========================================================
-- Step 2: Allow public read access (frontend uses anon key)
-- =========================================================
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cars" ON cars
  FOR SELECT TO anon, authenticated USING (true);

-- =========================================================
-- Step 3: Seed all 10 cars
-- =========================================================
INSERT INTO cars (make, model, year, category, image_url, avg_rating, review_count, would_buy_pct, trending_rank, categories, rating_breakdown, most_loved, least_loved, recent_reviews) VALUES

(
  'Porsche', '911 GT3', 2023, 'Sports',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80&fit=crop&auto=format',
  9.2, 284, 89, 12,
  ARRAY['Sports', 'Coupe'],
  '{"comfort":7.8,"speed":9.4,"handling":9.1,"interior":8.3,"reliability":7.5,"value":6.8}'::jsonb,
  '[{"feature":"Incredible handling","count":142},{"feature":"Raw driving experience","count":128},{"feature":"Track-ready performance","count":95}]'::jsonb,
  '[{"feature":"Expensive options","count":64}]'::jsonb,
  '[{"author":"Alex Chen","initials":"AC","rating":9.5,"date":"2 weeks ago","text":"The GT3 is everything I dreamed of and more. The steering feel is absolutely phenomenal."},{"author":"Sarah Martinez","initials":"SM","rating":9.0,"date":"1 month ago","text":"Incredible track car, but daily driving is a challenge. Worth it for the weekends!"}]'::jsonb
),

(
  'Tesla', 'Model S Plaid', 2024, 'Electric',
  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80&fit=crop&auto=format',
  8.8, 512, 83, 5,
  ARRAY['Electric', 'Sedan', 'Luxury'],
  '{"comfort":9.1,"speed":9.8,"handling":8.5,"interior":9.2,"reliability":7.8,"value":7.2}'::jsonb,
  '[{"feature":"Ludicrous acceleration","count":289},{"feature":"Autopilot technology","count":241},{"feature":"Massive touchscreen display","count":178}]'::jsonb,
  '[{"feature":"Build quality inconsistency","count":89}]'::jsonb,
  '[{"author":"James Park","initials":"JP","rating":9.0,"date":"3 days ago","text":"The Plaid literally pins you to your seat. 0-60 in under 2 seconds is insane."},{"author":"Lisa Wong","initials":"LW","rating":8.5,"date":"2 weeks ago","text":"Love the tech but had some panel gaps on delivery. Software is outstanding though."}]'::jsonb
),

(
  'BMW', 'M4 Competition', 2023, 'Sports',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80&fit=crop&auto=format',
  8.5, 398, 78, 8,
  ARRAY['Sports', 'Coupe', 'Luxury'],
  '{"comfort":8.0,"speed":9.1,"handling":9.0,"interior":8.7,"reliability":7.9,"value":6.9}'::jsonb,
  '[{"feature":"Twin-turbo power delivery","count":198},{"feature":"M chassis dynamics","count":167},{"feature":"Premium interior quality","count":143}]'::jsonb,
  '[{"feature":"Controversial front grille","count":112}]'::jsonb,
  '[{"author":"Tom Harris","initials":"TH","rating":8.8,"date":"1 week ago","text":"M xDrive makes this a genuinely usable everyday sports car. Performance is staggering."},{"author":"Mia Johnson","initials":"MJ","rating":8.0,"date":"3 weeks ago","text":"Brilliant car but the front grille took some getting used to. Drive dynamics are flawless."}]'::jsonb
),

(
  'Mercedes-Benz', 'AMG GT', 2023, 'Sports',
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80&fit=crop&auto=format',
  8.9, 267, 85, 15,
  ARRAY['Sports', 'Coupe', 'Luxury'],
  '{"comfort":8.5,"speed":9.3,"handling":8.8,"interior":9.4,"reliability":8.1,"value":7.0}'::jsonb,
  '[{"feature":"V8 exhaust note","count":154},{"feature":"Luxurious interior","count":132},{"feature":"Aggressive styling","count":109}]'::jsonb,
  '[{"feature":"High maintenance costs","count":71}]'::jsonb,
  '[{"author":"Chris Davis","initials":"CD","rating":9.2,"date":"5 days ago","text":"The AMG GT is a proper sports car with Mercedes luxury. That exhaust sound at startup never gets old."},{"author":"Nina Patel","initials":"NP","rating":8.5,"date":"2 months ago","text":"Stunning to look at and thrilling to drive. The MBUX system is top notch."}]'::jsonb
),

(
  'Lamborghini', 'Huracán EVO', 2023, 'Sports',
  'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800&q=80&fit=crop&auto=format',
  9.5, 189, 91, 3,
  ARRAY['Sports', 'Coupe'],
  '{"comfort":6.5,"speed":9.8,"handling":9.6,"interior":8.5,"reliability":7.0,"value":5.5}'::jsonb,
  '[{"feature":"V10 naturally aspirated engine","count":162},{"feature":"Explosive performance","count":145},{"feature":"Head-turning design","count":138}]'::jsonb,
  '[{"feature":"Very expensive","count":89}]'::jsonb,
  '[{"author":"Ryan Lee","initials":"RL","rating":9.8,"date":"1 week ago","text":"There is nothing like the Huracan V10 scream. Every drive feels like an event."},{"author":"Emma Clarke","initials":"EC","rating":9.0,"date":"6 weeks ago","text":"Ownership is a dream and a challenge. The performance is unreal but you live at the service center."}]'::jsonb
),

(
  'Ferrari', '488 GTB', 2022, 'Sports',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80&fit=crop&auto=format',
  9.4, 203, 88, 7,
  ARRAY['Sports', 'Coupe'],
  '{"comfort":7.2,"speed":9.7,"handling":9.5,"interior":8.8,"reliability":7.2,"value":5.8}'::jsonb,
  '[{"feature":"Twin-turbo V8 power","count":171},{"feature":"Razor-sharp handling","count":148},{"feature":"Ferrari heritage","count":121}]'::jsonb,
  '[{"feature":"Exclusivity waitlists","count":67}]'::jsonb,
  '[{"author":"Marco Rossi","initials":"MR","rating":9.5,"date":"2 weeks ago","text":"The 488 GTB is Ferrari at its finest. The twin-turbo V8 has power everywhere in the rev range."},{"author":"Katie Brown","initials":"KB","rating":9.2,"date":"1 month ago","text":"Absolutely thrilling. You need to experience it on a track to really appreciate what it can do."}]'::jsonb
),

(
  'Audi', 'RS6 Avant', 2024, 'Luxury',
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80&fit=crop&auto=format',
  8.7, 445, 87, 6,
  ARRAY['Luxury', 'Sports'],
  '{"comfort":9.0,"speed":9.0,"handling":8.5,"interior":9.3,"reliability":8.5,"value":7.8}'::jsonb,
  '[{"feature":"Practical performance wagon","count":312},{"feature":"Quattro all-wheel drive","count":278},{"feature":"Understated styling","count":198}]'::jsonb,
  '[{"feature":"Fuel consumption","count":123}]'::jsonb,
  '[{"author":"David Mueller","initials":"DM","rating":9.0,"date":"4 days ago","text":"The RS6 is the ultimate daily driver. Supercar performance in a family wagon."},{"author":"Sophie Green","initials":"SG","rating":8.5,"date":"3 weeks ago","text":"Everything you need and nothing you dont. The virtual cockpit is the best display in the game."}]'::jsonb
),

(
  'McLaren', '720S', 2023, 'Sports',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80&fit=crop&auto=format',
  9.3, 156, 86, 9,
  ARRAY['Sports', 'Coupe'],
  '{"comfort":7.5,"speed":9.9,"handling":9.7,"interior":8.2,"reliability":7.1,"value":6.5}'::jsonb,
  '[{"feature":"Active aerodynamics","count":128},{"feature":"Proactive chassis control","count":112},{"feature":"Mid-engine balance","count":98}]'::jsonb,
  '[{"feature":"Dealer network gaps","count":54}]'::jsonb,
  '[{"author":"Jake Wilson","initials":"JW","rating":9.6,"date":"1 week ago","text":"The 720S corners like nothing else. It reads the road and adapts in real time. Mind-blowing."},{"author":"Anna Kim","initials":"AK","rating":9.0,"date":"2 months ago","text":"Terrifying in the best possible way. If you want pure supercar experience look no further."}]'::jsonb
),

(
  'Land Rover', 'Range Rover Sport', 2024, 'SUV',
  'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80&fit=crop&auto=format',
  8.3, 634, 76, 11,
  ARRAY['SUV', 'Luxury'],
  '{"comfort":9.4,"speed":7.8,"handling":7.5,"interior":9.5,"reliability":6.8,"value":7.0}'::jsonb,
  '[{"feature":"Luxurious interior","count":412},{"feature":"Off-road capability","count":289},{"feature":"Commanding road presence","count":267}]'::jsonb,
  '[{"feature":"Reliability concerns","count":198}]'::jsonb,
  '[{"author":"Ben Thompson","initials":"BT","rating":8.5,"date":"6 days ago","text":"The interior is genuinely world-class. Every material and finish feels special."},{"author":"Claire Adams","initials":"CA","rating":8.0,"date":"1 month ago","text":"Love everything about it except I have had to visit the dealer too many times in year one."}]'::jsonb
),

(
  'Toyota', 'GR86', 2023, 'Sports',
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80&fit=crop&auto=format',
  8.6, 567, 90, 4,
  ARRAY['Sports', 'Coupe'],
  '{"comfort":7.2,"speed":8.0,"handling":9.2,"interior":7.5,"reliability":9.5,"value":9.4}'::jsonb,
  '[{"feature":"Pure driving feel","count":423},{"feature":"Affordable fun","count":389},{"feature":"Toyota reliability","count":312}]'::jsonb,
  '[{"feature":"Modest power output","count":156}]'::jsonb,
  '[{"author":"Derek Chang","initials":"DC","rating":9.0,"date":"3 days ago","text":"Best drivers car for the money by a mile. The chassis is perfectly balanced."},{"author":"Priya Singh","initials":"PS","rating":8.5,"date":"2 weeks ago","text":"Bought it for track days use it daily. Incredibly reliable and communicative."}]'::jsonb
);
