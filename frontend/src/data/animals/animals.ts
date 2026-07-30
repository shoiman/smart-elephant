import type { Animal } from "../../types/animal";
import catfishImage from "../../assets/animal-library/animals/river_lake_6_catfish.jpg";
import crocodileImage from "../../assets/animal-library/animals/river_lake_1_crocodile.jpg";
import duckImage from "../../assets/animal-library/animals/river_lake_3_duck.jpg";
import elephantImage from "../../assets/animal-library/animals/savanna_3_elephant.jpg";
import foalImage from "../../assets/animal-library/animals/farm_5_foal.jpg";
import frogImage from "../../assets/animal-library/animals/river_lake_2_frog.jpg";
import giraffeImage from "../../assets/animal-library/animals/savanna_2_giraffe.jpg";
import goatImage from "../../assets/animal-library/animals/farm_6_goat.jpg";
import heronImage from "../../assets/animal-library/animals/river_lake_5_heron.jpg";
import hippoImage from "../../assets/animal-library/animals/savanna_4_hippo.jpg";
import leopardImage from "../../assets/animal-library/animals/savanna_6_leopard.jpg";
import lionImage from "../../assets/animal-library/animals/savanna_1_lion.jpg";
import pigImage from "../../assets/animal-library/animals/farm_2_pig.jpg";
import sheepImage from "../../assets/animal-library/animals/farm_3_sheep.jpg";
import swanImage from "../../assets/animal-library/animals/river_lake_4_swan.jpg";
import zebraImage from "../../assets/animal-library/animals/savanna_5_zebra.jpg";
import chickenImage from "../../assets/animal-library/animals/farm_4_chicken.jpg";
import cowImage from "../../assets/animal-library/animals/farm_1_cow.jpg";

export const animals: Animal[] = [
  {
    id: "elephant",
    name: "Elephant",
    image: elephantImage,
    habitat: "savanna",
  },
  {
    id: "lion",
    name: "Lion",
    image: lionImage,
    habitat: "savanna",
  },
  {
    id: "giraffe",
    name: "Giraffe",
    image: giraffeImage,
    habitat: "savanna",
  },
  {
    id: "hippo",
    name: "Hippo",
    image: hippoImage,
    habitat: "savanna",
  },
  {
    id: "zebra",
    name: "Zebra",
    image: zebraImage,
    habitat: "savanna",
  },
  {
    id: "leopard",
    name: "Leopard",
    image: leopardImage,
    habitat: "savanna",
  },
  {
    id: "cow",
    name: "Cow",
    image: cowImage,
    habitat: "farm",
  },
  {
    id: "pig",
    name: "Pig",
    image: pigImage,
    habitat: "farm",
  },
  {
    id: "sheep",
    name: "Sheep",
    image: sheepImage,
    habitat: "farm",
  },
  {
    id: "chicken",
    name: "Chicken",
    image: chickenImage,
    habitat: "farm",
  },
  {
    id: "foal",
    name: "Foal",
    image: foalImage,
    habitat: "farm",
  },
  {
    id: "goat",
    name: "Goat",
    image: goatImage,
    habitat: "farm",
  },
  {
    id: "crocodile",
    name: "Crocodile",
    image: crocodileImage,
    habitat: "riverLake",
  },
  {
    id: "frog",
    name: "Frog",
    image: frogImage,
    habitat: "riverLake",
  },
  {
    id: "duck",
    name: "Duck",
    image: duckImage,
    habitat: "riverLake",
  },
  {
    id: "swan",
    name: "Swan",
    image: swanImage,
    habitat: "riverLake",
  },
  {
    id: "heron",
    name: "Heron",
    image: heronImage,
    habitat: "riverLake",
  },
  {
    id: "catfish",
    name: "Catfish",
    image: catfishImage,
    habitat: "riverLake",
  },
];
