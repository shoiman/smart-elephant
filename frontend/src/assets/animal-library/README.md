# Бібліотека персонажів "Хто де живе?"

Усі 42 зображення (6 фонів + 36 тваринок) з гри, розпаковані з base64 у зручні формати.

## Структура
```
animal_library/
├── backgrounds/          — 6 фонових зображень (.jpg), по одному на локацію
├── animals/               — 36 зображень тваринок (.jpg), по 6 на кожну локацію
├── manifest.json          — список файлів (шляхи) по локаціях
├── character_library.json — та сама бібліотека, але зображення знову закодовані
│                             в base64 (data URI), готові для вставки в будь-який
│                             HTML/CSS/JS файл
└── character_library.js   — те саме, але як JS-файл з глобальною змінною
                              CHARACTER_LIBRARY — підключайте через <script src="...">
```

## Локації (ключі)
- forest (Ліс)
- savanna (Савана)
- farm (Ферма)
- sea (Море)
- river_lake (Річка-озеро)
- sky (Небо)

## Тваринки за локаціями
- **Ферма (farm):** cow, pig, sheep, chicken, foal, goat
- **Ліс (forest):** moose, hedgehog, squirrel, rabbit, wolf, boar
- **Річка-озеро (river_lake):** crocodile, frog, duck, swan, heron, catfish
- **Савана (savanna):** lion, giraffe, elephant, hippo, zebra, leopard
- **Море (sea):** dolphin, shark, whale, crab, tuna, octopus
- **Небо (sky):** owl, parrot, raven, bird, butterfly, bee

> Назви підтверджені вручну користувачем (Ганною) — 100% точні.
> Зображення тваринок обрізані: тонка кольорова рамка навколо кожної
> картинки видалена (обрізка 18px з усіх боків). Фони рамки не мали
> і залишені без змін.

## Як користуватись

### Варіант 1 — окремі файли
Використовуйте JPG з папок `backgrounds/` та `animals/` як звичайні зображення
в будь-якому проєкті (вставка в Word, PowerPoint, інші HTML-сторінки тощо).
Кожен файл тваринки названо за шаблоном `{локація}_{номер}_{тваринка}.jpg`,
наприклад `farm_1_cow.jpg`.

### Варіант 2 — вбудований JS-об'єкт (для нового офлайн HTML)
```html
<script src="character_library.js"></script>
<script>
  document.getElementById("myImg").src = CHARACTER_LIBRARY.farm.bg;
  document.getElementById("myImg2").src = CHARACTER_LIBRARY.farm.animals.cow;
  // CHARACTER_LIBRARY.farm.animals — об'єкт { cow: "...", pig: "...", ... }
</script>
```

### Варіант 3 — JSON (для будь-якої мови/фреймворку)
Завантажте `character_library.json` і розберіть як звичайний JSON-об'єкт
(структура ідентична `character_library.js`).
