import type { Animal } from "../../types/animal";
import elephantImage from "../../assets/animals/elephant.png";
import lionImage from "../../assets/animals/lion.png";
import penguinImage from "../../assets/animals/penguin.png";
import giraffeImage from "../../assets/animals/giraffe.png";
import hippoImage from "../../assets/animals/hippo.png";
import zebraImage from "../../assets/animals/zebra.png";
import leopardImage from "../../assets/animals/leopard.png";
import cowImage from "../../assets/animals/cow.png";
import pigImage from "../../assets/animals/pig.png";
import sheepImage from "../../assets/animals/sheep.png";
import chickenImage from "../../assets/animals/chicken.png";
import horseImage from "../../assets/animals/horse.png";
import goatImage from "../../assets/animals/goat.png";
import alpacaImage from "../../assets/animals/alpaca.png";
import rabbitImage from "../../assets/animals/rabbit.png";
import crocodileImage from "../../assets/animals/crocodile.png";
import frogImage from "../../assets/animals/frog.png";
import duckImage from "../../assets/animals/duck.png";
import swanImage from "../../assets/animals/swan.png";
import heronImage from "../../assets/animals/heron.png";
import catfishImage from "../../assets/animals/catfish.png";
import crabImage from "../../assets/animals/crab.png";
import tunaImage from "../../assets/animals/tuna.png";
import octopusImage from "../../assets/animals/octopus.png";
import whaleImage from "../../assets/animals/whale.png";
import dolphinImage from "../../assets/animals/dolphin.png";
import sharkImage from "../../assets/animals/shark.png";
import hedgehogImage from "../../assets/animals/hedgehog.png";
import mooseImage from "../../assets/animals/moose.png";
import owlImage from "../../assets/animals/owl.png";
import ravenImage from "../../assets/animals/raven.png";
import squirrelImage from "../../assets/animals/squirrel.png";
import wolfImage from "../../assets/animals/wolf.png";
import boarImage from "../../assets/animals/boar.png";
import birdImage from "../../assets/animals/bird.png";
import parrotImage from "../../assets/animals/parrot.png";
import rhinoImage from "../../assets/animals/rhino.png";
import tigerImage from "../../assets/animals/tiger.png";
import ostrichImage from "../../assets/animals/ostrich.png";
import kangarooImage from "../../assets/animals/kangaroo.png";
import koalaImage from "../../assets/animals/koala.png";
import beeImage from "../../assets/animals/bee.png";
import butterflyImage from "../../assets/animals/butterfly.png";
import antImage from "../../assets/animals/ant.png";
import dragonflyImage from "../../assets/animals/dragonfly.png";
import flyImage from "../../assets/animals/fly.png";
import grasshopperImage from "../../assets/animals/grasshopper.png";
import ladybugImage from "../../assets/animals/ladybug.png";

/**
 * Animals with their artwork and localized names.
 * ids, English names and categories match the backend content
 * (smart-elephant-backend/src/main/resources/content/animals).
 */
export const animals: Animal[] = [
  { id: "elephant", name: "Elephant", image: elephantImage, habitat: "savanna", names: { he: "פיל", ru: "Слон", uk: "Слон" } },
  { id: "lion", name: "Lion", image: lionImage, habitat: "savanna", names: { he: "אריה", ru: "Лев", uk: "Лев" } },
  { id: "penguin", name: "Penguin", image: penguinImage, habitat: "cold", names: { he: "פינגווין", ru: "Пингвин", uk: "Пінгвін" } },
  { id: "giraffe", name: "Giraffe", image: giraffeImage, habitat: "savanna", names: { he: "ג׳ירפה", ru: "Жираф", uk: "Жираф" } },
  { id: "hippo", name: "Hippopotamus", image: hippoImage, habitat: "river_lake", names: { he: "היפופוטם", ru: "Бегемот", uk: "Бегемот" } },
  { id: "zebra", name: "Zebra", image: zebraImage, habitat: "savanna", names: { he: "זברה", ru: "Зебра", uk: "Зебра" } },
  { id: "leopard", name: "Leopard", image: leopardImage, habitat: "savanna", names: { he: "נמר", ru: "Леопард", uk: "Леопард" } },
  { id: "cow", name: "Cow", image: cowImage, habitat: "farm", names: { he: "פרה", ru: "Корова", uk: "Корова" } },
  { id: "pig", name: "Pig", image: pigImage, habitat: "farm", names: { he: "חזיר", ru: "Свинья", uk: "Свиня" } },
  { id: "sheep", name: "Sheep", image: sheepImage, habitat: "farm", names: { he: "כבשה", ru: "Овца", uk: "Вівця" } },
  { id: "chicken", name: "Chicken", image: chickenImage, habitat: "farm", names: { he: "תרנגולת", ru: "Курица", uk: "Курка" } },
  { id: "horse", name: "Horse", image: horseImage, habitat: "farm", names: { he: "סוס", ru: "Лошадь", uk: "Кінь" } },
  { id: "goat", name: "Goat", image: goatImage, habitat: "farm", names: { he: "עז", ru: "Коза", uk: "Коза" } },
  { id: "alpaca", name: "Alpaca", image: alpacaImage, habitat: "farm", names: { he: "אלפקה", ru: "Альпака", uk: "Альпака" } },
  { id: "rabbit", name: "Rabbit", image: rabbitImage, habitat: "farm", names: { he: "ארנב", ru: "Кролик", uk: "Кролик" } },
  { id: "crocodile", name: "Crocodile", image: crocodileImage, habitat: "river_lake", names: { he: "תנין", ru: "Крокодил", uk: "Крокодил" } },
  { id: "frog", name: "Frog", image: frogImage, habitat: "river_lake", names: { he: "צפרדע", ru: "Лягушка", uk: "Жаба" } },
  { id: "duck", name: "Duck", image: duckImage, habitat: "river_lake", names: { he: "ברווז", ru: "Утка", uk: "Качка" } },
  { id: "swan", name: "Swan", image: swanImage, habitat: "river_lake", names: { he: "ברבור", ru: "Лебедь", uk: "Лебідь" } },
  { id: "heron", name: "Heron", image: heronImage, habitat: "river_lake", names: { he: "אנפה", ru: "Цапля", uk: "Чапля" } },
  { id: "catfish", name: "Catfish", image: catfishImage, habitat: "river_lake", names: { he: "שפמנון", ru: "Сом", uk: "Сом" } },
  { id: "crab", name: "Crab", image: crabImage, habitat: "sea", names: { he: "סרטן", ru: "Краб", uk: "Краб" } },
  { id: "tuna", name: "Tuna", image: tunaImage, habitat: "sea", names: { he: "טונה", ru: "Тунец", uk: "Тунець" } },
  { id: "octopus", name: "Octopus", image: octopusImage, habitat: "sea", names: { he: "תמנון", ru: "Осьминог", uk: "Восьминіг" } },
  { id: "whale", name: "Whale", image: whaleImage, habitat: "sea", names: { he: "לווייתן", ru: "Кит", uk: "Кит" } },
  { id: "dolphin", name: "Dolphin", image: dolphinImage, habitat: "sea", names: { he: "דולפין", ru: "Дельфин", uk: "Дельфін" } },
  { id: "shark", name: "Shark", image: sharkImage, habitat: "sea", names: { he: "כריש", ru: "Акула", uk: "Акула" } },
  { id: "hedgehog", name: "Hedgehog", image: hedgehogImage, habitat: "forest", names: { he: "קיפוד", ru: "Ёж", uk: "Їжак" } },
  { id: "moose", name: "Moose", image: mooseImage, habitat: "forest", names: { he: "אייל קורא", ru: "Лось", uk: "Лось" } },
  { id: "owl", name: "Owl", image: owlImage, habitat: "forest", names: { he: "ינשוף", ru: "Сова", uk: "Сова" } },
  { id: "raven", name: "Raven", image: ravenImage, habitat: "forest", names: { he: "עורב", ru: "Ворона", uk: "Ворона" } },
  { id: "squirrel", name: "Squirrel", image: squirrelImage, habitat: "forest", names: { he: "סנאי", ru: "Белка", uk: "Білка" } },
  { id: "wolf", name: "Wolf", image: wolfImage, habitat: "forest", names: { he: "זאב", ru: "Волк", uk: "Вовк" } },
  { id: "boar", name: "Boar", image: boarImage, habitat: "forest", names: { he: "חזיר בר", ru: "Кабан", uk: "Кабан" } },
  { id: "bird", name: "Bird", image: birdImage, habitat: "forest", names: { he: "ציפור", ru: "Птичка", uk: "Пташка" } },
  { id: "parrot", name: "Parrot", image: parrotImage, habitat: "jungle", names: { he: "תוכי", ru: "Попугай", uk: "Папуга" } },
  { id: "rhino", name: "Rhino", image: rhinoImage, habitat: "savanna", names: { he: "קרנף", ru: "Носорог", uk: "Носоріг" } },
  { id: "tiger", name: "Tiger", image: tigerImage, habitat: "jungle", names: { he: "טיגריס", ru: "Тигр", uk: "Тигр" } },
  { id: "ostrich", name: "Ostrich", image: ostrichImage, habitat: "savanna", names: { he: "יען", ru: "Страус", uk: "Страус" } },
  { id: "kangaroo", name: "Kangaroo", image: kangarooImage, habitat: "australia", names: { he: "קנגורו", ru: "Кенгуру", uk: "Кенгуру" } },
  { id: "koala", name: "Koala", image: koalaImage, habitat: "australia", names: { he: "קואלה", ru: "Коала", uk: "Коала" } },
  { id: "bee", name: "Bee", image: beeImage, habitat: "garden", names: { he: "דבורה", ru: "Пчела", uk: "Бджола" } },
  { id: "butterfly", name: "Butterfly", image: butterflyImage, habitat: "garden", names: { he: "פרפר", ru: "Бабочка", uk: "Метелик" } },
  { id: "ant", name: "Ant", image: antImage, habitat: "garden", names: { he: "נמלה", ru: "Муравей", uk: "Мураха" } },
  { id: "dragonfly", name: "Dragonfly", image: dragonflyImage, habitat: "garden", names: { he: "שפירית", ru: "Стрекоза", uk: "Бабка" } },
  { id: "fly", name: "Fly", image: flyImage, habitat: "garden", names: { he: "זבוב", ru: "Муха", uk: "Муха" } },
  { id: "grasshopper", name: "Grasshopper", image: grasshopperImage, habitat: "garden", names: { he: "חגב", ru: "Кузнечик", uk: "Коник" } },
  { id: "ladybug", name: "Ladybug", image: ladybugImage, habitat: "garden", names: { he: "פרת משה רבנו", ru: "Божья коровка", uk: "Сонечко" } },
];
