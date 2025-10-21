-- Fix all pricing to realistic Rwandan Francs (RWF)

-- Update USD-priced custom items to RWF
UPDATE custom_buy_items 
SET price = CASE id
  WHEN 47 THEN 1200.00  -- Organic Tomatoes: 1,200 RWF/kg
  WHEN 48 THEN 3000.00  -- Free Range Eggs: 3,000 RWF/dozen (250 per egg)
  WHEN 49 THEN 1000.00  -- Fresh Bread: 1,000 RWF/loaf
  WHEN 50 THEN 2500.00  -- Premium Rice: 2,500 RWF/kg
  WHEN 51 THEN 8000.00  -- Local Honey: 8,000 RWF/jar
  ELSE price
END,
updated_at = NOW()
WHERE id IN (47, 48, 49, 50, 51);

-- Update all bundle prices to realistic RWF
UPDATE bundles
SET 
  price = CASE id
    WHEN 16 THEN 15000.00      -- Fresh Vegetables Bundle
    WHEN 17 THEN 12000.00      -- Fruits Combo Pack
    WHEN 18 THEN 25000.00      -- Dairy Essentials
    ELSE price
  END,
  original_price = CASE id
    WHEN 16 THEN 22000.00      -- Original: 22,000 RWF (32% discount)
    WHEN 17 THEN 18000.00      -- Original: 18,000 RWF (33% discount)
    WHEN 18 THEN 32000.00      -- Original: 32,000 RWF (22% discount)
    ELSE original_price
  END,
  updated_at = NOW()
WHERE id IN (16, 17, 18);

-- Verify the updates
SELECT 'Custom Items Updated:' as status, COUNT(*) as count 
FROM custom_buy_items 
WHERE id IN (47, 48, 49, 50, 51) AND price >= 1000;

SELECT 'Bundles Updated:' as status, COUNT(*) as count 
FROM bundles 
WHERE id IN (16, 17, 18) AND price >= 10000;